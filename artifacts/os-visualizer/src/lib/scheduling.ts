export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
}

export interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
}

export interface ScheduleResult {
  gantt: GanttBlock[];
  waitingTime: Record<string, number>;
  turnaroundTime: Record<string, number>;
  completionTime: Record<string, number>;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  contextSwitches: number;
  cpuUtilization: number;
}

function initMetrics(processes: Process[]) {
  const result: ScheduleResult = {
    gantt: [],
    waitingTime: {},
    turnaroundTime: {},
    completionTime: {},
    avgWaitingTime: 0,
    avgTurnaroundTime: 0,
    contextSwitches: 0,
    cpuUtilization: 0,
  };
  processes.forEach((p) => {
    result.waitingTime[p.id] = 0;
    result.turnaroundTime[p.id] = 0;
    result.completionTime[p.id] = 0;
  });
  return result;
}

function finalizeMetrics(result: ScheduleResult, processes: Process[], totalTime: number, totalBusy: number) {
  let totalWT = 0;
  let totalTAT = 0;
  processes.forEach((p) => {
    result.turnaroundTime[p.id] = result.completionTime[p.id] - p.arrivalTime;
    result.waitingTime[p.id] = result.turnaroundTime[p.id] - p.burstTime;
    totalWT += result.waitingTime[p.id];
    totalTAT += result.turnaroundTime[p.id];
  });
  if (processes.length > 0) {
    result.avgWaitingTime = totalWT / processes.length;
    result.avgTurnaroundTime = totalTAT / processes.length;
  }
  result.cpuUtilization = totalTime > 0 ? (totalBusy / totalTime) * 100 : 0;
}

export function fcfs(processes: Process[]): ScheduleResult {
  const result = initMetrics(processes);
  if (processes.length === 0) return result;

  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  let busy = 0;

  for (const p of sorted) {
    if (time < p.arrivalTime) {
      result.gantt.push({ processId: "IDLE", startTime: time, endTime: p.arrivalTime });
      time = p.arrivalTime;
    }
    result.gantt.push({ processId: p.id, startTime: time, endTime: time + p.burstTime });
    if (result.gantt.length > 1 && result.gantt[result.gantt.length - 1].processId !== result.gantt[result.gantt.length - 2].processId && result.gantt[result.gantt.length-2].processId !== "IDLE") {
      result.contextSwitches++;
    }
    time += p.burstTime;
    busy += p.burstTime;
    result.completionTime[p.id] = time;
  }

  finalizeMetrics(result, processes, time, busy);
  return result;
}

export function sjf(processes: Process[]): ScheduleResult {
  const result = initMetrics(processes);
  if (processes.length === 0) return result;

  let time = 0;
  let busy = 0;
  const remaining = [...processes];
  
  while (remaining.length > 0) {
    const available = remaining.filter((p) => p.arrivalTime <= time);
    if (available.length === 0) {
      const nextTime = Math.min(...remaining.map(p => p.arrivalTime));
      result.gantt.push({ processId: "IDLE", startTime: time, endTime: nextTime });
      time = nextTime;
      continue;
    }

    available.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);
    const p = available[0];
    
    result.gantt.push({ processId: p.id, startTime: time, endTime: time + p.burstTime });
    if (result.gantt.length > 1 && result.gantt[result.gantt.length - 1].processId !== result.gantt[result.gantt.length - 2].processId && result.gantt[result.gantt.length-2].processId !== "IDLE") {
      result.contextSwitches++;
    }
    
    time += p.burstTime;
    busy += p.burstTime;
    result.completionTime[p.id] = time;
    
    const idx = remaining.findIndex(x => x.id === p.id);
    remaining.splice(idx, 1);
  }

  finalizeMetrics(result, processes, time, busy);
  return result;
}

export function srtf(processes: Process[]): ScheduleResult {
  const result = initMetrics(processes);
  if (processes.length === 0) return result;

  let time = 0;
  let busy = 0;
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  let currentProcessId: string | null = null;
  let blockStart = 0;
  
  while (remaining.some(p => p.remainingTime > 0)) {
    const available = remaining.filter(p => p.arrivalTime <= time && p.remainingTime > 0);
    
    if (available.length === 0) {
      if (currentProcessId !== null) {
        result.gantt.push({ processId: currentProcessId, startTime: blockStart, endTime: time });
        currentProcessId = null;
      }
      
      const nextTime = Math.min(...remaining.filter(p => p.remainingTime > 0).map(p => p.arrivalTime));
      if (currentProcessId !== "IDLE") {
        currentProcessId = "IDLE";
        blockStart = time;
      }
      time = nextTime;
      continue;
    }

    available.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime);
    const p = available[0];

    if (currentProcessId !== p.id) {
      if (currentProcessId !== null) {
        result.gantt.push({ processId: currentProcessId, startTime: blockStart, endTime: time });
        if (currentProcessId !== "IDLE" && p.id !== "IDLE") {
          result.contextSwitches++;
        }
      }
      currentProcessId = p.id;
      blockStart = time;
    }

    p.remainingTime--;
    time++;
    if (p.id !== "IDLE") busy++;

    if (p.remainingTime === 0) {
      result.completionTime[p.id] = time;
      result.gantt.push({ processId: p.id, startTime: blockStart, endTime: time });
      currentProcessId = null;
      blockStart = time;
    }
  }

  if (currentProcessId !== null) {
    result.gantt.push({ processId: currentProcessId, startTime: blockStart, endTime: time });
  }

  finalizeMetrics(result, processes, time, busy);
  return result;
}

export function priorityScheduling(processes: Process[], preemptive: boolean): ScheduleResult {
  if (!preemptive) {
    const result = initMetrics(processes);
    if (processes.length === 0) return result;

    let time = 0;
    let busy = 0;
    const remaining = [...processes];
    
    while (remaining.length > 0) {
      const available = remaining.filter((p) => p.arrivalTime <= time);
      if (available.length === 0) {
        const nextTime = Math.min(...remaining.map(p => p.arrivalTime));
        result.gantt.push({ processId: "IDLE", startTime: time, endTime: nextTime });
        time = nextTime;
        continue;
      }

      available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
      const p = available[0];
      
      result.gantt.push({ processId: p.id, startTime: time, endTime: time + p.burstTime });
      if (result.gantt.length > 1 && result.gantt[result.gantt.length - 1].processId !== result.gantt[result.gantt.length - 2].processId && result.gantt[result.gantt.length-2].processId !== "IDLE") {
        result.contextSwitches++;
      }
      
      time += p.burstTime;
      busy += p.burstTime;
      result.completionTime[p.id] = time;
      
      const idx = remaining.findIndex(x => x.id === p.id);
      remaining.splice(idx, 1);
    }

    finalizeMetrics(result, processes, time, busy);
    return result;
  } else {
    const result = initMetrics(processes);
    if (processes.length === 0) return result;

    let time = 0;
    let busy = 0;
    const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    let currentProcessId: string | null = null;
    let blockStart = 0;
    
    while (remaining.some(p => p.remainingTime > 0)) {
      const available = remaining.filter(p => p.arrivalTime <= time && p.remainingTime > 0);
      
      if (available.length === 0) {
        if (currentProcessId !== null) {
          result.gantt.push({ processId: currentProcessId, startTime: blockStart, endTime: time });
          currentProcessId = null;
        }
        
        const nextTime = Math.min(...remaining.filter(p => p.remainingTime > 0).map(p => p.arrivalTime));
        if (currentProcessId !== "IDLE") {
          currentProcessId = "IDLE";
          blockStart = time;
        }
        time = nextTime;
        continue;
      }

      available.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime);
      const p = available[0];

      if (currentProcessId !== p.id) {
        if (currentProcessId !== null) {
          result.gantt.push({ processId: currentProcessId, startTime: blockStart, endTime: time });
          if (currentProcessId !== "IDLE" && p.id !== "IDLE") {
            result.contextSwitches++;
          }
        }
        currentProcessId = p.id;
        blockStart = time;
      }

      p.remainingTime--;
      time++;
      if (p.id !== "IDLE") busy++;

      if (p.remainingTime === 0) {
        result.completionTime[p.id] = time;
        result.gantt.push({ processId: p.id, startTime: blockStart, endTime: time });
        currentProcessId = null;
        blockStart = time;
      }
    }

    if (currentProcessId !== null) {
      result.gantt.push({ processId: currentProcessId, startTime: blockStart, endTime: time });
    }

    finalizeMetrics(result, processes, time, busy);
    return result;
  }
}

export function roundRobin(processes: Process[], quantum: number): ScheduleResult {
  const result = initMetrics(processes);
  if (processes.length === 0) return result;

  let time = 0;
  let busy = 0;
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime })).sort((a,b) => a.arrivalTime - b.arrivalTime);
  
  let queue: typeof remaining = [];
  let nextProcessIdx = 0;
  
  while (remaining.some(p => p.remainingTime > 0)) {
    while (nextProcessIdx < remaining.length && remaining[nextProcessIdx].arrivalTime <= time) {
      queue.push(remaining[nextProcessIdx]);
      nextProcessIdx++;
    }

    if (queue.length === 0) {
      if (nextProcessIdx < remaining.length) {
        const nextTime = remaining[nextProcessIdx].arrivalTime;
        result.gantt.push({ processId: "IDLE", startTime: time, endTime: nextTime });
        time = nextTime;
      } else {
        break;
      }
      continue;
    }

    const p = queue.shift()!;
    const executeTime = Math.min(p.remainingTime, quantum);
    
    result.gantt.push({ processId: p.id, startTime: time, endTime: time + executeTime });
    if (result.gantt.length > 1 && result.gantt[result.gantt.length - 1].processId !== result.gantt[result.gantt.length - 2].processId && result.gantt[result.gantt.length-2].processId !== "IDLE") {
      result.contextSwitches++;
    }

    time += executeTime;
    busy += executeTime;
    p.remainingTime -= executeTime;

    while (nextProcessIdx < remaining.length && remaining[nextProcessIdx].arrivalTime <= time) {
      queue.push(remaining[nextProcessIdx]);
      nextProcessIdx++;
    }

    if (p.remainingTime > 0) {
      queue.push(p);
    } else {
      result.completionTime[p.id] = time;
    }
  }

  finalizeMetrics(result, processes, time, busy);
  return result;
}