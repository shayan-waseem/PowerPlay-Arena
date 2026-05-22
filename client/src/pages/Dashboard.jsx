import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArenaContext } from '../context/ArenaContext';
import axios from 'axios';
import { Ticket, Cpu, Zap, Gamepad2, Landmark, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';

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

  return (
    <div className="flex flex-col gap-6 py-2 select-none">
      
      {/* 1. WELCOME HERO WIDGET */}
      <div className="glass-panel p-6 rounded-2xl border border-darkBorder/70 relative overflow-hidden flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neonBlue/10 rounded-full blur-[70px] pointer-events-none"></div>
        <div>
          <span className="text-[9px] font-mono font-bold text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded border border-neonBlue/20 tracking-wider">SECURE VISITOR NODE</span>
          <h2 className="font-display font-black text-lg text-white uppercase mt-2">
            WELCOME BACK, {user?.name || 'VISITOR'}
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Book play sessions in the departments and simulate scheduling queues in real-time.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="px-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-center min-w-[90px]">
            <p className="text-[9px] font-mono text-gray-500 font-bold uppercase">LIVE VISITORS</p>
            <p className="text-neonGreen font-mono font-bold mt-0.5 animate-pulse">{liveVisitors}</p>
          </div>
          <div className="px-4 py-2 bg-darkBg border border-darkBorder rounded-xl text-center min-w-[90px]">
            <p className="text-[9px] font-mono text-gray-500 font-bold uppercase">ACTIVE TICKETS</p>
            <p className="text-neonPurple font-mono font-bold mt-0.5">{pendingBookings}</p>
          </div>
        </div>
      </div>

      {/* 2. STATS WIDGETS CAROUSEL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'TOTAL SESSIONS BOOKED', value: totalBookings, icon: Ticket, color: 'text-neonBlue bg-neonBlue/10 border-neonBlue/20 shadow-glowBlue/5' },
          { title: 'PENDING CPU QUEUES', value: pendingBookings, icon: Clock, color: 'text-neonPurple bg-neonPurple/10 border-neonPurple/20 shadow-glowPurple/5' },
          { title: 'COMPLETED ACTIVITIES', value: completedBookings, icon: CheckCircle, color: 'text-neonGreen bg-neonGreen/10 border-neonGreen/20 shadow-glowGreen/5' },
          { title: 'HARDWARE CPU CORES', value: '4 ACTIVE', icon: Cpu, color: 'text-neonPink bg-neonPink/10 border-neonPink/20 shadow-glowPink/5' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-2 ${stat.color.split(' ')[1]} ${stat.color.split(' ')[2]}`}>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                <Icon className={`w-4 h-4 ${stat.color.split(' ')[0]}`} />
              </div>
              <p className="font-display font-black text-sm text-white tracking-widest mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* 3. CORE TWO COLUMN SECTIONS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: VISITOR BOOKINGS FORM */}
        <div className="xl:col-span-1">
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <h3 className="font-display font-black text-sm tracking-wider text-white pb-3 border-b border-darkBorder/40 flex items-center gap-2">
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
                  className="w-full bg-darkBg border border-darkBorder rounded-lg p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold"
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
                  className="w-full bg-darkBg border border-darkBorder rounded-lg p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold"
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
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
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
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
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
                  className="w-full bg-darkBg border border-darkBorder rounded-lg p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold"
                >
                  <option value="FCFS">First-Come-First-Served (FCFS)</option>
                  <option value="SJF">Shortest Job First (SJF)</option>
                  <option value="Priority">Priority Scheduling</option>
                  <option value="RR">Round Robin (RR)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowBlue transition-all flex items-center justify-center gap-1.5 uppercase disabled:opacity-50 mt-2"
              >
                {formLoading ? 'SCHEDULING TICKET...' : 'BOOK QUEUE ENTRANCE'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: BOOKINGS LIST (READY & TERMINATED PROCESSES) */}
        <div className="xl:col-span-2">
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <div className="flex justify-between items-center pb-3 border-b border-darkBorder/40">
              <h3 className="font-display font-black text-sm tracking-wider text-white flex items-center gap-2">
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
                  return (
                    <div
                      key={booking._id}
                      className="p-3 border border-darkBorder rounded-xl bg-darkBg/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-darkBorder"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-xs text-white">{booking.activity}</span>
                          <span className="text-[9px] font-mono font-bold text-gray-500 bg-darkBorder px-2 py-0.5 rounded border border-white/5 uppercase">
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
                      <span className={`text-[9px] font-mono font-bold px-2 py-1 rounded border self-start sm:self-center tracking-widest uppercase ${
                        isCompleted
                          ? 'border-neonGreen/30 text-neonGreen bg-neonGreen/5 shadow-inner shadow-glowGreen/5'
                          : 'border-neonPurple/30 text-neonPurple bg-neonPurple/5 animate-pulse shadow-inner shadow-glowPurple/5'
                      }`}>
                        {isCompleted ? 'TERMINATED' : 'READY QUEUE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick redirect details */}
            <div className="p-3 bg-neonBlue/5 border border-neonBlue/20 rounded-xl font-mono text-[9px] text-gray-400 leading-relaxed shadow-sm">
              <span className="text-neonBlue font-bold block uppercase tracking-wider mb-1">💡 QUEUE ALLOCATOR ACTION AVAILABLE:</span>
              To visual execute these ready visitor queues, go to the corresponding department page (e.g. <Link to="/reception" className="text-neonPurple underline font-bold">Reception</Link>, <Link to="/gaming-zone" className="text-neonPurple underline font-bold">Gaming PC Zone</Link>) from the sidebar, choose the scheduling properties, and click <b className="text-white">Run Department Scheduler</b>!
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
