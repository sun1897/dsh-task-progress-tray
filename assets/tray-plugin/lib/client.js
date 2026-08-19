window.__ModuleLoader__.load({
  id: 'dsh-task-progress-tray',
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    var React = require('react');

    var CSS = ".tt_wrap{position:absolute;right:20px;bottom:76px;pointer-events:auto;display:flex;flex-direction:column;align-items:flex-end;gap:8px;z-index:30}.tt_pill{display:flex;align-items:center;gap:8px;max-width:460px;padding:6px 12px;border-radius:999px;background:var(--dsw-specific-menu);border:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-size:12px;line-height:20px;cursor:pointer;user-select:none;position:relative;overflow:hidden}.tt_pill:hover{border-color:var(--dsw-alias-border-l3)}.tt_pill_pct{font-variant-numeric:tabular-nums;font-weight:600;color:var(--dsw-alias-state-business-primary)}.tt_pill_label{color:var(--dsw-alias-label-secondary)}.tt_pill_active{color:var(--dsw-alias-state-business-primary);font-weight:500}.tt_pill_ctx{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-tertiary);border-left:1px solid var(--dsw-alias-border-l2);padding-left:8px;white-space:nowrap}.tt_pill_chev{color:var(--dsw-alias-label-tertiary);display:inline-flex}.tt_pill_bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--dsw-alias-fill-l2)}.tt_pill_bar_fill{height:100%;background:var(--dsw-alias-state-business-primary);transition:width .3s ease}.tt_dot{width:8px;height:8px;border-radius:50%;flex:none;display:inline-block}.tt_dot_live{background:var(--dsw-alias-state-business-primary);animation:tt_pulse 1.4s ease-in-out infinite}.tt_dot_warn{background:var(--dsw-alias-state-warn-primary)}.tt_dot_idle{background:var(--dsw-alias-label-tertiary)}.tt_panel{width:312px;max-height:min(480px,calc(100vh - 120px));overflow-y:auto;border-radius:14px;background:var(--dsw-specific-menu);border:1px solid var(--dsw-alias-border-l2);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);font-size:13px;animation:tt_slide .16s ease-out}.tt_head{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1);position:sticky;top:0;background:var(--dsw-specific-menu);z-index:2}.tt_head_title{font-weight:600;line-height:20px;white-space:nowrap}.tt_head_sub{flex:1;min-width:0;color:var(--dsw-alias-label-tertiary);font-size:11px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;text-align:right}.tt_close{width:24px;height:24px;border:none;background:none;border-radius:6px;color:var(--dsw-alias-label-tertiary);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0;flex:none}.tt_close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.tt_section{padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l1)}.tt_section:last-child{border-bottom:none}.tt_sec_head{display:flex;align-items:center;gap:8px;margin-bottom:8px}.tt_sec_title{font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary);text-transform:uppercase;letter-spacing:.04em}.tt_sec_meta{margin-left:auto;font-size:11px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}.tt_bar{height:6px;border-radius:999px;background:var(--dsw-alias-fill-l2);overflow:hidden;margin-bottom:8px}.tt_bar_fill{height:100%;border-radius:999px;background:var(--dsw-alias-state-business-primary);transition:width .3s ease}.tt_bar_fill_done{background:var(--dsw-alias-state-success-primary)}.tt_todo{display:flex;align-items:flex-start;gap:8px;padding:3px 0;line-height:18px}.tt_todo_icon{flex:none;margin-top:3px;display:inline-flex}.tt_todo_text{min-width:0;flex:1;overflow-wrap:anywhere}.tt_todo_done .tt_todo_text{color:var(--dsw-alias-label-tertiary);text-decoration:line-through}.tt_todo_pending .tt_todo_text{color:var(--dsw-alias-label-secondary)}.tt_todo_num{flex:none;width:16px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;text-align:right}.tt_todo_badge{flex:none;align-self:center;font-size:10px;line-height:16px;border-radius:4px;padding:0 5px;white-space:nowrap}.tt_badge_completed{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}.tt_badge_in_progress{background:var(--dsw-alias-state-business-tertiary);color:var(--dsw-alias-state-business-primary)}.tt_badge_pending{background:var(--dsw-alias-fill-l2);color:var(--dsw-alias-label-tertiary)}.tt_job{display:flex;align-items:center;gap:8px;padding:3px 0}.tt_job_kind{background:var(--dsw-alias-fill-l2);color:var(--dsw-alias-label-secondary);border-radius:5px;padding:0 6px;font-size:11px;line-height:18px;flex:none}.tt_job_label{min-width:0;flex:1;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.tt_job_time{flex:none;color:var(--dsw-alias-label-tertiary);font-family:var(--dsw-font-mono);font-size:11px;font-variant-numeric:tabular-nums}.tt_goal{display:flex;flex-direction:column;gap:6px}.tt_goal_row{display:flex;align-items:center;gap:8px}.tt_chip{background:var(--dsw-alias-state-business-tertiary);color:var(--dsw-alias-state-business-primary);border-radius:5px;padding:0 6px;font-size:11px;line-height:18px;flex:none}.tt_chip_paused{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-label)}.tt_goal_obj{color:var(--dsw-alias-label-secondary);line-height:18px;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.tt_goal_rounds{font-size:11px;color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums}.tt_tok_line{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dsw-alias-label-secondary);line-height:20px;font-variant-numeric:tabular-nums;flex-wrap:wrap}.tt_tok_line b{color:var(--dsw-alias-label-primary);font-weight:600}.tt_cost{color:var(--dsw-alias-state-business-primary)!important;font-weight:700}.tt_empty{color:var(--dsw-alias-label-tertiary);font-size:12px;padding:2px 0}.tt_spin{animation:tt_spin 1s linear infinite}@keyframes tt_spin{to{transform:rotate(360deg)}}@keyframes tt_pulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes tt_slide{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@media (prefers-reduced-motion:reduce){.tt_spin{animation:none}.tt_dot_live{animation:none}.tt_panel{animation:none}}";
    var TAG_ID = 'dsh-task-progress-tray/tray.css';
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(TAG_ID) + ']') === null) {
      var tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-task-progress-tray';
      tag.dataset.pluginCss = TAG_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    var NO_JOBS = [];
    var NO_TODOS = [];
    var GOAL_PHASE_LABELS = { active: '进行中', paused: '已暂停', blocked: '受阻' };
    var STATUS_LABELS = { completed: '完成', in_progress: '进行中', pending: '待办' };

    /** 只有 DeepSeek provider 显示价格，其余 provider 不显示。 */
    function isDeepseekProvider(provider) {
      if (!provider) return false;
      return String(provider).toLowerCase().indexOf('deepseek') !== -1;
    }

    /**
     * DeepSeek V4 官方价目（元 / 1M tokens）：
     *   peak / offpeak —— 峰谷价（高峰 = 北京 9:00-12:00、14:00-18:00）
     *   cacheHit / cacheMiss / output —— 缓存命中输入 / 缓存未命中输入 / 输出
     */
    var MODEL_PRICES = {
      'deepseek-v4-pro': {
        name: 'DeepSeek-V4-Pro',
        peak: { cacheHit: 0.3, cacheMiss: 9, output: 27 },
        offpeak: { cacheHit: 0.15, cacheMiss: 4.5, output: 13.5 },
      },
      'deepseek-v4-flash': {
        name: 'DeepSeek-V4-Flash',
        peak: { cacheHit: 0.1, cacheMiss: 3, output: 9 },
        offpeak: { cacheHit: 0.05, cacheMiss: 1.5, output: 4.5 },
      },
    };

    /** Runtime price source: built-in until the host pricing route supplies fresh data. */
    var PRICING = {
      prices: MODEL_PRICES,
      source: 'built-in',
      fetchedAt: null,
    };

    function modelPricing(provider, modelId) {
      if (!isDeepseekProvider(provider)) return null;
      return PRICING.prices[modelId] || null;
    }

    function isTier(t) {
      return !!(t && typeof t.cacheHit === 'number' && typeof t.cacheMiss === 'number' && typeof t.output === 'number');
    }

    function prettyModelId(id) {
      var s = String(id || '');
      return s.split('-').map(function (part) {
        return part ? part.charAt(0).toUpperCase() + part.slice(1) : part;
      }).join('-');
    }

    /** Apply pricing fetched from the host route; returns true when applied. */
    function applyFetchedPricing(json) {
      if (!json || json.ok !== true || !json.models || typeof json.models !== 'object') return false;
      var models = json.models;
      var prices = {};
      var any = false;
      for (var id in models) {
        var m = models[id];
        if (!m || !isTier(m.peak) || !isTier(m.offpeak)) continue;
        prices[id] = {
          name: (MODEL_PRICES[id] && MODEL_PRICES[id].name) || prettyModelId(id),
          peak: { cacheHit: m.peak.cacheHit, cacheMiss: m.peak.cacheMiss, output: m.peak.output },
          offpeak: { cacheHit: m.offpeak.cacheHit, cacheMiss: m.offpeak.cacheMiss, output: m.offpeak.output },
        };
        any = true;
      }
      if (!any) return false;
      PRICING.prices = prices;
      PRICING.source = typeof json.source === 'string' ? json.source : 'remote';
      PRICING.fetchedAt = typeof json.fetchedAt === 'number' ? json.fetchedAt : null;
      return true;
    }

    /** 高峰时段：北京时间 9:00-12:00、14:00-18:00（UTC+8 固定无夏令时）。 */
    function isPeakHour(date) {
      var h = date.getUTCHours() + 8; // 北京时间 = UTC+8
      if (h >= 24) h -= 24;
      return (h >= 9 && h < 12) || (h >= 14 && h < 18);
    }

    /** 按当前时间解析该模型的计费档（高峰 / 空闲）。 */
    function currentTier(price, now) {
      if (!price) return null;
      if (isPeakHour(now)) return { cacheHit: price.peak.cacheHit, cacheMiss: price.peak.cacheMiss, output: price.peak.output, period: '高峰' };
      return { cacheHit: price.offpeak.cacheHit, cacheMiss: price.offpeak.cacheMiss, output: price.offpeak.output, period: '空闲' };
    }

    /** Normalize a tokenUsage snapshot into four raw counters (u/r/w/o). */
    function usageFields(tu) {
      if (!tu) return null;
      var u = tu.uncachedInputTokens;
      var r = tu.cacheReadTokens;
      var w = tu.cacheWriteTokens;
      var o = tu.outputTokens;
      if (!(u >= 0) || !(r >= 0) || !(w >= 0) || !(o >= 0)) return null;
      return { u: u, r: r, w: w, o: o };
    }

    function zeroFields() {
      return { u: 0, r: 0, w: 0, o: 0 };
    }

    function subFields(end, start) {
      return {
        u: Math.max(0, end.u - start.u),
        r: Math.max(0, end.r - start.r),
        w: Math.max(0, end.w - start.w),
        o: Math.max(0, end.o - start.o),
      };
    }

    function costOfFields(f, tier) {
      if (!f || !tier) return null;
      return f.u / 1000000 * tier.cacheMiss
        + f.r / 1000000 * tier.cacheHit
        + f.w / 1000000 * tier.cacheMiss
        + f.o / 1000000 * tier.output;
    }

    function fmtCostNum(c) {
      if (c === null || !(c >= 0)) return null;
      if (c < 0.01) return '< ¥0.01';
      return '¥' + c.toFixed(2);
    }

    /** Sum per-model segment costs so a later model switch never reprices earlier usage. */
    function totalCost(segs, currentUsage, now) {
      if (!segs || segs.length === 0) return null;
      var nowFields = usageFields(currentUsage);
      var total = 0;
      var counted = false;
      for (var i = 0; i < segs.length; i += 1) {
        var seg = segs[i];
        var end = i === segs.length - 1 ? nowFields : segs[i + 1].start;
        if (!end) continue;
        var tier = currentTier(modelPricing(seg.provider, seg.model), new Date(now));
        var c = costOfFields(subFields(end, seg.start), tier);
        if (c === null) continue;
        total += c;
        counted = true;
      }
      return counted ? total : null;
    }

    function sliceEq(a, b) {
      if (a === b) return true;
      if (a === null || b === null || a.length !== b.length) return false;
      for (var i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    /** Select the current session's live progress facts (stable references → cheap equality). */
    function selectSlice(state) {
      var id = state.current;
      if (id === undefined) return null;
      var row = state.byId[id];
      if (row === undefined) return null;
      var pv = row.projectionValues;
      return [
        id,
        (pv && pv.todos) || NO_TODOS,
        (pv && pv.goal) || null,
        state.jobsBySession[id] || NO_JOBS,
        row.running === true,
        row.displayTitle || '',
        (pv && pv.tokenUsage) || null,
        (pv && pv.contextPressure) || null,
        (pv && pv.contextBreakdown) || null,
      ];
    }

    function isLiveJob(job) {
      return job.status === 'running' || job.status === 'stopping';
    }

    function fmtTokens(n) {
      if (!(n >= 0)) return '0';
      if (n >= 1000000) return (n / 1000000).toFixed(n >= 10000000 ? 0 : 1) + 'M';
      if (n >= 10000) return Math.round(n / 1000) + 'k';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
      return String(n);
    }

    function fmtElapsed(ms) {
      var total = Math.max(0, Math.floor(ms / 1000));
      var s = total % 60;
      var m = Math.floor(total / 60) % 60;
      var h = Math.floor(total / 3600);
      function pad(x) { return (x < 10 ? '0' : '') + x; }
      if (h > 0) return h + ':' + pad(m) + ':' + pad(s);
      return m + ':' + pad(s);
    }

    /** createElement shorthand with children filtering. */
    function h(type, props) {
      var children = [];
      for (var i = 2; i < arguments.length; i += 1) {
        var c = arguments[i];
        if (c === null || c === undefined || c === false) continue;
        children.push(c);
      }
      if (children.length === 0) return React.createElement(type, props);
      return React.createElement(type, props, children);
    }

    function IconCheck() {
      return h('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 8, cy: 8, r: 7, stroke: 'var(--dsw-alias-state-success-primary)', strokeWidth: 2 }),
        h('path', { d: 'M5 8.5l2 2 4-4.5', stroke: 'var(--dsw-alias-state-success-primary)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function IconProgress() {
      return h('svg', { className: 'tt_spin', width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 8, cy: 8, r: 7, stroke: 'var(--dsw-alias-fill-l2)', strokeWidth: 2 }),
        h('path', { d: 'M15 8a7 7 0 0 0-7-7', stroke: 'var(--dsw-alias-state-business-primary)', strokeWidth: 2, strokeLinecap: 'round' }),
      );
    }

    function IconPending() {
      return h('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('circle', { cx: 8, cy: 8, r: 7, stroke: 'var(--dsw-alias-label-tertiary)', strokeWidth: 2 }),
      );
    }

    function IconChevron() {
      return h('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M3.5 10.5L8 6l4.5 4.5', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }),
      );
    }

    function IconClose() {
      return h('svg', { width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M3.5 3.5l9 9M12.5 3.5l-9 9', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' }),
      );
    }

    function TodoIcon(status) {
      if (status === 'completed') return IconCheck();
      if (status === 'in_progress') return IconProgress();
      return IconPending();
    }

    function apply(ctx) {
      function TrayRoot(props) {
        var useSessions = props.useSessions;
        var slice = useSessions(selectSlice, sliceEq);
        var openState = React.useState(false);
        var open = openState[0];
        var setOpen = openState[1];
        var nowState = React.useState(Date.now());
        var now = nowState[0];
        var setNow = nowState[1];
        var lastSessionRef = React.useRef(null);
        var modelState = React.useState(null);
        var modelInfo = modelState[0];
        var setModelInfo = modelState[1];
        var pricingTickState = React.useState(0);
        var setPricingTick = pricingTickState[1];
        var usageRef = React.useRef(null);
        var ledgerRef = React.useRef(null);
        var ledgerSessionRef = React.useRef(null);

        React.useEffect(function () {
          return ctx.interval(function () { setNow(Date.now()); }, 1000);
        }, []);

        var sessionId = slice === null ? null : slice[0];

        // 会话切换时清空花费账本，避免旧会话的分段串到新会话。
        if (ledgerSessionRef.current !== sessionId) {
          ledgerSessionRef.current = sessionId;
          ledgerRef.current = null;
        }

        // 每次渲染后记录最新 token 用量，供模型切换时作为分段边界。
        React.useEffect(function () {
          usageRef.current = usageFields(slice === null ? null : slice[6]);
        });

        React.useEffect(function () {
          if (sessionId === null) return;
          if (lastSessionRef.current !== null && lastSessionRef.current !== sessionId) setOpen(false);
          lastSessionRef.current = sessionId;
        }, [sessionId]);

        // 拉取当前会话的模型选择，并订阅模型目录共享 store，模型切换时即时刷新。
        React.useEffect(function () {
          if (sessionId === null) { setModelInfo(null); return; }
          var cancelled = false;
          var conn = ctx.connection;
          var api = conn && conn.api;

          function applyModel(cur) {
            if (cancelled || !cur) { if (!cancelled) setModelInfo(null); return; }
            var next = { provider: cur.provider, model: cur.model };
            var segs = ledgerRef.current;
            var last = segs && segs.length > 0 ? segs[segs.length - 1] : null;
            if (!last || last.provider !== next.provider || last.model !== next.model) {
              var start = last ? (usageRef.current || zeroFields()) : zeroFields();
              ledgerRef.current = (segs || []).concat([{ provider: next.provider, model: next.model, start: start }]);
            }
            setModelInfo(next);
          }

          // 模型选择 UI（/model 弹层与输入框座位）共用同一个 ModelDirectory store，
          // 订阅它即可在用户手动切换模型后即时更新，无需轮询。
          var stopDir = null;
          var directories = ctx.get('modelDirectories');
          if (directories && directories.directoryFor) {
            try {
              var directory = directories.directoryFor(sessionId);
              if (directory && directory.store && directory.store.subscribe) {
                stopDir = directory.store.subscribe(function () {
                  var snap = directory.store.getSnapshot();
                  var cur = snap && snap.current ? snap.current : null;
                  if (cur) applyModel(cur); // 目录瞬时为空时保留上一次显示
                });
              }
            } catch (e) { /* 拿不到目录则仅用一次性 RPC */ }
          }

          var cleanup = function () {
            cancelled = true;
            if (stopDir) stopDir();
          };

          if (!api || !api.sessions || !api.sessions.models) {
            if (!stopDir) setModelInfo(null);
            return cleanup;
          }

          // 首次仍走 session.models：无论目录 store 是否已预热，都以宿主为准。
          api.sessions.models({ sessionId: sessionId }).then(function (res) {
            if (cancelled) return;
            var v = res && res.result && res.result.ok ? res.result.value : null;
            var cur = v && v.current ? v.current : null;
            applyModel(cur);
          }).catch(function () { if (!cancelled) setModelInfo(null); });

          return cleanup;
        }, [sessionId]);

        // 启动时从宿主定价路由拉取官网价格；失败则继续用内置价目兜底。
        React.useEffect(function () {
          var f = typeof window !== 'undefined' ? window.fetch : null;
          if (typeof f !== 'function') return;
          var cancelled = false;
          f('/plugins/dsh-task-progress-tray/pricing', { cache: 'no-store' })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(function (json) {
              if (cancelled) return;
              if (applyFetchedPricing(json)) setPricingTick(function (t) { return t + 1; });
            })
            .catch(function () { /* 保留内置价目 */ });
          return function () { cancelled = true; };
        }, []);

        if (slice === null) return null;

        var todos = slice[1];
        var goal = slice[2];
        var jobs = slice[3];
        var running = slice[4];
        var title = slice[5];
        var usage = slice[6];
        var pressure = slice[7];
        var breakdown = slice[8];

        var liveJobs = jobs.filter(isLiveJob);
        var goalActive = !!(goal && goal.goal && goal.goal.phase !== 'complete');
        var done = 0;
        var activeCount = 0;
        for (var i = 0; i < todos.length; i += 1) {
          var st = todos[i].status;
          if (st === 'completed') done += 1;
          else if (st === 'in_progress') activeCount += 1;
        }
        var pct = todos.length > 0 ? Math.round(done / todos.length * 100) : 0;

        var contextWindow = pressure ? pressure.contextWindow : undefined;
        var projected = pressure ? (pressure.projectedTokens != null ? pressure.projectedTokens : pressure.pressureTokens) : undefined;
        var ctxPct = contextWindow > 0 && projected != null ? Math.min(100, Math.round(projected / contextWindow * 100)) : null;

        var usageIn = usage ? usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens : null;
        var usageOut = usage ? usage.outputTokens : null;
        var hasBreakdown = !!(breakdown && (breakdown.systemTokens > 0 || breakdown.toolsTokens > 0 || breakdown.messageTokens > 0));

        var pillChildren = [];
        if (todos.length > 0) {
          pillChildren.push(h('span', { className: 'tt_pill_pct' }, pct + '%'));
          pillChildren.push(h('span', { className: 'tt_pill_label' }, done + '/' + todos.length));
          if (activeCount > 0) pillChildren.push(h('span', { className: 'tt_pill_active' }, activeCount + ' 进行中'));
        } else if (liveJobs.length > 0) {
          pillChildren.push(h('span', { className: 'tt_dot tt_dot_live' }));
          pillChildren.push(h('span', null, liveJobs.length + ' 个后台任务'));
        } else if (running) {
          pillChildren.push(h('span', { className: 'tt_dot tt_dot_live' }));
          pillChildren.push(h('span', null, '正在工作…'));
        } else {
          pillChildren.push(h('span', { className: 'tt_dot tt_dot_idle' }));
          pillChildren.push(h('span', null, '空闲'));
        }
        if (ctxPct !== null) {
          pillChildren.push(h('span', { className: 'tt_pill_ctx', title: '上下文 ' + fmtTokens(projected) + ' / ' + fmtTokens(contextWindow) + ' tokens' }, '上下文 ' + ctxPct + '%'));
        }
        pillChildren.push(h('span', { className: 'tt_pill_chev' }, IconChevron()));

        var pill = h('button', { type: 'button', className: 'tt_pill', onClick: function () { setOpen(true); }, title: '展开任务进度' },
          pillChildren,
          todos.length > 0 ? h('span', { className: 'tt_pill_bar' }, h('span', { className: 'tt_pill_bar_fill', style: { width: pct + '%' } })) : null,
        );

        if (!open) return h('div', { className: 'tt_wrap' }, pill);

        var sections = [];

        var rows = [];
        if (todos.length > 0) {
          var shown = todos.slice(0, 8);
          for (var t = 0; t < shown.length; t += 1) {
            var item = shown[t];
            var cls = 'tt_todo' + (item.status === 'completed' ? ' tt_todo_done' : item.status === 'pending' ? ' tt_todo_pending' : '');
            rows.push(h('div', { className: cls, key: 't' + t },
              h('span', { className: 'tt_todo_num' }, (t + 1) + '.'),
              h('span', { className: 'tt_todo_icon' }, TodoIcon(item.status)),
              h('span', { className: 'tt_todo_text', title: item.content }, item.content),
              h('span', { className: 'tt_todo_badge tt_badge_' + item.status }, STATUS_LABELS[item.status] || item.status),
            ));
          }
          if (todos.length > 8) rows.push(h('div', { className: 'tt_empty', key: 'more' }, '… 还有 ' + (todos.length - 8) + ' 项'));
        } else {
          rows.push(h('div', { className: 'tt_empty', key: 'empty' }, '暂无进行中的任务'));
        }
        sections.push(h('div', { className: 'tt_section', key: 'todos' },
          h('div', { className: 'tt_sec_head' },
            h('span', { className: 'tt_sec_title' }, '任务'),
            todos.length > 0 ? h('span', { className: 'tt_sec_meta' }, done + '/' + todos.length + ' 已完成') : null,
          ),
          todos.length > 0 ? h('div', { className: 'tt_bar' }, h('div', { className: 'tt_bar_fill' + (pct === 100 ? ' tt_bar_fill_done' : ''), style: { width: pct + '%' } })) : null,
          rows,
        ));

        if (liveJobs.length > 0) {
          var jobRows = [];
          var shownJobs = liveJobs.slice(0, 4);
          for (var j = 0; j < shownJobs.length; j += 1) {
            var job = shownJobs[j];
            jobRows.push(h('div', { className: 'tt_job', key: 'j' + job.id },
              h('span', { className: 'tt_dot ' + (job.status === 'stopping' ? 'tt_dot_warn' : 'tt_dot_live') }),
              h('span', { className: 'tt_job_kind' }, job.kind),
              h('span', { className: 'tt_job_label', title: job.label }, job.label),
              h('span', { className: 'tt_job_time' }, fmtElapsed(now - job.startedAt)),
            ));
          }
          if (liveJobs.length > 4) jobRows.push(h('div', { className: 'tt_empty', key: 'more' }, '… 还有 ' + (liveJobs.length - 4) + ' 个'));
          sections.push(h('div', { className: 'tt_section', key: 'jobs' },
            h('div', { className: 'tt_sec_head' },
              h('span', { className: 'tt_sec_title' }, '后台任务'),
              h('span', { className: 'tt_sec_meta' }, liveJobs.length + ' 个运行中'),
            ),
            jobRows,
          ));
        }

        if (goalActive) {
          var g = goal.goal;
          var chipCls = 'tt_chip' + (g.phase === 'paused' || g.phase === 'blocked' ? ' tt_chip_paused' : '');
          sections.push(h('div', { className: 'tt_section', key: 'goal' },
            h('div', { className: 'tt_goal' },
              h('div', { className: 'tt_goal_row' },
                h('span', { className: chipCls }, GOAL_PHASE_LABELS[g.phase] || g.phase),
                h('span', { className: 'tt_goal_rounds' }, '第 ' + goal.roundsStarted + '/' + g.maxGoalRounds + ' 轮'),
              ),
              h('div', { className: 'tt_goal_obj', title: g.objective }, g.objective),
              g.phase === 'blocked' && g.blockedReason ? h('div', { className: 'tt_empty' }, g.blockedReason.message) : null,
            ),
          ));
        }

        if (modelInfo) {
          var price = modelPricing(modelInfo.provider, modelInfo.model);
          var tier = currentTier(price, new Date(now));
          var cost = fmtCostNum(totalCost(ledgerRef.current, usage, now));
          var mRows = [];
          mRows.push(h('div', { className: 'tt_tok_line', key: 'mname' },
            '当前模型 ', h('b', null, (price && price.name) || modelInfo.model)));
          if (cost) {
            mRows.push(h('div', { className: 'tt_tok_line', key: 'mcost' },
              '本会话已花费 ≈ ',
              h('b', { className: 'tt_cost' }, cost),
              h('span', { className: 'tt_sec_meta' }, tier ? tier.period : ''),
            ));
          }
          sections.push(h('div', { className: 'tt_section', key: 'model' },
            h('div', { className: 'tt_sec_head' }, h('span', { className: 'tt_sec_title' }, '模型')),
            mRows,
          ));
        }

        if (ctxPct !== null || usageIn !== null) {
          var tokRows = [];
          if (ctxPct !== null) {
            tokRows.push(h('div', { key: 'ctx' },
              h('div', { className: 'tt_bar' }, h('div', { className: 'tt_bar_fill', style: { width: ctxPct + '%' } })),
              h('div', { className: 'tt_tok_line' }, '上下文 ', h('b', null, fmtTokens(projected) + ' / ' + fmtTokens(contextWindow)), ' · ' + ctxPct + '%'),
            ));
          }
          if (usageIn !== null) {
            tokRows.push(h('div', { className: 'tt_tok_line', key: 'usage' },
              '累计 输入 ', h('b', null, fmtTokens(usageIn)),
              ' · 输出 ', h('b', null, fmtTokens(usageOut)),
            ));
          }
          if (hasBreakdown) {
            tokRows.push(h('div', { className: 'tt_tok_line', key: 'bd' },
              '构成 系统 ', h('b', null, fmtTokens(breakdown.systemTokens)),
              ' · 工具 ', h('b', null, fmtTokens(breakdown.toolsTokens)),
              ' · 消息 ', h('b', null, fmtTokens(breakdown.messageTokens)),
            ));
          }
          sections.push(h('div', { className: 'tt_section', key: 'tokens' },
            h('div', { className: 'tt_sec_head' }, h('span', { className: 'tt_sec_title' }, 'Token 用量')),
            tokRows,
          ));
        }

        if (sections.length === 0) {
          sections.push(h('div', { className: 'tt_section', key: 'empty' },
            h('div', { className: 'tt_empty' }, '当前没有进行中的任务'),
          ));
        }

        return h('div', { className: 'tt_wrap' },
          h('div', { className: 'tt_panel', role: 'dialog', 'aria-label': '任务进度' },
            h('div', { className: 'tt_head' },
              h('span', { className: 'tt_head_title' }, '任务进度'),
              h('button', { type: 'button', className: 'tt_close', onClick: function () { setOpen(false); }, 'aria-label': '收起' }, IconClose()),
            ),
            sections,
          ),
        );
      }

      ctx.slots.inject('shell.overlay', function () {
        ctx.slots.register(
          { name: 'shell.overlay', id: 'task-progress-tray', order: 100, label: '任务进度' },
          TrayRoot,
        );
      });
    }

    exports.apply = apply;
    exports.inject = ['slots', 'timer', 'connection'];
    return module.exports;
  },
});
