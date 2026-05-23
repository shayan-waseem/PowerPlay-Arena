import React, { useState, useEffect, useContext } from 'react';
import { ArenaContext } from '../context/ArenaContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  BarChart3, TrendingUp, Cpu, Activity, Zap, Users, Clock, Timer,
  ArrowUpRight, ArrowDownRight, Gauge
} from 'lucide-react';

const NEON_COLORS = {
  blue: '#06b6d4',
  purple: '#a855f7',
  pink: '#ec4899',
  green: '#10b981',
  yellow: '#eab308',
  orange: '#f97316',
};

const PIE_COLORS = ['#06b6d4', '#a855f7', '#ec4899', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-panel border border-darkBorder rounded-lg p-3 shadow-lg">
      <p className="font-display font-bold text-[10px] text-white tracking-wider mb-2 uppercase">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-[10px] font-mono">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
          <span className="text-gray-400">{entry.name}:</span>
          <span className="text-white font-bold">{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const Analytics = () => {
  const { playClick, liveVisitors } = useContext(ArenaContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('comparison');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/simulations/analytics');
      if (res.data.success) {
        setAnalytics(res.data.analytics);
      }
    } catch (err) {
      console.error(err);
      // Set fallback data if the API fails
      setAnalytics({
        visitorLoad: [
          { name: 'Reception', visitors: 142 },
          { name: 'Kids Zone', visitors: 98 },
          { name: 'Adult Arena', visitors: 165 },
          { name: 'Gaming Zone', visitors: 220 }
        ],
        algorithmComparison: [
          { name: 'FCFS', waitingTime: 12.5, turnaroundTime: 18.2, cpuUtilization: 92 },
          { name: 'SJF (Preempt)', waitingTime: 6.4, turnaroundTime: 11.2, cpuUtilization: 98 },
          { name: 'Priority', waitingTime: 9.8, turnaroundTime: 15.1, cpuUtilization: 94 },
          { name: 'Round Robin', waitingTime: 10.2, turnaroundTime: 16.0, cpuUtilization: 95 }
        ],
        hourlyPeak: [
          { hour: '09:00', visitors: 30 },
          { hour: '11:00', visitors: 85 },
          { hour: '13:00', visitors: 120 },
          { hour: '15:00', visitors: 160 },
          { hour: '17:00', visitors: 210 },
          { hour: '19:00', visitors: 245 },
          { hour: '21:00', visitors: 190 },
          { hour: '23:00', visitors: 70 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // Compute derived data
  const radarData = analytics?.algorithmComparison?.map(algo => ({
    algorithm: algo.name,
    'Waiting Time': 100 - (algo.waitingTime * 4), // invert so lower is better
    'CPU Util.': algo.cpuUtilization,
    'Throughput': 100 - (algo.turnaroundTime * 3),
  })) || [];

  const bestAlgo = analytics?.algorithmComparison?.reduce((best, curr) =>
    curr.cpuUtilization > best.cpuUtilization ? curr : best
  , analytics?.algorithmComparison?.[0] || { name: 'N/A', cpuUtilization: 0 });

  const fastestAlgo = analytics?.algorithmComparison?.reduce((best, curr) =>
    curr.waitingTime < best.waitingTime ? curr : best
  , analytics?.algorithmComparison?.[0] || { name: 'N/A', waitingTime: 0 });

  const totalVisitorLoad = analytics?.visitorLoad?.reduce((acc, d) => acc + d.visitors, 0) || 0;
  const peakHour = analytics?.hourlyPeak?.reduce((peak, curr) =>
    curr.visitors > peak.visitors ? curr : peak
  , analytics?.hourlyPeak?.[0] || { hour: 'N/A', visitors: 0 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-14 h-14 border-3 border-t-neonBlue border-r-neonPurple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="font-display text-neonBlue text-sm animate-pulse tracking-widest">COMPILING ANALYTICS DATA...</p>
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
      {/* 1. ANALYTICS HEADER */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[9px] font-mono font-bold text-neonBlue bg-neonBlue/10 px-2 py-0.5 rounded border border-neonBlue/20 tracking-wider">INTELLIGENCE MODULE</span>
          <h1 className="font-display font-black text-xl text-white tracking-widest uppercase mt-2 text-glow-blue">
            SCHEDULER ANALYTICS
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Comparative performance metrics across all scheduling algorithms. Data sourced from simulation runs.
          </p>
        </div>

        <button
          onClick={() => { playClick(); fetchAnalytics(); }}
          className="flex items-center gap-2 px-4 py-2 border border-neonBlue/30 text-neonBlue hover:bg-neonBlue/10 rounded-xl text-[10px] font-bold font-display tracking-widest transition-all uppercase self-start"
        >
          <Activity className="w-3.5 h-3.5" />
          REFRESH DATA
        </button>
      </motion.div>

      {/* 2. KEY METRICS */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            title: 'BEST CPU UTILIZATION',
            value: `${bestAlgo?.cpuUtilization?.toFixed(1)}%`,
            sub: bestAlgo?.name,
            icon: Cpu,
            color: 'text-neonGreen',
            bg: 'bg-neonGreen/10 border-neonGreen/20',
            trend: <ArrowUpRight className="w-3 h-3 text-neonGreen" />
          },
          {
            title: 'FASTEST AVG WAIT',
            value: `${fastestAlgo?.waitingTime?.toFixed(1)} units`,
            sub: fastestAlgo?.name,
            icon: Timer,
            color: 'text-neonBlue',
            bg: 'bg-neonBlue/10 border-neonBlue/20',
            trend: <ArrowDownRight className="w-3 h-3 text-neonBlue" />
          },
          {
            title: 'TOTAL DEPT LOAD',
            value: totalVisitorLoad,
            sub: 'Combined visitors',
            icon: Users,
            color: 'text-neonPurple',
            bg: 'bg-neonPurple/10 border-neonPurple/20',
            trend: <TrendingUp className="w-3 h-3 text-neonPurple" />
          },
          {
            title: 'PEAK HOUR',
            value: peakHour?.hour,
            sub: `${peakHour?.visitors} visitors`,
            icon: Zap,
            color: 'text-neonPink',
            bg: 'bg-neonPink/10 border-neonPink/20',
            trend: <ArrowUpRight className="w-3 h-3 text-neonPink" />
          }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border ${metric.bg} flex flex-col gap-2`}>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono font-bold text-gray-400 uppercase tracking-wider">{metric.title}</span>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <div className="flex items-end gap-2">
                <p className={`font-display font-black text-lg ${metric.color} tracking-wider`}>{metric.value}</p>
                {metric.trend}
              </div>
              <span className="text-[9px] font-mono text-gray-500 font-bold">{metric.sub}</span>
            </div>
          );
        })}
      </motion.div>

      {/* 3. MAIN CHARTS: ALGORITHM COMPARISON BAR + AREA */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* COMPARISON BAR CHART */}
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <BarChart3 className="w-4 h-4 text-neonPurple" />
              Algorithm Waiting Time vs Turnaround
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.algorithmComparison || []} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d243e" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Orbitron' }}
                  axisLine={{ stroke: '#1d243e' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#1d243e' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                  iconSize={8}
                />
                <Bar dataKey="waitingTime" name="Avg Wait Time" fill={NEON_COLORS.blue} radius={[4, 4, 0, 0]} />
                <Bar dataKey="turnaroundTime" name="Avg Turnaround" fill={NEON_COLORS.purple} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* CPU UTILIZATION LINE CHART */}
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Gauge className="w-4 h-4 text-neonGreen" />
              CPU Utilization Per Algorithm
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.algorithmComparison || []} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d243e" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Orbitron' }}
                  axisLine={{ stroke: '#1d243e' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[80, 100]}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#1d243e' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cpuUtilization" name="CPU Utilization %" fill={NEON_COLORS.green} radius={[4, 4, 0, 0]}>
                  {(analytics?.algorithmComparison || []).map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* 4. DEPARTMENT LOAD + HOURLY PEAK ROW */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* DEPARTMENT VISITOR PIE CHART */}
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Users className="w-4 h-4 text-neonBlue" />
              Department Visitor Distribution
            </h3>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.visitorLoad || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="visitors"
                  nameKey="name"
                  stroke="none"
                >
                  {(analytics?.visitorLoad || []).map((entry, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Department labels below */}
          <div className="grid grid-cols-2 gap-2">
            {(analytics?.visitorLoad || []).map((dept, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-darkBg/40 border border-darkBorder/30 rounded-lg">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                <span className="text-[10px] font-mono text-gray-400">{dept.name}:</span>
                <span className="text-[10px] font-mono text-white font-bold">{dept.visitors}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* HOURLY PEAK AREA CHART */}
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Clock className="w-4 h-4 text-neonPink" />
              Hourly Peak Visitor Traffic
            </h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.hourlyPeak || []}>
                <defs>
                  <linearGradient id="gradientPink" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NEON_COLORS.pink} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={NEON_COLORS.pink} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d243e" />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Orbitron' }}
                  axisLine={{ stroke: '#1d243e' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={{ stroke: '#1d243e' }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke={NEON_COLORS.pink}
                  fill="url(#gradientPink)"
                  strokeWidth={2}
                  dot={{ fill: NEON_COLORS.pink, r: 3 }}
                  activeDot={{ r: 5, stroke: NEON_COLORS.pink, strokeWidth: 2, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* 5. RADAR CHART — ALGORITHM PERFORMANCE SPIDER */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <Activity className="w-4 h-4 text-neonPurple" />
              Algorithm Performance Radar — Multi-Metric Comparison
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1d243e" />
                <PolarAngleAxis
                  dataKey="algorithm"
                  tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Orbitron' }}
                />
                <PolarRadiusAxis
                  tick={{ fontSize: 8, fill: '#4b5563' }}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Radar name="Waiting Time" dataKey="Waiting Time" stroke={NEON_COLORS.blue} fill={NEON_COLORS.blue} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CPU Util." dataKey="CPU Util." stroke={NEON_COLORS.green} fill={NEON_COLORS.green} fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Throughput" dataKey="Throughput" stroke={NEON_COLORS.purple} fill={NEON_COLORS.purple} fillOpacity={0.1} strokeWidth={2} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }}
                  iconSize={8}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* 6. SUMMARY TABLE */}
      <motion.div variants={itemVariants}>
        <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
          <div className="flex items-center justify-between pb-3 border-b border-darkBorder/40">
            <h3 className="font-display font-black text-xs tracking-wider text-white flex items-center gap-2 uppercase">
              <BarChart3 className="w-4 h-4 text-neonBlue" />
              Detailed Algorithm Metrics Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-darkBorder/60">
                  <th className="text-left p-3 text-gray-500 font-bold uppercase text-[10px] tracking-wider">Algorithm</th>
                  <th className="text-center p-3 text-gray-500 font-bold uppercase text-[10px] tracking-wider">Avg Wait Time</th>
                  <th className="text-center p-3 text-gray-500 font-bold uppercase text-[10px] tracking-wider">Avg Turnaround</th>
                  <th className="text-center p-3 text-gray-500 font-bold uppercase text-[10px] tracking-wider">CPU Util.</th>
                  <th className="text-center p-3 text-gray-500 font-bold uppercase text-[10px] tracking-wider">Efficiency Rating</th>
                </tr>
              </thead>
              <tbody>
                {(analytics?.algorithmComparison || []).map((algo, idx) => {
                  const efficiency = ((algo.cpuUtilization / 100) * (1 / (algo.waitingTime + 1)) * 100).toFixed(1);
                  const isTop = algo.cpuUtilization === bestAlgo?.cpuUtilization;
                  return (
                    <tr key={idx} className={`border-b border-darkBorder/20 hover:bg-darkBorder/10 transition-all ${isTop ? 'bg-neonGreen/5' : ''}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></span>
                          <span className="text-white font-bold font-display text-[11px] tracking-wider">{algo.name}</span>
                          {isTop && <span className="text-[8px] font-mono text-neonGreen bg-neonGreen/10 px-1.5 py-0.5 rounded border border-neonGreen/20">BEST</span>}
                        </div>
                      </td>
                      <td className="text-center p-3 text-neonBlue font-bold">{algo.waitingTime}</td>
                      <td className="text-center p-3 text-neonPurple font-bold">{algo.turnaroundTime}</td>
                      <td className="text-center p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-darkBg rounded-full overflow-hidden border border-darkBorder">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${algo.cpuUtilization}%`,
                                backgroundColor: PIE_COLORS[idx]
                              }}
                            ></div>
                          </div>
                          <span className="text-neonGreen font-bold">{algo.cpuUtilization}%</span>
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className={`font-bold ${Number(efficiency) > 7 ? 'text-neonGreen' : Number(efficiency) > 5 ? 'text-yellow-400' : 'text-neonPink'}`}>
                          {efficiency}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default Analytics;
