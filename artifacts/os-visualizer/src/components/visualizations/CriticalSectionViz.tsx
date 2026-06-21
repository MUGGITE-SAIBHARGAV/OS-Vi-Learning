import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Lock, Unlock } from "lucide-react";

export function CriticalSectionViz() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState(0); // 0: A enters, 1: B tries (blocks), 2: A exits/B enters, 3: B exits

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        setPhase(p => (p + 1) % 4);
      }, 2000 / speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, phase, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    setPhase(0);
  };

  const aInCS = phase === 0 || phase === 1;
  const bInCS = phase === 2;
  const isLocked = aInCS || bInCS;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Critical Section & Mutual Exclusion</CardTitle>
        <CardDescription>
          Hardware/Software locks protecting a shared resource.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-48">
            <span className="text-sm text-muted-foreground">{speed.toFixed(1)}x</span>
            <Slider value={[speed]} min={0.5} max={2} step={0.5} onValueChange={([v]) => setSpeed(v)} />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_200px_1fr] gap-4 h-[400px]">
          
          {/* Thread A Lane */}
          <div className="border rounded-lg bg-card overflow-hidden flex flex-col relative">
            <div className="bg-primary/20 text-primary text-center font-bold p-2 border-b">Thread A</div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 border-b flex items-center justify-center text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900">Remainder Section</div>
              <div className={`h-16 flex items-center justify-center text-sm font-bold transition-colors ${phase === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : 'bg-transparent'}`}>Entry Section</div>
              <div className={`flex-1 border-y-2 border-dashed border-primary/50 flex items-center justify-center transition-colors ${aInCS ? 'bg-primary/10' : 'bg-transparent'}`}>
                {aInCS && <motion.div layoutId="tokenA" className="w-8 h-8 rounded-full bg-primary shadow-lg" />}
              </div>
              <div className="h-16 flex items-center justify-center text-sm font-bold bg-transparent">Exit Section</div>
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900">Remainder Section</div>
            </div>
            {!aInCS && phase !== 1 && <motion.div layoutId="tokenA" className="w-8 h-8 rounded-full bg-primary absolute top-12 left-1/2 -translate-x-1/2 opacity-50" />}
          </div>

          {/* Central Gate */}
          <div className="flex flex-col items-center justify-center relative">
            <div className={`w-full p-4 rounded-xl border-4 flex flex-col items-center justify-center transition-colors duration-500 bg-card ${isLocked ? 'border-destructive text-destructive' : 'border-green-500 text-green-500'}`}>
              {isLocked ? <Lock className="w-12 h-12 mb-2" /> : <Unlock className="w-12 h-12 mb-2" />}
              <span className="font-mono font-bold text-center">CRITICAL<br/>SECTION</span>
            </div>
            
            {/* Status indicators */}
            <div className="absolute top-1/4 w-full text-center">
              <div className={`text-xs font-bold px-2 py-1 rounded inline-block ${isLocked ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'}`}>
                {isLocked ? 'LOCKED' : 'AVAILABLE'}
              </div>
            </div>
          </div>

          {/* Thread B Lane */}
          <div className="border rounded-lg bg-card overflow-hidden flex flex-col relative">
            <div className="bg-amber-500/20 text-amber-600 dark:text-amber-500 text-center font-bold p-2 border-b">Thread B</div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 border-b flex items-center justify-center text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900">Remainder Section</div>
              <div className={`h-16 flex items-center justify-center text-sm font-bold transition-colors ${phase === 1 || phase === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500' : 'bg-transparent'}`}>Entry Section</div>
              <div className={`flex-1 border-y-2 border-dashed border-amber-500/50 flex items-center justify-center transition-colors ${bInCS ? 'bg-amber-500/10' : 'bg-transparent'}`}>
                {bInCS && <motion.div layoutId="tokenB" className="w-8 h-8 rounded-full bg-amber-500 shadow-lg" />}
              </div>
              <div className="h-16 flex items-center justify-center text-sm font-bold bg-transparent">Exit Section</div>
              <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground bg-slate-50 dark:bg-slate-900">Remainder Section</div>
            </div>
            {!bInCS && <motion.div layoutId="tokenB" className={`w-8 h-8 rounded-full bg-amber-500 absolute left-1/2 -translate-x-1/2 ${phase === 1 ? 'top-[35%] z-10' : 'top-12 opacity-50'}`} />}
            {phase === 1 && (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute top-[35%] right-full mr-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                BLOCKED!
              </motion.div>
            )}
          </div>

        </div>

        <div className="bg-muted p-4 rounded-lg border text-center font-mono">
          {phase === 0 && "Thread A acquires lock and enters Critical Section."}
          {phase === 1 && "Thread B tries to enter but lock is held by A. B is BLOCKED."}
          {phase === 2 && "Thread A exits and releases lock. Thread B acquires lock and enters."}
          {phase === 3 && "Thread B exits and releases lock. CS is available."}
        </div>
      </CardContent>
    </Card>
  );
}