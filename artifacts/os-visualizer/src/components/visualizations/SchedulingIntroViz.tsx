import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Server, ArrowRight, Cpu, HardDrive } from "lucide-react";

export function SchedulingIntroViz() {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex flex-col items-center p-4 border rounded-xl bg-card w-40 text-center shadow-sm"
            >
              <HardDrive className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="font-mono font-bold text-sm">New Processes</span>
            </motion.div>

            <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col items-center p-4 border rounded-xl bg-blue-500/10 border-blue-500/30 w-48 text-center shadow-sm relative"
            >
              <Server className="w-8 h-8 text-blue-500 mb-2" />
              <span className="font-mono font-bold text-sm text-blue-700 dark:text-blue-400">Ready Queue</span>
              <div className="flex gap-1 mt-3">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-4 h-4 rounded-full bg-blue-400" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-4 h-4 rounded-full bg-blue-400" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-4 h-4 rounded-full bg-blue-400" />
              </div>
            </motion.div>

            <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-col items-center p-6 border-2 rounded-xl bg-green-500/10 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)] w-48 text-center relative"
            >
              <div className="absolute -top-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">CPU Scheduler</div>
              <Cpu className="w-10 h-10 text-green-500 mb-2" />
              <span className="font-mono font-bold text-lg text-green-700 dark:text-green-400">CPU</span>
            </motion.div>

            <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-col items-center p-4 border rounded-xl bg-card w-40 text-center shadow-sm"
            >
              <div className="w-8 h-8 rounded-full border-2 border-muted-foreground flex items-center justify-center mb-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              </div>
              <span className="font-mono font-bold text-sm">Completed</span>
            </motion.div>

          </div>
          
          <div className="flex justify-center mt-8 md:mt-2">
            <svg className="w-full max-w-xl h-16 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-muted-foreground" />
                </marker>
              </defs>
              <path d="M 400 10 C 400 40, 200 40, 200 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-muted-foreground" markerEnd="url(#arrow)" />
              <text x="300" y="55" textAnchor="middle" className="text-xs font-mono fill-muted-foreground">I/O Wait / Preemption</text>
            </svg>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "CPU Utilization", desc: "Keep CPU as busy as possible." },
          { title: "Throughput", desc: "Number of processes completed per time unit." },
          { title: "Turnaround Time", desc: "Time from submission to completion." },
          { title: "Waiting Time", desc: "Total time spent waiting in the ready queue." },
          { title: "Response Time", desc: "Time from submission to first execution." }
        ].map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
            <Card className="h-full border-l-4 border-l-primary hover:bg-accent/5 transition-colors">
              <CardContent className="p-4">
                <h4 className="font-bold font-mono text-sm mb-1">{m.title}</h4>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}