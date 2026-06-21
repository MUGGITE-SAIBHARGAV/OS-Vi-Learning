import { TopicData } from '../types';

export const threadsData: Record<string, TopicData> = {
  'thread-intro': {
    id: 'thread-intro',
    title: 'Introduction to Threads',
    overview: "A thread is the smallest unit of CPU execution within a process. Every process has at least one thread (the main thread), but can spawn many more. Threads share the process's code, data, and open files, but each has its own program counter, register set, and stack. This shared-memory model makes threads far more efficient than spawning new processes.",
    whyItExists: "Without threads, a process could only do one thing at a time. Threads allow a single application to remain responsive while doing background work — think of a word processor that saves your document in the background while you keep typing.",
    analogy: "A restaurant kitchen (process) has one head chef and several line cooks (threads). They all share the same pantry (memory), utensils (files), and kitchen space, but each works on their own dish independently.",
    keyPoints: [
      {
        title: "What is a thread",
        description: "The basic unit of CPU utilization, consisting of a thread ID, program counter, register set, and a stack."
      },
      {
        title: "Thread Components",
        description: "Each thread has its own Private State: Program Counter (PC), Register Set, and Stack."
      },
      {
        title: "Shared Resources",
        description: "Threads in the same process share: Code section, Data section, Heap, and OS resources like open files and signals."
      },
      {
        title: "Thread vs Heavyweight Process",
        description: "A traditional (heavyweight) process has a single thread of control. Multithreading allows a process to have multiple threads of control."
      },
      {
        title: "Benefits Overview",
        description: "Responsiveness, resource sharing, economy (cheaper to create/context switch), and scalability (can utilize multiprocessor architectures)."
      }
    ],
    interviewNotes: [
      "A thread is a lightweight process.",
      "Threads share the same address space of their parent process.",
      "A thread has its own stack and registers.",
      "Context switching between threads is faster than between processes.",
      "If one thread blocks, others can continue (in kernel-level threading).",
      "If a process crashes, all its threads are killed."
    ],
    quickRevision: [
      "Thread: smallest execution unit",
      "Private: Stack, Registers, PC",
      "Shared: Code, Data, Heap, Files",
      "More efficient than processes",
      "Enables concurrency in apps",
      "Single-threaded vs Multi-threaded",
      "Shares memory inherently"
    ],
    quiz: [
      {
        question: "What is a thread?",
        options: ["A full operating system", "The smallest unit of CPU execution", "A type of memory", "A disk partition"],
        correctAnswer: 1,
        explanation: "A thread is the basic unit of CPU utilization and the smallest unit of execution within a process."
      },
      {
        question: "Which of the following does a thread NOT share with other threads in the same process?",
        options: ["Code section", "Data section", "Stack", "Open files"],
        correctAnswer: 2,
        explanation: "Each thread has its own private stack to manage its function calls and local variables."
      },
      {
        question: "What is the primary advantage of threads over processes?",
        options: ["Better security", "Complete isolation", "Lower creation and context switch overhead", "Simpler debugging"],
        correctAnswer: 2,
        explanation: "Threads are much cheaper to create and context switch because they share the same memory space."
      },
      {
        question: "If a process has multiple threads, what happens if the process terminates?",
        options: ["Only the main thread terminates", "All threads terminate", "Other threads become orphans", "Threads migrate to another process"],
        correctAnswer: 1,
        explanation: "Since threads live within a process, destroying the process destroys all its threads."
      },
      {
        question: "Which component keeps track of the next instruction to execute for a thread?",
        options: ["Program Counter", "Heap", "Data section", "File descriptor"],
        correctAnswer: 0,
        explanation: "The Program Counter (PC) contains the address of the next instruction to be executed by the thread."
      }
    ]
  },
  'thread-vs-process': {
    id: 'thread-vs-process',
    title: 'Threads vs Processes: A Deep Comparison',
    overview: "While both processes and threads are independent sequences of execution, they differ fundamentally in how they relate to memory and the OS. Processes are isolated, meaning they don't share memory by default and are heavily protected from each other. Threads, living within the same process, share memory and resources, making them 'lightweight' but requiring careful synchronization.",
    whyItExists: "Understanding the difference is crucial for system design. You use processes for isolation and fault tolerance (e.g., Chrome tabs), and threads for high performance, shared-state concurrency within a single application.",
    analogy: "Processes are like separate houses on a street—to share something, you have to mail it (IPC). Threads are like roommates in the same house—they can just talk to each other in the living room (shared memory), but they might fight over the TV remote (synchronization issues).",
    keyPoints: [
      {
        title: "Memory Isolation",
        description: "Processes have separate address spaces. Threads share the address space of their parent process."
      },
      {
        title: "Creation Overhead",
        description: "Process creation is heavyweight (requires new page tables, file descriptors, etc.). Thread creation is lightweight."
      },
      {
        title: "Context Switch Cost",
        description: "Process context switching is expensive (involves flushing the TLB and swapping page tables). Thread context switching is cheap (only saves/loads registers and PC)."
      },
      {
        title: "Communication",
        description: "Processes require complex Inter-Process Communication (IPC) mechanisms like pipes, message queues, or shared memory segments. Threads communicate easily by simply reading/writing shared variables."
      },
      {
        title: "Fault Isolation",
        description: "If a process crashes, it generally does not affect other processes. If a thread crashes (e.g., segfault), it brings down the entire process and all other threads with it."
      }
    ],
    interviewNotes: [
      "Process = heavy, Thread = light.",
      "Processes use IPC, threads use shared memory.",
      "Thread context switch doesn't require TLB flush.",
      "Chrome uses processes per tab for stability.",
      "Web servers often use thread pools for speed.",
      "Threads require locks/mutexes; processes rarely do."
    ],
    quickRevision: [
      "Process: Isolated memory",
      "Thread: Shared memory",
      "Process switch: Slow, flushes TLB",
      "Thread switch: Fast, saves registers",
      "Process communication: IPC",
      "Thread communication: Shared vars",
      "Process crash: Isolated"
    ],
    quiz: [
      {
        question: "Why is context switching between threads of the same process faster than between processes?",
        options: ["Threads use faster CPU cores", "Thread context switch doesn't involve switching memory address spaces", "Threads don't have registers to save", "OS doesn't track threads"],
        correctAnswer: 1,
        explanation: "Because threads share memory, the OS doesn't need to swap out page tables or flush the TLB during a thread context switch."
      },
      {
        question: "How do threads typically communicate with each other?",
        options: ["Pipes", "Sockets", "Message Passing", "Shared Memory"],
        correctAnswer: 3,
        explanation: "Because threads share the same address space, they can communicate directly by reading and writing shared variables in memory."
      },
      {
        question: "What happens if one thread causes a segmentation fault?",
        options: ["Only that thread crashes", "The entire process crashes", "The OS crashes", "Another thread restarts it"],
        correctAnswer: 1,
        explanation: "A segmentation fault in one thread corrupts the shared memory space, causing the OS to terminate the entire process."
      },
      {
        question: "Which of the following requires Inter-Process Communication (IPC)?",
        options: ["Two threads in the same process", "Two processes on the same machine", "A thread and its parent process", "A thread and the CPU"],
        correctAnswer: 1,
        explanation: "Two distinct processes must use IPC to communicate since they have isolated memory spaces."
      },
      {
        question: "Which is a 'heavyweight' operation?",
        options: ["Creating a thread", "Terminating a thread", "Creating a process", "Switching threads"],
        correctAnswer: 2,
        explanation: "Process creation requires allocating an entirely new address space and data structures in the OS kernel."
      }
    ]
  },
  'concurrency-parallelism': {
    id: 'concurrency-parallelism',
    title: 'Concurrency vs Parallelism',
    overview: "Concurrency and parallelism are often used interchangeably, but they mean different things. Concurrency is about dealing with multiple tasks at once (structuring a program), while parallelism is about doing multiple tasks at exactly the same time (execution).",
    whyItExists: "Understanding this distinction helps developers design systems that can run efficiently on both single-core machines (via concurrency) and multi-core machines (via parallelism).",
    analogy: "Concurrency is one person juggling 3 balls (they only touch one at a time, but manage all 3). Parallelism is 3 people each throwing one ball simultaneously.",
    keyPoints: [
      {
        title: "Concurrency",
        description: "A condition where multiple tasks make progress in overlapping time periods. They interleave execution."
      },
      {
        title: "Parallelism",
        description: "A condition where multiple tasks execute literally at the exact same physical instant."
      },
      {
        title: "Single-Core Systems",
        description: "Can achieve concurrency through time-slicing (context switching rapidly), but can never achieve true parallelism."
      },
      {
        title: "Multi-Core Systems",
        description: "Can achieve both concurrency and true parallelism by running different threads on different physical cores."
      },
      {
        title: "Examples",
        description: "Concurrency: A web server handling 1000 connections by quickly switching between them. Parallelism: A GPU processing 1000 pixels simultaneously."
      }
    ],
    interviewNotes: [
      "Concurrency = dealing with many things.",
      "Parallelism = doing many things.",
      "Concurrency is possible on 1 core.",
      "Parallelism requires >= 2 cores.",
      "Concurrency hides latency (e.g., I/O).",
      "Parallelism increases raw throughput."
    ],
    quickRevision: [
      "Concurrency: Interleaved execution",
      "Parallelism: Simultaneous execution",
      "1 Core = Concurrency only",
      "Multi-core = Both possible",
      "Concurrency manages structure",
      "Parallelism speeds up math",
      "Context switching enables concurrency"
    ],
    quiz: [
      {
        question: "Can a single-core CPU achieve true parallelism?",
        options: ["Yes, through time-slicing", "Yes, through multithreading", "No", "Only if it has hyperthreading"],
        correctAnswer: 2,
        explanation: "A single physical core can only execute one instruction at any exact instant in time, so true parallelism is impossible."
      },
      {
        question: "What is concurrency?",
        options: ["Executing instructions at the exact same time", "Structuring a program to make progress on multiple tasks", "Using multiple CPUs", "A way to avoid context switching"],
        correctAnswer: 1,
        explanation: "Concurrency is about the design/structure of dealing with multiple tasks by interleaving their execution."
      },
      {
        question: "Which scenario describes parallelism?",
        options: ["A chef switching between chopping onions and stirring soup", "Two chefs chopping onions at the same time", "A chef waiting for water to boil to start chopping", "A chef cooking sequentially"],
        correctAnswer: 1,
        explanation: "Two actors (chefs/cores) performing work at the exact same time is parallelism."
      },
      {
        question: "Why use concurrency on a single core?",
        options: ["To execute math faster", "To keep the UI responsive while waiting for I/O", "To avoid using memory", "To prevent page faults"],
        correctAnswer: 1,
        explanation: "Concurrency allows the CPU to switch to the UI thread while a background thread is blocked waiting for disk or network I/O."
      },
      {
        question: "Which of the following requires multiple processing elements?",
        options: ["Multitasking", "Concurrency", "Time-sharing", "Parallelism"],
        correctAnswer: 3,
        explanation: "True parallelism physically requires multiple processing elements (cores or CPUs) to execute multiple instructions simultaneously."
      }
    ]
  },
  'thread-types': {
    id: 'thread-types',
    title: 'User-Level vs Kernel-Level Threads',
    overview: "Threads can be implemented in user space or managed directly by the OS kernel. User-Level Threads (ULT) are managed by a runtime library without the kernel knowing they exist. Kernel-Level Threads (KLT) are natively managed and scheduled by the OS.",
    whyItExists: "This separation exists because invoking the kernel for every thread operation is slow. However, if the kernel doesn't know about threads, it can't schedule them efficiently across multiple cores. Modern systems often use hybrid approaches.",
    analogy: "User threads are like a manager dividing tasks among employees without telling the CEO. Kernel threads are when the CEO officially hires and schedules each employee individually.",
    keyPoints: [
      {
        title: "User-Level Threads (ULT)",
        description: "Implemented via a thread library. Thread creation, scheduling, and management require no kernel intervention."
      },
      {
        title: "ULT Advantages",
        description: "Extremely fast creation and context switching. Can have custom scheduling algorithms. Works on any OS."
      },
      {
        title: "ULT Disadvantages",
        description: "If one ULT blocks (e.g., waiting for I/O), the OS blocks the entire process, halting all other ULTs inside it."
      },
      {
        title: "Kernel-Level Threads (KLT)",
        description: "The OS kernel directly manages the threads. The OS scheduler treats each thread as a schedulable entity."
      },
      {
        title: "KLT Pros & Cons",
        description: "Pro: One blocked thread doesn't block others; can run in parallel on multiple cores. Con: Higher overhead for creation and switching (requires system calls)."
      }
    ],
    interviewNotes: [
      "ULTs are invisible to the OS.",
      "KLTs are scheduled by the OS.",
      "Blocking a ULT blocks the whole process.",
      "ULT context switch doesn't need a mode switch.",
      "KLT allows true parallelism on multi-core.",
      "Windows and Linux primarily use KLT."
    ],
    quickRevision: [
      "ULT: Library managed",
      "ULT: Fast, no sys calls",
      "ULT: 1 block = all block",
      "KLT: OS managed",
      "KLT: Slower sys calls",
      "KLT: True parallelism",
      "KLT: 1 block = others run"
    ],
    quiz: [
      {
        question: "Which of the following is true for User-Level Threads?",
        options: ["They are scheduled by the OS kernel", "Creating them requires a system call", "If one blocks, the entire process might block", "They automatically use multiple CPU cores"],
        correctAnswer: 2,
        explanation: "Because the kernel only sees the single process containing the ULTs, if one ULT makes a blocking system call, the kernel blocks the entire process."
      },
      {
        question: "Why are Kernel-Level Threads slower to create than User-Level Threads?",
        options: ["They require more memory", "They must communicate over the network", "They require a mode switch to kernel space", "They use slower CPU instructions"],
        correctAnswer: 2,
        explanation: "Managing KLTs requires system calls, which involve switching the CPU from user mode to kernel mode, adding overhead."
      },
      {
        question: "Can User-Level threads run in parallel on different cores?",
        options: ["Yes, always", "No, never", "Only on Linux", "Only if the process is multithreaded"],
        correctAnswer: 1,
        explanation: "Since the kernel doesn't know about ULTs, it schedules the entire process on a single core. Thus, pure ULTs cannot achieve true parallelism."
      },
      {
        question: "Which threading model is entirely independent of the underlying operating system?",
        options: ["Kernel-Level Threads", "User-Level Threads", "Hybrid Threads", "Hardware Threads"],
        correctAnswer: 1,
        explanation: "ULTs are implemented via a library in user space and do not rely on OS-specific threading support."
      },
      {
        question: "In a system with Kernel-Level Threads, what happens if one thread blocks on I/O?",
        options: ["The entire process blocks", "Other threads in the process can continue executing", "The OS crashes", "The thread is permanently terminated"],
        correctAnswer: 1,
        explanation: "Because the kernel is aware of all threads, it can simply schedule another thread from the same process while one is blocked."
      }
    ]
  },
  'multithreading-models': {
    id: 'multithreading-models',
    title: 'Multithreading Models & Benefits',
    overview: "Multithreading models define how user-level threads are mapped to kernel-level threads. The benefits of multithreading are immense, allowing modern applications to be responsive, efficient, and scalable.",
    whyItExists: "Systems need a way to map user logic to hardware execution. Different models offer tradeoffs between performance, complexity, and OS limitations.",
    analogy: "Many-to-One is like many customers using one cashier. One-to-One is one cashier per customer. Many-to-Many is a pool of customers served by a pool of cashiers.",
    keyPoints: [
      {
        title: "Many-to-One Model",
        description: "Many user threads map to a single kernel thread. Fast, but lacks parallelism and a blocking call halts everything."
      },
      {
        title: "One-to-One Model",
        description: "Each user thread maps to one kernel thread. Offers maximum parallelism. Used by Windows and Linux. Downside: overhead of creating kernel threads."
      },
      {
        title: "Many-to-Many Model",
        description: "Many user threads multiplexed over a smaller or equal number of kernel threads. Best of both worlds, but complex to implement."
      },
      {
        title: "Responsiveness Benefit",
        description: "Multithreading allows an interactive application to continue running even if part of it is blocked or performing a lengthy operation."
      },
      {
        title: "Economy & Scalability",
        description: "Allocating memory and resources for process creation is costly. Threads share resources, making creation cheaper. They also scale perfectly across multiprocessor architectures."
      }
    ],
    interviewNotes: [
      "1:1 model is standard on modern OS.",
      "Many:1 cannot utilize multiple cores.",
      "Many:Many uses a thread pool.",
      "Benefits: Responsiveness, Resource Sharing.",
      "Benefits: Economy, Scalability.",
      "Browsers use threads for UI and network."
    ],
    quickRevision: [
      "Many-to-One: No parallelism",
      "One-to-One: True parallelism",
      "One-to-One: High kernel overhead",
      "Many-to-Many: Best balance",
      "Benefit: UI Responsiveness",
      "Benefit: Resource Sharing",
      "Benefit: Multiprocessor use"
    ],
    quiz: [
      {
        question: "Which multithreading model is used by modern Windows and Linux?",
        options: ["Many-to-One", "One-to-One", "Many-to-Many", "Two-Level"],
        correctAnswer: 1,
        explanation: "Modern OSes use the One-to-One model, where every user thread is backed by a distinct kernel thread, allowing true parallelism."
      },
      {
        question: "What is the main drawback of the Many-to-One model?",
        options: ["It is too slow to create threads", "A blocking system call blocks all threads", "It uses too much memory", "It requires complex OS support"],
        correctAnswer: 1,
        explanation: "Because all user threads map to a single kernel thread, if one user thread blocks the kernel thread, all other user threads are stalled."
      },
      {
        question: "How does multithreading improve economy compared to multiprogramming with processes?",
        options: ["Threads cost less money to buy", "Threads share the same memory and resources, reducing allocation overhead", "Threads consume less power", "Threads run slower"],
        correctAnswer: 1,
        explanation: "Creating a new process requires allocating a new address space. Threads share the process's address space, making them much cheaper to create."
      },
      {
        question: "In a video player application, why use multithreading?",
        options: ["To prevent the OS from crashing", "To keep the UI responsive while decoding video and buffering network data simultaneously", "To use less memory", "To compress the video faster"],
        correctAnswer: 1,
        explanation: "By dedicating separate threads to the UI, video decoding, and network buffering, the application remains responsive and smooth."
      },
      {
        question: "Which model multiplexes many user threads onto a smaller or equal number of kernel threads?",
        options: ["One-to-One", "Many-to-One", "Many-to-Many", "Single-Threaded"],
        correctAnswer: 2,
        explanation: "The Many-to-Many model allows the OS to create a pool of kernel threads to execute a larger number of user threads."
      }
    ]
  },
  'thread-lifecycle': {
    id: 'thread-lifecycle',
    title: 'Thread Lifecycle',
    overview: "Just like processes, threads go through a series of states from creation to termination. The thread lifecycle is similar to the process lifecycle but typically transitions slightly faster due to lower overhead.",
    whyItExists: "The OS (or thread library) needs to track what every thread is doing at any given moment to schedule CPU time fairly and manage I/O operations.",
    analogy: "A thread is like a taxi driver: Hired (New), waiting at the rank (Ready), driving a passenger (Running), stuck in traffic (Blocked), and off shift (Terminated).",
    keyPoints: [
      {
        title: "New State",
        description: "The thread has been created but has not yet been submitted to the scheduler or allocated resources."
      },
      {
        title: "Ready State",
        description: "The thread is fully prepared to execute and is waiting in the ready queue for CPU time."
      },
      {
        title: "Running State",
        description: "The thread is currently being executed by a CPU core."
      },
      {
        title: "Blocked (Waiting) State",
        description: "The thread cannot execute because it is waiting for an event to occur (e.g., I/O completion, a lock to be released)."
      },
      {
        title: "Terminated State",
        description: "The thread has finished its execution or was explicitly killed. Its private resources (stack, registers) are deallocated."
      }
    ],
    interviewNotes: [
      "States: New, Ready, Running, Blocked, Terminated.",
      "A blocked thread yields the CPU.",
      "Ready threads wait in a queue.",
      "Transition from Running to Ready is a preemptive context switch.",
      "Multiple threads in a process can be in different states.",
      "A thread in Blocked state uses zero CPU cycles."
    ],
    quickRevision: [
      "New: Just created",
      "Ready: Waiting for CPU",
      "Running: Using CPU",
      "Blocked: Waiting for I/O / Lock",
      "Terminated: Finished",
      "Running -> Ready = Preemption",
      "Blocked -> Ready = Event done"
    ],
    quiz: [
      {
        question: "What state is a thread in if it is waiting for the user to press a key?",
        options: ["Ready", "Running", "Blocked", "Terminated"],
        correctAnswer: 2,
        explanation: "Waiting for user input is an I/O event. The thread is put into the Blocked (or Waiting) state until the event occurs."
      },
      {
        question: "When a thread's time slice expires, to which state does it transition?",
        options: ["Blocked", "New", "Ready", "Terminated"],
        correctAnswer: 2,
        explanation: "When preempted by a timer, the thread is moved from Running back to the Ready state to wait for its next turn."
      },
      {
        question: "Can multiple threads of the SAME process be in the Running state simultaneously?",
        options: ["Yes, on a multi-core system", "No, never", "Yes, but only on a single-core system", "Only if they are User-Level threads"],
        correctAnswer: 0,
        explanation: "On a multi-core processor, the OS can schedule different threads of the same process to run simultaneously on different cores."
      },
      {
        question: "What happens to a thread's CPU cycles when it is in the Blocked state?",
        options: ["It uses 100% of the CPU checking for the event", "It uses no CPU cycles", "It runs at half speed", "It executes a sleep instruction"],
        correctAnswer: 1,
        explanation: "A blocked thread is removed from the CPU and placed in a wait queue, consuming absolutely zero CPU cycles while waiting."
      },
      {
        question: "Which state transition is generally NOT possible?",
        options: ["Running to Blocked", "Blocked to Ready", "Ready to Running", "Blocked to Running"],
        correctAnswer: 3,
        explanation: "A blocked thread must first transition to the Ready state when the event completes, and then wait for the scheduler to pick it before Running."
      }
    ]
  },
  'thread-context-switch': {
    id: 'thread-context-switch',
    title: 'Thread Context Switching',
    overview: "Context switching is the process of storing the state of an active thread and restoring the state of another thread. Thread context switching is significantly faster than process context switching because threads share memory.",
    whyItExists: "To achieve concurrency (multitasking), the CPU must rapidly switch between active threads, giving the illusion that everything is running simultaneously.",
    analogy: "Process switch is like moving to a new office building (packing everything). Thread switch is like changing seats at the same desk (just bringing your own notepad).",
    keyPoints: [
      {
        title: "What gets saved?",
        description: "Only the thread's private data: Program Counter (PC), CPU registers, and Stack Pointer."
      },
      {
        title: "What is NOT saved?",
        description: "Memory management information (page tables), file descriptors, and shared data are untouched because they belong to the process."
      },
      {
        title: "TLB Flush",
        description: "A process switch requires flushing the Translation Lookaside Buffer (TLB) because memory spaces change. A thread switch does NOT require a TLB flush, making it much faster."
      },
      {
        title: "Cache Warmth",
        description: "Because threads in the same process share data, switching between them often means the CPU cache remains 'warm' and relevant."
      },
      {
        title: "Cost",
        description: "While cheaper than a process switch, thread context switching still has a cost (saving registers, scheduler logic). Spawning 100,000 threads can lead to thrashing."
      }
    ],
    interviewNotes: [
      "Thread switch saves: PC, SP, Registers.",
      "Thread switch skips: Page tables, TLB flush.",
      "Thread switch maintains a 'warm' cache.",
      "Cheaper != Free. Context switching has overhead.",
      "Kernel must intervene for KLT context switch.",
      "ULT context switch is even faster."
    ],
    quickRevision: [
      "Save: Program Counter",
      "Save: Stack Pointer",
      "Save: CPU Registers",
      "Skip: Page Table Swap",
      "Skip: TLB Flush",
      "Result: Faster than Process Switch",
      "Maintains CPU cache warmth"
    ],
    quiz: [
      {
        question: "Why is a thread context switch faster than a process context switch?",
        options: ["Threads have fewer registers", "No need to swap page tables or flush the TLB", "The OS doesn't perform thread context switches", "Threads run directly on the motherboard"],
        correctAnswer: 1,
        explanation: "Because threads share the same address space, the heavy operation of switching memory contexts (page tables, TLB) is entirely skipped."
      },
      {
        question: "Which of the following is saved during a thread context switch?",
        options: ["Page tables", "File descriptors", "Program Counter", "The Heap"],
        correctAnswer: 2,
        explanation: "The Program Counter, which tracks the thread's current instruction, must be saved so the thread can resume later."
      },
      {
        question: "What does maintaining a 'warm cache' mean in the context of thread switching?",
        options: ["The CPU physically stays warm", "The shared data accessed by the new thread is likely already in the CPU cache", "The RAM does not power down", "The OS runs faster"],
        correctAnswer: 1,
        explanation: "Because threads of the same process share memory, data loaded into the CPU cache by one thread is often useful to the next thread."
      },
      {
        question: "Does a User-Level Thread (ULT) context switch require OS kernel intervention?",
        options: ["Yes, always", "No, it is handled entirely by the user-space thread library", "Only on single-core systems", "Only when switching to a different process"],
        correctAnswer: 1,
        explanation: "ULTs are managed purely in user space, so switching between them requires zero kernel intervention, making it incredibly fast."
      },
      {
        question: "Is a thread context switch completely free of overhead?",
        options: ["Yes", "No, saving registers and running the scheduler still takes time", "Only if it is a kernel-level thread", "Only if it is a user-level thread"],
        correctAnswer: 1,
        explanation: "While much cheaper than a process switch, the CPU still spends cycles saving/loading state and running the scheduler algorithm."
      }
    ]
  }
};