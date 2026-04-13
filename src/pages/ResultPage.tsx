import { useMemo, useRef, useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Share2, Download, ShieldAlert, Zap, Target, BrainCircuit, Loader2 } from 'lucide-react'
import { toPng } from 'html-to-image'
import {
  getLatestStoredResult,
  resultFromSeed,
  type MabtiResult,
} from '../state/mabti'
import { BrutalButton, BrutalLink } from '../components/BrutalUI'
import { MabtiAvatar } from '../ui/mabti-avatar'
import { RadarChart } from '../ui/radar-chart'
import { ShareCard } from '../og/share-card'

function IdentityShowcase({ result }: { result: MabtiResult }) {
  const dnaChars = result.typeCode.split('')
  
  return (
    <div className="w-full aspect-[3/4] bg-black border-[8px] border-black brutal-shadow relative overflow-hidden group">
      {/* Animated Background: Scrolling DNA Chars */}
      <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.span 
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="text-4xl font-archivo text-white select-none"
          >
            {dnaChars[i % dnaChars.length]}
          </motion.span>
        ))}
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-20"></div>

      {/* Main Avatar Card */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full aspect-square bg-white border-[6px] border-black brutal-shadow-sm flex items-center justify-center relative overflow-hidden mb-6"
        >
          {/* Inner Card Background Accent */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ backgroundColor: result.visual.accent }}
          />
          <MabtiAvatar result={result} size={236} bare={true} />
          
          {/* Floating DNA Label inside card */}
          <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 font-black text-xs tracking-widest rotate-[-3deg]">
            DNA: {result.typeCode}
          </div>
        </motion.div>

        <div className="text-center">
          <h3 className="mb-2 text-3xl font-archivo uppercase leading-none text-white sm:text-4xl">{result.title}</h3>
          <div className="inline-block border-[3px] border-white bg-[var(--accent-2)] px-4 py-1 text-xs font-black uppercase text-black sm:text-sm">
            {result.roleTag}
          </div>
        </div>
      </div>

      {/* Decorative Serial Number */}
      <div className="absolute top-4 left-4 text-[10px] font-black text-white/40 tracking-[0.3em] rotate-90 origin-top-left uppercase">
        Ver.{result.id.slice(-6)}
      </div>
    </div>
  )
}

export function ResultPage() {
  const search = useSearch({ from: '/result' })
  const latest = useMemo(() => getLatestStoredResult(), [])
  const result = useMemo(() => search.seed ? resultFromSeed(search.seed) : latest, [latest, search.seed])
  
  const exportRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (!result) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-shell-narrow flex min-h-[60vh] flex-col items-center justify-center py-28 text-center sm:py-40">
      <div className="bg-black text-white p-12 brutal-shadow">
        <h1 className="text-6xl sm:text-8xl font-archivo mb-8 italic">NO DNA FOUND.</h1>
        <p className="text-2xl font-bold opacity-60 mb-12 uppercase tracking-widest">Incomplete tactical scanning</p>
        <BrutalLink to="/test" bgColor="bg-[var(--accent-4)]">RE-INITIATE SCAN</BrutalLink>
      </div>
    </motion.div>
  )

  const handleDownloadImage = async () => {
    if (!exportRef.current) return
    setIsExporting(true)
    try {
      // Ensure fonts and images are settled
      await new Promise(resolve => setTimeout(resolve, 300))
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        pixelRatio: 2, // 2x for retina quality
        backgroundColor: '#000',
      })
      const link = document.createElement('a')
      link.download = `Mabti_Tactical_DNA_${result.typeCode}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to export image', err)
      alert('Failed to generate image. Browser API error.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleShareClick = async () => {
    if (!exportRef.current) return
    try {
      if (navigator.share && navigator.canShare) {
        const dataUrl = await toPng(exportRef.current, { pixelRatio: 2 })
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], `Mabti_DNA_${result.typeCode}.png`, { type: 'image/png' })
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Mabti Tactical DNA: ${result.title}`,
            text: `My Mahjong DNA is ${result.typeCode}. Check yours!`,
            files: [file],
            url: window.location.href,
          })
          return
        }
      }
      await navigator.clipboard.writeText(window.location.href)
      alert('URL copied to clipboard!')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-shell py-10 sm:py-14 lg:py-20"
    >
      {/* Hidden high-res card for export rendering */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
        <div ref={exportRef} className="w-[1200px] h-[630px] overflow-hidden">
           <ShareCard result={result} scale={1} />
        </div>
      </div>

      {/* Top Banner: Dossier Header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 border-x-[4px] border-t-[4px] border-black bg-black p-3 text-[10px] font-black uppercase tracking-[0.26em] text-white sm:p-4 sm:text-xs">
        <span>Classified: Tactical DNA Report</span>
        <span className="hidden sm:inline">Ref No: {result.id.toUpperCase()}</span>
        <span>Secure Access</span>
      </div>

      <section className="relative mb-10 grid gap-8 overflow-hidden border-[4px] border-black bg-white p-6 sm:mb-12 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-end lg:p-12">
        <div className="relative z-10 min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="bg-[var(--accent-1)] px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-white rotate-[-2deg]">Tactical archetype</div>
            <div className="bg-black px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">Identity confirmed</div>
          </div>
          <p className="eyebrow mb-4 opacity-45">{result.subtitle}</p>
          <h1 className="mb-6 text-[clamp(3.4rem,11vw,8rem)] font-archivo uppercase leading-[0.82] tracking-tighter">
            {result.title}
          </h1>
          <p className="max-w-2xl text-lg font-bold leading-relaxed opacity-70 sm:text-xl">
            {result.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-4xl font-archivo text-stroke-fg opacity-20 sm:text-6xl">{result.typeCode}</div>
            <div className="hidden h-12 w-[4px] bg-black sm:block"></div>
            <div className="text-xl font-archivo italic lowercase opacity-60 sm:text-3xl">#{result.roleTag}</div>
            <div className="rounded-none border-[3px] border-black bg-[var(--accent-4)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em]">
              {result.coreStyle}
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[220px] items-end justify-center overflow-hidden border-[4px] border-black bg-black/5 p-4 sm:min-h-[280px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,0,0.16),transparent_62%)] opacity-70" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/30 to-transparent" />
          <div className="relative z-10">
            <MabtiAvatar result={result} size={300} bare={true} />
          </div>
        </div>
      </section>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(19rem,24rem)_minmax(0,1fr)] xl:gap-12">
        
        {/* Left Side: ID CARD & CORE */}
        <aside className="space-y-10 xl:sticky xl:top-28">
          <div>
            <div className="mb-6 flex items-end justify-between border-b-[4px] border-black pb-4">
              <h3 className="text-2xl font-archivo italic sm:text-3xl">IDENTITY CARD</h3>
              <span className="text-[10px] font-black opacity-40">SHOWCASE MODE</span>
            </div>
            
            <div className="flex flex-col gap-6">
              <IdentityShowcase result={result} />
              
              <div className="grid grid-cols-2 gap-4">
                <BrutalButton 
                  bgColor="bg-[var(--accent-4)]" 
                  className="text-sm" 
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download strokeWidth={3} className="mr-2" size={18} />}
                  {isExporting ? '...' : 'SAVE'}
                </BrutalButton>
                <BrutalButton bgColor="bg-white" className="text-sm" onClick={handleShareClick}>
                  <Share2 strokeWidth={3} className="mr-2" size={18} /> SHARE
                </BrutalButton>
              </div>
            </div>
          </div>

          <div className="relative border-[4px] border-black bg-black p-6 text-[var(--accent-4)] brutal-shadow sm:p-8">
            <h4 className="mb-6 border-b border-white/20 pb-2 text-xs font-black uppercase tracking-[0.2em] text-white">Primary Catchphrase</h4>
            <div className="text-2xl font-black italic leading-tight sm:text-3xl">
              "{result.catchphrase}"
            </div>
            <div className="absolute -bottom-4 -right-4 flex h-12 w-12 items-center justify-center border-[4px] border-black bg-[var(--accent-1)] text-2xl font-black text-white rotate-12">!</div>
          </div>
        </aside>

        {/* Right Side: DEEP ANALYSIS */}
        <div className="section-stack">
          {/* Analysis Text Block */}
          <section className="relative">
            <div className="mb-6 flex items-center gap-4 sm:mb-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white sm:h-12 sm:w-12"><Zap size={22} /></div>
              <h3 className="flex-1 border-b-[4px] border-black pb-2 text-3xl font-archivo sm:text-4xl">PSYCHOLOGICAL DNA</h3>
            </div>
            <div className="border-[4px] border-black bg-white p-6 brutal-shadow sm:p-10 lg:p-12">
              <p className="mb-8 text-xl font-bold leading-[1.35] sm:mb-10 sm:text-3xl lg:text-4xl">
                {result.description}
              </p>
              <div className="quote-card">
                <p className="eyebrow mb-3 opacity-35">Observed quote</p>
                <p className="text-lg font-bold italic leading-tight text-slate-700 sm:text-2xl">"{result.quote}"</p>
              </div>
            </div>
          </section>

          {/* Tactical Control Panel (Radar + Metrics) */}
          <section>
            <div className="mb-6 flex items-center gap-4 sm:mb-8">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-white sm:h-12 sm:w-12"><BrainCircuit size={22} /></div>
              <h3 className="flex-1 border-b-[4px] border-black pb-2 text-3xl font-archivo sm:text-4xl">TACTICAL CONTROL PANEL</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col items-center border-[4px] border-black bg-white p-6 brutal-shadow sm:p-8">
                <h4 className="mb-6 self-start font-archivo text-lg opacity-40 sm:mb-8 sm:text-xl">Radar Profile</h4>
                <div className="flex w-full justify-center overflow-visible py-2 sm:py-4">
                  <RadarChart color={result.visual.accent} items={result.radar} size={280} />
                </div>
              </div>

              <div className="border-[4px] border-black bg-white p-6 brutal-shadow sm:p-8">
                <h4 className="mb-6 font-archivo text-lg opacity-40 sm:mb-8 sm:text-xl">Metrics Overview</h4>
                <div className="space-y-6 sm:space-y-8">
                  {result.metrics.map(m => (
                    <div key={m.label}>
                      <div className="mb-3 flex items-center justify-between gap-4 text-[11px] font-black uppercase tracking-[0.18em] sm:text-xs">
                        <span>{m.label}</span>
                        <span>{m.value}</span>
                      </div>
                      <div className="h-6 border-[3px] border-black bg-slate-100 overflow-hidden w-full relative">
                        <motion.div 
                          className="h-full bg-black" 
                          initial={{ width: 0 }}
                          whileInView={{ width: m.value }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ backgroundColor: result.visual.accent }}
                        />
                      </div>
                      <p className="mt-2 text-sm font-bold leading-relaxed opacity-55">{m.helper}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Strengths & Pitfalls */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="border-[4px] border-black bg-[var(--accent-2)] p-6 brutal-shadow sm:p-8">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <Target className="text-black" />
                <h3 className="bg-black px-4 py-1 text-2xl font-archivo text-white sm:text-3xl">STRENGTHS</h3>
              </div>
              <ul className="space-y-5 sm:space-y-6">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg font-bold leading-tight sm:text-xl">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-black text-sm text-white">✔</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-[4px] border-black bg-[var(--accent-1)] p-6 text-white brutal-shadow sm:p-8">
              <div className="mb-6 flex items-center gap-3 sm:mb-8">
                <ShieldAlert className="text-white" />
                <h3 className="bg-white px-4 py-1 text-2xl font-archivo text-black sm:text-3xl">PITFALLS</h3>
              </div>
              <ul className="space-y-5 sm:space-y-6">
                {result.pitfalls.map((p, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg font-bold leading-tight sm:text-xl">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-white text-sm text-black">✘</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Growth Plan */}
          <section className="border-[4px] border-black bg-white p-6 brutal-shadow sm:p-10 lg:p-12">
            <h3 className="mb-8 border-b-[4px] border-black pb-4 text-3xl font-archivo sm:mb-12 sm:text-4xl">GROWTH STRATEGY</h3>
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:gap-12">
              {result.growthTips.map((tip, i) => (
                <div key={i} className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
                  <div className="select-none text-6xl font-archivo opacity-10 transition-opacity duration-500 group-hover:opacity-100 sm:text-8xl lg:text-9xl">0{i + 1}</div>
                  <p className="text-lg font-black leading-[1.26] sm:text-xl lg:text-2xl">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end border-t-[4px] border-black pt-8 sm:pt-12">
            <BrutalLink to="/test" bgColor="bg-black" textColor="text-white" className="w-full sm:w-auto" showArrow>
              RE-CALIBRATE DNA SCAN
            </BrutalLink>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
