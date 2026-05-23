import React, { useState, useEffect, useContext } from 'react';
import { ArenaContext } from '../context/ArenaContext';
import axios from 'axios';
import { Cpu, Play, Trash2, Plus, RefreshCw, Save, HelpCircle, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import GanttChart from '../components/gantt/GanttChart';
import QueueVisualizer from '../components/scheduler/QueueVisualizer';

// Import frontend fallback algorithms to guarantee 100% client-side operations under any network state!
import simulateFCFS from "../simulators/fcfs.js";
import simulateSJF from "../simulators/sjf.js";
import simulatePriority from "../simulators/priority.js";
import simulateRoundRobin from "../simulators/roundRobin.js";

const Simulation = () => {
  const { playClick, playSuccess, playScheduleTick, playCompleteTick } = useContext(ArenaContext);

  // Core Process list state
  const [processes, setProcesses] = useState([
    { id: 'V1', name: 'PC Allocation 1', arrivalTime: 0, burstTime: 8, priority: 3 },
    { id: 'V2', name: 'VR Omni Headset', arrivalTime: 2, burstTime: 4, priority: 1 },
    { id: 'V3', name: 'Bowling Session', arrivalTime: 4, burstTime: 6, priority: 2 }
  ]);

  // Form states for adding processes
  const [newPid, setNewPid] = useState('V4');
  const [newName, setNewName] = useState('Laser Tag Battle');
  const [newArrival, setNewArrival] = useState(3);
  const [newBurst, setNewBurst] = useState(5);
  const [newPriority, setNewPriority] = useState(3);

  // Global Config states
  const [algorithm, setAlgorithm] = useState('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [preemptive, setPreemptive] = useState(false);
  const [lowerIsHigher, setLowerIsHigher] = useState(true);
  const [resourceSelected, setResourceSelected] = useState('Gaming PC Arena 1');

  // Simulation outputs
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState(false);

  // Playback states
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeProcessId, setActiveProcessId] = useState(null);
  const [readyQueue, setReadyQueue] = useState([]);
  const [completedQueue, setCompletedQueue] = useState([]);

  // Increment next PID suggestion
  const updatePidSuggestion = (list) => {
    const nextNum = list.length + 1;
    setNewPid(`V${nextNum}`);
  };

  const handleAddProcess = (e) => {
    e.preventDefault();
    playClick();

    if (!newPid.trim()) {
      toast.error('PROCESS ID IS REQUIRED');
      return;
    }

    if (processes.some(p => p.id === newPid)) {
      toast.error('PROCESS ID MUST BE UNIQUE');
      return;
    }

    if (newBurst <= 0) {
      toast.error('BURST TIME MUST EXCEED ZERO');
      return;
    }

    const updated = [
      ...processes,
      {
        id: newPid,
        name: newName || `Visitor ${newPid}`,
        arrivalTime: Number(newArrival),
        burstTime: Number(newBurst),
        priority: Number(newPriority)
      }
    ];

    setProcesses(updated);
    toast.success(`PROCESS ${newPid} ADDED TO LABORATORY QUEUE`);

    // Clear and suggest next pid
    setNewName('');
    setNewArrival(Math.max(...updated.map(p => p.arrivalTime)) + 2); // suggest next arrival time
    updatePidSuggestion(updated);
  };

  const handleDeleteProcess = (id) => {
    playClick();
    const updated = processes.filter(p => p.id !== id);
    setProcesses(updated);
    updatePidSuggestion(updated);
  };

  const handleClearAll = () => {
    playClick();
    setProcesses([]);
    setNewPid('V1');
  };

  const handleSeedDummyData = () => {
    playClick();
    const dummy = [
      { id: 'V1', name: 'Esports Gaming PC', arrivalTime: 0, burstTime: 10, priority: 3 },
      { id: 'V2', name: 'VIP Ticket Scan', arrivalTime: 2, burstTime: 3, priority: 1 },
      { id: 'V3', name: 'Mini Coaster Ride', arrivalTime: 4, burstTime: 7, priority: 4 },
      { id: 'V4', name: 'Hyper Bowling Ally', arrivalTime: 5, burstTime: 5, priority: 2 }
    ];
    setProcesses(dummy);
    updatePidSuggestion(dummy);
    toast.success('SEEDED 4 HIGH-CONTRAST DUMMY PROCESSES');
  };

  const handleExecuteSimulation = () => {
    playClick();
    if (processes.length === 0) {
      toast.error('ADD PROCESSES TO INITIATE LABORATORY');
      return;
    }

    // Direct frontend execution (fully robust, works instantly without backend lags!)
    let resultData;
    switch (algorithm) {
      case 'FCFS':
        resultData = simulateFCFS(processes);
        break;
      case 'SJF':
        resultData = simulateSJF(processes, preemptive);
        break;
      case 'Priority':
        resultData = simulatePriority(processes, preemptive, lowerIsHigher);
        break;
      case 'RR':
        resultData = simulateRoundRobin(processes, quantum);
        break;
      default:
        resultData = simulateFCFS(processes);
    }

    playSuccess();
    toast.success(`LAB SIMULATOR COMPUTED VIA ${algorithm}!`);
    setResults({
      algorithm,
      cpuUtilization: resultData.cpuUtilization,
      averageWaitingTime: resultData.averageWaitingTime,
      averageTurnaroundTime: resultData.averageTurnaroundTime,
      processes: resultData.processes,
      ganttData: resultData.ganttData
    });

    // Reset playback
    setCurrentStep(0);
    setIsPlaying(false);
    setActiveProcessId(null);
    setReadyQueue([]);
    setCompletedQueue([]);
  };

  const handleSaveToDatabase = async () => {
    playClick();
    if (!results) return;

    try {
      setSaving(true);
      const res = await axios.post('/api/simulations/save', {
        algorithm: results.algorithm,
        processes: results.processes,
        ganttData: results.ganttData,
        averageWaitingTime: results.averageWaitingTime,
        averageTurnaroundTime: results.averageTurnaroundTime,
        cpuUtilization: results.cpuUtilization,
        resourceSelected
      });

      if (res.data.success) {
        playSuccess();
        toast.success('SIMULATION HISTORY PERSISTED IN SECURE LOGS');
      }
    } catch (err) {
      toast.error('FAILED TO SAVE SIMULATION LOGS');
    } finally {
      setSaving(false);
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
          toast.success('LAB PLAYBACK COMPLETED!');
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

  return (
    <div className="flex flex-col gap-6 py-2 select-none">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-darkBorder/40">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-neonPurple/15 border border-neonPurple/30 text-neonPurple rounded-xl shadow-glowPurple/10 animate-pulse">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-white uppercase">MASTER SCHEDULING LAB</h2>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Customize visitor processes tables and evaluate Gantt mathematical balances.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSeedDummyData}
            className="px-3.5 py-1.5 bg-darkBg hover:bg-darkBorder border border-darkBorder rounded-lg text-xs font-bold font-display text-gray-300 transition-all tracking-wider"
          >
            SEED DUMMY SET
          </button>
          <button
            onClick={handleClearAll}
            className="px-3.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-bold font-display text-red-400 transition-all tracking-wider"
          >
            CLEAR QUEUE
          </button>
        </div>
      </div>

      {/* THREE LAYOUT COLUMNS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* COLUMN 1: PROCESS BUILDER FORM */}
        <div className="xl:col-span-1 flex flex-col gap-6">

          {/* Builder card */}
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <h4 className="font-display font-bold text-xs text-white tracking-wider uppercase border-b border-darkBorder/40 pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-neonBlue" />
              ADD CUSTOM VISITOR (PROCESS)
            </h4>

            <form onSubmit={handleAddProcess} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">PROCESS ID</label>
                  <input
                    type="text"
                    value={newPid}
                    onChange={(e) => setNewPid(e.target.value)}
                    placeholder="V4"
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">VISITOR NAME</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Laser Battle"
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[8px] font-bold text-gray-400 tracking-wider uppercase">ARRIVAL TIME</label>
                  <input
                    type="number"
                    min="0"
                    value={newArrival}
                    onChange={(e) => setNewArrival(Number(e.target.value))}
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[8px] font-bold text-gray-400 tracking-wider uppercase">BURST TIME</label>
                  <input
                    type="number"
                    min="1"
                    value={newBurst}
                    onChange={(e) => setNewBurst(Number(e.target.value))}
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-display text-[8px] font-bold text-gray-400 tracking-wider uppercase">PRIORITY</label>
                  <input
                    type="number"
                    min="1"
                    value={newPriority}
                    onChange={(e) => setNewPriority(Number(e.target.value))}
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2 text-xs font-mono text-white outline-none focus:border-neonPurple"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 border border-dashed border-neonPurple text-neonPurple hover:bg-neonPurple/5 text-xs font-bold font-display tracking-widest rounded-xl transition-all uppercase flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                ADD TO SYSTEM QUEUE
              </button>
            </form>
          </Card>

          {/* Schedulers config card */}
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <h4 className="font-display font-bold text-xs text-white tracking-wider uppercase border-b border-darkBorder/40 pb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neonPurple" />
              LAB CORE SETTINGS
            </h4>

            <div className="flex flex-col gap-4">
              {/* Algorithm select */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">ALGORITHM</label>
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

              {/* Quantum */}
              {algorithm === 'RR' && (
                <div className="flex flex-col gap-1.5 animate-fadeIn">
                  <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">ROUND ROBIN TIME QUANTUM</label>
                  <input
                    type="number"
                    min="1"
                    value={quantum}
                    onChange={(e) => setQuantum(Number(e.target.value))}
                    className="w-full bg-darkBg border border-darkBorder rounded-lg p-2.5 text-xs font-mono text-white outline-none focus:border-neonPurple"
                  />
                </div>
              )}

              {/* Preemptive checkbox */}
              {(algorithm === 'SJF' || algorithm === 'Priority') && (
                <div className="flex items-center justify-between p-3 border border-darkBorder/60 rounded-xl bg-darkBg/40 animate-fadeIn">
                  <div>
                    <p className="font-display font-bold text-[10px] text-white tracking-wider">PREEMPTIVE CONFLICT</p>
                    <p className="text-[9px] font-mono text-gray-500 mt-0.5">Enable SRTF/Preemptive execution to intercept active CPU runs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preemptive}
                    onChange={(e) => { playClick(); setPreemptive(e.target.checked); }}
                    className="w-4 h-4 rounded border-darkBorder focus:ring-neonPurple text-neonPurple accent-neonPurple cursor-pointer"
                  />
                </div>
              )}

              {/* Hardware resources target */}
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[9px] font-bold text-gray-400 tracking-wider uppercase">HARDWARE ALLOCATION TARGET</label>
                <select
                  value={resourceSelected}
                  onChange={(e) => { playClick(); setResourceSelected(e.target.value); }}
                  className="w-full bg-darkBg border border-darkBorder rounded-lg p-2.5 text-xs text-white outline-none focus:border-neonPurple font-semibold"
                >
                  <option value="Gaming PC Arena 1">Gaming PC Arena Core</option>
                  <option value="Hyper Bowling Lane 4">Bowling Alley Lane 4</option>
                  <option value="VR Omni-Treadmill 2">VR Omni Station 2</option>
                  <option value="Trampoline core 3">Bounce Park Trampoline 3</option>
                </select>
              </div>

              <button
                onClick={handleExecuteSimulation}
                className="w-full mt-2 py-3 bg-gradient-to-r from-neonPurple to-neonBlue text-white font-bold font-display text-xs tracking-widest rounded-xl hover:opacity-95 shadow-glowPurple transition-all flex items-center justify-center gap-1.5 uppercase"
              >
                EXECUTE PROCESSOR LAB
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>

            </div>
          </Card>

        </div>

        {/* COLUMN 2: ACTIVE LABORATORY QUEUE TABLE */}
        <div className="xl:col-span-2">
          <Card className="flex flex-col gap-4 border border-darkBorder/60 bg-darkCard/35">
            <div className="flex justify-between items-center pb-3 border-b border-darkBorder/40">
              <h3 className="font-display font-black text-sm tracking-wider text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-neonPurple" />
                ACTIVE PROCESS REGISTRY (QUEUED VISITORS)
              </h3>
              <span className="font-mono text-[9px] text-gray-500 font-bold">READY QUEUE SIZE: {processes.length} PROCESSES</span>
            </div>

            {processes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3 border border-dashed border-darkBorder rounded-xl bg-darkBg/10 text-gray-500 font-mono text-[10px]">
                <AlertTriangle className="w-6 h-6 text-yellow-500/70" />
                PROCESS TABLE IS CURRRENTLY EMPTY.
                <p className="text-[9px] text-neonBlue font-semibold">SEED DUMMY SET OR ADD PROCESSES ON THE LEFT PANEL.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] leading-relaxed">
                  <thead>
                    <tr className="border-b border-darkBorder text-gray-400 font-bold font-display uppercase tracking-wider">
                      <th className="pb-2">PID ID</th>
                      <th className="pb-2">Visitor Alias</th>
                      <th className="pb-2">Arrival ($A_T$)</th>
                      <th className="pb-2">Burst ($B_T$)</th>
                      <th className="pb-2">Priority VIP</th>
                      <th className="pb-2 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((p) => (
                      <tr key={p.id} className="border-b border-darkBorder/30 text-white/95">
                        <td className="py-2.5 font-bold text-neonBlue">{p.id}</td>
                        <td className="py-2.5 font-display font-semibold max-w-[130px] truncate">{p.name}</td>
                        <td className="py-2.5">{p.arrivalTime}s</td>
                        <td className="py-2.5 font-bold">{p.burstTime}s</td>
                        <td className="py-2.5">{p.priority}</td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteProcess(p.id)}
                            className="p-1 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded text-red-400 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* RESULTS DISPLAY: GANTT CHART, QUEUE TRANSITIONS, COMPILATIONS TABLES */}
      {results && (
        <div className="flex flex-col gap-6 animate-fadeIn mt-2">

          {/* Gantt timeline */}
          <GanttChart ganttData={results.ganttData} />

          {/* Queue transition step playback widget */}
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

          {/* Detailed metrics & stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Table computations */}
            <Card className="lg:col-span-2 border border-darkBorder/60 bg-darkCard/35 flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-darkBorder/40 mb-1">
                <h4 className="font-display font-bold text-xs text-white tracking-wider uppercase">
                  MATHEMATICAL OS PROCESS COMPUTATIONS
                </h4>

                {/* Save button */}
                <button
                  onClick={handleSaveToDatabase}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1 bg-neonPurple/15 hover:bg-neonPurple/25 text-neonPurple border border-neonPurple/30 rounded-lg text-[10px] font-bold font-display tracking-widest uppercase transition-all shadow-glowPurple/5"
                >
                  <Save className="w-3 h-3" />
                  {saving ? 'SAVING...' : 'SAVE SIM HISTORY'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] leading-relaxed">
                  <thead>
                    <tr className="border-b border-darkBorder text-gray-400 font-bold font-display uppercase tracking-wider">
                      <th className="pb-2">Process (Visitor)</th>
                      <th className="pb-2">Arrival</th>
                      <th className="pb-2">Burst</th>
                      <th className="pb-2">Priority</th>
                      <th className="pb-2">Completion</th>
                      <th className="pb-2">Wait</th>
                      <th className="pb-2">Turnaround</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.processes.map((p, idx) => (
                      <tr key={idx} className="border-b border-darkBorder/30 text-white/95">
                        <td className="py-2.5 font-display font-semibold max-w-[130px] truncate">{p.name}</td>
                        <td className="py-2.5 text-neonPurple font-bold">{p.arrivalTime}s</td>
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

            {/* Averages */}
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

export default Simulation;
