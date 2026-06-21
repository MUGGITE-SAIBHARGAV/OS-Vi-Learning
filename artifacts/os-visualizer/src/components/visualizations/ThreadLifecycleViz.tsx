import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";

type ThreadState = "NEW" | "READY" | "RUNNING" | "BLOCKED" | "TERMINATED";

const STATE_DESCRIPTIONS: Record<ThreadState, string> = {
  NEW: "Thread object created, but not yet ready to execute.",
  READY: "Waiting in the run queue for the CPU scheduler.",
  RUNNING: "Executing instructions on the CPU core.",
  BLOCKED: "Waiting for I/O or a lock (mutex/semaphore).",
  TERMINATED: "Execution completed, stack/registers reclaimed."
};

const STATE_COLORS: Record<ThreadState, string> = {
  NEW: "bg-slate-500",
  READY: "bg-blue-500",
  RUNNING: "bg-green-500",
  BLOCKED: "bg-amber-500",
  TERMINATED: "bg-rose-500"
};

export function ThreadLifecycleViz() {
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Focus on the blocked -> ready difference for threads
  const CYCLE: ThreadState[] = ["NEW", "READY", "RUNNING", "BLOCKED", "READY", "RUNNING", "TERMINATED"];

  const currentState = CYCLE[cycleIndex];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        setCycleIndex(prev => {
          if (prev >= CYCLE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, speed, cycleIndex]);

  const handleReset = () => {
    setIsPlaying(false);
    setCycleIndex(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Thread Lifecycle</CardTitle>
        <CardDescription>Notice the Blocked → Ready transition. Unlike processes, threads are lighter to transition.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 flex-1 ml-8 max-w-[200px]">
            <span className="text-sm text-muted-foreground w-12 text-right">{speed.toFixed(1)}x</span>
            <Slider
              value={[speed]}
              min={0.5}
              max={3}
              step={0.5}
              onValueChange={([val]) => setSpeed(val)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="relative h-[350px] border rounded-xl bg-card overflow-hidden">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-border" />
              </marker>
            </defs>

            {/* NEW -> READY */}
            <path d="M 120 175 L 300 100" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-border" />
            {/* READY -> RUNNING */}
            <path d="M 350 120 L 350 175" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-border" />
            {/* RUNNING -> READY (Interrupt) */}
            <path d="M 310 175 L 310 120" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-border" />
            
            {/* RUNNING -> BLOCKED */}
            <path d="M 400 200 L 580 200" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-border" />
            {/* BLOCKED -> READY */}
            <path d="M 630 175 L 400 100" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-border text-amber-500/50" />
            
            {/* RUNNING -> TERMINATED */}
            <path d="M 350 225 L 350 300" fill="none" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)" className="text-border" />
          </svg>

          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-[60px] -translate-y-1/2">
              <StateNode state="NEW" active={currentState === "NEW"} />
            </div>
            <div className="absolute top-[80px] left-[350px] -translate-x-1/2 -translate-y-1/2">
              <StateNode state="READY" active={currentState === "READY"} />
            </div>
            <div className="absolute top-[200px] left-[350px] -translate-x-1/2 -translate-y-1/2">
              <StateNode state="RUNNING" active={currentState === "RUNNING"} />
            </div>
            <div className="absolute top-[200px] left-[630px] -translate-x-1/2 -translate-y-1/2">
              <StateNode state="BLOCKED" active={currentState === "BLOCKED"} />
            </div>
            <div className="absolute top-[320px] left-[350px] -translate-x-1/2 -translate-y-1/2">
              <StateNode state="TERMINATED" active={currentState === "TERMINATED"} />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted border">
          <h4 className="font-mono font-bold mb-2 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${STATE_COLORS[currentState]}`} />
            {currentState} State
          </h4>
          <p className="text-muted-foreground text-sm">
            {STATE_DESCRIPTIONS[currentState]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function StateNode({ state, active }: { state: ThreadState; active: boolean }) {
  return (
    <motion.div
      animate={{
        scale: active ? 1.1 : 1,
        boxShadow: active ? `0 0 20px var(--primary)` : "none"
      }}
      className={`px-6 py-3 rounded-full border-2 font-mono text-sm font-bold shadow-sm transition-colors duration-300 w-32 text-center
        ${active ? STATE_COLORS[state] + " text-white border-transparent" : "bg-card text-foreground border-border"}
      `}
    >
      {state}
    </motion.div>
  );
}