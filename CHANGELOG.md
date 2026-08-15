# 更新日志

本项目的所有重要变更都会记录在此文件中。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [0.1.0] - 2026-08-15

### 新增

- 右下角实时任务进度托盘插件：折叠胶囊 + 展开面板，实时显示当前会话的
  - 任务进度（todo 列表 + 进度条）
  - 后台任务（类型、说明、实时耗时）
  - 目标（Goal）阶段与轮次
  - Token 用量（上下文占用、累计输入/输出、系统/工具/消息构成）
  - 已花费金额（按 DeepSeek 官方峰谷定价计算）
- 宿主端自动抓取定价：启动时及每 6 小时从 DeepSeek 官网中文定价页解析价目，
  通过同源路由 `/plugins/dsh-task-progress-tray/pricing` 提供给浏览器端；抓取失败
  自动回退内置价目，托盘不受影响。

### 修复

- 峰谷时段判定改用北京时间（UTC+8），修复非 UTC+8 时区下高峰/空闲判错的问题。
- `fmtCost` 增加 NaN 防御，token 字段缺失时不再显示 `¥NaN`。

### 变更

- 项目显示名更改为 **DeepSeek Harness Task Progress Tray**（技术标识 `dsh-task-progress-tray` 保持不变）。
