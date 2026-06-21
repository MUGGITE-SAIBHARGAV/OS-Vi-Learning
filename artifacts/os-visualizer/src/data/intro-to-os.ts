import { TopicData } from '../types';

export const introToOsData: Record<string, TopicData> = {
  'what-is-an-os': {
    id: 'what-is-an-os',
    title: 'What is an Operating System?',
    overview: 'An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between the user of a computer and the computer hardware. Without an OS, a computer is essentially a useless collection of electronic components.',
    whyItExists: 'It exists to provide a convenient and efficient environment for users to execute programs, abstracting away the complex details of hardware manipulation.',
    analogy: 'Think of an OS as the manager of a large, complex restaurant. The hardware is the kitchen equipment and staff. The software applications are the recipes. The users are the customers. Without the manager (OS) coordinating who uses which oven, when ingredients are delivered, and taking orders, chaos would ensue.',
    keyPoints: [
      {
        title: 'Resource Allocator',
        description: 'The OS manages all resources (CPU time, memory space, file-storage space, I/O devices). It decides between conflicting requests for efficient and fair resource use.'
      },
      {
        title: 'Control Program',
        description: 'It controls the execution of programs to prevent errors and improper use of the computer, ensuring smooth operation and security.'
      },
      {
        title: 'User Interface',
        description: 'Provides a mechanism for users to interact with the system, whether through a Command Line Interface (CLI) or a Graphical User Interface (GUI).'
      },
      {
        title: 'Hardware Abstraction',
        description: 'Hides the ugly details of hardware control from application programmers, providing a clean, consistent API (System Calls).'
      }
    ],
    interviewNotes: [
      'Define OS formally: An intermediary between user and computer hardware.',
      'Always mention its dual role: Resource Allocator (efficiency) and Control Program (convenience/security).',
      'Be prepared to contrast an OS with firmware or application software.',
      'Understand that the core of the OS is the Kernel, which runs at all times.',
      'Know the primary goals: Convenience, Efficiency, and Ability to Evolve.'
    ],
    quickRevision: [
      'OS = Intermediary software.',
      'Goals: Convenience & Efficiency.',
      'Roles: Resource allocator, Control program.',
      'Hides hardware complexity.',
      'Provides user interface.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which of the following is NOT a primary function of an Operating System?',
        options: ['Resource Allocation', 'Hardware Abstraction', 'Compiling Source Code', 'Process Management'],
        correctIndex: 2,
        explanation: 'Compiling source code is done by a compiler, which is application or system software, but not typically a core function of the OS itself.'
      },
      {
        id: 'q2',
        question: 'What is the core component of an Operating System that is always running?',
        options: ['Shell', 'Kernel', 'Device Driver', 'Command Line'],
        correctIndex: 1,
        explanation: 'The kernel is the central component of most OSs; it is the one program running at all times on the computer.'
      },
      {
        id: 'q3',
        question: 'As a "Control Program", the OS primarily ensures:',
        options: ['Maximum CPU speed', 'Beautiful graphics', 'Prevention of errors and improper computer use', 'Internet connectivity'],
        correctIndex: 2,
        explanation: 'The control program aspect manages the execution of user programs to prevent errors and unauthorized access to resources.'
      }
    ]
  },
  'functions-of-os': {
    id: 'functions-of-os',
    title: 'Functions of an Operating System',
    overview: 'An OS performs several critical functions to ensure the system operates smoothly. These include managing the CPU (Process Management), managing memory (Memory Management), handling files and storage (File Management), and managing input/output devices (I/O Management).',
    whyItExists: 'These functions are necessary to multiplex resources among competing applications, ensuring fairness, security, and optimal performance.',
    analogy: 'Imagine a busy airport. Process management is Air Traffic Control (scheduling flights). Memory management is assigning gates and parking. File management is the luggage handling system. I/O management is the communication with ground vehicles and radar systems.',
    keyPoints: [
      {
        title: 'Process Management',
        description: 'Creating and deleting both user and system processes, suspending and resuming processes, providing mechanisms for process synchronization and communication.'
      },
      {
        title: 'Memory Management',
        description: 'Keeping track of which parts of memory are currently being used and by whom. Deciding which processes and data to move into and out of memory. Allocating and deallocating memory space as needed.'
      },
      {
        title: 'File Management',
        description: 'Creating and deleting files and directories. Providing primitives for manipulating files and directories. Mapping files onto secondary storage. Backing up files on stable storage media.'
      },
      {
        title: 'I/O Device Management',
        description: 'A memory-management component that includes buffering, caching, and spooling. A general device-driver interface. Drivers for specific hardware devices.'
      }
    ],
    interviewNotes: [
      'Be able to list the 5 main functions: Process, Memory, File, I/O, and Protection/Security.',
      'Understand how these functions interact (e.g., loading a program requires file management, memory management, and process management).',
      'If asked about "Resource Management", relate it back to CPU, Memory, and I/O.',
      'Protection refers to mechanisms that control access of processes or users to resources.'
    ],
    quickRevision: [
      'Process Mgmt: CPU scheduling, process creation/deletion.',
      'Memory Mgmt: Tracking memory usage, allocation.',
      'File Mgmt: Directories, file creation, mapping to disk.',
      'I/O Mgmt: Device drivers, buffering.',
      'Protection/Security: Access control, preventing interference.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which OS function involves deciding which process gets the CPU and for how long?',
        options: ['Memory Management', 'File Management', 'Process Management', 'Device Management'],
        correctIndex: 2,
        explanation: 'Process management includes CPU scheduling, which determines execution order and duration.'
      },
      {
        id: 'q2',
        question: 'Allocating and deallocating space on a hard drive is primarily the job of:',
        options: ['Process Management', 'Memory Management', 'File/Storage Management', 'Network Management'],
        correctIndex: 2,
        explanation: 'File and storage management handles mapping files to secondary storage (like hard drives) and managing free space.'
      },
      {
        id: 'q3',
        question: 'A mechanism to control access to system resources by users or programs falls under:',
        options: ['Protection and Security', 'I/O Management', 'Command Interpretation', 'Caching'],
        correctIndex: 0,
        explanation: 'Protection involves mechanisms that control the access of programs, processes, or users to the resources defined by the computer system.'
      }
    ]
  },
  'types-of-os': {
    id: 'types-of-os',
    title: 'Types of Operating Systems',
    overview: 'Operating systems have evolved significantly over time, leading to various types designed for specific environments and constraints. Common types include Batch, Time-Sharing (Multitasking), Distributed, Network, and Real-Time operating systems.',
    whyItExists: 'Different environments have different requirements. A supercomputer predicting weather needs a different OS than a pacemaker controlling a heartbeat.',
    analogy: 'Vehicles. A Batch OS is a freight train (high throughput, no interactivity). Time-sharing is a bus (shares time among many passengers interactively). Real-time is an ambulance (must respond within a strict deadline).',
    keyPoints: [
      {
        title: 'Batch Operating Systems',
        description: 'Users do not interact directly with the computer. Each user prepares a job on an off-line device (like punch cards) and submits it to the computer operator. Jobs with similar needs are batched together and run as a group to speed up processing.'
      },
      {
        title: 'Time-Sharing (Multitasking) OS',
        description: 'Allows many users to share the computer resources simultaneously. The CPU multiplexes multiple jobs by switching among them so frequently that users can interact with each program while it is running.'
      },
      {
        title: 'Real-Time Operating Systems (RTOS)',
        description: 'Used when there are rigid time requirements on the operation of a processor or the flow of data. A real-time system guarantees that critical tasks complete on time (Hard RTOS) or tries its best (Soft RTOS).'
      },
      {
        title: 'Distributed Operating Systems',
        description: 'Manage a group of distinct computers and make them appear to be a single computer. The computations are distributed among several physical processors.'
      }
    ],
    interviewNotes: [
      'Understand the difference between Hard and Soft Real-Time systems (Hard: missing deadline is a total system failure. Soft: missing deadline degrades quality but system continues).',
      'Know that modern desktop OSs (Windows, macOS) are primarily Time-Sharing/Multitasking systems.',
      'Batch processing is still used today for large-scale data processing (like payroll or billing systems) even though the OSs themselves are modern.',
      'Multiprogramming vs Multitasking: Multiprogramming keeps CPU busy by switching when a job waits for I/O; Multitasking switches based on time-slices for interactivity.'
    ],
    quickRevision: [
      'Batch: No user interaction, grouped jobs.',
      'Time-Sharing: Interactivity, CPU time-slicing.',
      'Real-Time (Hard): Strict deadlines (e.g., airbags).',
      'Real-Time (Soft): Loose deadlines (e.g., video streaming).',
      'Distributed: Multiple machines appear as one.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'An operating system used for a flight control system must be a:',
        options: ['Batch OS', 'Time-Sharing OS', 'Hard Real-Time OS', 'Network OS'],
        correctIndex: 2,
        explanation: 'Flight control systems have critical deadlines where failure to respond in time can be catastrophic, requiring a Hard Real-Time OS.'
      },
      {
        id: 'q2',
        question: 'Which OS type is characterized by grouping similar jobs to maximize CPU utilization without user interaction?',
        options: ['Distributed OS', 'Batch OS', 'Multitasking OS', 'Mobile OS'],
        correctIndex: 1,
        explanation: 'Batch operating systems group similar jobs and execute them sequentially without user interaction to keep the CPU continuously busy.'
      },
      {
        id: 'q3',
        question: 'What is the primary objective of a Time-Sharing Operating System?',
        options: ['Maximize CPU utilization only', 'Minimize response time for interactive users', 'Guarantee execution before a deadline', 'Process large amounts of data offline'],
        correctIndex: 1,
        explanation: 'Time-sharing aims to provide fast interactive response to multiple users by rapidly switching the CPU between their tasks.'
      }
    ]
  },
  'kernel': {
    id: 'kernel',
    title: 'Kernel',
    overview: 'The kernel is the central, core part of an operating system. It is the first program loaded on startup and remains in main memory. It manages the system’s resources and the communication between hardware and software components.',
    whyItExists: 'A centralized authority is needed with supreme privilege to manage hardware safely, preventing rogue applications from corrupting the system.',
    analogy: 'The kernel is the engine of a car. The OS shell/UI is the steering wheel and dashboard. Applications are the passengers. The engine provides the power and control, while the interface lets you direct it safely.',
    keyPoints: [
      {
        title: 'Monolithic Kernel',
        description: 'All OS services run along with the main kernel thread in the same memory space. Provides high performance but is larger and less modular (e.g., Linux, Unix).'
      },
      {
        title: 'Microkernel',
        description: 'Only essential core services (like IPC, basic scheduling) run in the kernel space. Other services (file systems, drivers) run in user space. Slower due to message passing, but more stable and modular (e.g., Mach, QNX).'
      },
      {
        title: 'Privilege Levels',
        description: 'The kernel operates in "Kernel Mode" (Ring 0), giving it unrestricted access to hardware. User applications run in "User Mode" (Ring 3) and must request kernel intervention via system calls.'
      },
      {
        title: 'Kernel Panic',
        description: 'An action taken by an OS upon detecting an internal fatal error from which it cannot safely recover (similar to the Blue Screen of Death).'
      }
    ],
    interviewNotes: [
      'Monolithic vs Microkernel is a very common interview question. Know the trade-off: Performance (Monolithic) vs Modularity/Reliability (Microkernel).',
      'Understand Context Switching: moving from User Mode to Kernel Mode when an interrupt or system call occurs.',
      'Hybrid Kernels (like Windows NT and macOS/XNU) combine aspects of both monolithic and microkernels.'
    ],
    quickRevision: [
      'Kernel: Core OS program, always running.',
      'Kernel Mode: Full hardware access.',
      'Monolithic: Fast, large, all services in kernel space.',
      'Microkernel: Core services only in kernel, others in user space (slower but stable).',
      'Hybrid: Mix of both.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which kernel architecture puts most OS services in user space to improve stability?',
        options: ['Monolithic Kernel', 'Microkernel', 'Exokernel', 'Macrokernel'],
        correctIndex: 1,
        explanation: 'Microkernels run minimal services in kernel space and push things like file systems and drivers to user space, so if a driver crashes, the whole system doesn\'t crash.'
      },
      {
        id: 'q2',
        question: 'The transition from user mode to kernel mode is triggered by a:',
        options: ['Function call', 'System Call / Interrupt', 'Memory leak', 'Context switch'],
        correctIndex: 1,
        explanation: 'User applications trigger a switch to kernel mode via system calls (software interrupts) or hardware interrupts.'
      },
      {
        id: 'q3',
        question: 'Which is a primary advantage of a Monolithic kernel?',
        options: ['Easier to debug', 'Smaller footprint', 'Higher performance', 'If one service fails, others keep running'],
        correctIndex: 2,
        explanation: 'Because all services run in the same memory space, there is less overhead for message passing, resulting in higher performance.'
      }
    ]
  },
  'system-calls': {
    id: 'system-calls',
    title: 'System Calls',
    overview: 'System calls provide the programmatic interface to the services offered by the operating system. They are the mechanism used by an application program to request a service from the operating system kernel.',
    whyItExists: 'Applications run in user mode with restricted permissions. To do anything meaningful (read a file, send network data, allocate memory), they must safely ask the kernel (running in kernel mode) to do it on their behalf.',
    analogy: 'Imagine a bank vault. Customers (user apps) cannot walk in and grab money. They must go to the teller (system call interface), request a withdrawal (system call), and the teller goes into the vault (kernel mode) to get the money safely.',
    keyPoints: [
      {
        title: 'The Mechanism',
        description: 'A system call typically involves a software interrupt (or trap) that switches the CPU from user mode to kernel mode. The kernel checks the request, performs it if authorized, and returns control to the application.'
      },
      {
        title: 'Types of System Calls',
        description: 'Generally categorized into Process Control (fork, exit), File Management (open, read, write), Device Management (ioctl, read), Information Maintenance (getpid, alarm), and Communication (pipe, shmget).'
      },
      {
        title: 'APIs vs System Calls',
        description: 'Developers rarely write direct system calls. They use APIs (like POSIX/libc or Windows API) which act as wrapper functions. The `printf()` function in C is an API that eventually calls the `write()` system call.'
      },
      {
        title: 'Parameter Passing',
        description: 'Parameters for system calls can be passed via CPU registers, stored in a memory block with the address passed in a register, or pushed onto the system stack.'
      }
    ],
    interviewNotes: [
      'Know the sequence of events during a system call: Trap to kernel -> Save state -> Execute kernel routine -> Restore state -> Return to user.',
      'Be able to name a few common POSIX system calls: fork(), exec(), read(), write(), open(), close(), exit().',
      'Understand the cost of a system call: context switching introduces overhead, making system calls relatively expensive compared to normal function calls.'
    ],
    quickRevision: [
      'System Call: App requesting OS service.',
      'Causes User Mode -> Kernel Mode switch (Context Switch).',
      'API: Wrapper around system calls (e.g., POSIX).',
      'Categories: Process, File, Device, Info, Comms.',
      'Passing parameters: Registers, Block address, Stack.'
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Which of the following is typically a system call rather than an API function?',
        options: ['printf()', 'strlen()', 'fork()', 'Math.random()'],
        correctIndex: 2,
        explanation: 'fork() is a POSIX system call used to create a new process. printf() and others are standard library functions (APIs) that may or may not invoke system calls.'
      },
      {
        id: 'q2',
        question: 'Why are system calls considered "expensive" operations?',
        options: ['They require internet access', 'They involve a context switch to kernel mode', 'They must be written in Assembly language', 'They consume a lot of disk space'],
        correctIndex: 1,
        explanation: 'Switching from user mode to kernel mode requires saving the CPU state, flushing pipelines, and running privileged checks, which takes time.'
      },
      {
        id: 'q3',
        question: 'How do user applications request OS services safely?',
        options: ['By directly accessing hardware registers', 'By raising a software interrupt (trap)', 'By editing OS configuration files', 'By bypassing the CPU cache'],
        correctIndex: 1,
        explanation: 'System calls are implemented via software interrupts or traps, which safely transition the CPU into kernel mode to execute trusted OS code.'
      }
    ]
  }
};
