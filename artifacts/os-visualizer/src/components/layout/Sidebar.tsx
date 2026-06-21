import { Link, useLocation } from "wouter";
import { 
  BookOpen, Layers, Cpu, Clock, Lock, 
  Database, HardDrive, Shield, Share2, Server, Key
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { topicsMeta } from "@/data/topics";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  'intro-to-os': BookOpen,
  'process-management': Layers,
  'threads': Share2,
  'cpu-scheduling': Clock,
  'synchronization': Lock,
  'deadlocks': Shield,
  'memory-management': Database,
  'virtual-memory': Server,
  'file-systems': HardDrive,
  'disk-scheduling': Cpu,
  'security': Key,
};

export function Sidebar() {
  const [location] = useLocation();
  const { completedTopics } = useProgress();

  return (
    <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r md:sticky md:block md:w-64 lg:w-72 bg-sidebar">
      <ScrollArea className="h-full py-6 pr-6 lg:py-8">
        <div className="w-full space-y-4 pb-8 pl-6">
          {topicsMeta.map((category) => {
            const Icon = iconMap[category.id] || BookOpen;
            const isCategoryActive = location.includes(category.id) || 
              category.subtopics.some(sub => location.includes(sub.id));
              
            return (
              <div key={category.id} className="pb-4">
                <h4 className="mb-1 flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-sidebar-foreground font-mono">
                  <Icon className="h-4 w-4 text-primary" />
                  {category.title}
                </h4>
                <div className="grid grid-flow-row auto-rows-max text-sm">
                  {category.subtopics.map((subtopic) => {
                    const isActive = location === `/topics/${subtopic.id}`;
                    const isCompleted = completedTopics.includes(subtopic.id);
                    return (
                      <Link
                        key={subtopic.id}
                        href={`/topics/${subtopic.id}`}
                        className={cn(
                          "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground hover:bg-sidebar-accent",
                          isActive && "font-medium text-foreground bg-sidebar-accent/50",
                        )}
                      >
                        <span className="truncate">{subtopic.title}</span>
                        {isCompleted && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-primary shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
