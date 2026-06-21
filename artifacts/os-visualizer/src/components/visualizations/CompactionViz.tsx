import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Phase = "before" | "animating" | "after";

const BEFORE_BLOCKS = [
  { id: "p1", label: "P1", sublabel: "80 KB", type: "process", color: "bg-blue-500", flex: 2 },
  { id: "h1", label: "Free", sublabel: "60 KB", type: "free", color: "", flex: 1.5 },
  { id: "p2", label: "P2", sublabel: "100 KB", type: "process", color: "bg-green-500", flex: 2.5 },
  { id: "h2", label: "Free", sublabel: "40 KB", type: "free", color: "", flex: 1 },
  { id: "p3", label: "P3", sublabel: "60 KB", type: "process", color: "bg-purple-500", flex: 1.5 },
  { id: "h3", label: "Free", sublabel: "50 KB", type: "free", color: "", flex: 1.25 },
];

const AFTER_BLOCKS = [
  { id: "p1", label: "P1", sublabel: "80 KB", type: "process", color: "bg-blue-500", flex: 2 },
  { id: "p2", label: "P2", sublabel: "100 KB", type: "process", color: "bg-green-500", flex: 2.5 },
  { id: "p3", label: "P3", sublabel: "60 KB", type: "process", color: "bg-purple-500", flex: 1.5 },
  { id: "free", label: "Free", sublabel: "150 KB", type: "free", color: "", flex: 3.75 },
];

function MemBlock({ label, sublabel, type, color, flex }: { label: string; sublabel: string; type: string; color: string; flex: number }) {
  const isFree = type === "free";
  return (
    <motion.div
      layout
      style={{ flex }}
      className={`${isFree ? "bg-red-400/20 border border-dashed border-red-400/50" : `${color} text-white`} flex flex-col items-center justify-center text-xs font-mono border-b border-white/10 min-h-[30px] transition-all`}
    >
      <span className={`font-bold ${isFree ? "text-red-500" : ""}`}>{label}</span>
      <span className={`text-xs ${isFree ? "text-red-400" : "text-white/80"}`}>{sublabel}</span>
    </motion.div>
  );
}

export function CompactionViz() {
  const [phase, setPhase] = useState<Phase>("before");
  const [step, setStep] = useState(0);

  const steps = [
    { label: "Initial state — processes scattered with free holes between them.", highlight: null },
    { label: "Moving P1 to the lowest available address...", highlight: "p1" },
    { label: "Sliding P2 up directly after P1...", highlight: "p2" },
    { label: "Moving P3 immediately after P2...", highlight: "p3" },
    { label: "Compaction complete! All free space is now a single 150 KB block.", highlight: null },
  ];

  const startCompaction = async () => {
    if (phase !== "before") return;
    setPhase("animating");
    for (let i = 1; i <= 4; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 1200));
    }
    setPhase("after");
  };

  const reset = () => { setPhase("before"); setStep(0); };

  const showBefore = phase === "before" || (phase === "animating" && step === 0);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Compaction Animation</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Watch how the OS moves all processes to one end, merging scattered free holes into one large block.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {/* Before */}
        <div>
          <div className="text-center text-sm font-mono font-bold mb-3 flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${phase === "before" ? "bg-primary" : "bg-muted-foreground"}`} />
            Before Compaction
          </div>
          <div className="rounded-xl border-2 border-border overflow-hidden flex flex-col" style={{ height: "280px" }}>
            {BEFORE_BLOCKS.map(b => <MemBlock key={b.id} {...b} />)}
          </div>
          <div className="mt-2 text-center text-xs font-mono text-muted-foreground">
            3 holes: 60 + 40 + 50 = <span className="text-red-500">150 KB fragmented</span>
          </div>
        </div>

        {/* After */}
        <div>
          <div className="text-center text-sm font-mono font-bold mb-3 flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${phase === "after" ? "bg-green-500" : "bg-muted-foreground"}`} />
            After Compaction
          </div>
          <div className="rounded-xl border-2 border-border overflow-hidden flex flex-col" style={{ height: "280px" }}>
            <AnimatePresence>
              {(phase === "after" ? AFTER_BLOCKS : BEFORE_BLOCKS).map(b => (
                <MemBlock key={b.id} {...b} />
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-2 text-center text-xs font-mono text-muted-foreground">
            1 contiguous block: <span className="text-green-500">150 KB free</span>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="p-4 rounded-xl bg-muted/40 border mb-6 min-h-[60px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 w-full"
          >
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-mono shrink-0">
              {step + 1}
            </div>
            <p className="text-sm font-mono text-muted-foreground">{steps[step]?.label}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        {phase === "before" && (
          <Button onClick={startCompaction} className="font-mono">
            <Play className="w-4 h-4 mr-2" />
            Start Compaction
          </Button>
        )}
        {phase === "animating" && (
          <Button disabled className="font-mono">
            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Compacting...
          </Button>
        )}
        {phase === "after" && (
          <Button onClick={reset} variant="outline" className="font-mono">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {phase === "after" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-3 gap-3 text-center"
        >
          {[
            { label: "Holes Merged", val: "3 → 1", color: "text-green-500" },
            { label: "Free Space", val: "150 KB", color: "text-green-500" },
            { label: "Cost", val: "High", color: "text-orange-500" },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-lg border bg-card">
              <div className="text-xs text-muted-foreground font-mono mb-1">{item.label}</div>
              <div className={`font-bold font-mono ${item.color}`}>{item.val}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
