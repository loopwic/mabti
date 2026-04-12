import { motion } from 'motion/react'
import type { RadarItem } from '../state/mabti'

export function RadarChart({
  color,
  items,
  size = 300,
}: {
  color: string
  items: RadarItem[]
  size?: number
}) {
  const center = size / 2
  const radius = size * 0.40 // Increased to reduce white space
  const levels = 5

  const polygonPoints = items
    .map((item, index) => {
      const angle = (Math.PI * 2 * index) / items.length - Math.PI / 2
      const distance = (item.value / 100) * radius
      return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`
    })
    .join(' ')

  const centerPolygonPoints = items
    .map(() => `${center},${center}`)
    .join(' ')

  return (
    <motion.svg
      aria-label="人格雷达图"
      className="overflow-visible"
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <circle cx={center} cy={center} fill="rgba(255,255,255,0.75)" r={radius + 20} />

      {Array.from({ length: levels }).map((_, levelIndex) => {
        const distance = ((levelIndex + 1) / levels) * radius
        const points = items
          .map((_, index) => {
            const angle = (Math.PI * 2 * index) / items.length - Math.PI / 2
            return `${center + Math.cos(angle) * distance},${center + Math.sin(angle) * distance}`
          })
          .join(' ')

        return (
          <motion.polygon
            fill="none"
            key={distance}
            points={points}
            stroke="rgba(77, 61, 50, 0.12)"
            strokeWidth="1.1"
            variants={{
              hidden: { opacity: 0, scale: 0.5, transformOrigin: 'center' },
              visible: { opacity: 1, scale: 1, transformOrigin: 'center' }
            }}
            transition={{ delay: levelIndex * 0.1, duration: 0.5, ease: "easeOut" }}
          />
        )
      })}

      {items.map((item, index) => {
        const angle = (Math.PI * 2 * index) / items.length - Math.PI / 2
        const lineX = center + Math.cos(angle) * radius
        const lineY = center + Math.sin(angle) * radius
        const labelX = center + Math.cos(angle) * (radius + 20)
        const labelY = center + Math.sin(angle) * (radius + 20)

        return (
          <g key={item.label}>
            <motion.line
              stroke="rgba(77, 61, 50, 0.12)"
              strokeWidth="1.1"
              x1={center}
              y1={center}
              x2={center}
              y2={center}
              variants={{
                hidden: { x2: center, y2: center },
                visible: { x2: lineX, y2: lineY }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.text
              fill="#1a1a1a"
              fontFamily="'Archivo Black', sans-serif"
              fontSize="12"
              textAnchor="middle"
              x={labelX}
              y={labelY + 4} // adjust for baseline
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
            >
              {item.label}
            </motion.text>
          </g>
        )
      })}

      <motion.polygon
        fill={hexToAlpha(color, 0.2)}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="3.4"
        variants={{
          hidden: { opacity: 0, scale: 0.5, transformOrigin: 'center' },
          visible: { opacity: 1, scale: 1, transformOrigin: 'center' }
        }}
        transition={{ delay: 0.6, type: "spring", bounce: 0.4, duration: 0.8 }}
        points={polygonPoints}
      />

      {items.map((item, index) => {
        const angle = (Math.PI * 2 * index) / items.length - Math.PI / 2
        const distance = (item.value / 100) * radius
        const cx = center + Math.cos(angle) * distance
        const cy = center + Math.sin(angle) * distance

        return (
          <motion.g 
            key={`${item.label}-point`}
            variants={{
              hidden: { opacity: 0, scale: 0, transformOrigin: `${cx}px ${cy}px` },
              visible: { opacity: 1, scale: 1, transformOrigin: `${cx}px ${cy}px` }
            }}
            transition={{ delay: 0.8 + index * 0.05, type: "spring", bounce: 0.5 }}
          >
            <circle
              cx={cx}
              cy={cy}
              fill="#ffffff"
              r="7"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            <circle
              cx={cx}
              cy={cy}
              fill={color}
              r="4.6"
            />
          </motion.g>
        )
      })}
    </motion.svg>
  )
}

function hexToAlpha(hex: string, alpha: number) {
  const value = hex.replace('#', '')
  const normalized = value.length === 3 ? value.split('').map((entry) => entry + entry).join('') : value
  const numeric = Number.parseInt(normalized, 16)
  const red = (numeric >> 16) & 255
  const green = (numeric >> 8) & 255
  const blue = numeric & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}
