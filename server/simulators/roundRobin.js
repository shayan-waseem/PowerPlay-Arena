/**
 * Round Robin (RR) Scheduling Algorithm Simulator
 * @param {Array} processList - Array of processes { id, name, arrivalTime, burstTime }
 * @param {Number} quantum - Time quantum
 * @returns {Object} { processes, ganttData, averageWaitingTime, averageTurnaroundTime, cpuUtilization }
 */
function simulateRoundRobin(processList, quantum = 2) {
  if (!processList || processList.length === 0) {
    return { processes: [], ganttData: [], averageWaitingTime: 0, averageTurnaroundTime: 0, cpuUtilization: 0 };
  }

  // Ensure quantum is at least 1
  quantum = Math.max(1, Number(quantum));

  // Clone processes to preserve inputs
  let processes = processList.map(p => ({
    id: p.id,
    name: p.name || `Visitor ${p.id}`,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.burstTime),
    priority: Number(p.priority || 0),
    waitingTime: 0,
    turnaroundTime: 0,
    completionTime: 0
  }));

  // Sort by arrival time initially
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let ganttData = [];
  let currentTime = 0;
  let queue = [];
  let completed = 0;
  const n = processes.length;
  let totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);

  // Keep track of which processes have entered the queue
  let inQueue = {};

  // Find and enqueue processes that have arrived at or before currentTime
  const enqueueNewArrivals = (time) => {
    processes.forEach(p => {
      if (p.arrivalTime <= time && !inQueue[p.id] && p.remainingTime > 0) {
        queue.push(p);
        inQueue[p.id] = true;
      }
    });
  };

  // Start by enqueuing process(es) at currentTime
  enqueueNewArrivals(currentTime);

  // If no process arrived yet, jump to the first arrival
  if (queue.length === 0 && completed < n) {
    let nextArrival = processes[0];
    ganttData.push({
      id: 'IDLE',
      name: 'Idle Time',
      start: currentTime,
      end: nextArrival.arrivalTime
    });
    currentTime = nextArrival.arrivalTime;
    enqueueNewArrivals(currentTime);
  }

  while (queue.length > 0 || completed < n) {
    if (queue.length === 0) {
      // Find next process that arrives
      let nextArrival = processes.find(p => p.remainingTime > 0);
      if (nextArrival) {
        ganttData.push({
          id: 'IDLE',
          name: 'Idle Time',
          start: currentTime,
          end: nextArrival.arrivalTime
        });
        currentTime = nextArrival.arrivalTime;
        enqueueNewArrivals(currentTime);
      }
      continue;
    }

    // Dequeue process
    let currentProcess = queue.shift();
    let runTime = Math.min(currentProcess.remainingTime, quantum);

    const start = currentTime;
    const end = currentTime + runTime;

    ganttData.push({
      id: currentProcess.id,
      name: currentProcess.name,
      start: start,
      end: end
    });

    // Advance current time
    currentTime = end;

    // First check for any new arrivals during the execution window (excluding currentProcess if it was already in queue)
    enqueueNewArrivals(currentTime);

    currentProcess.remainingTime -= runTime;

    if (currentProcess.remainingTime > 0) {
      // Re-enqueue the running process
      queue.push(currentProcess);
    } else {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      if (currentProcess.waitingTime < 0) currentProcess.waitingTime = 0;
      completed++;
    }
  }

  // Post-process Gantt chart to combine adjacent identical process executions (for better visuals, though not strictly required, standard is good)
  // Let's keep it as is, because showing the quantum slices in Gantt chart is actually BETTER for Round Robin visualization! It shows that the process ran for 2 units, then got interrupted, then ran again.

  const totalTime = currentTime;
  const cpuUtilization = totalTime > 0 ? (totalBurstTime / totalTime) * 100 : 0;

  const totalWaitingTime = processes.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);

  processes = processes.map(p => ({
    id: p.id,
    name: p.name,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    priority: p.priority,
    completionTime: p.completionTime,
    waitingTime: p.waitingTime,
    turnaroundTime: p.turnaroundTime
  }));

  return {
    processes,
    ganttData,
    averageWaitingTime: Number((totalWaitingTime / processes.length).toFixed(2)),
    averageTurnaroundTime: Number((totalTurnaroundTime / processes.length).toFixed(2)),
    cpuUtilization: Number(cpuUtilization.toFixed(2))
  };
}

module.exports = simulateRoundRobin;
