import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import { User, Mail, Lock, Cpu, ArrowRight } from 'lucide-react';
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neonPurple/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel border border-darkBorder rounded-2xl p-8 relative shadow-glowPurple/5">
        
        {/* Neon corner bracket details */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neonPurple"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neonPurple"></div>

        {/* LOGO */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="p-3 bg-neonPurple/15 rounded-xl border border-neonPurple/30 text-neonPurple shadow-glowPurple/10 animate-float">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-widest uppercase">
            VISITOR ENROLLMENT
          </h2>
          <p className="text-[10px] text-gray-500 font-mono tracking-wider">
            REGISTER INDIVIDUAL VIRTUAL PROCESS ID
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-2 relative">
            <label className="font-display text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              VISITOR ALIAS (FULL NAME)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alice Vance"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-display text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              NODE EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@domain.com"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="font-display text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              SECURE ACCESS PASSKEY
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonPurple focus:ring-1 focus:ring-neonPurple outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowPurple transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50"
          >
            {loading ? 'ENROLLING VISITOR...' : 'REGISTER ENROLLMENT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-darkBorder/40 text-center flex flex-col gap-2">
          <p className="text-[10px] font-mono text-gray-500 tracking-wider">
            ALREADY HOLDING AN ARENA SECURE ID?
          </p>
          <Link
            to="/login"
            onClick={playClick}
            className="text-xs font-display font-bold text-neonPurple hover:text-neonBlue transition-all tracking-widest uppercase"
          >
            DECRYPT PASSKEY
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;
