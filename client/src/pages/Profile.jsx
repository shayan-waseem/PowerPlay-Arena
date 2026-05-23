import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import {
  User, Mail, Shield, Calendar, Ticket, CheckCircle, Clock,
  Cpu, Activity, Gamepad2, Landmark, Baby, Dumbbell, LogOut,
  TrendingUp, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const { playClick, liveVisitors } = useContext(ArenaContext);

  const [bookings, setBookings] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [expandedSim, setExpandedSim] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookRes, simRes] = await Promise.all([
        axios.get('/api/bookings/my'),
        axios.get('/api/simulations/my')
      ]);
      if (bookRes.data.success) setBookings(bookRes.data.bookings);
      if (simRes.data.success) setSimulations(simRes.data.simulations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDeptIcon = (dept) => {
    switch (dept) {
      case 'reception': return Landmark;
      case 'kids': return Baby;
      case 'adult': return Dumbbell;
      case 'gaming': return Gamepad2;
      default: return Cpu;
    }
  };

  const getDeptColor = (dept) => {
    switch (dept) {
      case 'reception': return 'text-neonBlue border-neonBlue/30 bg-neonBlue/5';
      case 'kids': return 'text-neonPurple border-neonPurple/30 bg-neonPurple/5';
      case 'adult': return 'text-neonPink border-neonPink/30 bg-neonPink/5';
      case 'gaming': return 'text-neonGreen border-neonGreen/30 bg-neonGreen/5';
      default: return 'text-gray-400 border-darkBorder bg-darkBg';
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  // Stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const totalSimulations = simulations.length;
  const totalBurstTime = bookings.reduce((acc, b) => acc + (b.sessionTime || 0), 0);

  const handleLogout = () => {
    playClick();
    logout();
    toast.success('VISITOR NODE DISCONNECTED');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 py-2 select-none max-w-5xl mx-auto w-full"
    >
      {/* 1. PROFILE HEADER */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border border-darkBorder/60 bg-darkCard/35">
          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-neonPurple/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-neonBlue/8 rounded-full blur-[60px] pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Avatar + Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neonPurple to-neonBlue flex items-center justify-center shadow-glowPurple">
                  <span className="font-display font-black text-2xl text-white uppercase">
                    {user?.name?.charAt(0) || 'V'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-neonGreen rounded-full border-2 border-darkBg flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <h1 className="font-display font-black text-lg text-white tracking-wider uppercase">
                  {user?.name || 'VISITOR'}
                </h1>
                <div className="flex items-center gap-2 text-gray-400 font-mono text-xs">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email || 'unknown@arena.net'}</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-neonGreen bg-neonGreen/10 px-2 py-0.5 rounded border border-neonGreen/20 tracking-wider uppercase">
                    <Shield className="w-3 h-3" />
                    {user?.role === 'admin' ? 'ADMIN' : 'VISITOR'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded border border-neonBlue/20 tracking-wider">
                    <Calendar className="w-3 h-3" />
                    JOINED {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'RECENTLY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 border border-neonPink/30 text-neonPink hover:bg-neonPink hover:text-white rounded-xl text-xs font-bold font-display tracking-widest transition-all uppercase self-start sm:self-center"
            >
              <LogOut className="w-4 h-4" />
              DISCONNECT
            </button>
          </div>
        </Card>
      </motion.div>

      {/* 2. STATS GRID */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { title: 'TOTAL SESSIONS', value: totalBookings, icon: Ticket, color: 'text-neonBlue bg-neonBlue/10 border-neonBlue/20' },
          { title: 'COMPLETED', value: completedBookings, icon: CheckCircle, color: 'text-neonGreen bg-neonGreen/10 border-neonGreen/20' },
          { title: 'IN QUEUE', value: pendingBookings, icon: Clock, color: 'text-neonPurple bg-neonPurple/10 border-neonPurple/20' },
          { title: 'SIMULATIONS', value: totalSimulations, icon: Activity, color: 'text-neonPink bg-neonPink/10 border-neonPink/20' },
          { title: 'TOTAL BURST', value: `${totalBurstTime}s`, icon: Zap, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-3 rounded-xl border flex flex-col gap-2 ${stat.color}`}>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                <Icon className={`w-3.5 h-3.5 ${stat.color.split(' ')[0]}`} />
              </div>
              <p className="font-display font-black text-sm text-white tracking-widest">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* 3. BOOKINGS HISTORY */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-sm tracking-wider text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-neonPurple" />
              BOOKING HISTORY — TERMINATED PROCESSES
            </h3>
            
            {/* Filter pills */}
            <div className="flex gap-1.5">
              {['all', 'pending', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => { playClick(); setFilter(f); }}
                  className={`px-3 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider transition-all ${
                    filter === f
                      ? 'bg-neonPurple/20 text-neonPurple border border-neonPurple/40'
                      : 'bg-darkBg border border-darkBorder text-gray-500 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {f === 'all' ? `ALL (${totalBookings})` : f === 'pending' ? `QUEUE (${pendingBookings})` : `DONE (${completedBookings})`}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-2 border-t-neonPurple border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-[10px] text-gray-500 tracking-wider">LOADING PROCESS HISTORY...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2 border border-dashed border-darkBorder rounded-xl bg-darkBg/20 text-gray-500 font-mono text-[10px]">
              <Clock className="w-6 h-6 text-darkBorder mb-1" />
              NO BOOKINGS FOUND FOR THIS FILTER.
              <p className="text-[9px] text-neonBlue/80 font-semibold">SUBMIT PLAY TICKETS FROM THE DASHBOARD TO SEE HISTORY HERE.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredBookings.map((booking, idx) => {
                const Icon = getDeptIcon(booking.department);
                const isCompleted = booking.status === 'completed';
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-3 border border-darkBorder rounded-xl bg-darkBg/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-darkBorder group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border ${getDeptColor(booking.department)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display font-bold text-xs text-white">{booking.activity}</span>
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] text-gray-400">
                          <span>ALGO: <b className="text-neonBlue">{booking.algorithm}</b></span>
                          <span>BURST: <b className="text-white">{booking.sessionTime}s</b></span>
                          <span>VIP: <b className="text-white">{booking.priority}</b></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <span className="text-[9px] font-mono text-gray-500">{new Date(booking.arrivalTime || booking.createdAt).toLocaleString()}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border tracking-widest uppercase ${
                        isCompleted
                          ? 'border-neonGreen/30 text-neonGreen bg-neonGreen/5'
                          : 'border-neonPurple/30 text-neonPurple bg-neonPurple/5 animate-pulse'
                      }`}>
                        {isCompleted ? 'TERMINATED' : 'READY QUEUE'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>

      {/* 4. SIMULATION HISTORY */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-sm tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-neonBlue" />
              SAVED SIMULATION RUNS
            </h3>
            <span className="font-mono text-[9px] text-gray-500 font-bold">TOTAL: {totalSimulations}</span>
          </div>

          {simulations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2 border border-dashed border-darkBorder rounded-xl bg-darkBg/20 text-gray-500 font-mono text-[10px]">
              <TrendingUp className="w-6 h-6 text-darkBorder mb-1" />
              NO SAVED SIMULATIONS YET.
              <p className="text-[9px] text-neonBlue/80 font-semibold">RUN ALGORITHMS IN THE MASTER SIMULATOR AND SAVE RESULTS.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
              {simulations.map((sim, idx) => (
                <div key={sim._id} className="border border-darkBorder rounded-xl bg-darkBg/40 overflow-hidden">
                  <button
                    onClick={() => { playClick(); setExpandedSim(expandedSim === idx ? null : idx); }}
                    className="w-full p-3 flex items-center justify-between hover:bg-darkBorder/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono font-bold text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded border border-neonBlue/20 uppercase">{sim.algorithm}</span>
                      <span className="font-display font-bold text-xs text-white">{sim.resourceSelected || 'Arena Core CPU'}</span>
                      <span className="text-[9px] font-mono text-gray-500">{new Date(sim.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-neonGreen font-bold">CPU: {sim.cpuUtilization?.toFixed(1)}%</span>
                      {expandedSim === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </button>

                  {expandedSim === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-darkBorder/40 p-4"
                    >
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-2 bg-darkBg border border-darkBorder rounded-lg text-center">
                          <p className="text-[8px] font-mono text-gray-500 uppercase">AVG WAITING</p>
                          <p className="text-neonBlue font-mono font-bold text-sm mt-0.5">{sim.averageWaitingTime?.toFixed(2)}</p>
                        </div>
                        <div className="p-2 bg-darkBg border border-darkBorder rounded-lg text-center">
                          <p className="text-[8px] font-mono text-gray-500 uppercase">AVG TURNAROUND</p>
                          <p className="text-neonPurple font-mono font-bold text-sm mt-0.5">{sim.averageTurnaroundTime?.toFixed(2)}</p>
                        </div>
                        <div className="p-2 bg-darkBg border border-darkBorder rounded-lg text-center">
                          <p className="text-[8px] font-mono text-gray-500 uppercase">CPU UTIL</p>
                          <p className="text-neonGreen font-mono font-bold text-sm mt-0.5">{sim.cpuUtilization?.toFixed(1)}%</p>
                        </div>
                      </div>

                      {/* Process List */}
                      {sim.processes && sim.processes.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full font-mono text-[10px]">
                            <thead>
                              <tr className="border-b border-darkBorder/60">
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">PID</th>
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">Arrival</th>
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">Burst</th>
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">Priority</th>
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">CT</th>
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">TAT</th>
                                <th className="text-left p-1.5 text-gray-500 font-bold uppercase">WT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sim.processes.map((proc, pidx) => (
                                <tr key={pidx} className="border-b border-darkBorder/20 hover:bg-darkBorder/10">
                                  <td className="p-1.5 text-neonBlue font-bold">{proc.id || `P${pidx}`}</td>
                                  <td className="p-1.5 text-white">{proc.arrivalTime}</td>
                                  <td className="p-1.5 text-white">{proc.burstTime}</td>
                                  <td className="p-1.5 text-white">{proc.priority || '-'}</td>
                                  <td className="p-1.5 text-neonGreen">{proc.completionTime ?? '-'}</td>
                                  <td className="p-1.5 text-neonPurple">{proc.turnaroundTime ?? '-'}</td>
                                  <td className="p-1.5 text-neonPink">{proc.waitingTime ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default Profile;
