import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mode = "fixed" | "dynamic";

interface Block { id: string; label: string; size: number; type: "os" | "process" | "free" | "waste"; color: string; }

const FIXED_INITIAL: Block[] = [
  { id: "os", label: "OS", size: 1, type: "os", color: "bg-slate-500" },
  { id: "p1", label: "P1 (70KB)\n+30KB waste", size: 1, type: "process", color: "bg-blue-500" },
  { id: "w1", label: "Waste 30KB", size: 0.3, type: "waste", color: "bg-red-400" },
  { id: "p2", label: "P2 (80KB)\n+20KB waste", size: 1, type: "process", color: "bg-green-500" },
  { id: "w2", label: "Waste 20KB", size: 0.2, type: "waste", color: "bg-red-400" },
  { id: "free1", label: "Free Partition", size: 1, type: "free", color: "bg-muted/60" },
  { id: "free2", label: "Free Partition", size: 1, type: "free", color: "bg-muted/60" },
];

const DYNAMIC_STEPS: Block[][] = [
  [
    { id: "os", label: "OS", size: 0.8, type: "os", color: "bg-slate-500" },
    { id: "free", label: "Free Memory (512 KB)", size: 5.2, type: "free", color: "bg-muted/60" },
  ],
  [
    { id: "os", label: "OS", size: 0.8, type: "os", color: "bg-slate-500" },
    { id: "p1", label: "P1 — 120 KB", size: 1.2, type: "process", color: "bg-blue-500" },
    { id: "free", label: "Free Memory (392 KB)", size: 4.0, type: "free", color: "bg-muted/60" },
  ],
  [
    { id: "os", label: "OS", size: 0.8, type: "os", color: "bg-slate-500" },
    { id: "p1", label: "P1 — 120 KB", size: 1.2, type: "process", color: "bg-blue-500" },
    { id: "p2", label: "P2 — 80 KB", size: 0.8, type: "process", color: "bg-green-500" },
    { id: "free", label: "Free Memory (312 KB)", size: 3.2, type: "free", color: "bg-muted/60" },
  ],
  [
    { id: "os", label: "OS", size: 0.8, type: "os", color: "bg-slate-500" },
    { id: "hole1", label: "Free (120 KB)", size: 1.2, type: "free", color: "bg-muted/60" },
    { id: "p2", label: "P2 — 80 KB", size: 0.8, type: "process", color: "bg-green-500" },
    { id: "p3", label: "P3 — 150 KB", size: 1.5, type: "process", color: "bg-purple-500" },
    { id: "free", label: "Free (162 KB)", size: 1.7, type: "free", color: "bg-muted/60" },
  ],
];

const DYNAMIC_LABELS = [
  "Initial: all memory free",
  "P1 loaded (120 KB exact partition)",
  "P2 loaded (80 KB exact partition)",
  "P1 exits → hole created (External Fragmentation!)",
];

function MemoryColumn({ blocks }: { blocks: Block[] }) {
  const total = blocks.reduce((s, b) => s + b.size, 0);
  return (
    <div className="w-full rounded-xl overflow-hidden border-2 border-border" style={{ height: "320px" }}>
      {blocks.map(b => {
        const pct = (b.size / total) * 100;
        const isWaste = b.type === "waste";
        return (
          <motion.div
            key={b.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: `${pct}%` }}
            className={`${b.color} ${b.type === "free" ? "border border-dashed border-muted-foreground/30" : ""} flex items-center justify-center text-xs font-mono whitespace-pre-line text-center border-b border-white/10 transition-all px-2 ${isWaste ? "text-red-200" : b.type === "free" ? "text-muted-foreground" : "text-white"}`}
          >
            {b.label}
          </motion.div>
        );
      })}
    </div>
  );
}

export function ContiguousAllocationViz() {
  const [mode, setMode] = useState<Mode>("fixed");
  const [dynStep, setDynStep] = useState(0);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Contiguous Memory Allocation</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">Compare Fixed and Dynamic partitioning side by side.</p>

      <div className="flex gap-2 justify-center mb-8">
        {(["fixed", "dynamic"] as Mode[]).map(m => (
          <Button
            key={m}
            variant={mode === m ? "default" : "outline"}
            onClick={() => { setMode(m); setDynStep(0); }}
            className="font-mono capitalize"
          >
            {m} Partitioning
          </Button>
        ))}
      </div>

      {mode === "fixed" ? (
        <div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="text-center text-sm font-mono font-bold mb-3">Memory State</div>
              <MemoryColumn blocks={FIXED_INITIAL} />
            </div>
            <div className="space-y-3 pt-8">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm">
                <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mb-1">Fixed Partitions</p>
                <p className="text-muted-foreground text-xs">Memory divided into equal-size blocks (100 KB each) at boot time.</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm">
                <p className="font-mono font-bold text-red-500 mb-1">⚠ Internal Fragmentation</p>
                <p className="text-muted-foreground text-xs">P1 = 70 KB in 100 KB partition → 30 KB wasted inside.<br />P2 = 80 KB in 100 KB partition → 20 KB wasted inside.</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 border text-sm">
                <p className="font-mono font-bold mb-1">Total Waste</p>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">P1 waste:</span><span className="text-red-500">30 KB</span>
                </div>
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">P2 waste:</span><span className="text-red-500">20 KB</span>
                </div>
                <div className="flex justify-between font-mono text-xs border-t mt-1 pt-1">
                  <span className="text-muted-foreground">Total wasted:</span><span className="text-red-500 font-bold">50 KB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <div className="text-center text-sm font-mono font-bold mb-3">
                Step {dynStep + 1} of {DYNAMIC_STEPS.length}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={dynStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MemoryColumn blocks={DYNAMIC_STEPS[dynStep]} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="space-y-3 pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={dynStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-sm"
                >
                  <p className="font-mono font-bold text-primary mb-1">Step {dynStep + 1}</p>
                  <p className="text-muted-foreground text-xs">{DYNAMIC_LABELS[dynStep]}</p>
                </motion.div>
              </AnimatePresence>
              {dynStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-sm"
                >
                  <p className="font-mono font-bold text-orange-500 mb-1">⚠ External Fragmentation</p>
                  <p className="text-muted-foreground text-xs">120 KB free hole + 162 KB free block = 282 KB total. But a 200 KB process cannot be loaded (no contiguous 200 KB block)!</p>
                </motion.div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDynStep(0)}
                  className="font-mono"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDynStep(s => Math.min(s + 1, DYNAMIC_STEPS.length - 1))}
                  disabled={dynStep >= DYNAMIC_STEPS.length - 1}
                  className="font-mono"
                >
                  Next <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border bg-card text-sm">
          <p className="font-mono font-bold mb-1">Fixed Partitioning</p>
          <p className="text-xs text-muted-foreground">✓ Simple, no overhead<br />✗ Internal fragmentation<br />✗ Max process size limited</p>
        </div>
        <div className="p-3 rounded-lg border bg-card text-sm">
          <p className="font-mono font-bold mb-1">Dynamic Partitioning</p>
          <p className="text-xs text-muted-foreground">✓ No internal fragmentation<br />✗ External fragmentation<br />✗ Needs compaction over time</p>
        </div>
      </div>
    </div>
  );
}
