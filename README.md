# MABTI

立直麻将人格测试项目，使用 `React + Vite + TanStack Router` 构建前端，使用 `Cloudflare Workers` 静态资源模式部署。

## 功能

- 首页介绍 `MABTI` 的设计概念，并提供进入测试入口
- 15 道 MBTI 风格七点量表题目，围绕 5 个立直麻将人格维度
- 结果页包含麻将人格小人、人格解析、雷达图、趣味人格对比和常见人格测试信息模块
- 支持将结果区域导出为 PNG 图片

## 运行

```bash
bun install
bun run dev
```

## 构建

```bash
bun run build
```

## Cloudflare Workers

本项目已包含 `wrangler.jsonc`，构建后可直接部署：

```bash
bun run deploy
```

本地 Workers 预览：

```bash
bun run cf:dev
```
