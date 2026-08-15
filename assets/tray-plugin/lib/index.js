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

/** Return 'cacheHit' | 'cacheMiss' | 'output' for a price row, else null. */
function priceFieldOf(row) {
  for (const cell of row) {
    const t = cell || ''
    if (t.indexOf('缓存命中') !== -1) return 'cacheHit'
    if (t.indexOf('未命中') !== -1) return 'cacheMiss'
    if (t.indexOf('输出') !== -1 && t.indexOf('token') !== -1) return 'output'
  }
  return null
}

/** Parse the "current price" table (model columns × price rows). */
function parseCurrentTable(grids) {
  for (const grid of grids) {
    const header = grid.find(row => row.some(cell => isModelId(cell)))
    if (!header) continue
    const modelCols = []
    header.forEach((cell, i) => { if (isModelId(cell)) modelCols.push(i) })
    if (modelCols.length === 0) continue

    const result = {}
    for (const row of grid) {
      const field = priceFieldOf(row)
      if (!field) continue
      for (const col of modelCols) {
        const id = (header[col] || '').trim()
        const val = parseNumber(row[col])
        if (id && val !== null) {
          result[id] = result[id] || {}
          result[id][field] = val
        }
      }
    }
    if (Object.keys(result).length > 0) return result
  }
  return null
}

/** Parse the peak / off-peak pricing table. */
function parsePeakOffpeakTable(grids) {
  for (const grid of grids) {
    let hitCol = -1
    let missCol = -1
    let outCol = -1
    let header = null
    for (const row of grid) {
      let h = -1
      let m = -1
      let o = -1
      row.forEach((cell, i) => {
        const t = cell || ''
        if (t.indexOf('缓存命中') !== -1) h = i
        else if (t.indexOf('未命中') !== -1) m = i
        else if (t.indexOf('输出') !== -1 && t.indexOf('token') !== -1) o = i
      })
      if (h !== -1 && m !== -1 && o !== -1) {
        header = row
        hitCol = h
        missCol = m
        outCol = o
        break
      }
    }
    if (!header) continue

    const result = {}
    for (const row of grid) {
      if (row === header) continue
      let modelId = null
      let period = null
      for (const cell of row) {
        const t = cell || ''
        if (isModelId(t)) modelId = t
        else if (t.indexOf('空闲') !== -1) period = 'offpeak'
        else if (t.indexOf('高峰') !== -1) period = 'peak'
      }
      if (!modelId || !period) continue
      const cacheHit = parseNumber(row[hitCol])
      const cacheMiss = parseNumber(row[missCol])
      const output = parseNumber(row[outCol])
      if (cacheHit === null || cacheMiss === null || output === null) continue
      result[modelId] = result[modelId] || {}
      result[modelId][period] = { cacheHit, cacheMiss, output }
    }
    if (Object.keys(result).length > 0) return result
  }
  return null
}

/** Parse the effective date of the peak/off-peak pricing, e.g. "2026 年 8 月 17 日 00:00 开始生效". */
function parseChangeMs(html) {
  const m = html.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(\d{1,2}):(\d{2})\s*开始生效/)
  if (!m) return null
  const pad = n => String(n).padStart(2, '0')
  return Date.parse(`${m[1]}-${pad(m[2])}-${pad(m[3])}T${pad(m[4])}:${pad(m[5])}:00+08:00`)
}

function isTier(t) {
  return !!(t && typeof t.cacheHit === 'number' && typeof t.cacheMiss === 'number' && typeof t.output === 'number')
}

function parsePricing(html) {
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || []
  const grids = tables.map(tableToGrid)
  const current = parseCurrentTable(grids)
  const peakOffpeak = parsePeakOffpeakTable(grids)
  const changeMs = parseChangeMs(html)

  const ids = new Set([...Object.keys(current || {}), ...Object.keys(peakOffpeak || {})])
  const models = {}
  for (const id of ids) {
    const cur = (current && current[id]) || null
    const po = (peakOffpeak && peakOffpeak[id]) || null
    if (!isTier(cur) || !po || !isTier(po.peak) || !isTier(po.offpeak)) continue
    models[id] = {
      current: { cacheHit: cur.cacheHit, cacheMiss: cur.cacheMiss, output: cur.output },
      peak: { cacheHit: po.peak.cacheHit, cacheMiss: po.peak.cacheMiss, output: po.peak.output },
      offpeak: { cacheHit: po.offpeak.cacheHit, cacheMiss: po.offpeak.cacheMiss, output: po.offpeak.output },
    }
  }
  if (Object.keys(models).length === 0) {
    throw new Error('no models parsed from pricing page')
  }
  return { models, changeMs }
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
          changeMs: parsed.changeMs,
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
