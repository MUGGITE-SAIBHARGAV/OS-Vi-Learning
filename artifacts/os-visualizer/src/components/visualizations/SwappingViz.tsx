import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, HardDrive, ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Process {
  id: number;
  name: string;
  size: number;
  color: string;
  location: "ram" | "disk";
  state: "running" | "ready" | "suspended";
}

const INITIAL: Process[] = [
  { id: 1, name: "Process A", size: 120, color: "bg-blue-500",   location: "ram",  state: "running" },
  { id: 2, name: "Process B", size: 80,  color: "bg-green-500",  location: "ram",  state: "ready" },
  { id: 3, name: "Process C", size: 150, color: "bg-purple-500", location: "disk", state: "suspended" },
  { id: 4, name: "Process D", size: 60,  color: "bg-orange-500", location: "disk", state: "suspended" },
];

const TOTAL_RAM = 400;
const OS_SIZE = 60;

const STATE_CONFIG = {
  running:   { label: "Running",   color: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30" },
  ready:     { label: "Ready",     color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  suspended: { label: "Suspended", color: "bg-slate-500/20 text-muted-foreground border-slate-500/30" },
};

export function SwappingViz() {
  const [processes, setProcesses] = useState<Process[]>(INITIAL);
  const [swapping, setSwapping] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>(["System initialized. P-A and P-B in RAM. P-C and P-D swapped to disk."]);

  const ramProcesses = processes.filter(p => p.location === "ram");
  const diskProcesses = processes.filter(p => p.location === "disk");
  const usedRAM = ramProcesses.reduce((s, p) => s + p.size, 0) + OS_SIZE;
  const freeRAM = TOTAL_RAM - usedRAM;

  const swapOut = async (p: Process) => {
    if (swapping !== null) return;
    setSwapping(p.id);
    setLog(prev => [...prev, `Swap OUT: ${p.name} (${p.size} KB) → Disk`]);
    await new Promise(r => setTimeout(r, 800));
    setProcesses(prev => prev.map(x =>
      x.id === p.id ? { ...x, location: "disk", state: "suspended" } : x
    ));
    setSwapping(null);
    setLog(prev => [...prev, `✓ ${p.name} swapped to disk. ${p.size} KB freed in RAM.`]);
  };

  const swapIn = async (p: Process) => {
    if (swapping !== null) return;
    if (p.size > freeRAM) {
      setLog(prev => [...prev, `✗ Cannot swap in ${p.name} — not enough RAM (need ${p.size} KB, have ${freeRAM} KB)`]);
      return;
    }
    setSwapping(p.id);
    setLog(prev => [...prev, `Swap IN: ${p.name} (${p.size} KB) ← Disk`]);
    await new Promise(r => setTimeout(r, 800));
    setProcesses(prev => prev.map(x =>
      x.id === p.id ? { ...x, location: "ram", state: "ready" } : x
    ));
    setSwapping(null);
    setLog(prev => [...prev, `✓ ${p.name} loaded into RAM.`]);
  };

  const reset = () => { setProcesses(INITIAL); setLog(["System reset."]); setSwapping(null); };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Swapping Simulator</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Move processes between RAM and Disk. Click Swap Out to evict from RAM, Swap In to load back.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* RAM */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-primary" />
            <span className="font-mono font-bold text-sm">RAM ({TOTAL_RAM} MB)</span>
            <span className={`ml-auto text-xs font-mono ${freeRAM < 60 ? "text-red-500" : "text-green-500"}`}>
              {freeRAM} MB free
            </span>
          </div>
          <div className="rounded-xl border-2 border-primary overflow-hidden">
            <div className="bg-slate-500 text-white text-xs font-mono text-center py-2">
              OS Kernel ({OS_SIZE} MB)
            </div>
            <div className="min-h-[160px] bg-background p-2 space-y-2">
              <AnimatePresence>
                {ramProcesses.map(p => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className={`${p.color} text-white rounded-lg px-3 py-2 flex items-center justify-between text-sm font-mono`}
                  >
                    <div>
                      <div className="font-bold">{p.name}</div>
                      <div className="text-xs text-white/70">{p.size} MB · {p.state}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => swapOut(p)}
                      disabled={swapping !== null || p.state === "running"}
                      className="text-xs font-mono h-7"
                    >
                      <ArrowDown className="w-3 h-3 mr-1" />
                      Swap Out
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {freeRAM > 0 && (
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg py-4 text-center text-xs font-mono text-muted-foreground">
                  Free: {freeRAM} MB
                </div>
              )}
            </div>
          </div>
          {/* RAM usage bar */}
          <div className="mt-2">
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all ${(usedRAM / TOTAL_RAM) > 0.85 ? "bg-red-500" : "bg-primary"}`}
                animate={{ width: `${(usedRAM / TOTAL_RAM) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
              <span>Used: {usedRAM} MB</span>
              <span>{Math.round((usedRAM / TOTAL_RAM) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Disk */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono font-bold text-sm text-muted-foreground">Swap Space (Disk)</span>
          </div>
          <div className="rounded-xl border-2 border-muted overflow-hidden">
            <div className="bg-muted/50 text-muted-foreground text-xs font-mono text-center py-2 border-b">
              Disk Swap Partition
            </div>
            <div className="min-h-[200px] bg-background p-2 space-y-2">
              <AnimatePresence>
                {diskProcesses.map(p => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="bg-muted rounded-lg px-3 py-2 flex items-center justify-between text-sm font-mono border border-border"
                  >
                    <div>
                      <div className="font-bold text-muted-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground/70">{p.size} MB · suspended</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => swapIn(p)}
                      disabled={swapping !== null || p.size > freeRAM}
                      className={`text-xs font-mono h-7 ${p.size > freeRAM ? "opacity-50" : ""}`}
                    >
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Swap In
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {diskProcesses.length === 0 && (
                <div className="text-center text-xs font-mono text-muted-foreground py-8">
                  Swap space empty
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swapping animation indicator */}
      <AnimatePresence>
        {swapping !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-3 mb-4 p-3 rounded-xl bg-primary/10 border border-primary/30"
          >
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-sm text-primary">
              Swapping {processes.find(p => p.id === swapping)?.name}... (disk I/O in progress)
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Log */}
      <div className="rounded-xl border bg-muted/20 p-3 mb-4">
        <div className="text-xs font-mono text-muted-foreground mb-2">System Log</div>
        <div className="space-y-1 max-h-24 overflow-y-auto">
          {log.slice(-5).map((entry, i) => (
            <div key={i} className="text-xs font-mono text-foreground/80">
              {entry.startsWith("✗") ? <span className="text-red-500">{entry}</span> :
               entry.startsWith("✓") ? <span className="text-green-500">{entry}</span> :
               <span className="text-muted-foreground">{entry}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={reset} className="font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm">
        <p className="font-mono font-bold text-amber-600 dark:text-amber-400 mb-1">⚠ Performance Note</p>
        <p className="text-xs text-muted-foreground">Disk access is ~1000× slower than RAM. Heavy swapping = <strong>thrashing</strong> — the system spends more time swapping than executing useful work. Processes marked "Running" cannot be swapped out.</p>
      </div>
    </div>
  );
}
