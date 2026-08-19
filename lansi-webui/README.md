# dsh-lansi-webUI

[English](README.en.md) | 中文

基于 [dsh-maid-whale-webUI](https://github.com/yunxiiQwQ/dsh-maid-whale-webUI/) 改造的「兰斯系列红黑冒险」主题插件：深红主色、米白纸面浅色 / 深红黑深色双模式、兰斯 35 周年群像背景插画（模糊+遮罩）、RPG 风格剑/爱心/火焰装饰，以及左下角常驻粉发 Q 版角色立绘。

## 安装

```powershell
cd dsh-lansi-webUI
dsh plugin --profile web add ./lansi-webui
```

安装后刷新或重启 DeepSeek Harness Web UI。同一时间建议只启用一个界面主题。

## 开发

```powershell
pnpm install
pnpm art:embed
pnpm test
pnpm build
```

插件只使用官方 DSH 客户端插件机制，不修改 DeepSeek Harness 源码，也不影响模型请求。

## 静态资源目录

- `assets/background/rance-35th-group.jpeg` — 全局页面背景插画
- `assets/mascot/rance-mascot.png` — 左下角粉发 Q 版角色立绘（透明背景）
- `assets/ornaments/light|dark/*.svg` — RPG 风格装饰图标（剑形徽章、红色小装饰、剑、爱心、火焰、红色圆点）

资源由 `scripts/embed.mjs` 读取并内联为 base64 数据 URI，生成 `src/client/*-art.generated.ts`，沿用原项目的资源引用方式。

## 致谢

感谢 [dsh-maid-whale-webUI](https://github.com/yunxiiQwQ/dsh-maid-whale-webUI/) 作者（yunxiiQwQ）的项目，本插件在其架构基础上改造完成。

## 许可与声明

代码使用 BSD-3-Clause 许可。本项目是非官方社区主题，素材来源于社区二创，与 DeepSeek 官方无隶属关系。
