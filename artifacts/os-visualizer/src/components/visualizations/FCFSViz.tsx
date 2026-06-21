import { useState, useEffect } from "react";
import { Process, fcfs } from "@/lib/scheduling";
import { ProcessInputPanel } from "./ProcessInputPanel";
import { GanttChart } from "./GanttChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, RotateCcw, AlertTriangle } from "lucide-react";

export function FCFSViz() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 24, priority: 1 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 3, priority: 1 },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const result = fcfs(processes);
  const convoyEffectDetected = processes.some(p => result.waitingTime[p.id] > p.burstTime * 2 && p.burstTime > 0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && progress < 1) {
      timer = setTimeout(() => {
        setProgress(p => Math.min(1, p + 0.05 * speed));
      }, 100);
    } else if (progress >= 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, progress, speed]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">FCFS Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessInputPanel processes={processes} onChange={setProcesses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-mono">Simulation</CardTitle>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={togglePlay}>
              {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-1" /> Reset
            </Button>
            <div className="flex items-center gap-2 w-32">
              <span className="text-xs text-muted-foreground w-8">{speed.toFixed(1)}x</span>
              <Slider value={[speed]} min={0.5} max={3} step={0.5} onValueChange={([v]) => setSpeed(v)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <GanttChart gantt={result.gantt} processes={processes} animationProgress={progress} />
          
          {convoyEffectDetected && (
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-500 text-sm">Convoy Effect Detected</h4>
                <p className="text-xs text-amber-600/90 dark:text-amber-400/90">
                  Notice how shorter processes are waiting a long time behind a larger process.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 border rounded-md overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PID</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Burst</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Turnaround</TableHead>
                  <TableHead>Waiting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium font-mono">{p.id}</TableCell>
                    <TableCell>{p.arrivalTime}</TableCell>
                    <TableCell>{p.burstTime}</TableCell>
                    <TableCell>{result.completionTime[p.id]}</TableCell>
                    <TableCell>{result.turnaroundTime[p.id]}</TableCell>
                    <TableCell>{result.waitingTime[p.id]}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={4}>Averages</TableCell>
                  <TableCell>{result.avgTurnaroundTime.toFixed(2)}</TableCell>
                  <TableCell>{result.avgWaitingTime.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}