import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight, Cpu, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PAGE_SIZE = 256; // bytes for demo
const NUM_FRAMES = 8;

// Page table: virtualPage → physicalFrame (or null if not in RAM)
const PAGE_TABLE: Record<number, number | null> = {
  0: 3,
  1: 7,
  2: 0,
  3: null, // on disk
  4: 5,
  5: null, // on disk
  6: 2,
  7: 1,
};

interface TranslationResult {
  virtualAddr: number;
  pageNumber: number;
  offset: number;
  frameNumber: number | null;
  physicalAddr: number | null;
  pageFault: boolean;
}

function translate(va: number): TranslationResult {
  const pageNumber = Math.floor(va / PAGE_SIZE);
  const offset = va % PAGE_SIZE;
  const frameNumber = PAGE_TABLE[pageNumber] ?? null;
  const pageFault = frameNumber === null;
  const physicalAddr = pageFault ? null : frameNumber * PAGE_SIZE + offset;
  return { virtualAddr: va, pageNumber, offset, frameNumber, physicalAddr, pageFault };
}

export function LogicalPhysicalViz() {
  const [inputVal, setInputVal] = useState("512");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [animStep, setAnimStep] = useState(0);
  const [running, setRunning] = useState(false);

  const runTranslation = async () => {
    const va = parseInt(inputVal);
    if (isNaN(va) || va < 0 || va > 2047) return;
    setRunning(true);
    const r = translate(va);
    setResult(r);
    for (let i = 1; i <= 5; i++) {
      setAnimStep(i);
      await new Promise(x => setTimeout(x, 600));
    }
    setRunning(false);
  };

  const reset = () => { setResult(null); setAnimStep(0); setRunning(false); };

  const EXAMPLES = [
    { label: "Page 0+100", val: "100" },
    { label: "Page 2+50", val: "562" },
    { label: "Page 3 (Fault)", val: "768" },
    { label: "Page 1+200", val: "456" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold font-mono text-center mb-2">Address Translation Simulator</h2>
      <p className="text-sm text-muted-foreground text-center mb-2">
        Page Size = {PAGE_SIZE} bytes · Virtual Space: 0–2047 · {NUM_FRAMES} physical frames
      </p>
      <p className="text-xs text-muted-foreground text-center mb-6 font-mono">
        Logical Addr → [Page Number | Offset] → Page Table → [Frame Number | Offset] → Physical Addr
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <Label className="font-mono text-sm mb-2 block">Enter Virtual (Logical) Address (0–2047)</Label>
            <div className="flex gap-2">
              <Input
                type="number" min={0} max={2047}
                value={inputVal}
                onChange={e => { setInputVal(e.target.value); reset(); }}
                className="font-mono"
              />
              <Button onClick={runTranslation} disabled={running} className="font-mono shrink-0">Translate</Button>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-2">Quick examples:</p>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLES.map(ex => (
                <Button key={ex.val} variant="outline" size="sm" className="font-mono text-xs" onClick={() => { setInputVal(ex.val); reset(); }}>
                  {ex.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Page table */}
          <div className="rounded-xl border overflow-hidden">
            <div className="bg-muted/50 px-3 py-2 font-mono text-xs font-bold border-b">Page Table</div>
            <div className="divide-y text-xs font-mono">
              {Object.entries(PAGE_TABLE).map(([page, frame]) => {
                const p = parseInt(page);
                const isHighlighted = result?.pageNumber === p;
                return (
                  <div key={page} className={`flex justify-between px-3 py-1.5 transition-all ${isHighlighted ? "bg-primary/10 font-bold" : ""}`}>
                    <span className="text-muted-foreground">Page {page}</span>
                    <span className={frame === null ? "text-red-500" : isHighlighted ? "text-primary" : "text-foreground"}>
                      {frame === null ? "on disk" : `Frame ${frame}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animation flow */}
        <div className="space-y-3">
          {/* CPU */}
          <motion.div animate={{ opacity: animStep >= 1 ? 1 : 0.4, scale: animStep === 1 ? 1.03 : 1 }}
            className={`rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${animStep === 1 ? "border-yellow-500 bg-yellow-500/10" : "border-border bg-card"}`}>
            <Cpu className={`w-8 h-8 shrink-0 ${animStep === 1 ? "text-yellow-500" : "text-muted-foreground"}`} />
            <div>
              <p className="font-mono font-bold text-sm">CPU</p>
              <p className="font-mono text-xs text-muted-foreground">Generates Virtual Address</p>
              {animStep >= 1 && result && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-yellow-500 font-bold">
                  VA = {result.virtualAddr}
                </motion.p>
              )}
            </div>
          </motion.div>

          <motion.div animate={{ opacity: animStep >= 2 ? 1 : 0.3 }} className="flex justify-center">
            <ArrowDown className={`w-5 h-5 ${animStep >= 2 ? "text-primary" : "text-muted"}`} />
          </motion.div>

          {/* Split */}
          <motion.div animate={{ opacity: animStep >= 2 ? 1 : 0.4, scale: animStep === 2 ? 1.03 : 1 }}
            className={`rounded-xl border-2 p-3 transition-all ${animStep === 2 ? "border-blue-500 bg-blue-500/10" : "border-border bg-card"}`}>
            <p className="font-mono font-bold text-sm mb-2">Split Address</p>
            {animStep >= 2 && result ? (
              <div className="flex gap-2 items-center">
                <div className="flex-1 rounded bg-blue-500 text-white text-center text-xs font-mono py-1.5">
                  Page #{result.pageNumber}
                </div>
                <span className="text-muted-foreground text-xs font-mono">|</span>
                <div className="flex-1 rounded bg-blue-300 text-white text-center text-xs font-mono py-1.5">
                  Offset {result.offset}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-mono">Virtual Addr → Page Number | Offset</p>
            )}
          </motion.div>

          <motion.div animate={{ opacity: animStep >= 3 ? 1 : 0.3 }} className="flex justify-center">
            <ArrowDown className={`w-5 h-5 ${animStep >= 3 ? "text-primary" : "text-muted"}`} />
          </motion.div>

          {/* MMU lookup */}
          <motion.div animate={{ opacity: animStep >= 3 ? 1 : 0.4, scale: animStep === 3 ? 1.03 : 1 }}
            className={`rounded-xl border-2 p-3 transition-all ${animStep === 3 ? "border-purple-500 bg-purple-500/10" : "border-border bg-card"}`}>
            <p className="font-mono font-bold text-sm mb-2">MMU — Page Table Lookup</p>
            {animStep >= 3 && result ? (
              result.pageFault ? (
                <div className="text-center text-red-500 font-mono font-bold text-sm">⚠ Page Fault! Page on disk.</div>
              ) : (
                <div className="flex items-center justify-center gap-2 font-mono text-sm">
                  <span className="text-purple-500 font-bold">Page {result.pageNumber}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-green-500 font-bold">Frame {result.frameNumber}</span>
                </div>
              )
            ) : (
              <p className="text-xs text-muted-foreground font-mono">Page Number → Frame Number</p>
            )}
          </motion.div>

          <motion.div animate={{ opacity: animStep >= 4 ? 1 : 0.3 }} className="flex justify-center">
            <ArrowDown className={`w-5 h-5 ${animStep >= 4 ? "text-primary" : "text-muted"}`} />
          </motion.div>

          {/* Physical address */}
          <motion.div animate={{ opacity: animStep >= 4 ? 1 : 0.4, scale: animStep === 4 ? 1.03 : 1 }}
            className={`rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${
              animStep >= 4 && result?.pageFault ? "border-red-500 bg-red-500/10" :
              animStep >= 4 ? "border-green-500 bg-green-500/10" : "border-border bg-card"}`}>
            <Database className={`w-8 h-8 shrink-0 ${animStep >= 4 && !result?.pageFault ? "text-green-500" : animStep >= 4 ? "text-red-500" : "text-muted-foreground"}`} />
            <div>
              <p className="font-mono font-bold text-sm">RAM</p>
              {animStep >= 4 && result ? (
                result.pageFault ? (
                  <div>
                    <p className="font-mono text-xs text-red-500 font-bold">Page Fault — loading from disk...</p>
                    <p className="font-mono text-xs text-muted-foreground">OS will load page {result.pageNumber} into a free frame</p>
                  </div>
                ) : (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-sm text-green-500 font-bold">
                    PA = {result.physicalAddr} ({result.frameNumber && result.frameNumber * PAGE_SIZE} + {result.offset})
                  </motion.p>
                )
              ) : (
                <p className="font-mono text-xs text-muted-foreground">Physical Address</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {result && animStep >= 4 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border-2 font-mono text-sm ${result.pageFault ? "border-red-500/50 bg-red-500/5" : "border-green-500/50 bg-green-500/5"}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {[
                { label: "Virtual Addr", val: result.virtualAddr, color: "text-yellow-500" },
                { label: "Page Number", val: result.pageNumber, color: "text-blue-500" },
                { label: "Offset", val: result.offset, color: "text-blue-300" },
                { label: "Physical Addr", val: result.pageFault ? "PAGE FAULT" : result.physicalAddr, color: result.pageFault ? "text-red-500" : "text-green-500" },
              ].map(item => (
                <div key={item.label} className="rounded-lg bg-muted/40 p-2">
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div className={`font-bold ${item.color}`}>{item.val}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
