import { useState } from "react";
import { motion } from "framer-motion";
import { TopicData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Lightbulb, TerminalSquare, BookOpen, PenTool, Target, MonitorPlay, FileCode2, Cpu } from "lucide-react";
import { Link } from "wouter";
import { useProgress } from "@/hooks/useProgress";

interface TopicContentProps {
  topic: TopicData;
  visualizer?: React.ReactNode;
}

export function TopicContent({ topic, visualizer }: TopicContentProps) {
  const { markComplete, completedTopics } = useProgress();
  const isCompleted = completedTopics.includes(topic.id);
  const isProcessConcept = topic.id === 'process-concept';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 px-4 max-w-5xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 font-mono">{topic.title}</h1>
        {isCompleted && (
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full h-12 mb-8 bg-muted/50 p-1 overflow-x-auto overflow-y-hidden ${visualizer ? 'grid-cols-6' : 'grid-cols-5'}`}>
          <TabsTrigger value="overview" className="font-mono text-xs sm:text-sm data-[state=active]:bg-background">Overview</TabsTrigger>
          {visualizer && <TabsTrigger value="visualizer" className="font-mono text-xs sm:text-sm data-[state=active]:bg-background flex items-center gap-2"><MonitorPlay className="w-4 h-4"/>Visualizer</TabsTrigger>}
          <TabsTrigger value="concepts" className="font-mono text-xs sm:text-sm data-[state=active]:bg-background">Key Concepts</TabsTrigger>
          <TabsTrigger value="interview" className="font-mono text-xs sm:text-sm data-[state=active]:bg-background">Interview Notes</TabsTrigger>
          <TabsTrigger value="revision" className="font-mono text-xs sm:text-sm data-[state=active]:bg-background">Revision</TabsTrigger>
          <TabsTrigger value="quiz" className="font-mono text-xs sm:text-sm data-[state=active]:bg-background">Quiz</TabsTrigger>
        </TabsList>
        
        <>
          {visualizer && (
            <TabsContent value="visualizer" className="space-y-6 outline-none">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {visualizer}
              </motion.div>
            </TabsContent>
          )}

          <TabsContent value="overview" className="space-y-6 outline-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-lg leading-relaxed text-foreground/90">{topic.overview}</p>
              </div>

              {isProcessConcept && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold font-mono mb-4 text-primary">Program vs Process</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <FileCode2 className="w-12 h-12 text-slate-400 mb-4" />
                        <h4 className="font-bold text-lg mb-2">Program</h4>
                        <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                          <li>Passive entity</li>
                          <li>Stored on disk</li>
                          <li>Lifespan: Persistent</li>
                          <li>E.g., <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">chrome.exe</code></li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-primary/5 border-primary/20 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="p-6 flex flex-col items-center text-center relative z-10">
                        <Cpu className="w-12 h-12 text-primary animate-pulse mb-4" />
                        <h4 className="font-bold text-lg mb-2 text-primary">Process</h4>
                        <ul className="text-sm text-foreground/80 space-y-2">
                          <li>Active entity</li>
                          <li>Loaded in memory (RAM)</li>
                          <li>Lifespan: Temporary</li>
                          <li>E.g., Running instance with PID 4012</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2">

                <Card className="bg-card border-l-4 border-l-primary shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg">
                      <TerminalSquare className="w-5 h-5 mr-2 text-primary" />
                      Why it exists
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{topic.whyItExists}</p>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg text-primary">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      Analogy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-primary/80 leading-relaxed italic">"{topic.analogy}"</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="concepts" className="outline-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Accordion type="single" collapsible className="w-full">
                {topic.keyPoints.map((point, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className="border-b-0 mb-2">
                    <Card className="border shadow-sm overflow-hidden group hover:border-primary/50 transition-colors">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline data-[state=open]:bg-muted/50">
                        <span className="font-semibold text-left font-mono">{point.title}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-muted-foreground leading-relaxed bg-muted/20">
                        {point.description}
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </TabsContent>

          <TabsContent value="interview" className="outline-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="border-t-4 border-t-accent shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Badge variant="outline" className="mr-3 font-mono text-xs">INTERVIEW READY</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {topic.interviewNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start text-sm md:text-base leading-relaxed">
                        <div className="mr-4 mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-mono text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-foreground/90">{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="revision" className="outline-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-mono">
                    <PenTool className="w-5 h-5 mr-2 text-primary" />
                    Quick Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {topic.quickRevision.map((point, idx) => (
                      <div key={idx} className="flex items-center p-3 rounded-lg bg-muted/40 border border-transparent hover:border-border transition-colors">
                        <CheckCircle2 className="w-4 h-4 mr-3 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium text-foreground/80">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="quiz" className="outline-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="shadow-sm border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-mono">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    Practice Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Test your knowledge with a quick 3-question practice quiz before taking the full quiz.
                  </p>
                  <Link href={`/quiz/${topic.id}`}>
                    <Button className="font-mono">
                      Start Practice Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </>
      </Tabs>

      <div className="mt-12 flex justify-center border-t pt-8">
        <Button 
          size="lg" 
          onClick={() => markComplete(topic.id)}
          disabled={isCompleted}
          className="font-mono px-8"
          data-testid={`button-mark-complete-${topic.id}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 mr-2" />
              Mark as Complete
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
