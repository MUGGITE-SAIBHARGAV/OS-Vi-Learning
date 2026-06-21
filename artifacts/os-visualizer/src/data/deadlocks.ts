import { TopicData } from '../types';

export const deadlocksData: Record<string, TopicData> = {
  'deadlock-intro': {
    id: 'deadlock-intro',
    title: 'Introduction to Deadlocks',
    overview: 'A deadlock occurs when a set of processes are permanently blocked, each waiting for a resource held by another process in the set. No process can proceed, release resources, or be woken up. The system is stuck forever — a circular dependency trap.',
    whyItExists: 'Modern systems allow multiple processes to share limited resources. Without careful resource management, circular wait dependencies can form. Four conditions must ALL hold simultaneously for a deadlock to occur — removing any one of them prevents deadlock entirely.',
    analogy: 'Two cars at a single-lane bridge from opposite ends. Neither can advance without the other reversing, but neither will reverse — they wait forever. In OS terms, Car A = Process A holding Resource 1 wanting Resource 2; Car B = Process B holding Resource 2 wanting Resource 1.',
    keyPoints: [
      'Deadlock is a permanent blocking of a set of processes.',
      'Occurs only when multiple processes compete for limited resources.',
      'Requires circular dependency among waiting processes.',
      'The OS cannot easily preempt resources without risking data corruption.',
      'Affects system throughput and can cause partial or total system freeze.'
    ],
    interviewNotes: [
      'Be able to define deadlock clearly and distinguish it from starvation.',
      'Starvation means a process waits indefinitely but the system makes progress; deadlock means the system/processes make zero progress.',
      'Know that breaking just ONE of the four necessary conditions prevents deadlock.',
      'Real-world examples like gridlock at an intersection are highly effective in interviews.',
      'Understand how multiprogramming enables deadlocks.'
    ],
    quickRevision: [
      'Deadlock = Permanent block of processes.',
      'Cause = Circular resource dependency.',
      'Starvation != Deadlock.',
      'All 4 Coffman conditions must hold.',
      'Solution = Prevention, Avoidance, or Recovery.'
    ],
    quiz: []
  },
  'four-conditions': {
    id: 'four-conditions',
    title: 'Four Necessary Conditions for Deadlock',
    overview: 'Coffman (1971) identified four conditions that must ALL hold simultaneously for a deadlock to occur. Remove even one and deadlock becomes impossible. This insight directly guides prevention strategies.',
    whyItExists: 'These conditions mathematically model the requirements for a cycle in the resource allocation graph. They provide a structured framework for analyzing and preventing deadlocks.',
    analogy: 'A puzzle box that only opens if four specific locks are engaged at the same time. If you can break or bypass just one lock, the box springs open.',
    keyPoints: [
      'Mutual Exclusion: Resources cannot be shared — only one process can use a resource at a time.',
      'Hold and Wait: A process holds at least one resource while waiting to acquire additional resources held by other processes.',
      'No Preemption: Resources cannot be forcibly taken from a process — only voluntarily released.',
      'Circular Wait: A closed chain of processes exists where each holds a resource needed by the next.'
    ],
    interviewNotes: [
      'You will almost certainly be asked to list the 4 Coffman conditions.',
      'Be prepared to explain how to prevent each condition.',
      'Remember that "Hold and Wait" is distinct from "Circular Wait".',
      'Mutual exclusion is often impossible to break (e.g., a printer cannot be shared simultaneously without spooling).'
    ],
    quickRevision: [
      '1. Mutual Exclusion: 1 resource, 1 process.',
      '2. Hold & Wait: Hold resource A, wait for B.',
      '3. No Preemption: Cannot steal resources.',
      '4. Circular Wait: P1->P2->P3->P1.',
      'Break ANY = No Deadlock.'
    ],
    quiz: []
  },
  'rag-visualizer': {
    id: 'rag-visualizer',
    title: 'Resource Allocation Graph (RAG)',
    overview: 'A directed bipartite graph with two node types: processes (circles) and resources (rectangles). Request edges point from Process → Resource. Assignment edges point from Resource → Process. A cycle in the RAG indicates a deadlock (for single-instance resources) or a possibility of deadlock (for multi-instance resources).',
    whyItExists: 'Visual and mathematical modeling of system state helps the OS detect and avoid deadlocks. Algorithms use matrix/graph representations to identify cycles.',
    analogy: 'A string diagram on a detective’s wall connecting suspects (processes) to evidence (resources). If the strings form a closed loop, the detective has found a deadlock conspiracy.',
    keyPoints: [
      'Bipartite graph: Nodes are divided into Process set and Resource set.',
      'Request Edge: Pi -> Rj.',
      'Assignment Edge: Rj -> Pi.',
      'Single instance: Cycle = Deadlock.',
      'Multiple instances: Cycle = Possibility of Deadlock (not certain).'
    ],
    interviewNotes: [
      'Be able to draw a RAG for a given scenario.',
      'Understand the difference between single-instance and multi-instance resource cycles.',
      'A cycle is necessary but not always sufficient for deadlock in multi-instance systems.',
      'Know that graph reduction algorithms (like knotting) are used for detection.'
    ],
    quickRevision: [
      'Processes = Circles, Resources = Rectangles.',
      'Process -> Resource = Requesting.',
      'Resource -> Process = Holding.',
      'Cycle + 1 instance = Deadlock.',
      'Cycle + N instances = Maybe Deadlock.'
    ],
    quiz: []
  },
  'deadlock-formation': {
    id: 'deadlock-formation',
    title: 'Deadlock Formation Step by Step',
    overview: 'Watch how P1 and P2 acquire resources and then enter deadlock through circular waiting. Understanding the exact sequence of events that leads to deadlock helps in designing prevention mechanisms.',
    whyItExists: 'Deadlocks do not happen instantly; they form through a specific sequence of interleaving operations where processes dynamically claim and request resources.',
    analogy: 'Two children trading trading cards. Child A wants Card 2 but holds Card 1. Child B wants Card 1 but holds Card 2. They refuse to let go of their first card until they get the second. Deadlock.',
    keyPoints: [
      'Timing and scheduling order determine if a deadlock actually forms.',
      'Both processes must successfully execute their first "lock" or "acquire".',
      'The "Hold and Wait" condition becomes active when the second request is made.',
      'The final request closes the loop, creating the "Circular Wait".'
    ],
    interviewNotes: [
      'Interviewers might ask you to construct a deadlock scenario in code (e.g., using two threads and two mutexes in Java or C++).',
      'Always lock resources in the same order across all threads to prevent deadlock formation.',
      'Know how to identify the exact line of code where the cycle closes.'
    ],
    quickRevision: [
      'Deadlocks are timing-dependent.',
      'Sequence: P1 holds R1 -> P2 holds R2 -> P1 requests R2 -> P2 requests R1.',
      'Cycle forms on the last request.',
      'Prevent by forcing a strict locking order.'
    ],
    quiz: []
  },
  'bankers-algorithm': {
    id: 'bankers-algorithm',
    title: "Banker's Algorithm — Deadlock Avoidance",
    overview: 'Dijkstra\'s Banker\'s Algorithm (1965) acts as a bank that only loans money if it can guarantee all clients can eventually repay. The OS only grants a resource request if the resulting state is SAFE — meaning there exists at least one sequence in which all processes can complete. An unsafe state doesn\'t mean deadlock is certain, but the OS can\'t guarantee safety.',
    whyItExists: 'Instead of statically preventing deadlocks (which is restrictive), Avoidance algorithms dynamically examine each resource request to ensure the system never enters an unsafe state.',
    analogy: 'A small-town bank manager. If granting a loan leaves the bank with too little cash to satisfy the maximum potential demands of its best customers, the bank manager denies the loan to avoid bankruptcy.',
    keyPoints: [
      'Requires knowing the maximum possible resource needs of each process upfront.',
      'Uses Need = Max - Allocation to determine remaining requests.',
      'Safe State: At least one execution sequence exists without deadlock.',
      'Unsafe State: No guaranteed sequence exists (deadlock is possible).',
      'The OS simulates granting the request and runs the safety algorithm before actually granting it.'
    ],
    interviewNotes: [
      'You will likely have to trace the Banker\'s Algorithm by hand on a whiteboard.',
      'Memorize the matrices: Max, Allocation, Need, Available.',
      'Always calculate the Need matrix first (Max - Allocation).',
      'Find a process where Need <= Available. Add its Allocation to Available when done. Repeat.',
      'If all processes finish, state is SAFE.'
    ],
    quickRevision: [
      'Need = Max - Allocation.',
      'Find P where Need <= Available.',
      'When P finishes: Available += Allocation.',
      'Safe Sequence = order of completion.',
      'If all finish = SAFE. Else = UNSAFE.'
    ],
    quiz: []
  },
  'deadlock-prevention': {
    id: 'deadlock-prevention',
    title: 'Deadlock Prevention & Recovery',
    overview: 'Prevention breaks one of the four necessary conditions at design time. Avoidance uses algorithms like Banker\'s to stay in safe states at runtime. Detection allows deadlock to occur but detects and recovers. Recovery terminates processes or preempts resources to break the deadlock.',
    whyItExists: 'Different systems have different constraints. A mission-critical system might use Prevention to guarantee no deadlocks. A desktop OS (like Windows/Linux) might ignore deadlocks (Ostrich Algorithm) or use Detection & Recovery because Prevention is too restrictive.',
    analogy: 'Prevention is building a bridge with only one lane so cars can only go one way. Recovery is letting cars drive however they want, and if they get stuck, using a helicopter to physically lift one car out of the way.',
    keyPoints: [
      'Prevention: Break Mutex (spooling), Hold & Wait (request all at once), No Preemption (force release), Circular Wait (strict ordering).',
      'Avoidance: Banker\'s Algorithm (dynamic checks).',
      'Detection: Build RAG and check for cycles periodically.',
      'Recovery: Process termination (kill victim) or Resource preemption (steal from victim).',
      'Ostrich Algorithm: Ignore the problem entirely (used by most modern OSes for user processes).'
    ],
    interviewNotes: [
      'Know the difference between Prevention, Avoidance, and Detection.',
      'Prevention is static/design-time. Avoidance is dynamic/run-time.',
      'Understand the "Ostrich Algorithm" — it is a valid answer for how modern OSes handle deadlocks in user space.',
      'Be able to discuss the trade-offs: Prevention lowers utilization, Avoidance requires knowing max needs, Recovery is expensive.'
    ],
    quickRevision: [
      'Prevention = Break 1 of 4 conditions.',
      'Avoidance = Banker\'s Algorithm.',
      'Detection = Graph cycle checking.',
      'Recovery = Kill process / Preempt resource.',
      'Ostrich = Ignore it (Windows/Linux approach).'
    ],
    quiz: []
  }
};
