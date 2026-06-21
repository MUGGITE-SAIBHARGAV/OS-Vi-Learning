import { Process } from "@/lib/scheduling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, Plus, Download } from "lucide-react";

interface ProcessInputPanelProps {
  processes: Process[];
  onChange: (processes: Process[]) => void;
  showPriority?: boolean;
}

export function ProcessInputPanel({ processes, onChange, showPriority = false }: ProcessInputPanelProps) {
  const updateProcess = (id: string, field: keyof Process, value: number) => {
    onChange(processes.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProcess = (id: string) => {
    onChange(processes.filter(p => p.id !== id));
  };

  const addProcess = () => {
    const nextId = processes.length > 0 ? Math.max(...processes.map(p => parseInt(p.id.replace('P', '') || '0'))) + 1 : 1;
    onChange([...processes, {
      id: `P${nextId}`,
      arrivalTime: 0,
      burstTime: 1,
      priority: 1
    }]);
  };

  const loadSample = () => {
    onChange([
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 4 },
      { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 3 },
      { id: 'P5', arrivalTime: 4, burstTime: 2, priority: 5 }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 font-mono">PID</TableHead>
              <TableHead className="font-mono">Arrival Time</TableHead>
              <TableHead className="font-mono">Burst Time</TableHead>
              {showPriority && <TableHead className="font-mono">Priority</TableHead>}
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processes.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono font-medium">{p.id}</TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    min={0} 
                    value={p.arrivalTime} 
                    onChange={(e) => updateProcess(p.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                    className="h-8 w-24 font-mono"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    min={1} 
                    value={p.burstTime} 
                    onChange={(e) => updateProcess(p.id, 'burstTime', Math.max(1, parseInt(e.target.value) || 1))}
                    className={`h-8 w-24 font-mono ${p.burstTime < 1 ? 'border-red-500' : ''}`}
                  />
                </TableCell>
                {showPriority && (
                  <TableCell>
                    <Input 
                      type="number" 
                      min={1} 
                      value={p.priority} 
                      onChange={(e) => updateProcess(p.id, 'priority', parseInt(e.target.value) || 1)}
                      className="h-8 w-24 font-mono"
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeProcess(p.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addProcess}>
          <Plus className="w-4 h-4 mr-1" /> Add Process
        </Button>
        <Button variant="outline" size="sm" onClick={loadSample}>
          <Download className="w-4 h-4 mr-1" /> Load Sample
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onChange([])}>
          Clear All
        </Button>
      </div>
    </div>
  );
}