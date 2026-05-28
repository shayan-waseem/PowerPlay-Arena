import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArenaContext } from '../../context/ArenaContext';
import { Volume2, VolumeX, Menu, X, ShieldAlert, Cpu, LogOut, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { soundEnabled, setSoundEnabled, liveVisitors, digitalTime, playClick } = useContext(ArenaContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    playClick();
    logout();
    navigate('/');
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }
  };

  const navClick = () => {
    playClick();
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-1 transition-all font-display text-sm font-semibold tracking-wider group ${
      isActive
        ? 'text-white'
        : 'text-gray-400 hover:text-white'
    }`;

  const activeIndicator = (
    <motion.div
      layoutId="nav-indicator"
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink rounded-full"
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    />
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-darkBorder/80 shadow-lg" style={{
      background: 'rgba(8, 10, 16, 0.8)',
      backdropFilter: 'blur(20px) saturate(1.2)',
      WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
    }}>
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" onClick={navClick} className="flex items-center gap-2.5 group">
          <motion.div 
            className="p-2 bg-gradient-to-br from-neonPurple to-neonBlue rounded-xl shadow-glowBlue transition-all group-hover:shadow-glowPurple"
            whileHover={{ scale: 1.08, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Cpu className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <span className="font-display font-black text-base bg-gradient-to-r from-white via-gray-200 to-neonBlue bg-clip-text text-transparent tracking-widest leading-none">
              POWER PLAY
            </span>
            <span className="block text-[9px] font-display font-semibold tracking-[0.2em] text-neonPurple -mt-0.5 uppercase text-glow-purple">
              Arena Simulator
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink to="/dashboard" onClick={navClick} className={navLinkClass}>
            {({ isActive }) => (
              <>
                DASHBOARD
                {isActive && activeIndicator}
              </>
            )}
          </NavLink>
          <NavLink to="/simulation" onClick={navClick} className={navLinkClass}>
            {({ isActive }) => (
              <>
                SIMULATION LAB
                {isActive && activeIndicator}
              </>
            )}
          </NavLink>
          <NavLink to="/analytics" onClick={navClick} className={navLinkClass}>
            {({ isActive }) => (
              <>
                ANALYTICS
                {isActive && activeIndicator}
              </>
            )}
          </NavLink>
        </div>

        {/* METRICS & CONTROLS */}
        <div className="hidden md:flex items-center gap-4">
          {/* Live Visitor Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-darkBg/80 border border-darkBorder rounded-full text-xs font-semibold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-50"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neonGreen shadow-glowGreen"></span>
            </span>
            <span className="text-gray-400 tracking-wider font-mono text-[10px]">LIVE:</span>
            <span className="text-neonGreen tracking-widest font-mono font-bold">{liveVisitors}</span>
          </div>

          {/* Time System */}
          <div className="px-3 py-1.5 bg-darkBg/80 border border-darkBorder rounded-full text-xs font-mono font-bold text-neonBlue tracking-wider shadow-inner">
            {digitalTime}
          </div>

          {/* Sound Toggle */}
          <motion.button
            onClick={toggleSound}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled 
                ? 'border-neonPurple text-neonPurple shadow-glowPurple bg-neonPurple/10' 
                : 'border-darkBorder text-gray-500 hover:text-gray-300 hover:border-gray-600'
            }`}
            title={soundEnabled ? "Mute synth sound fx" : "Unmute synth sound fx"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>
        </div>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {isAdmin && (
                <Link
                  to="/powerplay-secret-admin"
                  onClick={navClick}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 border border-neonPink/50 text-neonPink bg-neonPink/5 rounded-lg text-xs font-display font-bold hover:bg-neonPink hover:text-white transition-all tracking-wider shadow-glowPink group"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  ADMIN
                  {/* Notification dot */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neonPink rounded-full border border-darkBg animate-pulse shadow-glowPink"></span>
                </Link>
              )}
              <Link
                to="/profile"
                onClick={navClick}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-darkBorder text-gray-300 hover:text-neonBlue hover:border-neonBlue/50 transition-all rounded-lg text-xs font-display font-semibold"
              >
                <UserIcon className="w-3.5 h-3.5 text-neonBlue" />
                MY TICKETS
              </Link>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-lg text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                LOGOUT
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                onClick={navClick}
                className="px-4 py-1.5 border border-darkBorder text-gray-300 hover:text-white hover:border-gray-500 rounded-lg text-sm font-semibold transition-all"
              >
                SIGN IN
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup"
                  onClick={navClick}
                  className="px-4 py-1.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white hover:opacity-90 rounded-lg text-sm font-bold shadow-glowBlue hover:shadow-glowPurple transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  REGISTER
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled ? 'border-neonPurple text-neonPurple bg-neonPurple/10' : 'border-darkBorder text-gray-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <motion.button
            onClick={() => { playClick(); setMobileMenuOpen(!mobileMenuOpen); }}
            whileTap={{ scale: 0.9 }}
            className="p-2 border border-darkBorder rounded-lg text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

      </div>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-darkBorder/60"
            style={{ backdropFilter: 'blur(20px)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <NavLink to="/dashboard" onClick={navClick} className={({ isActive }) => `text-sm font-display tracking-wider py-2 transition-all ${isActive ? 'text-neonBlue font-bold' : 'text-gray-300 hover:text-neonBlue'}`}>
                DASHBOARD
              </NavLink>
              <NavLink to="/simulation" onClick={navClick} className={({ isActive }) => `text-sm font-display tracking-wider py-2 transition-all ${isActive ? 'text-neonPurple font-bold' : 'text-gray-300 hover:text-neonPurple'}`}>
                SIMULATION LAB
              </NavLink>
              <NavLink to="/analytics" onClick={navClick} className={({ isActive }) => `text-sm font-display tracking-wider py-2 transition-all ${isActive ? 'text-neonPink font-bold' : 'text-gray-300 hover:text-neonPink'}`}>
                ANALYTICS
              </NavLink>
              
              <div className="gradient-divider my-1"></div>

              {/* Mobile visitors & clock */}
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonGreen opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neonGreen"></span>
                  </span>
                  <span className="text-gray-400 font-mono">VISITORS: <b className="text-neonGreen">{liveVisitors}</b></span>
                </div>
                <div className="text-xs font-mono text-neonBlue bg-darkBg px-2.5 py-1 border border-darkBorder rounded-lg">
                  {digitalTime}
                </div>
              </div>

              <div className="gradient-divider my-1"></div>

              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  {isAdmin && (
                    <Link
                      to="/powerplay-secret-admin"
                      onClick={navClick}
                      className="relative flex items-center justify-center gap-1.5 py-2.5 border border-neonPink text-neonPink bg-neonPink/5 rounded-xl text-xs font-bold shadow-glowPink"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      ADMIN PANEL
                      <span className="absolute top-1 right-2 w-2 h-2 bg-neonPink rounded-full animate-pulse"></span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={navClick}
                    className="flex items-center justify-center gap-1.5 py-2.5 border border-darkBorder text-gray-300 rounded-xl text-xs font-semibold hover:border-neonBlue hover:text-neonBlue transition-all"
                  >
                    <UserIcon className="w-4 h-4 text-neonBlue" />
                    MY TICKETS
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1 py-2.5 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    LOGOUT
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={navClick}
                    className="py-2.5 border border-darkBorder text-center text-gray-300 rounded-xl text-sm font-semibold hover:border-gray-500 transition-all"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    to="/signup"
                    onClick={navClick}
                    className="py-2.5 bg-gradient-to-r from-neonPurple to-neonBlue text-center text-white rounded-xl text-sm font-bold shadow-glowBlue flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    REGISTER
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
