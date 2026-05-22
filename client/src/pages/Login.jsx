import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import { Mail, Lock, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { playClick, playSuccess } = useContext(ArenaContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      }
    } catch (err) {
      toast.error('SERVER COMPROMISED. RE-ATTEMPT DECRYPTION.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 select-none relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neonBlue/10 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel border border-darkBorder rounded-2xl p-8 relative shadow-glowBlue/5">
        
        {/* Neon corner bracket details */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neonBlue"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neonBlue"></div>

        {/* LOGO */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="p-3 bg-neonBlue/15 rounded-xl border border-neonBlue/30 text-neonBlue shadow-glowBlue/10 animate-float">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-widest uppercase">
            DECRYPT PASSKEY
          </h2>
          <p className="text-[10px] text-gray-500 font-mono tracking-wider">
            ENTER SECURE NODE TO ACCESS ARENA CPU
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                placeholder="visitor@powerplay.com"
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue outline-none transition-all shadow-inner"
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
                className="w-full pl-11 pr-4 py-3 bg-darkBg border border-darkBorder rounded-xl text-xs font-mono text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowBlue transition-all flex items-center justify-center gap-2 uppercase disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING SCHEDULER...' : 'DECRYPT SYSTEM'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-darkBorder/40 text-center flex flex-col gap-2">
          <p className="text-[10px] font-mono text-gray-500 tracking-wider">
            FIRST VISIT TO THE POWER PLAY PARK?
          </p>
          <Link
            to="/signup"
            onClick={playClick}
            className="text-xs font-display font-bold text-neonBlue hover:text-neonPurple transition-all tracking-widest uppercase"
          >
            CREATE VISITOR REGISTRATION
          </Link>
        </div>

        {/* Seeded tip */}
        <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-2.5 items-start font-mono text-[9px] text-yellow-500/80 leading-relaxed shadow-sm">
          <ShieldAlert className="w-4 h-4 shrink-0 text-yellow-400 mt-0.5" />
          <div>
            <p className="font-bold font-display text-white tracking-widest uppercase mb-0.5">Seeded Passkeys:</p>
            <p>Admin Access: <b className="text-white">admin@powerplay.com</b> / pass: <b className="text-white">admin123</b></p>
            <p>Visitor Access: <b className="text-white">visitor@powerplay.com</b> / pass: <b className="text-white">visitor123</b></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
