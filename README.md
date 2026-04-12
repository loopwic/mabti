# MABTI

立直麻将人格测试项目，前端使用 `React + Vite + TanStack Router`，主站部署到 `Cloudflare Workers`。

## 运行

```bash
bun install
bun run dev
```

## 构建

```bash
bun run build
```

## Cloudflare 主站

本项目已包含 `wrangler.jsonc`，构建后可直接部署：

```bash
bun run deploy
```

本地 Workers 预览：

```bash
bun run cf:dev
```

## PNG 分享卡

Cloudflare Workers 免费版不适合在 Worker 内部做 `Satori -> Resvg -> PNG` 转换，因此仓库里额外提供了一个 `vercel-og` 子项目，专门负责生成 PNG 分享卡。

当前架构：

- Cloudflare 主站继续提供页面与 `/api/result`
- Vercel 子服务生成 PNG
- Cloudflare 的 `/api/share-image` 代理到 Vercel
- 如果未配置 Vercel 地址，Cloudflare 会回退到本地 SVG 分享卡

### 1. 部署 `vercel-og`

将仓库里的 `vercel-og` 目录作为一个独立 Vercel 项目部署。

Vercel 项目需要设置环境变量：

- `APP_BASE_URL`
  值填你的 Cloudflare 站点根地址，例如 `https://mabti.example.com`

本地开发：

```bash
cd vercel-og
bun install
vercel dev
```

部署后你会得到一个地址，类似：

```text
https://mabti-og.vercel.app/api/share-image
```

### 2. 配置 Cloudflare 环境变量

在 Cloudflare Workers/Pages 里添加环境变量：

- `OG_IMAGE_SERVICE_URL`
  值填上一步的完整 Vercel PNG 接口地址

例如：

```text
OG_IMAGE_SERVICE_URL=https://mabti-og.vercel.app/api/share-image
```

配置完成后重新部署 Cloudflare 主站。
