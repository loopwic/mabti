import { Resvg, initWasm as initResvg } from '@resvg/resvg-wasm'
import satori, { init as initSatori } from 'satori/standalone'
import type { MabtiResult } from '../state/mabti'
import { ShareCard } from './share-card'

const SHARE_IMAGE_WIDTH = 1200
const SHARE_IMAGE_HEIGHT = 630
const SHARE_FONT_FAMILY = 'Noto Sans SC'
const SHARE_FONT_ASSETS = {
  400: '/og/noto-sans-sc-400.woff',
  700: '/og/noto-sans-sc-700.woff',
} as const
const SHARE_WASM_ASSETS = {
  resvg: '/og/resvg.wasm',
  yoga: '/og/yoga.wasm',
} as const

let rendererInitPromise: Promise<void> | undefined
const binaryAssetCache = new Map<string, Promise<ArrayBuffer>>()

interface AssetFetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
}

interface RenderShareImageOptions {
  assetFetcher: AssetFetcher
  requestUrl: string
}

export async function renderShareImage(result: MabtiResult, options: RenderShareImageOptions) {
  await ensureRenderersReady(options)
  const [font400, font700] = await Promise.all([
    getBinaryAsset(options, SHARE_FONT_ASSETS[400]),
    getBinaryAsset(options, SHARE_FONT_ASSETS[700]),
  ])

  const svg = await satori(<ShareCard result={result} />, {
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
    fonts: [
      {
        name: SHARE_FONT_FAMILY,
        data: font400,
        weight: 400,
        style: 'normal',
      },
      {
        name: SHARE_FONT_FAMILY,
        data: font700,
        weight: 700,
        style: 'normal',
      },
    ],
  })

  const resvg = new Resvg(svg, {
    background: '#f5eee2',
    fitTo: {
      mode: 'width',
      value: SHARE_IMAGE_WIDTH,
    },
  })

  const rendered = resvg.render()
  return {
    png: rendered.asPng(),
    svg,
  }
}

async function ensureRenderersReady(options: RenderShareImageOptions) {
  if (!rendererInitPromise) {
    rendererInitPromise = Promise.all([
      getBinaryAsset(options, SHARE_WASM_ASSETS.yoga).then((wasm) => initSatori(wasm)),
      getBinaryAsset(options, SHARE_WASM_ASSETS.resvg).then((wasm) => initResvg(wasm)),
    ]).then(() => undefined)
  }

  return rendererInitPromise
}

function getBinaryAsset(options: RenderShareImageOptions, pathname: string) {
  let assetPromise = binaryAssetCache.get(pathname)

  if (!assetPromise) {
    assetPromise = fetchBinaryAsset(options, pathname)
    binaryAssetCache.set(pathname, assetPromise)
  }

  return assetPromise
}

async function fetchBinaryAsset(options: RenderShareImageOptions, pathname: string) {
  const assetUrl = new URL(pathname, options.requestUrl)
  const response = await options.assetFetcher.fetch(assetUrl)

  if (!response.ok) {
    throw new Error(`Failed to load binary asset: ${pathname}`)
  }

  return response.arrayBuffer()
}
