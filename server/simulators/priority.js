/**
 * Priority Scheduling Algorithm Simulator (Supports Preemptive & Non-Preemptive)
 * @param {Array} processList - Array of processes { id, name, arrivalTime, burstTime, priority }
 * @param {Boolean} preemptive - True for Preemptive Priority Scheduling
 * @param {Boolean} lowerIsHigher - True if a lower number represents a higher priority (e.g., 1 is high, 5 is low)
 * @returns {Object} { processes, ganttData, averageWaitingTime, averageTurnaroundTime, cpuUtilization }
 */
function simulatePriority(processList, preemptive = false, lowerIsHigher = true) {
  if (!processList || processList.length === 0) {
    return { processes: [], ganttData: [], averageWaitingTime: 0, averageTurnaroundTime: 0, cpuUtilization: 0 };
  }

  // Clone processes to preserve inputs
  let processes = processList.map(p => ({
    id: p.id,
    name: p.name || `Visitor ${p.id}`,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.burstTime),
    priority: Number(p.priority || 3),
    waitingTime: 0,
    turnaroundTime: 0,
    completionTime: 0
  }));

  let ganttData = [];
  let currentTime = 0;
  let totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);

  // Sorting function helper based on priority rules
  const comparePriorities = (a, b) => {
    if (a.priority !== b.priority) {
      return lowerIsHigher ? a.priority - b.priority : b.priority - a.priority;
    }
    // Tie breaker: earlier arrival time
    return a.arrivalTime - b.arrivalTime;
  };

  if (preemptive) {
    // PREEMPTIVE
    let completed = 0;
    const n = processes.length;
    let lastActiveId = null;
    let activeSegmentStart = 0;

    while (completed < n) {
      // Find all processes that have arrived and have remaining burst time
      let available = processes.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);

      if (available.length === 0) {
        if (lastActiveId !== 'IDLE') {
          if (lastActiveId !== null) {
            ganttData.push({
              id: lastActiveId,
              name: lastActiveId === 'IDLE' ? 'Idle Time' : processes.find(p => p.id === lastActiveId).name,
              start: activeSegmentStart,
              end: currentTime
            });
          }
          lastActiveId = 'IDLE';
          activeSegmentStart = currentTime;
        }
        currentTime++;
        continue;
      }

      // Sort by priority, tie-breaker: arrival
      available.sort(comparePriorities);

      let currentProcess = available[0];

      if (lastActiveId !== currentProcess.id) {
        if (lastActiveId !== null) {
          ganttData.push({
            id: lastActiveId,
            name: lastActiveId === 'IDLE' ? 'Idle Time' : processes.find(p => p.id === lastActiveId).name,
            start: activeSegmentStart,
            end: currentTime
          });
        }
        lastActiveId = currentProcess.id;
        activeSegmentStart = currentTime;
      }

      currentProcess.remainingTime--;
      currentTime++;

      if (currentProcess.remainingTime === 0) {
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        if (currentProcess.waitingTime < 0) currentProcess.waitingTime = 0;
        completed++;
      }
    }

    if (lastActiveId !== null) {
      ganttData.push({
        id: lastActiveId,
        name: lastActiveId === 'IDLE' ? 'Idle Time' : processes.find(p => p.id === lastActiveId).name,
        start: activeSegmentStart,
        end: currentTime
      });
    }

  } else {
    // NON-PREEMPTIVE
    let completed = {};
    const n = processes.length;

    while (Object.keys(completed).length < n) {
      let available = processes.filter(p => p.arrivalTime <= currentTime && !completed[p.id]);

      if (available.length === 0) {
        let nextProcess = processes
          .filter(p => !completed[p.id])
          .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];

        ganttData.push({
          id: 'IDLE',
          name: 'Idle Time',
          start: currentTime,
          end: nextProcess.arrivalTime
        });
        currentTime = nextProcess.arrivalTime;
        available = [nextProcess];
      }

      available.sort(comparePriorities);

      let currentProcess = available[0];

      const start = currentTime;
      const end = currentTime + currentProcess.burstTime;

      ganttData.push({
        id: currentProcess.id,
        name: currentProcess.name,
        start: start,
        end: end
      });

      currentProcess.completionTime = end;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      if (currentProcess.waitingTime < 0) currentProcess.waitingTime = 0;

      completed[currentProcess.id] = true;
      currentTime = end;
    }
  }

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

module.exports = simulatePriority;
