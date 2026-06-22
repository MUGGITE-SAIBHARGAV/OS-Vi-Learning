import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  { id: 0, label: "Program requests 8 GB of memory", highlight: "program" },
  { id: 1, label: "OS creates a virtual address space of 8 GB for the program", highlight: "vm" },
  { id: 2, label: "Only 4 GB RAM available — OS maps active pages to RAM", highlight: "ram" },
  { id: 3, label: "Inactive pages stored on disk — fetched on demand", highlight: "disk" },
  { id: 4, label: "Program sees 8 GB — illusion is complete!", highlight: "all" },
];

const PROGRAM_PAGES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  label: `P${i}`,
  inRam: i < 8,
  active: [0, 1, 2, 5, 9, 11, 13, 14].includes(i),
}));

export function VmIntroViz() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  const runAnimation = async () => {
    setRunning(true);
    for (let i = 0; i <= 4; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 1100));
    }
    setRunning(false);
  };

  const reset = () => { setStep(-1); setRunning(false); };

  const hl = step >= 0 ? STEPS[step].highlight : "";

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">How Virtual Memory Works</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A program larger than RAM can run thanks to the OS illusion of abundant memory.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8 items-start">
        {/* Program */}
        <motion.div
          animate={{ opacity: step >= 0 ? 1 : 0.5, scale: hl === "program" || hl === "all" ? 1.04 : 1 }}
          className={`rounded-xl border-2 overflow-hidden transition-all ${hl === "program" || hl === "all" ? "border-yellow-500 shadow-lg shadow-yellow-500/20" : "border-border"}`}
        >
          <div className="bg-yellow-500/20 px-3 py-2 text-center font-mono text-sm font-bold border-b border-yellow-500/30">
            📦 Program
          </div>
          <div className="p-3 space-y-1 bg-card">
            <div className="text-center font-mono text-2xl font-bold text-yellow-500">8 GB</div>
            <div className="text-xs text-muted-foreground text-center">Virtual Address Space</div>
            <div className="grid grid-cols-4 gap-0.5 mt-2">
              {PROGRAM_PAGES.map(p => (
                <div key={p.id}
                  className={`rounded text-xs font-mono text-center py-0.5 ${p.active ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  {p.label}
                </div>
              ))}
            </div>
            <div className="text-xs text-center text-muted-foreground mt-1">16 pages of 512 MB each</div>
          </div>
        </motion.div>

        {/* Virtual Memory column — arrow down to RAM/Disk */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ opacity: step >= 1 ? 1 : 0.3 }}
            className={`w-full rounded-xl border-2 overflow-hidden ${hl === "vm" || hl === "all" ? "border-primary shadow-lg shadow-primary/20" : "border-border"}`}
          >
            <div className="bg-primary/10 px-3 py-2 text-center font-mono text-sm font-bold border-b border-primary/30">
              🧩 Virtual Memory
            </div>
            <div className="p-3 bg-card">
              <div className="text-center font-mono text-2xl font-bold text-primary">8 GB</div>
              <div className="text-xs text-muted-foreground text-center mb-2">OS-managed illusion</div>
              <div className="text-xs font-mono space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">In RAM:</span><span className="text-green-500">4 GB</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">On Disk:</span><span className="text-orange-500">4 GB</span></div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {step >= 1 && (
              <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} className="flex flex-col items-center text-primary">
                <div className="w-0.5 h-8 bg-primary/50" />
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-xl border-2 overflow-hidden border-green-500"
              >
                <div className="bg-green-500/10 px-3 py-2 text-center font-mono text-sm font-bold border-b border-green-500/30 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  RAM (Active)
                </div>
                <div className="p-3 bg-card">
                  <div className="text-center font-mono text-xl font-bold text-green-500">4 GB</div>
                  <div className="text-xs text-muted-foreground text-center">Physical Memory</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-xl border-2 overflow-hidden border-orange-500"
              >
                <div className="bg-orange-500/10 px-3 py-2 text-center font-mono text-sm font-bold border-b border-orange-500/30 flex items-center justify-center gap-2">
                  💾 Disk (Inactive)
                </div>
                <div className="p-3 bg-card">
                  <div className="text-center font-mono text-xl font-bold text-orange-500">4 GB</div>
                  <div className="text-xs text-muted-foreground text-center">Swap Space</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="rounded-xl border bg-card p-3 text-sm">
            <p className="font-mono font-bold text-primary mb-2">Memory Summary</p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Program Size:</span><span className="text-yellow-500">8 GB</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Physical RAM:</span><span className="text-green-500">4 GB</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Disk Swap:</span><span className="text-orange-500">4 GB</span></div>
              <div className="border-t pt-1 flex justify-between"><span className="text-muted-foreground">Effective Size:</span><span className="font-bold">8 GB ✓</span></div>
            </div>
          </div>

          <AnimatePresence>
            {step >= 4 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border-2 border-primary bg-primary/5 p-3 text-sm">
                <p className="font-mono font-bold text-primary mb-1">✓ Illusion Created!</p>
                <p className="text-xs text-muted-foreground">The program sees 8 GB. The OS silently manages which 4 GB is in RAM at any moment. Pages are swapped in/out transparently.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-xl border bg-card p-3">
            <p className="font-mono text-xs text-muted-foreground font-bold mb-1">Real Examples</p>
            {["Chrome uses >2 GB", "Games need 8–16 GB", "Video editors: 32+ GB"].map(ex => (
              <div key={ex} className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />{ex}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step bar */}
      <div className="p-4 rounded-xl bg-muted/40 border mb-6 min-h-[56px] flex items-center">
        <AnimatePresence mode="wait">
          {step >= 0 ? (
            <motion.div key={step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 w-full">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-mono shrink-0">{step + 1}</div>
              <p className="text-sm font-mono">{STEPS[step].label}</p>
            </motion.div>
          ) : (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground font-mono">Click "Run Animation" to see how virtual memory works step by step.</motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={runAnimation} disabled={running || step === 4} className="font-mono">
          <Play className="w-4 h-4 mr-2" />{running ? "Running..." : "Run Animation"}
        </Button>
        <Button variant="outline" onClick={reset} className="font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />Reset
        </Button>
      </div>
    </div>
  );
}
