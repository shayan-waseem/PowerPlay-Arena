/**
 * First-Come-First-Served (FCFS) Scheduling Algorithm Simulator
 * @param {Array} processList - Array of processes { id, name, arrivalTime, burstTime }
 * @returns {Object} { processes, ganttData, averageWaitingTime, averageTurnaroundTime, cpuUtilization }
 */
function simulateFCFS(processList) {
  if (!processList || processList.length === 0) {
    return { processes: [], ganttData: [], averageWaitingTime: 0, averageTurnaroundTime: 0, cpuUtilization: 0 };
  }

  // Clone processes to avoid modifying input
  let processes = processList.map(p => ({
    id: p.id,
    name: p.name || `Visitor ${p.id}`,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    priority: Number(p.priority || 0)
  }));

  // Sort by arrival time
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let ganttData = [];
  let totalBurstTime = 0;

  processes.forEach(p => {
    // If CPU is idle before process arrives, add idle slot or jump
    if (currentTime < p.arrivalTime) {
      ganttData.push({
        id: 'IDLE',
        name: 'Idle Time',
        start: currentTime,
        end: p.arrivalTime
      });
      currentTime = p.arrivalTime;
    }

    const start = currentTime;
    const end = currentTime + p.burstTime;

    ganttData.push({
      id: p.id,
      name: p.name,
      start: start,
      end: end
    });

    p.completionTime = end;
    p.turnaroundTime = p.completionTime - p.arrivalTime;
    p.waitingTime = p.turnaroundTime - p.burstTime;

    // Safety checks for negative values
    if (p.waitingTime < 0) p.waitingTime = 0;

    totalBurstTime += p.burstTime;
    currentTime = end;
  });

  const totalTime = currentTime;
  const cpuUtilization = totalTime > 0 ? (totalBurstTime / totalTime) * 100 : 0;

  const totalWaitingTime = processes.reduce((acc, p) => acc + p.waitingTime, 0);
  const totalTurnaroundTime = processes.reduce((acc, p) => acc + p.turnaroundTime, 0);

  return {
    processes,
    ganttData,
    averageWaitingTime: Number((totalWaitingTime / processes.length).toFixed(2)),
    averageTurnaroundTime: Number((totalTurnaroundTime / processes.length).toFixed(2)),
    cpuUtilization: Number(cpuUtilization.toFixed(2))
  };
}

export default simulateFCFS;
