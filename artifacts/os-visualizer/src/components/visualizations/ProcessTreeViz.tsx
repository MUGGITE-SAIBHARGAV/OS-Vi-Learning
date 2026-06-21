import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Skull } from "lucide-react";

interface ProcessNode {
  id: number;
  pid: number;
  ppid: number | null;
  state: 'RUNNING' | 'ZOMBIE' | 'ORPHAN' | 'TERMINATED';
  children: number[];
}

export function ProcessTreeViz() {
  const [nodes, setNodes] = useState<ProcessNode[]>([
    { id: 1, pid: 1, ppid: null, state: 'RUNNING', children: [] }
  ]);
  const [nextPid, setNextPid] = useState(2);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [lastAction, setLastAction] = useState<string>("init started.");

  const handleFork = () => {
    if (!selectedId) return;
    const parent = nodes.find(n => n.id === selectedId);
    if (!parent || parent.state !== 'RUNNING') return;
    if (parent.children.length >= 2) return; 

    const newNode: ProcessNode = {
      id: nextPid,
      pid: nextPid,
      ppid: parent.pid,
      state: 'RUNNING',
      children: []
    };

    setNodes(prev => prev.map(n => 
      n.id === selectedId ? { ...n, children: [...n.children, newNode.id] } : n
    ).concat(newNode));
    setNextPid(p => p + 1);
    setLastAction(`pid ${parent.pid} called fork(), created child pid ${nextPid}.`);
  };

  const handleTerminate = () => {
    if (!selectedId || selectedId === 1) return; 
    setNodes(prev => prev.map(n => {
      if (n.id === selectedId) return { ...n, state: 'ZOMBIE' };
      if (n.ppid === selectedId && n.state !== 'ZOMBIE') return { ...n, state: 'ORPHAN' };
      return n;
    }));
    setLastAction(`pid ${selectedId} called exit(), became zombie.`);
  };

  const handleWait = () => {
    if (!selectedId) return;
    let childZombieCleared = false;
    setNodes(prev => prev.filter(n => {
      if (n.ppid === selectedId && n.state === 'ZOMBIE') {
        childZombieCleared = true;
        return false;
      }
      return true;
    }));
    if (childZombieCleared) {
      setLastAction(`pid ${selectedId} called wait(), reaped zombie child.`);
    } else {
      setLastAction(`pid ${selectedId} called wait(), no zombie child to reap.`);
    }
  };

  const handleReset = () => {
    setNodes([{ id: 1, pid: 1, ppid: null, state: 'RUNNING', children: [] }]);
    setNextPid(2);
    setSelectedId(1);
    setLastAction("init restarted.");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-mono flex items-center">
          <Network className="w-5 h-5 mr-2" />
          Process Tree Simulation
        </CardTitle>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" onClick={handleReset}>Reset Tree</Button>
        </div>
      </CardHeader>
      <CardContent>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 border rounded-xl bg-card p-8 flex justify-center min-h-[400px] overflow-auto">
             <div className="flex flex-col items-center w-full">
               <TreeLevel nodes={nodes} parentId={1} selectedId={selectedId} onSelect={setSelectedId} />
             </div>
           </div>
           <div className="flex flex-col gap-4">
             <Card className="bg-muted border-none shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono">Controls</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button onClick={handleFork} disabled={!selectedId || nodes.find(n => n.id === selectedId)?.state !== 'RUNNING' || (nodes.find(n => n.id === selectedId)?.children.length ?? 0) >= 2}>fork() Child</Button>
                  <Button variant="destructive" onClick={handleTerminate} disabled={!selectedId || selectedId === 1 || nodes.find(n => n.id === selectedId)?.state !== 'RUNNING'}>exit() / Terminate</Button>
                  <Button variant="secondary" onClick={handleWait} disabled={!selectedId || nodes.find(n => n.id === selectedId)?.state !== 'RUNNING'}>wait() on Children</Button>
                </CardContent>
             </Card>
             <Card className="bg-slate-900 text-slate-300 border-none shadow-none font-mono text-xs overflow-hidden">
                <CardHeader className="pb-2 bg-slate-950">
                  <CardTitle className="text-xs text-white">Code Mapping</CardTitle>
                </CardHeader>
                <CardContent className="p-4 opacity-90">
                  <pre className="whitespace-pre-wrap">
                    <span className="text-pink-400">pid_t</span> pid = fork();{'\n'}
                    <span className="text-blue-400">if</span> (pid == <span className="text-yellow-400">0</span>) {'{\n'}
                    {'  '}// Child process{'\n'}
                    {'  '}exec(...);{'\n'}
                    {'  '}exit(<span className="text-yellow-400">0</span>);{'\n'}
                    {'}'} <span className="text-blue-400">else</span> {'{\n'}
                    {'  '}// Parent process{'\n'}
                    {'  '}wait(NULL);{'\n'}
                    {'}'}
                  </pre>
                </CardContent>
             </Card>
             <div className="bg-black/90 text-green-400 p-3 rounded font-mono text-xs shadow-inner">
               &gt; {lastAction}
             </div>
           </div>
         </div>
      </CardContent>
    </Card>
  );
}

function TreeLevel({ nodes, parentId, selectedId, onSelect }: { nodes: ProcessNode[], parentId: number, selectedId: number | null, onSelect: (id: number) => void }) {
  const node = nodes.find(n => n.id === parentId);
  if (!node) return null;

  const children = nodes.filter(n => n.ppid === parentId);

  return (
    <div className="flex flex-col items-center">
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={() => onSelect(node.id)}
        className={`px-6 py-3 border-2 rounded-lg font-mono text-sm cursor-pointer transition-all min-w-[120px] text-center ${
          selectedId === node.id ? 'border-primary ring-4 ring-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'border-border bg-card hover:border-primary/50'
        } ${node.state === 'ZOMBIE' ? 'border-dashed border-red-500 opacity-70' : ''}
          ${node.state === 'ORPHAN' ? 'border-amber-500' : ''}
        `}
      >
        <div className="font-bold">{parentId === 1 ? 'init (1)' : `PID: ${node.pid}`}</div>
        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
          {node.state === 'ZOMBIE' && <Skull className="w-3 h-3 text-red-500" />}
          {node.state}
        </div>
      </motion.div>

      {children.length > 0 && (
        <div className="flex justify-center gap-12 mt-12 relative w-full px-8">
          {/* Horizontal line for siblings */}
          {children.length > 1 && (
            <div className="absolute top-[-24px] left-[25%] right-[25%] h-px bg-border"></div>
          )}
          
          {children.map(child => (
            <div key={child.id} className="relative before:content-[''] before:absolute before:top-[-24px] before:left-1/2 before:w-px before:h-[24px] before:bg-border before:-translate-x-1/2 after:content-[''] after:absolute after:bottom-full after:left-1/2 after:w-px after:h-[24px] after:bg-border after:-translate-x-1/2">
              <TreeLevel nodes={nodes} parentId={child.id} selectedId={selectedId} onSelect={onSelect} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
