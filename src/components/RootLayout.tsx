import { useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'

export function RootLayout() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [prevScroll, setPrevScroll] = useState(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = prevScroll
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
    setPrevScroll(latest)
  })

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans selection:bg-black selection:text-white">
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b-[6px] border-black bg-white"
      >
        <div className="max-w-[1400px] mx-auto flex h-24 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex h-12 w-12 items-center justify-center bg-black text-white font-black text-2xl brutal-shadow-sm group-hover:-rotate-12 transition-transform">麻</div>
            <span className="text-3xl sm:text-4xl font-archivo uppercase tracking-tighter hidden sm:block">Mabti<span className="text-[var(--accent-1)]">!</span></span>
          </Link>
          <nav className="flex gap-4 sm:gap-10 font-black uppercase text-sm sm:text-lg tracking-tighter">
            <Link to="/test" className="hover:text-[var(--accent-1)] transition-colors" activeProps={{ className: 'text-[var(--accent-1)]' }}>Play</Link>
            <Link to="/result" search={{ seed: undefined }} className="hover:text-[var(--accent-1)] transition-colors" activeProps={{ className: 'text-[var(--accent-1)]' }}>Dossier</Link>
          </nav>
        </div>
      </motion.header>
      
      <div className="flex-1 flex flex-col pt-24">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>

      <footer className="mt-40 border-t-[12px] border-black bg-black text-white py-24 sm:py-32">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col lg:flex-row justify-between gap-20">
            <div className="flex-1">
              <h2 className="text-6xl sm:text-9xl font-archivo italic mb-8">MABTI.</h2>
              <p className="text-xl sm:text-2xl font-bold opacity-40 max-w-xl leading-tight">
                THE BOLD TACTICAL DNA ANALYZER FOR THE RIICHI MAHJONG ELITE. NO COMPROMISE. NO MERCY.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-4 font-black uppercase tracking-[0.2em] text-sm sm:text-xl">
              <span className="text-[var(--accent-4)]">Tactical Intelligence v2.0</span>
              <span className="text-[var(--accent-2)]">Verified Authentication</span>
              <span className="opacity-20 mt-8">© 2026 MABTI STRATEGIC LAB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
