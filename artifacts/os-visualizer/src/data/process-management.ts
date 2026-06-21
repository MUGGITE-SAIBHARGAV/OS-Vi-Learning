import { TopicData } from '../types';

export const processManagementData: Record<string, TopicData> = {
  'process-concept': {
    id: 'process-concept',
    title: 'Process Concept: Program vs Process',
    overview: 'A process is a program in execution — the OS\'s unit of work. Unlike a static program (a file on disk), a process is dynamic: it has a program counter, a stack, a heap, and a set of associated resources. Opening Chrome twice creates two separate processes even from the same program binary.',
    whyItExists: 'Programs are passive; something must make them run. The process abstraction lets the OS manage multiple computations simultaneously, giving each the illusion of its own CPU and memory.',
    analogy: 'A recipe (program) vs. a chef cooking (process). Ten chefs can follow the same recipe simultaneously — each is their own process.',
    keyPoints: [
      { title: 'Program vs Process difference', description: 'A program is passive (stored on disk), while a process is active (in memory, executing).' },
      { title: 'Process memory layout (text/data/heap/stack)', description: 'Processes are divided into sections: Text (code), Data (global variables), Heap (dynamic memory), and Stack (local variables/function calls).' },
      { title: 'Process attributes', description: 'Every process has a unique PID, state, program counter, registers, and memory limits.' },
      { title: 'Multiple instances from one program', description: 'Executing the same program multiple times creates multiple distinct processes.' },
      { title: 'Process vs Thread preview', description: 'A process is a container of resources, while threads are the actual units of execution within that process.' }
    ],
    interviewNotes: [
      'Q: What is a process? A: A process is a program in execution, containing the program code and its current activity.',
      'Q: Can two processes run the same program? A: Yes, they will share the same text section but have different data, heap, and stack sections.',
      'Q: What is the difference between an active and passive entity here? A: The executable file is passive, the running process is active.',
      'Q: How does the OS distinguish between processes? A: Through a unique Process Identifier (PID).',
      'Q: What are the main sections of a process memory layout? A: Text, Data, BSS, Heap, and Stack.',
      'Q: What happens when a process forks? A: It creates a child process which is an exact duplicate of the parent process, but with a different PID.'
    ],
    quickRevision: [
      'Process = Program in execution',
      'Program is passive, process is active',
      'Memory layout: Stack, Heap, Data, Text',
      'PID uniquely identifies a process',
      'Multiple processes can execute the same program',
      'Processes have state (e.g., Running, Waiting)',
      'OS manages processes using PCBs'
    ],
    quiz: [
      { id: 'q1', question: 'Which of the following is considered an active entity?', options: ['Program', 'Process', 'Executable File', 'Source Code'], correctIndex: 1, explanation: 'A process is a program in execution, making it an active entity.' },
      { id: 'q2', question: 'Which memory section contains dynamically allocated data?', options: ['Stack', 'Heap', 'Data', 'Text'], correctIndex: 1, explanation: 'The heap is used for dynamic memory allocation during process runtime.' },
      { id: 'q3', question: 'What identifies a process uniquely in an OS?', options: ['Program Counter', 'Process Identifier (PID)', 'Thread ID', 'Memory Address'], correctIndex: 1, explanation: 'The OS uses the PID to uniquely identify each process.' },
      { id: 'q4', question: 'What section holds local variables and function parameters?', options: ['Heap', 'Stack', 'Data', 'BSS'], correctIndex: 1, explanation: 'The stack section holds temporary data like function parameters, return addresses, and local variables.' },
      { id: 'q5', question: 'Can multiple processes share the same text section?', options: ['Yes', 'No', 'Only if they have the same PID', 'Only in single-tasking OS'], correctIndex: 0, explanation: 'Yes, if multiple instances of the same program are running, they can share the read-only text section.' }
    ]
  },
  'process-lifecycle': {
    id: 'process-lifecycle',
    title: 'Process Lifecycle & State Transitions',
    overview: 'A process goes through various states during its lifecycle: New (being created), Ready (waiting to be assigned to a processor), Running (instructions are being executed), Waiting (waiting for some event to occur), and Terminated (finished execution).',
    whyItExists: 'The OS needs to track what every process is doing to allocate CPU time fairly and efficiently.',
    analogy: 'A restaurant order: New (taking order), Ready (waiting for chef), Running (chef cooking), Waiting (waiting for ingredients delivery), Terminated (served to customer).',
    keyPoints: [
      { title: 'New State', description: 'The process is being created and its PCB is being initialized.' },
      { title: 'Ready State', description: 'The process is loaded into main memory and is waiting for CPU time to be scheduled.' },
      { title: 'Running State', description: 'The process instructions are currently being executed by the CPU.' },
      { title: 'Waiting (Blocked) State', description: 'The process cannot continue until a specific event occurs, such as I/O completion.' },
      { title: 'Terminated State', description: 'The process has finished execution and its resources are being reclaimed by the OS.' },
      { title: 'State Transitions', description: 'Transitions happen due to OS scheduling (Ready to Running), I/O requests (Running to Waiting), or completion (Waiting to Ready, Running to Terminated).' }
    ],
    interviewNotes: [
      'Q: What is the difference between Ready and Waiting states? A: Ready processes can run as soon as they get the CPU. Waiting processes cannot run even if given the CPU, because they are waiting for an event (like I/O).',
      'Q: Can a process go directly from Waiting to Running? A: No, it must go to the Ready state first when the event it was waiting for occurs.',
      'Q: What causes a process to move from Running to Ready? A: An interrupt or the expiration of its time quantum (preemption).',
      'Q: What state is a process in when it requests a file read? A: It moves from Running to Waiting.',
      'Q: Who is responsible for transitioning processes? A: The OS scheduler and interrupt handlers.'
    ],
    quickRevision: [
      '5 States: New, Ready, Running, Waiting, Terminated',
      'New -> Ready: Admission',
      'Ready -> Running: Dispatcher',
      'Running -> Ready: Interrupt / Time Slice',
      'Running -> Waiting: I/O Request',
      'Waiting -> Ready: I/O Complete'
    ],
    quiz: [
      { id: 'q1', question: 'Which state means the process has all required resources except the CPU?', options: ['New', 'Ready', 'Waiting', 'Running'], correctIndex: 1, explanation: 'In the Ready state, a process is waiting in the ready queue to be assigned to the processor.' },
      { id: 'q2', question: 'What transition occurs when a running process issues an I/O request?', options: ['Running -> Ready', 'Running -> Terminated', 'Running -> Waiting', 'Waiting -> Ready'], correctIndex: 2, explanation: 'When an I/O request is made, the process cannot continue immediately, so it moves to the Waiting state.' },
      { id: 'q3', question: 'Can a process move directly from Waiting to Running?', options: ['Yes', 'No', 'Only for high priority', 'Only if it is a kernel process'], correctIndex: 1, explanation: 'No, a process must first move to the Ready state and wait for the dispatcher to schedule it.' },
      { id: 'q4', question: 'What causes a transition from Running to Ready?', options: ['I/O request', 'Process completion', 'Time quantum expiration', 'I/O completion'], correctIndex: 2, explanation: 'In a preemptive system, if a process uses up its time slice (quantum), it is interrupted and moved to the Ready queue.' },
      { id: 'q5', question: 'What is the role of the dispatcher?', options: ['Terminate processes', 'Load programs from disk', 'Move process from Ready to Running', 'Move process from Running to Waiting'], correctIndex: 2, explanation: 'The dispatcher is the module that gives control of the CPU to the process selected by the short-term scheduler.' }
    ]
  },
  'process-control-block': {
    id: 'process-control-block',
    title: 'Process Control Block (PCB)',
    overview: 'The Process Control Block (PCB) is a data structure in the OS kernel containing the information needed to manage a particular process. It acts as the repository for any information that may vary from process to process.',
    whyItExists: 'When a process is interrupted, the OS needs a place to save its exact state so it can be resumed later exactly where it left off without data loss.',
    analogy: 'A bookmark in a book, plus a sticky note reminding you what you were thinking about when you stopped reading.',
    keyPoints: [
      { title: 'Process ID (PID)', description: 'A unique identifier assigned to the process by the OS.' },
      { title: 'Process State', description: 'Current state of the process (e.g., new, ready, running, waiting).' },
      { title: 'Program Counter', description: 'Indicates the address of the next instruction to be executed for this process.' },
      { title: 'CPU Registers', description: 'Saves the contents of registers (accumulators, index registers, stack pointers) when an interrupt occurs.' },
      { title: 'Scheduling Information', description: 'Process priority, pointers to scheduling queues, and other scheduling parameters.' },
      { title: 'Memory Management Information', description: 'Values of base and limit registers, page tables, or segment tables depending on the memory system.' }
    ],
    interviewNotes: [
      'Q: What is a PCB? A: A data structure used by the OS to store all information about a process.',
      'Q: Where is the PCB stored? A: In kernel memory, protected from user access.',
      'Q: Why do we need the Program Counter in the PCB? A: So the CPU knows where to resume execution after a context switch.',
      'Q: What happens to the PCB when a process terminates? A: The OS deallocates the PCB and reclaims the memory.',
      'Q: Is the PCB the same for threads? A: Threads share some process resources, but each thread has its own Thread Control Block (TCB) for thread-specific data like registers and stack.'
    ],
    quickRevision: [
      'PCB = Process Control Block',
      'Acts as the "context" for a process',
      'Stores PID, State, Program Counter',
      'Stores CPU Registers',
      'Stores Memory Limits & File Descriptors',
      'Saved and loaded during Context Switch'
    ],
    quiz: [
      { id: 'q1', question: 'Which field in the PCB tells the CPU which instruction to execute next?', options: ['Process State', 'Program Counter', 'CPU Registers', 'PID'], correctIndex: 1, explanation: 'The Program Counter holds the address of the next instruction.' },
      { id: 'q2', question: 'Where does the OS store PCBs?', options: ['User Space Memory', 'Disk Storage', 'Kernel Memory', 'CPU Cache'], correctIndex: 2, explanation: 'PCBs are crucial OS data structures and are kept in protected kernel memory.' },
      { id: 'q3', question: 'Which of these is NOT typically in a PCB?', options: ['Process Priority', 'Open File List', 'The program\'s source code', 'Memory Limits'], correctIndex: 2, explanation: 'The PCB contains metadata and state, but the actual source code/text segment is stored in the process\'s memory space.' },
      { id: 'q4', question: 'What happens to the PCB during a context switch?', options: ['It is deleted', 'It is copied to disk', 'CPU state is saved into it', 'It is sent over the network'], correctIndex: 2, explanation: 'The OS saves the current CPU state (registers, PC) into the old process\'s PCB.' },
      { id: 'q5', question: 'Why does the PCB store accounting information?', options: ['To bill users for CPU time', 'To track CPU usage and time limits', 'To measure network speed', 'Both A and B'], correctIndex: 3, explanation: 'Accounting info tracks CPU usage for limits, profiling, and sometimes billing in shared systems.' }
    ]
  },
  'context-switching': {
    id: 'context-switching',
    title: 'Context Switching',
    overview: 'Context switching is the process of storing the state of an active process and restoring the state of a different process, allowing multiple processes to share a single CPU. It is a core feature of a multitasking OS.',
    whyItExists: 'Without context switching, a process would hold the CPU until it finishes or requests I/O, preventing other programs from making progress.',
    analogy: 'A surgeon switching from making a sandwich to performing CPR: they must wash hands, change clothes (save state), and read the patient chart (load state) before acting. This takes time.',
    keyPoints: [
      { title: 'Saving State', description: 'The OS saves the current CPU context (registers, program counter) into the PCB of the running process.' },
      { title: 'Scheduler Intervention', description: 'The short-term scheduler selects the next process from the ready queue.' },
      { title: 'Restoring State', description: 'The OS loads the CPU context from the PCB of the newly selected process.' },
      { title: 'Pure Overhead', description: 'Context switch time is pure overhead because the system does no useful work while switching.' },
      { title: 'Hardware Support', description: 'Modern CPUs have specific hardware features (like multiple register sets) to speed up context switching.' }
    ],
    interviewNotes: [
      'Q: What is a context switch? A: Storing the state of the current process and loading the state of the next process.',
      'Q: Why is context switching considered overhead? A: Because the CPU is executing OS scheduling code, not user application code.',
      'Q: What factors affect context switch time? A: Memory speed, number of registers, and whether the memory cache/TLB needs to be flushed.',
      'Q: How does a thread switch compare to a process switch? A: A thread switch is faster because threads in the same process share memory space, so memory management info (like TLB) doesn\'t need to be swapped.',
      'Q: What triggers a context switch? A: Interrupts, system calls (like I/O requests), or time slice expiration.'
    ],
    quickRevision: [
      'Context Switch = Swap out old process, swap in new',
      'Steps: Save PCB_1 -> Run Scheduler -> Load PCB_2',
      'Time taken is pure OS overhead',
      'Triggered by Interrupts or System Calls',
      'Thread context switch is faster than process switch'
    ],
    quiz: [
      { id: 'q1', question: 'Which of the following is true about context switching time?', options: ['It does useful application work', 'It is pure overhead', 'It takes zero time on modern CPUs', 'It is faster for processes than threads'], correctIndex: 1, explanation: 'During a context switch, the OS is saving/loading state, so no application instructions are executing.' },
      { id: 'q2', question: 'What must be saved during a context switch?', options: ['Only the Process ID', 'The entire memory contents', 'CPU registers and Program Counter', 'The hard drive state'], correctIndex: 2, explanation: 'The CPU state, which includes registers and the Program Counter, is saved to the PCB.' },
      { id: 'q3', question: 'What hardware feature can speed up context switches?', options: ['More RAM', 'Multiple sets of CPU registers', 'Faster hard drives', 'Larger monitors'], correctIndex: 1, explanation: 'If a CPU has multiple register sets, it can just change a pointer to the active set instead of copying data to memory.' },
      { id: 'q4', question: 'Which operation typically forces a context switch?', options: ['Adding two variables', 'A blocking I/O system call', 'A function call within the program', 'A while loop'], correctIndex: 1, explanation: 'A blocking I/O call moves the process to a waiting state, forcing the OS to switch to another process.' },
      { id: 'q5', question: 'Why are thread context switches generally faster than process context switches?', options: ['Threads have no PCB/TCB', 'Threads do not use CPU registers', 'Threads share memory space, avoiding TLB flushes', 'Threads run at a higher clock speed'], correctIndex: 2, explanation: 'Because threads within a process share the same memory map, the OS does not need to swap out page tables or flush the Translation Lookaside Buffer (TLB).' }
    ]
  },
  'process-creation': {
    id: 'process-creation',
    title: 'Process Creation & Termination',
    overview: 'Processes are created by other processes. The creator is the parent, and the new process is the child, forming a tree. A process terminates when it finishes executing its final statement and asks the OS to delete it using the exit() system call.',
    whyItExists: 'A dynamic system needs the ability to spawn new tasks on demand and clean them up when they are done.',
    analogy: 'A company hierarchy: The CEO (init process) hires managers (child processes), who hire workers. When a worker quits, they notify their manager.',
    keyPoints: [
      { title: 'The fork() system call', description: 'In UNIX, fork() creates a new process by duplicating the parent. The child gets an exact copy of the parent\'s address space.' },
      { title: 'The exec() system call', description: 'Often used after fork(), exec() replaces the process\'s memory space with a new program.' },
      { title: 'Process Tree', description: 'Processes form a tree structure, with a root "init" process (PID 1).' },
      { title: 'Zombie Processes', description: 'A process that has terminated, but its parent has not yet called wait() to collect its exit status.' },
      { title: 'Orphan Processes', description: 'A child process whose parent has terminated. It is typically adopted by the init process.' }
    ],
    interviewNotes: [
      'Q: What does fork() return? A: It returns 0 to the child process, and the child\'s PID to the parent process. It returns -1 on failure.',
      'Q: What is a zombie process? A: A terminated process whose PCB is still kept around because the parent hasn\'t called wait() to read its exit status.',
      'Q: What is an orphan process? A: A process that is still running but its parent has died.',
      'Q: How does fork() differ from exec()? A: fork() duplicates the current process; exec() replaces the current process with a new program.',
      'Q: What is the init process? A: The first process started by the kernel, typically PID 1, which adopts orphan processes.'
    ],
    quickRevision: [
      'fork(): duplicates parent into a child',
      'exec(): replaces process with new program',
      'wait(): parent waits for child to finish',
      'exit(): process terminates itself',
      'Zombie: Dead process, parent hasn\'t waited',
      'Orphan: Parent died, child still running (adopted by init)'
    ],
    quiz: [
      { id: 'q1', question: 'What does the fork() system call return in the child process?', options: ['The parent\'s PID', '0', '-1', '1'], correctIndex: 1, explanation: 'fork() returns 0 to the newly created child process.' },
      { id: 'q2', question: 'What is a process called if it has terminated but its parent has not yet called wait()?', options: ['Orphan', 'Daemon', 'Zombie', 'Thread'], correctIndex: 2, explanation: 'It is a zombie because it is dead but its entry still exists in the process table.' },
      { id: 'q3', question: 'What happens to an orphan process in UNIX?', options: ['It is immediately killed', 'It pauses execution', 'It is adopted by the init process', 'It becomes a zombie'], correctIndex: 2, explanation: 'The init process (PID 1) periodically calls wait() to clean up adopted orphan processes when they terminate.' },
      { id: 'q4', question: 'Which system call replaces the process memory space with a new program?', options: ['fork()', 'wait()', 'exec()', 'exit()'], correctIndex: 2, explanation: 'exec() loads a binary file into memory, replacing the current program.' },
      { id: 'q5', question: 'If a parent process creates 3 children, and each child creates 1 child, how many total processes exist in this tree (including the parent)?', options: ['4', '5', '7', '8'], correctIndex: 2, explanation: '1 parent + 3 children + (3 children * 1 sub-child each) = 7 processes.' }
    ]
  }
};
