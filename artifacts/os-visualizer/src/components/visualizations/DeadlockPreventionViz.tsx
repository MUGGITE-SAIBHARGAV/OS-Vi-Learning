import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DeadlockPreventionViz() {
  const [activeTab, setActiveTab] = useState<'prevention' | 'recovery'>('prevention');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono flex items-center justify-between">
          <span>Deadlock Prevention & Recovery</span>
          <div className="flex gap-2">
            <Button variant={activeTab === 'prevention' ? 'default' : 'outline'} onClick={() => setActiveTab('prevention')} size="sm">Prevention</Button>
            <Button variant={activeTab === 'recovery' ? 'default' : 'outline'} onClick={() => setActiveTab('recovery')} size="sm">Recovery</Button>
          </div>
        </CardTitle>
        <CardDescription>
          {activeTab === 'prevention' ? "Design the system so deadlock is structurally impossible." : "Let deadlocks happen, detect them, and break them."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        
        <AnimatePresence mode="popLayout">
          {activeTab === 'prevention' ? (
            <motion.div key="prevention" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="border rounded-xl p-4 bg-card">
                <h3 className="font-bold text-primary mb-2">1. Break Mutual Exclusion</h3>
                <p className="text-sm mb-4">Use spooling / virtualize resources. Multiple processes write to a print queue; only spooler accesses printer.</p>
                <div className="bg-muted p-2 rounded text-xs text-muted-foreground border-l-2 border-amber-500">
                  Limitation: Not always possible — some resources (like updating a specific database row) are inherently non-sharable.
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-card">
                <h3 className="font-bold text-primary mb-2">2. Break Hold and Wait</h3>
                <p className="text-sm mb-4">Request ALL resources upfront before starting, OR release all currently held resources before requesting more.</p>
                <div className="bg-muted p-2 rounded text-xs text-muted-foreground border-l-2 border-amber-500">
                  Limitation: Low resource utilization (holding resources when not actively using them) and possible starvation.
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-card">
                <h3 className="font-bold text-primary mb-2">3. Break No Preemption</h3>
                <p className="text-sm mb-4">If a process's request cannot be satisfied immediately, preempt (take) its held resources and add them to the Available pool.</p>
                <div className="bg-muted p-2 rounded text-xs text-muted-foreground border-l-2 border-amber-500">
                  Limitation: Can cause cascading rollbacks; only suitable for resources whose state can be easily saved/restored (like CPU registers).
                </div>
              </div>

              <div className="border rounded-xl p-4 bg-card">
                <h3 className="font-bold text-primary mb-2">4. Break Circular Wait</h3>
                <p className="text-sm mb-4">Assign a total ordering to all resources. Processes must request resources in strictly increasing order (e.g., cannot request R1 if holding R2).</p>
                <div className="bg-muted p-2 rounded text-xs text-muted-foreground border-l-2 border-amber-500">
                  Limitation: May force inefficient ordering; hard to maintain strict global numbering in dynamic systems.
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div key="recovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              
              <div className="border-2 border-destructive/50 rounded-xl p-6 bg-destructive/5">
                <h3 className="font-bold text-destructive text-lg mb-2">Option A: Terminate Process</h3>
                <p className="text-sm mb-4 text-foreground">Abort deadlocked processes to break the cycle.</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                  <li><strong>Abort all:</strong> Fast, guarantees deadlock is broken, but extreme loss of partial work.</li>
                  <li><strong>Abort one by one:</strong> Kill a victim, run detection algorithm. Repeat until cycle breaks. Slower but saves some work.</li>
                </ul>
              </div>

              <div className="border-2 border-amber-500/50 rounded-xl p-6 bg-amber-500/5">
                <h3 className="font-bold text-amber-600 dark:text-amber-500 text-lg mb-2">Option B: Resource Preemption</h3>
                <p className="text-sm mb-4 text-foreground">Select a victim, preempt its resources, and give them to another process.</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                  <li><strong>Selecting a victim:</strong> Need to minimize cost (process priority, how much longer it needs to run).</li>
                  <li><strong>Rollback:</strong> Must rollback the victim process to a safe state before preemption occurred.</li>
                  <li><strong>Starvation:</strong> Must ensure the same process isn't always picked as the victim.</li>
                </ul>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg text-center font-mono text-sm border">
                <strong>The Ostrich Algorithm:</strong> In practice, most general-purpose OSes (Windows, Linux, macOS) ignore deadlocks in user processes completely. The user handles it by force-quitting the frozen application.
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </CardContent>
    </Card>
  );
}
