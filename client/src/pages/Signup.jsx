import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import { User, Mail, Lock, Cpu, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Signup = () => {
  const { signup, isAuthenticated } = useContext(AuthContext);
  const { playClick, playSuccess } = useContext(ArenaContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { level: 20, label: 'WEAK', color: 'bg-red-500' };
    if (score <= 2) return { level: 40, label: 'FAIR', color: 'bg-orange-500' };
    if (score <= 3) return { level: 60, label: 'GOOD', color: 'bg-yellow-500' };
    if (score <= 4) return { level: 80, label: 'STRONG', color: 'bg-neonGreen' };
    return { level: 100, label: 'EXCELLENT', color: 'bg-neonBlue' };
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (!name || !email || !password) {
      toast.error('PLEASE COMPLETE ALL INPUT CREDENTIALS');
      return;
    }

    if (password.length < 6) {
      toast.error('PASSKEY REQUIRES MINIMUM 6 CHARACTERS');
      return;
    }

    try {
      setLoading(true);
      const res = await signup(name, email, password);
      if (res?.success) {
        playSuccess();
        toast.success('VISITOR REGISTRATION SUCCESSFUL! WELCOME.');
      } else {
        toast.error(res?.message || 'REGISTRATION DENIED. SYSTEM FAULT.');
      }
    } catch (err) {
      toast.error('REGISTRATION COMPROMISED. RE-ATTEMPT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 select-none relative">
      {/* Particle field */}
      <div className="particle-field"></div>
      
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neonPurple/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-neonBlue/8 rounded-full blur-[80px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className="w-full max-w-md glass-panel-premium border border-darkBorder rounded-2xl p-8 relative shadow-glowPurple/10 z-10"
      >
        
        {/* Animated neon corner brackets */}
        <motion.div 
          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neonPurple"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neonPurple"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neonBlue/30"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neonBlue/30"></div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-neonPurple/20 border border-neonPurple/50 text-neonPurple flex items-center justify-center text-[9px] font-mono font-bold">1</div>
            <span className="text-[9px] font-mono text-neonPurple font-bold tracking-wider">REGISTER</span>
          </div>
          <div className="w-8 h-px bg-gradient-to-r from-neonPurple/40 to-darkBorder"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-darkBg border border-darkBorder text-gray-500 flex items-center justify-center text-[9px] font-mono font-bold">2</div>
            <span className="text-[9px] font-mono text-gray-500 font-bold tracking-wider">EXPLORE</span>
          </div>
          <div className="w-8 h-px bg-darkBorder"></div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-darkBg border border-darkBorder text-gray-500 flex items-center justify-center text-[9px] font-mono font-bold">3</div>
            <span className="text-[9px] font-mono text-gray-500 font-bold tracking-wider">PLAY</span>
          </div>
        </div>

        {/* LOGO */}
        <motion.div 
          className="flex flex-col items-center gap-3 mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div 
              className="p-3.5 bg-neonPurple/15 rounded-xl border border-neonPurple/30 text-neonPurple shadow-glowPurple/20"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cpu className="w-6 h-6" />
            </motion.div>
            <div className="absolute -inset-2 border border-dashed border-neonPurple/15 rounded-2xl animate-spin-slower"></div>
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-widest uppercase">
            VISITOR ENROLLMENT
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono tracking-wider">
            <span className="w-1.5 h-1.5 bg-neonPurple rounded-full animate-pulse"></span>
            REGISTER INDIVIDUAL VIRTUAL PROCESS ID
          </div>
        </motion.div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <motion.div 
            className="flex flex-col gap-2 relative"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="font-display text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              VISITOR ALIAS (FULL NAME)
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neonPurple transition-colors" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Shayan Waseem"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all shadow-inner input-glow-purple"
              />
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col gap-2 relative"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="font-display text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              NODE EMAIL ADDRESS
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neonPurple transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shayan@visitor.com"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all shadow-inner input-glow-purple"
              />
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col gap-2 relative"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="font-display text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              SECURE ACCESS PASSKEY
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neonPurple transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all shadow-inner input-glow-purple"
              />
            </div>
            {/* Password strength indicator */}
            {password && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 mt-1"
              >
                <div className="flex-1 h-1.5 rounded-full bg-darkBg/80 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.level}%` }}
                    transition={{ duration: 0.4 }}
                    className={`h-full rounded-full ${passwordStrength.color}`}
                  />
                </div>
                <span className={`text-[8px] font-mono font-bold tracking-widest ${
                  passwordStrength.level <= 40 ? 'text-red-400' : passwordStrength.level <= 60 ? 'text-yellow-400' : 'text-neonGreen'
                }`}>
                  {passwordStrength.label}
                </span>
              </motion.div>
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowPurple transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50 btn-glow relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ENROLLING VISITOR...
              </div>
            ) : (
              <>
                REGISTER ENROLLMENT
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t border-darkBorder/40 text-center flex flex-col gap-2">
          <p className="text-[10px] font-mono text-gray-500 tracking-wider">
            ALREADY HOLDING AN ARENA SECURE ID?
          </p>
          <Link
            to="/login"
            onClick={playClick}
            className="text-xs font-display font-bold text-neonPurple hover:text-neonBlue transition-all tracking-widest uppercase flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3 h-3" />
            DECRYPT PASSKEY
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Signup;
