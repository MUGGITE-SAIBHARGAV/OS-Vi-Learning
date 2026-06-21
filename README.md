# OS Visualizer

An interactive, animated educational web app for learning Operating Systems concepts. Built for CS students preparing for exams, interviews, and placements.

---

## Overview

OS Visualizer transforms dry textbook theory into visual, hands-on learning. Each topic includes:
- **Overview** — plain-English explanations with real-world analogies
- **Visualizer** — interactive animations and simulations
- **Key Concepts** — condensed point-form notes
- **Interview Notes** — common interview questions with structured answers
- **Revision** — quick-revision flashcard-style bullets
- **Quiz** — MCQs with instant explanations

---

## Features

### Modules Included

| Module | Subtopics | Visualizers |
|---|---|---|
| **Introduction to OS** | 5 topics | OS role, kernel, system calls |
| **Process Management** | 5 topics | Process lifecycle, PCB, context switching, process tree |
| **Threads & Multithreading** | 7 topics | Thread intro, concurrency vs parallelism, lifecycle |
| **CPU Scheduling** | 7 topics | FCFS, SJF, SRTF, Priority, Round Robin, Scheduling Playground |
| **Process Synchronization** | 6 topics | Race condition simulator, critical section gate, sync requirements |
| **Deadlocks** | 6 topics | RAG visualizer, deadlock formation, Banker's Algorithm, prevention |
| **Memory Management** | Stub | Coming soon |
| **Virtual Memory** | Stub | Coming soon |
| **File Systems** | Stub | Coming soon |
| **Disk Scheduling** | Stub | Coming soon |
| **Security** | Stub | Coming soon |

### Platform Features
- Dark / light theme toggle
- Progress tracking with localStorage (mark topics complete)
- Collapsible sidebar navigation
- 30+ interactive Framer Motion visualizations
- Step-by-step animated simulators with Play / Pause / Speed controls
- MCQ quiz engine with instant feedback

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | lucide-react |
| Routing | Wouter |
| Workspace | pnpm workspaces (monorepo) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+

```bash
npm install -g pnpm
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/os-visualizer.git
cd os-visualizer

# Install all workspace dependencies
pnpm install
```

### Running Locally

```bash
pnpm --filter @workspace/os-visualizer run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** No environment variables are required for local development. PORT defaults to 5173 and BASE_PATH defaults to `/`.

### Build

```bash
pnpm --filter @workspace/os-visualizer run build
```

The production build is output to `artifacts/os-visualizer/dist/public/`.

### Preview Production Build

```bash
pnpm --filter @workspace/os-visualizer run serve
```

---

## Project Structure

```
os-visualizer/
├── artifacts/
│   └── os-visualizer/               # Main web application
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/          # Sidebar, Navbar, ThemeProvider
│       │   │   ├── ui/              # shadcn/ui component library
│       │   │   ├── TopicContent.tsx # Overview/Visualizer/Quiz tab layout
│       │   │   └── visualizations/  # 30+ interactive viz components
│       │   ├── data/                # Topic content and quiz data
│       │   │   ├── topics.ts        # Topic registry (all modules)
│       │   │   ├── process-management.ts
│       │   │   ├── threads.ts
│       │   │   ├── cpu-scheduling.ts
│       │   │   ├── synchronization.ts
│       │   │   ├── deadlocks.ts
│       │   │   └── ...              # Other module stubs
│       │   ├── lib/
│       │   │   ├── scheduling.ts    # CPU scheduling algorithm engine
│       │   │   └── utils.ts         # Tailwind class utilities
│       │   ├── pages/
│       │   │   ├── HomePage.tsx
│       │   │   ├── TopicsPage.tsx
│       │   │   ├── TopicPage.tsx    # Per-subtopic page with tab layout
│       │   │   ├── ProgressPage.tsx
│       │   │   └── QuizPage.tsx
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── lib/                             # Shared workspace libraries
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

---

## Deployment

### Vercel

1. Import the repository on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `artifacts/os-visualizer`
3. Set **Build Command** to `pnpm run build`
4. Set **Output Directory** to `dist/public`
5. Set **Install Command** to `cd ../.. && pnpm install`
6. Deploy

### Netlify

1. Connect the repository on [netlify.com](https://netlify.com)
2. Set **Base directory** to `artifacts/os-visualizer`
3. Set **Build command** to `pnpm run build`
4. Set **Publish directory** to `dist/public`
5. Add a `_redirects` file in `public/` with: `/* /index.html 200`
6. Deploy

### GitHub Pages

```bash
# Build
pnpm --filter @workspace/os-visualizer run build

# The dist/public folder contains the static site
# Deploy to gh-pages branch using gh-pages or GitHub Actions
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5173` | Dev server port |
| `BASE_PATH` | `/` | Base URL path (useful for sub-path deployments) |

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp artifacts/os-visualizer/.env.example artifacts/os-visualizer/.env
```

---

## Screenshots

> Add screenshots here after deployment.

| Home Page | Topic Visualizer | Quiz |
|---|---|---|
| ![Home](screenshots/home.png) | ![Viz](screenshots/visualizer.png) | ![Quiz](screenshots/quiz.png) |

---

## Roadmap

- [ ] Memory Management — paging, segmentation, fragmentation visualizations
- [ ] Virtual Memory — page replacement algorithms (LRU, FIFO, Optimal)
- [ ] File Systems — directory structures, inode visualizer
- [ ] Disk Scheduling — SSTF, SCAN, C-SCAN Gantt charts
- [ ] Mutex & Semaphore — Producer-Consumer, Dining Philosophers
- [ ] Security — access control, encryption basics
- [ ] User accounts and cloud-synced progress
- [ ] Shareable quiz results

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/memory-management`
3. Commit your changes: `git commit -m "Add memory management module"`
4. Push: `git push origin feature/memory-management`
5. Open a pull request

---

## License

MIT
