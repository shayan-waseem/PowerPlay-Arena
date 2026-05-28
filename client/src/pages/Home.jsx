import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArenaContext } from '../context/ArenaContext';
import { AuthContext } from '../context/AuthContext';
import { Cpu, Gamepad2, Ticket, Play, Users, BarChart3, HelpCircle, ArrowRight, ShieldCheck, Zap, Sparkles, Activity } from 'lucide-react';
import Card from '../components/ui/Card';

const Home = () => {
  const { playClick, liveVisitors } = useContext(ArenaContext);
  const { isAuthenticated } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, type: 'spring', stiffness: 100 } }
  };

  const departments = [
    {
      name: 'Reception Dept.',
      desc: 'Simulates Walk-ins, VIP entries, and Event bookings.',
      algos: ['FCFS', 'Priority', 'Round Robin'],
      color: 'from-cyan-500/10 to-blue-500/5',
      border: 'border-cyan-500/30 hover:border-cyan-400',
      badge: 'text-cyan-400 bg-cyan-950/40',
      icon: Ticket,
      glow: 'group-hover:shadow-glowBlue'
    },
    {
      name: 'Kids Zone',
      desc: 'Controls trampoline rotation, VR mini rides, and toy timers.',
      algos: ['Priority', 'Round Robin'],
      color: 'from-purple-500/10 to-indigo-500/5',
      border: 'border-purple-500/30 hover:border-purple-400',
      badge: 'text-purple-400 bg-purple-950/40',
      icon: Zap,
      glow: 'group-hover:shadow-glowPurple'
    },
    {
      name: 'Adult Arena',
      desc: 'Allocates bowling alleys, laser tag gears, and VR treadmills.',
      algos: ['FCFS', 'Shortest Job First', 'Priority'],
      color: 'from-pink-500/10 to-rose-500/5',
      border: 'border-pink-500/30 hover:border-pink-400',
      badge: 'text-pink-400 bg-pink-950/40',
      icon: Users,
      glow: 'group-hover:shadow-glowPink'
    },
    {
      name: 'Gaming Zone',
      desc: 'Manages Esports tournaments, demo consoles, and game downloads.',
      algos: ['FCFS', 'SJF', 'Priority', 'Round Robin'],
      color: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      badge: 'text-emerald-400 bg-emerald-950/40',
      icon: Gamepad2,
      glow: 'group-hover:shadow-glowGreen'
    }
  ];

  const stats = [
    { label: 'LIVE VISITORS', value: liveVisitors, color: 'text-neonGreen' },
    { label: 'CPU CORES', value: '4 ACTIVE', color: 'text-neonBlue' },
    { label: 'SCHEDULERS', value: '4 LOADED', color: 'text-neonPurple' },
    { label: 'UPTIME', value: '99.9%', color: 'text-neonPink' },
  ];

  return (
    <div className="w-full select-none flex flex-col gap-16 py-8">
      
      {/* 1. HERO BANNER */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center relative max-w-4xl mx-auto py-16 flex flex-col items-center gap-6"
      >
        {/* Particle field background */}
        <div className="particle-field"></div>
        
        {/* Ambient glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neonPurple/8 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-neonBlue/8 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-neonPink/5 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div variants={itemVariants} className="flex items-center gap-2 px-4 py-1.5 bg-neonPurple/10 border border-neonPurple/30 text-neonPurple rounded-full text-xs font-semibold font-display tracking-widest uppercase shadow-glowPurple/10 relative z-10">
          <Sparkles className="w-3.5 h-3.5" />
          Operating System CPU Simulator
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-7xl font-black tracking-widest text-white uppercase font-display select-none leading-none relative z-10"
        >
          POWER PLAY <br />
          <span className="shimmer-text text-glow-blue">
            ARENA SIMULATOR
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed font-semibold tracking-wide relative z-10"
        >
          Welcome to the ultimate cyberpunk operating system scheduling simulator. Experience process management, gantt transitions, and core load balancing modeled as a premium dark-themed entertainment zone.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center mt-4 relative z-10">
          {isAuthenticated ? (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/dashboard"
                onClick={playClick}
                className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white hover:opacity-90 rounded-xl text-sm font-bold tracking-widest font-display shadow-glowPurple hover:shadow-glowBlue transition-all uppercase btn-glow"
              >
                ENTER DASHBOARD
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup"
                  onClick={playClick}
                  className="flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white hover:opacity-90 rounded-xl text-sm font-bold tracking-widest font-display shadow-glowPurple hover:shadow-glowBlue transition-all uppercase btn-glow"
                >
                  BOOK ENTRY TICKET
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  onClick={playClick}
                  className="px-7 py-3.5 border border-darkBorder hover:border-gray-500 text-gray-300 rounded-xl text-sm font-bold tracking-widest font-display hover:text-white transition-all uppercase"
                >
                  ADMIN DECRYPT
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* LIVE STATS TICKER BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-4 rounded-xl border border-darkBorder/60 text-center group hover:border-darkBorder transition-all"
            >
              <p className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`font-display font-black text-lg ${stat.color} tracking-wider`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 2. THE ANALOGY: VISITOR TO PROCESS MAPPING */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto w-full"
      >
        <Card className="border border-darkBorder/60 bg-darkCard/30 relative" tilt>
          <div className="absolute top-0 right-0 w-40 h-40 bg-neonBlue/5 rounded-full blur-[80px] pointer-events-none"></div>

          <h3 className="font-display font-black text-xl text-white tracking-widest text-glow-blue uppercase pb-4 border-b border-darkBorder/40 mb-6 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-neonBlue" />
            THE CONCEPT: HOW IT WORKS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: 'VISITORS', map: 'PROCESSES', desc: 'People arriving at the arena ready to play are represented as active OS Processes.', color: 'border-neonBlue text-neonBlue' },
              { title: 'QUEUES', map: 'READY QUEUE', desc: 'Waiting lines at the departments represent the Ready Queue holding processes.', color: 'border-neonPurple text-neonPurple' },
              { title: 'ACTIVITIES', map: 'CPU RESOURCES', desc: 'Gaming PCs, Bowling alleys, and VR gear represent CPU cores scheduled for execution.', color: 'border-neonPink text-neonPink' },
              { title: 'PLAY SESSIONS', map: 'CPU EXECUTION', desc: 'The actual duration visitors spend playing represents the execution burst time.', color: 'border-neonGreen text-neonGreen' },
              { title: 'FINISHED RIDES', map: 'TERMINATED', desc: 'When the play session completes, the visitor leaves the queue (process terminates).', color: 'border-yellow-500 text-yellow-400' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`p-4 rounded-xl border ${item.color.split(' ')[0]} bg-darkBg/40 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}
              >
                <span className="font-display font-black text-xs text-white tracking-wider block">{item.title}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border self-start ${item.color.split(' ')[1]} bg-darkBg/60 uppercase tracking-widest badge-pulse`}>
                  {item.map}
                </span>
                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* 3. THE DEPARTMENTS */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto w-full flex flex-col gap-8"
      >
        <div className="text-center flex flex-col items-center gap-3">
          <motion.div 
            initial={{ width: 0 }} 
            whileInView={{ width: '80px' }} 
            viewport={{ once: true }}
            className="h-px bg-gradient-to-r from-transparent via-neonPurple to-transparent"
          />
          <h2 className="font-display font-black text-2xl tracking-widest text-white uppercase text-glow-purple">
            EXPLORE THE ARENA DEPARTMENTS
          </h2>
          <p className="text-xs text-gray-400 max-w-xl font-semibold">
            Each department operates using custom scheduling algorithms configured to serve pending queues. Make bookings to add visitors and simulate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <Card
                key={idx}
                animate={true}
                delay={idx * 0.1}
                className={`flex flex-col h-full bg-gradient-to-b ${dept.color} ${dept.border} ${dept.glow} transition-shadow duration-500`}
              >
                <motion.div 
                  className="p-3 bg-darkBg/80 border border-darkBorder rounded-xl self-start text-neonBlue mb-4 group-hover:text-neonPurple transition-colors"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                
                <h4 className="font-display font-bold text-sm tracking-wider text-white mb-2">{dept.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 font-semibold flex-grow">{dept.desc}</p>

                <div className="flex flex-col gap-2 pt-4 border-t border-darkBorder/40 mt-auto">
                  <span className="text-[9px] font-mono text-gray-500 font-bold tracking-widest uppercase">SCHEDULERS ACTIVE:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.algos.map((algo, aidx) => (
                      <span key={aidx} className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${dept.badge} border border-white/5`}>
                        {algo}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* 4. SCHEDULING ALGORITHMS PREVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="flex flex-col gap-6">
            <h2 className="font-display font-black text-2xl tracking-widest text-white uppercase text-glow-pink">
              ALGORITHMS VISUAL LABS
            </h2>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Our simulator includes real, mathematically verified implementations of classic scheduling algorithms used in modern operating systems. Add processes with unique properties and observe ready queues and waiting times dynamically.
            </p>

            <div className="flex flex-col gap-3 font-semibold">
              {[
                { name: 'First Come First Served (FCFS)', desc: 'Processes are served purely based on arrival times. Simple, predictable, non-preemptive.' },
                { name: 'Shortest Job First (SJF)', desc: 'Runs process with smallest execution time. Supports Preemptive (SRTF) to minimize average waiting times.' },
                { name: 'Priority Scheduling', desc: 'Allows higher-importance visitors (e.g. VIPs) to preempt ordinary processes.' },
                { name: 'Round Robin Scheduling (RR)', desc: 'Slices processes into designated time quantums. Prevents starvation, guaranteeing fair CPU access.' }
              ].map((algo, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex gap-3 items-start p-3.5 rounded-xl border border-darkBorder/60 bg-darkBg/40 group hover:border-darkBorder transition-all"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-lg bg-neonBlue/10 border border-neonBlue/30 text-neonBlue font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5 group-hover:bg-neonBlue/20 group-hover:scale-110 transition-all">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs text-white tracking-wider">{algo.name}</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{algo.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interactive mockup preview showing live charts */}
          <div className="relative p-6 glass-panel-premium border border-neonBlue/20 rounded-2xl bg-darkCard/40 shadow-glowBlue/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonPink/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex justify-between items-center pb-3 border-b border-darkBorder/40 mb-4 font-mono text-[10px]">
              <span className="text-neonBlue font-bold flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonBlue opacity-50"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neonBlue"></span>
                </span>
                ACTIVE MONITOR: SCHEDULER UTILIZATION
              </span>
              <span className="text-gray-500">SYSTEM CORES: 4</span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Mock Timeline gantt */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-gray-400 font-bold uppercase">Mock Gantt Execution Flow:</span>
                <div className="h-12 bg-darkBg border border-darkBorder rounded-xl overflow-hidden flex font-mono text-[9px] font-bold text-center">
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: '35%' }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-neonBlue/20 border-r border-neonBlue text-neonBlue flex items-center justify-center"
                  >Visitor 1 (FCFS)</motion.div>
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: '45%' }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="bg-neonPurple/20 border-r border-neonPurple text-neonPurple flex items-center justify-center"
                  >Visitor 2 (SJF)</motion.div>
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: '20%' }} 
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="bg-neonPink/20 text-neonPink flex items-center justify-center"
                  >Visitor 3 (Priority)</motion.div>
                </div>
              </div>

              {/* Ready Queue Widget */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono text-gray-400 font-bold uppercase">Ready Queue waiting line:</span>
                <div className="flex gap-2 font-mono text-[9px] font-bold">
                  {['V4 [Burst: 10s]', 'V5 [Burst: 4s]', 'V6 [Burst: 15s]'].map((v, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                      className="px-2.5 py-1.5 rounded-lg bg-neonBlue/10 border border-neonBlue/30 text-neonBlue"
                    >{v}</motion.span>
                  ))}
                </div>
              </div>

              {/* Live metrics list */}
              <div className="grid grid-cols-3 gap-2 font-mono text-[9px] font-bold mt-2">
                <div className="p-2.5 border border-darkBorder bg-darkBg rounded-xl text-center">
                  <p className="text-gray-500 mb-0.5">CPU CORE SPEED</p>
                  <p className="text-neonGreen text-sm text-glow-green">98.4 %</p>
                </div>
                <div className="p-2.5 border border-darkBorder bg-darkBg rounded-xl text-center">
                  <p className="text-gray-500 mb-0.5">AVG WAIT TIME</p>
                  <p className="text-neonBlue text-sm text-glow-blue">5.4 Sec</p>
                </div>
                <div className="p-2.5 border border-darkBorder bg-darkBg rounded-xl text-center">
                  <p className="text-gray-500 mb-0.5">TOTAL VISITED</p>
                  <p className="text-neonPurple text-sm text-glow-purple">{liveVisitors}</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* FOOTER */}
      <footer className="pt-8 pb-4 text-center flex flex-col gap-3 font-mono text-[10px] text-gray-500 tracking-wider">
        <div className="gradient-divider-animated max-w-lg mx-auto w-full mb-4"></div>
        <p className="uppercase">
          POWER PLAY ARENA © {new Date().getFullYear()} — CREATED FOR UNIVERSITY CS PRESENTATION
        </p>
        <p className="text-neonPurple text-glow-purple font-display uppercase font-bold tracking-widest text-[9px] mt-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          SECURE CYBERPUNK SHELL ACTIVE
        </p>
      </footer>

    </div>
  );
};

export default Home;
