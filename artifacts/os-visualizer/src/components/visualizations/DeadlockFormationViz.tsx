import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

export function DeadlockFormationViz() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = [
    "System starts. P1 and P2 are ready. R1 and R2 are free.",
    "P1 acquires R1. (Assignment edge R1→P1)",
    "P2 acquires R2. (Assignment edge R2→P2)",
    "P1 requests R2, but it's held by P2. P1 waits.",
    "P2 requests R1, but it's held by P1. P2 waits.",
    "DEADLOCK! Circular wait detected."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < 5) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 2000 / speed);
    } else if (step >= 5) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed]);

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono flex items-center justify-between">
          <span>Deadlock Formation Step by Step</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground mr-2">Step {step + 1} of 6</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-2 w-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          Watch how circular wait forms dynamically over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || isPlaying} data-testid="btn-prev">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setStep(Math.min(5, step + 1))} disabled={step === 5 || isPlaying} data-testid="btn-next">
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)} data-testid="btn-play">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} data-testid="btn-reset">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-48">
            <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
            <Slider value={[speed]} min={0.5} max={2} step={0.5} onValueChange={([v]) => setSpeed(v)} />
          </div>
        </div>

        <div className="relative h-[400px] border-4 rounded-xl bg-card overflow-hidden flex items-center justify-center transition-colors duration-500" style={{ borderColor: step === 5 ? "hsl(var(--destructive))" : "hsl(var(--border))" }}>
          
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <marker id="df-req" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
              <marker id="df-req-red" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--destructive))" />
              </marker>
              <marker id="df-assign" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--emerald-500))" />
              </marker>
              <marker id="df-assign-red" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--destructive))" />
              </marker>
            </defs>

            {/* Step 1: R1 -> P1 */}
            {step >= 1 && (
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="250" y1="200" x2="150" y2="100" stroke={step === 5 ? "hsl(var(--destructive))" : "hsl(var(--emerald-500))"} strokeWidth="3" markerEnd={step === 5 ? "url(#df-assign-red)" : "url(#df-assign)"} />
            )}
            
            {/* Step 2: R2 -> P2 */}
            {step >= 2 && (
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="350" y1="200" x2="450" y2="100" stroke={step === 5 ? "hsl(var(--destructive))" : "hsl(var(--emerald-500))"} strokeWidth="3" markerEnd={step === 5 ? "url(#df-assign-red)" : "url(#df-assign)"} />
            )}

            {/* Step 3: P1 -> R2 */}
            {step >= 3 && (
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="150" y1="100" x2="350" y2="200" stroke={step === 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} strokeWidth="3" strokeDasharray="6 6" markerEnd={step === 5 ? "url(#df-req-red)" : "url(#df-req)"} />
            )}

            {/* Step 4: P2 -> R1 */}
            {step >= 4 && (
              <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} x1="450" y1="100" x2="250" y2="200" stroke={step === 5 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} strokeWidth="3" strokeDasharray="6 6" markerEnd={step === 5 ? "url(#df-req-red)" : "url(#df-req)"} />
            )}
            
            {/* Cycle indicator */}
            {step === 5 && (
              <motion.path 
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 1, pathLength: 1 }}
                transition={{ duration: 1 }}
                d="M 150 100 Q 300 0 450 100 Q 550 200 450 300 Q 300 400 150 300 Q 50 200 150 100"
                fill="none"
                stroke="hsl(var(--destructive)/0.2)"
                strokeWidth="20"
              />
            )}
          </svg>

          {/* HTML Nodes overlay */}
          <div className="absolute inset-0 pointer-events-none">
            
            <motion.div 
              animate={{ boxShadow: step === 5 ? "0 0 0 8px hsl(var(--destructive)/0.3)" : "none" }}
              className={`absolute top-[80px] left-[130px] w-10 h-10 rounded-full border-4 bg-card flex items-center justify-center font-bold z-10 ${step === 5 ? 'border-destructive text-destructive' : 'border-violet-500 text-violet-500'}`}
            >
              P1
              {step >= 3 && step < 5 && <div className="absolute -top-6 text-xs text-primary font-mono animate-pulse">waiting</div>}
            </motion.div>

            <motion.div 
              animate={{ boxShadow: step === 5 ? "0 0 0 8px hsl(var(--destructive)/0.3)" : "none" }}
              className={`absolute top-[80px] left-[430px] w-10 h-10 rounded-full border-4 bg-card flex items-center justify-center font-bold z-10 ${step === 5 ? 'border-destructive text-destructive' : 'border-violet-500 text-violet-500'}`}
            >
              P2
              {step >= 4 && step < 5 && <div className="absolute -top-6 text-xs text-primary font-mono animate-pulse">waiting</div>}
            </motion.div>

            <div className={`absolute top-[180px] left-[230px] w-10 h-10 border-4 bg-card rounded flex items-center justify-center font-bold z-10 ${step >= 1 ? 'border-violet-500 text-violet-500' : 'border-muted-foreground text-muted-foreground'}`}>
              R1
            </div>

            <div className={`absolute top-[180px] left-[430px] w-10 h-10 border-4 bg-card rounded flex items-center justify-center font-bold z-10 ${step >= 2 ? 'border-amber-500 text-amber-500' : 'border-muted-foreground text-muted-foreground'}`}>
              R2
            </div>

          </div>

          <AnimatePresence>
            {step === 5 && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute z-30 font-black text-2xl bg-destructive text-destructive-foreground px-6 py-3 rounded-xl shadow-2xl"
              >
                DEADLOCK DETECTED
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className="bg-muted p-4 rounded-lg border text-center font-mono">
          {steps[step]}
        </div>

      </CardContent>
    </Card>
  );
}
