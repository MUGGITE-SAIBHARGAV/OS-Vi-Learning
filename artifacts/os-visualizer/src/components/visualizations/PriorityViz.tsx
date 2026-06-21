import { useState, useEffect } from "react";
import { Process, priorityScheduling } from "@/lib/scheduling";
import { ProcessInputPanel } from "./ProcessInputPanel";
import { GanttChart } from "./GanttChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, RotateCcw, AlertOctagon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function PriorityViz() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 10, priority: 3 },
    { id: 'P2', arrivalTime: 0, burstTime: 1, priority: 1 },
    { id: 'P3', arrivalTime: 0, burstTime: 2, priority: 4 },
    { id: 'P4', arrivalTime: 0, burstTime: 1, priority: 5 },
    { id: 'P5', arrivalTime: 0, burstTime: 5, priority: 2 },
  ]);
  const [isPreemptive, setIsPreemptive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const result = priorityScheduling(processes, isPreemptive);
  const starvationDetected = processes.some(p => result.waitingTime[p.id] > 15);

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
          <CardTitle className="font-mono flex justify-between items-center">
            <span>Priority Simulator</span>
            <div className="flex items-center space-x-2 text-sm font-sans font-normal">
              <Label htmlFor="preemptive-mode" className={isPreemptive ? "text-muted-foreground" : "font-bold text-primary"}>Non-preemptive</Label>
              <Switch id="preemptive-mode" checked={isPreemptive} onCheckedChange={(c) => { setIsPreemptive(c); reset(); }} />
              <Label htmlFor="preemptive-mode" className={isPreemptive ? "font-bold text-primary" : "text-muted-foreground"}>Preemptive</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">Note: Lower number = higher priority.</div>
          <ProcessInputPanel processes={processes} onChange={setProcesses} showPriority />
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
          
          {starvationDetected && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-red-500 text-sm">Starvation Risk</h4>
                <p className="text-xs text-red-600/90 dark:text-red-400/90">
                  Some low-priority processes are waiting an unusually long time. In a real OS, 'aging' would gradually increase their priority.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 border rounded-md overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PID</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Burst</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Waiting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processes.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium font-mono">{p.id}</TableCell>
                    <TableCell className="font-bold">{p.priority}</TableCell>
                    <TableCell>{p.arrivalTime}</TableCell>
                    <TableCell>{p.burstTime}</TableCell>
                    <TableCell>{result.completionTime[p.id]}</TableCell>
                    <TableCell className={result.waitingTime[p.id] > 15 ? "text-red-500 font-bold" : ""}>
                      {result.waitingTime[p.id]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}