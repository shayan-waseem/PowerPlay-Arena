import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import axios from 'axios';
import { Ticket, Cpu, Zap, Gamepad2, Landmark, CheckCircle, Clock, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

// Premium Animated Counter Component
const AnimatedCounter = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);
  const isNumber = !isNaN(value) && !isNaN(parseFloat(value));

  useEffect(() => {
    if (!isNumber) {
      setCount(value);
      return;
    }
    
    let start = 0;
    const end = parseFloat(value);
    if (end === 0) {
      setCount(0);
      return;
    }
    const stepTime = Math.max(Math.floor((duration * 1000) / 40), 15);
    const increment = Math.ceil(end / 40);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, duration, isNumber]);
  
  return <span className="font-mono">{count}</span>;
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { playClick, playSuccess, liveVisitors } = useContext(ArenaContext);
  
  // States
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [department, setDepartment] = useState('reception');
  const [activity, setActivity] = useState('Walk-in Registration');
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [sessionTime, setSessionTime] = useState(10);
  const [priority, setPriority] = useState(3);
  const [formLoading, setFormLoading] = useState(false);

  // Preset activities by department
  const activitiesByDept = {
    reception: [
      { name: 'Walk-in Ticket Counter', defaultTime: 5, algos: ['FCFS', 'RR'] },
      { name: 'VIP Member Registration', defaultTime: 3, algos: ['Priority'] },
      { name: 'Group Entry Counter', defaultTime: 12, algos: ['FCFS'] },
      { name: 'Event Booking Reservation', defaultTime: 8, algos: ['RR'] }
    ],
    kids: [
      { name: 'Trampoline Bounce rotation', defaultTime: 15, algos: ['RR'] },
      { name: 'Cartoon VR Ride', defaultTime: 10, algos: ['Priority'] },
      { name: 'Mini Coaster Ride', defaultTime: 8, algos: ['RR'] },
      { name: 'Toy Zone Playground', defaultTime: 20, algos: ['Priority', 'RR'] }
    ],
    adult: [
      { name: 'Hyper bowling lane 4', defaultTime: 30, algos: ['FCFS', 'SJF'] },
      { name: 'Sci-fi Laser tag team arena', defaultTime: 20, algos: ['Priority'] },
      { name: 'Professional Racing Simulator', defaultTime: 15, algos: ['SJF'] },
      { name: 'VR Omni-directional Treadmill', defaultTime: 15, algos: ['SJF', 'Priority'] }
    ],
    gaming: [
      { name: 'Gaming PC #04 Allocation', defaultTime: 45, algos: ['RR', 'FCFS'] },
      { name: 'eSports Tournament Pool A', defaultTime: 60, algos: ['Priority'] },
      { name: 'Demo Console Station', defaultTime: 15, algos: ['FCFS', 'SJF'] },
      { name: 'AAA Game Download Queue', defaultTime: 10, algos: ['SJF'] }
    ]
  };

  // Update default activity when department changes
  useEffect(() => {
    const defaultAct = activitiesByDept[department][0];
    setActivity(defaultAct.name);
    setSessionTime(defaultAct.defaultTime);
    setAlgorithm(defaultAct.algos[0]);
  }, [department]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    playClick();

    if (!sessionTime || sessionTime <= 0) {
      toast.error('SESSION TIME MUST EXCEED ZERO MINUTES');
      return;
    }

    try {
      setFormLoading(true);
      const res = await axios.post('/api/bookings', {
        department,
        activity,
        algorithm,
        sessionTime,
        priority
      });
      if (res.data.success) {
        playSuccess();
        toast.success('BOOKING SCHEDULED IN READY QUEUE!');
        fetchMyBookings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'SCHEDULING BLOCKED. SYSTEM ERROR.');
    } finally {
      setFormLoading(false);
    }
  };

  // Aggregated analytics helper
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 py-2 select-none"
    >
      
      {/* 1. WELCOME HERO WIDGET */}
      <motion.div
        variants={itemVariants}
        className="glass-panel p-6 rounded-2xl border border-darkBorder/70 relative overflow-hidden flex flex-col sm:flex-row justify-between sm:items-center gap-4"
      >
        <div className="particle-field"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-neonBlue/10 rounded-full blur-[70px] pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-[9px] font-mono font-bold text-neonBlue bg-neonBlue/10 px-2.5 py-1 rounded-full border border-neonBlue/20 tracking-wider">
            SECURE VISITOR NODE
          </span>
          <h2 className="font-display font-black text-xl text-white uppercase mt-3 tracking-wider">
            WELCOME BACK, <span className="shimmer-text text-glow-blue">{user?.name || 'VISITOR'}</span>
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1 max-w-xl">
            Book play sessions in the departments and simulate scheduling queues in real-time.
          </p>
        </div>

        <div className="flex gap-3 relative z-10">
          <div className="px-4 py-2.5 bg-darkBg/90 border border-darkBorder rounded-xl text-center min-w-[100px] shadow-inner">
            <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">LIVE VISITORS</p>
            <p className="text-neonGreen font-mono font-extrabold text-sm mt-1 text-glow-green">
              <AnimatedCounter value={liveVisitors} />
            </p>
          </div>
          <div className="px-4 py-2.5 bg-darkBg/90 border border-darkBorder rounded-xl text-center min-w-[100px] shadow-inner">
            <p className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-wider">ACTIVE TICKETS</p>
            <p className="text-neonPurple font-mono font-extrabold text-sm mt-1 text-glow-purple">
              <AnimatedCounter value={pendingBookings} />
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. STATS WIDGETS CAROUSEL */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'TOTAL SESSIONS BOOKED', value: totalBookings, icon: Ticket, color: 'text-neonBlue bg-neonBlue/5 border-neonBlue/20 shadow-glowBlue/5', glow: 'shadow-glowBlue/10' },
          { title: 'PENDING CPU QUEUES', value: pendingBookings, icon: Clock, color: 'text-neonPurple bg-neonPurple/5 border-neonPurple/20 shadow-glowPurple/5', glow: 'shadow-glowPurple/10' },
          { title: 'COMPLETED ACTIVITIES', value: completedBookings, icon: CheckCircle, color: 'text-neonGreen bg-neonGreen/5 border-neonGreen/20 shadow-glowGreen/5', glow: 'shadow-glowGreen/10' },
          { title: 'HARDWARE CPU CORES', value: 4, labelSuffix: ' ACTIVE', icon: Cpu, color: 'text-neonPink bg-neonPink/5 border-neonPink/20 shadow-glowPink/5', glow: 'shadow-glowPink/10' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-4 rounded-xl border flex flex-col gap-2 transition-all duration-300 ${stat.color.split(' ')[1]} ${stat.color.split(' ')[2]} hover:${stat.glow}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                <Icon className={`w-4 h-4 ${stat.color.split(' ')[0]}`} />
              </div>
              <p className="font-display font-black text-sm text-white tracking-widest mt-1">
                <AnimatedCounter value={stat.value} />
                {stat.labelSuffix && <span className="text-[10px] font-mono text-neonPink font-bold">{stat.labelSuffix}</span>}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* 3. CORE TWO COLUMN SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: VISITOR BOOKINGS FORM */}
        <motion.div variants={itemVariants} className="xl:col-span-1">
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35" tilt={true}>
            <h3 className="font-display font-black text-xs tracking-wider text-white pb-3 border-b border-darkBorder/40 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neonBlue" />
              CREATE PLAY TICKET (PROCESS SUBMIT)
            </h3>

            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
              
              {/* Department */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">DEPT. (OS CATEGORY)</label>
                <select
                  value={department}
                  onChange={(e) => { playClick(); setDepartment(e.target.value); }}
                  className="w-full bg-darkBg border border-darkBorder rounded-xl p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold input-glow transition-all cursor-pointer"
                >
                  <option value="reception">Reception Department</option>
                  <option value="kids">Kids Activity Department</option>
                  <option value="adult">Adult Activity Department</option>
                  <option value="gaming">Gaming Zone Department</option>
                </select>
              </div>

              {/* Activity */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">ACTIVITY (SPECIFIC HARDWARE)</label>
                <select
                  value={activity}
                  onChange={(e) => { playClick(); setActivity(e.target.value); }}
                  className="w-full bg-darkBg border border-darkBorder rounded-xl p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold input-glow transition-all cursor-pointer"
                >
                  {activitiesByDept[department].map((act, idx) => (
                    <option key={idx} value={act.name}>{act.name}</option>
                  ))}
                </select>
              </div>

              {/* Burst time & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">BURST (SESSION TIME)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(Number(e.target.value))}
                    className="w-full bg-darkBg border border-darkBorder rounded-xl p-2.5 text-xs font-mono text-white outline-none focus:border-neonPurple input-glow transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">PRIORITY (VIP SCALE)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className="w-full bg-darkBg border border-darkBorder rounded-xl p-2.5 text-xs font-mono text-white outline-none focus:border-neonPurple input-glow transition-all"
                    title="1 is Highest VIP priority, 5 is standard visitor"
                  />
                </div>
              </div>

              {/* Algorithm */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">SCHEDULER ALGORITHM</label>
                <select
                  value={algorithm}
                  onChange={(e) => { playClick(); setAlgorithm(e.target.value); }}
                  className="w-full bg-darkBg border border-darkBorder rounded-xl p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold input-glow transition-all cursor-pointer"
                >
                  <option value="FCFS">First-Come-First-Served (FCFS)</option>
                  <option value="SJF">Shortest Job First (SJF)</option>
                  <option value="Priority">Priority Scheduling</option>
                  <option value="RR">Round Robin (RR)</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-[10px] tracking-widest rounded-xl shadow-glowBlue transition-all flex items-center justify-center gap-1.5 uppercase disabled:opacity-50 mt-2 btn-glow"
              >
                {formLoading ? 'SCHEDULING TICKET...' : 'BOOK QUEUE ENTRANCE'}
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>

            </form>
          </Card>
        </motion.div>

        {/* RIGHT COLUMN: BOOKINGS LIST (READY & TERMINATED PROCESSES) */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <div className="flex justify-between items-center pb-3 border-b border-darkBorder/40">
              <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-neonPurple" />
                ACTIVE SCHEDULER TICKETS
              </h3>
              <span className="font-mono text-[9px] text-gray-500 font-bold">TOTAL REGISTERED: {totalBookings}</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 border-2 border-t-neonPurple border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-[10px] text-gray-500 tracking-wider">SYNCING ACTIVE PROCESS DATABASE...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-2 border border-dashed border-darkBorder rounded-xl bg-darkBg/20 text-gray-500 font-mono text-[10px]">
                <Clock className="w-6 h-6 text-darkBorder mb-1" />
                NO ACTIVE SCHEDULER TICKETS GENERATED.
                <p className="text-[9px] text-neonBlue/80 font-semibold">USE THE ACCESS PANEL ON THE LEFT TO SUBMIT PROCESSES.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                {bookings.map((booking) => {
                  const isPending = booking.status === 'pending';
                  const isCompleted = booking.status === 'completed';
                  
                  // Color codes for specific departments
                  let deptColor = 'border-neonBlue text-neonBlue bg-neonBlue/5';
                  if (booking.department === 'kids') deptColor = 'border-neonPurple text-neonPurple bg-neonPurple/5';
                  if (booking.department === 'adult') deptColor = 'border-neonPink text-neonPink bg-neonPink/5';
                  if (booking.department === 'gaming') deptColor = 'border-neonGreen text-neonGreen bg-neonGreen/5';

                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={booking._id}
                      className="p-3 border border-darkBorder rounded-xl bg-darkBg/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-darkBorder/80 table-row-glow"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-xs text-white">{booking.activity}</span>
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${deptColor}`}>
                            {booking.department}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] text-gray-400">
                          <span>ALGO: <b className="text-neonBlue">{booking.algorithm}</b></span>
                          <span>BURST: <b className="text-white">{booking.sessionTime} Sec</b></span>
                          <span>VIP LEVEL: <b className="text-white">{booking.priority}</b></span>
                          <span>ARRIVED: <b className="text-gray-400">{new Date(booking.arrivalTime).toLocaleTimeString()}</b></span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <span className={`text-[8px] font-mono font-bold px-2 py-1 rounded border self-start sm:self-center tracking-widest uppercase badge-pulse ${
                        isCompleted
                          ? 'border-neonGreen/30 text-neonGreen bg-neonGreen/5'
                          : 'border-neonPurple/30 text-neonPurple bg-neonPurple/5'
                      }`}>
                        {isCompleted ? 'TERMINATED' : 'READY QUEUE'}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Quick redirect details */}
            <div className="p-3.5 bg-neonBlue/5 border border-neonBlue/20 rounded-xl font-mono text-[9px] text-gray-400 leading-relaxed shadow-sm">
              <span className="text-neonBlue font-bold block uppercase tracking-wider mb-1">💡 QUEUE ALLOCATOR ACTION AVAILABLE:</span>
              To visually execute these ready visitor queues, go to the corresponding department page (e.g. <Link to="/reception" className="text-neonPurple underline font-bold hover:text-neonPurple/80">Reception</Link>, <Link to="/gaming-zone" className="text-neonPurple underline font-bold hover:text-neonPurple/80">Gaming PC Zone</Link>) from the sidebar, choose the scheduling properties, and click <b className="text-white">Run Department Scheduler</b>!
            </div>

          </Card>
        </motion.div>

      </div>

    </motion.div>
  );
};

export default Dashboard;
