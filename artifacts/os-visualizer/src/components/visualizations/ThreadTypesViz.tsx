import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Server, ArrowDown, Users, XCircle, RefreshCw } from "lucide-react";

export function ThreadTypesViz() {
  const [isBlocked, setIsBlocked] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">User-Level vs Kernel-Level Threads</CardTitle>
        <CardDescription>
          See how a blocking operation affects the entire process differently depending on the thread model.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="flex justify-center mb-6">
          <Button 
            variant={isBlocked ? "outline" : "destructive"} 
            onClick={() => setIsBlocked(!isBlocked)}
            className="w-48 font-mono"
            data-testid="button-toggle-block"
          >
            {isBlocked ? (
              <><RefreshCw className="w-4 h-4 mr-2" /> Reset state</>
            ) : (
              <><XCircle className="w-4 h-4 mr-2" /> Block Thread 1</>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* User-Level Threads */}
          <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col relative overflow-hidden">
            <h3 className="font-mono font-bold text-center mb-6 border-b pb-2">User-Level Threads (ULT)</h3>
            
            {/* The Stack */}
            <div className="flex-1 flex flex-col items-center gap-4 relative z-10">
              
              {/* User Space */}
              <div className={`w-full max-w-[280px] p-4 border rounded-lg transition-colors ${isBlocked ? 'bg-slate-100 dark:bg-slate-800 border-slate-300' : 'bg-blue-500/10 border-blue-500/30'}`}>
                <div className="text-xs font-mono text-center mb-2 text-muted-foreground">User Space</div>
                <div className="flex gap-2 justify-center mb-3">
                  <ThreadCircle label="T1" status={isBlocked ? "blocked" : "running"} />
                  <ThreadCircle label="T2" status={isBlocked ? "blocked" : "running"} />
                  <ThreadCircle label="T3" status={isBlocked ? "blocked" : "running"} />
                </div>
                <div className="bg-background border text-xs font-mono text-center p-2 rounded">
                  Thread Library
                </div>
              </div>
              
              <div className="flex flex-col items-center text-muted-foreground">
                <ArrowDown className="w-5 h-5" />
                <span className="text-[10px] font-mono">1:1 Process Mapping</span>
                <ArrowDown className="w-5 h-5" />
              </div>

              {/* Kernel Space */}
              <div className={`w-full max-w-[280px] p-4 border rounded-lg transition-colors ${isBlocked ? 'bg-rose-500/10 border-rose-500/30' : 'bg-primary/5 border-primary/20'}`}>
                <div className="text-xs font-mono text-center mb-2 text-muted-foreground">Kernel Space</div>
                <div className="flex justify-center mb-2">
                  <div className={`p-3 rounded-full border-2 ${isBlocked ? 'border-rose-500 text-rose-500 bg-rose-500/20' : 'border-primary text-primary bg-primary/20'} font-mono font-bold flex items-center justify-center`}>
                    Process
                  </div>
                </div>
              </div>
              
              {isBlocked && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-3 rounded-lg border-2 border-rose-500 shadow-xl text-center z-20 w-3/4"
                >
                  <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                  <div className="font-mono text-sm font-bold text-rose-500">Entire Process Blocked!</div>
                  <div className="text-xs text-muted-foreground mt-1">Kernel only sees one process. If one thread blocks, all threads stop.</div>
                </motion.div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t text-sm font-mono space-y-1 text-muted-foreground">
              <div className="text-green-500">✓ Fast creation/switch</div>
              <div className="text-green-500">✓ No kernel involvement</div>
              <div className="text-rose-500">✗ One block stops all</div>
              <div className="text-rose-500">✗ No true parallelism</div>
            </div>
          </div>

          {/* Kernel-Level Threads */}
          <div className="border rounded-xl p-4 bg-card shadow-sm flex flex-col relative overflow-hidden">
            <h3 className="font-mono font-bold text-center mb-6 border-b pb-2">Kernel-Level Threads (KLT)</h3>
            
            {/* The Stack */}
            <div className="flex-1 flex flex-col items-center gap-4 relative z-10">
              
              {/* User Space */}
              <div className="w-full max-w-[280px] p-4 border rounded-lg bg-blue-500/10 border-blue-500/30">
                <div className="text-xs font-mono text-center mb-2 text-muted-foreground">User Space</div>
                <div className="flex gap-2 justify-center">
                  <ThreadCircle label="T1" status={isBlocked ? "blocked" : "running"} />
                  <ThreadCircle label="T2" status={"running"} />
                  <ThreadCircle label="T3" status={"running"} />
                </div>
              </div>
              
              <div className="flex justify-center gap-6 w-full text-muted-foreground">
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-5 h-5" />
                  <span className="text-[10px] font-mono">1:1</span>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-5 h-5" />
                  <span className="text-[10px] font-mono">1:1</span>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-5 h-5" />
                  <span className="text-[10px] font-mono">1:1</span>
                </div>
              </div>

              {/* Kernel Space */}
              <div className="w-full max-w-[280px] p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="text-xs font-mono text-center mb-2 text-muted-foreground">Kernel Space</div>
                <div className="flex justify-center gap-2">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-xs ${isBlocked ? 'border-rose-500 text-rose-500 bg-rose-500/20' : 'border-primary text-primary bg-primary/20'}`}>K1</div>
                  <div className="w-12 h-12 rounded-full border-2 border-primary text-primary bg-primary/20 flex items-center justify-center font-mono text-xs">K2</div>
                  <div className="w-12 h-12 rounded-full border-2 border-primary text-primary bg-primary/20 flex items-center justify-center font-mono text-xs">K3</div>
                </div>
              </div>
              
              {isBlocked && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm p-3 rounded-lg border-2 border-green-500 shadow-xl text-center z-20 w-3/4"
                >
                  <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-mono text-sm font-bold text-green-500">Others Keep Running!</div>
                  <div className="text-xs text-muted-foreground mt-1">Kernel manages threads individually. T2 and T3 are unaffected.</div>
                </motion.div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t text-sm font-mono space-y-1 text-muted-foreground">
              <div className="text-green-500">✓ One block doesn't stop others</div>
              <div className="text-green-500">✓ True parallelism across cores</div>
              <div className="text-rose-500">✗ Slower creation/switch</div>
              <div className="text-rose-500">✗ Kernel overhead</div>
            </div>
          </div>

        </div>

        <div className="p-4 bg-muted/50 border rounded-lg mt-8 flex items-start gap-4">
          <Server className="w-8 h-8 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-mono font-bold">The Hybrid Approach (Many-to-Many)</h4>
            <p className="text-sm text-muted-foreground">
              Modern systems sometimes use a Many-to-Many model where multiplexing allows many user-level threads to be mapped to a smaller or equal number of kernel threads. This provides the fast creation of ULTs while retaining the parallelism of KLTs.
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

function ThreadCircle({ label, status }: { label: string, status: "running" | "blocked" }) {
  return (
    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono text-sm relative transition-colors ${
      status === "blocked" 
        ? "border-rose-500 bg-rose-500/10 text-rose-500" 
        : "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
    }`}>
      {label}
      {status === "running" && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-blue-500"
        />
      )}
      {status === "blocked" && (
        <div className="absolute -top-1 -right-1 bg-background rounded-full">
          <XCircle className="w-4 h-4 text-rose-500" />
        </div>
      )}
    </div>
  );
}