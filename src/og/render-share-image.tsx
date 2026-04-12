import { Resvg, initWasm as initResvg } from '@resvg/resvg-wasm'
import resvgWasm from '@resvg/resvg-wasm/index_bg.wasm'
import satori, { init as initSatori } from 'satori/standalone'
import yogaWasm from 'satori/yoga.wasm'
import type { MabtiResult } from '../state/mabti'
import { ShareCard } from './share-card'
import { SHARE_FONT_BASE64 } from './share-font'

const SHARE_IMAGE_WIDTH = 1200
const SHARE_IMAGE_HEIGHT = 630

let rendererInitPromise: Promise<void> | undefined
let shareFontData: ArrayBuffer | undefined

export async function renderShareImage(result: MabtiResult) {
  await ensureRenderersReady()

  const svg = await satori(<ShareCard result={result} />, {
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
    fonts: [
      {
        name: 'Noto Sans SC',
        data: getShareFontData(),
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Noto Sans SC',
        data: getShareFontData(),
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

async function ensureRenderersReady() {
  if (!rendererInitPromise) {
    rendererInitPromise = Promise.all([
      initSatori(yogaWasm),
      initResvg(resvgWasm),
    ]).then(() => undefined)
  }

  return rendererInitPromise
}

function getShareFontData() {
  if (!shareFontData) {
    const binary = atob(SHARE_FONT_BASE64)
    const bytes = new Uint8Array(binary.length)

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index)
    }

    shareFontData = bytes.buffer
  }

  return shareFontData
}
