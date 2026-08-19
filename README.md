# dsh-lansi-webUI

[English](README.en.md) | 中文

基于 [dsh-maid-whale-webUI](https://github.com/yunxiiQwQ/dsh-maid-whale-webUI/) 改造的「兰斯系列红黑冒险」主题插件，适用于 DeepSeek Harness Web UI。

![主题预览](lansi-webui/assets/background/rance-35th-group.jpeg)

## 功能特性

- **红黑冒险视觉**：深红主色 `#c02a2a`、红边圆角边框、RPG 风格剑/爱心/火焰装饰
- **浅色 / 深色双模式**：米白纸面浅色 + 深红黑深色，跟随 DSH 外观设置（设置 → 通用 → 外观）自动切换
- **全屏背景插画**：兰斯 35 周年群像，固定定位、居中、高斯模糊 + 半透明遮罩
- **左下角常驻角色**：粉发 Q 版立绘（透明背景）
- **工作区红剑徽章**：替换原鲸鱼图标，会话项带红色小装饰

## 目录结构

```
dsh-lansi-webUI/
├── README.md / README.en.md   # 说明文档
├── LICENSE                    # BSD-3-Clause
└── lansi-webui/               # 插件源码（dsh plugin 直接加载此目录）
```

## 安装

```powershell
cd dsh-lansi-webUI
dsh plugin --profile web add ./lansi-webui
```

安装后刷新或重启 DeepSeek Harness Web UI。同一时间建议只启用一个界面主题。

## 开发

```powershell
cd lansi-webui
pnpm install
pnpm art:embed
pnpm test
pnpm build
```

插件只使用官方 DSH 客户端插件机制，不修改 DeepSeek Harness 源码，也不影响模型请求。

## 致谢

感谢 [dsh-maid-whale-webUI](https://github.com/yunxiiQwQ/dsh-maid-whale-webUI/) 作者（yunxiiQwQ）的项目，本插件在其架构基础上改造完成。

## 许可与声明

代码使用 BSD-3-Clause 许可。本项目是非官方社区主题，素材来源于社区二创，与 DeepSeek 官方无隶属关系。
