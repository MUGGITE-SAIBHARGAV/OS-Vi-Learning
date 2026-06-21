import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, FastForward, Clock } from "lucide-react";

export function SyncRequirementsViz() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Mutual Exclusion */}
      <Card className="hover:border-primary/50 transition-colors group overflow-hidden">
        <CardHeader className="bg-muted/50 pb-4">
          <div className="flex justify-between items-start mb-2">
            <Users className="w-6 h-6 text-primary" />
            <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30">Only 1 at a time</Badge>
          </div>
          <CardTitle className="text-xl">Mutual Exclusion</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-32 bg-card border rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="w-1/2 h-full border-r border-dashed flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900">
              <span className="text-xs text-muted-foreground font-mono">Waiting</span>
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 rounded-full bg-amber-500 opacity-50" />
            </div>
            <div className="w-1/2 h-full flex flex-col items-center justify-center bg-primary/5">
              <span className="text-xs text-primary font-mono mb-2">Critical Section</span>
              <motion.div className="w-8 h-8 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-1 h-12 bg-destructive rotate-45 group-hover:scale-110 transition-transform"></div>
              <div className="w-1 h-12 bg-destructive -rotate-45 absolute top-0 left-0 group-hover:scale-110 transition-transform"></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            If process Pi is executing in its critical section, then no other processes can be executing in their critical sections.
          </p>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="hover:border-green-500/50 transition-colors group overflow-hidden">
        <CardHeader className="bg-muted/50 pb-4">
          <div className="flex justify-between items-start mb-2">
            <FastForward className="w-6 h-6 text-green-500" />
            <Badge variant="outline" className="text-green-500 border-green-500/30">No unnecessary blocking</Badge>
          </div>
          <CardTitle className="text-xl">Progress</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-32 bg-card border rounded-lg mb-4 flex items-center justify-center relative px-4">
            <div className="flex-1 flex gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500" />
              <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500" />
            </div>
            <motion.div 
              animate={{ x: [0, 20, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-green-500 font-bold mx-2"
            >
              →
            </motion.div>
            <div className="w-1/2 h-full border-l border-dashed flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground font-mono mb-2">Empty CS</span>
              <div className="w-full h-8 border-2 border-green-500/30 rounded border-dashed group-hover:bg-green-500/5 transition-colors"></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            If no process is in its critical section and some processes wish to enter, the selection cannot be postponed indefinitely.
          </p>
        </CardContent>
      </Card>

      {/* Bounded Waiting */}
      <Card className="hover:border-amber-500/50 transition-colors group overflow-hidden">
        <CardHeader className="bg-muted/50 pb-4">
          <div className="flex justify-between items-start mb-2">
            <Clock className="w-6 h-6 text-amber-500" />
            <Badge variant="outline" className="text-amber-500 border-amber-500/30">No starvation</Badge>
          </div>
          <CardTitle className="text-xl">Bounded Waiting</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-32 bg-card border rounded-lg mb-4 flex flex-col items-center justify-center relative p-2">
            <div className="w-full flex justify-between px-4 mb-2">
              <span className="text-[10px] font-mono text-muted-foreground">Waits: 1</span>
              <span className="text-[10px] font-mono text-amber-500 font-bold">Waits: 3 (MAX)</span>
              <span className="text-[10px] font-mono text-muted-foreground">Waits: 0</span>
            </div>
            <div className="w-full flex justify-between px-4">
              <div className="w-6 h-6 rounded-full bg-primary/30" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-6 h-6 rounded-full bg-amber-500 ring-2 ring-amber-500/50 ring-offset-2 ring-offset-card" 
              />
              <div className="w-6 h-6 rounded-full bg-primary/30" />
            </div>
            <div className="mt-4 text-xs font-mono text-amber-500 border-t w-full text-center pt-1 group-hover:text-amber-600 transition-colors">Must go next!</div>
          </div>
          <p className="text-sm text-muted-foreground">
            There exists a bound on the number of times that other processes are allowed to enter their critical sections after a process has made a request.
          </p>
        </CardContent>
      </Card>

    </div>
  );
}