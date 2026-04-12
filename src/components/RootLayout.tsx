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
    <div className="min-h-screen flex flex-col bg-[var(--bg)] font-sans">
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b-[4px] border-black bg-white pointer-events-auto"
      >
        <div className="max-w-[1400px] mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 hover:-translate-y-1 transition-transform">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center bg-black text-white font-black text-xl sm:text-2xl brutal-shadow-sm">麻</div>
            <span className="text-2xl sm:text-3xl font-archivo uppercase tracking-tighter hidden sm:block">Mabti!</span>
          </Link>
          <nav className="flex gap-3 sm:gap-6 font-black uppercase text-sm sm:text-base">
            <Link to="/test" className="px-4 py-2 border-[2px] border-black brutal-shadow-sm hover:-translate-y-1 hover:bg-[var(--accent-4)] transition-all" activeProps={{ className: 'bg-[var(--accent-4)]' }}>Play</Link>
            <Link to="/result" search={{ seed: undefined }} className="px-4 py-2 border-[2px] border-black brutal-shadow-sm hover:-translate-y-1 hover:bg-[var(--accent-4)] transition-all" activeProps={{ className: 'bg-[var(--accent-4)]' }}>Result</Link>
          </nav>
        </div>
      </motion.header>
      
      {/* pt-20 accounts for the fixed navbar height so content doesn't jump */}
      <div className="flex-1 flex flex-col pt-20">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>

      <footer className="mt-auto border-t-[4px] border-black bg-black text-white py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            <div>
              <h2 className="text-4xl sm:text-5xl font-archivo italic">MABTI.</h2>
              <p className="mt-4 opacity-60 max-w-sm font-bold">The boldest Mahjong personality analyzer. Find your true table DNA.</p>
            </div>
            <div className="flex flex-col gap-2 font-black uppercase tracking-widest text-sm sm:text-base">
              <span className="text-[var(--accent-4)]">Built for the Serious</span>
              <span>No Mercy at the Table</span>
              <span className="opacity-40 mt-4">© 2026 MABTI PROJECT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
