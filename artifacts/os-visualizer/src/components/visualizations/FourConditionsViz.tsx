import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Lock, AlertTriangle, ShieldOff, ArrowRight } from "lucide-react";

export function FourConditionsViz() {
  const [mutex, setMutex] = useState(true);
  const [holdWait, setHoldWait] = useState(true);
  const [noPreempt, setNoPreempt] = useState(true);
  const [circularWait, setCircularWait] = useState(true);

  const activeCount = [mutex, holdWait, noPreempt, circularWait].filter(Boolean).length;
  const isDeadlock = activeCount === 4;

  const getPreventedReason = () => {
    if (!mutex) return "Mutual Exclusion broken (Resources sharable)";
    if (!holdWait) return "Hold & Wait broken (No holding while waiting)";
    if (!noPreempt) return "No Preemption broken (Resources preemptable)";
    if (!circularWait) return "Circular Wait broken (Linear ordering)";
    return "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Four Necessary Conditions</CardTitle>
        <CardDescription>
          Toggle conditions to see how breaking even one prevents deadlock.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mutual Exclusion */}
          <div className={`border-2 rounded-xl p-4 transition-colors ${mutex ? 'border-primary' : 'border-muted'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Mutual Exclusion</h3>
              <Switch checked={mutex} onCheckedChange={setMutex} data-testid="switch-mutex" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 h-8">
              Only one process can use a resource at a time.
            </p>
            <div className="h-20 bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Lock className={`w-8 h-8 ${mutex ? 'text-primary' : 'text-muted-foreground opacity-30'}`} />
              {!mutex && (
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full opacity-50" />
                  <div className="w-6 h-6 bg-green-500 rounded-full opacity-50" />
                </div>
              )}
            </div>
          </div>

          {/* Hold and Wait */}
          <div className={`border-2 rounded-xl p-4 transition-colors ${holdWait ? 'border-primary' : 'border-muted'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Hold and Wait</h3>
              <Switch checked={holdWait} onCheckedChange={setHoldWait} data-testid="switch-holdwait" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 h-8">
              Holding a resource while waiting for another.
            </p>
            <div className="h-20 bg-muted/50 rounded-lg flex items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold relative">
                P
                {holdWait && (
                  <div className="absolute -left-6 w-4 h-4 bg-amber-500 rounded-sm" />
                )}
              </div>
              {holdWait && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              {holdWait && <div className="w-6 h-6 border-2 border-amber-500 rounded-sm" />}
            </div>
          </div>

          {/* No Preemption */}
          <div className={`border-2 rounded-xl p-4 transition-colors ${noPreempt ? 'border-primary' : 'border-muted'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">No Preemption</h3>
              <Switch checked={noPreempt} onCheckedChange={setNoPreempt} data-testid="switch-nopreempt" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 h-8">
              Resources cannot be forcibly taken.
            </p>
            <div className="h-20 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-violet-500" />
                <div className="w-8 h-8 bg-amber-500 rounded-sm flex items-center justify-center">
                  {noPreempt ? <Lock className="w-4 h-4 text-white" /> : <ShieldOff className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Circular Wait */}
          <div className={`border-2 rounded-xl p-4 transition-colors ${circularWait ? 'border-primary' : 'border-muted'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Circular Wait</h3>
              <Switch checked={circularWait} onCheckedChange={setCircularWait} data-testid="switch-circularwait" />
            </div>
            <p className="text-xs text-muted-foreground mb-4 h-8">
              A closed chain of waiting processes.
            </p>
            <div className="h-20 bg-muted/50 rounded-lg flex items-center justify-center">
              <motion.div 
                animate={{ rotate: circularWait ? 360 : 0 }} 
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="w-12 h-12 border-4 border-dashed border-primary rounded-full relative"
              >
                {!circularWait && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-destructive rotate-45" />}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div className={`mt-8 p-6 rounded-xl border-4 text-center transition-colors duration-300 ${isDeadlock ? 'border-destructive bg-destructive/10' : 'border-green-500 bg-green-500/10'}`}>
          <div className="font-mono text-sm mb-2 text-muted-foreground">
            {activeCount} of 4 conditions active
          </div>
          
          {isDeadlock ? (
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive"
            >
              <AlertTriangle className="w-8 h-8" />
              DEADLOCK POSSIBLE
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="text-2xl font-bold text-green-500">
                DEADLOCK PREVENTED
              </div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">
                {getPreventedReason()}
              </div>
            </div>
          )}
          
          <div className="mt-4 text-sm font-medium text-foreground">
            Deadlock requires ALL four conditions simultaneously.
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
