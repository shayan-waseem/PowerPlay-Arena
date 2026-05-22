import React, { useState, useEffect, useContext } from 'react';
import { ArenaContext } from '../context/ArenaContext';
import axios from 'axios';
import { Dumbbell, Play, AlertTriangle, Clock, Award, ShieldAlert, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import GanttChart from '../components/gantt/GanttChart';
import QueueVisualizer from '../components/scheduler/QueueVisualizer';

const AdultActivities = () => {
  const { playClick, playSuccess, playScheduleTick, playCompleteTick } = useContext(ArenaContext);

  // States
  const [pendingQueue, setPendingQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulation config parameters
  const [algorithm, setAlgorithm] = useState('SJF');
  const [preemptive, setPreemptive] = useState(false);
  const [lowerIsHigher, setLowerIsHigher] = useState(true);

  // Simulation output results
  const [results, setResults] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Step-by-step playback states for QueueVisualizer
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState(null);
  const [readyQueue, setReadyQueue] = useState([]);
  const [completedQueue, setCompletedQueue] = useState([]);

  const fetchPendingQueue = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/bookings/my');
      if (res.data.success) {
        // Filter specifically for adult pending bookings
        const filtered = res.data.bookings.filter(b => b.department === 'adult' && b.status === 'pending');
        setPendingQueue(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  const handleSimulate = async () => {
    playClick();
    if (pendingQueue.length === 0) {
      toast.error('NO PENDING VISITORS IN THE ADULT ARENA QUEUE');
      return;
    }

    try {
      setSimulating(true);
      const res = await axios.post('/api/bookings/simulate/adult', {
        algorithm,
        preemptive,
        lowerIsHigher
      });

      if (res.data.success) {
        playSuccess();
        toast.success(`ADULT ARENA SCHEDULER EXECUTED VIA ${res.data.algorithm}!`);
        setResults(res.data);
        
        // Reset playback states
        setCurrentStep(0);
        setIsPlaying(false);
        setActiveProcessId(null);
        setReadyQueue([]);
        setCompletedQueue([]);
        
        // Clear pending queue local state
        setPendingQueue([]);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'SIMULATOR FAULT. CORRUPT QUANTUM.');
    } finally {
      setSimulating(false);
    }
  };

  // Step playback loop
  useEffect(() => {
    let interval;
    if (isPlaying && results) {
      const gantt = results.ganttData;
      const totalTime = Math.max(...gantt.map(g => g.end));

      interval = setInterval(() => {
        if (currentStep >= totalTime) {
          setIsPlaying(false);
          setActiveProcessId(null);
          playCompleteTick();
          toast.success('ADULT ARENA PLAYBACK COMPLETE!');
          return;
        }

        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        playScheduleTick();

        // 1. Find running process at nextStep
        const activeBlock = gantt.find(g => nextStep > g.start && nextStep <= g.end);
        if (activeBlock) {
          setActiveProcessId(activeBlock.id);
        } else {
          setActiveProcessId('IDLE');
        }

        // 2. Compile ready list at nextStep
        const updatedReady = [];
        const updatedCompleted = [];

        results.processes.forEach(p => {
          const blocks = gantt.filter(g => g.id === p.id);
          const hasArrived = p.arrivalTime <= nextStep;
          const isFinished = p.completionTime <= nextStep;

          if (isFinished) {
            updatedCompleted.push(p);
          } else if (hasArrived && activeBlock?.id !== p.id) {
            updatedReady.push(p);
          }
        });

        setReadyQueue(updatedReady);
        setCompletedQueue(updatedCompleted);

      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, results]);

  const startPlayback = () => {
    if (!results) return;
    setIsPlaying(true);
  };

  const pausePlayback = () => {
    setIsPlaying(false);
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setActiveProcessId(null);
    setReadyQueue([]);
    setCompletedQueue([]);
  };

  const makeQuickBooking = async () => {
    playClick();
    try {
      const quickBookings = [
        { activity: 'Hyper bowling lane 4', time: 25, prio: 3, algo: 'SJF' },
        { activity: 'Sci-fi Laser tag team arena', time: 18, prio: 2, algo: 'Priority' },
        { activity: 'Professional Racing Simulator', time: 12, prio: 4, algo: 'SJF' },
        { activity: 'VR Omni-directional Treadmill', time: 15, prio: 1, algo: 'Priority' }
      ];
      
      const select = quickBookings[Math.floor(Math.random() * quickBookings.length)];

      const res = await axios.post('/api/bookings', {
        department: 'adult',
        activity: select.activity,
        algorithm: select.algo,
        sessionTime: select.time,
        priority: select.prio
      });

      if (res.data.success) {
        playSuccess();
        toast.success('ADULT QUEUED IN READY QUEUE!');
        fetchPendingQueue();
      }
    } catch (e) {
      toast.error('FAILED TO QUEUE VISITOR');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 select-none">
      
      {/* HEADER TITLE */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-darkBorder/40">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neonPink/15 border border-neonPink/30 text-neonPink rounded-xl shadow-glowPink/10">
            <Dumbbell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-white uppercase">ADULT ACTIVITIES</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Moderate bowling lanes, laser tag gear allocations, and VR simulators.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-gray-500 font-bold uppercase">SCHEDULERS:</span>
          <span className="font-mono font-bold text-[9px] bg-neonBlue/10 text-neonBlue border border-neonBlue/20 px-2 py-0.5 rounded uppercase">FCFS</span>
          <span className="font-mono font-bold text-[9px] bg-neonPink/10 text-neonPink border border-neonPink/20 px-2 py-0.5 rounded uppercase">SJF</span>
          <span className="font-mono font-bold text-[9px] bg-neonPurple/10 text-neonPurple border border-neonPurple/20 px-2 py-0.5 rounded uppercase">PRIORITY</span>
        </div>
      </div>

      {/* CORE OPTIONS PANEL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* SCHEDULER SELECTION PANEL */}
        <div className="xl:col-span-1">
          <Card className="flex flex-col gap-5 border border-darkBorder/60 bg-darkCard/35">
            <h3 className="font-display font-black text-sm tracking-wider text-white pb-3 border-b border-darkBorder/40 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neonPink animate-spin [animation-duration:10s]" />
              SCHEDULER CONFIGURATION
            </h3>

            <div className="flex flex-col gap-4">
              
              {/* Algorithm select */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">ALGORITHM CHOICE</label>
                <select
                  value={algorithm}
                  onChange={(e) => { playClick(); setAlgorithm(e.target.value); }}
                  className="w-full bg-darkBg border border-darkBorder rounded-lg p-2.5 text-xs text-white outline-none focus:border-neonPink font-semibold"
                >
                  <option value="SJF">Shortest Job First (SJF)</option>
                  <option value="FCFS">First-Come-First-Served (FCFS)</option>
                  <option value="Priority">Priority Scheduling</option>
                </select>
              </div>

              {/* Preemptive (SJF and Priority only) */}
              {algorithm !== 'FCFS' && (
                <div className="flex items-center justify-between p-3 border border-darkBorder/60 rounded-xl bg-darkBg/40 animate-fadeIn">
                  <div>
                    <p className="font-display font-bold text-[10px] text-white tracking-wider">PREEMPTIVE CONFLICT</p>
                    <p className="text-[9px] font-mono text-gray-500 mt-0.5">Enable SRTF/Preemptive execution to intercept runs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preemptive}
                    onChange={(e) => { playClick(); setPreemptive(e.target.checked); }}
                    className="w-4 h-4 rounded border-darkBorder focus:ring-neonPink text-neonPink accent-neonPink cursor-pointer"
                  />
                </div>
              )}

              <button
                onClick={handleSimulate}
                disabled={simulating || pendingQueue.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowPink transition-all flex items-center justify-center gap-1.5 uppercase disabled:opacity-50 mt-2"
              >
                {simulating ? 'BALANCING QUEUES...' : 'RUN ADULT SCHEDULER'}
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>

            </div>
          </Card>
        </div>

        {/* PENDING WAITING LIST */}
        <div className="xl:col-span-2">
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <div className="flex justify-between items-center pb-3 border-b border-darkBorder/40">
              <h3 className="font-display font-black text-sm tracking-wider text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-neonPink animate-pulse" />
                PENDING ADULT QUEUE (READY QUEUE)
              </h3>
              <span className="font-mono text-[9px] text-gray-500 font-bold">READY STATE: {pendingQueue.length} VISITORS</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-8 h-8 border-2 border-t-neonPink border-b-transparent border-l-transparent border-r-transparent rounded-full animate-spin"></div>
                <p className="font-mono text-[9px] text-gray-500 tracking-wider">LOADING ADULT REGISTRATIONS...</p>
              </div>
            ) : pendingQueue.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="p-4 bg-darkBg/60 border border-dashed border-darkBorder rounded-xl max-w-sm text-gray-500 font-mono text-[10px]">
                  <AlertTriangle className="w-6 h-6 text-yellow-500/70 mx-auto mb-2 animate-bounce" />
                  ADULT BOWLING ALLIES ARE CURRRENTLY EMPTY. NO ACTIVE VISITOR PROCESSES DETECTED.
                </div>
                <button
                  onClick={makeQuickBooking}
                  className="px-4 py-2 bg-neonPink/10 hover:bg-neonPink/20 text-neonPink border border-neonPink/30 text-xs font-bold font-display rounded-xl tracking-wider shadow-glowPink/5 transition-all"
                >
                  Queue quick adult activity
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                {pendingQueue.map((item, idx) => (
                  <div key={item._id} className="p-2.5 border border-darkBorder rounded-xl bg-darkBg/40 flex justify-between items-center transition-all hover:border-darkBorder">
                    <div>
                      <p className="font-display font-bold text-xs text-white">{item.activity}</p>
                      <p className="font-mono text-[9px] text-gray-400 mt-0.5">Burst: {item.sessionTime}s | Priority VIP: {item.priority}</p>
                    </div>
                    <span className="font-mono font-bold text-[9px] text-neonPink bg-neonPink/15 px-2 py-0.5 rounded border border-neonPink/20 uppercase tracking-widest animate-pulse">
                      READY
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* RESULTS DISPLAY: GANTT CHART & METRICS */}
      {results && (
        <div className="flex flex-col gap-6 animate-fadeIn mt-2">
          
          {/* Gantt Timeline visual */}
          <GanttChart ganttData={results.ganttData} />

          {/* Queue transition animation playback widget */}
          <QueueVisualizer
            processes={results.processes}
            ganttData={results.ganttData}
            currentStep={currentStep}
            isPlaying={isPlaying}
            onPlay={startPlayback}
            onPause={pausePlayback}
            onReset={resetPlayback}
            activeProcessId={activeProcessId}
            readyQueue={readyQueue}
            completedQueue={completedQueue}
          />

          {/* Detailed metrics table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Table panel */}
            <Card className="lg:col-span-2 border border-darkBorder/60 bg-darkCard/35 flex flex-col gap-3">
              <h4 className="font-display font-bold text-xs text-white tracking-wider uppercase border-b border-darkBorder/40 pb-2 mb-1">
                MATHEMATICAL OS PROCESS COMPUTATIONS
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] leading-relaxed select-none">
                  <thead>
                    <tr className="border-b border-darkBorder text-gray-400">
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Process (Visitor)</th>
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Arrival</th>
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Burst</th>
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Priority</th>
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Completion</th>
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Wait</th>
                      <th className="pb-2 font-display uppercase tracking-wider font-bold">Turnaround</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.processes.map((p, idx) => (
                      <tr key={idx} className="border-b border-darkBorder/30 text-white/95">
                        <td className="py-2.5 font-display font-semibold max-w-[130px] truncate">{p.name}</td>
                        <td className="py-2.5 text-neonPink font-bold">{p.arrivalTime}s</td>
                        <td className="py-2.5 text-white font-bold">{p.burstTime}s</td>
                        <td className="py-2.5 text-white">{p.priority}</td>
                        <td className="py-2.5 text-neonPurple font-bold">{p.completionTime}s</td>
                        <td className="py-2.5 text-neonGreen font-bold">{p.waitingTime}s</td>
                        <td className="py-2.5 text-neonPink font-bold">{p.turnaroundTime}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Averages block card */}
            <Card className="lg:col-span-1 border border-darkBorder/60 bg-darkCard/35 flex flex-col gap-4 items-stretch justify-center">
              <h4 className="font-display font-bold text-xs text-white tracking-wider uppercase border-b border-darkBorder/40 pb-2">
                OVERALL SCHEDULER STATISTICS
              </h4>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center p-3 rounded-lg border border-darkBorder bg-darkBg">
                  <span className="font-display text-[9px] font-bold text-gray-500 uppercase tracking-widest">CPU CORE LOAD</span>
                  <span className="font-mono font-bold text-xs text-neonGreen text-glow-green">{results.cpuUtilization}%</span>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-lg border border-darkBorder bg-darkBg">
                  <span className="font-display text-[9px] font-bold text-gray-500 uppercase tracking-widest">AVERAGE WAIT TIME</span>
                  <span className="font-mono font-bold text-xs text-neonBlue text-glow-blue">{results.averageWaitingTime}s</span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg border border-darkBorder bg-darkBg">
                  <span className="font-display text-[9px] font-bold text-gray-500 uppercase tracking-widest">AVG TURNAROUND TIME</span>
                  <span className="font-mono font-bold text-xs text-neonPink text-glow-pink">{results.averageTurnaroundTime}s</span>
                </div>
              </div>
            </Card>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdultActivities;
