import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import { Mail, Lock, ShieldAlert, Cpu, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { playClick, playSuccess } = useContext(ArenaContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/powerplay-secret-admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (!email || !password) {
      toast.error('PLEASE COMPLETE ALL INPUT CREDENTIALS');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res?.success) {
        playSuccess();
        toast.success('DECRYPTION SUCCESSFUL. WELCOME TO THE COCKPIT.');
      } else {
        toast.error(res?.message || 'DECRYPTION DENIED. INVALID PASSKEY.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      toast.error('SERVER COMPROMISED. RE-ATTEMPT DECRYPTION.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 select-none relative">
      {/* Particle field */}
      <div className="particle-field"></div>
      
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neonBlue/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-neonPurple/8 rounded-full blur-[80px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
        className={`w-full max-w-md glass-panel-premium border border-darkBorder rounded-2xl p-8 relative shadow-glowBlue/10 z-10 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        
        {/* Animated neon corner brackets */}
        <motion.div 
          className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neonBlue"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neonBlue"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neonPurple/30"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neonPurple/30"></div>

        {/* LOGO */}
        <motion.div 
          className="flex flex-col items-center gap-3 mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div 
              className="p-3.5 bg-neonBlue/15 rounded-xl border border-neonBlue/30 text-neonBlue shadow-glowBlue/20"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Cpu className="w-6 h-6" />
            </motion.div>
            {/* Orbit ring */}
            <div className="absolute -inset-2 border border-dashed border-neonBlue/15 rounded-2xl animate-spin-slower"></div>
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-widest uppercase">
            DECRYPT PASSKEY
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono tracking-wider">
            <span className="w-1.5 h-1.5 bg-neonBlue rounded-full animate-pulse"></span>
            ENTER SECURE NODE TO ACCESS ARENA CPU
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
              NODE EMAIL ADDRESS
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neonBlue transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shayan@visitor.com"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue outline-none transition-all shadow-inner input-glow"
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
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neonBlue transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue outline-none transition-all shadow-inner input-glow"
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowBlue transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50 btn-glow relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                AUTHENTICATING...
              </div>
            ) : (
              <>
                DECRYPT SYSTEM
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-6 border-t border-darkBorder/40 text-center flex flex-col gap-2">
          <p className="text-[10px] font-mono text-gray-500 tracking-wider">
            FIRST VISIT TO THE POWER PLAY PARK?
          </p>
          <Link
            to="/signup"
            onClick={playClick}
            className="text-xs font-display font-bold text-neonBlue hover:text-neonPurple transition-all tracking-widest uppercase flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            CREATE VISITOR REGISTRATION
          </Link>
        </div>

        {/* Seeded tip */}
        <motion.div 
          className="mt-4 p-3.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-2.5 items-start font-mono text-[9px] text-yellow-500/80 leading-relaxed shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" />
          <div>
            <p className="font-bold font-display text-white tracking-widest uppercase mb-0.5">Seeded Passkeys:</p>
            <p>Admin Access: <b className="text-white">admin@powerplay.com</b> / pass: <b className="text-white">admin123</b></p>
            <p>Visitor Access: <b className="text-white">shayan@visitor.com</b> / pass: <b className="text-white">shayan123</b></p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login;
