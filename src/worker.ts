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

    if (url.pathname === '/api/result') {
      return handleResultApi(request)
    }

    if (url.pathname === '/api/share-image') {
      return handleShareImage(request, env)
    }

    return env.ASSETS.fetch(request)
  },
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
