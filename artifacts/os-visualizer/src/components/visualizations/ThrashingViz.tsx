import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const MAX_PROCESSES = 10;
const RAM_CAPACITY = 100; // units

interface ProcessInfo { id: number; name: string; wsSize: number; color: string; }

const COLORS = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-cyan-500", "bg-yellow-500", "bg-red-500", "bg-indigo-500", "bg-teal-500"];
const NAMES = ["Chrome", "VSCode", "Spotify", "Discord", "Slack", "Terminal", "Zoom", "Firefox", "Photoshop", "Game"];
const WS_SIZES = [20, 15, 12, 18, 10, 8, 25, 22, 30, 28];

function generateProcesses(count: number): ProcessInfo[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i, name: NAMES[i], wsSize: WS_SIZES[i], color: COLORS[i],
  }));
}

export function ThrashingViz() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [processes] = useState<ProcessInfo[]>(generateProcesses(MAX_PROCESSES));
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeProcs = processes.slice(0, numProcesses);
  const totalWS = activeProcs.reduce((s, p) => s + p.wsSize, 0);
  const isThrashing = totalWS > RAM_CAPACITY;
  const overload = Math.max(0, totalWS - RAM_CAPACITY);
  const utilizationRaw = isThrashing
    ? Math.max(5, 100 - (overload / totalWS) * 200)
    : Math.min(95, 60 + numProcesses * 8);
  const cpuUtil = Math.round(Math.max(5, Math.min(95, utilizationRaw)));
  const diskIO = isThrashing ? Math.round(Math.min(99, 20 + (overload / totalWS) * 200)) : Math.round(5 + numProcesses * 2);
  const pageFaultRate = isThrashing ? Math.round(Math.min(99, (overload / totalWS) * 150)) : Math.round(numProcesses * 3);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const Gauge = ({ label, value, max = 100, good = "low", color }: { label: string; value: number; max?: number; good?: "high" | "low"; color: string }) => {
    const pct = (value / max) * 100;
    const isGood = good === "high" ? value > 60 : value < 30;
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-muted-foreground">{label}</span>
          <span className={`font-bold ${isGood ? "text-green-500" : "text-red-500"}`}>{value}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color}`}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Thrashing Visualizer</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Increase the number of processes and watch the system thrash as working sets exceed RAM.
      </p>

      {/* Slider */}
      <div className="p-4 rounded-xl bg-muted/40 border mb-6">
        <div className="flex justify-between text-sm font-mono mb-3">
          <span>Active Processes</span>
          <span className={`font-bold ${isThrashing ? "text-red-500" : "text-green-500"}`}>{numProcesses}</span>
        </div>
        <Slider min={1} max={10} step={1} value={[numProcesses]} onValueChange={v => { setNumProcesses(v[0]); setTime(0); }} />
        <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
          <span>1 process</span><span>10 processes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* RAM Usage */}
        <div className="rounded-xl border-2 overflow-hidden" style={{ borderColor: isThrashing ? "rgb(239 68 68)" : "hsl(var(--border))" }}>
          <div className={`px-3 py-2 border-b font-mono text-sm font-bold ${isThrashing ? "bg-red-500/10 text-red-500" : "bg-muted/50"}`}>
            RAM — Working Set Demand
          </div>
          <div className="p-3">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-muted-foreground">Total Demand:</span>
              <span className={isThrashing ? "text-red-500 font-bold" : "text-green-500 font-bold"}>{totalWS} / {RAM_CAPACITY} units</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden mb-3">
              <motion.div
                className={`h-full rounded-full ${isThrashing ? "bg-red-500" : "bg-green-500"}`}
                animate={{ width: `${Math.min(100, (totalWS / RAM_CAPACITY) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="space-y-1">
              {activeProcs.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${p.color} shrink-0`} />
                  <span className="text-xs font-mono text-muted-foreground flex-1">{p.name}</span>
                  <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.wsSize / RAM_CAPACITY) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{p.wsSize}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="rounded-xl border overflow-hidden">
          <div className="bg-muted/50 px-3 py-2 border-b font-mono text-sm font-bold">System Metrics</div>
          <div className="p-4 space-y-4">
            <Gauge label="CPU Utilization" value={cpuUtil} good="high" color={cpuUtil > 50 ? "bg-green-500" : "bg-red-500"} />
            <Gauge label="Disk I/O Activity" value={diskIO} good="low" color={diskIO > 50 ? "bg-red-500" : "bg-blue-500"} />
            <Gauge label="Page Fault Rate" value={pageFaultRate} good="low" color={pageFaultRate > 30 ? "bg-red-500" : "bg-green-500"} />
          </div>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence mode="wait">
        {isThrashing ? (
          <motion.div key="thrashing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-xl border-2 border-red-500 bg-red-500/10 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <motion.div className="w-3 h-3 rounded-full bg-red-500" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} />
              <p className="font-mono font-bold text-red-500">⚠ THRASHING DETECTED</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Working set demand ({totalWS} units) exceeds RAM ({RAM_CAPACITY} units) by <strong className="text-red-500">{overload} units</strong>.
              Processes are constantly swapping pages — CPU utilization has collapsed to <strong>{cpuUtil}%</strong>.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Fix:</strong> Reduce to {Math.ceil(RAM_CAPACITY / (totalWS / numProcesses))} or fewer processes.
            </p>
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-xl border-2 border-green-500 bg-green-500/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="font-mono font-bold text-green-500">✓ Normal Operation</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All working sets fit in RAM. CPU utilization is {cpuUtil}%. Try adding more processes to trigger thrashing.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation chart */}
      <div className="p-4 rounded-xl border bg-card">
        <p className="font-mono font-bold text-sm mb-3">Degree of Multiprogramming vs CPU Utilization</p>
        <div className="flex items-end gap-1 h-20">
          {Array.from({ length: MAX_PROCESSES }, (_, i) => {
            const n = i + 1;
            const ws = processes.slice(0, n).reduce((s, p) => s + p.wsSize, 0);
            const thrash = ws > RAM_CAPACITY;
            const util = thrash
              ? Math.max(5, 100 - (Math.max(0, ws - RAM_CAPACITY) / ws) * 200)
              : Math.min(95, 60 + n * 8);
            return (
              <div key={i} className={`flex-1 rounded-t transition-all ${thrash ? "bg-red-500/70" : "bg-green-500/70"} ${n === numProcesses ? "ring-2 ring-primary" : ""}`}
                style={{ height: `${Math.max(5, util)}%` }} title={`${n} processes: ${Math.round(util)}% CPU`} />
            );
          })}
        </div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
          <span>1 proc</span><span className="text-red-500">← Thrashing threshold</span><span>10 proc</span>
        </div>
      </div>
    </div>
  );
}
