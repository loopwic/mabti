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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans selection:bg-black selection:text-white overflow-x-hidden">
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b-[4px] border-black bg-[rgba(255,249,240,0.96)] backdrop-blur-sm sm:border-b-[6px]"
      >
        <div className="page-shell flex h-20 items-center justify-between gap-4 sm:h-24">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex h-11 w-11 items-center justify-center bg-black text-white font-black text-xl brutal-shadow-sm transition-transform group-hover:-rotate-12 sm:h-12 sm:w-12 sm:text-2xl">麻</div>
            <div className="flex flex-col">
              <span className="text-xl font-archivo uppercase tracking-tighter sm:text-4xl">Mabti<span className="text-[var(--accent-1)]">!</span></span>
              <span className="hidden text-[10px] font-black uppercase tracking-[0.24em] opacity-45 sm:block">Tactical Mahjong Blueprint</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] sm:gap-8 sm:text-sm">
            <Link to="/test" className="transition-colors hover:text-[var(--accent-1)]" activeProps={{ className: 'text-[var(--accent-1)]' }}>Play</Link>
            <Link to="/result" search={{ seed: undefined }} className="transition-colors hover:text-[var(--accent-1)]" activeProps={{ className: 'text-[var(--accent-1)]' }}>Dossier</Link>
          </nav>
        </div>
      </motion.header>
      
      <div className="flex-1 flex flex-col pt-20 sm:pt-24">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>

      <footer className="mt-24 border-t-[8px] border-black bg-black text-white py-16 sm:mt-32 sm:border-t-[12px] sm:py-24">
        <div className="page-shell">
          <div className="flex flex-col gap-14 lg:flex-row lg:justify-between lg:gap-20">
            <div className="flex-1">
              <h2 className="mb-6 text-5xl font-archivo italic sm:text-8xl">MABTI.</h2>
              <p className="max-w-2xl text-lg font-bold leading-tight opacity-50 sm:text-2xl">
                THE BOLD TACTICAL DNA ANALYZER FOR THE RIICHI MAHJONG ELITE. NO COMPROMISE. NO MERCY.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-3 text-xs font-black uppercase tracking-[0.22em] sm:text-lg">
              <span className="text-[var(--accent-4)]">Tactical Intelligence v2.0</span>
              <span className="text-[var(--accent-2)]">Verified Authentication</span>
              <span className="mt-6 opacity-25">© 2026 MABTI STRATEGIC LAB</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
