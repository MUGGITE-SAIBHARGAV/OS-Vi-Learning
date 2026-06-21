import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Frown, Smile } from "lucide-react";

export function SingleVsMultiThreadViz() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      timer = setTimeout(() => {
        setProgress((p) => Math.min(p + 1, 100));
      }, 50 / speed);
    } else if (progress >= 100) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, progress, speed]);

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const isFrozen = progress > 0 && progress < 75;
  const isMultiFinished = progress >= 60;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Single vs Multi-Threaded Execution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center">
          <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 flex-1 max-w-[200px] ml-auto">
            <span className="text-sm font-mono">{speed}x</span>
            <Slider value={[speed]} min={0.5} max={2} step={0.5} onValueChange={([val]) => setSpeed(val)} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Single Thread */}
          <div className="border rounded-xl p-4 bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono font-bold">Single-Threaded App</h3>
              {isFrozen ? (
                <div className="flex items-center text-rose-500 font-mono text-xs bg-rose-500/10 px-2 py-1 rounded">
                  <Frown className="w-4 h-4 mr-1" /> UI FROZEN
                </div>
              ) : (
                <div className="flex items-center text-green-500 font-mono text-xs bg-green-500/10 px-2 py-1 rounded">
                  <Smile className="w-4 h-4 mr-1" /> Responsive
                </div>
              )}
            </div>

            <div className="space-y-2 h-64 relative">
              <TaskBlock color="bg-blue-500" label="Download Data" start={0} end={30} current={progress} />
              <TaskBlock color="bg-amber-500" label="Parse HTML" start={30} end={50} current={progress} />
              <TaskBlock color="bg-violet-500" label="Execute JS" start={50} end={75} current={progress} />
              <TaskBlock color="bg-green-500" label="Render UI" start={75} end={100} current={progress} />
            </div>
            
            <div className="text-center font-mono text-xs text-muted-foreground mt-4">
              Total Time: 100 units
            </div>
          </div>

          {/* Multi Thread */}
          <div className="border rounded-xl p-4 bg-primary/5 border-primary/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-mono font-bold text-primary">Multi-Threaded App</h3>
              {progress > 0 && !isMultiFinished ? (
                <div className="flex items-center text-green-500 font-mono text-xs bg-green-500/10 px-2 py-1 rounded">
                  <Smile className="w-4 h-4 mr-1" /> Responsive
                </div>
              ) : isMultiFinished ? (
                <div className="flex items-center text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Done
                </div>
              ) : null}
            </div>

            <div className="flex h-64 gap-2 relative">
              <div className="flex-1 space-y-2 relative border-r pr-2">
                <div className="text-xs font-mono text-center text-muted-foreground mb-2">Network Thread</div>
                <TaskBlock color="bg-blue-500" label="Download" start={0} end={30} current={progress} />
              </div>
              <div className="flex-1 space-y-2 relative border-r px-2">
                <div className="text-xs font-mono text-center text-muted-foreground mb-2">Compute Thread</div>
                <TaskBlock color="bg-amber-500" label="Parse" start={20} end={40} current={progress} />
                <TaskBlock color="bg-violet-500" label="Execute JS" start={30} end={60} current={progress} />
              </div>
              <div className="flex-1 space-y-2 relative pl-2">
                <div className="text-xs font-mono text-center text-muted-foreground mb-2">UI Thread</div>
                <TaskBlock color="bg-green-500" label="Render UI" start={10} end={50} current={progress} />
              </div>
            </div>
            
            <div className="text-center font-mono text-xs text-primary mt-4">
              Total Time: 60 units (40% Faster!)
            </div>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground bg-muted p-4 rounded-lg font-mono">
          Single-threaded apps must complete each task before starting the next. Multi-threaded apps can overlap I/O, computation, and UI work — the user never waits.
        </p>
      </CardContent>
    </Card>
  );
}

function TaskBlock({ color, label, start, end, current }: { color: string, label: string, start: number, end: number, current: number }) {
  const duration = end - start;
  let filled = 0;
  if (current > start) {
    filled = Math.min((current - start) / duration * 100, 100);
  }

  return (
    <div className="h-10 w-full bg-muted rounded overflow-hidden relative border">
      <div 
        className={`absolute top-0 left-0 h-full ${color} transition-all duration-75`}
        style={{ width: `${filled}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold mix-blend-difference text-white z-10">
        {label}
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}