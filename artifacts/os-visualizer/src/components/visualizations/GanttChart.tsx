import { useState } from "react";
import { motion } from "framer-motion";
import { GanttBlock, Process } from "@/lib/scheduling";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GanttChartProps {
  gantt: GanttBlock[];
  processes: Process[];
  animationProgress: number; 
}

export function GanttChart({ gantt, animationProgress }: GanttChartProps) {
  const totalTime = gantt.length > 0 ? gantt[gantt.length - 1].endTime : 0;
  
  const getColor = (pid: string) => {
    if (pid === "IDLE") return "bg-gray-200 dark:bg-gray-800 text-gray-500";
    const colors = [
      "bg-primary/80 text-primary-foreground",
      "bg-blue-500 text-white",
      "bg-emerald-500 text-white",
      "bg-amber-500 text-white",
      "bg-rose-500 text-white",
      "bg-cyan-500 text-white",
      "bg-purple-400 text-white"
    ];
    const match = pid.match(/\d+/);
    if (match) {
      const idx = parseInt(match[0], 10) - 1;
      return colors[idx % colors.length];
    }
    return colors[0];
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[600px] relative mt-4 mb-8 h-24">
        <div className="absolute inset-0 flex border-y border-l bg-muted/20">
          <TooltipProvider>
            {gantt.map((block, idx) => {
              const widthPct = totalTime > 0 ? ((block.endTime - block.startTime) / totalTime) * 100 : 0;
              const isVisible = (block.startTime / totalTime) <= animationProgress;
              const revealedPct = Math.min(1, Math.max(0, (animationProgress * totalTime - block.startTime) / (block.endTime - block.startTime)));
              
              if (!isVisible) return null;
              
              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`relative flex items-center justify-center border-r border-background font-mono font-bold transition-all overflow-hidden ${getColor(block.processId)}`}
                      style={{ width: `${widthPct}%` }}
                    >
                      <div className="absolute inset-0 bg-black/10 origin-left transition-transform duration-100" style={{ transform: `scaleX(${revealedPct})` }}></div>
                      <span className="relative z-10 text-xs sm:text-sm">{block.processId}</span>
                      
                      <div className="absolute -bottom-6 -translate-x-1/2 left-0 text-xs text-muted-foreground font-mono">
                        {block.startTime}
                      </div>
                      {idx === gantt.length - 1 && (
                         <div className="absolute -bottom-6 translate-x-1/2 right-0 text-xs text-muted-foreground font-mono">
                           {block.endTime}
                         </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs">
                      {block.processId}: t={block.startTime} to t={block.endTime} ({block.endTime - block.startTime} units)
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}