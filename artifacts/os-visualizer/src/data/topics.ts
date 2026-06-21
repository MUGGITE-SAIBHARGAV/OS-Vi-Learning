import { TopicMeta } from '../types';

export const topicsMeta: TopicMeta[] = [
  {
    id: 'intro-to-os',
    title: 'Introduction to Operating Systems',
    category: 'intro-to-os',
    description: 'Learn the fundamentals of what an OS is, its functions, types, and architecture.',
    subtopics: [
      { id: 'what-is-an-os', title: 'What is an Operating System?' },
      { id: 'functions-of-os', title: 'Functions of an Operating System' },
      { id: 'types-of-os', title: 'Types of Operating Systems' },
      { id: 'kernel', title: 'Kernel' },
      { id: 'system-calls', title: 'System Calls' }
    ]
  },
  {
    id: 'process-management',
    title: 'Process Management',
    category: 'process-management',
    description: 'Understand how the OS manages running programs, process states, and PCBs.',
    subtopics: [
      { id: 'process-concept', title: 'Process Concept' },
      { id: 'process-lifecycle', title: 'Process Lifecycle & States' },
      { id: 'process-control-block', title: 'Process Control Block (PCB)' },
      { id: 'context-switching', title: 'Context Switching' },
      { id: 'process-creation', title: 'Process Creation & Termination' }
    ]
  },
  {
    id: 'threads',
    title: 'Threads',
    category: 'threads',
    description: 'Explore lightweight processes, multithreading models, and thread libraries.',
    subtopics: [
      { id: 'thread-intro', title: 'Introduction to Threads' },
      { id: 'thread-vs-process', title: 'Threads vs Processes' },
      { id: 'concurrency-parallelism', title: 'Concurrency vs Parallelism' },
      { id: 'thread-types', title: 'User-Level vs Kernel-Level Threads' },
      { id: 'multithreading-models', title: 'Multithreading Models & Benefits' },
      { id: 'thread-lifecycle', title: 'Thread Lifecycle' },
      { id: 'thread-context-switch', title: 'Thread Context Switching' }
    ]
  },
  {
    id: 'cpu-scheduling',
    title: 'CPU Scheduling',
    category: 'cpu-scheduling',
    description: 'Dive into algorithms like FCFS, SJF, Round Robin, and Priority Scheduling.',
    subtopics: [
      { id: 'scheduling-intro', title: 'Introduction to CPU Scheduling' },
      { id: 'fcfs', title: 'FCFS — First Come First Serve' },
      { id: 'sjf-srtf', title: 'SJF & SRTF' },
      { id: 'priority-scheduling', title: 'Priority Scheduling' },
      { id: 'round-robin', title: 'Round Robin' },
      { id: 'scheduling-playground', title: 'Scheduling Playground & Comparison' },
      { id: 'scheduling-problems', title: 'Common Problems: Starvation & Convoy Effect' }
    ]
  },
  {
    id: 'synchronization',
    title: 'Synchronization',
    category: 'synchronization',
    description: 'Learn about critical sections, mutexes, semaphores, and classic problems.',
    subtopics: [
      { id: 'sync-intro', title: 'Introduction to Synchronization' },
      { id: 'race-condition', title: 'Race Conditions' },
      { id: 'critical-section', title: 'Critical Section Problem' },
      { id: 'sync-requirements', title: 'Synchronization Requirements' },
      { id: 'sync-playground', title: 'Synchronization Playground' },
      { id: 'real-world-sync', title: 'Real-World Synchronization Examples' }
    ]
  },
  {
    id: 'deadlocks',
    title: 'Deadlocks',
    category: 'deadlocks',
    description: 'Understand deadlock characterization, prevention, avoidance, and recovery.',
    subtopics: [
      { id: 'deadlock-intro', title: 'Introduction to Deadlocks' },
      { id: 'four-conditions', title: 'Four Necessary Conditions' },
      { id: 'rag-visualizer', title: 'Resource Allocation Graph' },
      { id: 'deadlock-formation', title: 'Deadlock Formation' },
      { id: 'bankers-algorithm', title: "Banker's Algorithm" },
      { id: 'deadlock-prevention', title: 'Prevention & Recovery' }
    ]
  },
  {
    id: 'memory-management',
    title: 'Memory Management',
    category: 'memory-management',
    description: 'Explore main memory, contiguous allocation, fragmentation, compaction, allocation strategies, and swapping.',
    subtopics: [
      { id: 'main-memory', title: 'Introduction to Memory Management' },
      { id: 'memory-layout', title: 'Memory Layout & Process Loading' },
      { id: 'contiguous-allocation', title: 'Contiguous Memory Allocation' },
      { id: 'fragmentation', title: 'Fragmentation — Internal & External' },
      { id: 'compaction', title: 'Compaction & Memory Reorganization' },
      { id: 'allocation-strategies', title: 'Memory Allocation Strategies' },
      { id: 'swapping', title: 'Swapping' },
    ]
  },
  {
    id: 'virtual-memory',
    title: 'Virtual Memory',
    category: 'virtual-memory',
    description: 'Dive into demand paging, page replacement algorithms, and thrashing.',
    subtopics: [
      { id: 'demand-paging', title: 'Demand Paging (Coming Soon)' }
    ]
  },
  {
    id: 'file-systems',
    title: 'File Systems',
    category: 'file-systems',
    description: 'Learn about file concepts, directory structures, and allocation methods.',
    subtopics: [
      { id: 'file-concept', title: 'File Concept (Coming Soon)' }
    ]
  },
  {
    id: 'disk-scheduling',
    title: 'Disk Scheduling',
    category: 'disk-scheduling',
    description: 'Understand disk structure and scheduling algorithms like FCFS, SSTF, SCAN, and C-SCAN.',
    subtopics: [
      { id: 'disk-structure', title: 'Disk Structure (Coming Soon)' }
    ]
  },
  {
    id: 'security',
    title: 'Security and Protection',
    category: 'security',
    description: 'Explore system threats, cryptography, user authentication, and access control.',
    subtopics: [
      { id: 'security-goals', title: 'Security Goals (Coming Soon)' }
    ]
  }
];
