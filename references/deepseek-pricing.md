# DeepSeek V4 定价与花费计算（官方）

来源：DeepSeek API 官方文档「模型 & 价格」及 2026-08 调价公告；定价页为
`https://api-docs.deepseek.com/zh-cn/quick_start/pricing`（中文页以人民币计价，与托盘 `¥` 显示一致）。

## 模型

| 模型 id | 显示名 | 上下文 | 最大输出 |
|---|---|---|---|
| `deepseek-v4-flash` | DeepSeek-V4-Flash | 1M | 384K |
| `deepseek-v4-pro` | DeepSeek-V4-Pro | 1M | 384K |

## 现价（2026-08-17 00:00 北京时间之前生效，元 / 1M tokens）

| 模型 | 输入·缓存命中 | 输入·缓存未命中 | 输出 |
|---|---|---|---|
| deepseek-v4-flash | 0.02 | 1 | 2 |
| deepseek-v4-pro | 0.025 | 3 | 6 |

## 新价（2026-08-17 00:00 北京时间起，峰谷定价，元 / 1M tokens）

高峰时段 = **北京时间 9:00–12:00、14:00–18:00**；其余为空闲时段。**空闲价 = 高峰价一半**。

| 模型 | 时段 | 输入·缓存命中 | 输入·缓存未命中 | 输出 |
|---|---|---|---|---|
| deepseek-v4-flash | 空闲 | 0.05 | 1.5 | 4.5 |
| deepseek-v4-flash | 高峰 | 0.10 | 3.0 | 9.0 |
| deepseek-v4-pro | 空闲 | 0.15 | 4.5 | 13.5 |
| deepseek-v4-pro | 高峰 | 0.30 | 9.0 | 27.0 |

## 计费公式（关键：分桶）

`tokenUsage` 投影给出**四个不相交的桶**：

- `uncachedInputTokens` —— 未命中缓存的输入（全价输入）
- `cacheReadTokens` —— 命中缓存的输入（**极低价**，约未命中的 1/30~1/120）
- `cacheWriteTokens` —— 首次写入缓存（按未命中输入价计）
- `outputTokens` —— 输出

```
花费 = uncachedInput/1M × 未命中输入价
     + cacheRead/1M       × 缓存命中价
     + cacheWrite/1M      × 未命中输入价
     + output/1M          × 输出价
```

**缓存命中价远低于未命中价**。把 cacheRead 按未命中价算，会让金额虚高一两个数量级（真实案例：同一会话算出来 ¥153 vs 正确值 ¥2.57）。

## 时段判断

```js
function isPeakHour(date) {
  var h = date.getHours();                 // 本地时间 = 北京时间（UTC+8）
  return (h >= 9 && h < 12) || (h >= 14 && h < 18);
}
```

生效日切换（现价 vs 峰谷新价）：

```js
var PRICE_CHANGE_MS = Date.parse('2026-08-17T00:00:00+08:00');
function currentTier(price, now) {
  if (now.getTime() < PRICE_CHANGE_MS) return { ...price.current, period: '现价' };
  if (isPeakHour(now)) return { ...price.peak, period: '高峰' };
  return { ...price.offpeak, period: '空闲' };
}
```

## Provider 匹配

价格只对 DeepSeek 收（其他 provider 无价目表，只显示模型名）。provider 路由名因部署而异（`deepseek` 原始、`deepseek-official` 官方路由），匹配写成宽松形式：

```js
function isDeepseekProvider(provider) {
  if (!provider) return false;
  return String(provider).toLowerCase().indexOf('deepseek') !== -1;
}
```

## 自动抓取（运行时更新，避免价目过时）

价目不再只依赖写死的表。宿主端（`lib/index.js`）在启动时及每 6 小时从官网中文定价页
抓取并解析，结果缓存在内存里，通过同源路由 `GET /plugins/dsh-task-progress-tray/pricing`
提供给浏览器端：

- 抓取地址：`https://api-docs.deepseek.com/zh-cn/quick_start/pricing`（人民币计价）。
- 解析两张表：现价表（`current`）与峰谷表（`peak` / `offpeak`），以及「新价格将于北京
  时间 … 开始生效」里的生效时间（`changeMs`）。
- 浏览器端启动时 `fetch` 该路由；成功则用返回价目覆盖内置表，失败则回退到本文内置的
  `MODEL_PRICES` 与 `PRICE_CHANGE_MS`，托盘照常工作。
- 浏览器端直接抓官网会被 CORS 拦截（官网响应头没有 `Access-Control-Allow-Origin`），
  所以抓取必须放在 Node 宿主端——这也是这条路由存在的原因。

返回 JSON 形状：

```json
{
  "ok": true,
  "source": "https://api-docs.deepseek.com/zh-cn/quick_start/pricing",
  "currency": "CNY",
  "fetchedAt": "<epoch-ms>",
  "changeMs": "<epoch-ms，北京时间生效时刻>",
  "models": {
    "deepseek-v4-flash": {
      "current": { "cacheHit": 0.02, "cacheMiss": 1, "output": 2 },
      "peak": { "cacheHit": 0.1, "cacheMiss": 3, "output": 9 },
      "offpeak": { "cacheHit": 0.05, "cacheMiss": 1.5, "output": 4.5 }
    },
    "deepseek-v4-pro": {
      "current": { "cacheHit": 0.025, "cacheMiss": 3, "output": 6 },
      "peak": { "cacheHit": 0.3, "cacheMiss": 9, "output": 27 },
      "offpeak": { "cacheHit": 0.15, "cacheMiss": 4.5, "output": 13.5 }
    }
  }
}
```

官网价目一旦变化，宿主下一次刷新（启动时或 6 小时周期内）就会解析到新值，浏览器端
刷新页面后自动使用新价，无需改代码。
```
