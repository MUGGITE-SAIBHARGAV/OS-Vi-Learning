import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function ThreadIntroViz() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Process vs Thread Memory Model</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="p-8 border-2 border-primary/20 rounded-xl bg-card relative min-h-[300px] flex gap-4">
          <div className="absolute top-0 left-0 bg-primary/20 text-primary font-mono px-4 py-1 rounded-br-lg font-bold">
            PROCESS (Shared Memory Space)
          </div>

          {/* Shared Process Space */}
          <div className="w-1/3 space-y-4 pt-10">
            <div className="p-4 bg-slate-500/20 border-2 border-slate-500/50 rounded-lg text-center font-mono text-slate-700 dark:text-slate-300">
              Code Segment
            </div>
            <div className="p-4 bg-slate-500/20 border-2 border-slate-500/50 rounded-lg text-center font-mono text-slate-700 dark:text-slate-300">
              Data Segment
            </div>
            <div className="p-4 bg-slate-500/20 border-2 border-slate-500/50 rounded-lg text-center font-mono text-slate-700 dark:text-slate-300">
              Files / Heap
            </div>
          </div>

          {/* Threads */}
          <div className="flex-1 flex gap-4 pt-10">
            {[1, 2, 3].map((thread) => (
              <motion.div
                key={thread}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: thread * 0.3 }}
                className="flex-1 border-2 border-blue-500/50 rounded-lg bg-blue-500/10 p-2 flex flex-col gap-2"
              >
                <div className="text-center font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">
                  Thread {thread}
                </div>
                <div className="p-2 bg-background border rounded text-center text-xs font-mono">
                  Stack
                </div>
                <div className="p-2 bg-background border rounded text-center text-xs font-mono">
                  Registers
                </div>
                <div className="p-2 bg-background border rounded text-center text-xs font-mono">
                  PC
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-500" />
                Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
                <li>• Separate isolated memory</li>
                <li>• Heavyweight creation</li>
                <li>• Expensive context switch</li>
                <li>• IPC for communication</li>
                <li>• Crash isolated</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Thread
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-foreground/80 font-mono">
                <li>• Shared memory within process</li>
                <li>• Lightweight creation</li>
                <li>• Cheap context switch</li>
                <li>• Direct shared memory comms</li>
                <li>• Crash kills entire process</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}