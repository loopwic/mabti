import { useLayoutEffect, useRef, useState } from 'react'
import type { MabtiResult } from '../state/mabti'
import { MabtiAvatar } from '../ui/mabti-avatar'

interface ShareCardProps {
  result: MabtiResult
  id?: string // For ref mapping
  scale?: number
}

export function ShareCard({ result, id, scale = 1 }: ShareCardProps) {
  const titleSize = getTitleFontSize(result.title)
  const roleTagSize = getRoleTagFontSize(result.roleTag)
  const descContainerRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const [descriptionSize, setDescriptionSize] = useState(() => getDescriptionFontSize(result.description))

  useLayoutEffect(() => {
    const container = descContainerRef.current
    const element = descRef.current
    if (!container || !element) {
      return
    }

    const maxSize = getDescriptionFontSize(result.description)
    const minSize = 12

    element.style.fontSize = `${maxSize}px`
    let nextSize = maxSize

    while (element.scrollHeight > container.clientHeight && nextSize > minSize) {
      nextSize -= 1
      element.style.fontSize = `${nextSize}px`
    }

    setDescriptionSize(nextSize)
  }, [result.description, scale])

  return (
    <div
      style={{
        width: 1200 * scale,
        height: 630 * scale,
        overflow: 'hidden',
      }}
    >
      <div 
        id={id}
        className="w-[1200px] h-[630px] bg-[#000] p-[30px] flex font-sans leading-none overflow-hidden select-none text-black"
        style={{ 
          boxSizing: 'border-box',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
      <div className="w-full h-full bg-white border-[10px] border-black flex relative overflow-hidden">
        
        {/* Left Visual: The Hero Block */}
        <div className="w-[430px] h-full shrink-0 overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center relative border-r-[10px] border-black">
          <div className="flex items-center justify-center translate-y-[-12px]">
            <MabtiAvatar result={result} size={400} bare={true} />
          </div>
          
          <div className="absolute bottom-10 w-[84%] bg-[#ffcc00] border-[5px] border-black px-4 py-3 flex flex-col items-center rotate-[-2deg] shadow-[10px_10px_0px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="text-sm font-[900] tracking-[0.2em] mb-1 opacity-60 uppercase">DNA SEQUENCE</div>
            <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[42px] font-[900] tracking-[0.12em] font-archivo">
              {result.typeCode}
            </div>
          </div>
        </div>

        {/* Right Info: Tactical Dossier */}
        <div className="min-w-0 flex-1 h-full overflow-hidden bg-white p-10 flex flex-col justify-between">
          
          <div className="min-w-0 flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-5">
              <div className="min-w-0 text-orange-600 font-[900] text-sm tracking-[0.32em] uppercase">Tactical Dossier // Classified</div>
              <div className="shrink-0 text-[10px] font-black opacity-20 uppercase tracking-widest">Auth Ref: {result.id.slice(-8).toUpperCase()}</div>
            </div>
            
            <h1
              className="max-w-full overflow-hidden break-words font-[900] mb-4 uppercase font-archivo"
              style={{
                fontSize: titleSize,
                lineHeight: 0.86,
                letterSpacing: '-0.04em',
              }}
            >
              {result.title}
            </h1>
            
            <div className="min-w-0 flex gap-4 items-center">
              <span
                className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap bg-[#00e099] text-black px-4 py-1 font-[900] border-[3px] border-black uppercase"
                style={{ fontSize: roleTagSize }}
              >
                {result.roleTag}
              </span>
              <span className="shrink-0 text-sm font-black opacity-30 uppercase tracking-widest italic">Rank: LVL.99 ACE</span>
            </div>
          </div>

          {/* Persona Intro */}
          <div ref={descContainerRef} className="my-6 h-[168px] py-5 border-y-[4px] border-black/5 relative overflow-hidden">
            <div className="absolute -top-4 -left-4 text-6xl font-serif opacity-10">“</div>
            <p
              ref={descRef}
              className="font-bold text-slate-800 pr-4 break-words"
              style={{
                fontSize: descriptionSize,
                lineHeight: 1.45,
              }}
            >
              {result.description}
            </p>
          </div>

          {/* Scores Panel */}
          <div className="min-w-0 flex flex-col gap-4">
            <div className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] mb-2">Tactical Calibration</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {result.metrics.map((m) => (
                <div key={m.label} className="min-w-0 flex flex-col">
                  <div className="flex justify-between font-black text-[11px] mb-1 uppercase">
                    <span className="min-w-0 pr-2 truncate">{m.label}</span>
                    <span className="shrink-0">{m.value}</span>
                  </div>
                  <div className="h-3 bg-slate-100 border-[2px] border-black overflow-hidden">
                    <div 
                      className="h-full" 
                      style={{ 
                        width: m.value, 
                        backgroundColor: result.visual.accent 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Group */}
          <div className="mt-6 pt-5 border-t-[4px] border-black flex justify-between items-end gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xl brutal-shadow-sm">麻</div>
              <div className="font-archivo text-2xl font-black italic tracking-tighter">MABTI.</div>
            </div>
            <div className="min-w-0 text-[10px] font-black opacity-40 uppercase tracking-[0.16em] text-right">
              Verified Tactical Identity Card<br/>
              © 2026 MABTI STRATEGIC LAB
            </div>
          </div>
        </div>

        {/* Brutal Corner Accents */}
        <div className="absolute top-0 right-0 w-16 h-16 border-b-[8px] border-l-[8px] border-black"></div>
        <div className="absolute top-4 right-4 w-4 h-4 bg-orange-600"></div>
        <div className="absolute bottom-0 left-[430px] w-12 h-12 bg-[#ffcc00] border-t-[8px] border-r-[8px] border-black translate-x-[-100%]"></div>
      </div>
      </div>
    </div>
  )
}

function getTitleFontSize(title: string) {
  if (title.length <= 6) return 72
  if (title.length <= 8) return 64
  if (title.length <= 10) return 58
  if (title.length <= 12) return 52
  if (title.length <= 16) return 46
  return 40
}

function getRoleTagFontSize(roleTag: string) {
  if (roleTag.length <= 6) return 20
  if (roleTag.length <= 10) return 18
  if (roleTag.length <= 14) return 16
  return 14
}

function getDescriptionFontSize(description: string) {
  if (description.length <= 36) return 22
  if (description.length <= 52) return 20
  if (description.length <= 72) return 18
  return 16
}
