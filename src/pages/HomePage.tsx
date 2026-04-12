import { useMemo } from 'react'
import { motion } from 'motion/react'
import { buildSampleResults } from '../state/mabti'
import { BrutalLink } from '../components/BrutalUI'
import { MabtiAvatar } from '../ui/mabti-avatar'
import { Zap, Target, BrainCircuit } from 'lucide-react'

export function HomePage() {
  const samples = useMemo(() => buildSampleResults(), [])

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-x-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 sm:py-24">
        
        {/* Newspaper Style Header */}
        <div className="border-b-[12px] border-black pb-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-[0.3em]">Issue #02</span>
              <span className="font-black text-xs uppercase tracking-[0.3em] opacity-40 italic">2026.04 EDITION</span>
            </div>
            <h1 className="text-[80px] sm:text-[120px] lg:text-[180px] font-archivo leading-[0.75] uppercase tracking-tighter">
              MABTI<span className="text-[var(--accent-1)]">!</span>
            </h1>
          </div>
          <div className="md:w-80 text-right">
            <p className="text-xl font-black uppercase leading-none mb-2 tracking-tighter">Tactical Intelligence</p>
            <p className="text-sm font-bold opacity-60">
              Decoding the psychological patterns of the modern Riichi Mahjong player. 100% Data Driven.
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] border-[6px] border-black brutal-shadow mb-32">
          <section className="p-8 sm:p-16 bg-white relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h2 className="text-5xl sm:text-7xl font-archivo leading-[0.9] mb-10 uppercase">
                REVEAL YOUR<br />
                <span className="bg-[var(--accent-4)] px-4 rotate-[-1deg] inline-block">TACTICAL DNA.</span>
              </h2>
              <p className="text-2xl sm:text-3xl font-bold max-w-xl mb-12 leading-tight">
                我们拒绝平庸的标签。这不只是测试，这是对你牌桌灵魂的深度解码。
              </p>
              <BrutalLink to="/test" className="w-full sm:w-80 h-24 text-3xl" showArrow bgColor="bg-black" textColor="text-white">
                START SCAN
              </BrutalLink>
            </div>
            {/* Watermark */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[300px] font-archivo opacity-[0.03] pointer-events-none select-none leading-none rotate-90">SCAN</div>
          </section>
          
          <section className="bg-black text-white p-12 flex flex-col justify-between border-t-[6px] lg:border-t-0 lg:border-l-[6px] border-black">
            <div className="space-y-12">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[var(--accent-1)] flex items-center justify-center text-black shrink-0 border-[4px] border-white rotate-3"><Zap size={32} /></div>
                <div>
                  <div className="text-4xl font-archivo leading-none">16</div>
                  <div className="font-black uppercase text-xs tracking-widest opacity-60 mt-2">Archetypes</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[var(--accent-2)] flex items-center justify-center text-black shrink-0 border-[4px] border-white -rotate-3"><Target size={32} /></div>
                <div>
                  <div className="text-4xl font-archivo leading-none">06</div>
                  <div className="font-black uppercase text-xs tracking-widest opacity-60 mt-2">Tactical Axes</div>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[var(--accent-3)] flex items-center justify-center text-black shrink-0 border-[4px] border-white rotate-6"><BrainCircuit size={32} /></div>
                <div>
                  <div className="text-4xl font-archivo leading-none">100%</div>
                  <div className="font-black uppercase text-xs tracking-widest opacity-60 mt-2">Accuracy</div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-xs font-black uppercase tracking-[0.2em] leading-relaxed">
                Secure access only. Unauthorized replication of DNA data is prohibited.
              </p>
            </div>
          </section>
        </div>

        {/* Archetypes Section */}
        <section className="relative">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-6xl sm:text-9xl font-archivo italic uppercase tracking-tighter">Archetypes.</h2>
            <div className="hidden sm:block text-right">
              <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-40 underline decoration-black/20 underline-offset-4">Interactive Preview</div>
              <div className="text-xs font-black uppercase tracking-widest opacity-40">Drag to extract DNA</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-16">
            {samples.map((sample, i) => (
              <motion.div 
                key={sample.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                className="border-[6px] border-black p-8 bg-white brutal-shadow group"
              >
                <div className="flex justify-center items-center mb-10 pb-10 border-b-[4px] border-black relative">
                  <motion.div 
                    drag 
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
                    dragElastic={0.5} 
                    whileTap={{ scale: 0.85, rotate: -10 }} 
                    whileHover={{ scale: 1.1, rotate: 5, y: -10 }} 
                    className="cursor-grab active:cursor-grabbing z-10 relative"
                  >
                    <MabtiAvatar result={sample} size={140} />
                  </motion.div>
                  <div className="absolute top-0 left-0 w-[140px] h-[140px] bg-slate-50 border-[4px] border-black border-dashed opacity-30 z-0 left-1/2 -translate-x-1/2 flex items-center justify-center text-[10px] font-black uppercase text-center p-2 text-slate-400">
                    EMPTY<br/>SLOT
                  </div>
                </div>
                <h3 className="text-4xl font-archivo mb-2 group-hover:text-[var(--accent-1)] transition-colors">{sample.title}</h3>
                <div className="bg-black text-white inline-block px-3 py-1 font-black uppercase text-[10px] tracking-widest mb-6">DNA: {sample.typeCode}</div>
                <div className="p-6 bg-slate-50 border-l-[8px] border-black italic text-lg font-bold leading-tight min-h-[100px]">
                  "{sample.quote}"
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Big Bottom Action */}
        <section className="mt-40 text-center">
          <div className="bg-[var(--accent-1)] p-12 sm:p-24 border-[8px] border-black brutal-shadow inline-block w-full relative overflow-hidden">
            <h2 className="text-[60px] sm:text-[100px] lg:text-[140px] font-archivo text-white leading-[0.8] mb-12 uppercase relative z-10">
              READY FOR<br />THE TRUTH?
            </h2>
            <BrutalLink to="/test" className="w-full sm:w-96 h-24 text-3xl relative z-10" bgColor="bg-black" textColor="text-white" showArrow>
              START THE SCAN
            </BrutalLink>
            <div className="absolute -bottom-10 -left-10 text-[200px] font-archivo text-black opacity-10 pointer-events-none leading-none rotate-[-15deg]">TRUTH</div>
          </div>
        </section>

      </div>
    </motion.main>
  )
}
