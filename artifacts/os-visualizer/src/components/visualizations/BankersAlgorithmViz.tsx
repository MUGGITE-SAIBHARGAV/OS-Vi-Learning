import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type MatrixData = number[][];

export function BankersAlgorithmViz() {
  const [isUnsafe, setIsUnsafe] = useState(false);
  const [step, setStep] = useState(-1);

  // Constants
  const numProcesses = 5;
  
  // Safe Example: P0..P4
  const safeAvailable = [3, 3, 2];
  const alloc = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ];
  const max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ];
  const need = [
    [7, 4, 3],
    [1, 2, 2],
    [6, 0, 0],
    [0, 1, 1],
    [4, 3, 1]
  ];

  // Unsafe scenario available
  const unsafeAvailable = [1, 0, 0];

  // Simulation states
  const simulationSteps = [
    { p: 1, availBefore: [3, 3, 2], availAfter: [5, 3, 2], need: [1, 2, 2] },
    { p: 3, availBefore: [5, 3, 2], availAfter: [7, 4, 3], need: [0, 1, 1] },
    { p: 4, availBefore: [7, 4, 3], availAfter: [7, 4, 5], need: [4, 3, 1] },
    { p: 2, availBefore: [7, 4, 5], availAfter: [10, 4, 7], need: [6, 0, 0] },
    { p: 0, availBefore: [10, 4, 7], availAfter: [10, 5, 7], need: [7, 4, 3] }
  ];

  const currentAvailable = isUnsafe ? unsafeAvailable : (step === -1 ? safeAvailable : (step >= 4 ? simulationSteps[4].availAfter : simulationSteps[step].availAfter));
  
  const handleRun = () => {
    if (isUnsafe) {
      setStep(0); // Immediately fail
    } else {
      setStep(0);
      let s = 0;
      const t = setInterval(() => {
        s++;
        if (s > 4) clearInterval(t);
        setStep(s);
      }, 1500);
    }
  };

  const getProcessRowClass = (idx: number) => {
    if (isUnsafe && step >= 0) return "bg-destructive/10";
    if (!isUnsafe && step >= 0) {
      const stepData = simulationSteps.find((_, i) => i === step);
      if (stepData && stepData.p === idx) return "bg-primary/20 animate-pulse";
      const pastSteps = simulationSteps.filter((_, i) => i < step).map(s => s.p);
      if (pastSteps.includes(idx)) return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 opacity-50";
    }
    return "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Banker's Algorithm — Avoidance</CardTitle>
        <CardDescription>
          Simulate Dijkstra's algorithm to determine if a system is in a safe state.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border">
          <div className="flex items-center space-x-2">
            <Switch id="unsafe-mode" checked={isUnsafe} onCheckedChange={(v) => { setIsUnsafe(v); setStep(-1); }} />
            <Label htmlFor="unsafe-mode" className="cursor-pointer">Force Unsafe State (Available = [1,0,0])</Label>
          </div>
          <Button onClick={handleRun} disabled={step >= 0 && step <= 4}>
            Run Algorithm
          </Button>
          <Button variant="outline" onClick={() => setStep(-1)}>Reset</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="border rounded-lg p-2 bg-card">
            <div className="font-bold text-sm mb-2 text-violet-500">Max</div>
            <div className="font-mono text-xs text-muted-foreground">[A, B, C]</div>
          </div>
          <div className="border rounded-lg p-2 bg-card">
            <div className="font-bold text-sm mb-2 text-amber-500">Allocation</div>
            <div className="font-mono text-xs text-muted-foreground">[A, B, C]</div>
          </div>
          <div className="border rounded-lg p-2 bg-card">
            <div className="font-bold text-sm mb-2 text-rose-500">Need</div>
            <div className="font-mono text-xs text-muted-foreground">Max - Alloc</div>
          </div>
          <div className="border rounded-lg p-2 bg-primary/10 border-primary/50">
            <div className="font-bold text-sm mb-2 text-primary">Available</div>
            <div className="font-mono text-2xl font-bold tracking-widest">{currentAvailable.join(" ")}</div>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm text-center">
            <thead className="bg-muted">
              <tr>
                <th className="p-2">Process</th>
                <th className="p-2 text-violet-500">Max</th>
                <th className="p-2 text-amber-500">Alloc</th>
                <th className="p-2 text-rose-500">Need</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({length: numProcesses}).map((_, i) => (
                <tr key={i} className={`border-t transition-colors ${getProcessRowClass(i)}`}>
                  <td className="p-2 font-bold font-mono">P{i}</td>
                  <td className="p-2 font-mono tracking-widest">{max[i].join(" ")}</td>
                  <td className="p-2 font-mono tracking-widest">{alloc[i].join(" ")}</td>
                  <td className="p-2 font-mono tracking-widest">{need[i].join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-muted p-4 rounded-lg border font-mono min-h-[100px] flex flex-col justify-center">
          {step === -1 && <div className="text-center text-muted-foreground">Click "Run Algorithm" to begin safety check.</div>}
          
          {isUnsafe && step >= 0 && (
            <div className="text-center text-destructive font-bold text-xl">
              UNSAFE STATE
              <div className="text-sm font-normal mt-2">No process's Need can be satisfied with Available [1 0 0]. Deadlock possible!</div>
            </div>
          )}

          {!isUnsafe && step >= 0 && step <= 4 && (
            <div className="text-center space-y-2">
              <div className="text-primary font-bold">Checking P{simulationSteps[step].p}...</div>
              <div>Need [{simulationSteps[step].need.join(" ")}] ≤ Available [{simulationSteps[step].availBefore.join(" ")}] ✓</div>
              <div>P{simulationSteps[step].p} finishes, releases resources. Available becomes [{simulationSteps[step].availAfter.join(" ")}]</div>
            </div>
          )}

          {!isUnsafe && step > 4 && (
            <div className="text-center text-emerald-500 font-bold text-xl">
              SAFE STATE
              <div className="text-sm mt-2 text-emerald-600 dark:text-emerald-400">
                Safe Sequence: P1 → P3 → P4 → P2 → P0
              </div>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
