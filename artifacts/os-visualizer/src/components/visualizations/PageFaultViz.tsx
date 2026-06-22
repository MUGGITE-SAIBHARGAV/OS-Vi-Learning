import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Algorithm = "fifo" | "lru" | "opt";

function runFIFO(refs: number[], frames: number): { faults: number; steps: { frames: (number | null)[]; fault: boolean; evicted: number | null }[] } {
  const mem: number[] = [];
  const steps = [];
  let faults = 0;
  for (const page of refs) {
    let fault = false, evicted: number | null = null;
    if (!mem.includes(page)) {
      fault = true; faults++;
      if (mem.length >= frames) evicted = mem.shift()!;
      mem.push(page);
    }
    const snap = [...mem, ...Array(frames - mem.length).fill(null)];
    steps.push({ frames: snap, fault, evicted });
  }
  return { faults, steps };
}

function runLRU(refs: number[], frames: number): { faults: number; steps: { frames: (number | null)[]; fault: boolean; evicted: number | null }[] } {
  const mem: number[] = [];
  const steps = [];
  let faults = 0;
  for (const page of refs) {
    let fault = false, evicted: number | null = null;
    const idx = mem.indexOf(page);
    if (idx === -1) {
      fault = true; faults++;
      if (mem.length >= frames) evicted = mem.shift()!;
      mem.push(page);
    } else {
      mem.splice(idx, 1);
      mem.push(page);
    }
    const snap = [...mem, ...Array(frames - mem.length).fill(null)];
    steps.push({ frames: snap, fault, evicted });
  }
  return { faults, steps };
}

function runOPT(refs: number[], numFrames: number): { faults: number; steps: { frames: (number | null)[]; fault: boolean; evicted: number | null }[] } {
  const mem: number[] = [];
  const steps = [];
  let faults = 0;
  for (let i = 0; i < refs.length; i++) {
    const page = refs[i];
    let fault = false, evicted: number | null = null;
    if (!mem.includes(page)) {
      fault = true; faults++;
      if (mem.length >= numFrames) {
        let farthest = -1, victimIdx = 0;
        for (let j = 0; j < mem.length; j++) {
          const nextUse = refs.slice(i + 1).indexOf(mem[j]);
          if (nextUse === -1) { victimIdx = j; break; }
          if (nextUse > farthest) { farthest = nextUse; victimIdx = j; }
        }
        evicted = mem[victimIdx];
        mem.splice(victimIdx, 1);
      }
      mem.push(page);
    }
    const snap = [...mem, ...Array(numFrames - mem.length).fill(null)];
    steps.push({ frames: snap, fault, evicted });
  }
  return { faults, steps };
}

const DEFAULT_REFS = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
const DEFAULT_FRAMES = 3;

const ALGO_INFO = {
  fifo: { label: "FIFO", color: "bg-blue-500", border: "border-blue-500", text: "text-blue-600 dark:text-blue-400", desc: "Evicts the oldest page in RAM." },
  lru:  { label: "LRU",  color: "bg-green-500", border: "border-green-500", text: "text-green-600 dark:text-green-400", desc: "Evicts the least recently used page." },
  opt:  { label: "OPT",  color: "bg-purple-500", border: "border-purple-500", text: "text-purple-600 dark:text-purple-400", desc: "Evicts page not needed longest (optimal)." },
};

export function PageFaultViz() {
  const [refsInput, setRefsInput] = useState(DEFAULT_REFS.join(", "));
  const [framesInput, setFramesInput] = useState(String(DEFAULT_FRAMES));
  const [refs, setRefs] = useState(DEFAULT_REFS);
  const [numFrames, setNumFrames] = useState(DEFAULT_FRAMES);
  const [results, setResults] = useState<Record<Algorithm, ReturnType<typeof runFIFO>> | null>(null);
  const [curStep, setCurStep] = useState(0);

  const run = () => {
    const r = refsInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 0);
    const f = Math.max(1, Math.min(6, parseInt(framesInput) || 3));
    setRefs(r); setNumFrames(f); setCurStep(0);
    setResults({ fifo: runFIFO(r, f), lru: runLRU(r, f), opt: runOPT(r, f) });
  };

  const maxStep = refs.length - 1;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Page Fault Simulator</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Compare FIFO, LRU and Optimal page replacement algorithms side-by-side.
      </p>

      {/* Config */}
      <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-muted/40 border">
        <div>
          <Label className="font-mono text-sm mb-2 block">Page Reference String (comma-separated)</Label>
          <Input value={refsInput} onChange={e => setRefsInput(e.target.value)} className="font-mono text-sm" />
        </div>
        <div>
          <Label className="font-mono text-sm mb-2 block">Number of Frames (1–6)</Label>
          <div className="flex gap-2">
            <Input type="number" min={1} max={6} value={framesInput} onChange={e => setFramesInput(e.target.value)} className="font-mono text-sm" />
            <Button onClick={run} className="font-mono shrink-0"><Play className="w-4 h-4 mr-2" />Run</Button>
          </div>
        </div>
      </div>

      {results && (
        <>
          {/* Fault summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["fifo", "lru", "opt"] as Algorithm[]).map(a => {
              const cfg = ALGO_INFO[a];
              const faults = results[a].faults;
              const best = Math.min(...(["fifo", "lru", "opt"] as Algorithm[]).map(x => results[x].faults));
              return (
                <div key={a} className={`rounded-xl border-2 p-3 text-center ${faults === best ? `${cfg.border} bg-card` : "border-border bg-card"}`}>
                  <div className={`font-mono font-bold text-sm mb-1 ${cfg.text}`}>{cfg.label}</div>
                  <div className="font-mono text-2xl font-bold">{faults}</div>
                  <div className="text-xs text-muted-foreground">page faults</div>
                  {faults === best && <div className="text-xs text-green-500 font-bold mt-1">✓ Best</div>}
                </div>
              );
            })}
          </div>

          {/* Step slider */}
          <div className="mb-4 flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setCurStep(s => Math.max(0, s - 1))} disabled={curStep === 0} className="font-mono">◀</Button>
            <div className="flex-1 flex gap-1">
              {refs.map((p, i) => (
                <button key={i} onClick={() => setCurStep(i)}
                  className={`flex-1 min-w-0 h-8 rounded font-mono text-xs font-bold border transition-all ${
                    i === curStep ? "bg-primary text-primary-foreground border-primary" :
                    (results.fifo.steps[i]?.fault || results.lru.steps[i]?.fault || results.opt.steps[i]?.fault)
                    ? "bg-red-500/20 text-red-500 border-red-500/30" :
                    "bg-muted/40 text-muted-foreground border-border"}`}>
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurStep(s => Math.min(maxStep, s + 1))} disabled={curStep === maxStep} className="font-mono">▶</Button>
          </div>
          <div className="text-center text-xs text-muted-foreground font-mono mb-6">Step {curStep + 1} / {refs.length} — Access page {refs[curStep]}</div>

          {/* Three algorithm views */}
          <div className="grid md:grid-cols-3 gap-4">
            {(["fifo", "lru", "opt"] as Algorithm[]).map(a => {
              const cfg = ALGO_INFO[a];
              const step = results[a].steps[curStep];
              const fault = step.fault;
              return (
                <div key={a}>
                  <div className={`text-center text-sm font-mono font-bold mb-2 ${cfg.text}`}>{cfg.label}</div>
                  <div className="rounded-xl border-2 border-border overflow-hidden">
                    <div className={`px-3 py-2 text-center text-xs font-mono font-bold ${fault ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
                      {fault ? "✗ Page Fault" : "✓ Hit"}
                    </div>
                    <div className="p-2 space-y-1.5">
                      {step.frames.map((f, fi) => (
                        <div key={fi} className={`rounded-lg py-2 text-center font-mono font-bold text-sm border transition-all ${
                          f === refs[curStep] && fault ? `${cfg.color} text-white border-transparent` :
                          f !== null ? "bg-muted/50 border-border" :
                          "border-dashed border-muted-foreground/20 text-muted-foreground/40"}`}>
                          {f !== null ? `P${f}` : "—"}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono text-center mt-2">{cfg.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Full fault row */}
          <div className="mt-6 space-y-2">
            {(["fifo", "lru", "opt"] as Algorithm[]).map(a => {
              const cfg = ALGO_INFO[a];
              return (
                <div key={a} className="flex items-center gap-2">
                  <span className={`font-mono text-xs w-10 font-bold ${cfg.text}`}>{cfg.label}</span>
                  <div className="flex gap-1 flex-1">
                    {results[a].steps.map((s, i) => (
                      <div key={i} className={`flex-1 h-4 rounded-sm transition-all ${s.fault ? cfg.color : "bg-muted/30"} ${i === curStep ? "ring-1 ring-offset-1 ring-foreground" : ""}`} title={s.fault ? "Fault" : "Hit"} />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground w-16 text-right">{results[a].faults} faults</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
