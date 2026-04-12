import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence, useAnimation } from 'motion/react'
import { ArrowLeft, Target, Zap, ShieldCheck } from 'lucide-react'
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

export function TestPage() {
  const navigate = useNavigate()
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
    if (answeredCount > 0) {
      void companionControls.start({
        y: [0, -40, 0],
        scale: [1, 1.15, 1],
        rotate: [0, 15, 0],
        transition: { duration: 0.5, type: "spring", bounce: 0.6 }
      })
    }
  }, [answeredCount, companionControls])

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
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 600)
      }
    }
  }

  const goNext = () => {
    setCurrentGroupIndex(p => Math.min(questionGroups.length - 1, p + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const goPrev = () => {
    setCurrentGroupIndex(p => Math.max(0, p - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      className="max-w-[1200px] mx-auto px-4 sm:px-8 py-12 sm:py-24 relative"
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
      <div className="mb-20 border-b-[8px] border-black pb-10 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <div className="flex gap-3 items-center mb-4">
            <span className="bg-[var(--accent-1)] text-white px-3 py-1 font-black text-xs uppercase tracking-widest">Stage 0{currentGroupIndex + 1}</span>
            <span className="font-black text-xs uppercase tracking-widest opacity-40">Tactical Scan in Progress</span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-archivo leading-[0.85] uppercase tracking-tighter">{currentGroup.title}</h1>
        </div>
        <div className="w-full md:w-72 shrink-0">
          <div className="flex justify-between font-black uppercase text-[10px] tracking-widest mb-2">
            <span>Sequencing DNA</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 border-[3px] border-black bg-white overflow-hidden relative">
            <motion.div 
              className="h-full bg-black" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }} 
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-0 mb-32">
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
                <div key={q.id} className="py-20 border-b-[4px] border-black/10 last:border-b-0 group">
                  <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                    <div className="hidden lg:block relative shrink-0 w-[140px] h-[120px]">
                      <div className="text-[120px] font-archivo opacity-[0.03] leading-none select-none">
                        {(currentGroupIndex * 4 + i + 1).toString().padStart(2, '0')}
                      </div>
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex gap-4 items-center mb-8">
                        <div className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-[0.2em]">{q.tag}</div>
                        <div className="h-[2px] w-8 bg-black/10"></div>
                        <div className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">{axis.label}</div>
                      </div>
                      
                      <h3 className="text-3xl sm:text-5xl font-black leading-[1.1] mb-12 max-w-4xl">
                        {q.prompt}
                      </h3>
                      
                      {/* Interaction Area */}
                      <div className="w-full">
                        {q.type === 'binary' ? (
                          <div className="flex flex-col sm:flex-row gap-6">
                            <BinaryButton 
                              label="THAT'S ME" 
                              sub="绝对如此" 
                              active={isActive && currentVal === 3}
                              color={q.direction === 1 ? axis.right.color : axis.left.color}
                              letter={q.direction === 1 ? axis.right.letter : axis.left.letter}
                              onClick={() => selectAnswer(q.id, 3)}
                            />
                            <BinaryButton 
                              label="NO WAY" 
                              sub="绝不可能" 
                              active={isActive && currentVal === -3}
                              color={q.direction === -1 ? axis.right.color : axis.left.color}
                              letter={q.direction === -1 ? axis.right.letter : axis.left.letter}
                              onClick={() => selectAnswer(q.id, -3)}
                              dark
                            />
                          </div>
                        ) : q.type === 'abcd' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {q.options?.map(opt => (
                              <ABCDButton 
                                key={opt.label}
                                opt={opt}
                                active={isActive && currentVal === opt.value}
                                color={(opt.value * q.direction) > 0 ? axis.right.color : axis.left.color}
                                letter={(opt.value * q.direction) > 0 ? axis.right.letter : axis.left.letter}
                                onClick={() => selectAnswer(q.id, opt.value)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row items-center gap-8">
                             <motion.div 
                                animate={{ x: leftActive ? -5 : 0, opacity: leftActive ? 1 : 0.4 }}
                                className="hidden md:block w-40 text-center font-black uppercase text-xs tracking-widest"
                             >
                                绝不认同
                             </motion.div>
                             
                             <div className="flex-1 flex justify-between items-center gap-2 sm:gap-4 w-full relative py-12 px-6 border-[4px] border-black bg-white brutal-shadow-sm overflow-visible">
                                <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-black/10 -translate-y-1/2"></div>
                                
                                {scaleOptions.map(opt => {
                                  const isSelected = isActive && currentVal === opt.value
                                  const isRight = (opt.value * q.direction) > 0
                                  const color = opt.value === 0 ? '#000' : isRight ? axis.right.color : axis.left.color
                                  
                                  return (
                                    <div key={opt.value} className="relative flex-1 flex justify-center items-center h-16">
                                      <motion.button
                                        whileHover={{ scale: 1.2, y: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => selectAnswer(q.id, opt.value)}
                                        animate={{ 
                                          width: isSelected ? 56 : 24, 
                                          height: isSelected ? 56 : 24,
                                          backgroundColor: isSelected ? color : 'rgba(255,255,255,1)',
                                          borderColor: isSelected ? color : '#000',
                                          rotate: isSelected && opt.value !== 0 ? 45 : 0
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        className="relative z-10 border-[3px] cursor-pointer flex items-center justify-center overflow-hidden"
                                        style={{ borderRadius: opt.value === 0 ? '50%' : '0' }}
                                      >
                                        <AnimatePresence>
                                          {isSelected && (
                                            <motion.div
                                              initial={{ opacity: 0, scale: 0, rotate: -45 }}
                                              animate={{ opacity: 1, scale: 1, rotate: opt.value !== 0 ? -45 : 0 }}
                                              exit={{ opacity: 0, scale: 0 }}
                                              className="text-white font-black text-2xl flex items-center justify-center"
                                            >
                                              {opt.value === 0 ? '●' : opt.value < 0 ? '←' : '→'}
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.button>
                                      
                                      {/* Selection Indicator Glow */}
                                      {isSelected && (
                                        <motion.div 
                                          layoutId={`glow-${q.id}`}
                                          className="absolute inset-0 bg-current opacity-10 rounded-full blur-xl pointer-events-none"
                                          style={{ color }}
                                        />
                                      )}
                                    </div>
                                  )
                                })}
                             </div>

                             <motion.div 
                                animate={{ x: rightActive ? 5 : 0, opacity: rightActive ? 1 : 0.4 }}
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
      <div className="flex justify-between items-center border-t-[8px] border-black pt-12">
        <BrutalButton bgColor="bg-white" disabled={currentGroupIndex === 0} onClick={goPrev}>
          <ArrowLeft size={24} className="mr-2" /> PREV
        </BrutalButton>
        <div className="text-xs font-black uppercase opacity-40 hidden sm:block">Tactical Analysis Section 0{currentGroupIndex + 1}</div>
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

function BinaryButton({ label, sub, active, color, letter, onClick, dark = false }: any) {
  return (
    <motion.button 
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex-1 relative border-[6px] border-black p-10 brutal-shadow overflow-hidden text-left flex flex-col justify-between min-h-[200px] transition-colors ${dark && !active ? 'bg-black text-white' : 'bg-white text-black'}`}
      style={active ? { backgroundColor: color, color: 'white' } : {}}
    >
      <div className="relative z-10">
        <div className="text-4xl font-archivo leading-none mb-2">{label}</div>
        <div className="text-sm font-black opacity-60 uppercase tracking-widest">{sub}</div>
      </div>
      {active && <div className="absolute -right-8 -bottom-8 text-[160px] font-archivo opacity-20 pointer-events-none">{letter}</div>}
    </motion.button>
  )
}

function ABCDButton({ opt, active, color, letter, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative border-[4px] border-black p-8 brutal-shadow overflow-hidden text-left min-h-[160px] flex items-center bg-white transition-colors"
      style={active ? { backgroundColor: color, color: 'white' } : {}}
    >
      <div className="flex gap-8 items-center relative z-10 w-full">
        <div className="font-archivo text-6xl opacity-10 leading-none">{opt.label}</div>
        <div className="flex-1 font-black text-xl leading-tight">{opt.text}</div>
      </div>
      {active && <div className="absolute -right-4 -bottom-4 text-[120px] font-archivo opacity-20 pointer-events-none">{letter}</div>}
    </motion.button>
  )
}
