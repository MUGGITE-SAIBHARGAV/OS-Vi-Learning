import { useState, useEffect } from "react";
import { Process, roundRobin } from "@/lib/scheduling";
import { ProcessInputPanel } from "./ProcessInputPanel";
import { GanttChart } from "./GanttChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RoundRobinViz() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 24, priority: 1 },
    { id: 'P2', arrivalTime: 0, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 0, burstTime: 3, priority: 1 },
  ]);
  const [quantum, setQuantum] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const result = roundRobin(processes, quantum);

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
            <span>Round Robin Simulator</span>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Time Quantum:</Label>
              <Input 
                type="number" 
                min={1} 
                max={20} 
                value={quantum} 
                onChange={(e) => { setQuantum(Math.max(1, parseInt(e.target.value) || 1)); reset(); }}
                className="w-16 h-8 font-mono" 
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessInputPanel processes={processes} onChange={setProcesses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="font-mono">Simulation (Q={quantum})</CardTitle>
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
          
          <div className="mt-4 mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
            <h3 className="font-bold text-primary font-mono text-xl mb-1">{result.contextSwitches}</h3>
            <p className="text-sm text-primary/80">Context Switches</p>
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