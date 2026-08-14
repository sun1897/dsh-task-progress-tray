# DSH 客户端托盘插件的精确 API 参考

以下字段/类型来自当前 DSH 实现的真实源码，写代码前按需查证。**不要凭名字猜字段**——这里列的都是实际签过名的。

## Slot：`shell.overlay`

由 `dsh-client-ui-layout` 声明：

- kind: `list`（叠加多条目，按 `priority` 再 `order` 排序）
- scope: `root`（全局）
- 无 owner props；浮层 `position:absolute; inset:0; z-index:20; pointer-events:none`（点击穿透，条目自己 `pointer-events:auto` 接回）

注册方式（组件是纯 `React.createElement`）：

```js
ctx.slots.inject('shell.overlay', function () {
  ctx.slots.register(
    { name: 'shell.overlay', id: 'task-progress-tray', order: 100, label: '任务进度' },
    TrayRoot,
  );
});
```

注册 options 支持：`name`、`id`、`order`、`label`、`locale`、`priority`、`key`、`select`（chain 槽）。

## 全局标准 props（每个槽组件都收到）

root 作用域组件收到 `GlobalStandardProps`：

- `useSessions: SnapshotSelectorHook<SessionListState>` —— `useSessions(sel?, eq?)`
- `useWorkspaces: SnapshotSelectorHook<WorkspaceListState>`

`SnapshotSelectorHook<T> = <S>(sel: (s: T) => S, eq?: (a: S, b: S) => boolean) => S`。默认 `eq` 是 `Object.is`，所以**返回新对象/数组的 selector 会导致每次发布都重渲染**——要么返回稳定引用，要么传自定义 `eq`。

## `SessionListState`（`useSessions` 的切片）

```
{
  ids: SessionId[];
  byId: Record<SessionId, SessionSummary>;
  current: SessionId | undefined;      // 当前选中会话
  phase: SessionListPhase;
  subagentsByParent: ...;
  jobsBySession: Record<SessionId, readonly JobView[]>;  // 后台任务镜像，缺省=无任务
  currentAddress: SubagentAddress | undefined;
}
```

## `SessionSummary`（`byId[id]`）

```
{
  id, title?, displayTitle, cwd?, agentPreset?, parentId?, origin?,
  running: boolean,                          // 会话是否在跑
  pendingInteraction?, completed?, blank,
  updatedAt: number,
  projectionValues?: Partial<SessionProjectionMap>   // ← 所有会话投影都在这里
}
```

## Session 投影 `projectionValues`（关键字段）

| key | 值 | 结构 |
|---|---|---|
| `todos` | `TodoItem[] \| null` | `{ content: string; status: 'pending'\|'in_progress'\|'completed' }`，整表 last-wins |
| `goal` | `GoalProjection \| null` | `{ goal: { id, revision, objective, phase: 'active'\|'paused'\|'blocked'\|'complete', blockedReason?, maxGoalRounds }, roundsStarted, createdAt, updatedAt }` |
| `tokenUsage` | `TokenUsageProjection` | `{ uncachedInputTokens, outputTokens, cacheReadTokens, cacheWriteTokens }`（四桶不相交，reasoning 已含在 output 内）|
| `contextPressure` | `ContextPressureProjection` | `{ pressureTokens?, projectedTokens?, contextWindow? }`。压力=未命中+cache 读写；`projectedTokens` 是下一次请求的估算（占位显示用它）|
| `contextBreakdown` | `ContextBreakdownProjection` | `{ systemTokens, toolsTokens, messageTokens }`（启发式估算，非计费口径）|
| `sessionStats` | — | `{ turns, steps, decodeTokens, ttftMs, ... }` |

`todos` 为 `null` 表示「尚无 todo_write 或已被清除」，UI 要当作空列表 + 显示占位，而不是「隐藏整个区块」。

## 后台任务 `JobView`

```
{ id: JobId; kind: string; label: string;
  status: 'running'|'stopping'|'completed'|'killed'|'failed';
  detail?; startedAt: number; finishedAt?: number }
```

live = `status === 'running' || status === 'stopping'`。计时：`Date.now() - startedAt`，用 `ctx.interval` 每秒 tick。

## 模型选择（异步 RPC，不在投影里）

```js
ctx.connection.api.sessions.models({ sessionId })
// → { result: { ok: true, value: SessionModels } | { ok:false, error } }
// SessionModels = { current: ModelSelection, routable, groups, failures }
// ModelSelection = { provider: string; model: string; reasoningEffort?: string }
```

注意：`ctx.connection` 需要 fiber `inject: ['connection']`。对 subagent 会话此 RPC 会报错，要 try/catch。模型 id 形如 `deepseek-v4-pro`，catalog（`groups[].models[].id/name`）里**没有价格字段**，价格要自己内置表（见 `references/deepseek-pricing.md`）。

## Timer（客户端计时）

客户端 fiber `inject: ['timer']`，然后 `ctx.interval(cb, ms)` / `ctx.timeout(cb, ms)`，返回 disposer。React 里：

```js
React.useEffect(function () {
  return ctx.interval(function () { setNow(Date.now()); }, 1000);
}, []);
```

不要用 `setTimeout/setInterval` 全局（客户端动态包沙箱里没有）。

## 主题 CSS 变量（已在模板中验证）

面板/胶囊配色、进度条、状态色：

- 背景/边框：`--dsw-specific-menu`、`--dsw-alias-bg-base`、`--dsw-alias-border-l1/l2/l3`、`--dsw-shadow-lv3`、`--dsw-alias-fill-l2`
- 文字：`--dsw-alias-label-primary/secondary/tertiary`、`--dsw-font-mono`
- 状态色：`--dsw-alias-state-business-primary`（DeepSeek 蓝）、`--dsw-alias-state-success-primary`（绿）、`--dsw-alias-state-warn-primary`（琥珀）、`--dsw-alias-state-error-primary`（红）、`--dsw-alias-state-business-tertiary`、`--dsw-alias-state-warn-tertiary`、`--dsw-alias-state-warn-label`
- 交互：`--dsw-alias-interactive-bg-hover`

## 客户端 bundle 结构（固定骨架）

```js
window.__ModuleLoader__.load({
  id: '<package-name>',            // 必须 == package.json 的 name
  factory: function (require) {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    var React = require('react');
    // CSS 注入（data-plugin-css 去重）
    // ... 组件 + apply(ctx)
    exports.apply = apply;
    exports.inject = ['slots', 'timer', 'connection'];   // fiber 依赖
    return module.exports;
  },
});
```

所有副作用（含 CSS 注入）必须在 `factory` 闭包内（模块物化时才执行），不能在 bundle 顶层。
