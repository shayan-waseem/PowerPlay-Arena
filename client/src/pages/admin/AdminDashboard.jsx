import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArenaContext } from '../../context/ArenaContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Shield, Users, Ticket, Activity, Server, Cpu, Clock, HardDrive,
  MemoryStick, Globe, Zap, ArrowRight, AlertTriangle, CheckCircle,
  Database, MonitorDot, TrendingUp, RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { playClick, liveVisitors, digitalTime } = useContext(ArenaContext);
  
  const [stats, setStats] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
        setSystemStatus(res.data.systemStatus);
      }
    } catch (err) {
      toast.error('FAILED TO FETCH ADMIN STATISTICS');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 border-3 border-t-neonPink border-r-neonPurple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="font-display text-neonPink text-sm animate-pulse tracking-widest">DECRYPTING ADMIN TELEMETRY...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 py-2 select-none"
    >
      {/* 1. ADMIN HERO HEADER */}
      <motion.div variants={itemVariants}>
        <div className="glass-panel p-6 rounded-2xl border border-neonPink/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-neonPink/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neonPurple/8 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-neonPink" />
                <span className="text-[9px] font-mono font-bold text-neonPink bg-neonPink/10 px-2 py-0.5 rounded border border-neonPink/20 tracking-wider uppercase animate-pulse">
                  ROOT ACCESS GRANTED
                </span>
              </div>
              <h1 className="font-display font-black text-xl text-white tracking-widest uppercase text-glow-pink">
                ADMIN CONTROL CENTER
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                Welcome, <span className="text-neonPink font-bold">{user?.name || 'ADMIN'}</span>. Full system telemetry and management access.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { playClick(); fetchStats(); }}
                className="flex items-center gap-1.5 px-4 py-2 border border-neonPink/30 text-neonPink hover:bg-neonPink/10 rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                REFRESH
              </button>
              <div className="px-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-center">
                <p className="text-[8px] font-mono text-gray-500 font-bold uppercase">SERVER TIME</p>
                <p className="text-neonBlue font-mono font-bold text-xs mt-0.5">{digitalTime}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. STAT CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { title: 'REGISTERED VISITORS', value: stats?.totalUsers || 0, icon: Users, color: 'text-neonBlue bg-neonBlue/10 border-neonBlue/20' },
          { title: 'TOTAL BOOKINGS', value: stats?.totalBookings || 0, icon: Ticket, color: 'text-neonPurple bg-neonPurple/10 border-neonPurple/20' },
          { title: 'PENDING QUEUE', value: stats?.pendingBookings || 0, icon: Clock, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
          { title: 'COMPLETED', value: stats?.completedBookings || 0, icon: CheckCircle, color: 'text-neonGreen bg-neonGreen/10 border-neonGreen/20' },
          { title: 'SIMULATIONS RUN', value: stats?.totalSimulations || 0, icon: Activity, color: 'text-neonPink bg-neonPink/10 border-neonPink/20' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-2 ${stat.color}`}>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                <Icon className={`w-4 h-4 ${stat.color.split(' ')[0]}`} />
              </div>
              <p className="font-display font-black text-lg text-white tracking-widest">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* 3. SYSTEM STATUS + QUICK LINKS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SERVER STATUS */}
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Server className="w-4 h-4 text-neonGreen" />
              Server System Status
            </h3>
            <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-neonGreen bg-neonGreen/10 px-2 py-0.5 rounded border border-neonGreen/20 tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 bg-neonGreen rounded-full"></span>
              ONLINE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'UPTIME', value: systemStatus?.uptime || '-', icon: Clock, color: 'text-neonGreen' },
              { label: 'MEMORY USAGE', value: systemStatus?.memoryUsage || '-', icon: MemoryStick, color: 'text-neonBlue' },
              { label: 'NODE VERSION', value: systemStatus?.nodeVersion || '-', icon: Globe, color: 'text-neonPurple' },
              { label: 'PLATFORM', value: systemStatus?.platform || '-', icon: HardDrive, color: 'text-neonPink' },
              { label: 'CPU LOAD', value: systemStatus?.cpuLoad || '-', icon: Cpu, color: 'text-yellow-400' },
              { label: 'ACTIVE SESSIONS', value: systemStatus?.activeSessions || 0, icon: MonitorDot, color: 'text-neonGreen' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3 bg-darkBg/60 border border-darkBorder/40 rounded-xl flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-darkBg border border-darkBorder/60 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">{item.label}</p>
                    <p className={`font-mono font-bold text-xs text-white mt-0.5`}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live visitors indicator */}
          <div className="p-3 bg-neonGreen/5 border border-neonGreen/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neonGreen animate-pulse" />
              <span className="font-mono text-[10px] text-gray-400 font-bold">LIVE ARENA VISITORS</span>
            </div>
            <span className="font-display font-black text-neonGreen text-lg tracking-widest animate-pulse">{liveVisitors}</span>
          </div>
        </Card>

        {/* ADMIN QUICK LINKS */}
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Shield className="w-4 h-4 text-neonPink" />
              Admin Quick Access
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                title: 'MANAGE USERS',
                desc: 'View, search, and delete registered visitor accounts.',
                path: '/powerplay-secret-admin/users',
                icon: Users,
                color: 'border-neonBlue/30 hover:border-neonBlue bg-gradient-to-r from-neonBlue/5 to-transparent',
                iconColor: 'text-neonBlue'
              },
              {
                title: 'MANAGE BOOKINGS',
                desc: 'Oversee all arena booking queues and clear scheduling data.',
                path: '/powerplay-secret-admin/bookings',
                icon: Ticket,
                color: 'border-neonPurple/30 hover:border-neonPurple bg-gradient-to-r from-neonPurple/5 to-transparent',
                iconColor: 'text-neonPurple'
              },
              {
                title: 'SYSTEM LOGS',
                desc: 'Audit trail of all user activities, logins, and simulation runs.',
                path: '/powerplay-secret-admin/logs',
                icon: Database,
                color: 'border-neonGreen/30 hover:border-neonGreen bg-gradient-to-r from-neonGreen/5 to-transparent',
                iconColor: 'text-neonGreen'
              },
              {
                title: 'ANALYTICS DASHBOARD',
                desc: 'View comprehensive scheduling algorithm performance charts.',
                path: '/analytics',
                icon: TrendingUp,
                color: 'border-neonPink/30 hover:border-neonPink bg-gradient-to-r from-neonPink/5 to-transparent',
                iconColor: 'text-neonPink'
              }
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  onClick={playClick}
                  className={`p-4 rounded-xl border ${link.color} flex items-center justify-between gap-4 transition-all group`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-darkBg border border-darkBorder/60 ${link.iconColor} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-white tracking-wider">{link.title}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* 4. SECURITY WARNING BANNER */}
      <motion.div variants={itemVariants}>
        <div className="p-4 bg-neonPink/5 border border-neonPink/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-neonPink shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-xs text-neonPink tracking-wider uppercase">RESTRICTED ACCESS WARNING</p>
            <p className="text-[10px] text-gray-400 font-semibold mt-1 leading-relaxed">
              This admin panel is a hidden route (<code className="text-neonPurple bg-darkBg px-1 py-0.5 rounded text-[9px]">/powerplay-secret-admin</code>). 
              All administrative actions are logged and audited. Unauthorized access attempts are tracked.
              Exercise caution when performing destructive operations such as deleting users or clearing booking queues.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
