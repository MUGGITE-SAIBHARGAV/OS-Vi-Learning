import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, ShieldAlert, ShieldCheck } from "lucide-react";
import { calculateUnsyncedResult } from "@/lib/sync";

export function SyncPlaygroundViz() {
  const [threads, setThreads] = useState(3);
  const [ops, setOps] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [unsyncedRes, setUnsyncedRes] = useState(0);
  
  const expected = threads * ops;

  const runSimulation = () => {
    setIsRunning(true);
    setHasRun(false);
    
    // Simulate processing time
    setTimeout(() => {
      setUnsyncedRes(calculateUnsyncedResult(threads, ops));
      setIsRunning(false);
      setHasRun(true);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Synchronization Playground</CardTitle>
        <CardDescription>Compare execution with and without synchronization.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Controls */}
        <div className="flex flex-wrap gap-8 items-end bg-muted/50 p-4 rounded-xl border">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-semibold flex justify-between">
              <span>Threads</span>
              <span className="font-mono text-primary">{threads}</span>
            </label>
            <Slider value={[threads]} min={2} max={5} step={1} onValueChange={([v]) => setThreads(v)} disabled={isRunning} />
          </div>
          <div className="space-y-2 flex-1 min-w-[200px]">
            <label className="text-sm font-semibold flex justify-between">
              <span>Operations per Thread</span>
              <span className="font-mono text-primary">{ops}</span>
            </label>
            <Slider value={[ops]} min={1} max={5} step={1} onValueChange={([v]) => setOps(v)} disabled={isRunning} />
          </div>
          <div className="w-full md:w-auto">
            <Button onClick={runSimulation} disabled={isRunning} className="w-full" data-testid="btn-run-sim">
              {isRunning ? <RotateCcw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? "Simulating..." : "Run Simulation"}
            </Button>
          </div>
        </div>

        {/* Results Split Screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Unsynchronized */}
          <div className="border-2 border-destructive/20 rounded-xl p-6 relative overflow-hidden bg-card">
            <div className="absolute top-0 right-0 p-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> Without Sync
              </Badge>
            </div>
            <h3 className="font-bold mb-4">Race Condition Present</h3>
            
            <div className="h-32 flex items-center justify-center mb-4 relative">
              {isRunning ? (
                <div className="flex gap-1 items-end h-16">
                  {Array.from({length: threads}).map((_, i) => (
                    <div key={i} className="w-4 bg-destructive animate-pulse" style={{ height: `${Math.max(20, Math.random() * 100)}%`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              ) : hasRun ? (
                <div className="text-center">
                  <div className="text-5xl font-mono font-bold text-destructive mb-2">{unsyncedRes}</div>
                  <div className="text-sm text-muted-foreground line-through">Expected: {expected}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Click Run Simulation</div>
              )}
            </div>

            {/* Timeline abstract */}
            <div className="mt-auto border-t pt-4">
              <div className="text-xs font-mono text-muted-foreground mb-2">Execution Timeline (Overlapping)</div>
              <div className="h-16 relative w-full bg-slate-50 dark:bg-slate-900 rounded">
                {hasRun && Array.from({length: threads}).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute h-3 bg-destructive/60 rounded border border-destructive"
                    style={{
                      top: `${10 + (i * 20)}%`,
                      left: `${5 + Math.random() * 20}%`,
                      width: `${40 + Math.random() * 30}%`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Synchronized */}
          <div className="border-2 border-green-500/20 rounded-xl p-6 relative overflow-hidden bg-card">
            <div className="absolute top-0 right-0 p-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> With Sync
              </Badge>
            </div>
            <h3 className="font-bold mb-4 text-green-600 dark:text-green-500">Mutually Exclusive</h3>
            
            <div className="h-32 flex items-center justify-center mb-4 relative">
              {isRunning ? (
                <div className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                </div>
              ) : hasRun ? (
                <div className="text-center">
                  <div className="text-5xl font-mono font-bold text-green-500 mb-2">{expected}</div>
                  <div className="text-sm text-muted-foreground">Expected: {expected}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">Click Run Simulation</div>
              )}
            </div>

            {/* Timeline abstract */}
            <div className="mt-auto border-t pt-4">
              <div className="text-xs font-mono text-muted-foreground mb-2">Execution Timeline (Sequential)</div>
              <div className="h-16 relative w-full bg-slate-50 dark:bg-slate-900 rounded flex items-center px-2 gap-1">
                {hasRun && Array.from({length: threads}).map((_, i) => (
                  <div 
                    key={i} 
                    className="h-3 bg-green-500/60 rounded border border-green-500 flex-1"
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}