import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence, useAnimation, useReducedMotion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import {
  answersToResult,
  axisDefinitions,
  buildSampleResults,
  createBlankAnswers,
  persistResult,
  questionGroups,
  questions,
  scaleOptions,
  type AnswerMap,
  type Question,
  type MabtiResult,
} from '../state/mabti'
import { BrutalButton } from '../components/BrutalUI'
import { MabtiAvatar } from '../ui/mabti-avatar'

type QuestionOption = NonNullable<Question['options']>[number]

const SURFACE_COLOR = '#fff9f0'
const INK_COLOR = '#1a1a1a'

function getOptionTransition(reducedMotion: boolean) {
  return reducedMotion
    ? { duration: 0.12 }
    : { type: 'spring' as const, stiffness: 360, damping: 24, mass: 0.75 }
}

export function TestPage() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion() ?? false
  const [answers, setAnswers] = useState<AnswerMap>(() => createBlankAnswers())
  const [answeredFlags, setAnsweredFlags] = useState<Record<string, boolean>>({})
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0)

  const [companion, setCompanion] = useState<MabtiResult | null>(null)
  const companionControls = useAnimation()

  useEffect(() => {
    const allSamples = buildSampleResults()
    const shuffled = [...allSamples].sort(() => 0.5 - Math.random())
    setCompanion(shuffled[0])
  }, [])

  const currentGroup = questionGroups[currentGroupIndex]
  const groupQuestions = currentGroup.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is Question => Boolean(q))

  const answeredCount = Object.values(answeredFlags).filter(Boolean).length
  const progress = Math.round((answeredCount / questions.length) * 100)
  
  useEffect(() => {
    if (!reducedMotion && answeredCount > 0) {
      void companionControls.start({
        y: [0, -24, 0],
        scale: [1, 1.06, 1],
        rotate: [0, 6, 0],
        transition: { type: 'spring', stiffness: 260, damping: 18, mass: 0.7 }
      })
    }
  }, [answeredCount, companionControls, reducedMotion])

  const selectAnswer = (id: string, val: number) => {
    setAnswers(p => ({ ...p, [id]: val }))
    const wasAlreadyAnswered = answeredFlags[id]
    setAnsweredFlags(p => ({ ...p, [id]: true }))

    if (!wasAlreadyAnswered && currentGroupIndex < questionGroups.length - 1) {
      const groupQuestionIds = questionGroups[currentGroupIndex].questionIds
      const othersAnswered = groupQuestionIds.filter(qId => qId !== id).every(qId => answeredFlags[qId])
      if (othersAnswered) {
        setTimeout(() => {
          setCurrentGroupIndex(p => Math.min(questionGroups.length - 1, p + 1))
          window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
        }, 600)
      }
    }
  }

  const goNext = () => {
    setCurrentGroupIndex(p => Math.min(questionGroups.length - 1, p + 1))
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }
  
  const goPrev = () => {
    setCurrentGroupIndex(p => Math.max(0, p - 1))
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const finish = () => {
    const res = answersToResult(answers, true)
    persistResult(res)
    void navigate({ to: '/result', search: { seed: res.seed } })
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-shell-narrow relative py-10 sm:py-16 lg:py-20"
    >
      {/* Companion */}
      <div className="fixed bottom-8 right-8 z-40 hidden lg:flex pointer-events-none items-end">
        {companion && (
          <motion.div 
            animate={companionControls}
            className="w-32 h-32 pointer-events-auto"
          >
            <motion.div 
              drag 
              dragConstraints={{ left: -200, right: 50, top: -400, bottom: 50 }} 
              dragElastic={0.4} 
              whileHover={{ scale: 1.15, rotate: 5, y: -10 }} 
              className="cursor-grab active:cursor-grabbing w-full h-full drop-shadow-2xl"
            >
              <MabtiAvatar result={companion} size={128} bare={true} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Header Area */}
      <div className="mb-12 grid gap-6 border-b-[6px] border-black pb-8 sm:mb-16 sm:border-b-[8px] sm:pb-10 lg:mb-20 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="min-w-0">
          <div className="flex gap-3 items-center mb-4">
            <span className="bg-[var(--accent-1)] text-white px-3 py-1 font-black text-xs uppercase tracking-widest">Stage 0{currentGroupIndex + 1}</span>
            <span className="font-black text-xs uppercase tracking-widest opacity-40">Tactical Scan in Progress</span>
          </div>
          <h1 className="fluid-title font-archivo uppercase tracking-tighter">{currentGroup.title}</h1>
        </div>
        <div className="w-full max-w-sm shrink-0 lg:justify-self-end">
          <div className="flex justify-between font-black uppercase text-[10px] tracking-widest mb-2">
            <span>Sequencing DNA</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 border-[3px] border-black bg-white overflow-hidden relative">
            <motion.div 
              className="h-full bg-black" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }} 
              transition={reducedMotion ? { duration: 0.01 } : { ease: 'easeOut', duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="mb-20 space-y-0 sm:mb-24 lg:mb-28">
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={currentGroupIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col"
          >
            {groupQuestions.map((q, i) => {
              const axis = axisDefinitions.find(a => a.key === q.axis)!
              const isActive = answeredFlags[q.id]
              const currentVal = answers[q.id]
              const leftActive = isActive && typeof currentVal === 'number' && currentVal < 0
              const rightActive = isActive && typeof currentVal === 'number' && currentVal > 0
              
              return (
                <div key={q.id} className="group border-b-[4px] border-black/10 py-12 last:border-b-0 sm:py-16 lg:py-20">
                  <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16">
                    <div className="hidden lg:block relative shrink-0 w-[140px] h-[120px]">
                      <div className="text-[120px] font-archivo opacity-[0.03] leading-none select-none">
                        {(currentGroupIndex * 4 + i + 1).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="mb-6 flex flex-wrap items-center gap-4 sm:mb-8">
                        <div className="font-archivo text-3xl leading-none opacity-[0.08] lg:hidden">
                          {(currentGroupIndex * 4 + i + 1).toString().padStart(2, '0')}
                        </div>
                        <div className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-[0.2em]">{q.tag}</div>
                        <div className="h-[2px] w-8 bg-black/10"></div>
                        <div className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">{axis.label}</div>
                      </div>
                      
                      <h3 className="mb-8 max-w-4xl text-2xl font-black leading-[1.28] sm:mb-10 sm:text-4xl sm:leading-[1.18] lg:text-5xl">
                        {q.prompt}
                      </h3>
                      
                      {/* Interaction Area */}
                      <div className="w-full">
                        {q.type === 'binary' ? (
                          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                            <BinaryButton 
                              label="THAT'S ME" 
                              sub="绝对如此" 
                              active={isActive && currentVal === 3}
                              color={q.direction === 1 ? axis.right.color : axis.left.color}
                              letter={q.direction === 1 ? axis.right.letter : axis.left.letter}
                              onClick={() => selectAnswer(q.id, 3)}
                              reducedMotion={reducedMotion}
                            />
                            <BinaryButton 
                              label="NO WAY" 
                              sub="绝不可能" 
                              active={isActive && currentVal === -3}
                              color={q.direction === -1 ? axis.right.color : axis.left.color}
                              letter={q.direction === -1 ? axis.right.letter : axis.left.letter}
                              onClick={() => selectAnswer(q.id, -3)}
                              reducedMotion={reducedMotion}
                              dark
                            />
                          </div>
                        ) : q.type === 'abcd' ? (
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                            {q.options?.map(opt => (
                              <ABCDButton 
                                key={opt.label}
                                opt={opt}
                                active={isActive && currentVal === opt.value}
                                color={(opt.value * q.direction) > 0 ? axis.right.color : axis.left.color}
                                letter={(opt.value * q.direction) > 0 ? axis.right.letter : axis.left.letter}
                                onClick={() => selectAnswer(q.id, opt.value)}
                                reducedMotion={reducedMotion}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-45 md:hidden">
                                <span>绝不认同</span>
                                <span>绝对认同</span>
                             </div>
                             <motion.div 
                                animate={reducedMotion ? { opacity: leftActive ? 1 : 0.4 } : { x: leftActive ? -5 : 0, opacity: leftActive ? 1 : 0.4 }}
                                className="hidden md:block w-40 text-center font-black uppercase text-xs tracking-widest"
                             >
                                绝不认同
                             </motion.div>
                             
                             <div className="relative flex w-full flex-1 items-center justify-between gap-2 overflow-visible border-[4px] border-black bg-white px-4 py-8 brutal-shadow-sm sm:gap-4 sm:px-6 sm:py-12">
                                <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-black/10 -translate-y-1/2 sm:left-10 sm:right-10"></div>
                                
                                {scaleOptions.map(opt => {
                                  const isSelected = isActive && currentVal === opt.value
                                  const isRight = (opt.value * q.direction) > 0
                                  const color = opt.value === 0 ? '#000' : isRight ? axis.right.color : axis.left.color
                                  
                                  return (
                                    <div key={opt.value} className="relative flex h-14 flex-1 items-center justify-center sm:h-16">
                                      <motion.button
                                        whileHover={reducedMotion ? undefined : { scale: 1.14, y: -3 }}
                                        whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                                        onClick={() => selectAnswer(q.id, opt.value)}
                                        animate={{ 
                                          width: isSelected ? 56 : 24, 
                                          height: isSelected ? 56 : 24,
                                          backgroundColor: isSelected ? color : 'rgba(255,255,255,1)',
                                          borderColor: isSelected ? color : '#000',
                                          rotate: isSelected && opt.value !== 0 ? 45 : 0
                                        }}
                                        transition={getOptionTransition(reducedMotion)}
                                        className="relative z-10 border-[3px] cursor-pointer flex items-center justify-center overflow-hidden"
                                        style={{ borderRadius: opt.value === 0 ? '50%' : '0' }}
                                      >
                                        <AnimatePresence>
                                          {isSelected && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0, rotate: -45 }}
                                              animate={{ opacity: 1, scale: 1, rotate: opt.value !== 0 ? -45 : 0 }}
                                              exit={{ opacity: 0, scale: 0 }}
                                              transition={getOptionTransition(reducedMotion)}
                                              className="text-white font-black text-2xl flex items-center justify-center"
                                            >
                                              {opt.value === 0 ? '●' : opt.value < 0 ? '←' : '→'}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.button>
                                      
                                    </div>
                                  )
                                })}
                             </div>

                             <motion.div 
                                animate={reducedMotion ? { opacity: rightActive ? 1 : 0.4 } : { x: rightActive ? 5 : 0, opacity: rightActive ? 1 : 0.4 }}
                                className="hidden md:block w-40 text-center font-black uppercase text-xs tracking-widest"
                             >
                                绝对认同
                             </motion.div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4 border-t-[6px] border-black pt-8 sm:flex-row sm:items-center sm:justify-between sm:pt-12 sm:border-t-[8px]">
        <BrutalButton bgColor="bg-white" disabled={currentGroupIndex === 0} onClick={goPrev}>
          <ArrowLeft size={24} className="mr-2" /> PREV
        </BrutalButton>
        <div className="hidden text-xs font-black uppercase opacity-40 sm:block">Tactical Analysis Section 0{currentGroupIndex + 1}</div>
        {currentGroupIndex === questionGroups.length - 1 ? (
          <BrutalButton bgColor="bg-[var(--accent-4)]" disabled={answeredCount < questions.length} onClick={finish} showArrow>
            REVEAL DNA
          </BrutalButton>
        ) : (
          <BrutalButton disabled={groupQuestions.some(q => !answeredFlags[q.id])} onClick={goNext} showArrow>
            NEXT STAGE
          </BrutalButton>
        )}
      </div>
    </motion.main>
  )
}

interface BinaryButtonProps {
  label: string
  sub: string
  active: boolean
  color: string
  letter: string
  onClick: () => void
  reducedMotion: boolean
  dark?: boolean
}

function BinaryButton({ label, sub, active, color, letter, onClick, reducedMotion, dark = false }: BinaryButtonProps) {
  const transition = getOptionTransition(reducedMotion)

  return (
    <motion.button 
      whileHover={reducedMotion ? undefined : { y: -6, scale: 1.015 }}
      whileTap={reducedMotion ? undefined : { y: -2, scale: 0.975 }}
      animate={{
        backgroundColor: active ? color : dark ? INK_COLOR : SURFACE_COLOR,
        color: active || dark ? SURFACE_COLOR : INK_COLOR,
        y: active && !reducedMotion ? -4 : 0,
      }}
      transition={transition}
      onClick={onClick}
      className="group relative flex min-h-[180px] flex-1 flex-col justify-between overflow-hidden border-[4px] border-black p-6 text-left brutal-shadow sm:min-h-[200px] sm:border-[6px] sm:p-8 lg:p-10"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: active ? 0.12 : 0 }}
        transition={transition}
        style={{ backgroundColor: color }}
      />
      <motion.div
        className="absolute left-10 right-10 top-8 h-[3px] bg-current pointer-events-none"
        animate={{ opacity: active ? 0.24 : dark ? 0.3 : 0.14, scaleX: active ? 1 : 0.55 }}
        transition={transition}
        style={{ originX: 0 }}
      />

      <SelectionGlow active={active} color={color} reducedMotion={reducedMotion} />
      <div className="relative z-10">
        <motion.div
          animate={{ opacity: active ? 1 : 0.92 }}
          transition={transition}
          className="mb-2 text-3xl font-archivo leading-none sm:text-4xl"
        >
          {label}
        </motion.div>
        <motion.div
          animate={{ opacity: active ? 0.82 : 0.62 }}
          transition={transition}
          className="text-xs font-black uppercase tracking-widest sm:text-sm"
        >
          {sub}
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 text-xs font-black uppercase tracking-[0.28em]"
        animate={{ opacity: active ? 0.8 : 0.38, y: active && !reducedMotion ? -2 : 0 }}
        transition={transition}
      >
        Tap To Lock In
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, x: 18, y: 18 }}
            animate={reducedMotion ? { opacity: 0.18 } : { opacity: 0.18, scale: 1, x: 0, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.88, x: 12, y: 12 }}
            transition={transition}
            className="absolute -right-8 -bottom-8 text-[160px] font-archivo pointer-events-none"
          >
            {letter}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

interface ABCDButtonProps {
  opt: QuestionOption
  active: boolean
  color: string
  letter: string
  onClick: () => void
  reducedMotion: boolean
}

function ABCDButton({ opt, active, color, letter, onClick, reducedMotion }: ABCDButtonProps) {
  const transition = getOptionTransition(reducedMotion)

  return (
    <motion.button
      whileHover={reducedMotion ? undefined : { y: -5, scale: 1.01 }}
      whileTap={reducedMotion ? undefined : { y: -2, scale: 0.98 }}
      animate={{
        backgroundColor: active ? color : SURFACE_COLOR,
        color: active ? SURFACE_COLOR : INK_COLOR,
        y: active && !reducedMotion ? -3 : 0,
      }}
      transition={transition}
      onClick={onClick}
      className="group relative flex min-h-[152px] items-center overflow-hidden border-[4px] border-black p-6 text-left brutal-shadow sm:min-h-[160px] sm:p-8"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: active ? 0.12 : 0 }}
        transition={transition}
        style={{ backgroundColor: color }}
      />
      <motion.div
        className="absolute left-8 right-8 top-6 h-[2px] bg-current pointer-events-none"
        animate={{ opacity: active ? 0.22 : 0.12, scaleX: active ? 1 : 0.48 }}
        transition={transition}
        style={{ originX: 0 }}
      />

      <SelectionGlow active={active} color={color} reducedMotion={reducedMotion} />
      <div className="relative z-10 flex w-full items-center gap-5 sm:gap-8">
        <motion.div
          animate={{ opacity: active ? 0.28 : 0.12, scale: active ? 1.08 : 1 }}
          transition={transition}
          className="font-archivo text-5xl leading-none sm:text-6xl"
        >
          {opt.label}
        </motion.div>
        <motion.div
          animate={{ opacity: active ? 1 : 0.94 }}
          transition={transition}
          className="flex-1 font-black text-lg leading-[1.45] sm:text-xl"
        >
          {opt.text}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, x: 18, y: 18 }}
            animate={reducedMotion ? { opacity: 0.18 } : { opacity: 0.18, scale: 1, x: 0, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10, y: 10 }}
            transition={transition}
            className="absolute -right-4 -bottom-4 text-[120px] font-archivo pointer-events-none"
          >
            {letter}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

interface SelectionGlowProps {
  active: boolean
  color: string
  reducedMotion: boolean
}

function SelectionGlow({ active, color, reducedMotion }: SelectionGlowProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={reducedMotion ? { opacity: 0.1 } : { opacity: 0.14, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          transition={getOptionTransition(reducedMotion)}
          className="absolute inset-6 rounded-[24px] blur-2xl pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  )
}
