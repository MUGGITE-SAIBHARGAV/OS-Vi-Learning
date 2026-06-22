import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simulated page reference string (represents program execution phases)
const LONG_REF_STRING = [
  1,2,3,1,2,3,1,2,3,           // Phase 1: locality {1,2,3}
  5,6,7,8,5,6,7,8,5,6,         // Phase 2: locality {5,6,7,8}
  2,3,4,2,3,4,2,3,4,           // Phase 3: locality {2,3,4}
  9,10,11,9,10,11,9,10,        // Phase 4: locality {9,10,11}
  1,2,1,2,1,2,                 // Phase 5: back to {1,2}
];

const PHASE_LABELS = [
  { start: 0, end: 8, label: "Phase 1: Loop over pages {1,2,3}", color: "text-blue-500" },
  { start: 9, end: 18, label: "Phase 2: New function — pages {5,6,7,8}", color: "text-purple-500" },
  { start: 19, end: 27, label: "Phase 3: Transition — pages {2,3,4}", color: "text-green-500" },
  { start: 28, end: 35, label: "Phase 4: Heavy I/O — pages {9,10,11}", color: "text-orange-500" },
  { start: 36, end: 41, label: "Phase 5: Return to {1,2}", color: "text-blue-500" },
];

const PAGE_COLORS: Record<number, string> = {
  1: "bg-blue-500", 2: "bg-blue-400", 3: "bg-blue-300",
  4: "bg-purple-500", 5: "bg-purple-400", 6: "bg-purple-300",
  7: "bg-green-500", 8: "bg-green-400", 9: "bg-orange-500",
  10: "bg-orange-400", 11: "bg-red-500",
};

function getWorkingSet(refs: number[], currentIdx: number, delta: number): Set<number> {
  const start = Math.max(0, currentIdx - delta + 1);
  return new Set(refs.slice(start, currentIdx + 1));
}

// VM Playground state
interface PlaygroundState { ramSize: number; processSize: number; pageSize: number; }

export function WorkingSetViz() {
  const [delta, setDelta] = useState(5);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Playground
  const [pg, setPg] = useState<PlaygroundState>({ ramSize: 16, processSize: 32, pageSize: 4 });
  const totalPages = Math.ceil(pg.processSize / pg.pageSize);
  const framesAvail = Math.floor(pg.ramSize / pg.pageSize);
  const pagesInRAM = Math.min(totalPages, framesAvail);
  const pagesOnDisk = totalPages - pagesInRAM;
  const canRunEfficiently = framesAvail >= Math.min(8, Math.ceil(totalPages * 0.4));

  const ws = getWorkingSet(LONG_REF_STRING, step, delta);
  const wsSize = ws.size;

  const currentPhase = PHASE_LABELS.find(p => step >= p.start && step <= p.end);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          if (s >= LONG_REF_STRING.length - 1) { setRunning(false); return s; }
          return s + 1;
        });
      }, 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const reset = () => { setStep(0); setRunning(false); };

  const ALL_PAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Working Set & VM Playground</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Observe the working set as a process moves through execution phases. Then configure your own VM system.
      </p>

      {/* Working Set Section */}
      <div className="mb-8">
        <h3 className="font-mono font-bold text-primary mb-4">Working Set W(t, Δ)</h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between text-sm font-mono mb-2">
              <span>Window Size Δ</span>
              <span className="text-primary font-bold">{delta} references</span>
            </div>
            <Slider min={1} max={12} step={1} value={[delta]} onValueChange={v => setDelta(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm font-mono mb-2">
              <span>Time t</span>
              <span className="text-primary font-bold">{step + 1} / {LONG_REF_STRING.length}</span>
            </div>
            <Slider min={0} max={LONG_REF_STRING.length - 1} step={1} value={[step]} onValueChange={v => { setStep(v[0]); setRunning(false); }} />
          </div>
        </div>

        {/* Reference tape */}
        <div className="mb-4">
          <div className="text-xs font-mono text-muted-foreground mb-2">Page Reference String (scroll to see all)</div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {LONG_REF_STRING.map((p, i) => {
              const inWindow = i >= Math.max(0, step - delta + 1) && i <= step;
              const isCurrent = i === step;
              return (
                <div key={i} className={`w-7 h-7 rounded shrink-0 flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                  isCurrent ? "bg-primary text-primary-foreground border-primary scale-110" :
                  inWindow ? `${PAGE_COLORS[p] || "bg-muted"} text-white border-transparent` :
                  "bg-muted/40 text-muted-foreground border-border"}`}>
                  {p}
                </div>
              );
            })}
          </div>
        </div>

        {/* Working Set + Pages */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border-2 border-primary bg-primary/5 p-3">
            <div className="font-mono font-bold text-primary mb-2 text-sm">Working Set W(t={step + 1}, Δ={delta})</div>
            <div className="flex gap-2 flex-wrap mb-2">
              {Array.from(ws).sort().map(p => (
                <motion.div key={p} initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className={`w-10 h-10 rounded-lg ${PAGE_COLORS[p] || "bg-primary"} text-white flex items-center justify-center font-mono font-bold text-sm`}>
                  P{p}
                </motion.div>
              ))}
            </div>
            <div className="text-xs font-mono text-muted-foreground">|W| = {wsSize} pages = {wsSize * 4} KB</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-muted-foreground">All Pages — Status</div>
            <div className="grid grid-cols-4 gap-1.5">
              {ALL_PAGES.map(p => (
                <div key={p} className={`rounded-lg py-1.5 text-center font-mono text-xs font-bold transition-all ${ws.has(p) ? `${PAGE_COLORS[p] || "bg-primary"} text-white` : "bg-muted/40 text-muted-foreground"}`}>
                  P{p}
                </div>
              ))}
            </div>
            {currentPhase && (
              <div className={`text-xs font-mono ${currentPhase.color}`}>
                {currentPhase.label}
              </div>
            )}
          </div>
        </div>

        {/* Play controls */}
        <div className="flex gap-3">
          <Button onClick={() => setRunning(r => !r)} variant={running ? "destructive" : "default"} className="font-mono">
            {running ? <><Square className="w-4 h-4 mr-2" />Pause</> : <><Play className="w-4 h-4 mr-2" />Play</>}
          </Button>
          <Button variant="outline" onClick={reset} className="font-mono">
            <RotateCcw className="w-4 h-4 mr-2" />Reset
          </Button>
        </div>
      </div>

      {/* VM Playground */}
      <div className="border-t pt-8">
        <h3 className="font-mono font-bold text-primary mb-4">Virtual Memory Playground</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {([
            { key: "ramSize", label: "RAM Size (MB)", min: 4, max: 64, step: 4 },
            { key: "processSize", label: "Process Size (MB)", min: 4, max: 128, step: 4 },
            { key: "pageSize", label: "Page Size (KB)", min: 1, max: 16, step: 1, unit: "KB", toMB: true },
          ] as const).map(({ key, label, min, max, step }) => (
            <div key={key}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold text-primary">{pg[key]}</span>
              </div>
              <Slider min={min} max={max} step={step} value={[pg[key]]} onValueChange={v => setPg(prev => ({ ...prev, [key]: v[0] }))} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Total Pages", val: totalPages, color: "text-foreground" },
            { label: "Frames in RAM", val: framesAvail, color: "text-green-500" },
            { label: "Pages in RAM", val: pagesInRAM, color: "text-blue-500" },
            { label: "Pages on Disk", val: pagesOnDisk, color: pagesOnDisk > 0 ? "text-orange-500" : "text-muted-foreground" },
          ].map(item => (
            <div key={item.label} className="rounded-xl border bg-card p-3 text-center">
              <div className="text-xs text-muted-foreground font-mono mb-1">{item.label}</div>
              <div className={`font-bold font-mono text-xl ${item.color}`}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Visual RAM/Disk bar */}
        <div className="rounded-xl border overflow-hidden mb-4">
          <div className="bg-muted/50 px-3 py-2 font-mono text-xs font-bold border-b">Process Memory Map</div>
          <div className="p-3 flex gap-1 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <div key={i} className={`w-8 h-8 rounded text-xs font-mono flex items-center justify-center font-bold border ${i < pagesInRAM ? "bg-blue-500 text-white border-blue-500" : "bg-orange-500/20 text-orange-500 border-orange-500/30"}`}>
                {i}
              </div>
            ))}
          </div>
          <div className="flex gap-4 px-3 pb-3 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" />In RAM ({pagesInRAM})</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500/50" />On Disk ({pagesOnDisk})</div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border-2 text-sm ${canRunEfficiently ? "border-green-500/50 bg-green-500/5" : "border-orange-500/50 bg-orange-500/5"}`}>
          <p className={`font-mono font-bold mb-1 ${canRunEfficiently ? "text-green-500" : "text-orange-500"}`}>
            {canRunEfficiently ? "✓ Efficient Execution" : "⚠ Heavy Swapping Expected"}
          </p>
          <p className="text-xs text-muted-foreground">
            {pagesOnDisk === 0
              ? `All ${totalPages} pages fit in RAM — no swapping needed.`
              : `${pagesOnDisk} of ${totalPages} pages will be on disk and fetched on demand. ${canRunEfficiently ? "Working set likely fits in RAM." : "Expect frequent page faults and disk I/O."}`}
          </p>
        </div>
      </div>
    </div>
  );
}
