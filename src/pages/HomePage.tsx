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
      <div className="page-shell section-stack py-10 sm:py-16 lg:py-20">
        <header className="grid gap-8 border-b-[8px] border-black pb-8 sm:border-b-[10px] sm:pb-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="bg-black px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-white">Issue #02</span>
              <span className="text-[11px] font-black uppercase tracking-[0.28em] opacity-40 italic">2026.04 edition</span>
            </div>
            <h1 className="fluid-display font-archivo uppercase tracking-tighter">
              MABTI<span className="text-[var(--accent-1)]">!</span>
            </h1>
          </div>

          <div className="max-w-sm justify-self-start lg:justify-self-end lg:text-right">
            <p className="mb-2 text-lg font-black uppercase tracking-[0.14em] sm:text-xl">Tactical Intelligence</p>
            <p className="text-sm font-bold leading-relaxed opacity-65 sm:text-base">
              Decoding the psychological patterns of modern Riichi Mahjong players with a loud, opinionated tactical profile.
            </p>
          </div>
        </header>

        <section className="grid overflow-hidden border-[4px] border-black brutal-shadow sm:border-[6px] lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,22rem)]">
          <div className="relative flex flex-col justify-center overflow-hidden bg-white p-6 sm:p-10 lg:p-14">
            <div className="relative z-10 max-w-3xl">
              <p className="eyebrow mb-5 opacity-50">Mahjong personality scan</p>
              <h2 className="fluid-title mb-6 font-archivo uppercase">
                Reveal your
                <span className="ml-0 mt-3 inline-block rotate-[-1deg] bg-[var(--accent-4)] px-3 py-1 sm:ml-3">tactical DNA.</span>
              </h2>
              <p className="fluid-subtitle mb-8 max-w-2xl font-bold">
                我们拒绝平庸的标签。这不只是测试，而是一份把你的攻守偏好、读牌直觉和牌桌人格拆开的战术档案。
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <BrutalLink
                  to="/test"
                  className="w-full sm:w-72"
                  showArrow
                  bgColor="bg-black"
                  textColor="text-white"
                  style={{ color: 'var(--bg)' } as React.CSSProperties}
                >
                  START SCAN
                </BrutalLink>
                <p className="eyebrow opacity-45">16 archetypes · 6 axes · instant dossier</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-12 top-1/2 hidden -translate-y-1/2 rotate-90 text-[220px] font-archivo leading-none opacity-[0.04] md:block lg:text-[280px]">SCAN</div>
          </div>

          <aside className="border-t-[4px] border-black bg-black p-6 text-white sm:p-8 lg:border-l-[6px] lg:border-t-0">
            <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 lg:gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border-[3px] border-white bg-[var(--accent-1)] text-black rotate-3 sm:h-16 sm:w-16 sm:border-[4px]"><Zap size={28} /></div>
                <div>
                  <div className="text-3xl font-archivo leading-none sm:text-4xl">16</div>
                  <div className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Archetypes</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border-[3px] border-white bg-[var(--accent-2)] text-black -rotate-3 sm:h-16 sm:w-16 sm:border-[4px]"><Target size={28} /></div>
                <div>
                  <div className="text-3xl font-archivo leading-none sm:text-4xl">06</div>
                  <div className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Tactical axes</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center border-[3px] border-white bg-[var(--accent-3)] text-black rotate-6 sm:h-16 sm:w-16 sm:border-[4px]"><BrainCircuit size={28} /></div>
                <div>
                  <div className="text-3xl font-archivo leading-none sm:text-4xl">100%</div>
                  <div className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Drama factor</div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-6 sm:mt-10">
              <p className="text-xs font-black uppercase tracking-[0.22em] leading-relaxed">
                Secure access only. Unauthorized replication of tactical DNA data is prohibited.
              </p>
            </div>
          </aside>
        </section>

        <section className="section-stack">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow mb-3 opacity-45">Interactive preview</p>
              <h2 className="fluid-title font-archivo italic uppercase tracking-tighter">Archetypes.</h2>
            </div>
            <p className="max-w-md text-sm font-black uppercase tracking-[0.18em] opacity-45">
              Drag the portrait to preview the dossier mood. Each card keeps the current editorial chaos, but the grid now collapses cleanly on smaller screens.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 xl:gap-10">
            {samples.map((sample, i) => (
              <motion.article
                key={sample.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                className="group flex flex-col gap-6 border-[4px] border-black bg-white p-6 brutal-shadow sm:p-8"
              >
                <div className="relative flex items-center justify-center border-b-[4px] border-black pb-8">
                  <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.5}
                    whileTap={{ scale: 0.85, rotate: -10 }}
                    whileHover={{ scale: 1.08, rotate: 5, y: -10 }}
                    className="relative z-10 cursor-grab active:cursor-grabbing"
                  >
                    <MabtiAvatar result={sample} size={124} />
                  </motion.div>
                  <div className="absolute left-1/2 top-0 flex h-[124px] w-[124px] -translate-x-1/2 items-center justify-center border-[3px] border-dashed border-black bg-slate-50 p-2 text-center text-[10px] font-black uppercase text-slate-400 opacity-35">
                    EMPTY<br />SLOT
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-3xl font-archivo transition-colors group-hover:text-[var(--accent-1)] sm:text-4xl">{sample.title}</h3>
                    <span className="inline-block bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">DNA: {sample.typeCode}</span>
                  </div>
                  <div className="quote-card min-h-[124px]">
                    <p className="eyebrow mb-3 opacity-35">Field note</p>
                    <p className="text-lg font-bold leading-tight italic sm:text-xl">"{sample.quote}"</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section>
          <div className="relative overflow-hidden border-[6px] border-black bg-[var(--accent-1)] p-8 brutal-shadow sm:p-12 lg:p-16">
            <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-4xl">
                <p className="eyebrow mb-4 text-white/80">Final call</p>
                <h2 className="fluid-title font-archivo uppercase text-white">
                  Ready for
                  <br />
                  the truth?
                </h2>
              </div>
              <BrutalLink
                to="/test"
                className="relative z-10 w-full sm:w-80 lg:w-96"
                bgColor="bg-black"
                textColor="text-white"
                showArrow
                style={{ color: 'var(--bg)' } as React.CSSProperties}
              >
                START THE SCAN
              </BrutalLink>
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-4 text-[120px] font-archivo leading-none text-black/12 rotate-[-12deg] sm:text-[180px] lg:text-[220px]">TRUTH</div>
          </div>
        </section>
      </div>
    </motion.main>
  )
}
