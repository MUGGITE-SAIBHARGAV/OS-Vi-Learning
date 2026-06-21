import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Shield, ShieldAlert, Bug, RefreshCw } from "lucide-react";

export function SyncIntroViz() {
  const [withSync, setWithSync] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        setStep(s => {
          if (s >= 4) {
            setIsPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  useEffect(() => {
    if (step === 2) {
      if (!withSync) {
        setCounter(Math.random() > 0.5 ? 1 : 2); // Random chaotic result
      } else {
        setCounter(1);
      }
    } else if (step === 4) {
       if (!withSync) {
         setCounter(1); // Incorrect final result
       } else {
         setCounter(2);
       }
    } else if (step === 0) {
      setCounter(0);
    }
  }, [step, withSync]);

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
    setCounter(0);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-mono flex items-center justify-between">
            <span>Synchronization Problem</span>
            <div className="flex gap-2">
              <Button 
                variant={!withSync ? "default" : "outline"} 
                size="sm" 
                onClick={() => { setWithSync(false); handleReset(); }}
                data-testid="btn-without-sync"
              >
                Without Sync
              </Button>
              <Button 
                variant={withSync ? "default" : "outline"} 
                size="sm" 
                onClick={() => { setWithSync(true); handleReset(); }}
                data-testid="btn-with-sync"
              >
                With Sync
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Two threads trying to increment a shared counter simultaneously.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex gap-4 items-center mb-4">
            <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)} data-testid="button-play">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} data-testid="button-reset">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative h-64 border rounded-xl bg-card overflow-hidden flex flex-col items-center justify-center pt-8">
            
            <div className="flex w-full justify-around px-12 mb-12 relative z-10">
              <motion.div 
                animate={{ y: step > 0 && (!withSync || step < 3) ? 10 : 0, scale: step === 1 ? 1.05 : 1 }}
                className="w-32 p-3 bg-primary/10 border-2 border-primary rounded-lg text-center font-mono font-bold"
              >
                Thread A
              </motion.div>
              <motion.div 
                animate={{ y: step > 0 && (!withSync || step >= 3) ? 10 : 0, scale: step === 1 && !withSync ? 1.05 : step === 3 && withSync ? 1.05 : 1 }}
                className={`w-32 p-3 border-2 rounded-lg text-center font-mono font-bold ${withSync && step > 0 && step < 3 ? 'bg-red-500/10 border-red-500 opacity-50' : 'bg-amber-500/10 border-amber-500'}`}
              >
                Thread B
              </motion.div>
            </div>

            {/* Arrows */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                  </marker>
                </defs>
                {/* Arrow A */}
                <motion.path 
                  d="M 30% 120 L 45% 180" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="3" 
                  fill="none" 
                  markerEnd="url(#arrow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: step > 0 && (!withSync || step < 3) ? 1 : 0, opacity: step > 0 && (!withSync || step < 3) ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Arrow B */}
                <motion.path 
                  d="M 70% 120 L 55% 180" 
                  stroke={withSync && step > 0 && step < 3 ? "hsl(var(--destructive))" : "rgb(245 158 11)"} 
                  strokeWidth="3" 
                  fill="none" 
                  markerEnd={withSync && step > 0 && step < 3 ? "" : "url(#arrow)"}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: step > 0 && (!withSync || step >= 3) ? 1 : step > 0 && withSync ? 0.4 : 0, opacity: step > 0 ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              {withSync && step > 0 && step < 3 && (
                <div className="absolute top-[140px] left-[65%] text-destructive font-bold">BLOCKED</div>
              )}
            </div>

            <motion.div 
              animate={{ 
                scale: step === 2 || step === 4 ? 1.1 : 1,
                borderColor: !withSync && step === 4 ? "hsl(var(--destructive))" : "hsl(var(--border))"
              }}
              className="w-48 p-4 bg-muted border-2 rounded-xl text-center relative z-10"
            >
              <div className="text-sm text-muted-foreground mb-1">Shared Counter</div>
              <div className={`text-3xl font-mono font-bold ${!withSync && step === 4 ? 'text-destructive' : ''}`}>
                count = {counter}
              </div>
            </motion.div>

          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <RefreshCw className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">Non-deterministic</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">The outcome depends heavily on the unpredictable timing of thread execution and OS scheduling.</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <ShieldAlert className="w-8 h-8 text-destructive mb-2" />
              <CardTitle className="text-lg">Data Corruption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Concurrent partial writes can leave shared data structures in an invalid or corrupted state.</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <Bug className="w-8 h-8 text-amber-500 mb-2" />
              <CardTitle className="text-lg">Hard to Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">These bugs often only manifest under heavy load and are notoriously difficult to reproduce reliably.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}