import { renderShareImage } from './og/render-share-image'
import { resultFromSeed } from './state/mabti'

interface AssetFetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
}

interface Env {
  ASSETS: AssetFetcher
  OG_IMAGE_SERVICE_URL?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/robots.txt') {
      return handleRobots(url)
    }

    if (url.pathname === '/sitemap.xml') {
      return handleSitemap(url)
    }

    if (url.pathname === '/api/result') {
      return handleResultApi(request)
    }

    if (url.pathname === '/api/share-image') {
      return handleShareImage(request, env)
    }

    const response = await env.ASSETS.fetch(request)
    return injectSeo(request, response)
  },
}

interface SeoMetadata {
  title: string
  description: string
  robots: string
  canonical: string
  ogTitle: string
  ogDescription: string
  ogUrl: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
}

async function handleResultApi(request: Request) {
  const url = new URL(request.url)
  const seed = getSeed(url)

  if (!seed) {
    return json({ error: 'Missing seed query parameter.' }, 400)
  }

  const result = resultFromSeed(seed)
  if (!result) {
    return json({ error: 'Invalid seed.' }, 400)
  }

  const resultUrl = new URL('/result', request.url)
  resultUrl.searchParams.set('seed', seed)
  const shareImageUrl = new URL('/api/share-image', request.url)
  shareImageUrl.searchParams.set('seed', seed)

  return json(
    {
      result,
      resultUrl: resultUrl.toString(),
      shareImageUrl: shareImageUrl.toString(),
    },
    200,
    {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  )
}

async function handleShareImage(request: Request, env: Env) {
  const url = new URL(request.url)
  const seed = getSeed(url)

  if (!seed) {
    return new Response('Missing seed query parameter.', {
      status: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    })
  }

  const result = resultFromSeed(seed)
  if (!result) {
    return new Response('Invalid seed.', {
      status: 400,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
      },
    })
  }

  const format = url.searchParams.get('format')

  if (format !== 'svg' && env.OG_IMAGE_SERVICE_URL) {
    return proxyShareImage(url, env)
  }

  const image = await renderShareImage(result, {
    assetFetcher: env.ASSETS,
    requestUrl: request.url,
  })

  return new Response(image.svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Disposition': `inline; filename="mabti-${result.typeCode.toLowerCase()}.svg"`,
    },
  })
}

function getSeed(url: URL) {
  const seed = url.searchParams.get('seed')
  return seed && seed.trim().length > 0 ? seed.trim() : null
}

function handleRobots(url: URL) {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    `Sitemap: ${new URL('/sitemap.xml', url.origin).toString()}`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}

function handleSitemap(url: URL) {
  const pages = ['/', '/test']
  const lastmod = new Date().toISOString()
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((path) => {
      const href = new URL(path, url.origin).toString()
      return [
        '  <url>',
        `    <loc>${escapeXml(href)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n')
    }),
    '</urlset>',
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}

async function injectSeo(request: Request, response: Response) {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/html')) {
    return response
  }

  const url = new URL(request.url)
  const seo = getSeoMetadata(url)
  let html = await response.text()

  html = replaceTitle(html, seo.title)
  html = replaceMeta(html, 'description', 'name', 'description', seo.description)
  html = replaceMeta(html, 'robots', 'name', 'robots', seo.robots)
  html = replaceMeta(html, 'og-title', 'property', 'og:title', seo.ogTitle)
  html = replaceMeta(html, 'og-description', 'property', 'og:description', seo.ogDescription)
  html = replaceMeta(html, 'og-url', 'property', 'og:url', seo.ogUrl)
  html = replaceMeta(html, 'og-image', 'property', 'og:image', seo.ogImage)
  html = replaceMeta(html, 'twitter-title', 'name', 'twitter:title', seo.twitterTitle)
  html = replaceMeta(html, 'twitter-description', 'name', 'twitter:description', seo.twitterDescription)
  html = replaceMeta(html, 'twitter-image', 'name', 'twitter:image', seo.twitterImage)
  html = replaceCanonical(html, seo.canonical)

  const headers = new Headers(response.headers)
  headers.set('content-type', 'text/html; charset=utf-8')
  headers.delete('content-length')
  headers.delete('etag')
  headers.set('x-robots-tag', seo.robots)

  return new Response(html, {
    status: response.status,
    headers,
  })
}

function getSeoMetadata(url: URL): SeoMetadata {
  const defaultImage = new URL('/og/default-card.svg', url.origin).toString()

  if (url.pathname === '/test') {
    const canonical = new URL('/test', url.origin).toString()
    return {
      title: '开始测试 | MABTI 立直麻将人格测试',
      description: '通过 24 道题分析你的攻守倾向、稳赌风格、读局能力、节奏控制与牌桌人格。',
      robots: 'index,follow',
      canonical,
      ogTitle: '开始测试 | MABTI 立直麻将人格测试',
      ogDescription: '通过 24 道题分析你的攻守倾向、稳赌风格、读局能力、节奏控制与牌桌人格。',
      ogUrl: canonical,
      ogImage: defaultImage,
      twitterTitle: '开始测试 | MABTI 立直麻将人格测试',
      twitterDescription: '通过 24 道题分析你的攻守倾向、稳赌风格、读局能力、节奏控制与牌桌人格。',
      twitterImage: defaultImage,
    }
  }

  if (url.pathname === '/result') {
    const seed = getSeed(url)
    const result = seed ? resultFromSeed(seed) : null
    const canonical = seed
      ? new URL(`/result?seed=${encodeURIComponent(seed)}`, url.origin).toString()
      : new URL('/result', url.origin).toString()
    const shareImage = seed
      ? new URL(`/api/share-image?seed=${encodeURIComponent(seed)}`, url.origin).toString()
      : defaultImage

    if (result) {
      const title = `${result.title} · ${result.typeCode} | MABTI 结果`
      return {
        title,
        description: result.description,
        robots: 'noindex,follow',
        canonical,
        ogTitle: title,
        ogDescription: result.description,
        ogUrl: canonical,
        ogImage: shareImage,
        twitterTitle: title,
        twitterDescription: result.description,
        twitterImage: shareImage,
      }
    }

    return {
      title: '查看结果 | MABTI 立直麻将人格测试',
      description: '查看你的立直麻将人格结果、类型代码、雷达图与牌桌风格画像。',
      robots: 'noindex,follow',
      canonical,
      ogTitle: '查看结果 | MABTI 立直麻将人格测试',
      ogDescription: '查看你的立直麻将人格结果、类型代码、雷达图与牌桌风格画像。',
      ogUrl: canonical,
      ogImage: defaultImage,
      twitterTitle: '查看结果 | MABTI 立直麻将人格测试',
      twitterDescription: '查看你的立直麻将人格结果、类型代码、雷达图与牌桌风格画像。',
      twitterImage: defaultImage,
    }
  }

  const canonical = new URL('/', url.origin).toString()
  return {
    title: 'MABTI | 立直麻将人格测试',
    description: 'MABTI 是一套以立直麻将桌风为灵感的人格测试，解析你的攻守倾向、读牌风格与牌桌人格画像。',
    robots: 'index,follow',
    canonical,
    ogTitle: 'MABTI | 立直麻将人格测试',
    ogDescription: 'MABTI 是一套以立直麻将桌风为灵感的人格测试，解析你的攻守倾向、读牌风格与牌桌人格画像。',
    ogUrl: canonical,
    ogImage: defaultImage,
    twitterTitle: 'MABTI | 立直麻将人格测试',
    twitterDescription: 'MABTI 是一套以立直麻将桌风为灵感的人格测试，解析你的攻守倾向、读牌风格与牌桌人格画像。',
    twitterImage: defaultImage,
  }
}

function replaceTitle(html: string, title: string) {
  return html.replace(
    /<title[^>]*data-seo="title"[^>]*>[\s\S]*?<\/title>/i,
    `<title data-seo="title">${escapeHtml(title)}</title>`,
  )
}

function replaceMeta(html: string, slot: string, attrName: string, attrValue: string, content: string) {
  const pattern = new RegExp(`<meta[^>]*data-seo="${escapeRegex(slot)}"[^>]*>`, 'i')
  const replacement = `<meta data-seo="${slot}" ${attrName}="${attrValue}" content="${escapeHtml(content)}" />`
  return html.replace(pattern, replacement)
}

function replaceCanonical(html: string, href: string) {
  return html.replace(
    /<link[^>]*data-seo="canonical"[^>]*>/i,
    `<link data-seo="canonical" rel="canonical" href="${escapeHtml(href)}" />`,
  )
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeXml(value: string) {
  return escapeHtml(value)
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function json(payload: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...headers,
    },
  })
}

async function proxyShareImage(url: URL, env: Env) {
  const upstreamUrl = new URL(env.OG_IMAGE_SERVICE_URL!)

  for (const [key, value] of url.searchParams.entries()) {
    upstreamUrl.searchParams.set(key, value)
  }

  const response = await fetch(upstreamUrl, {
    headers: {
      accept: 'image/png,image/*;q=0.8,*/*;q=0.5',
    },
  })
  const body = await response.arrayBuffer()
  const headers = new Headers()
  headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  headers.set('x-mabti-og-upstream', upstreamUrl.origin)

  const contentType = response.headers.get('content-type')
  if (contentType) {
    headers.set('content-type', contentType)
  }

  const contentDisposition = response.headers.get('content-disposition')
  if (contentDisposition) {
    headers.set('content-disposition', contentDisposition)
  }

  return new Response(body, {
    status: response.status,
    headers,
  })
}
