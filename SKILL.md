---
name: dsh-task-progress-tray
description: "为 DeepSeek Harness (DSH) Web GUI 创建右下角实时悬浮托盘/浮层插件：显示当前会话的任务进度（todo 列表）、Token 用量（上下文占用、累计输入/输出）、以及按 DeepSeek 官方峰谷价格计算的模型花费。TRIGGER when：用户想在 DSH/DeepSeek Harness 网页里加右下角托盘、悬浮窗、浮动面板、widget；要求「右下角显示任务进度」「显示 token 用量」「显示模型花费/花多少钱」「做一个浮层插件」「进度 HUD」；或提到 shell.overlay、dsh.client、cordis 客户端插件、window.__ModuleLoader__。SKIP：普通 DSH 主机侧工具/服务、非浏览器 UI、与 DSH 无关的前端页面。"
---

# 创建 DSH 右下角任务进度托盘插件

本技能教你给 DeepSeek Harness（`dsh`）的 Web GUI 做一个**右下角实时悬浮托盘**：折叠成一个小胶囊，点开是完整面板，实时显示当前会话的 —— 任务进度（todo 列表）、后台任务、目标（goal）阶段、Token 用量、以及按 DeepSeek 官方峰谷定价计算的**已花费金额**。

模板代码是**已验证可用**的成品，放在 `assets/tray-plugin/`。直接复制 + 改几个定制点即可，无需从零写。

## 这套插件是怎么工作的（先建立心智模型）

DSH 的浏览器界面是 cordis 插件体系。一个纯 UI 的客户端插件由三部分组成：

1. **package.json** 里声明 `dsh.client`（`{ platform: "web", inject: [] }`），并 `exports["./client"]` 指向客户端 bundle。
2. **宿主侧** `lib/index.js`：一个空的 `apply()`。纯浏览器界面的插件，宿主端没有行为，空 apply 只是让它成为一个合法的 Loader 条目。
3. **客户端 bundle** `lib/client.js`：用 `window.__ModuleLoader__.load({ id, factory })` 注册。bundle 里 `require('react')` 拿到 React，导出 `apply(ctx)` 和 `inject`（fiber 依赖表）。

**UI 挂载点用 `shell.overlay` 槽**：它是全局 `list` 型 `root` 作用域浮层，覆盖整个窗口、默认点击穿透（pointer-events:none），专门用于放 badge/胶囊/浮窗。注册一个带 `id` 的条目即可叠加，不会覆盖已有元素。你的组件渲染一个 `position:absolute; right:20px; bottom:76px; pointer-events:auto` 的容器，就落在右下角。

为什么要记住这些：DOM 里**没有** `.tt_wrap` 定位容器时，折叠的胶囊会跑到浮层左上角——这是最容易踩的坑（曾真实发生）。

## 数据从哪来（关键 API，写代码前务必确认）

模板里全部用好并验证过，直接抄，但要知道为什么：

| 需求 | 来源 | 怎么读 |
|---|---|---|
| 当前会话 id / 是否运行 / 标题 | `useSessions` 全局标准 prop（每个槽组件都有） | `state.current` / `state.byId[id].running` / `.displayTitle` |
| todo 列表（任务进度） | 会话投影 | `state.byId[id].projectionValues.todos` → `TodoItem[]`（status: pending/in_progress/completed）|
| 目标阶段 | 会话投影 | `projectionValues.goal` → `{ goal: {phase, objective, maxGoalRounds}, roundsStarted }` |
| 后台任务 | `useSessions` | `state.jobsBySession[id]` → `{status, kind, label, startedAt}` |
| Token 用量（4 桶） | 会话投影 | `projectionValues.tokenUsage` → `{uncachedInputTokens, cacheReadTokens, cacheWriteTokens, outputTokens}` |
| 上下文占用 | 会话投影 | `projectionValues.contextPressure` → `{pressureTokens, projectedTokens, contextWindow}` |
| 当前模型 | 异步 RPC（不是投影） | `ctx.connection.api.sessions.models({sessionId})` → `result.value.current` = `{provider, model}` |

`useSessions(selector, eq)` 是 zustand 式 `SnapshotSelectorHook`。**必须给稳定的切片 + 相等函数**，否则每次 store 发布都新建数组导致疯狂重渲染。模板里 `selectSlice` 返回「由稳定引用组成的数组」+ `sliceEq` 逐项 `===`，就是这个目的。

投影值都在 `projectionValues` 上（`SessionSummary.projectionValues`），所以 root 作用域的浮层**不需要** session-scope 钩子，直接从列表 store 读当前会话即可。

完整、精确的字段/类型清单见 `references/api-reference.md`。

## 算钱（DeepSeek 峰谷定价 + 分桶计价）

这是最容易算错的部分，先读 `references/deepseek-pricing.md` 再动手。核心规则：

- **必须分桶**：`uncachedInputTokens`（未命中输入）、`cacheReadTokens`（缓存命中，单价约是未命中的 1/30~1/120）、`cacheWriteTokens`、`outputTokens` 各用各的单价。**把缓存命中 token 也按未命中价算会让金额虚高一两个数量级**——这是本技能诞生过程中踩过的真实坑。
- **峰谷**：高峰时段 = 北京时间 9:00-12:00、14:00-18:00；空闲价 = 高峰价一半。新价有生效日（2026-08-17），生效前用「现价」表，模板里 `PRICE_CHANGE_MS` 自动切换。
- **只有 DeepSeek provider 显示价格**，其他 provider 只显示模型名不显示金额。provider 匹配要宽松（含 "deepseek" 即算，因为不同部署的 provider 路由名不同：`deepseek` / `deepseek-official`）。

## 安装（无需重启服务器，热加载）

目标环境：`$DSH_HOME/profiles/web`（`$DSH_HOME` 默认 `~/.dsh`）。

1. 把 `assets/tray-plugin/` 整目录复制为 `$DSH_HOME/profiles/node_modules/dsh-task-progress-tray/`。这个 `profiles/node_modules` 是 Node 逐级向上查找会命中的回退目录，**不需要跑 package manager**（离线环境 pnpm 常常装不上）。
2. 在 `$DSH_HOME/profiles/web/cordis.patch.yml` 里追加一行 insert 注册条目：

   ```yaml
   - insert:
       - id: task-progress-tray
         name: dsh-task-progress-tray
   ```

3. 保存后**运行中的服务器会自动热应用这个 patch**（DSH 的 `watchUserPatches` 监听该文件），loader 添加条目、客户端模块扫描到 `dsh.client`，几秒内生效 —— 不必重启 `dsh web`。
4. 浏览器**刷新一次页面（F5）**让新条目进入启动图。

改插件代码（`lib/client.js` / `index.js` / `package.json`）也会被热更新链感知（node 侧轮询 bundle 文件、SSE 广播 `rebuilt`），通常刷新即可，无需重启。

## 验证（不靠"应该没问题"）

每次改动后，按可信度从高到低：

1. **语法**：`node --check lib/client.js`。
2. **服务端已接入**：`GET http://127.0.0.1:3080/plugins/dsh-task-progress-tray/client.js` 应返回 200 + 你的 bundle 内容（说明 patch 已热应用）。
3. **真实渲染**（推荐，确定 UI 真的出来）：用无头 Edge 的 CDP 验证。要点——先 `Page.navigate` 加载应用；浏览器会话选择持久化在 `localStorage['dsh.sessions.current']`（形状 `{"sessionId":"..."}`），用 `Runtime.evaluate` 写入后 `location.reload()` 再等待，即可让托盘定位到有数据的会话；再 `document.querySelector('.tt_pill')` 检查胶囊、点击 `document.querySelector('.tt_pill').click()` 展开面板、读 `document.querySelector('.tt_panel').textContent` 核对内容。

模板里最关键的几个 selector：`.tt_pill`（折叠胶囊）、`.tt_panel`（展开面板）、`.tt_cost`（花费金额）、`.tt_todo`（单条任务）。

## 定制点（改这些就行，框架别动）

模板 `assets/tray-plugin/` 里：

- **位置**：`client.js` 顶部 CSS 的 `.tt_wrap{...right:20px;bottom:76px...}`——改 `bottom` 即上下移动，避开底部输入框。
- **价格表**：`client.js` 里的 `MODEL_PRICES` 和 `PRICE_CHANGE_MS`、`CACHE_HIT_RATIO` 比例（当前模板已内联官方数字）。
- **文案/语言**：组件里的中文字符串（"任务进度"、"暂无进行中的任务"、"本会话已花费"等）。
- **显示哪几块**：删掉对应 `sections.push(...)` 即可（任务 / 目标 / 后台任务 / 模型花费 / Token 用量）。
- **始终显示 vs 自动隐藏**：模板默认「始终显示」（空闲显示"空闲"、面板空显示占位）。若想无内容时隐藏，在组件里加 `if (无任何活动) return null`，但记住 `if (slice === null) return null` 这个早退**必须在所有 hooks 之后**，否则 hook 数量在不同分支间变化会报 "Rendered fewer hooks"。

## 常见坑（都真实踩过）

- **hooks 顺序**：所有 `useState/useEffect/useRef` 必须在任何 `return null` 早退之前无条件调用。要用 `sessionId` 的地方先 `var sessionId = slice === null ? null : slice[0]` 再传给 effect。
- **缓存命中价**：见「算钱」，别把 cacheRead 当 cacheMiss。
- **provider 名**：`deepseek` vs `deepseek-official` 因部署而异，匹配写成「含 deepseek」。
- **定位容器**：折叠态也要包在 `.tt_wrap` 里返回，否则胶囊落左上角。
- **bundle 里没有 import/JSX/TS**：客户端 bundle 是纯函数 + `React.createElement`；`require('react')` 可用，`window.__ModuleLoader__` 是唯一入口。
- **不要用全局 setTimeout/setInterval**：客户端用 fiber `inject: ['timer']` + `ctx.interval(cb, ms)`（返回 disposer，`useEffect` 里直接 `return ctx.interval(...)`）。

## 参考文件

- `references/api-reference.md` —— 精确的 Slot / Projection / Session 类型与字段（写代码前查）
- `references/deepseek-pricing.md` —— DeepSeek V4 官方完整价目 + 峰谷规则 + 分桶计价公式
- `assets/tray-plugin/` —— 已验证的完整插件模板（`package.json` + `lib/index.js` + `lib/client.js`）
