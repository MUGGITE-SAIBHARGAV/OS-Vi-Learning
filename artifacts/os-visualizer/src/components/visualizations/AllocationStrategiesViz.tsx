import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Strategy = "first" | "best" | "worst";

const STRATEGY_INFO = {
  first: { label: "First Fit", color: "bg-blue-500", border: "border-blue-500", text: "text-blue-600 dark:text-blue-400", desc: "Allocate the first block that is large enough. Fast — stops at first match." },
  best:  { label: "Best Fit",  color: "bg-green-500", border: "border-green-500", text: "text-green-600 dark:text-green-400", desc: "Allocate the smallest sufficient block. Minimizes waste per allocation." },
  worst: { label: "Worst Fit", color: "bg-purple-500", border: "border-purple-500", text: "text-purple-600 dark:text-purple-400", desc: "Allocate the largest block. Leaves the biggest possible remainder." },
};

const DEFAULT_BLOCKS = [80, 20, 200, 50, 140, 35];

function findAllocation(blocks: number[], processSize: number, strategy: Strategy): number {
  const eligible = blocks.map((size, i) => ({ size, i })).filter(b => b.size >= processSize);
  if (eligible.length === 0) return -1;
  if (strategy === "first") return eligible[0].i;
  if (strategy === "best") return eligible.reduce((a, b) => (b.size < a.size ? b : a)).i;
  if (strategy === "worst") return eligible.reduce((a, b) => (b.size > a.size ? b : a)).i;
  return -1;
}

function MemoryView({ blocks, chosen, processSize, strategy }: { blocks: number[]; chosen: number; processSize: number; strategy: Strategy }) {
  const total = blocks.reduce((s, b) => s + b, 0);
  const cfg = STRATEGY_INFO[strategy];

  return (
    <div className="rounded-xl border-2 border-border overflow-hidden flex flex-col" style={{ height: "280px" }}>
      {blocks.map((size, i) => {
        const pct = (size / total) * 100;
        const isChosen = i === chosen;
        const remainder = isChosen ? size - processSize : 0;
        return (
          <motion.div
            key={i}
            style={{ flex: pct / 100 }}
            className={`relative flex items-center justify-between px-3 font-mono text-xs border-b border-white/10 transition-all ${
              isChosen
                ? `ring-2 ring-inset ring-white/50`
                : size < processSize
                ? "bg-muted/30 text-muted-foreground/50"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {isChosen ? (
              <div className="flex w-full h-full">
                <div className={`${cfg.color} text-white flex items-center justify-center flex-1 text-xs`}>
                  P ({processSize} KB)
                </div>
                {remainder > 0 && (
                  <div className="bg-red-400/30 text-red-500 flex items-center justify-center text-xs border-l border-red-400/40" style={{ width: `${(remainder / size) * 100}%` }}>
                    {remainder} KB
                  </div>
                )}
              </div>
            ) : (
              <>
                <span>Block {i + 1}</span>
                <span className={size < processSize ? "text-muted-foreground/50" : "font-bold"}>{size} KB</span>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export function AllocationStrategiesViz() {
  const [processSize, setProcessSize] = useState(60);
  const [inputVal, setInputVal] = useState("60");
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [blockInput, setBlockInput] = useState(DEFAULT_BLOCKS.join(", "));
  const [results, setResults] = useState<Record<Strategy, number>>({ first: -1, best: -1, worst: -1 });
  const [ran, setRan] = useState(false);

  const runStrategies = () => {
    const size = parseInt(inputVal) || 60;
    setProcessSize(size);
    setResults({
      first: findAllocation(blocks, size, "first"),
      best:  findAllocation(blocks, size, "best"),
      worst: findAllocation(blocks, size, "worst"),
    });
    setRan(true);
  };

  const reset = () => {
    setRan(false);
    setResults({ first: -1, best: -1, worst: -1 });
  };

  const applyBlocks = () => {
    const parsed = blockInput.split(",").map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
    if (parsed.length > 0) setBlocks(parsed);
    setRan(false);
    setResults({ first: -1, best: -1, worst: -1 });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Memory Allocation Strategies</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Enter memory blocks and a process size to see which block each strategy picks.
      </p>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-muted/40 border">
        <div>
          <Label className="font-mono text-sm mb-2 block">Free Memory Blocks (KB, comma-separated)</Label>
          <div className="flex gap-2">
            <Input
              value={blockInput}
              onChange={e => setBlockInput(e.target.value)}
              className="font-mono text-sm"
              placeholder="80, 20, 200, 50, 140, 35"
            />
            <Button variant="outline" size="sm" onClick={applyBlocks} className="font-mono shrink-0">Apply</Button>
          </div>
        </div>
        <div>
          <Label className="font-mono text-sm mb-2 block">Process Size to Allocate (KB)</Label>
          <div className="flex gap-2">
            <Input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="font-mono text-sm"
              placeholder="60"
              type="number"
              min={1}
            />
            <Button onClick={runStrategies} className="font-mono shrink-0">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            {ran && (
              <Button variant="outline" onClick={reset} className="font-mono shrink-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Three strategy columns */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {(["first", "best", "worst"] as Strategy[]).map(s => {
          const cfg = STRATEGY_INFO[s];
          const chosen = results[s];
          const allocated = ran && chosen !== -1;
          const failed = ran && chosen === -1;
          const remainder = allocated ? blocks[chosen] - processSize : 0;

          return (
            <div key={s}>
              <div className={`text-center text-sm font-mono font-bold mb-2 ${cfg.text}`}>{cfg.label}</div>
              <AnimatePresence mode="wait">
                <motion.div key={`${s}-${ran}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <MemoryView blocks={blocks} chosen={chosen} processSize={processSize} strategy={s} />
                </motion.div>
              </AnimatePresence>
              <div className={`mt-2 p-2 rounded-lg text-xs font-mono text-center border ${
                failed ? "border-red-500/30 bg-red-500/10 text-red-500"
                : allocated ? `${cfg.border} bg-card text-foreground`
                : "border-border bg-muted/30 text-muted-foreground"
              }`}>
                {!ran ? "Click Run to simulate" :
                 failed ? "✗ No block large enough" :
                 `✓ Block ${chosen + 1} (${blocks[chosen]} KB) → ${remainder} KB left`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison */}
      {ran && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid md:grid-cols-3 gap-3">
            {(["first", "best", "worst"] as Strategy[]).map(s => {
              const cfg = STRATEGY_INFO[s];
              const chosen = results[s];
              return (
                <div key={s} className="p-3 rounded-xl border bg-card text-sm">
                  <p className={`font-mono font-bold mb-2 ${cfg.text}`}>{cfg.label}</p>
                  <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                  {chosen !== -1 && (
                    <div className="mt-2 pt-2 border-t font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Waste:</span>
                        <span className={blocks[chosen] - processSize === 0 ? "text-green-500" : "text-orange-500"}>
                          {blocks[chosen] - processSize} KB
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
