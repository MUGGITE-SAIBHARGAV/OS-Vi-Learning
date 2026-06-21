import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

type Tab = "internal" | "external";

export function FragmentationViz() {
  const [tab, setTab] = useState<Tab>("internal");
  const [partitionSize, setPartitionSize] = useState(100);
  const [processSize, setProcessSize] = useState(70);

  const waste = Math.max(0, partitionSize - processSize);
  const wastePercent = partitionSize > 0 ? (waste / partitionSize) * 100 : 0;
  const fillPercent = partitionSize > 0 ? Math.min(100, (processSize / partitionSize) * 100) : 0;
  const isOverflow = processSize > partitionSize;

  const extBlocks = [
    { id: "p1", label: "P1", size: 2, type: "used", color: "bg-blue-500" },
    { id: "h1", label: "Free\n40 KB", size: 0.8, type: "free", color: "" },
    { id: "p2", label: "P2", size: 1.5, type: "used", color: "bg-green-500" },
    { id: "h2", label: "Free\n30 KB", size: 0.6, type: "free", color: "" },
    { id: "p3", label: "P3", size: 1.8, type: "used", color: "bg-purple-500" },
    { id: "h3", label: "Free\n50 KB", size: 1.0, type: "free", color: "" },
    { id: "p4", label: "P4", size: 0.9, type: "used", color: "bg-orange-500" },
    { id: "h4", label: "Free\n60 KB", size: 1.2, type: "free", color: "" },
  ];
  const totalFree = 40 + 30 + 50 + 60;
  const newProcessSize = 150;
  const canFit = false;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Fragmentation Visualizer</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">Explore internal and external fragmentation interactively.</p>

      <div className="flex gap-2 justify-center mb-8">
        {(["internal", "external"] as Tab[]).map(t => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
            className="font-mono capitalize"
          >
            {t === "internal" ? "Internal" : "External"} Fragmentation
          </Button>
        ))}
      </div>

      {tab === "internal" ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span>Partition Size</span>
                  <span className="text-primary font-bold">{partitionSize} KB</span>
                </div>
                <Slider
                  min={50} max={200} step={10}
                  value={[partitionSize]}
                  onValueChange={v => setPartitionSize(v[0])}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm font-mono mb-2">
                  <span>Process Size</span>
                  <span className={`font-bold ${isOverflow ? "text-red-500" : "text-primary"}`}>{processSize} KB</span>
                </div>
                <Slider
                  min={10} max={200} step={10}
                  value={[processSize]}
                  onValueChange={v => setProcessSize(v[0])}
                />
              </div>
            </div>

            {/* Partition visualization */}
            <div className="rounded-xl border-2 border-primary overflow-hidden" style={{ height: "240px" }}>
              <div className="bg-muted/50 px-3 py-2 border-b text-xs font-mono text-center font-bold">
                Partition ({partitionSize} KB)
              </div>
              <div className="relative h-full flex flex-col">
                {/* Process fill */}
                <motion.div
                  className={`${isOverflow ? "bg-red-500" : "bg-blue-500"} text-white flex items-center justify-center text-sm font-mono font-bold border-b border-white/20`}
                  animate={{ flex: isOverflow ? 1 : fillPercent / 100 }}
                  transition={{ duration: 0.4 }}
                  style={{ flex: fillPercent / 100 }}
                >
                  {isOverflow ? `⚠ Overflow! (${processSize} KB > ${partitionSize} KB)` : `Process (${processSize} KB)`}
                </motion.div>
                {/* Waste */}
                {!isOverflow && waste > 0 && (
                  <motion.div
                    className="bg-red-400/80 text-white flex items-center justify-center text-sm font-mono font-bold"
                    animate={{ flex: wastePercent / 100 }}
                    transition={{ duration: 0.4 }}
                    style={{ flex: wastePercent / 100 }}
                  >
                    Wasted: {waste} KB
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl border-2 ${isOverflow ? "border-red-500 bg-red-500/10" : "border-primary/30 bg-primary/5"}`}>
              <h3 className="font-mono font-bold mb-3 text-primary">Calculation</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partition Size:</span>
                  <span>{partitionSize} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Process Size:</span>
                  <span>{processSize} KB</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Internal Waste:</span>
                  <span className={`font-bold ${isOverflow ? "text-red-500" : waste > 0 ? "text-red-400" : "text-green-500"}`}>
                    {isOverflow ? "Cannot fit!" : `${waste} KB`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency:</span>
                  <span className={isOverflow ? "text-red-500" : "text-green-500"}>
                    {isOverflow ? "0%" : `${Math.round(fillPercent)}%`}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border text-sm">
              <p className="font-mono font-bold mb-2">💡 Key Insight</p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Internal fragmentation = Partition Size − Process Size.<br /><br />
                With fixed partitioning, a 200 KB partition wastes 130 KB for a 70 KB process.<br /><br />
                <strong>Solution:</strong> Dynamic partitioning (exact-fit) or Paging (small fixed pages minimize waste).
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-center text-sm font-mono mb-3">Current Memory State</div>
            <div className="rounded-xl overflow-hidden border-2 border-border" style={{ height: "320px" }}>
              {extBlocks.map(b => {
                const total = extBlocks.reduce((s, x) => s + x.size, 0);
                const pct = (b.size / total) * 100;
                return (
                  <div
                    key={b.id}
                    style={{ height: `${pct}%` }}
                    className={`${b.type === "used" ? b.color + " text-white" : "bg-red-500/20 border-y border-red-400/40 text-red-600 dark:text-red-400"} flex items-center justify-center text-xs font-mono whitespace-pre-line text-center border-b border-white/10`}
                  >
                    {b.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-orange-500/10 border-2 border-orange-500/30">
              <h3 className="font-mono font-bold text-orange-500 mb-3">⚠ External Fragmentation</h3>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Free:</span>
                  <span className="text-green-500 font-bold">{totalFree} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Process:</span>
                  <span>{newProcessSize} KB</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Allocation:</span>
                  <span className="text-red-500 font-bold">FAILS ✗</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {totalFree} KB total free, but largest contiguous block is only 60 KB. A {newProcessSize} KB process cannot be allocated!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[40, 30, 50, 60].map((size, i) => (
                <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-400/30 text-center">
                  <div className="text-xs text-muted-foreground font-mono mb-1">Hole {i + 1}</div>
                  <div className="font-bold font-mono text-red-500">{size} KB</div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border text-sm">
              <p className="font-mono font-bold mb-2">💡 Solutions</p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Compaction</strong> — move processes together</li>
                <li><strong>Paging</strong> — non-contiguous allocation</li>
                <li><strong>Segmentation</strong> — variable segments</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
