# DeepSeek V4 定价与花费计算（官方）

来源：DeepSeek API 官方文档「模型 & 价格」及 2026-08 调价公告。

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
