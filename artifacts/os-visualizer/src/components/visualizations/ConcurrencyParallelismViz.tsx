import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Cpu } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ConcurrencyParallelismViz() {
  const [cores, setCores] = useState<1 | 2 | 4>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && tick < 100) {
      timer = setTimeout(() => {
        setTick((t) => Math.min(t + 1, 100));
      }, 50);
    } else if (tick >= 100) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, tick]);

  const handleReset = () => {
    setTick(0);
    setIsPlaying(false);
  };

  const handleCoreChange = (val: string) => {
    setCores(parseInt(val) as 1 | 2 | 4);
    handleReset();
  };

  // Logic for progress
  let progressA = 0;
  let progressB = 0;
  
  // Logic for CPU active colors
  let activeColors: string[] = Array(cores).fill("text-slate-300");

  if (cores === 1) {
    // Interleaved
    progressA = Math.min((tick / 2), 50);
    progressB = Math.max(0, Math.min((tick / 2) - 0, 50));
    // Alternate every 10 ticks
    if (tick > 0 && tick < 100) {
      if (Math.floor(tick / 10) % 2 === 0) {
         progressA = Math.min((tick / 2) * 2, 100);
         activeColors[0] = "text-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]";
      } else {
         progressB = Math.min((tick / 2) * 2, 100);
         activeColors[0] = "text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
      }
      // calculate actual interleaved progress
      progressA = Math.min(100, Math.floor((tick+10)/20) * 20);
      progressB = Math.min(100, Math.floor(tick/20) * 20);
      
      if(tick >= 100){
        progressA = 100;
        progressB = 100;
      }
    }
  } else if (cores === 2) {
    // Simultaneous
    progressA = Math.min(tick, 100);
    progressB = Math.min(tick, 100);
    if (tick > 0 && tick < 100) {
      activeColors[0] = "text-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]";
      activeColors[1] = "text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    }
  } else {
    // 4 cores
    progressA = Math.min(tick, 100);
    progressB = Math.min(tick, 100);
    if (tick > 0 && tick < 100) {
      activeColors[0] = "text-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]";
      activeColors[1] = "text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
      // 2 and 3 remain idle
    }
  }

  const descriptions = {
    1: "Concurrency: Tasks interleave on a single core. Total time = sum of all task times.",
    2: "Parallelism: Tasks run simultaneously on separate cores. Total time = longest task time.",
    4: "More cores than tasks. Extra cores idle. True parallelism achieved."
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-mono">Concurrency vs Parallelism</CardTitle>
          <Tabs value={cores.toString()} onValueChange={handleCoreChange}>
            <TabsList>
              <TabsTrigger value="1" className="font-mono">1 Core</TabsTrigger>
              <TabsTrigger value="2" className="font-mono">2 Cores</TabsTrigger>
              <TabsTrigger value="4" className="font-mono">4 Cores</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="flex justify-center gap-4 min-h-[120px]">
          {Array.from({ length: cores }).map((_, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all duration-100 ${activeColors[i] ? activeColors[i] : ''} ${tick > 0 && tick < 100 && activeColors[i] !== "text-slate-300" ? 'border-current' : 'border-border bg-card text-muted-foreground'}`}>
              <Cpu className="w-12 h-12 mb-2" />
              <span className="font-mono font-bold">Core {i + 1}</span>
              {tick > 0 && tick < 100 && activeColors[i] === "text-slate-300" && (
                <span className="text-xs font-mono mt-1">IDLE</span>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between font-mono text-sm mb-1">
              <span className="text-violet-500 font-bold">Task A</span>
              <span>{Math.floor(progressA)}%</span>
            </div>
            <div className="h-4 w-full bg-muted rounded overflow-hidden">
              <div className="h-full bg-violet-500 transition-all duration-75" style={{ width: `${progressA}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between font-mono text-sm mb-1">
              <span className="text-amber-500 font-bold">Task B</span>
              <span>{Math.floor(progressB)}%</span>
            </div>
            <div className="h-4 w-full bg-muted rounded overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-75" style={{ width: `${progressB}%` }} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg border">
          <p className="font-mono text-sm text-foreground/80">
            {descriptions[cores]}
          </p>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}