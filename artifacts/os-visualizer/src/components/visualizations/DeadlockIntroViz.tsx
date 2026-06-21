import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Pencil, BookOpen } from "lucide-react";

export function DeadlockIntroViz() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0); // 0: Normal, 1: Requesting, 2: Deadlock

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (phase === 0) {
        timer = setTimeout(() => setPhase(1), 2000);
      } else if (phase === 1) {
        timer = setTimeout(() => setPhase(2), 2000);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, phase]);

  const handleReset = () => {
    setIsPlaying(false);
    setPhase(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Introduction to Deadlocks</CardTitle>
        <CardDescription>
          A visual representation of the permanent blocking state.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)} data-testid="btn-play">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} data-testid="btn-reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative h-[300px] border rounded-xl bg-card p-6 flex flex-col items-center justify-center overflow-hidden">
          
          <div className="absolute top-4 text-center font-mono font-bold bg-muted px-4 py-2 rounded-lg">
            {phase === 0 && "Phase 1: Each process holds one resource"}
            {phase === 1 && "Phase 2: Each process requests the other's resource"}
            {phase === 2 && "Phase 3: Neither can proceed — permanent block"}
          </div>

          {/* Center text for deadlock */}
          {phase === 2 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
              className="absolute z-30 font-black text-4xl text-destructive tracking-widest drop-shadow-lg"
            >
              DEADLOCK
            </motion.div>
          )}

          <div className="w-full max-w-2xl flex justify-between items-center relative mt-8 z-10 px-8">
            
            {/* Process A */}
            <div className="flex flex-col items-center gap-4 z-20">
              <motion.div 
                animate={{ 
                  boxShadow: phase === 2 ? "0 0 0 8px hsl(var(--destructive)/0.3)" : "none"
                }}
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-bold bg-card ${phase === 2 ? 'border-destructive text-destructive' : 'border-violet-500 text-violet-500'}`}
              >
                A
              </motion.div>
              <div className="border-2 border-green-500 rounded-lg p-3 bg-card flex flex-col items-center gap-2">
                <Pencil className="w-6 h-6 text-green-500" />
                <span className="text-xs font-bold text-green-500">Pen</span>
              </div>
            </div>

            {/* Connecting Arrows */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg width="100%" height="100%" className="overflow-visible">
                <defs>
                  <marker id="arrowhead-gray" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground" />
                  </marker>
                  <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-destructive" />
                  </marker>
                </defs>

                {/* Arrow from A to Notebook (B's resource) */}
                {(phase === 1 || phase === 2) && (
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d="M 160 100 C 300 30, 400 30, 500 130"
                    fill="transparent"
                    strokeWidth="3"
                    strokeDasharray={phase === 1 ? "6 6" : "none"}
                    stroke={phase === 2 ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))"}
                    markerEnd={phase === 2 ? "url(#arrowhead-red)" : "url(#arrowhead-gray)"}
                    className="transition-colors duration-300"
                  />
                )}

                {/* Arrow from B to Pen (A's resource) */}
                {(phase === 1 || phase === 2) && (
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d="M 500 100 C 400 180, 200 180, 160 140"
                    fill="transparent"
                    strokeWidth="3"
                    strokeDasharray={phase === 1 ? "6 6" : "none"}
                    stroke={phase === 2 ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))"}
                    markerEnd={phase === 2 ? "url(#arrowhead-red)" : "url(#arrowhead-gray)"}
                    className="transition-colors duration-300"
                  />
                )}
              </svg>
            </div>

            {/* Process B */}
            <div className="flex flex-col items-center gap-4 z-20">
              <motion.div 
                animate={{ 
                  boxShadow: phase === 2 ? "0 0 0 8px hsl(var(--destructive)/0.3)" : "none"
                }}
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-bold bg-card ${phase === 2 ? 'border-destructive text-destructive' : 'border-amber-500 text-amber-500'}`}
              >
                B
              </motion.div>
              <div className="border-2 border-green-500 rounded-lg p-3 bg-card flex flex-col items-center gap-2">
                <BookOpen className="w-6 h-6 text-green-500" />
                <span className="text-xs font-bold text-green-500">Notebook</span>
              </div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/50 border-none shadow-none">
            <CardHeader className="py-4">
              <CardTitle className="text-base">In Real Life</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pb-4">
              Traffic gridlock at an intersection, or two cars meeting on a single-lane bridge where neither can back up.
            </CardContent>
          </Card>
          <Card className="bg-muted/50 border-none shadow-none">
            <CardHeader className="py-4">
              <CardTitle className="text-base">In Operating Systems</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pb-4">
              Processes holding system resources (memory segments, open files, hardware like printers) while waiting for others.
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
