import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, AlertTriangle, ArrowRight, UserCheck, PlayCircle, Milestone } from 'lucide-react';

const QueueVisualizer = ({
  processes,
  ganttData,
  currentStep,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  activeProcessId,
  readyQueue,
  completedQueue
}) => {

  return (
    <div className="w-full glass-panel border border-darkBorder p-6 rounded-xl flex flex-col gap-6 select-none">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-darkBorder/40">
        <div>
          <h4 className="font-display font-bold text-sm tracking-wider text-white">REAL-TIME QUEUE TRANSITIONS</h4>
          <p className="text-[11px] text-gray-400 mt-1 font-mono">STEP {currentStep} TIME UNIT | VISITING CPU SCHEDULER</p>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg text-xs font-bold font-display tracking-wider transition-all"
            >
              PAUSE
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={processes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neonGreen/10 hover:bg-neonGreen/20 text-neonGreen border border-neonGreen/30 rounded-lg text-xs font-bold font-display tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none shadow-glowGreen/10 hover:shadow-glowGreen/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              RUN PLAYBACK
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 bg-darkBg hover:bg-darkBorder border border-darkBorder rounded-lg text-xs font-bold font-display text-gray-300 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>
        </div>
      </div>

      {/* CORE SIMULATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch relative min-h-[300px]">
        
        {/* 1. READY QUEUE */}
        <div className="flex flex-col gap-3 p-4 bg-darkBg/60 border border-darkBorder/60 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-center text-[10px] font-bold font-display tracking-wider text-neonBlue pb-2 border-b border-darkBorder/30">
            <span>READY QUEUE (WAITING)</span>
            <span className="bg-neonBlue/10 px-1.5 py-0.5 rounded font-mono text-[9px]">{readyQueue.length} WAITING</span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-1">
            <AnimatePresence mode="popLayout">
              {readyQueue.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[150px] flex flex-col justify-center items-center text-center text-gray-500 font-mono text-[10px]"
                >
                  <Milestone className="w-6 h-6 mb-2 text-darkBorder animate-pulse" />
                  NO VISITORS IN READY STATE
                </motion.div>
              ) : (
                readyQueue.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layoutId={`p-${p.id}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex justify-between items-center p-3 rounded-lg border border-neonBlue/20 bg-neonBlue/5 text-xs text-neonBlue"
                  >
                    <div>
                      <p className="font-semibold text-white truncate max-w-[130px]">{p.name}</p>
                      <p className="text-[9px] font-mono opacity-80 mt-0.5">Burst: {p.burstTime}s | Arr: {p.arrivalTime}s</p>
                    </div>
                    <span className="font-mono font-bold text-[10px] bg-neonBlue/20 px-2 py-0.5 rounded uppercase border border-neonBlue/30 shadow-sm shadow-glowBlue/5">
                      READY
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 2. THE RESOURCE (CPU CORE) */}
        <div className="flex flex-col gap-3 p-4 bg-darkBg/60 border border-darkBorder/60 rounded-xl relative overflow-hidden items-center justify-center">
          <div className="w-full text-center text-[10px] font-bold font-display tracking-wider text-neonPurple pb-2 border-b border-darkBorder/30 mb-auto">
            ACTIVE ENTERTAINMENT RESOURCE (CPU CORE)
          </div>

          <div className="flex flex-col items-center justify-center my-6 text-center w-full">
            <AnimatePresence mode="wait">
              {activeProcessId && activeProcessId !== 'IDLE' ? (
                (() => {
                  const activeProc = processes.find(p => p.id === activeProcessId);
                  return (
                    <motion.div
                      key={activeProcessId}
                      initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.7, opacity: 0, rotate: 5 }}
                      className="flex flex-col items-center p-6 border-2 border-neonPurple bg-neonPurple/5 rounded-2xl w-full max-w-[200px] shadow-glowPurple relative"
                    >
                      <div className="w-12 h-12 bg-neonPurple/15 rounded-full flex items-center justify-center text-neonPurple animate-pulse-glow border border-neonPurple/30 mb-3 shadow-glowPurple">
                        <PlayCircle className="w-6 h-6 animate-spin [animation-duration:6s]" />
                      </div>
                      
                      <p className="font-display font-black text-sm text-white tracking-widest truncate max-w-[160px]">{activeProc?.name}</p>
                      <p className="font-mono text-[9px] text-neonPurple font-semibold mt-1">PROCESS ID: {activeProc?.id}</p>
                      
                      <div className="w-full mt-4 flex items-center justify-between font-mono text-[9px] text-gray-400">
                        <span>PRIORITY: <b className="text-white">{activeProc?.priority}</b></span>
                        <span>BURST: <b className="text-white">{activeProc?.burstTime}s</b></span>
                      </div>

                      <span className="mt-4 font-mono font-bold text-[9px] bg-neonPurple text-white px-2 py-0.5 rounded shadow-glowPurple">
                        EXECUTING (RUNNING)
                      </span>
                    </motion.div>
                  );
                })()
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center p-6 border border-dashed border-gray-700 bg-darkCard/25 rounded-2xl w-full max-w-[200px]"
                >
                  <div className="w-12 h-12 bg-darkBorder/40 rounded-full flex items-center justify-center text-gray-500 mb-3 border border-darkBorder">
                    <AlertTriangle className="w-5 h-5 animate-pulse text-yellow-500/70" />
                  </div>
                  <p className="font-display font-black text-sm text-gray-400 tracking-wider">CPU IDLE</p>
                  <p className="font-mono text-[9px] text-gray-500 mt-1">AWAITING PROCESSES</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full mt-auto text-center flex justify-center items-center gap-1.5 text-[9px] font-mono text-gray-500">
            <span>READY STATE</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-neonPurple font-bold">RUNNING</span>
            <ArrowRight className="w-3 h-3" />
            <span>TERMINATED</span>
          </div>
        </div>

        {/* 3. TERMINATED LIST */}
        <div className="flex flex-col gap-3 p-4 bg-darkBg/60 border border-darkBorder/60 rounded-xl relative overflow-hidden">
          <div className="flex justify-between items-center text-[10px] font-bold font-display tracking-wider text-neonGreen pb-2 border-b border-darkBorder/30">
            <span>TERMINATED PROCESSES (COMPLETED)</span>
            <span className="bg-neonGreen/10 px-1.5 py-0.5 rounded font-mono text-[9px]">{completedQueue.length} DONE</span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-1">
            <AnimatePresence mode="popLayout">
              {completedQueue.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-[150px] flex flex-col justify-center items-center text-center text-gray-500 font-mono text-[10px]"
                >
                  <UserCheck className="w-6 h-6 mb-2 text-darkBorder" />
                  NO COMPLETED ACTIVITIES YET
                </motion.div>
              ) : (
                completedQueue.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    layoutId={`p-${p.id}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex justify-between items-center p-3 rounded-lg border border-neonGreen/20 bg-neonGreen/5 text-xs text-neonGreen"
                  >
                    <div>
                      <p className="font-semibold text-white truncate max-w-[130px]">{p.name}</p>
                      <p className="text-[9px] font-mono opacity-80 mt-0.5">Wait: {p.waitingTime}s | Turnaround: {p.turnaroundTime}s</p>
                    </div>
                    <span className="font-mono font-bold text-[9px] bg-neonGreen/25 px-1.5 py-0.5 rounded uppercase border border-neonGreen/30">
                      FINISHED
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
};

export default QueueVisualizer;
