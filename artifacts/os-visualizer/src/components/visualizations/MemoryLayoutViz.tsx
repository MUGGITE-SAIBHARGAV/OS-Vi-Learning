import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROCESS_COLORS = [
  { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-green-500", border: "border-green-500", text: "text-green-600 dark:text-green-400" },
  { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-600 dark:text-orange-400" },
  { bg: "bg-pink-500", border: "border-pink-500", text: "text-pink-600 dark:text-pink-400" },
];

const PROCESS_NAMES = ["Process A", "Process B", "Process C", "Process D", "Process E"];
const PROCESS_SIZES = [120, 80, 150, 60, 100];
const TOTAL_RAM = 640;
const OS_SIZE = 80;

interface Process { id: number; name: string; size: number; colorIdx: number; }

export function MemoryLayoutViz() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 0, name: "Process A", size: 120, colorIdx: 0 },
    { id: 1, name: "Process B", size: 80, colorIdx: 1 },
  ]);
  const [nextId, setNextId] = useState(2);
  const [selected, setSelected] = useState<number | null>(null);

  const usedMem = processes.reduce((s, p) => s + p.size, 0) + OS_SIZE;
  const freeMem = TOTAL_RAM - usedMem;
  const canAdd = processes.length < 5 && freeMem >= 60;

  const addProcess = () => {
    if (!canAdd) return;
    const idx = nextId % 5;
    setProcesses(prev => [...prev, {
      id: nextId,
      name: PROCESS_NAMES[idx],
      size: PROCESS_SIZES[idx],
      colorIdx: idx,
    }]);
    setNextId(n => n + 1);
  };

  const removeProcess = (id: number) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
    if (selected === id) setSelected(null);
  };

  const fillPct = (usedMem / TOTAL_RAM) * 100;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Memory Layout Visualizer</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Add and remove processes to see how memory is divided. Click a process to inspect it.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Memory Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono text-muted-foreground mb-2">
            <span>0 KB</span>
            <span>{TOTAL_RAM} MB (RAM)</span>
          </div>
          <div className="w-full rounded-xl overflow-hidden border-2 border-border" style={{ height: "400px" }}>
            {/* OS block */}
            <div
              className="bg-slate-500 text-white text-xs font-mono flex items-center justify-center border-b border-white/20 cursor-default"
              style={{ height: `${(OS_SIZE / TOTAL_RAM) * 100}%` }}
            >
              OS Kernel ({OS_SIZE} MB)
            </div>
            {/* Process blocks */}
            <AnimatePresence>
              {processes.map(p => {
                const col = PROCESS_COLORS[p.colorIdx];
                const isSelected = selected === p.id;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scaleY: 0.5 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.5, transition: { duration: 0.25 } }}
                    style={{ height: `${(p.size / TOTAL_RAM) * 100}%` }}
                    className={`${col.bg} text-white text-xs font-mono flex items-center justify-between px-3 cursor-pointer border-b border-white/20 transition-all ${isSelected ? "brightness-110 ring-2 ring-white/50" : "hover:brightness-110"}`}
                    onClick={() => setSelected(prev => prev === p.id ? null : p.id)}
                  >
                    <span>{p.name}</span>
                    <span>{p.size} MB</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {/* Free block */}
            {freeMem > 0 && (
              <div
                className="bg-muted/30 border-t border-dashed border-muted-foreground/30 flex items-center justify-center text-xs font-mono text-muted-foreground"
                style={{ height: `${(freeMem / TOTAL_RAM) * 100}%` }}
              >
                Free — {freeMem} MB
              </div>
            )}
          </div>
          {/* Utilization bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span>Memory Utilization</span>
              <span className={fillPct > 85 ? "text-red-500" : "text-primary"}>{Math.round(fillPct)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all ${fillPct > 85 ? "bg-red-500" : "bg-primary"}`}
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>

        {/* Controls & Info */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={addProcess} disabled={!canAdd} className="font-mono flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Process
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {processes.map(p => {
                const col = PROCESS_COLORS[p.colorIdx];
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${selected === p.id ? `${col.border} bg-muted/50` : "border-border hover:border-muted-foreground/40"}`}
                    onClick={() => setSelected(prev => prev === p.id ? null : p.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${col.bg}`} />
                      <span className="font-mono text-sm font-semibold">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-sm ${col.text}`}>{p.size} MB</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={e => { e.stopPropagation(); removeProcess(p.id); }}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {selected !== null && (() => {
            const p = processes.find(x => x.id === selected);
            if (!p) return null;
            const col = PROCESS_COLORS[p.colorIdx];
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 ${col.border} bg-card`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className={`w-4 h-4 ${col.text}`} />
                  <span className={`font-mono font-bold ${col.text}`}>{p.name} — Memory Map</span>
                </div>
                <div className="space-y-2 text-sm font-mono">
                  {["Text (Code)", "Data (Globals)", "Heap ↑", "Stack ↓"].map((seg, i) => (
                    <div key={seg} className="flex justify-between items-center bg-muted/40 rounded px-3 py-1.5">
                      <span className="text-muted-foreground">{seg}</span>
                      <span>{Math.round(p.size * [0.25, 0.20, 0.30, 0.25][i])} MB</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })()}

          <div className="p-4 rounded-xl bg-muted/40 border text-sm space-y-2">
            <div className="flex justify-between font-mono text-sm">
              <span>Total RAM</span><span className="font-bold">{TOTAL_RAM} MB</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>OS Kernel</span><span>{OS_SIZE} MB</span>
            </div>
            <div className="flex justify-between font-mono text-sm">
              <span>Processes</span><span>{usedMem - OS_SIZE} MB</span>
            </div>
            <div className="flex justify-between font-mono text-sm border-t pt-2">
              <span>Free</span>
              <span className={freeMem < 60 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>{freeMem} MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
