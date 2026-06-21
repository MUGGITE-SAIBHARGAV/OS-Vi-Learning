import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, HardDrive, ArrowDown, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROGRAMS = [
  { name: "Chrome", size: 256, color: "bg-blue-500" },
  { name: "VS Code", size: 180, color: "bg-purple-500" },
  { name: "Spotify", size: 120, color: "bg-green-500" },
];

export function MemoryIntroViz() {
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  const totalRAM = 640;
  const usedRAM = loaded.reduce((s, i) => s + PROGRAMS[i].size, 0);
  const freeRAM = totalRAM - usedRAM;

  const handleNext = async () => {
    if (running) return;
    if (step < PROGRAMS.length) {
      setRunning(true);
      await new Promise(r => setTimeout(r, 300));
      setLoaded(prev => [...prev, step]);
      setStep(s => s + 1);
      setRunning(false);
    }
  };

  const reset = () => { setStep(0); setLoaded([]); setRunning(false); };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">How Programs Load into Memory</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">Programs live on disk. To run, they must be loaded into RAM. The CPU can only access RAM directly.</p>

      <div className="grid md:grid-cols-3 gap-6 items-start mb-8">
        {/* CPU */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary flex items-center justify-center mb-3">
            <Cpu className="w-10 h-10 text-primary" />
          </div>
          <span className="font-mono font-bold text-sm">CPU</span>
          <span className="text-xs text-muted-foreground text-center mt-1">Executes instructions from RAM</span>
          {loaded.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 px-2 py-1 rounded bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-mono"
            >
              Running: {PROGRAMS[loaded[loaded.length - 1]]?.name}
            </motion.div>
          )}
        </div>

        {/* RAM */}
        <div className="flex flex-col items-center">
          <div className="w-full border-2 border-primary rounded-xl overflow-hidden mb-3">
            <div className="bg-muted/50 px-3 py-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs font-bold">RAM</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">{totalRAM} MB</span>
            </div>
            <div className="p-2 space-y-1 min-h-[160px]">
              {/* OS block always there */}
              <div className="rounded px-2 py-1 bg-slate-400/20 border border-slate-400/30 text-xs font-mono text-center text-muted-foreground">
                OS Kernel — 64 MB
              </div>
              <AnimatePresence>
                {loaded.map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scaleY: 0, originY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`rounded px-2 py-1 text-xs font-mono text-white text-center ${PROGRAMS[i].color}`}
                    style={{ height: `${PROGRAMS[i].size / 8}px`, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {PROGRAMS[i].name} — {PROGRAMS[i].size} MB
                  </motion.div>
                ))}
              </AnimatePresence>
              {freeRAM > 64 && (
                <div className="rounded border border-dashed border-muted-foreground/30 px-2 py-1 text-xs font-mono text-center text-muted-foreground/60"
                  style={{ height: `${(freeRAM - 64) / 8}px`, minHeight: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Free — {freeRAM - 64} MB
                </div>
              )}
            </div>
            <div className="px-3 py-2 bg-muted/30 border-t flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Used: {usedRAM + 64} MB</span>
              <span className="text-green-500">Free: {freeRAM - 64} MB</span>
            </div>
          </div>
        </div>

        {/* Disk */}
        <div className="flex flex-col items-center">
          <div className="w-full border-2 border-muted rounded-xl overflow-hidden mb-3">
            <div className="bg-muted/50 px-3 py-2 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-xs font-bold text-muted-foreground">Disk (SSD)</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              {PROGRAMS.map((p, i) => (
                <div
                  key={i}
                  className={`rounded px-2 py-2 text-xs font-mono flex items-center justify-between transition-all ${
                    loaded.includes(i) ? "opacity-40 line-through" : "opacity-100"
                  } bg-muted/40 border`}
                >
                  <span>{p.name}.exe</span>
                  <span className="text-muted-foreground">{p.size} MB</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Arrow animation */}
      {step < PROGRAMS.length && (
        <div className="flex justify-center mb-6">
          <motion.div
            className="flex flex-col items-center text-primary"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <ArrowDown className="w-5 h-5" />
            <span className="text-xs font-mono mt-1">Load {PROGRAMS[step]?.name} into RAM</span>
          </motion.div>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <Button onClick={handleNext} disabled={step >= PROGRAMS.length || running} className="font-mono">
          <Play className="w-4 h-4 mr-2" />
          {step >= PROGRAMS.length ? "All Loaded" : `Load ${PROGRAMS[step].name}`}
        </Button>
        <Button variant="outline" onClick={reset} className="font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        {[
          { label: "CPU Speed", val: "~3 GHz", note: "ns access" },
          { label: "RAM Speed", val: "~3200 MHz", note: "~100 ns" },
          { label: "Disk Speed", val: "~500 MB/s", note: "ms access" },
        ].map(item => (
          <div key={item.label} className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground font-mono mb-1">{item.label}</div>
            <div className="font-bold font-mono text-primary text-sm">{item.val}</div>
            <div className="text-xs text-muted-foreground">{item.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
