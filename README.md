# DeepSeek Harness Task Progress Tray

一个为 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) Web GUI 打造的**右下角实时任务进度托盘** Agent Skill。

## 它能做什么

把这个技能装进你的 agent 后，一句话（"右下角显示任务进度 / token 用量 / 模型花费"）就能生成一个右下角悬浮托盘插件，实时显示当前会话的：

- **任务进度** —— todo 列表逐条列出（完成 / 进行中 / 待办 + 进度条）
- **后台任务** —— 运行中的 job（类型、说明、实时耗时）
- **目标（Goal）** —— 阶段、目标内容、轮次
- **Token 用量** —— 上下文占用率、累计输入/输出、系统/工具/消息构成
- **已花费金额** —— 按 DeepSeek 官方峰谷定价 + 分桶计价自动计算

## 效果预览

> 📷 截图位置已预留：把你截的图分别命名为下面两个文件名，放进 `docs/images/` 目录即可显示（建议 PNG，宽度约 800–1000px）。

**折叠态 —— 右下角悬浮胶囊**

<img width="281" height="87" alt="image" src="https://github.com/user-attachments/assets/4c236c5f-242e-4959-8206-139dd470f333" />


**展开态 —— 完整面板（任务进度 + 模型花费 + Token 用量）**

<img width="485" height="539" alt="5535670356beb8efd88e53cd612ab283" src="https://github.com/user-attachments/assets/36ac9250-e4fe-44e5-9bb9-c413b5c850d2" />


## 目录结构

```
dsh-task-progress-tray/
├── SKILL.md                        # 技能主文档（方法论 + 安装 + 验证 + 常见坑）
├── assets/
│   └── tray-plugin/                # 已验证的完整插件模板
│       ├── package.json
│       └── lib/
│           ├── index.js            # 宿主端（抓取官网价目 + 提供同源定价路由）
│           └── client.js           # 浏览器端 bundle（UI + 数据订阅 + 计价）
└── references/
    ├── api-reference.md            # Slot / Projection / Session 精确 API
    └── deepseek-pricing.md         # DeepSeek V4 官方价目 + 峰谷规则 + 分桶计价
```

## 安装技能

1. 把这个目录（或打包后的 `.skill` 文件）放到你的 skill 目录（如 `~/.agents/skills/`）
2. 之后对 agent 说「右下角显示任务进度 / token 用量 / 模型花费」即可触发

## 插件工作原理简述

DSH 浏览器端是 cordis 插件体系，纯 UI 插件由三部分组成：`package.json` 里的 `dsh.client` 声明 + 宿主 `apply`（抓取官网价目并注册 `/plugins/dsh-task-progress-tray/pricing` 路由）+ 通过 `window.__ModuleLoader__.load` 注册的浏览器 bundle。UI 挂载在全局 `shell.overlay` 槽（右下角浮层），数据来自 `useSessions` 与 `projectionValues`（todos / goal / tokenUsage / contextPressure），模型选择走 `ctx.connection.api.sessions.models`。

详情见 `SKILL.md` 与 `references/`。

## 价格说明

花费按 `references/deepseek-pricing.md` 中的 DeepSeek 官方价目计算，区分缓存命中/未命中、高峰/空闲（峰谷定价），并在价目生效日自动切换。

价目**自动从 DeepSeek 官网抓取**：宿主端在启动时及每 6 小时抓取中文定价页
（`https://api-docs.deepseek.com/zh-cn/quick_start/pricing`，人民币计价）并解析，
浏览器端启动时从同源路由 `/plugins/dsh-task-progress-tray/pricing` 读取；抓取失败时
自动回退到内置价目，托盘不受影响。详见 `references/deepseek-pricing.md`。

### 适用范围：仅 DeepSeek 自家模型

「花费金额」这一项**只能用于 DeepSeek 自己的模型**，原因很直接：

- 价格表 `MODEL_PRICES` 里**只内置了 DeepSeek 的价目**（`deepseek-v4-pro`、`deepseek-v4-flash`），因为只有 DeepSeek 官方公开了可查的定价。
- 判断逻辑是「provider 是否属于 DeepSeek」——只有 provider 名含 `deepseek` 时才去查价并算钱。

因此：

| 场景 | 表现 |
|---|---|
| 当前模型是 DeepSeek（v4-pro / v4-flash） | 显示「本会话已花费 ≈ ¥xx」 |
| 当前模型是其他提供商（OpenAI / Claude / 通义等） | **只显示模型名，不显示花费** |

如果你想让其他模型也算花费，需要在 `assets/tray-plugin/lib/client.js` 的 `MODEL_PRICES` 里补一份对应价目（同样区分缓存命中/未命中、高峰/空闲）。任务进度、Token 用量这两项与模型无关，对所有模型都正常显示。

## License

MIT
