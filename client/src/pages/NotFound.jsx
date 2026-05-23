import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArenaContext } from '../context/ArenaContext';
import { ShieldAlert, Home, ArrowLeft, Cpu, Wifi, WifiOff } from 'lucide-react';

const NotFound = () => {
  const { playClick } = useContext(ArenaContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 select-none relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonPink/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neonPurple/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neonBlue/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      
      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-8 text-center relative z-10 max-w-lg"
      >
        {/* Glitching Error Code */}
        <div className="relative">
          <motion.div
            animate={{ 
              textShadow: [
                '0 0 20px rgba(236, 72, 153, 0.5)',
                '0 0 60px rgba(236, 72, 153, 0.8)',
                '0 0 20px rgba(236, 72, 153, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="font-display font-black text-[120px] md:text-[160px] leading-none tracking-widest bg-gradient-to-b from-neonPink via-neonPurple to-transparent bg-clip-text text-transparent select-none"
          >
            404
          </motion.div>
          
          {/* Glitch lines */}
          <motion.div
            animate={{ x: [-2, 2, -1, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute top-1/3 left-0 right-0 h-1 bg-neonPink/30 blur-[1px]"
          ></motion.div>
          <motion.div
            animate={{ x: [2, -2, 1, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute top-2/3 left-0 right-0 h-0.5 bg-neonBlue/20 blur-[1px]"
          ></motion.div>
        </div>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex items-center gap-2 px-4 py-1.5 bg-neonPink/10 border border-neonPink/30 rounded-full"
        >
          <WifiOff className="w-3.5 h-3.5 text-neonPink animate-pulse" />
          <span className="font-display font-bold text-[10px] text-neonPink tracking-[0.2em] uppercase">
            SIGNAL LOST — SECTOR NOT FOUND
          </span>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <h1 className="font-display font-black text-xl md:text-2xl text-white tracking-widest uppercase text-glow-pink">
            ACCESS DENIED — INVALID ROUTE
          </h1>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed max-w-md">
            The requested arena sector does not exist or has been decommissioned. 
            The system cannot locate the requested scheduling resource. Please navigate 
            back to a valid terminal.
          </p>
        </motion.div>

        {/* Terminal Error Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full glass-panel border border-neonPink/20 rounded-xl p-4 text-left"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-darkBorder/40 mb-3">
            <div className="w-2 h-2 rounded-full bg-neonPink animate-pulse"></div>
            <span className="font-mono text-[9px] text-neonPink font-bold tracking-wider uppercase">SYSTEM TERMINAL — ERROR LOG</span>
          </div>
          <div className="font-mono text-[10px] text-gray-400 flex flex-col gap-1">
            <span><span className="text-gray-500">[ERROR]</span> <span className="text-neonPink">Route resolution failed</span></span>
            <span><span className="text-gray-500">[INFO]</span> Requested path: <span className="text-white">{window.location.pathname}</span></span>
            <span><span className="text-gray-500">[INFO]</span> Arena Sector: <span className="text-neonBlue">UNDEFINED</span></span>
            <span><span className="text-gray-500">[WARN]</span> Scheduler cannot allocate CPU to nonexistent process</span>
            <span><span className="text-gray-500">[HELP]</span> Recommended: <span className="text-neonGreen">Return to home terminal</span></span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <Link
            to="/"
            onClick={playClick}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neonPurple to-neonPink text-white hover:opacity-90 rounded-xl text-xs font-bold tracking-widest font-display shadow-glowPurple hover:shadow-glowPink transition-all uppercase"
          >
            <Home className="w-4 h-4" />
            RETURN TO HOME BASE
          </Link>
          <button
            onClick={() => { playClick(); window.history.back(); }}
            className="flex items-center gap-2 px-6 py-3 border border-darkBorder hover:border-gray-500 text-gray-300 rounded-xl text-xs font-bold tracking-widest font-display hover:text-white transition-all uppercase"
          >
            <ArrowLeft className="w-4 h-4" />
            GO BACK
          </button>
        </motion.div>

        {/* Bottom decorative status bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-6 font-mono text-[9px] text-gray-600 mt-4"
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3" /> CPU STATUS: <span className="text-neonGreen">ONLINE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3" /> SECURITY: <span className="text-neonPurple">ACTIVE</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" /> NETWORK: <span className="text-neonBlue">CONNECTED</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
