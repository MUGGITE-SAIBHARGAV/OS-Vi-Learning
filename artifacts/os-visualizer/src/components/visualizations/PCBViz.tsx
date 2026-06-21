import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PCBViz() {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [pcValue, setPcValue] = useState(4201004); // Decimal representation of 0x00401A2C
  const [cpuTime, setCpuTime] = useState(0.42);
  const [state, setState] = useState("RUNNING");
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (simulating) {
      timer = setInterval(() => {
        setPcValue(prev => prev + 4);
        setCpuTime(prev => prev + 0.05);
        if (Math.random() > 0.9) {
          setState(prev => prev === "RUNNING" ? "WAITING" : "RUNNING");
        }
      }, 500);
    }
    return () => clearInterval(timer);
  }, [simulating]);

  const PCB_FIELDS = [
    { id: "pid", name: "Process ID (PID)", value: "1042", desc: "A unique identifier assigned to the process by the OS." },
    { id: "state", name: "Process State", value: state, desc: "Current state of the process (e.g., new, ready, running, waiting)." },
    { id: "pc", name: "Program Counter (PC)", value: `0x${pcValue.toString(16).toUpperCase()}`, desc: "Indicates the address of the next instruction to be executed." },
    { id: "registers", name: "CPU Registers", value: "AX: 0x0F, BX: 0x3A...", desc: "Saves the contents of registers when an interrupt occurs." },
    { id: "priority", name: "Priority", value: "5 (Normal)", desc: "Process priority for the CPU scheduler." },
    { id: "memBase", name: "Memory Base", value: "0x08048000", desc: "Starting address of the process in memory." },
    { id: "memLimit", name: "Memory Limit", value: "4096 KB", desc: "Maximum amount of memory the process can use." },
    { id: "files", name: "Open Files", value: "[file.txt, socket:80]", desc: "List of files and network sockets opened by the process." },
    { id: "parent", name: "Parent PID", value: "1001", desc: "Process ID of the parent process that created this one." },
    { id: "cpuTime", name: "CPU Time Used", value: `${cpuTime.toFixed(2)}s`, desc: "Total amount of CPU time consumed so far." }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2 lg:col-span-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-mono text-primary">Process Control Block</CardTitle>
            <CardDescription>Click rows to inspect fields.</CardDescription>
          </div>
          <Button 
            variant={simulating ? "destructive" : "default"} 
            size="sm" 
            onClick={() => setSimulating(!simulating)}
            className="font-mono"
            data-testid="button-simulate-pcb"
          >
            {simulating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {simulating ? "Stop Exec" : "Simulate Exec"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-black/5 dark:bg-black/40 overflow-hidden font-mono text-sm">
            <div className="grid grid-cols-3 bg-muted/50 p-3 font-bold border-b text-muted-foreground">
              <div className="col-span-1">Field</div>
              <div className="col-span-2">Value</div>
            </div>
            <div className="divide-y">
              {PCB_FIELDS.map((field) => (
                <div 
                  key={field.id}
                  className={`grid grid-cols-3 p-3 cursor-pointer transition-colors hover:bg-primary/10 ${activeField === field.id ? 'bg-primary/20 text-primary border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'} ${simulating && (field.id === 'pc' || field.id === 'cpuTime' || field.id === 'state') ? 'bg-green-500/5' : ''}`}
                  onClick={() => setActiveField(field.id)}
                  data-testid={`pcb-row-${field.id}`}
                >
                  <div className="col-span-1 font-semibold">{field.name}</div>
                  <div className="col-span-2 text-foreground/80">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit sticky top-4">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Info className="w-5 h-5 mr-2 text-primary" />
            Field Explorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {activeField ? (
              <motion.div
                key={activeField}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {PCB_FIELDS.filter(f => f.id === activeField).map(f => (
                  <div key={f.id}>
                    <h3 className="font-mono font-bold text-lg text-primary mb-2">{f.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground py-8"
              >
                Select a field from the PCB table to see its details.
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
