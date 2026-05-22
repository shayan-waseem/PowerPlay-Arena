import React from 'react';
import { motion } from 'framer-motion';

const GanttChart = ({ ganttData }) => {
  if (!ganttData || ganttData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-darkBorder rounded-xl bg-darkCard/30 text-gray-500 font-display text-sm tracking-wider">
        NO GANTT TIMELINE DATA AVAILABLE
      </div>
    );
  }

  // Find total simulation runtime
  const totalTime = Math.max(...ganttData.map(item => item.end));

  // A list of vibrant retro color classes to rotate through
  const colors = [
    { bg: 'bg-neonBlue/20', border: 'border-neonBlue', text: 'text-neonBlue', shadow: 'shadow-glowBlue/20' },
    { bg: 'bg-neonPurple/20', border: 'border-neonPurple', text: 'text-neonPurple', shadow: 'shadow-glowPurple/20' },
    { bg: 'bg-neonPink/20', border: 'border-neonPink', text: 'text-neonPink', shadow: 'shadow-glowPink/20' },
    { bg: 'bg-neonGreen/20', border: 'border-neonGreen', text: 'text-neonGreen', shadow: 'shadow-glowGreen/20' },
    { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400', shadow: 'shadow-yellow-500/10' }
  ];

  // Helper to assign a color index per process ID (to keep identical processes in the same color)
  let processColorMap = {};
  let colorCounter = 0;

  ganttData.forEach(item => {
    if (item.id === 'IDLE') {
      processColorMap[item.id] = {
        bg: 'bg-darkBorder/40',
        border: 'border-gray-700',
        text: 'text-gray-500',
        shadow: 'none'
      };
    } else if (!processColorMap[item.id]) {
      processColorMap[item.id] = colors[colorCounter % colors.length];
      colorCounter++;
    }
  });

  return (
    <div className="w-full glass-panel border border-darkBorder p-6 rounded-xl flex flex-col gap-6 select-none overflow-x-auto">
      <div className="flex justify-between items-center pb-2 border-b border-darkBorder/50">
        <h4 className="font-display font-bold text-sm tracking-wider text-white">GANTT TIMELINE VISUALIZATION</h4>
        <span className="font-mono text-xs text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded border border-neonBlue/20">
          TOTAL DURATION: {totalTime} SEC/MIN
        </span>
      </div>

      {/* Gantt Timeline Container */}
      <div className="min-w-[600px] flex flex-col gap-4 relative py-2">
        
        {/* Timeline blocks bar */}
        <div className="h-16 w-full bg-darkBg border border-darkBorder rounded-xl relative overflow-hidden flex shadow-inner">
          {ganttData.map((block, idx) => {
            const blockWidth = ((block.end - block.start) / totalTime) * 100;
            const styleIdx = processColorMap[block.id];

            return (
              <motion.div
                key={idx}
                initial={{ width: 0 }}
                animate={{ width: `${blockWidth}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                className={`h-full border-r ${styleIdx.border} ${styleIdx.bg} relative flex flex-col justify-center items-center px-1 overflow-hidden group cursor-pointer transition-all hover:brightness-125`}
                style={{ width: `${blockWidth}%` }}
              >
                <span className={`font-display text-[10px] font-bold ${styleIdx.text} tracking-wider truncate max-w-full px-1`}>
                  {block.id === 'IDLE' ? 'IDLE' : block.id}
                </span>
                
                {/* Popover detailed execution statistics on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col gap-1 p-2 bg-darkBg border border-darkBorder rounded-lg text-[10px] font-mono leading-none z-20 shadow-xl min-w-[120px] pointer-events-none">
                  <p className="text-white font-bold font-display tracking-wider border-b border-darkBorder pb-1 mb-1 truncate">{block.name}</p>
                  <p className="text-gray-400">ID: <span className="text-white">{block.id}</span></p>
                  <p className="text-gray-400">Start: <span className="text-neonBlue">{block.start}</span></p>
                  <p className="text-gray-400">End: <span className="text-neonPurple">{block.end}</span></p>
                  <p className="text-gray-400">Duration: <span className="text-neonGreen">{block.end - block.start}</span></p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline Grid ticks */}
        <div className="w-full flex justify-between px-1 relative">
          {Array.from({ length: Math.min(totalTime + 1, 11) }).map((_, idx) => {
            const val = Math.round((totalTime / 10) * idx);
            if (val > totalTime) return null;
            return (
              <div key={idx} className="flex flex-col items-center select-none">
                <div className="w-0.5 h-1.5 bg-darkBorder"></div>
                <span className="font-mono text-[10px] text-gray-500 mt-1">{val}</span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Gantt Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-darkBorder/40 text-[10px] font-semibold tracking-wider font-mono">
        {Object.keys(processColorMap).map((id, index) => {
          if (id === 'IDLE') return null;
          const style = processColorMap[id];
          const block = ganttData.find(item => item.id === id);
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded border ${style.border} ${style.bg} ${style.shadow}`}></span>
              <span className="text-gray-400 uppercase">{block?.name || id}</span>
            </div>
          );
        })}
        {processColorMap['IDLE'] && (
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded border border-gray-700 bg-darkBorder/40"></span>
            <span className="text-gray-500 uppercase">CPU IDLE (NO VISITOR QUEUED)</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default GanttChart;
