import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

export function RaceConditionViz() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const steps = [
    "Initial State",
    "Thread A reads count (0) into Reg_A",
    "Thread B reads count (0) into Reg_B",
    "Thread A increments Reg_A (0 → 1)",
    "Thread B increments Reg_B (0 → 1)",
    "Thread A writes Reg_A (1) back to count",
    "Thread B writes Reg_B (1) back to count (OVERWRITE!)"
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < 6) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 1500 / speed);
    } else if (step >= 6) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed]);

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const getSharedMemoryValue = () => {
    if (step < 5) return 0;
    return 1;
  };

  const getRegAValue = () => {
    if (step < 1) return "?";
    if (step < 3) return 0;
    return 1;
  };

  const getRegBValue = () => {
    if (step < 2) return "?";
    if (step < 4) return 0;
    return 1;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono flex items-center justify-between">
          <span>Race Condition Step-by-Step</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-normal text-muted-foreground mr-2">Step {step + 1} of 7</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-2 w-2 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          Two threads incrementing a shared counter without synchronization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || isPlaying} data-testid="btn-prev">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setStep(Math.min(6, step + 1))} disabled={step === 6 || isPlaying} data-testid="btn-next">
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

        <div className="relative h-[400px] border rounded-xl bg-card p-6 flex flex-col items-center">
          
          {/* Shared Memory */}
          <motion.div 
            animate={{ 
              scale: step === 5 || step === 6 ? 1.05 : 1,
              borderColor: step === 6 ? "hsl(var(--destructive))" : "hsl(var(--border))",
              backgroundColor: step === 6 ? "hsl(var(--destructive)/0.1)" : "hsl(var(--muted))"
            }}
            className="w-48 p-4 border-2 rounded-xl text-center z-10 mb-12"
          >
            <div className="text-sm text-muted-foreground font-semibold mb-1">Shared Memory</div>
            <div className={`text-3xl font-mono font-bold ${step === 6 ? 'text-destructive' : ''}`}>
              count = {getSharedMemoryValue()}
            </div>
          </motion.div>

          <div className="w-full flex justify-between px-12 relative z-10">
            {/* Thread A */}
            <div className={`w-40 p-4 border-2 rounded-xl bg-card ${step === 1 || step === 3 || step === 5 ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
              <div className="font-bold text-center mb-4 text-primary">Thread A</div>
              <div className="bg-muted p-2 rounded text-center font-mono">
                Reg_A: {getRegAValue()}
              </div>
            </div>

            {/* Thread B */}
            <div className={`w-40 p-4 border-2 rounded-xl bg-card ${step === 2 || step === 4 || step === 6 ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-border'}`}>
              <div className="font-bold text-center mb-4 text-amber-500">Thread B</div>
              <div className="bg-muted p-2 rounded text-center font-mono">
                Reg_B: {getRegBValue()}
              </div>
            </div>
          </div>

          {/* Flow Animations */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div initial={{ y: 0, x: 0, opacity: 1 }} animate={{ y: 100, x: -150, opacity: 0 }} transition={{ duration: 1 }} className="absolute top-24 z-20 font-mono font-bold bg-primary text-primary-foreground px-2 py-1 rounded">0</motion.div>
            )}
            {step === 2 && (
              <motion.div initial={{ y: 0, x: 0, opacity: 1 }} animate={{ y: 100, x: 150, opacity: 0 }} transition={{ duration: 1 }} className="absolute top-24 z-20 font-mono font-bold bg-amber-500 text-white px-2 py-1 rounded">0</motion.div>
            )}
            {step === 5 && (
              <motion.div initial={{ y: 0, x: 0, opacity: 1 }} animate={{ y: -100, x: 150, opacity: 0 }} transition={{ duration: 1 }} className="absolute bottom-32 left-[20%] z-20 font-mono font-bold bg-primary text-primary-foreground px-2 py-1 rounded">1</motion.div>
            )}
            {step === 6 && (
              <motion.div initial={{ y: 0, x: 0, opacity: 1 }} animate={{ y: -100, x: -150, opacity: 0 }} transition={{ duration: 1 }} className="absolute bottom-32 right-[20%] z-20 font-mono font-bold bg-amber-500 text-white px-2 py-1 rounded">1</motion.div>
            )}
          </AnimatePresence>

          {/* SVG Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path d="M 50% 120 L 25% 250" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            <path d="M 50% 120 L 75% 250" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="5,5" fill="none" />
          </svg>

          {/* Result Panel */}
          <AnimatePresence>
            {step === 6 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-4 right-4 bg-destructive/10 border-2 border-destructive rounded-lg p-4 text-center z-30"
              >
                <div className="font-bold text-destructive mb-1">RACE CONDITION OCCURRED!</div>
                <div className="font-mono">Expected count: 2 | Actual count: 1</div>
                <div className="text-sm text-destructive/80 mt-1">Thread B's write overwrote Thread A's update.</div>
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