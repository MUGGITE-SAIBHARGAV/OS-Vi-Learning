import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOTAL_PAGES = 12;
const TOTAL_FRAMES = 4;

type PageState = "disk" | "loading" | "ram" | "active";

interface PageInfo { id: number; state: PageState; frame?: number; }

const ACCESS_SEQUENCE = [0, 1, 3, 0, 5, 2, 1, 7, 3, 0];
const STEP_LABELS = [
  "Process starts — all pages on disk (lazy loading).",
  "CPU accesses page 0 — page fault! OS loads P0 into Frame 0.",
  "CPU accesses page 1 — page fault! OS loads P1 into Frame 1.",
  "CPU accesses page 3 — page fault! OS loads P3 into Frame 2.",
  "CPU accesses page 0 — already in RAM! (no fault)",
  "CPU accesses page 5 — page fault! OS loads P5 into Frame 3.",
  "CPU accesses page 2 — page fault! RAM full → evict P0 → load P2.",
  "CPU accesses page 1 — already in RAM! (no fault)",
  "CPU accesses page 7 — page fault! RAM full → evict P1 → load P7.",
  "CPU accesses page 3 — already in RAM! (no fault)",
  "Simulation complete.",
];

export function DemandPagingViz() {
  const [step, setStep] = useState(0);
  const [pages, setPages] = useState<PageInfo[]>(
    Array.from({ length: TOTAL_PAGES }, (_, i) => ({ id: i, state: "disk" }))
  );
  const [frames, setFrames] = useState<(number | null)[]>(Array(TOTAL_FRAMES).fill(null));
  const [faults, setFaults] = useState(0);
  const [hits, setHits] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const advance = async () => {
    if (step >= ACCESS_SEQUENCE.length || running) return;
    setRunning(true);
    const pageId = ACCESS_SEQUENCE[step];

    setPages(prev => prev.map(p => p.id === pageId ? { ...p, state: p.state === "ram" ? "active" : p.state } : p));
    await new Promise(r => setTimeout(r, 200));

    const alreadyLoaded = frames.includes(pageId);

    if (alreadyLoaded) {
      setHits(h => h + 1);
      setPages(prev => prev.map(p => p.id === pageId ? { ...p, state: "active" } : p));
    } else {
      setFaults(f => f + 1);
      // FIFO eviction if full
      const emptySlot = frames.findIndex(f => f === null);
      setPages(prev => prev.map(p => p.id === pageId ? { ...p, state: "loading" } : p));
      await new Promise(r => setTimeout(r, 400));

      if (emptySlot !== -1) {
        const newFrames = [...frames];
        newFrames[emptySlot] = pageId;
        setFrames(newFrames);
        setPages(prev => prev.map(p => p.id === pageId ? { ...p, state: "active", frame: emptySlot } : p));
      } else {
        // evict from frame 0 (FIFO simplification)
        const evictedPage = frames[0];
        const newFrames = [frames[1], frames[2], frames[3], pageId];
        setFrames(newFrames);
        setPages(prev => prev.map(p => {
          if (p.id === evictedPage) return { ...p, state: "disk", frame: undefined };
          if (p.id === pageId) return { ...p, state: "active", frame: 3 };
          return p;
        }));
      }
    }

    await new Promise(r => setTimeout(r, 400));
    // reset active to ram
    setPages(prev => prev.map(p => p.state === "active" ? { ...p, state: "ram" } : p));

    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= ACCESS_SEQUENCE.length) setDone(true);
    setRunning(false);
  };

  const reset = () => {
    setStep(0); setFaults(0); setHits(0); setDone(false); setRunning(false);
    setPages(Array.from({ length: TOTAL_PAGES }, (_, i) => ({ id: i, state: "disk" })));
    setFrames(Array(TOTAL_FRAMES).fill(null));
  };

  const STATE_STYLE: Record<PageState, string> = {
    disk: "bg-muted text-muted-foreground",
    loading: "bg-yellow-500 text-white animate-pulse",
    ram: "bg-blue-500 text-white",
    active: "bg-green-500 text-white scale-110",
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Demand Paging Simulation</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Pages load only when accessed. Watch page faults and RAM fill up.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Page Faults", val: faults, color: "text-red-500" },
          { label: "TLB Hits", val: hits, color: "text-green-500" },
          { label: "Step", val: `${step}/${ACCESS_SEQUENCE.length}`, color: "text-primary" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border bg-card p-3 text-center">
            <div className="text-xs text-muted-foreground font-mono mb-1">{s.label}</div>
            <div className={`font-bold font-mono text-xl ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* RAM Frames */}
      <div className="mb-6">
        <div className="text-xs font-mono text-muted-foreground mb-2">Physical RAM — {TOTAL_FRAMES} Frames</div>
        <div className="grid grid-cols-4 gap-2">
          {frames.map((pageId, fi) => (
            <div key={fi} className={`rounded-xl border-2 overflow-hidden ${pageId !== null ? "border-blue-500" : "border-dashed border-muted-foreground/30"}`}>
              <div className="bg-muted/50 text-xs font-mono text-center py-1 border-b">Frame {fi}</div>
              <div className={`h-14 flex items-center justify-center font-mono font-bold text-sm ${pageId !== null ? "bg-blue-500 text-white" : "bg-card text-muted-foreground/40"}`}>
                {pageId !== null ? `P${pageId}` : "free"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page grid (disk view) */}
      <div className="mb-6">
        <div className="text-xs font-mono text-muted-foreground mb-2">Virtual Pages</div>
        <div className="grid grid-cols-6 gap-1.5">
          {pages.map(p => (
            <motion.div
              key={p.id}
              layout
              animate={{ scale: p.state === "active" ? 1.15 : 1 }}
              className={`rounded-lg text-xs font-mono text-center py-2 font-bold transition-all ${STATE_STYLE[p.state]}`}
            >
              P{p.id}
            </motion.div>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-xs font-mono text-muted-foreground flex-wrap">
          {[{ color: "bg-muted", label: "On Disk" }, { color: "bg-yellow-500", label: "Loading" }, { color: "bg-blue-500", label: "In RAM" }, { color: "bg-green-500", label: "Accessing" }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${l.color}`} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Access sequence */}
      <div className="mb-6">
        <div className="text-xs font-mono text-muted-foreground mb-2">Page Access Sequence</div>
        <div className="flex gap-1.5 flex-wrap">
          {ACCESS_SEQUENCE.map((p, i) => (
            <div key={i} className={`w-8 h-8 rounded font-mono font-bold text-sm flex items-center justify-center border transition-all ${
              i < step ? (frames.includes(p) ? "bg-green-500/20 text-green-500 border-green-500/30" : "bg-red-500/20 text-red-500 border-red-500/30") :
              i === step ? "bg-primary text-primary-foreground border-primary" :
              "bg-muted/40 text-muted-foreground border-border"}`}>
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Step label */}
      <div className="p-3 rounded-xl bg-muted/40 border text-sm font-mono mb-6 min-h-[48px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-muted-foreground">
            {STEP_LABELS[step] || STEP_LABELS[STEP_LABELS.length - 1]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={advance} disabled={done || running} className="font-mono">
          <ChevronRight className="w-4 h-4 mr-1" />Next Access
        </Button>
        <Button variant="outline" onClick={reset} className="font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />Reset
        </Button>
      </div>
    </div>
  );
}
