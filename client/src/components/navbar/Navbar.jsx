import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArenaContext } from '../../context/ArenaContext';
import { Volume2, VolumeX, Menu, X, ShieldAlert, Cpu, LogOut, User as UserIcon } from 'lucide-react';

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
    // Beep will play after state update if enabled, let's play direct click sound as immediate feedback
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

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-darkBorder px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" onClick={navClick} className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-neonPurple to-neonBlue rounded-lg shadow-glowBlue transition-all group-hover:scale-105">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-black text-lg bg-gradient-to-r from-white via-gray-200 to-neonBlue bg-clip-text text-transparent tracking-widest">
              POWER PLAY
            </span>
            <span className="block text-[10px] font-display font-semibold tracking-[0.2em] text-neonPurple -mt-1 uppercase text-glow-purple">
              Arena Simulator
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/dashboard" onClick={navClick} className="text-gray-300 hover:text-neonBlue transition-colors font-display text-sm font-semibold tracking-wider">
            DASHBOARD
          </Link>
          <Link to="/simulation" onClick={navClick} className="text-gray-300 hover:text-neonPurple transition-colors font-display text-sm font-semibold tracking-wider">
            SIMULATION LAB
          </Link>
          <Link to="/analytics" onClick={navClick} className="text-gray-300 hover:text-neonPink transition-colors font-display text-sm font-semibold tracking-wider">
            ANALYTICS
          </Link>
        </div>

        {/* METRICS & CONTROLS */}
        <div className="hidden md:flex items-center gap-6">
          {/* Live Visitor Widget */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-darkBg border border-darkBorder rounded-full text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-neonGreen animate-pulse shadow-glowGreen"></span>
            <span className="text-gray-400 tracking-wider font-mono">LIVE VISITORS:</span>
            <span className="text-neonGreen tracking-widest font-mono font-bold animate-pulse">{liveVisitors}</span>
          </div>

          {/* Time System */}
          <div className="px-3 py-1.5 bg-darkBg border border-darkBorder rounded-full text-xs font-mono font-bold text-neonBlue tracking-wider shadow-inner">
            {digitalTime}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled 
                ? 'border-neonPurple text-neonPurple shadow-glowPurple bg-neonPurple/10' 
                : 'border-darkBorder text-gray-500 hover:text-gray-300'
            }`}
            title={soundEnabled ? "Mute synth sound fx" : "Unmute synth sound fx"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/powerplay-secret-admin"
                  onClick={navClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-neonPink/50 text-neonPink bg-neonPink/5 rounded-lg text-xs font-display font-bold hover:bg-neonPink hover:text-white transition-all tracking-wider shadow-glowPink"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  ADMIN PANEL
                </Link>
              )}
              <Link
                to="/profile"
                onClick={navClick}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-darkBorder text-gray-300 hover:text-neonBlue hover:border-neonBlue transition-all rounded-lg text-xs font-display font-semibold"
              >
                <UserIcon className="w-3.5 h-3.5 text-neonBlue" />
                MY TICKETS
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-lg text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                onClick={navClick}
                className="px-4 py-1.5 border border-darkBorder text-gray-300 hover:text-white hover:border-gray-500 rounded-lg text-sm font-semibold transition-all"
              >
                SIGN IN
              </Link>
              <Link
                to="/signup"
                onClick={navClick}
                className="px-4 py-1.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white hover:opacity-90 rounded-lg text-sm font-bold shadow-glowBlue hover:shadow-glowPurple transition-all"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              soundEnabled ? 'border-neonPurple text-neonPurple bg-neonPurple/10' : 'border-darkBorder text-gray-505'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { playClick(); setMobileMenuOpen(!mobileMenuOpen); }}
            className="p-2 border border-darkBorder rounded-lg text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE NAV MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-darkBorder flex flex-col gap-4 animate-fadeIn">
          <Link to="/dashboard" onClick={navClick} className="text-gray-300 hover:text-neonBlue transition-colors font-display text-sm tracking-wider">
            DASHBOARD
          </Link>
          <Link to="/simulation" onClick={navClick} className="text-gray-300 hover:text-neonPurple transition-colors font-display text-sm tracking-wider">
            SIMULATION LAB
          </Link>
          <Link to="/analytics" onClick={navClick} className="text-gray-300 hover:text-neonPink transition-colors font-display text-sm tracking-wider">
            ANALYTICS
          </Link>
          
          <div className="border-t border-darkBorder/40 my-1"></div>

          {/* Mobile visitors & clock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-neonGreen animate-pulse shadow-glowGreen"></span>
              <span className="text-gray-400">VISITORS: {liveVisitors}</span>
            </div>
            <div className="text-xs font-mono text-neonBlue bg-darkBg px-2.5 py-1 border border-darkBorder rounded">
              {digitalTime}
            </div>
          </div>

          <div className="border-t border-darkBorder/40 my-1"></div>

          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              {isAdmin && (
                <Link
                  to="/powerplay-secret-admin"
                  onClick={navClick}
                  className="flex items-center justify-center gap-1.5 py-2 border border-neonPink text-neonPink bg-neonPink/5 rounded-lg text-xs font-bold shadow-glowPink"
                >
                  <ShieldAlert className="w-4 h-4" />
                  ADMIN PANEL
                </Link>
              )}
              <Link
                to="/profile"
                onClick={navClick}
                className="flex items-center justify-center gap-1.5 py-2 border border-darkBorder text-gray-300 rounded-lg text-xs font-semibold"
              >
                <UserIcon className="w-4 h-4 text-neonBlue" />
                MY TICKETS
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 py-2 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold"
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
                className="py-2 border border-darkBorder text-center text-gray-300 rounded-lg text-sm font-semibold"
              >
                SIGN IN
              </Link>
              <Link
                to="/signup"
                onClick={navClick}
                className="py-2 bg-gradient-to-r from-neonPurple to-neonBlue text-center text-white rounded-lg text-sm font-bold shadow-glowBlue"
              >
                REGISTER
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
