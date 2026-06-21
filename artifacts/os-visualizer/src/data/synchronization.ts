import { TopicData } from '../types';

export const synchronizationData: Record<string, TopicData> = {
  'sync-intro': {
    id: 'sync-intro',
    title: 'Introduction to Process Synchronization',
    overview: 'When multiple processes or threads share data and execute concurrently, the final result depends on the precise order of execution — an unpredictable and dangerous situation. Process synchronization provides mechanisms to coordinate access to shared resources so that concurrent execution produces correct, deterministic results.',
    whyItExists: 'Without synchronization, concurrent processes can corrupt shared data. Two threads incrementing a counter might both read 5, both compute 6, and both write 6 — resulting in 6 instead of 7. Synchronization prevents this by controlling execution order.',
    analogy: 'A shared Google Doc with collaborative editing. Without coordination (synchronization), two people editing the same sentence simultaneously will corrupt it. Google Docs solves this with operational transformation — our OS equivalent is mutexes and semaphores.',
    keyPoints: [
      'Concurrent execution can lead to non-deterministic results',
      'Shared memory model requires careful coordination',
      'The Producer-Consumer problem highlights the need for synchronization',
      'Race conditions occur when outcome depends on execution timing',
      'Critical sections are code segments that access shared resources'
    ],
    interviewNotes: [
      'Be able to explain what a race condition is and give a simple example.',
      'Understand the difference between concurrent and parallel execution.',
      'Know why synchronization is necessary in multi-threaded applications.',
      'Be prepared to discuss real-world examples of synchronization problems.',
      'Explain the concept of a shared resource.',
      'Describe the role of the OS in process synchronization.'
    ],
    quickRevision: [
      'Synchronization ensures predictable execution order.',
      'Prevents data corruption in shared memory.',
      'Essential for multi-threaded applications.',
      'Solves the race condition problem.',
      'Coordinates access to critical sections.',
      'OS provides synchronization primitives.',
      'Crucial for system stability and correctness.'
    ],
    quiz: [
      {
        question: 'What is the primary goal of process synchronization?',
        options: [
          'To maximize CPU utilization',
          'To ensure predictable execution order and prevent data corruption',
          'To increase memory capacity',
          'To speed up I/O operations'
        ],
        correctAnswer: 1,
        explanation: 'Process synchronization coordinates access to shared resources to prevent data corruption and ensure correct results.'
      },
      {
        question: 'Which scenario best illustrates the need for synchronization?',
        options: [
          'Two independent programs running on separate CPUs',
          'A single program reading from a read-only file',
          'Two threads simultaneously updating the same bank account balance',
          'A process waiting for user input'
        ],
        correctAnswer: 2,
        explanation: 'Simultaneous updates to shared data without synchronization can lead to incorrect final values due to race conditions.'
      },
      {
        question: 'What happens in a race condition?',
        options: [
          'The CPU executes instructions faster than usual',
          'Processes compete for CPU time',
          'The final result depends on the unpredictable execution order of concurrent processes',
          'The OS terminates a process due to excessive resource usage'
        ],
        correctAnswer: 2,
        explanation: 'A race condition occurs when the outcome of concurrent execution depends on the specific timing of the processes involved.'
      },
      {
        question: 'Which of the following is NOT a characteristic of process synchronization?',
        options: [
          'Coordinating access to shared data',
          'Ensuring deterministic results',
          'Preventing race conditions',
          'Allowing unlimited concurrent access to all resources'
        ],
        correctAnswer: 3,
        explanation: 'Synchronization specifically limits and coordinates concurrent access, rather than allowing unlimited access.'
      },
      {
        question: 'In the context of synchronization, what is a "shared resource"?',
        options: [
          'A resource that is only used by one process',
          'Data, memory, or hardware accessed by multiple processes concurrently',
          'A resource that is always read-only',
          'A CPU core'
        ],
        correctAnswer: 1,
        explanation: 'A shared resource is anything that multiple processes or threads need to access and potentially modify concurrently.'
      }
    ]
  },
  'race-condition': {
    id: 'race-condition',
    title: 'Race Conditions: When Timing Breaks Correctness',
    overview: 'A race condition occurs when the program outcome depends on the relative timing or interleaving of multiple threads/processes. Classic example: two threads both executing count++ (which is READ-MODIFY-WRITE, three separate machine instructions) on a shared counter. If both threads read the same value before either writes back, one update is lost.',
    whyItExists: 'High-level operations like count++ are often translated into multiple machine instructions (read, modify, write). If the OS switches context between threads during this sequence, their operations can interleave destructively.',
    analogy: 'Two people trying to book the last seat on a flight simultaneously. Both check the system, see 1 seat available, and both try to book it. Without a lock, the system might accidentally sell the same seat twice.',
    keyPoints: [
      'A race condition depends on the specific timing of execution',
      'The read-modify-write cycle is typically not atomic',
      'High-level operations (like count++) are not safe without sync',
      'Memory visibility issues can exacerbate race conditions',
      'Race conditions are notoriously difficult to reproduce and debug'
    ],
    interviewNotes: [
      'Explain the count++ example at the machine instruction level.',
      'Understand why race conditions are hard to debug (non-deterministic).',
      'Discuss how context switching contributes to race conditions.',
      'Be able to write a simple code snippet that exhibits a race condition.',
      'Explain the concept of atomicity.',
      'Differentiate between data races and race conditions.'
    ],
    quickRevision: [
      'Race condition: Outcome depends on execution timing.',
      'Read-modify-write is not an atomic operation.',
      'Context switches can interleave instructions destructively.',
      'Lost updates are a common symptom.',
      'Difficult to reproduce consistently.',
      'Requires synchronization to prevent.',
      'Often occurs with shared counters or flags.'
    ],
    quiz: [
      {
        question: 'Why is the operation "count++" generally not atomic?',
        options: [
          'It is a single machine instruction',
          'It involves three separate steps: read, modify, and write',
          'It always executes instantly',
          'It is protected by the hardware'
        ],
        correctAnswer: 1,
        explanation: 'At the machine level, incrementing a variable requires reading its current value into a register, adding 1, and writing it back to memory.'
      },
      {
        question: 'What is a common result of a race condition when two threads increment a shared counter once?',
        options: [
          'The counter increments by 3',
          'The counter increments by 2, always',
          'The counter might only increment by 1 due to a lost update',
          'The counter is reset to 0'
        ],
        correctAnswer: 2,
        explanation: 'If both threads read the same initial value before either writes, they will both write back the same incremented value, effectively losing one update.'
      },
      {
        question: 'Why are race conditions hard to debug?',
        options: [
          'They only happen in slow systems',
          'They cause immediate syntax errors',
          'They are non-deterministic and depend on unpredictable timing',
          'They always crash the program predictably'
        ],
        correctAnswer: 2,
        explanation: 'Because they depend on specific interleavings of threads, race conditions might not occur every time the program runs, making them hard to reproduce.'
      },
      {
        question: 'What triggers the problematic interleaving in a race condition?',
        options: [
          'A hardware failure',
          'A context switch occurring in the middle of a non-atomic operation',
          'A fast network connection',
          'Using too much memory'
        ],
        correctAnswer: 1,
        explanation: 'When the OS interrupts a thread halfway through a read-modify-write cycle and lets another thread access the same data, a race condition occurs.'
      },
      {
        question: 'Which of these operations is most vulnerable to a race condition without synchronization?',
        options: [
          'Reading a constant configuration value',
          'A single thread computing a local variable',
          'Multiple threads updating a shared global variable',
          'Executing a system call'
        ],
        correctAnswer: 2,
        explanation: 'Shared state being modified by multiple concurrent threads is the classic setup for a race condition.'
      }
    ]
  },
  'critical-section': {
    id: 'critical-section',
    title: 'The Critical Section Problem',
    overview: 'A critical section is the segment of code that accesses shared resources. The critical section problem is to design a protocol so that processes can cooperate safely. The code is typically divided into four sections: entry section (requesting permission), critical section (accessing shared resource), exit section (releasing permission), and remainder section (non-critical code).',
    whyItExists: 'We need a formal model to reason about and solve synchronization problems. The critical section abstraction provides a framework for evaluating different synchronization algorithms.',
    analogy: 'A fitting room in a clothing store. The entry section is waiting in line and asking for a key. The critical section is changing clothes inside. The exit section is returning the key. The remainder section is shopping in the main store area.',
    keyPoints: [
      'Critical section: code that accesses shared resources',
      'Entry section: requests permission to enter',
      'Exit section: releases the resource/lock',
      'Remainder section: independent, non-shared code',
      'Software solutions (like Peterson\'s) vs. hardware solutions'
    ],
    interviewNotes: [
      'Define the four sections of a process involving a critical section.',
      'Explain Peterson\'s Solution and its limitations (e.g., modern CPU reordering).',
      'Understand why disabling interrupts is a bad solution for user programs.',
      'Discuss the general structure of a critical section problem solution.',
      'Explain the concept of an atomic hardware instruction (e.g., TestAndSet).',
      'Know the difference between software and hardware approaches.'
    ],
    quickRevision: [
      'Critical Section = code accessing shared data.',
      'Must be protected to prevent race conditions.',
      'Entry Section requests access.',
      'Exit Section releases access.',
      'Remainder Section does not affect others.',
      'Goal: Design a safe protocol for cooperation.',
      'Requires mutual exclusion, progress, and bounded waiting.'
    ],
    quiz: [
      {
        question: 'What is the "entry section" in the context of the critical section problem?',
        options: [
          'The code that actually modifies the shared data',
          'The code that requests permission to enter the critical section',
          'The code that runs after the critical section',
          'The code that initializes the program'
        ],
        correctAnswer: 1,
        explanation: 'The entry section is the protocol executed before the critical section to acquire the necessary locks or permissions.'
      },
      {
        question: 'What is a "critical section"?',
        options: [
          'The most important part of the program',
          'Code that executes fastest',
          'A segment of code where shared resources are accessed or modified',
          'Code that handles errors'
        ],
        correctAnswer: 2,
        explanation: 'A critical section specifically refers to the code block where concurrent processes might interfere with each other\'s access to shared state.'
      },
      {
        question: 'What is the purpose of the "exit section"?',
        options: [
          'To terminate the process',
          'To request permission for the next critical section',
          'To release the lock or notify others that the critical section is available',
          'To clear the memory'
        ],
        correctAnswer: 2,
        explanation: 'The exit section follows the critical section and is responsible for relinquishing control so other waiting processes can enter.'
      },
      {
        question: 'Which of the following is considered "remainder section" code?',
        options: [
          'Incrementing a shared counter',
          'Acquiring a mutex lock',
          'Computing a value using only local variables',
          'Releasing a semaphore'
        ],
        correctAnswer: 2,
        explanation: 'The remainder section contains code that does not interact with shared resources and can execute concurrently without issues.'
      },
      {
        question: 'Why is Peterson\'s Solution generally not practical for modern systems?',
        options: [
          'It only works for three or more processes',
          'It requires special hardware support',
          'Modern CPUs may reorder instructions, breaking its assumptions',
          'It is too slow to execute'
        ],
        correctAnswer: 2,
        explanation: 'Peterson\'s solution is a software-only approach that relies on strict instruction execution order, which modern out-of-order execution CPUs do not guarantee.'
      }
    ]
  },
  'sync-requirements': {
    id: 'sync-requirements',
    title: 'Synchronization Requirements: Mutual Exclusion, Progress & Bounded Waiting',
    overview: 'Any valid solution to the critical section problem must satisfy three strict requirements: Mutual Exclusion, Progress, and Bounded Waiting. These ensure that the system operates correctly, doesn\'t deadlock, and remains fair to all processes.',
    whyItExists: 'Without Mutual Exclusion, race conditions still happen. Without Progress, the system might freeze (deadlock or livelock) even when resources are free. Without Bounded Waiting, some processes might be starved and never get a chance to execute.',
    analogy: 'A single-lane bridge. Mutual Exclusion: only one direction of traffic at a time. Progress: if the bridge is empty and cars want to cross, someone must be allowed to go immediately. Bounded Waiting: a traffic light ensures the waiting side eventually gets a turn and isn\'t blocked forever by an endless stream of cars from the other side.',
    keyPoints: [
      'Mutual Exclusion: Only one process in its critical section at a time',
      'Progress: If CS is empty, selection of next process cannot be postponed indefinitely',
      'Bounded Waiting: Limit on how many times others can enter while a process waits',
      'These three properties define a correct synchronization solution',
      'Failure in any one requirement leads to bugs, deadlocks, or starvation'
    ],
    interviewNotes: [
      'Be able to define all three requirements clearly.',
      'Explain how a proposed solution might fail the Progress requirement.',
      'Differentiate between Deadlock (fails Progress) and Starvation (fails Bounded Waiting).',
      'Understand why strict alternation fails the Progress requirement.',
      'Evaluate simple locking algorithms against these three criteria.',
      'Know how hardware primitives help achieve these.'
    ],
    quickRevision: [
      'Requirement 1: Mutual Exclusion (Safety).',
      'Requirement 2: Progress (Liveness).',
      'Requirement 3: Bounded Waiting (Fairness).',
      'Mutual Exclusion prevents race conditions.',
      'Progress prevents unnecessary stalling.',
      'Bounded Waiting prevents starvation.',
      'All three MUST be satisfied for a correct solution.'
    ],
    quiz: [
      {
        question: 'What does "Mutual Exclusion" mean in synchronization?',
        options: [
          'Processes must wait for each other to finish completely',
          'Only one process can execute its critical section at any given time',
          'Processes must share all data',
          'Processes must execute in a strictly alternating order'
        ],
        correctAnswer: 1,
        explanation: 'Mutual exclusion is the fundamental safety property ensuring concurrent access does not happen.'
      },
      {
        question: 'The "Progress" requirement states that:',
        options: [
          'Processes must execute as fast as possible',
          'Every process will eventually finish',
          'If no process is in the critical section, the decision of who enters next cannot be postponed indefinitely',
          'Processes must make progress in a specific order'
        ],
        correctAnswer: 2,
        explanation: 'Progress ensures the system does not deadlock when the resource is available; someone must be allowed in.'
      },
      {
        question: 'Which problem does "Bounded Waiting" solve?',
        options: [
          'Race conditions',
          'Deadlock',
          'Starvation',
          'Context switching overhead'
        ],
        correctAnswer: 2,
        explanation: 'Bounded waiting ensures fairness by guaranteeing a waiting process will eventually enter, preventing starvation.'
      },
      {
        question: 'A solution that uses strict alternation (Process A, then Process B, then Process A...) typically fails which requirement if Process A doesn\'t want to enter?',
        options: [
          'Mutual Exclusion',
          'Progress',
          'Bounded Waiting',
          'It satisfies all of them'
        ],
        correctAnswer: 1,
        explanation: 'Strict alternation fails Progress because if A is assigned the turn but doesn\'t want to enter, B is blocked indefinitely even though the critical section is empty.'
      },
      {
        question: 'If two processes are deadlocked waiting for each other, which requirement is currently being violated?',
        options: [
          'Mutual Exclusion',
          'Progress',
          'Bounded Waiting',
          'None of the above'
        ],
        correctAnswer: 1,
        explanation: 'Deadlock is a violation of Progress, because the system is halted and no process is entering the critical section.'
      }
    ]
  },
  'sync-playground': {
    id: 'sync-playground',
    title: 'Synchronization Playground — Before vs After',
    overview: 'An interactive simulator demonstrating the chaotic results of unsynchronized concurrent execution versus the orderly, correct results when proper synchronization is applied. It highlights the non-deterministic nature of race conditions.',
    whyItExists: 'Seeing abstract concepts like race conditions in action makes them concrete. The playground allows users to adjust variables (threads, operations) and observe how the probability and severity of data corruption change.',
    analogy: 'Imagine multiple chefs adding ingredients to a soup blindly versus taking turns. Without taking turns (sync), the soup might end up with too much salt. With turns, the recipe is followed exactly.',
    keyPoints: [
      'Unsynchronized execution yields unpredictable, often incorrect results',
      'The "lost update" problem is clearly visible without sync',
      'Synchronized execution guarantees deterministic correctness',
      'More threads and operations increase the chance of race conditions',
      'Synchronization introduces sequential execution (a performance tradeoff)'
    ],
    interviewNotes: [
      'Use the playground to visualize lost updates in a shared counter.',
      'Understand the performance tradeoff: sync ensures correctness but reduces parallelism.',
      'Explain why the unsynchronized result varies between runs.',
      'Be able to describe the timeline differences (overlapping vs. sequential).'
    ],
    quickRevision: [
      'Playground shows visual proof of race conditions.',
      'Without sync: fast but wrong.',
      'With sync: slightly slower but correct.',
      'Lost updates occur when writes interleave.',
      'Locking forces sequential access to shared state.'
    ],
    quiz: [
      {
        question: 'In the playground, what happens to the final counter value without synchronization?',
        options: [
          'It is always exactly half the expected value',
          'It is always correct',
          'It is usually less than the expected value due to lost updates',
          'It is usually greater than the expected value'
        ],
        correctAnswer: 2,
        explanation: 'Without sync, concurrent increments overwrite each other, leading to missed counts and a lower final total.'
      },
      {
        question: 'What is the primary tradeoff when introducing synchronization?',
        options: [
          'It uses more memory',
          'It forces threads to wait, reducing pure parallelism for correctness',
          'It increases the risk of race conditions',
          'It requires a faster CPU'
        ],
        correctAnswer: 1,
        explanation: 'Synchronization inherently serializes access to critical sections, which means threads must wait, slowing down overall execution but ensuring safety.'
      },
      {
        question: 'Why does the unsynchronized run produce different results on different attempts?',
        options: [
          'Because the CPU speed changes',
          'Because of non-deterministic OS scheduling and timing',
          'Because of memory leaks',
          'It actually produces the same wrong result every time'
        ],
        correctAnswer: 1,
        explanation: 'The exact moment a context switch occurs varies slightly every time, making the interleaving pattern and the final result unpredictable.'
      },
      {
        question: 'If 4 threads each increment a shared counter 5 times without sync, which is a likely final value?',
        options: [
          'Exactly 20',
          'Exactly 0',
          '14',
          '25'
        ],
        correctAnswer: 2,
        explanation: 'The correct value is 20. Without sync, the value will likely be less than 20 due to lost updates, making 14 a plausible result.'
      },
      {
        question: 'What visual pattern represents synchronized execution in a timeline?',
        options: [
          'Completely overlapping bars',
          'Randomly scattered dots',
          'Sequential, non-overlapping blocks in the critical section',
          'Parallel lines stretching indefinitely'
        ],
        correctAnswer: 2,
        explanation: 'Synchronization ensures mutual exclusion, meaning only one thread is in the critical section at a time, resulting in sequential execution blocks.'
      }
    ]
  },
  'real-world-sync': {
    id: 'real-world-sync',
    title: 'Real-World Synchronization Examples',
    overview: 'Synchronization isn\'t just an abstract OS concept; it\'s critical in everyday software. From banking systems to airline reservations, any system that handles concurrent users modifying shared state relies heavily on synchronization primitives to maintain data integrity.',
    whyItExists: 'To connect theoretical OS concepts to practical software engineering. Understanding these scenarios helps developers write thread-safe backend services, databases, and concurrent applications.',
    analogy: 'A real-world locking mechanism, like a physical key to a restroom, maps perfectly to a software mutex used in these scenarios.',
    keyPoints: [
      'ATM withdrawals: Preventing double-spending',
      'Airline booking: Preventing double-booking of a single seat',
      'E-commerce: Preventing overselling inventory',
      'Databases: ACID transactions rely on complex locking',
      'OS Kernel: Protecting internal data structures like process queues'
    ],
    interviewNotes: [
      'Be able to walk through a "double spending" scenario in banking.',
      'Explain how a database transaction uses locks to ensure consistency.',
      'Discuss the concept of "optimistic" vs "pessimistic" locking (advanced).',
      'Understand how APIs handle concurrent requests safely.',
      'Relate the real-world examples back to the read-modify-write problem.'
    ],
    quickRevision: [
      'Real systems fail catastrophically without sync.',
      'Bank balances can become negative.',
      'Seats can be double-booked.',
      'Inventory can be oversold.',
      'Databases use locks for ACID properties.',
      'Sync is essential for scalable backend architecture.'
    ],
    quiz: [
      {
        question: 'What is the risk in an unsynchronized ATM withdrawal scenario?',
        options: [
          'The ATM might dispense the wrong currency',
          'Two concurrent withdrawals might both succeed even if funds are insufficient for both',
          'The ATM might freeze completely',
          'The user\'s PIN might be compromised'
        ],
        correctAnswer: 1,
        explanation: 'If both transactions read the balance before either updates it, they might both authorize the withdrawal, leading to a negative balance.'
      },
      {
        question: 'In an airline booking system, what prevents two users from booking the last seat?',
        options: [
          'A fast network connection',
          'A hardware firewall',
          'Synchronization locks on the seat resource during the transaction',
          'Random assignment'
        ],
        correctAnswer: 2,
        explanation: 'The system uses locks (often in the database) to ensure that only one transaction can successfully reserve the seat.'
      },
      {
        question: 'What is "overselling" in an e-commerce context, caused by lack of synchronization?',
        options: [
          'Selling items at too high a price',
          'Selling more items than are actually in physical inventory',
          'Selling items too quickly',
          'Marketing to too many customers'
        ],
        correctAnswer: 1,
        explanation: 'Concurrent checkouts might decrement the inventory count simultaneously without seeing each other\'s updates, dropping inventory below zero.'
      },
      {
        question: 'How do relational databases generally handle concurrent updates to ensure data integrity?',
        options: [
          'By executing them infinitely fast',
          'By randomly dropping some updates',
          'By using transactions and locking mechanisms (ACID properties)',
          'By asking the user to wait'
        ],
        correctAnswer: 2,
        explanation: 'Databases use sophisticated locking and isolation levels to provide ACID guarantees, effectively synchronizing concurrent access.'
      },
      {
        question: 'Why does the OS kernel itself need synchronization?',
        options: [
          'To run the GUI faster',
          'Because multiple CPUs or interrupt handlers might access kernel data structures simultaneously',
          'To save disk space',
          'It doesn\'t; the kernel is immune to race conditions'
        ],
        correctAnswer: 1,
        explanation: 'The kernel is a highly concurrent program. Hardware interrupts and multiple CPU cores mean kernel data structures (like process lists) must be protected by locks.'
      }
    ]
  }
};