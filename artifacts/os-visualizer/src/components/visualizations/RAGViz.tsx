import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GraphState = "deadlock" | "no-deadlock" | "manual";

export function RAGViz() {
  const [scenario, setScenario] = useState<GraphState>("deadlock");
  
  // Custom manual states
  const [manualEdges, setManualEdges] = useState<{from: string, to: string, type: 'req' | 'assign'}[]>([]);

  const handleScenario = (s: GraphState) => {
    setScenario(s);
    if (s !== "manual") {
      setManualEdges([]);
    }
  };

  const isDeadlock = scenario === "deadlock" || (scenario === "manual" && checkCycle(manualEdges));

  function checkCycle(edges: {from: string, to: string, type: string}[]) {
    // Basic cycle detection for manual mode (P1, P2, R1, R2 only for simplicity)
    const adj = new Map<string, string[]>();
    edges.forEach(e => {
      if (!adj.has(e.from)) adj.set(e.from, []);
      adj.get(e.from)!.push(e.to);
    });

    const visited = new Set<string>();
    const recStack = new Set<string>();
    
    function isCyclicUtil(node: string): boolean {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;
      
      visited.add(node);
      recStack.add(node);
      
      const children = adj.get(node) || [];
      for (let child of children) {
        if (isCyclicUtil(child)) return true;
      }
      recStack.delete(node);
      return false;
    }

    const nodes = Array.from(new Set(edges.flatMap(e => [e.from, e.to])));
    for (let node of nodes) {
      if (isCyclicUtil(node)) return true;
    }
    return false;
  }

  const addManualEdge = (from: string, to: string, type: 'req' | 'assign') => {
    setScenario("manual");
    setManualEdges(prev => {
      // avoid duplicates
      if (prev.some(e => e.from === from && e.to === to)) return prev;
      return [...prev, {from, to, type}];
    });
  };

  // Node positions
  const nodes = {
    P1: { x: 150, y: 100, label: "P1", type: "process" },
    P2: { x: 450, y: 100, label: "P2", type: "process" },
    P3: { x: 300, y: 300, label: "P3", type: "process" },
    R1: { x: 300, y: 100, label: "R1", type: "resource" },
    R2: { x: 150, y: 300, label: "R2", type: "resource" },
    R3: { x: 450, y: 300, label: "R3", type: "resource" }
  };

  // Edges based on scenario
  let activeEdges: {from: string, to: string, type: 'req' | 'assign'}[] = [];
  
  if (scenario === "deadlock") {
    activeEdges = [
      { from: "P1", to: "R2", type: "req" },
      { from: "R1", to: "P1", type: "assign" },
      { from: "P2", to: "R1", type: "req" },
      { from: "R2", to: "P2", type: "assign" },
    ];
  } else if (scenario === "no-deadlock") {
    activeEdges = [
      { from: "R1", to: "P1", type: "assign" },
      { from: "P1", to: "R2", type: "req" },
      { from: "R2", to: "P2", type: "assign" },
      { from: "R3", to: "P3", type: "assign" }
    ];
  } else {
    activeEdges = manualEdges;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-mono">Resource Allocation Graph</CardTitle>
        <CardDescription>
          Cycles in a RAG with single-instance resources indicate a deadlock.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex flex-wrap gap-2">
          <Button variant={scenario === "no-deadlock" ? "default" : "outline"} onClick={() => handleScenario("no-deadlock")}>
            No Deadlock
          </Button>
          <Button variant={scenario === "deadlock" ? "default" : "outline"} onClick={() => handleScenario("deadlock")}>
            Deadlock
          </Button>
          <Button variant={scenario === "manual" ? "default" : "outline"} onClick={() => handleScenario("manual")}>
            Manual Mode
          </Button>
        </div>

        <div className={`relative h-[400px] border-4 rounded-xl transition-colors duration-300 bg-card overflow-hidden ${isDeadlock ? 'border-destructive' : 'border-border'}`}>
          
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <marker id="arrow-req" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
              <marker id="arrow-req-red" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--destructive))" />
              </marker>
              <marker id="arrow-assign" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--emerald-500))" />
              </marker>
              <marker id="arrow-assign-red" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--destructive))" />
              </marker>
            </defs>

            {/* Edges */}
            {activeEdges.map((e, idx) => {
              const fromNode = nodes[e.from as keyof typeof nodes];
              const toNode = nodes[e.to as keyof typeof nodes];
              if (!fromNode || !toNode) return null;
              
              const isReq = e.type === "req";
              const strokeColor = isDeadlock ? "hsl(var(--destructive))" : (isReq ? "hsl(var(--primary))" : "hsl(var(--emerald-500))");
              const marker = isDeadlock ? (isReq ? "url(#arrow-req-red)" : "url(#arrow-assign-red)") : (isReq ? "url(#arrow-req)" : "url(#arrow-assign)");
              
              return (
                <motion.line
                  key={`${e.from}-${e.to}-${idx}`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth="3"
                  strokeDasharray={isReq ? "6 6" : "none"}
                  markerEnd={marker}
                />
              );
            })}

            {/* Nodes */}
            {Object.entries(nodes).map(([id, n]) => {
              const isProcess = n.type === "process";
              return (
                <g key={id} transform={`translate(${n.x}, ${n.y})`}>
                  {isProcess ? (
                    <circle r="20" fill="hsl(var(--card))" stroke="hsl(var(--violet-500))" strokeWidth="3" />
                  ) : (
                    <rect x="-20" y="-20" width="40" height="40" fill="hsl(var(--card))" stroke="hsl(var(--amber-500))" strokeWidth="3" rx="4" />
                  )}
                  <text textAnchor="middle" dy="5" fontSize="14" fontWeight="bold" fill="currentColor">{n.label}</text>
                  {!isProcess && <circle cx="0" cy="0" r="3" fill="hsl(var(--amber-500))" />}
                </g>
              );
            })}
          </svg>

          {/* Banner */}
          {isDeadlock && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground px-6 py-2 rounded-full font-bold shadow-lg"
            >
              CYCLE DETECTED — DEADLOCK
            </motion.div>
          )}

        </div>

        {scenario === "manual" && (
          <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <div className="font-mono text-sm font-bold">Manual Mode Controls (Simplified)</div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => addManualEdge("P1", "R1", "req")}>P1 requests R1</Button>
              <Button size="sm" variant="outline" onClick={() => addManualEdge("R1", "P1", "assign")}>R1 holds P1</Button>
              <Button size="sm" variant="outline" onClick={() => addManualEdge("P1", "R2", "req")}>P1 requests R2</Button>
              <Button size="sm" variant="outline" onClick={() => addManualEdge("R2", "P2", "assign")}>R2 holds P2</Button>
              <Button size="sm" variant="outline" onClick={() => addManualEdge("P2", "R1", "req")}>P2 requests R1</Button>
              <Button size="sm" variant="destructive" onClick={() => setManualEdges([])}>Clear All</Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
