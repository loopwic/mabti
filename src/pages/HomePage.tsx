import { useMemo } from 'react'
import { motion } from 'motion/react'
import { buildSampleResults } from '../state/mabti'
import { BrutalLink } from '../components/BrutalUI'
import { MabtiAvatar } from '../ui/mabti-avatar'

export function HomePage() {
  const samples = useMemo(() => buildSampleResults(), [])

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px] border-[4px] border-black brutal-shadow">
          <section className="p-8 sm:p-12 lg:p-16 bg-white relative overflow-hidden">
            <div className="bg-black text-white inline-block px-4 py-1 font-black uppercase text-xs sm:text-sm tracking-widest mb-6 relative z-10">Mabti Personality v2.0</div>
            <h1 className="text-[60px] sm:text-[80px] lg:text-[100px] xl:text-[120px] font-archivo leading-[0.85] mb-8 relative z-10">
              REVEAL<br />YOUR DNA.
            </h1>
            <p className="text-xl sm:text-2xl font-bold max-w-xl mb-12 relative z-10">
              我们拒绝平庸。这不只是测试，这是对你牌桌灵魂的深度解码。
            </p>
            <BrutalLink to="/test" className="w-full sm:w-auto relative z-10" showArrow>
              START ANALYZING
            </BrutalLink>
            {/* Background decorative typography */}
            <div className="absolute -bottom-20 -right-10 text-[200px] font-archivo opacity-5 pointer-events-none select-none leading-none">DNA</div>
          </section>
          
          <section className="bg-[var(--accent-3)] border-t-[4px] lg:border-t-0 lg:border-l-[4px] border-black p-8 sm:p-12 flex flex-col justify-center text-white">
            <div className="space-y-8 sm:space-y-12">
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="border-t-[4px] border-white pt-4">
                <div className="text-5xl font-archivo">16</div>
                <div className="font-bold uppercase opacity-80 tracking-widest text-sm mt-1">Mabti Personas</div>
              </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="border-t-[4px] border-white pt-4">
                <div className="text-5xl font-archivo">6</div>
                <div className="font-bold uppercase opacity-80 tracking-widest text-sm mt-1">Tactical Axes</div>
              </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="border-t-[4px] border-white pt-4">
                <div className="text-5xl font-archivo">100%</div>
                <div className="font-bold uppercase opacity-80 tracking-widest text-sm mt-1">Brutal Truth</div>
              </motion.div>
            </div>
          </section>
        </div>

        {/* Archetypes Section */}
        <section className="mt-32 sm:mt-40">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-archivo mb-12 sm:mb-16 italic">Archetypes.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {samples.map((sample, i) => (
              <motion.div 
                key={sample.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="border-[4px] border-black p-6 sm:p-8 bg-white brutal-shadow hover:-rotate-2 transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-8 border-b-[4px] border-black pb-6 relative">
                  <motion.div 
                    drag 
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
                    dragElastic={0.4} 
                    whileTap={{ scale: 0.9, rotate: -15 }} 
                    whileHover={{ scale: 1.15, rotate: 5 }} 
                    className="cursor-grab active:cursor-grabbing z-10 relative"
                    title="Try dragging me!"
                  >
                    <MabtiAvatar result={sample} size={100} />
                  </motion.div>
                  <div className="absolute top-0 left-0 w-[100px] h-[100px] bg-slate-100 border-[4px] border-black border-dashed opacity-50 z-0 flex items-center justify-center text-[10px] font-black uppercase text-center p-2 text-slate-400">
                    DNA<br/>SLOT
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-archivo">{sample.title}</h3>
                <div className="mt-2 text-[var(--accent-1)] font-black uppercase text-sm">{sample.roleTag}</div>
                <p className="mt-6 text-base font-bold opacity-70 leading-relaxed italic bg-slate-50 p-4 border-l-[4px] border-black">"{sample.quote}"</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </motion.main>
  )
}
