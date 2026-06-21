import { TopicData } from '../types';

export const cpuSchedulingData: Record<string, TopicData> = {
  'scheduling-intro': {
    id: 'scheduling-intro',
    title: 'Introduction to CPU Scheduling',
    overview: 'The CPU scheduler is the OS component that decides which ready process gets the CPU next. Since the CPU can only execute one process at a time (on a single core), scheduling is critical for system performance. Good scheduling maximizes CPU utilization, minimizes waiting time, and ensures fairness among competing processes.',
    whyItExists: 'Without scheduling, processes would either run to completion (batch) or starve (if a long process monopolizes the CPU). Scheduling lets multiple users and processes share the CPU fairly and efficiently.',
    analogy: 'A hospital triage system: the scheduler is the triage nurse who decides which patient (process) gets the doctor (CPU) next, based on urgency (priority), arrival time, or treatment duration (burst time).',
    keyPoints: [
      { title: 'CPU Scheduler Role', description: 'Selects a process from the ready queue and allocates the CPU to it.' },
      { title: 'Scheduler Types', description: 'Short-term (CPU), Long-term (Job), and Medium-term (Swapping).' },
      { title: 'CPU Utilization', description: 'Keep the CPU as busy as possible.' },
      { title: 'Throughput', description: 'Number of processes completed per time unit.' },
      { title: 'Turnaround Time', description: 'Total time taken from submission to completion.' },
      { title: 'Waiting & Response Time', description: 'Waiting time: time in ready queue. Response time: time to first response.' }
    ],
    interviewNotes: [
      'What is CPU scheduling? It is the process of deciding which process runs on the CPU next.',
      'Why is it needed? To maximize CPU utilization and provide fairness.',
      'What is the difference between waiting time and turnaround time?',
      'Waiting time is only the time spent in the ready queue.',
      'Turnaround time includes waiting, execution, and I/O time.',
      'What is a dispatcher? It gives control of the CPU to the process selected by the short-term scheduler.',
      'What is preemptive vs non-preemptive scheduling?'
    ],
    quickRevision: [
      'CPU Scheduler = decision maker.',
      'Maximize CPU utilization.',
      'Maximize Throughput.',
      'Minimize Turnaround Time.',
      'Minimize Waiting Time.',
      'Minimize Response Time.',
      'Preemptive = can interrupt.',
      'Non-preemptive = runs until wait/terminate.'
    ],
    quiz: []
  },
  'fcfs': {
    id: 'fcfs',
    title: 'FCFS — First Come First Serve',
    overview: 'Simplest scheduling algorithm. Processes executed in order of arrival. Non-preemptive. Easy to implement but suffers from Convoy Effect. The Convoy Effect: one long process holds CPU, short processes wait — average waiting time is high. Example: P1(0,24), P2(1,3), P3(2,3) → waiting times 0, 23, 24 → avg waiting = 15.7ms',
    whyItExists: 'It is the most straightforward approach, implementing a basic FIFO queue.',
    analogy: 'A line at a grocery store checkout. The first person in line gets served first, regardless of how many items they have.',
    keyPoints: [
      { title: 'Non-preemptive', description: 'Once a process starts, it runs to completion.' },
      { title: 'Simple Implementation', description: 'Uses a simple FIFO queue.' },
      { title: 'Convoy Effect', description: 'Short processes wait behind a long process, increasing average waiting time.' },
      { title: 'Predictable', description: 'Execution order is strictly based on arrival time.' },
      { title: 'Suboptimal', description: 'Generally does not minimize average waiting time.' }
    ],
    interviewNotes: [
      'Explain FCFS scheduling.',
      'What is the Convoy Effect?',
      'How does FCFS perform with a mix of CPU-bound and I/O-bound processes?',
      'Why is FCFS not used in modern interactive systems?',
      'Can FCFS be preemptive? (No, by definition it is non-preemptive)',
      'Calculate average waiting time for a given set of processes using FCFS.'
    ],
    quickRevision: [
      'FIFO queue.',
      'Non-preemptive.',
      'Simple but inefficient.',
      'Suffers from Convoy Effect.',
      'Bad for interactive systems.',
      'Turnaround time can be very high.'
    ],
    quiz: []
  },
  'sjf-srtf': {
    id: 'sjf-srtf',
    title: 'SJF & SRTF',
    overview: 'SJF (Shortest Job First): Non-preemptive. Picks process with shortest burst time. Optimal average waiting time for non-preemptive. Problem: requires knowing burst time in advance. SRTF (Shortest Remaining Time First): Preemptive version. If new process arrives with shorter remaining time, CPU switches. Minimum average waiting time overall but expensive context switching.',
    whyItExists: 'To minimize average waiting time by getting shorter jobs out of the way quickly.',
    analogy: 'A supermarket express lane, but applied to all lanes: the customer with the fewest items always goes next.',
    keyPoints: [
      { title: 'SJF is Non-preemptive', description: 'Picks the shortest job in the ready queue and runs it to completion.' },
      { title: 'SRTF is Preemptive', description: 'Can interrupt a running job if a new, shorter job arrives.' },
      { title: 'Optimal Waiting Time', description: 'SJF/SRTF provide the minimum average waiting time.' },
      { title: 'Prediction Problem', description: 'Difficult to know burst time in advance in real systems.' },
      { title: 'Starvation', description: 'Long jobs may never run if short jobs keep arriving.' },
      { title: 'Context Switch Overhead', description: 'SRTF can have high overhead due to frequent preemptions.' }
    ],
    interviewNotes: [
      'What is the difference between SJF and SRTF?',
      'Why is SJF optimal for average waiting time?',
      'How does the OS predict the next CPU burst time?',
      'Explain how SRTF can lead to starvation.',
      'Trace a Gantt chart for SRTF given process arrival and burst times.',
      'What are the practical limitations of SJF?'
    ],
    quickRevision: [
      'SJF = Shortest Job First (Non-preemptive).',
      'SRTF = Shortest Remaining Time First (Preemptive).',
      'Minimizes average waiting time.',
      'Cannot predict exact burst times.',
      'Uses exponential averaging for prediction.',
      'Long jobs can starve.',
      'SRTF has higher context switch overhead.'
    ],
    quiz: []
  },
  'priority-scheduling': {
    id: 'priority-scheduling',
    title: 'Priority Scheduling',
    overview: 'Priority assigned to each process. Lower number = higher priority (or vice versa depending on convention — mention both). Preemptive and non-preemptive variants. Starvation: low-priority processes may never run if high-priority ones keep arriving. Solution: Aging (gradually increase priority of waiting processes).',
    whyItExists: 'To allow the OS to favor certain processes (like system tasks or interactive apps) over others.',
    analogy: 'Boarding an airplane: First class boards first, then business, then economy, regardless of who arrived at the gate first.',
    keyPoints: [
      { title: 'Priority Levels', description: 'Each process has an assigned priority integer.' },
      { title: 'Preemptive vs Non-preemptive', description: 'Can interrupt a running process if a higher priority one arrives.' },
      { title: 'Starvation', description: 'A major problem where low priority tasks wait indefinitely.' },
      { title: 'Aging Solution', description: 'Gradually increasing priority of waiting processes to prevent starvation.' },
      { title: 'Internal vs External Priorities', description: 'Internal (time limits, memory) vs External (user importance, funds).' }
    ],
    interviewNotes: [
      'How does Priority Scheduling work?',
      'What is starvation and how does Priority Scheduling cause it?',
      'What is Aging and how does it solve starvation?',
      'How does Priority Scheduling differ from SJF? (SJF is priority scheduling where priority = burst time).',
      'Can priority scheduling be preemptive?',
      'Give examples of processes that need high priority.'
    ],
    quickRevision: [
      'Highest priority goes first.',
      'Can be preemptive or non-preemptive.',
      'Suffers from starvation.',
      'Solved by aging.',
      'SJF is a special case of priority scheduling.',
      'Priority conventions vary (0 can be highest or lowest).'
    ],
    quiz: []
  },
  'round-robin': {
    id: 'round-robin',
    title: 'Round Robin',
    overview: 'Time quantum (time slice). Each process gets CPU for at most one quantum, then preempted and moved to end of queue. Fair but higher context-switching overhead. Good for time-sharing systems. Quantum choice matters: too small → too many context switches. Too large → degenerates to FCFS.',
    whyItExists: 'To provide fair, responsive execution for interactive and time-sharing systems.',
    analogy: 'A teacher answering questions in class: they give each student exactly 2 minutes of attention before moving to the next student, eventually looping back around.',
    keyPoints: [
      { title: 'Time Quantum (Slice)', description: 'A fixed amount of time allocated to each process.' },
      { title: 'Preemptive', description: 'Always preemptive based on a timer interrupt.' },
      { title: 'Fairness', description: 'Every process gets a fair share of the CPU.' },
      { title: 'Responsiveness', description: 'Excellent response time for interactive processes.' },
      { title: 'Quantum Size Tradeoff', description: 'Too small = high overhead. Too large = behaves like FCFS.' }
    ],
    interviewNotes: [
      'Explain Round Robin scheduling.',
      'How does the time quantum affect RR performance?',
      'What happens if the time quantum is infinity? (It becomes FCFS).',
      'Why is RR suitable for time-sharing systems?',
      'What is the turnaround time characteristic of RR? (Generally higher than SJF).',
      'Calculate average waiting time for RR with a given quantum.'
    ],
    quickRevision: [
      'Uses a time quantum/slice.',
      'Inherently preemptive.',
      'Fair, no starvation.',
      'Great response time.',
      'High average turnaround time.',
      'Quantum too small = context switch overhead.',
      'Quantum too large = FCFS.'
    ],
    quiz: []
  },
  'scheduling-playground': {
    id: 'scheduling-playground',
    title: 'Scheduling Playground & Comparison',
    overview: 'An interactive sandbox where you define processes and compare all five scheduling algorithms side by side, with animated Gantt charts and metrics.',
    whyItExists: 'To visually understand how different scheduling algorithms behave on the exact same workload.',
    analogy: 'Running a simulation of different traffic light patterns on the same intersection to see which one clears cars the fastest.',
    keyPoints: [
      { title: 'Algorithm Comparison', description: 'Compare FCFS, SJF, SRTF, Priority, and Round Robin.' },
      { title: 'Metrics Tracking', description: 'Observe differences in average waiting and turnaround times.' },
      { title: 'Gantt Charts', description: 'Visualize the timeline of execution for each algorithm.' },
      { title: 'Tradeoffs', description: 'See firsthand how optimizing for one metric (like wait time) can hurt another (like context switches).' }
    ],
    interviewNotes: [
      'Which algorithm is best for batch systems?',
      'Which algorithm is best for interactive systems?',
      'How do you choose between SRTF and Round Robin?',
      'What are the main metrics used to evaluate a scheduler?',
      'Why might a real OS use a hybrid or multi-level feedback queue?'
    ],
    quickRevision: [
      'FCFS: Simple, non-preemptive, Convoy effect.',
      'SJF: Optimal wait time, non-preemptive, needs future knowledge.',
      'SRTF: Optimal wait time, preemptive, high context switches.',
      'Priority: Importance-based, starvation risk, solved by aging.',
      'Round Robin: Fair, time-sliced, great response time, high turnaround time.'
    ],
    quiz: []
  },
  'scheduling-problems': {
    id: 'scheduling-problems',
    title: 'Common Problems: Starvation & Convoy Effect',
    overview: 'Convoy Effect (FCFS), Starvation (Priority/SJF), Aging as solution, Excessive context switching (RR with small quantum), Deadlock vs Starvation distinction.',
    whyItExists: 'Every scheduling algorithm has weaknesses. Understanding these helps in designing better, hybrid algorithms like Multi-Level Feedback Queues.',
    analogy: 'Different line management strategies have flaws: single lines get blocked by complex orders (Convoy), VIP lines mean regular people never get served (Starvation).',
    keyPoints: [
      { title: 'Convoy Effect', description: 'Short processes blocked by a single long process (FCFS).' },
      { title: 'Starvation', description: 'Indefinite blocking of a process due to continuous arrival of higher-priority processes.' },
      { title: 'Aging', description: 'The solution to starvation: gradually increasing priority over time.' },
      { title: 'Overhead', description: 'Time wasted in context switching, especially in RR with small quanta.' },
      { title: 'Deadlock vs Starvation', description: 'Deadlock: processes wait for each other. Starvation: processes wait for CPU.' }
    ],
    interviewNotes: [
      'What is the Convoy Effect and which algorithm suffers from it?',
      'What is Starvation and which algorithms suffer from it?',
      'How do you prevent starvation?',
      'What is Aging?',
      'Explain the difference between Deadlock and Starvation.',
      'What happens to system performance if the RR quantum is extremely small?'
    ],
    quickRevision: [
      'Convoy Effect = long job blocks short jobs.',
      'Starvation = low priority job never runs.',
      'Aging = increase priority over time.',
      'Context Switch Overhead = CPU time wasted switching.',
      'Deadlock = circular wait, no progress.',
      'Starvation = CPU is doing work, but ignoring some processes.'
    ],
    quiz: []
  }
};