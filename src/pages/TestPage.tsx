import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { ArrowLeft } from "lucide-react";
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
} from "../state/mabti";
import { BrutalButton } from "../components/BrutalUI";
import { MabtiAvatar } from "../ui/mabti-avatar";

export function TestPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<AnswerMap>(() => createBlankAnswers());
  const [answeredFlags, setAnsweredFlags] = useState<Record<string, boolean>>(
    {},
  );
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const [companion, setCompanion] = useState<MabtiResult | null>(null);
  const companionControls = useAnimation();

  useEffect(() => {
    // Randomly select 1 distinct companion on mount
    const allSamples = buildSampleResults();
    const shuffled = [...allSamples].sort(() => 0.5 - Math.random());
    setCompanion(shuffled[0]);
  }, []);

  const currentGroup = questionGroups[currentGroupIndex];
  const groupQuestions = currentGroup.questionIds
    .map((id) => questions.find((q) => q.id === id))
    .filter((q): q is Question => Boolean(q));

  const answeredCount = Object.values(answeredFlags).filter(Boolean).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  useEffect(() => {
    if (answeredCount > 0) {
      void companionControls.start({
        y: [0, -40, 0],
        scale: [1, 1.15, 1],
        rotate: [0, 15, 0],
        transition: { duration: 0.5, type: "spring", bounce: 0.6 },
      });
    }
  }, [answeredCount, companionControls]);

  const selectAnswer = (id: string, val: number) => {
    setAnswers((p) => ({ ...p, [id]: val }));

    const wasAlreadyAnswered = answeredFlags[id];
    setAnsweredFlags((p) => ({ ...p, [id]: true }));

    // Auto-advance logic
    if (!wasAlreadyAnswered && currentGroupIndex < questionGroups.length - 1) {
      const groupQuestionIds = questionGroups[currentGroupIndex].questionIds;
      const othersAnswered = groupQuestionIds
        .filter((qId) => qId !== id)
        .every((qId) => answeredFlags[qId]);

      if (othersAnswered) {
        setTimeout(() => {
          setCurrentGroupIndex((p) =>
            Math.min(questionGroups.length - 1, p + 1),
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500);
      }
    }
  };

  const goNext = () => {
    setCurrentGroupIndex((p) => Math.min(questionGroups.length - 1, p + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    setCurrentGroupIndex((p) => Math.max(0, p - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = () => {
    const res = answersToResult(answers, true);
    persistResult(res);
    void navigate({ to: "/result", search: { seed: res.seed } });
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10 sm:py-20 relative"
    >
      {/* Companions / Spectators Floating at bottom right */}
      <div className="fixed bottom-8 right-8 z-40 hidden lg:flex pointer-events-none items-end">
        {companion && (
          <motion.div
            animate={companionControls}
            className="w-24 h-24 pointer-events-auto"
            title={`${companion.title} is watching you`}
          >
            <motion.div
              drag
              dragConstraints={{ left: -200, right: 200, top: -400, bottom: 0 }}
              dragElastic={0.4}
              whileHover={{ scale: 1.2, rotate: 5, y: -10 }}
              whileTap={{ scale: 0.9, rotate: -5 }}
              className="cursor-grab active:cursor-grabbing hover:z-50 w-full h-full drop-shadow-xl"
            >
              {/* Pass bare={true} to remove card and tags */}
              <MabtiAvatar result={companion} size={96} bare={true} />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Test Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-20 border-b-[4px] border-black pb-8 gap-8">
        <motion.div
          key={currentGroupIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="font-black uppercase text-lg sm:text-xl mb-2 text-[var(--accent-1)] tracking-widest">
            Stage {currentGroupIndex + 1} / {questionGroups.length}
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-archivo leading-[0.9]">
            {currentGroup.title}
          </h1>
        </motion.div>
        <div className="w-full md:w-64 text-left md:text-right shrink-0">
          <div className="font-black mb-2 uppercase tracking-widest text-sm">
            DNA Sequenced: {progress}%
          </div>
          <div className="h-6 sm:h-8 border-[4px] border-black bg-slate-100 overflow-hidden w-full relative">
            <motion.div
              className="h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentGroupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col"
          >
            {groupQuestions.map((q, i) => {
              const axis = axisDefinitions.find((a) => a.key === q.axis)!;
              const isActive = answeredFlags[q.id];
              const currentVal = answers[q.id];

              // Dynamic coloring based on selection
              const leftActive = isActive && currentVal < 0;
              const rightActive = isActive && currentVal > 0;

              return (
                <div
                  key={q.id}
                  className="py-16 sm:py-24 border-b-[4px] border-black group"
                >
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                    <div className="hidden lg:block text-[140px] font-archivo opacity-5 leading-none select-none transition-opacity duration-300 group-hover:opacity-20 shrink-0 w-[160px]">
                      {(currentGroupIndex * 4 + i + 1)
                        .toString()
                        .padStart(2, "0")}
                    </div>

                    <div className="flex-1 w-full">
                      <div className="flex gap-4 items-center mb-6 flex-wrap">
                        <div className="lg:hidden text-4xl font-archivo opacity-20 leading-none">
                          {(currentGroupIndex * 4 + i + 1)
                            .toString()
                            .padStart(2, "0")}
                        </div>
                        <div className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest">
                          {q.tag}
                        </div>
                        <div className="text-xs font-black uppercase opacity-40 tracking-widest">
                          {axis.label}
                        </div>
                      </div>

                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.2] lg:leading-[1.1] max-w-4xl mb-6">
                        {q.prompt}
                      </h3>

                      <p className="text-lg sm:text-xl font-bold opacity-60 mb-12 italic bg-[#eee] inline-block px-4 py-2 border-l-[4px] border-black">
                        —— {q.caption}
                      </p>

                      {q.type === 'binary' ? (
                        <div className="flex flex-col sm:flex-row gap-6 w-full">
                          <motion.button 
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectAnswer(q.id, 3)}
                            className="flex-1 relative border-[4px] border-black p-8 font-black text-3xl sm:text-4xl uppercase transition-colors cursor-pointer group brutal-shadow overflow-hidden text-left flex flex-col justify-between min-h-[160px]"
                            style={{
                              backgroundColor: isActive && currentVal === 3 ? (q.direction === 1 ? axis.right.color : axis.left.color) : 'white',
                              color: isActive && currentVal === 3 ? 'white' : 'black',
                            }}
                          >
                            <span className="relative z-10">THAT'S ME</span>
                            <span className="relative z-10 text-lg opacity-60 mt-4">绝对如此</span>
                            {isActive && currentVal === 3 && (
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.2 }}
                                className="absolute -right-10 -bottom-10 text-[120px] font-archivo pointer-events-none"
                              >
                                {q.direction === 1 ? axis.right.letter : axis.left.letter}
                              </motion.div>
                            )}
                          </motion.button>

                          <motion.button 
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => selectAnswer(q.id, -3)}
                            className="flex-1 relative border-[4px] border-black p-8 font-black text-3xl sm:text-4xl uppercase transition-colors cursor-pointer group brutal-shadow overflow-hidden text-left flex flex-col justify-between min-h-[160px]"
                            style={{
                              backgroundColor: isActive && currentVal === -3 ? (q.direction === -1 ? axis.right.color : axis.left.color) : '#1a1a1a',
                              color: 'white',
                            }}
                          >
                            <span className="relative z-10">NO WAY</span>
                            <span className="relative z-10 text-lg opacity-60 mt-4">绝不可能</span>
                            {isActive && currentVal === -3 && (
                              <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.2 }}
                                className="absolute -right-10 -bottom-10 text-[120px] font-archivo pointer-events-none"
                              >
                                {q.direction === -1 ? axis.right.letter : axis.left.letter}
                              </motion.div>
                            )}
                          </motion.button>
                        </div>
                      ) : q.type === 'abcd' && q.options ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                          {q.options.map((opt) => {
                            const isSelected = isActive && currentVal === opt.value;
                            // value > 0 means agree with prompt (which points to q.direction)
                            const isRightAxis = (opt.value * q.direction) > 0;
                            const optColor = opt.value === 0 ? '#1a1a1a' : isRightAxis ? axis.right.color : axis.left.color;
                            
                            return (
                              <motion.button
                                key={opt.label}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => selectAnswer(q.id, opt.value)}
                                className="relative border-[4px] border-black p-6 transition-colors cursor-pointer group brutal-shadow overflow-hidden text-left min-h-[140px] flex items-center"
                                style={{
                                  backgroundColor: isSelected ? optColor : 'white',
                                  color: isSelected ? 'white' : 'black',
                                }}
                              >
                                <div className="flex gap-4 sm:gap-6 items-center relative z-10 w-full">
                                  <div className="font-archivo text-4xl sm:text-5xl opacity-30 group-hover:opacity-100 transition-opacity">{opt.label}</div>
                                  <div className="flex-1 font-bold text-base sm:text-lg leading-snug">{opt.text}</div>
                                </div>
                                {isSelected && (
                                  <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 0.15 }}
                                    className="absolute -right-4 -bottom-4 text-[120px] font-archivo pointer-events-none"
                                  >
                                    {isRightAxis ? axis.right.letter : axis.left.letter}
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="w-full">
                          <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 relative">
                            {/* Left Label */}
                          <motion.div
                            className="w-full md:w-48 p-4 border-[4px] border-black font-black uppercase text-center text-sm tracking-widest shrink-0 brutal-shadow-sm transition-colors duration-300 z-10 flex-col justify-center hidden md:flex"
                            animate={{
                              backgroundColor: leftActive
                                ? axis.left.color
                                : "white",
                              color: leftActive ? "white" : "black",
                              y: leftActive ? -2 : 0,
                              x: leftActive ? -2 : 0,
                              boxShadow: leftActive
                                ? "6px 6px 0px #1a1a1a"
                                : "4px 4px 0px #1a1a1a",
                            }}
                          >
                            {axis.left.label}
                          </motion.div>

                          {/* Scale Options */}
                          <div className="flex-1 flex justify-between items-center gap-2 sm:gap-4 w-full relative py-6 md:py-0 px-2 sm:px-8">
                            <div className="absolute top-1/2 left-6 right-6 h-[4px] bg-black -translate-y-1/2 z-0"></div>

                            {scaleOptions.map((opt) => {
                              const isSelected =
                                isActive && currentVal === opt.value;

                              let btnColor = "white";
                              if (isSelected) {
                                btnColor =
                                  opt.value < 0
                                    ? axis.left.color
                                    : opt.value > 0
                                      ? axis.right.color
                                      : "#1a1a1a";
                              }

                              // Size calculation to make it feel more deliberate and less cluttered
                              const baseSize =
                                opt.value === 0
                                  ? 28
                                  : Math.max(28, opt.size * 0.65);
                              const selectedSize = baseSize * 1.35;

                              return (
                                <div
                                  key={opt.value}
                                  className="relative flex items-center justify-center flex-1 max-w-[70px] aspect-square"
                                >
                                  <motion.button
                                    whileHover={{ scale: 1.15, y: -4 }}
                                    whileTap={{ scale: 0.9 }}
                                    animate={{
                                      backgroundColor: btnColor,
                                      width: isSelected
                                        ? selectedSize
                                        : baseSize,
                                      height: isSelected
                                        ? selectedSize
                                        : baseSize,
                                      borderRadius:
                                        opt.value === 0 ? "50%" : "0",
                                      rotate:
                                        isSelected && opt.value !== 0 ? 45 : 0,
                                    }}
                                    className="absolute z-10 border-[4px] border-black flex items-center justify-center font-black text-white transition-colors cursor-pointer group"
                                    onClick={() =>
                                      selectAnswer(q.id, opt.value)
                                    }
                                  >
                                    {/* Inner SVG Draw Animation when selected */}
                                    <AnimatePresence>
                                      {isSelected && (
                                        <motion.svg
                                          initial={{ opacity: 0 }}
                                          animate={{
                                            opacity: 1,
                                            rotate: opt.value !== 0 ? -45 : 0,
                                          }}
                                          exit={{ opacity: 0 }}
                                          className="absolute inset-0 w-full h-full pointer-events-none"
                                          viewBox="0 0 100 100"
                                        >
                                          {opt.value === 0 ? (
                                            <motion.circle
                                              cx="50"
                                              cy="50"
                                              r="20"
                                              fill="white"
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 20,
                                              }}
                                            />
                                          ) : opt.value < 0 ? (
                                            <motion.path
                                              d="M60 25 L35 50 L60 75"
                                              fill="none"
                                              stroke="white"
                                              strokeWidth="12"
                                              strokeLinecap="square"
                                              strokeLinejoin="miter"
                                              initial={{ pathLength: 0 }}
                                              animate={{ pathLength: 1 }}
                                              transition={{
                                                duration: 0.3,
                                                ease: "easeOut",
                                              }}
                                            />
                                          ) : (
                                            <motion.path
                                              d="M40 25 L65 50 L40 75"
                                              fill="none"
                                              stroke="white"
                                              strokeWidth="12"
                                              strokeLinecap="square"
                                              strokeLinejoin="miter"
                                              initial={{ pathLength: 0 }}
                                              animate={{ pathLength: 1 }}
                                              transition={{
                                                duration: 0.3,
                                                ease: "easeOut",
                                              }}
                                            />
                                          )}
                                        </motion.svg>
                                      )}
                                    </AnimatePresence>

                                    {/* Unselected subtle indicator */}
                                    {!isSelected && (
                                      <div className="w-2 h-2 bg-black opacity-20 group-hover:opacity-100 transition-opacity rounded-full"></div>
                                    )}
                                  </motion.button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Mobile Labels (shown above scale on small screens) */}
                          <div className="flex justify-between w-full md:hidden absolute -top-4 left-0 right-0 px-2 pointer-events-none">
                            <span
                              className="text-xs font-black uppercase text-[var(--accent-1)]"
                              style={{ color: axis.left.color }}
                            >
                              {axis.left.label}
                            </span>
                            <span
                              className="text-xs font-black uppercase text-[var(--accent-2)]"
                              style={{ color: axis.right.color }}
                            >
                              {axis.right.label}
                            </span>
                          </div>

                          {/* Right Label */}
                          <motion.div
                            className="w-full md:w-48 p-4 border-4 border-black font-black uppercase text-center text-sm tracking-widest shrink-0 brutal-shadow-sm transition-colors duration-300 z-10 flex-col justify-center hidden md:flex"
                            animate={{
                              backgroundColor: rightActive
                                ? axis.right.color
                                : "white",
                              color: rightActive ? "white" : "black",
                              y: rightActive ? -2 : 0,
                              x: rightActive ? -2 : 0,
                              boxShadow: rightActive
                                ? "6px 6px 0px #1a1a1a"
                                : "4px 4px 0px #1a1a1a",
                            }}
                          >
                            {axis.right.label}
                          </motion.div>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 sm:mt-24 flex flex-col sm:flex-row justify-between gap-6">
        <BrutalButton
          bgColor="bg-white"
          disabled={currentGroupIndex === 0}
          onClick={goPrev}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2" strokeWidth={3} /> BACK
        </BrutalButton>

        {currentGroupIndex === questionGroups.length - 1 ? (
          <BrutalButton
            bgColor="bg-[var(--accent-1)]"
            textColor="text-white"
            disabled={answeredCount < questions.length}
            onClick={finish}
            className="w-full sm:w-auto"
            showArrow
          >
            REVEAL MY DNA
          </BrutalButton>
        ) : (
          <BrutalButton
            disabled={groupQuestions.some((q) => !answeredFlags[q.id])}
            onClick={goNext}
            className="w-full sm:w-auto"
            showArrow
          >
            NEXT STAGE
          </BrutalButton>
        )}
      </div>
    </motion.main>
  );
}
