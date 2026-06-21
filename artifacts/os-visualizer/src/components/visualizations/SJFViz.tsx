import { useState, useEffect } from "react";
import { Process, sjf, srtf } from "@/lib/scheduling";
import { ProcessInputPanel } from "./ProcessInputPanel";
import { GanttChart } from "./GanttChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function SJFViz() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 1 },
    { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 9, priority: 1 },
    { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 1 },
  ]);
  const [isPreemptive, setIsPreemptive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const resultSJF = sjf(processes);
  const resultSRTF = srtf(processes);
  const result = isPreemptive ? resultSRTF : resultSJF;

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
            <span>SJF / SRTF Simulator</span>
            <div className="flex items-center space-x-2 text-sm font-sans font-normal">
              <Label htmlFor="preemptive-mode" className={isPreemptive ? "text-muted-foreground" : "font-bold text-primary"}>Non-preemptive (SJF)</Label>
              <Switch id="preemptive-mode" checked={isPreemptive} onCheckedChange={(checked) => {
                setIsPreemptive(checked);
                reset();
              }} />
              <Label htmlFor="preemptive-mode" className={isPreemptive ? "font-bold text-primary" : "text-muted-foreground"}>Preemptive (SRTF)</Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessInputPanel processes={processes} onChange={setProcesses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-mono">Simulation: {isPreemptive ? "SRTF" : "SJF"}</CardTitle>
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
          
          <div className="mt-4 mb-6 p-4 rounded-lg bg-muted text-sm flex gap-8">
            <div>
              <span className="text-muted-foreground">SJF Avg Wait:</span> <span className="font-mono font-bold">{resultSJF.avgWaitingTime.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">SRTF Avg Wait:</span> <span className="font-mono font-bold">{resultSRTF.avgWaitingTime.toFixed(2)}</span>
            </div>
            <div className="ml-auto">
              <span className="text-muted-foreground">Current Context Switches:</span> <span className="font-mono font-bold text-primary">{result.contextSwitches}</span>
            </div>
          </div>

          <div className="border rounded-md overflow-hidden bg-card">
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}