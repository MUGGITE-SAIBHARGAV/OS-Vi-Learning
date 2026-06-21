import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Server, Play, Pause, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ThreadContextSwitchViz() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { title: "T1 Running", desc: "Thread 1 is executing on the CPU." },
    { title: "Interrupt", desc: "Scheduler decides to switch to Thread 2." },
    { title: "Save T1 Context", desc: "Save T1's PC, SP, and Registers." },
    { title: "Skip Heavy Lifting", desc: "No TLB flush! No page table swap! Address space stays the same." },
    { title: "Load T2 Context", desc: "Load T2's PC, SP, and Registers." },
    { title: "T2 Running", desc: "Thread 2 resumes execution." }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < 5) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 1500);
    } else if (step >= 5) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));
  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };
  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono flex items-center justify-between">
          <span>Thread Context Switch (Lightweight)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={step === 0 || isPlaying}>Prev</Button>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={step === 5 || isPlaying}>Next</Button>
            <Button variant="outline" size="sm" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isPlaying ? "Pause" : "Play All"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>Reset</Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2 font-mono text-muted-foreground items-center">
            <span>Context Switch Overhead</span>
            <span className="flex items-center text-green-500 font-bold">
              <Zap className="w-4 h-4 mr-1" /> 20% (Very Fast)
            </span>
          </div>
          <Progress value={20} className="h-2 bg-muted [&>div]:bg-green-500" />
          <p className="text-xs text-muted-foreground mt-2 text-right">Process switch would be 100%</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 items-center justify-items-center relative h-64">
          
          {/* T1 Box */}
          <div className={`p-4 border rounded-xl flex flex-col items-center w-full max-w-[200px] transition-all duration-300 z-0 bg-card ${step === 2 ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
            <span className="font-mono font-bold text-lg mb-2 text-blue-500">Thread A</span>
            <div className="w-full text-xs font-mono space-y-1 bg-muted/50 p-2 rounded border">
              <div className="flex justify-between"><span>PC:</span> <span className="text-blue-500">0x0400</span></div>
              <div className="flex justify-between"><span>SP:</span> <span className="text-blue-500">0xFF00</span></div>
              <div className="flex justify-between"><span>Regs:</span> <span className="text-blue-500">Saved</span></div>
              <div className="flex justify-between text-muted-foreground line-through opacity-50 mt-2 pt-2 border-t"><span>PageTable</span></div>
            </div>
          </div>

          {/* CPU */}
          <div className={`p-6 border-2 rounded-2xl flex flex-col items-center w-full max-w-[200px] relative transition-all duration-300 z-0 ${
            step === 0 ? 'border-blue-500 bg-blue-500/10' : 
            step === 5 ? 'border-amber-500 bg-amber-500/10' :
            step === 3 ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]' :
            'border-primary bg-primary/5'
          }`}>
            <Cpu className="w-12 h-12 mb-2 text-foreground" />
            <span className="font-mono font-bold text-lg">CPU</span>
            <div className="text-xs font-mono mt-2 text-center h-8">
              {step === 0 && <span className="text-blue-500">Running T1</span>}
              {step === 3 && <span className="text-green-500 font-bold">Skipping TLB Flush!</span>}
              {step === 5 && <span className="text-amber-500">Running T2</span>}
            </div>
          </div>

          {/* T2 Box */}
          <div className={`p-4 border rounded-xl flex flex-col items-center w-full max-w-[200px] transition-all duration-300 z-0 bg-card ${step === 4 ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
            <span className="font-mono font-bold text-lg mb-2 text-amber-500">Thread B</span>
            <div className="w-full text-xs font-mono space-y-1 bg-muted/50 p-2 rounded border">
              <div className="flex justify-between"><span>PC:</span> <span className="text-amber-500">0x0800</span></div>
              <div className="flex justify-between"><span>SP:</span> <span className="text-amber-500">0xEE00</span></div>
              <div className="flex justify-between"><span>Regs:</span> <span className="text-amber-500">Ready</span></div>
              <div className="flex justify-between text-muted-foreground line-through opacity-50 mt-2 pt-2 border-t"><span>PageTable</span></div>
            </div>
          </div>

          {/* Animations */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -90 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
              >
                <div className="bg-background text-foreground text-xs font-mono px-2 py-1 rounded border mb-1">State</div>
                <div className="h-0.5 w-16 bg-primary relative"><div className="absolute -left-1 -top-1 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-primary border-b-4 border-b-transparent"></div></div>
              </motion.div>
            )}
            
            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, x: 90 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
              >
                <div className="bg-background text-foreground text-xs font-mono px-2 py-1 rounded border mb-1">State</div>
                <div className="h-0.5 w-16 bg-primary relative"><div className="absolute -left-1 -top-1 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-primary border-b-4 border-b-transparent"></div></div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className="bg-muted p-4 rounded-lg border flex flex-col justify-center">
          <h3 className="font-mono font-bold text-lg mb-1">Step {step + 1}: {steps[step].title}</h3>
          <p className="text-muted-foreground">{steps[step].desc}</p>
        </div>

      </CardContent>
    </Card>
  );
}