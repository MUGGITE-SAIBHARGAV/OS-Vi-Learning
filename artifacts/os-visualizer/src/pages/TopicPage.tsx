import { useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { TopicContent } from "@/components/TopicContent";
import { ProcessLifecycleViz } from "@/components/visualizations/ProcessLifecycleViz";
import { PCBViz } from "@/components/visualizations/PCBViz";
import { ContextSwitchViz } from "@/components/visualizations/ContextSwitchViz";
import { ProcessTreeViz } from "@/components/visualizations/ProcessTreeViz";
import { ThreadIntroViz } from "@/components/visualizations/ThreadIntroViz";
import { SingleVsMultiThreadViz } from "@/components/visualizations/SingleVsMultiThreadViz";
import { ConcurrencyParallelismViz } from "@/components/visualizations/ConcurrencyParallelismViz";
import { ThreadTypesViz } from "@/components/visualizations/ThreadTypesViz";
import { MultithreadingBenefitsViz } from "@/components/visualizations/MultithreadingBenefitsViz";
import { ThreadLifecycleViz } from "@/components/visualizations/ThreadLifecycleViz";
import { ThreadContextSwitchViz } from "@/components/visualizations/ThreadContextSwitchViz";

import { introToOsData } from "@/data/intro-to-os";
import { processManagementData } from "@/data/process-management";
import { threadsData } from "@/data/threads";
import { cpuSchedulingData } from "@/data/cpu-scheduling";
import { synchronizationData } from "@/data/synchronization";
import { deadlocksData } from "@/data/deadlocks";
import { memoryManagementData } from "@/data/memory-management";
import { virtualMemoryData } from "@/data/virtual-memory";
import { fileSystemsData } from "@/data/file-systems";
import { diskSchedulingData } from "@/data/disk-scheduling";
import { securityData } from "@/data/security";
import { TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Import all CPU Scheduling components
import { SchedulingIntroViz } from "@/components/visualizations/SchedulingIntroViz";
import { FCFSViz } from "@/components/visualizations/FCFSViz";
import { SJFViz } from "@/components/visualizations/SJFViz";
import { PriorityViz } from "@/components/visualizations/PriorityViz";
import { RoundRobinViz } from "@/components/visualizations/RoundRobinViz";
import { SchedulingPlayground } from "@/components/visualizations/SchedulingPlayground";
import { SyncIntroViz } from "@/components/visualizations/SyncIntroViz";
import { RaceConditionViz } from "@/components/visualizations/RaceConditionViz";
import { CriticalSectionViz } from "@/components/visualizations/CriticalSectionViz";
import { SyncRequirementsViz } from "@/components/visualizations/SyncRequirementsViz";
import { SyncPlaygroundViz } from "@/components/visualizations/SyncPlaygroundViz";
import { RealWorldSyncViz } from "@/components/visualizations/RealWorldSyncViz";
import { DeadlockIntroViz } from "@/components/visualizations/DeadlockIntroViz";
import { FourConditionsViz } from "@/components/visualizations/FourConditionsViz";
import { RAGViz } from "@/components/visualizations/RAGViz";
import { DeadlockFormationViz } from "@/components/visualizations/DeadlockFormationViz";
import { BankersAlgorithmViz } from "@/components/visualizations/BankersAlgorithmViz";
import { DeadlockPreventionViz } from "@/components/visualizations/DeadlockPreventionViz";
import { MemoryIntroViz } from "@/components/visualizations/MemoryIntroViz";
import { MemoryLayoutViz } from "@/components/visualizations/MemoryLayoutViz";
import { ContiguousAllocationViz } from "@/components/visualizations/ContiguousAllocationViz";
import { FragmentationViz } from "@/components/visualizations/FragmentationViz";
import { CompactionViz } from "@/components/visualizations/CompactionViz";
import { AllocationStrategiesViz } from "@/components/visualizations/AllocationStrategiesViz";
import { SwappingViz } from "@/components/visualizations/SwappingViz";

const allData = {
  ...introToOsData,
  ...processManagementData,
  ...threadsData,
  ...cpuSchedulingData,
  ...synchronizationData,
  ...deadlocksData,
  ...memoryManagementData,
  ...virtualMemoryData,
  ...fileSystemsData,
  ...diskSchedulingData,
  ...securityData
};

export default function TopicPage() {
  const { topicId } = useParams();
  const data = allData[topicId || ""];

  if (!data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <TerminalSquare className="w-16 h-16 text-muted-foreground mb-6 opacity-50" />
          <h1 className="text-3xl font-bold font-mono mb-4">Topic Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            The topic you are looking for doesn't exist or is still under construction.
          </p>
          <Link href="/topics">
            <Button className="font-mono">Return to Syllabus</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  let visualizer = null;
  if (topicId === "process-lifecycle") visualizer = <ProcessLifecycleViz />;
  if (topicId === "process-control-block") visualizer = <PCBViz />;
  if (topicId === "context-switching") visualizer = <ContextSwitchViz />;
  if (topicId === "process-creation") visualizer = <ProcessTreeViz />;
  
  if (topicId === "thread-intro") visualizer = <ThreadIntroViz />;
  if (topicId === "thread-vs-process") visualizer = <SingleVsMultiThreadViz />;
  if (topicId === "concurrency-parallelism") visualizer = <ConcurrencyParallelismViz />;
  if (topicId === "thread-types") visualizer = <ThreadTypesViz />;
  if (topicId === "multithreading-models") visualizer = <MultithreadingBenefitsViz />;
  if (topicId === "thread-lifecycle") visualizer = <ThreadLifecycleViz />;
  if (topicId === "thread-context-switch") visualizer = <ThreadContextSwitchViz />;
  
  if (topicId === "scheduling-intro") visualizer = <SchedulingIntroViz />;
  if (topicId === "fcfs") visualizer = <FCFSViz />;
  if (topicId === "sjf-srtf") visualizer = <SJFViz />;
  if (topicId === "priority-scheduling") visualizer = <PriorityViz />;
  if (topicId === "round-robin") visualizer = <RoundRobinViz />;
  if (topicId === "scheduling-playground") visualizer = <SchedulingPlayground />;
  
  if (topicId === "sync-intro") visualizer = <SyncIntroViz />;
  if (topicId === "race-condition") visualizer = <RaceConditionViz />;
  if (topicId === "critical-section") visualizer = <CriticalSectionViz />;
  if (topicId === "sync-requirements") visualizer = <SyncRequirementsViz />;
  if (topicId === "sync-playground") visualizer = <SyncPlaygroundViz />;
  if (topicId === "real-world-sync") visualizer = <RealWorldSyncViz />;
  
  if (topicId === "deadlock-intro") visualizer = <DeadlockIntroViz />;
  if (topicId === "four-conditions") visualizer = <FourConditionsViz />;
  if (topicId === "rag-visualizer") visualizer = <RAGViz />;
  if (topicId === "deadlock-formation") visualizer = <DeadlockFormationViz />;
  if (topicId === "bankers-algorithm") visualizer = <BankersAlgorithmViz />;
  if (topicId === "deadlock-prevention") visualizer = <DeadlockPreventionViz />;

  if (topicId === "main-memory") visualizer = <MemoryIntroViz />;
  if (topicId === "memory-layout") visualizer = <MemoryLayoutViz />;
  if (topicId === "contiguous-allocation") visualizer = <ContiguousAllocationViz />;
  if (topicId === "fragmentation") visualizer = <FragmentationViz />;
  if (topicId === "compaction") visualizer = <CompactionViz />;
  if (topicId === "allocation-strategies") visualizer = <AllocationStrategiesViz />;
  if (topicId === "swapping") visualizer = <SwappingViz />;

  return (
    <Layout>
      <TopicContent topic={data} visualizer={visualizer} />
    </Layout>
  );
}
