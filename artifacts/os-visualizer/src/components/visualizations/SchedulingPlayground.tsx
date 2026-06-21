import { useState } from "react";
import { Process, fcfs, sjf, srtf, priorityScheduling, roundRobin } from "@/lib/scheduling";
import { ProcessInputPanel } from "./ProcessInputPanel";
import { GanttChart } from "./GanttChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export function SchedulingPlayground() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 4 },
    { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 3 },
  ]);
  const [quantum, setQuantum] = useState(2);

  const results = {
    "FCFS": fcfs(processes),
    "SJF": sjf(processes),
    "SRTF": srtf(processes),
    "Priority (Non-Pre)": priorityScheduling(processes, false),
    "Priority (Pre)": priorityScheduling(processes, true),
    "Round Robin": roundRobin(processes, quantum),
  };

  const algos = Object.keys(results);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">Scheduling Playground</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Label>RR Quantum:</Label>
            <Input 
              type="number" min={1} value={quantum} 
              onChange={(e) => setQuantum(Math.max(1, parseInt(e.target.value) || 1))} 
              className="w-16 h-8 font-mono" 
            />
          </div>
          <ProcessInputPanel processes={processes} onChange={setProcesses} showPriority />
        </CardContent>
      </Card>

      <Tabs defaultValue="Compare All" className="w-full">
        <TabsList className="grid w-full h-auto grid-cols-2 md:grid-cols-7 bg-muted/50 p-1 mb-4">
          <TabsTrigger value="Compare All" className="font-mono text-xs col-span-2 md:col-span-1">Compare</TabsTrigger>
          {algos.map(a => <TabsTrigger key={a} value={a} className="font-mono text-xs">{a}</TabsTrigger>)}
        </TabsList>

        <TabsContent value="Compare All">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">Comparison Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border rounded-md mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Avg Wait</TableHead>
                      <TableHead>Avg Turnaround</TableHead>
                      <TableHead>Context Switches</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {algos.map(a => (
                      <TableRow key={a}>
                        <TableCell className="font-medium font-mono">{a}</TableCell>
                        <TableCell>{results[a as keyof typeof results].avgWaitingTime.toFixed(2)}</TableCell>
                        <TableCell>{results[a as keyof typeof results].avgTurnaroundTime.toFixed(2)}</TableCell>
                        <TableCell>{results[a as keyof typeof results].contextSwitches}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <h4 className="font-mono font-bold mb-4">Average Waiting Time Chart</h4>
              <div className="flex flex-col gap-3">
                {algos.map(a => {
                  const maxWait = Math.max(...algos.map(x => results[x as keyof typeof results].avgWaitingTime));
                  const wait = results[a as keyof typeof results].avgWaitingTime;
                  const width = maxWait > 0 ? (wait / maxWait) * 100 : 0;
                  return (
                    <div key={a} className="flex items-center gap-4">
                      <div className="w-32 text-sm font-mono text-right">{a}</div>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-primary"
                        />
                      </div>
                      <div className="w-12 text-sm font-mono">{wait.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {algos.map(a => (
          <TabsContent key={a} value={a}>
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">{a}</CardTitle>
              </CardHeader>
              <CardContent>
                <GanttChart gantt={results[a as keyof typeof results].gantt} processes={processes} animationProgress={1} />
                <div className="flex gap-8 mt-6 p-4 bg-muted rounded-lg font-mono text-sm">
                  <div>Avg Wait: {results[a as keyof typeof results].avgWaitingTime.toFixed(2)}</div>
                  <div>Avg Turnaround: {results[a as keyof typeof results].avgTurnaroundTime.toFixed(2)}</div>
                  <div>Context Switches: {results[a as keyof typeof results].contextSwitches}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}