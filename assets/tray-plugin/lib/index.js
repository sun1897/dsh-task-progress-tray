/**
 * Host half of the task-progress tray plugin.
 *
 * The tray UI is a pure browser surface, but its price table should come from
 * DeepSeek's official site. The browser cannot fetch that page directly (the
 * docs site sends no CORS headers), so the host:
 *
 *   1. fetches + parses the official pricing page on startup and every 6 hours,
 *   2. serves the parsed table on a same-origin route that the client bundle
 *      reads via `fetch('/plugins/dsh-task-progress-tray/pricing')`.
 *
 * The client keeps its built-in price table as a fallback, so a failed fetch
 * never breaks the tray.
 */

const PRICING_URL = 'https://api-docs.deepseek.com/zh-cn/quick_start/pricing'
const ROUTE_PATH = '/plugins/dsh-task-progress-tray/pricing'
const REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 20_000

export const inject = ['webServer']

// ---------- HTML parsing helpers ----------

function attrInt(attrs, name, fallback) {
  const m = attrs.match(new RegExp(name + '\\s*=\\s*["\']?(\\d+)', 'i'))
  return m ? parseInt(m[1], 10) : fallback
}

function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#\d+;/g, ' ')
    .replace(/\u0000/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseNumber(text) {
  if (typeof text !== 'string') return null
  const m = text.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)
  return m ? Number(m[0]) : null
}

/** Expand a `<table>` into a 2-D grid of cell text, honouring rowspan/colspan. */
function tableToGrid(tableHtml) {
  const grid = []
  const rowspanLeft = {}
  const rowMatches = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
  for (const rowMatch of rowMatches) {
    const cells = [...rowMatch[1].matchAll(/<(td|th)\b([^>]*)>([\s\S]*?)<\/\1>/gi)]
    const row = []
    let c = 0
    for (const cell of cells) {
      while (rowspanLeft[c]) {
        row[c] = rowspanLeft[c].text
        rowspanLeft[c].count -= 1
        if (rowspanLeft[c].count === 0) delete rowspanLeft[c]
        c += 1
      }
      const colspan = attrInt(cell[2], 'colspan', 1)
      const rowspan = attrInt(cell[2], 'rowspan', 1)
      const text = stripTags(cell[3])
      for (let k = 0; k < colspan; k += 1) row[c + k] = text
      if (rowspan > 1) rowspanLeft[c] = { count: rowspan - 1, text }
      c += colspan
    }
    while (rowspanLeft[c]) {
      row[c] = rowspanLeft[c].text
      rowspanLeft[c].count -= 1
      if (rowspanLeft[c].count === 0) delete rowspanLeft[c]
      c += 1
    }
    grid.push(row)
  }
  return grid
}

function isModelId(text) {
  return /^deepseek-[a-z0-9-]+$/.test(text || '')
}

function isTier(t) {
  return !!(t && typeof t.cacheHit === 'number' && typeof t.cacheMiss === 'number' && typeof t.output === 'number')
}

/** Parse the current pricing table: a single combined table with model columns
 *  and rows grouped by field (缓存命中/未命中/输出) × period (空闲/高峰). */
function parsePricing(html) {
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || []
  const models = {}
  for (const table of tables) {
    const grid = tableToGrid(table)
    let header = null
    const modelCols = []
    for (const row of grid) {
      row.forEach((cell, i) => { if (isModelId(cell)) modelCols.push(i) })
      if (modelCols.length > 0) { header = row; break }
    }
    if (!header) continue

    for (const row of grid) {
      let field = null
      let period = null
      for (const cell of row) {
        const t = cell || ''
        if (t.indexOf('缓存命中') !== -1) field = 'cacheHit'
        else if (t.indexOf('未命中') !== -1) field = 'cacheMiss'
        else if (t.indexOf('输出') !== -1 && t.indexOf('token') !== -1) field = 'output'
        if (t.indexOf('空闲') !== -1) period = 'offpeak'
        else if (t.indexOf('高峰') !== -1) period = 'peak'
      }
      if (!field || !period) continue
      for (const col of modelCols) {
        const id = (header[col] || '').trim()
        const val = parseNumber(row[col])
        if (!id || val === null) continue
        const model = models[id] || (models[id] = {})
        const tier = model[period] || (model[period] = {})
        tier[field] = val
      }
    }
  }

  const result = {}
  for (const id of Object.keys(models)) {
    const m = models[id]
    if (!isTier(m.peak) || !isTier(m.offpeak)) continue
    result[id] = {
      peak: { cacheHit: m.peak.cacheHit, cacheMiss: m.peak.cacheMiss, output: m.peak.output },
      offpeak: { cacheHit: m.offpeak.cacheHit, cacheMiss: m.offpeak.cacheMiss, output: m.offpeak.output },
    }
  }
  if (Object.keys(result).length === 0) {
    throw new Error('no models parsed from pricing page')
  }
  return { models: result }
}

async function fetchHtml(url) {
  if (typeof fetch !== 'function') {
    throw new Error('global fetch unavailable (Node >= 18 required)')
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'user-agent': 'dsh-task-progress-tray/0.1.0 (pricing fetcher)' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

// ---------- plugin entry ----------

export function apply(ctx) {
  let cache = null
  let inflight = null

  function refresh() {
    if (inflight) return inflight
    inflight = (async () => {
      try {
        const html = await fetchHtml(PRICING_URL)
        const parsed = parsePricing(html)
        cache = {
          ok: true,
          source: PRICING_URL,
          currency: 'CNY',
          fetchedAt: Date.now(),
          models: parsed.models,
        }
      } catch (error) {
        ctx.logger.warn(`[dsh-task-progress-tray] pricing refresh failed: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        inflight = null
      }
    })()
    return inflight
  }

  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: ROUTE_PATH,
    handler: async (req, res) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'content-type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ ok: false, error: 'method not allowed' }))
        return
      }
      if (cache === null) await refresh()
      const status = cache === null ? 503 : 200
      const payload = JSON.stringify(cache === null
        ? { ok: false, error: 'pricing unavailable', source: PRICING_URL }
        : cache)
      res.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-cache',
        'content-length': Buffer.byteLength(payload),
      })
      res.end(req.method === 'HEAD' ? undefined : payload)
    },
  }), 'dsh-task-progress-tray: pricing route')

  void refresh()
  const timer = setInterval(function () { refresh() }, REFRESH_INTERVAL_MS)
  ctx.effect(() => () => clearInterval(timer), 'dsh-task-progress-tray: pricing refresh')
}
