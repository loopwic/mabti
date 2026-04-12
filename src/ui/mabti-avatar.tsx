import type { CSSProperties } from 'react'
import { getMabtiImage } from '../assets/mabti-portrait-data'
import type { MabtiResult } from '../state/mabti'

export function MabtiAvatar({
  result,
  size,
  bare = false,
}: {
  result: MabtiResult
  size?: number
  bare?: boolean
}) {
  const dimension = size ?? 220
  const portraitSrc = getMabtiImage(result.typeCode)

  if (bare) {
    return (
      <img 
        alt={result.typeCode} 
        src={portraitSrc} 
        width={dimension} 
        height={dimension} 
        style={{ width: dimension, height: dimension, objectFit: 'contain' }}
        draggable={false}
      />
    )
  }

  return (
    <div aria-hidden style={{ ...styles.root, width: dimension, height: dimension }}>
      <div
        style={{
          ...styles.frame,
          backgroundColor: result.visual.accent || '#ffcc00'
        }}
      >
        <img alt="" height={dimension} src={portraitSrc} style={styles.image} width={dimension} draggable={false} />
      </div>
      <div style={{ ...styles.codeBadge }}>
        <span style={styles.codeText}>{result.typeCode}</span>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    border: '4px solid #1a1a1a',
    boxShadow: '8px 8px 0px #1a1a1a',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  codeBadge: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    background: '#1a1a1a',
    height: 32,
    transform: 'rotate(-2deg)'
  },
  codeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
}
