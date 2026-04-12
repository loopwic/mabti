import type { CSSProperties } from 'react'
import type { MabtiResult } from '../state/mabti'
import { MabtiAvatar } from '../ui/mabti-avatar'

interface ShareCardProps {
  result: MabtiResult
}

export function ShareCard({ result }: ShareCardProps) {
  const subtitle = truncate(result.subtitle, 24)
  const quote = truncate(result.quote, 24)
  const roleText = truncate(result.catchphrase, 22)
  const roleFoot = truncate(result.description, 52)
  const footerSeed = `SEED: ${result.seed.slice(0, 14)}…`

  return (
    <div style={styles.canvas}>
      <div style={styles.shell}>
        
        {/* Header */}
        <div style={styles.headerRow}>
          <div style={styles.brandBlock}>
            <div style={styles.brandOverline}>MABTI PERSONALITY LAB</div>
            <div style={styles.brandTitle}>MABTI.</div>
          </div>
          <div style={styles.codeBadge}>{result.typeCode}</div>
        </div>

        {/* Content */}
        <div style={styles.contentRow}>
          
          <div style={styles.leftColumn}>
            <div style={styles.heroBlock}>
              <div style={styles.kicker}>TACTICAL IDENTITY CONFIRMED</div>
              <div style={styles.title}>{result.title}</div>
            </div>

            <div style={styles.roleCard}>
              <div style={styles.roleTitle}>{result.roleTag}</div>
            </div>

            <div style={styles.quoteCard}>{`“${quote}”`}</div>

            <div style={styles.axesCard}>
              <div style={styles.sectionLabel}>THE SIX AXES</div>
              <div style={styles.axesList}>
                {result.axes.slice(0, 4).map((axis) => (
                  <div key={axis.key} style={styles.axisItem}>
                    <div style={styles.axisHead}>
                      <div style={styles.axisLabel}>{axis.label}</div>
                      <div style={styles.axisValue}>{`${axis.dominantLabel} ${axis.percentage}%`}</div>
                    </div>
                    <div style={styles.axisTrack}>
                      <div style={{ ...styles.axisFill, width: `${axis.percentage}%`, backgroundColor: '#1a1a1a' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div style={styles.avatarCard}>
              <MabtiAvatar result={result} size={300} />
            </div>
            <div style={styles.descCard}>
              <div style={styles.descText}>{roleFoot}</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={styles.footerRow}>
          <div style={styles.footerText}>100% BRUTAL TRUTH · MABTI PROJECT</div>
          <div style={styles.footerSeed}>{footerSeed}</div>
        </div>

      </div>
    </div>
  )
}

function truncate(text: string, maxLength: number) {
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trimEnd()}…`
}

const sharedCard: CSSProperties = {
  border: '4px solid #1a1a1a',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
}

const styles: Record<string, CSSProperties> = {
  canvas: {
    position: 'relative',
    display: 'flex',
    width: 1200,
    height: 630,
    overflow: 'hidden',
    backgroundColor: '#fff9f0',
    color: '#1a1a1a',
    fontFamily: 'Noto Sans SC',
  },
  shell: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    width: '100%',
    padding: 40,
    boxSizing: 'border-box',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  brandOverline: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  brandTitle: {
    display: 'flex',
    fontSize: 48,
    fontWeight: 900,
    letterSpacing: -2,
    lineHeight: 1,
  },
  codeBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: 4,
    boxShadow: '8px 8px 0px #1a1a1a',
    border: '4px solid #1a1a1a',
  },
  contentRow: {
    display: 'flex',
    gap: 40,
    flex: 1,
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: 640,
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    flex: 1,
  },
  heroBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  kicker: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#ff4d00',
  },
  title: {
    display: 'flex',
    fontSize: 72,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: -2,
  },
  roleCard: {
    display: 'flex',
    backgroundColor: '#00e099',
    padding: '12px 24px',
    border: '4px solid #1a1a1a',
    boxShadow: '6px 6px 0px #1a1a1a',
    width: 'auto',
    alignSelf: 'flex-start',
  },
  roleTitle: {
    display: 'flex',
    fontSize: 24,
    fontWeight: 900,
    textTransform: 'uppercase',
  },
  quoteCard: {
    ...sharedCard,
    display: 'flex',
    padding: '24px',
    fontSize: 24,
    lineHeight: 1.4,
    fontWeight: 900,
    backgroundColor: '#ffcc00',
    boxShadow: '8px 8px 0px #1a1a1a',
  },
  axesCard: {
    ...sharedCard,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '24px',
    boxShadow: '8px 8px 0px #1a1a1a',
  },
  sectionLabel: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  axesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  axisItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  axisHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  axisLabel: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
  },
  axisValue: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
  },
  axisTrack: {
    display: 'flex',
    width: '100%',
    height: 16,
    backgroundColor: '#e5e5e5',
    border: '2px solid #1a1a1a',
  },
  axisFill: {
    height: '100%',
  },
  avatarCard: {
    ...sharedCard,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 340,
    backgroundColor: '#884dff',
    boxShadow: '8px 8px 0px #1a1a1a',
  },
  descCard: {
    ...sharedCard,
    display: 'flex',
    padding: '24px',
    backgroundColor: '#ffffff',
    boxShadow: '8px 8px 0px #1a1a1a',
  },
  descText: {
    display: 'flex',
    fontSize: 20,
    lineHeight: 1.5,
    fontWeight: 700,
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    borderTop: '4px solid #1a1a1a',
  },
  footerText: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
  },
  footerSeed: {
    display: 'flex',
    fontSize: 16,
    fontWeight: 900,
  },
}
