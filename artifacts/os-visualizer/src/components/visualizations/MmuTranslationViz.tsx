import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 4; // 4 KB per page
const TLB: Record<number, number> = { 2: 5, 4: 1, 7: 3 }; // cached translations
const PAGE_TABLE: Record<number, number | null> = { 0: 6, 1: 2, 2: 5, 3: null, 4: 1, 5: null, 6: 7, 7: 3 };

interface Demo { va: number; desc: string; }
const DEMOS: Demo[] = [
  { va: 10, desc: "Page 2 — TLB Hit (cached translation)" },
  { va: 4, desc: "Page 1 — TLB Miss → Page Table Walk" },
  { va: 12, desc: "Page 3 — TLB Miss → Page Fault!" },
  { va: 28, desc: "Page 7 — TLB Hit (cached translation)" },
];

type Phase = "idle" | "cpu" | "tlb-check" | "tlb-hit" | "tlb-miss" | "pte-lookup" | "page-fault" | "physical" | "done";

export function MmuTranslationViz() {
  const [demoIdx, setDemoIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);

  const demo = DEMOS[demoIdx];
  const pageNumber = Math.floor(demo.va / PAGE_SIZE);
  const offset = demo.va % PAGE_SIZE;
  const tlbHit = TLB[pageNumber] !== undefined;
  const frameNumber = tlbHit ? TLB[pageNumber] : PAGE_TABLE[pageNumber];
  const pageFault = frameNumber === null || frameNumber === undefined;
  const physicalAddr = pageFault ? null : frameNumber! * PAGE_SIZE + offset;

  const PHASES: Phase[] = tlbHit
    ? ["cpu", "tlb-check", "tlb-hit", "physical", "done"]
    : pageFault
    ? ["cpu", "tlb-check", "tlb-miss", "pte-lookup", "page-fault", "done"]
    : ["cpu", "tlb-check", "tlb-miss", "pte-lookup", "physical", "done"];

  const runAnimation = async () => {
    if (running) return;
    setRunning(true);
    setPhase("idle");
    for (const p of PHASES) {
      setPhase(p);
      await new Promise(r => setTimeout(r, 900));
    }
    setRunning(false);
  };

  const reset = () => { setPhase("idle"); setRunning(false); };

  const phaseIdx = PHASES.indexOf(phase);

  const BOX = ({ active, title, sub, color = "border-border", bg = "" }: { active: boolean; title: string; sub: string; color?: string; bg?: string }) => (
    <motion.div animate={{ scale: active ? 1.04 : 1, opacity: active ? 1 : 0.55 }}
      className={`rounded-xl border-2 p-3 transition-all ${active ? `${color} ${bg}` : "border-border bg-card"}`}>
      <p className="font-mono font-bold text-sm">{title}</p>
      <p className="font-mono text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  );

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">MMU Address Translation</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Step through TLB lookup, page table walk, and physical address computation.
      </p>

      {/* Demo selector */}
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {DEMOS.map((d, i) => (
          <Button key={i} variant={demoIdx === i ? "default" : "outline"} size="sm"
            onClick={() => { setDemoIdx(i); reset(); }} className="font-mono text-xs">
            VA={d.va}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-6">
        {/* Flow diagram */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-muted-foreground text-center mb-3">Translation Pipeline</div>

          <BOX active={phase === "cpu"} title="CPU" sub={`Virtual Address: ${demo.va} (Page ${pageNumber} | Offset ${offset})`}
            color="border-yellow-500" bg="bg-yellow-500/10" />

          <div className="flex justify-center"><div className="w-0.5 h-4 bg-border" /></div>

          <BOX active={phase === "tlb-check" || phase === "tlb-hit"} title="TLB Check"
            sub={tlbHit ? `✓ HIT — Page ${pageNumber} cached → Frame ${TLB[pageNumber]}` : `✗ MISS — Page ${pageNumber} not in TLB`}
            color={tlbHit ? "border-green-500" : "border-orange-500"}
            bg={tlbHit ? "bg-green-500/10" : "bg-orange-500/10"} />

          {!tlbHit && (
            <>
              <div className="flex justify-center"><div className="w-0.5 h-4 bg-border" /></div>
              <BOX active={phase === "pte-lookup"} title="Page Table Walk"
                sub={pageFault ? `Page ${pageNumber} invalid — on disk!` : `Page ${pageNumber} → Frame ${frameNumber}`}
                color={pageFault ? "border-red-500" : "border-blue-500"}
                bg={pageFault ? "bg-red-500/10" : "bg-blue-500/10"} />
            </>
          )}

          {pageFault && (
            <>
              <div className="flex justify-center"><div className="w-0.5 h-4 bg-border" /></div>
              <BOX active={phase === "page-fault"} title="Page Fault Handler (OS)"
                sub="OS loads page from disk, updates page table, resumes process"
                color="border-red-500" bg="bg-red-500/10" />
            </>
          )}

          {!pageFault && (
            <>
              <div className="flex justify-center"><div className="w-0.5 h-4 bg-border" /></div>
              <BOX active={phase === "physical" || phase === "done"} title="Physical Address"
                sub={physicalAddr !== null ? `PA = ${physicalAddr} (Frame ${frameNumber} × ${PAGE_SIZE} + ${offset})` : ""}
                color="border-green-500" bg="bg-green-500/10" />
            </>
          )}
        </div>

        {/* TLB & Page Table */}
        <div className="space-y-4">
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-muted/50 px-3 py-2 font-mono text-xs font-bold border-b flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              TLB Cache (fast)
            </div>
            <div className="divide-y text-xs font-mono">
              {Object.entries(TLB).map(([p, f]) => {
                const isActive = parseInt(p) === pageNumber && (phase === "tlb-check" || phase === "tlb-hit");
                return (
                  <div key={p} className={`flex justify-between px-3 py-1.5 transition-all ${isActive ? "bg-green-500/20 font-bold" : ""}`}>
                    <span className="text-muted-foreground">Page {p}</span>
                    <span className={isActive ? "text-green-500" : ""}>→ Frame {f}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <div className="bg-muted/50 px-3 py-2 font-mono text-xs font-bold border-b flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Page Table (in RAM)
            </div>
            <div className="divide-y text-xs font-mono">
              {Object.entries(PAGE_TABLE).map(([p, f]) => {
                const isActive = parseInt(p) === pageNumber && (phase === "pte-lookup" || phase === "page-fault");
                return (
                  <div key={p} className={`flex justify-between px-3 py-1.5 transition-all ${isActive ? (f === null ? "bg-red-500/20 font-bold" : "bg-blue-500/20 font-bold") : ""}`}>
                    <span className="text-muted-foreground">Page {p}</span>
                    <span className={f === null ? "text-red-500" : isActive ? "text-blue-500" : ""}>{f === null ? "disk" : `Frame ${f}`}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border text-sm font-mono mb-6 ${pageFault && phase === "page-fault" || phase === "done" && pageFault ? "border-red-500/40 bg-red-500/5" : "border-primary/30 bg-primary/5"}`}>
            <span className="text-muted-foreground">{demo.desc}</span>
            {phase === "done" && !pageFault && <span className="text-green-500 font-bold ml-2">→ PA = {physicalAddr}</span>}
            {(phase === "done" || phase === "page-fault") && pageFault && <span className="text-red-500 font-bold ml-2">→ Page Fault!</span>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="flex gap-1 justify-center mb-6">
        {PHASES.map((p, i) => (
          <div key={p} className={`h-1.5 flex-1 rounded-full transition-all ${i <= phaseIdx ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={runAnimation} disabled={running} className="font-mono">
          <Play className="w-4 h-4 mr-2" />{running ? "Translating..." : "Simulate Translation"}
        </Button>
        <Button variant="outline" onClick={reset} className="font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />Reset
        </Button>
      </div>
    </div>
  );
}
