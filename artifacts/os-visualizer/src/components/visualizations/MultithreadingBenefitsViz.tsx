import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Share2, Wallet, Scaling, Monitor, FileVideo, Play } from "lucide-react";

export function MultithreadingBenefitsViz() {
  const [activeTab, setActiveTab] = useState("browser");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => (t + 1) % 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Real-World Multithreading</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="browser" className="font-mono flex items-center gap-2"><Monitor className="w-4 h-4" /> Web Browser</TabsTrigger>
            <TabsTrigger value="video" className="font-mono flex items-center gap-2"><FileVideo className="w-4 h-4" /> Video Player</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 border rounded-xl overflow-hidden bg-slate-900 min-h-[300px] relative">
            <TabsContent value="browser" className="m-0 p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-48 shrink-0 font-mono text-sm text-slate-400">
                  <div className="text-blue-400 mb-1">Render Thread</div>
                  Draws the UI
                </div>
                <div className="flex-1 flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: tick > i * 15 ? 1 : 0.2 }}
                      className="h-16 w-16 bg-blue-500/20 border border-blue-500/50 rounded-lg flex items-center justify-center"
                    >
                      <div className="w-8 h-8 bg-blue-500/40 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-48 shrink-0 font-mono text-sm text-slate-400">
                  <div className="text-emerald-400 mb-1">Network Thread</div>
                  Downloads data
                </div>
                <div className="flex-1 flex items-center">
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500"
                      animate={{ width: `${Math.min(100, tick * 1.5)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-48 shrink-0 font-mono text-sm text-slate-400">
                  <div className="text-amber-400 mb-1">JS Engine Thread</div>
                  Executes logic
                </div>
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <motion.div animate={{ width: tick % 20 < 10 ? "80%" : "60%" }} className="h-2 bg-amber-500/50 rounded-full" />
                  <motion.div animate={{ width: tick % 30 < 15 ? "40%" : "90%" }} className="h-2 bg-amber-500/50 rounded-full" />
                  <motion.div animate={{ width: tick % 15 < 7 ? "70%" : "50%" }} className="h-2 bg-amber-500/50 rounded-full" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="m-0 p-6 space-y-6">
              <div className="flex gap-4">
                <div className="w-48 shrink-0 font-mono text-sm text-slate-400">
                  <div className="text-emerald-400 mb-1">Buffer Thread</div>
                  Fills memory ahead
                </div>
                <div className="flex-1 flex items-center relative h-8">
                  <div className="absolute inset-0 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-emerald-500/30"
                      animate={{ width: `${Math.min(100, (tick * 1.2) + 20)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-48 shrink-0 font-mono text-sm text-slate-400">
                  <div className="text-blue-400 mb-1">Decode Thread</div>
                  Processes frames
                </div>
                <div className="flex-1 flex items-center gap-1 overflow-hidden">
                  {Array.from({length: 20}).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: tick > i * 4 ? 1 : 0 }}
                      className="h-10 w-4 bg-blue-500"
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-48 shrink-0 font-mono text-sm text-slate-400">
                  <div className="text-amber-400 mb-1">UI Thread</div>
                  Keeps controls alive
                </div>
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 animate-pulse">
                    <Play className="w-4 h-4 ml-1" />
                  </div>
                  <div className="h-2 flex-1 bg-slate-800 rounded-full relative">
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <BenefitCard 
            icon={<Zap className="w-6 h-6 text-amber-500" />}
            title="Responsiveness"
            desc="UI never freezes. Long tasks happen in background threads."
          />
          <BenefitCard 
            icon={<Share2 className="w-6 h-6 text-blue-500" />}
            title="Resource Sharing"
            desc="Threads share process memory automatically without IPC."
          />
          <BenefitCard 
            icon={<Wallet className="w-6 h-6 text-emerald-500" />}
            title="Economy"
            desc="Creating threads is 10-100x cheaper than forking processes."
          />
          <BenefitCard 
            icon={<Scaling className="w-6 h-6 text-violet-500" />}
            title="Scalability"
            desc="Threads can run in parallel on multi-core architectures."
          />
        </div>

      </CardContent>
    </Card>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all group"
    >
      <div className="mb-3 p-2 bg-muted rounded-lg inline-block group-hover:bg-background transition-colors">
        {icon}
      </div>
      <h4 className="font-mono font-bold text-sm mb-2">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </motion.div>
  );
}