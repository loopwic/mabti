import { useMemo, useRef, useEffect, useState } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Share2, Download, RefreshCcw, ShieldAlert, Zap, Target, BrainCircuit, Loader2 } from 'lucide-react'
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
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
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
          <MabtiAvatar result={result} size={280} bare={true} />
          
          {/* Floating DNA Label inside card */}
          <div className="absolute bottom-4 right-4 bg-black text-white px-3 py-1 font-black text-xs tracking-widest rotate-[-3deg]">
            DNA: {result.typeCode}
          </div>
        </motion.div>

        <div className="text-center">
          <h3 className="text-white text-4xl font-archivo uppercase leading-none mb-2">{result.title}</h3>
          <div className="bg-[var(--accent-2)] text-black px-4 py-1 font-black text-sm uppercase inline-block border-[3px] border-white">
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
  
  const containerRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setScale(Math.max(0.18, width / 1200))
      }
    }
    updateScale()
    const timer = setTimeout(updateScale, 150)
    window.addEventListener('resize', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      clearTimeout(timer)
    }
  }, [result])

  if (!result) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto py-40 px-8 text-center flex flex-col items-center justify-center min-h-[60vh]">
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
      className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 sm:py-20"
    >
      {/* Hidden high-res card for export rendering */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
        <div ref={exportRef} className="w-[1200px] h-[630px] overflow-hidden">
           <ShareCard result={result} scale={1} />
        </div>
      </div>

      {/* Top Banner: Dossier Header */}
      <div className="bg-black text-white p-4 mb-1 border-x-[4px] border-t-[4px] border-black flex justify-between items-center font-black uppercase text-xs tracking-[0.3em]">
        <span>Classified: Tactical DNA Report</span>
        <span className="hidden sm:inline">Ref No: {result.id.toUpperCase()}</span>
        <span>Secure Access</span>
      </div>

      <div className="border-[4px] border-black bg-white p-8 sm:p-16 mb-12 relative overflow-hidden flex flex-col lg:flex-row gap-12 items-start">
        <div className="relative z-10 flex-1">
          <div className="flex gap-4 items-center mb-6">
            <div className="bg-[var(--accent-1)] text-white px-4 py-1 font-black text-sm uppercase tracking-widest rotate-[-2deg]">Tactical Archetype</div>
            <div className="bg-black text-white px-4 py-1 font-black text-sm uppercase tracking-widest">Identity Confirmed</div>
          </div>
          <h1 className="text-[60px] sm:text-[90px] lg:text-[140px] font-archivo leading-[0.8] uppercase tracking-tighter mb-8">
            {result.title}
          </h1>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="text-4xl sm:text-6xl font-archivo text-stroke-fg opacity-20">{result.typeCode}</div>
            <div className="h-12 w-[4px] bg-black hidden sm:block"></div>
            <div className="text-2xl sm:text-4xl font-archivo italic lowercase opacity-60">#{result.roleTag}</div>
          </div>
        </div>
        
        {/* Large Avatar watermark-like background */}
        <div className="absolute top-0 right-0 opacity-10 h-full w-1/2 flex items-center justify-center pointer-events-none select-none">
           <MabtiAvatar result={result} size={600} bare={true} />
        </div>
      </div>

      {/* Main Grid: Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-12 sm:gap-20 items-start">
        
        {/* Left Side: ID CARD & CORE */}
        <aside className="lg:sticky lg:top-32 space-y-12">
          <div>
            <div className="flex justify-between items-end border-b-[4px] border-black pb-4 mb-6">
              <h3 className="text-3xl font-archivo italic">IDENTITY CARD</h3>
              <span className="text-[10px] font-black opacity-40">SHOWCASE MODE</span>
            </div>
            
            <div className="flex flex-col gap-6">
              <IdentityShowcase result={result} />
              
              <div className="grid grid-cols-2 gap-4">
                <BrutalButton 
                  bgColor="bg-[var(--accent-4)]" 
                  className="text-sm py-3" 
                  onClick={handleDownloadImage}
                  disabled={isExporting}
                >
                  {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download strokeWidth={3} className="mr-2" size={18} />}
                  {isExporting ? '...' : 'SAVE'}
                </BrutalButton>
                <BrutalButton bgColor="bg-white" className="text-sm py-3" onClick={handleShareClick}>
                  <Share2 strokeWidth={3} className="mr-2" size={18} /> SHARE
                </BrutalButton>
              </div>
            </div>
          </div>

          <div className="bg-black text-[var(--accent-4)] p-8 border-[4px] border-black brutal-shadow relative">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-white/20 pb-2">Primary Catchphrase</h4>
            <div className="text-3xl font-black italic leading-tight">
              "{result.catchphrase}"
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[var(--accent-1)] text-white w-12 h-12 flex items-center justify-center font-black text-2xl border-[4px] border-black rotate-12">!</div>
          </div>
        </aside>

        {/* Right Side: DEEP ANALYSIS */}
        <div className="space-y-16">
          {/* Analysis Text Block */}
          <section className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center text-white shrink-0"><Zap size={24} /></div>
              <h3 className="text-4xl font-archivo border-b-[4px] border-black pb-2 flex-1">PSYCHOLOGICAL DNA</h3>
            </div>
            <div className="bg-white border-[4px] border-black p-8 sm:p-12 brutal-shadow">
              <p className="text-2xl sm:text-4xl font-bold leading-[1.3] mb-12">
                {result.description}
              </p>
              <div className="p-8 bg-slate-50 border-l-[16px] border-black italic text-xl sm:text-2xl font-bold text-slate-600">
                "{result.quote}"
              </div>
            </div>
          </section>

          {/* Tactical Control Panel (Radar + Metrics) */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center text-white shrink-0"><BrainCircuit size={24} /></div>
              <h3 className="text-4xl font-archivo border-b-[4px] border-black pb-2 flex-1">TACTICAL CONTROL PANEL</h3>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="border-[4px] border-black p-8 bg-white brutal-shadow flex flex-col items-center">
                <h4 className="font-archivo text-xl mb-8 self-start opacity-40">Radar Profile</h4>
                <div className="flex justify-center w-full overflow-visible py-4">
                  <RadarChart color={result.visual.accent} items={result.radar} size={320} />
                </div>
              </div>

              <div className="border-[4px] border-black p-8 bg-white brutal-shadow">
                <h4 className="font-archivo text-xl mb-8 opacity-40">Metrics Overview</h4>
                <div className="space-y-8">
                  {result.metrics.map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between font-black text-xs mb-3 uppercase tracking-widest">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Strengths & Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border-[4px] border-black p-8 bg-[var(--accent-2)] brutal-shadow">
              <div className="flex items-center gap-3 mb-8">
                <Target className="text-black" />
                <h3 className="text-3xl font-archivo bg-black text-white px-4 py-1">STRENGTHS</h3>
              </div>
              <ul className="space-y-6">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-4 items-start font-bold text-xl leading-tight">
                    <span className="bg-black text-white w-6 h-6 flex items-center justify-center text-sm shrink-0">✔</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-[4px] border-black p-8 bg-[var(--accent-1)] text-white brutal-shadow">
              <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="text-white" />
                <h3 className="text-3xl font-archivo bg-white text-black px-4 py-1">PITFALLS</h3>
              </div>
              <ul className="space-y-6">
                {result.pitfalls.map((p, i) => (
                  <li key={i} className="flex gap-4 items-start font-bold text-xl leading-tight">
                    <span className="bg-white text-black w-6 h-6 flex items-center justify-center text-sm shrink-0">✘</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Growth Plan */}
          <section className="bg-white border-[4px] border-black p-8 sm:p-12 brutal-shadow">
            <h3 className="text-4xl font-archivo mb-12 border-b-[4px] border-black pb-4">GROWTH STRATEGY</h3>
            <div className="grid grid-cols-1 gap-12">
              {result.growthTips.map((tip, i) => (
                <div key={i} className="flex gap-8 items-center group">
                  <div className="text-7xl sm:text-9xl font-archivo opacity-10 group-hover:opacity-100 transition-opacity duration-500 select-none">0{i+1}</div>
                  <p className="text-xl sm:text-2xl font-black leading-[1.2]">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-12 border-t-[4px] border-black">
            <BrutalLink to="/test" bgColor="bg-black" textColor="text-white" className="w-full sm:w-auto" showArrow>
              RE-CALIBRATE DNA SCAN
            </BrutalLink>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
