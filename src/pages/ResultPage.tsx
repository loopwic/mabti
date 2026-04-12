import { useMemo } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Share2, Download, RefreshCcw } from 'lucide-react'
import {
  getLatestStoredResult,
  resultFromSeed,
} from '../state/mabti'
import { BrutalButton, BrutalLink } from '../components/BrutalUI'
import { MabtiAvatar } from '../ui/mabti-avatar'
import { RadarChart } from '../ui/radar-chart'

export function ResultPage() {
  const search = useSearch({ from: '/result' })
  const latest = useMemo(() => getLatestStoredResult(), [])
  const result = useMemo(() => search.seed ? resultFromSeed(search.seed) : latest, [latest, search.seed])

  if (!result) return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1200px] mx-auto py-40 px-8 text-center flex flex-col items-center justify-center">
      <h1 className="text-6xl sm:text-8xl font-archivo mb-8">NO DNA FOUND.</h1>
      <p className="text-2xl font-bold opacity-60 mb-12">You need to play the game first.</p>
      <BrutalLink to="/test">START THE TEST</BrutalLink>
    </motion.div>
  )

  const imageUrl = typeof window === 'undefined' ? '' : `${window.location.origin}/api/share-image?seed=${result.seed}`

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        try {
          // Attempt to fetch the image and share it as a file
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `Mabti_DNA_${result.typeCode}.png`, { type: blob.type });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Mabti Personality: ${result.title}`,
              text: `My Mahjong Tactical DNA is ${result.typeCode}. Check yours!`,
              files: [file],
              url: window.location.href, // Some platforms require a URL even with files
            });
            return;
          }
        } catch (fetchError) {
          console.warn("Failed to fetch image for sharing, falling back to URL sharing.", fetchError);
        }

        // Fallback to text/url sharing
        await navigator.share({
          title: `Mabti Personality: ${result.title}`,
          text: `My Mahjong Tactical DNA is ${result.typeCode}. Check yours!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Report URL copied to clipboard!');
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleDownloadImage = () => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `Mabti_DNA_${result.typeCode}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-16"
    >
      {/* Title Header */}
      <div className="border-b-[8px] border-black pb-8 sm:pb-16 mb-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-xl sm:text-2xl font-black uppercase mb-4 tracking-widest text-[var(--accent-1)]">Identity Confirmed</div>
          <h1 className="text-[60px] sm:text-[90px] lg:text-[140px] font-archivo leading-[0.85] uppercase tracking-tighter">{result.title}</h1>
          <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 items-center">
            <div className="bg-black text-white px-6 py-2 font-black text-2xl sm:text-3xl brutal-shadow-sm tracking-widest">{result.typeCode}</div>
            <div className="border-[4px] border-black bg-[var(--accent-4)] text-black px-6 py-2 font-black text-xl sm:text-2xl brutal-shadow-sm uppercase">{result.roleTag}</div>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 lg:-right-20 -translate-y-1/2 text-[160px] lg:text-[300px] font-archivo opacity-5 pointer-events-none select-none">{result.typeCode}</div>
      </div>

      {/* Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[460px_1fr] gap-10 sm:gap-16 mt-16 sm:mt-24">
        
        {/* Sticky Sidebar: ID Card */}
        <aside className="space-y-8 lg:sticky lg:top-32 self-start flex flex-col">
          <div className="flex justify-between items-end border-b-[4px] border-black pb-4 mb-4">
            <h3 className="text-3xl font-archivo">YOUR ID CARD</h3>
          </div>
          
          <div className="border-[8px] border-black bg-white brutal-shadow p-4 sm:p-6 flex flex-col gap-6">
            <div className="bg-slate-100 w-full aspect-[1200/630] border-[4px] border-black relative overflow-hidden flex items-center justify-center brutal-shadow-sm">
                <img 
                  src={imageUrl} 
                  alt="Mabti ID Card" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="text-center font-black p-4 text-lg uppercase leading-tight">Rendering...<br/><span class="text-xs opacity-50 block mt-2">API Required</span></div>';
                  }}
                />
            </div>
            <div className="flex flex-col gap-4">
              <BrutalButton bgColor="bg-[var(--accent-4)]" className="w-full text-sm sm:text-base py-3" onClick={handleDownloadImage}>
                <Download strokeWidth={3} className="mr-2" size={18} /> SAVE CARD
              </BrutalButton>
              <BrutalButton bgColor="bg-white" className="w-full text-sm sm:text-base py-3" onClick={handleShareClick}>
                <Share2 strokeWidth={3} className="mr-2" size={18} /> SHARE URL
              </BrutalButton>
            </div>
          </div>

          <div className="bg-black text-[var(--accent-4)] p-6 font-black italic text-xl sm:text-2xl w-full border-[4px] border-black relative mt-8">
            <div className="absolute -top-4 -left-4 text-5xl text-white">"</div>
            {result.catchphrase}
          </div>
        </aside>

        {/* Content Area */}
        <div className="space-y-12 sm:space-y-16">
          <section className="border-[4px] border-black p-6 sm:p-10 lg:p-12 bg-white brutal-shadow relative overflow-hidden">
            <h3 className="text-3xl sm:text-5xl font-archivo mb-8 border-b-[4px] border-black pb-4">PSYCHOLOGICAL DNA</h3>
            <p className="text-xl sm:text-3xl font-bold leading-relaxed">{result.description}</p>
            <div className="mt-12 p-6 sm:p-10 bg-slate-100 border-l-[12px] sm:border-l-[16px] border-black font-black italic text-xl sm:text-3xl leading-snug">
              "{result.quote}"
            </div>
            <div className="absolute top-10 -right-20 text-[150px] font-archivo opacity-5 pointer-events-none rotate-90 origin-right select-none">PROFILE</div>
          </section>

          {/* Radar and Metrics side by side on desktop */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12">
            <div className="border-[4px] border-black p-6 sm:p-8 bg-white brutal-shadow flex flex-col items-center">
              <h3 className="font-archivo text-2xl sm:text-3xl mb-8 uppercase self-start w-full">Tactical Radar</h3>
              <div className="flex justify-center -mx-4 pb-4 w-full overflow-hidden">
                <RadarChart color={result.visual.accent} items={result.radar} size={320} />
              </div>
            </div>

            <div className="border-[4px] border-black p-6 sm:p-8 bg-white brutal-shadow flex flex-col justify-center">
              <h3 className="font-archivo text-2xl sm:text-3xl mb-8 uppercase">Metrics Overview</h3>
              <div className="space-y-6">
                {result.metrics.map(m => (
                  <div key={m.label}>
                    <div className="flex justify-between font-black text-sm mb-2 uppercase tracking-widest">
                      <span>{m.label}</span>
                      <span>{m.value}</span>
                    </div>
                    <div className="h-4 sm:h-6 border-[3px] border-black bg-slate-100 overflow-hidden w-full relative">
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
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            <div className="border-[4px] border-black p-6 sm:p-8 bg-[var(--accent-2)] brutal-shadow">
              <h3 className="text-3xl sm:text-4xl font-archivo mb-8 bg-black text-white inline-block px-4 py-1">STRENGTHS</h3>
              <ul className="space-y-4 sm:space-y-6 font-bold text-lg sm:text-xl">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="text-black font-black pt-1">■</span>
                    <span className="leading-snug">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-[4px] border-black p-6 sm:p-8 bg-[var(--accent-1)] text-white brutal-shadow">
              <h3 className="text-3xl sm:text-4xl font-archivo mb-8 bg-white text-black inline-block px-4 py-1">PITFALLS</h3>
              <ul className="space-y-4 sm:space-y-6 font-bold text-lg sm:text-xl">
                {result.pitfalls.map((p, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="text-white font-black pt-1">□</span>
                    <span className="leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="border-[4px] border-black p-6 sm:p-10 lg:p-12 bg-white brutal-shadow">
            <h3 className="text-3xl sm:text-5xl font-archivo mb-10 border-b-[4px] border-black pb-4">GROWTH STRATEGY</h3>
            <div className="space-y-8 sm:space-y-12">
              {result.growthTips.map((tip, i) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center border-b-[2px] border-slate-200 pb-8 last:border-0 last:pb-0">
                  <span className="text-6xl sm:text-8xl font-archivo opacity-20 leading-none shrink-0">0{i+1}</span>
                  <p className="text-xl sm:text-2xl font-bold leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-8">
            <BrutalLink to="/test" bgColor="bg-black" textColor="text-white" className="w-full sm:w-auto">
              <RefreshCcw strokeWidth={3} className="mr-2" size={24} /> RE-CALIBRATE DNA
            </BrutalLink>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
