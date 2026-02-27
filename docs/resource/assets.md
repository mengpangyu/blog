---
title: 静态资源（图片等）约定
---

# 静态资源（图片等）约定

VitePress 推荐将静态资源放在 `docs/public/` 下，然后用站点根路径（`/`）做绝对引用。

## 本项目约定

- 统一放在：`docs/public/assets/<module>/...`
- 文档引用：`/assets/<module>/...`

模块列表：

- `fe/`
- `ai/`
- `interview/`
- `project/`
- `resource/`

## 示例

```md
![示例](/assets/fe/example.png)

<img src="/assets/interview/example.png" alt="示例" width="640" />
```

## 命名建议

- 目录按主题分层：`/assets/fe/css/`、`/assets/fe/js/`、`/assets/interview/net/`
- 文件用 kebab-case：`stacking-context.png`
- 避免 `image1.png` 这类无语义命名
