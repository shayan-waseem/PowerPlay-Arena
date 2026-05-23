import React, { useState, useEffect, useContext } from 'react';
import { ArenaContext } from '../../context/ArenaContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import {
  Ticket, Search, Trash2, Clock, CheckCircle, AlertTriangle,
  ChevronLeft, RefreshCcw, Users, Cpu, Landmark, Baby, Dumbbell,
  Gamepad2, Filter, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { playClick } = useContext(ArenaContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      toast.error('FAILED TO LOAD BOOKING DATA');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setClearing(true);
      const res = await axios.post('/api/admin/bookings/clear');
      if (res.data.success) {
        playClick();
        toast.success('ALL BOOKING QUEUES PURGED');
        setBookings([]);
        setConfirmClear(false);
      }
    } catch (err) {
      toast.error('FAILED TO CLEAR BOOKINGS');
      console.error(err);
    } finally {
      setClearing(false);
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
      case 'reception': return { text: 'text-neonBlue', bg: 'bg-neonBlue/10', border: 'border-neonBlue/20' };
      case 'kids': return { text: 'text-neonPurple', bg: 'bg-neonPurple/10', border: 'border-neonPurple/20' };
      case 'adult': return { text: 'text-neonPink', bg: 'bg-neonPink/10', border: 'border-neonPink/20' };
      case 'gaming': return { text: 'text-neonGreen', bg: 'bg-neonGreen/10', border: 'border-neonGreen/20' };
      default: return { text: 'text-gray-400', bg: 'bg-darkBg', border: 'border-darkBorder' };
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      b.activity?.toLowerCase().includes(q) ||
      b.userId?.name?.toLowerCase().includes(q) ||
      b.userId?.email?.toLowerCase().includes(q) ||
      b.algorithm?.toLowerCase().includes(q);
    const matchDept = deptFilter === 'all' || b.department === deptFilter;
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  // Stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const deptCounts = {
    reception: bookings.filter(b => b.department === 'reception').length,
    kids: bookings.filter(b => b.department === 'kids').length,
    adult: bookings.filter(b => b.department === 'adult').length,
    gaming: bookings.filter(b => b.department === 'gaming').length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 py-2 select-none"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/powerplay-secret-admin"
              onClick={playClick}
              className="flex items-center gap-1 text-neonPink hover:text-white text-[10px] font-mono font-bold tracking-wider transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              ADMIN
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">BOOKING MANAGEMENT</span>
          </div>
          <h1 className="font-display font-black text-xl text-white tracking-widest uppercase text-glow-purple flex items-center gap-3">
            <Ticket className="w-5 h-5 text-neonPurple" />
            MANAGE BOOKINGS
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Oversee all arena booking queues. Filter, search, and manage scheduling data.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { playClick(); fetchBookings(); }}
            className="flex items-center gap-1.5 px-4 py-2 border border-neonPurple/30 text-neonPurple hover:bg-neonPurple/10 rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            REFRESH
          </button>
          {confirmClear ? (
            <div className="flex gap-1.5">
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="flex items-center gap-1 px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase disabled:opacity-50"
              >
                {clearing ? 'PURGING...' : 'CONFIRM PURGE'}
              </button>
              <button
                onClick={() => { playClick(); setConfirmClear(false); }}
                className="px-3 py-2 bg-darkBg border border-darkBorder text-gray-400 hover:text-white rounded-xl text-[10px] font-bold transition-all"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { playClick(); setConfirmClear(true); }}
              className="flex items-center gap-1.5 px-4 py-2 border border-neonPink/30 text-neonPink hover:bg-neonPink/10 rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase"
            >
              <Trash2 className="w-3.5 h-3.5" />
              CLEAR ALL
            </button>
          )}
        </div>
      </motion.div>

      {/* STATS BAR */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {[
          { title: 'TOTAL', value: totalBookings, color: 'text-neonBlue bg-neonBlue/10 border-neonBlue/20' },
          { title: 'PENDING', value: pendingBookings, color: 'text-neonPurple bg-neonPurple/10 border-neonPurple/20' },
          { title: 'COMPLETED', value: completedBookings, color: 'text-neonGreen bg-neonGreen/10 border-neonGreen/20' },
          { title: 'RECEPTION', value: deptCounts.reception, color: 'text-neonBlue bg-neonBlue/5 border-neonBlue/10' },
          { title: 'KIDS', value: deptCounts.kids, color: 'text-neonPurple bg-neonPurple/5 border-neonPurple/10' },
          { title: 'ADULT', value: deptCounts.adult, color: 'text-neonPink bg-neonPink/5 border-neonPink/10' },
          { title: 'GAMING', value: deptCounts.gaming, color: 'text-neonGreen bg-neonGreen/5 border-neonGreen/10' },
        ].map((s, idx) => (
          <div key={idx} className={`p-2.5 rounded-xl border text-center ${s.color}`}>
            <span className="text-[7px] font-mono font-bold text-gray-500 uppercase tracking-wider block">{s.title}</span>
            <p className={`font-display font-black text-sm text-white tracking-widest mt-0.5`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* SEARCH + FILTERS */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by activity, user, or algorithm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-darkBg border border-darkBorder rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={deptFilter}
            onChange={(e) => { playClick(); setDeptFilter(e.target.value); }}
            className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-neonPurple font-semibold"
          >
            <option value="all">All Depts</option>
            <option value="reception">Reception</option>
            <option value="kids">Kids Zone</option>
            <option value="adult">Adult Arena</option>
            <option value="gaming">Gaming Zone</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { playClick(); setStatusFilter(e.target.value); }}
            className="bg-darkBg border border-darkBorder rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-neonPurple font-semibold"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* BOOKINGS TABLE */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-0 border border-darkBorder/60 bg-darkCard/35 p-0 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-2 border-t-neonPurple border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-[10px] text-gray-500 tracking-wider">LOADING BOOKING QUEUES...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-2 text-gray-500 font-mono text-[10px]">
              <Ticket className="w-8 h-8 text-darkBorder mb-1" />
              {searchQuery || deptFilter !== 'all' || statusFilter !== 'all'
                ? 'NO BOOKINGS MATCH YOUR FILTERS.'
                : 'NO BOOKING QUEUES FOUND IN DATABASE.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-darkBorder/60 bg-darkBg/60">
                    <th className="text-left px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">#</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Visitor</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Activity</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Dept</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Algo</th>
                    <th className="text-center px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Burst</th>
                    <th className="text-center px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">VIP</th>
                    <th className="text-center px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 font-mono text-[9px] text-gray-500 font-bold uppercase tracking-wider">Arrival</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b, idx) => {
                    const Icon = getDeptIcon(b.department);
                    const deptCol = getDeptColor(b.department);
                    const isCompleted = b.status === 'completed';
                    return (
                      <motion.tr
                        key={b._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="border-b border-darkBorder/20 hover:bg-darkBorder/10 transition-all"
                      >
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-display font-bold text-[11px] text-white">{b.userId?.name || 'Unknown'}</span>
                            <span className="font-mono text-[9px] text-gray-500">{b.userId?.email || '-'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-xs text-gray-300 max-w-[180px] truncate">{b.activity}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${deptCol.text} ${deptCol.bg} ${deptCol.border} uppercase`}>
                            <Icon className="w-3 h-3" />
                            {b.department}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[9px] font-mono font-bold text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded border border-neonBlue/20">{b.algorithm}</span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono text-[10px] text-white font-bold">{b.sessionTime}s</td>
                        <td className="px-4 py-3 text-center font-mono text-[10px] text-white font-bold">{b.priority}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border tracking-widest uppercase ${
                            isCompleted
                              ? 'border-neonGreen/30 text-neonGreen bg-neonGreen/5'
                              : 'border-neonPurple/30 text-neonPurple bg-neonPurple/5 animate-pulse'
                          }`}>
                            {isCompleted ? 'DONE' : 'QUEUE'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[10px] text-gray-500">
                          {new Date(b.arrivalTime || b.createdAt).toLocaleString()}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* WARNING */}
      <motion.div variants={itemVariants}>
        <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
            <span className="text-yellow-400 font-bold">CAUTION:</span> Using "Clear All" will permanently erase all booking records from the database.
            This resets all scheduling queues across all departments and cannot be reversed.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ManageBookings;
