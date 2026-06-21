import { motion } from "framer-motion";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { topicsMeta } from "@/data/topics";
import { useProgress } from "@/hooks/useProgress";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";

export default function TopicsPage() {
  const { completedTopics } = useProgress();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 font-mono text-foreground">Syllabus</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore 11 core operating system categories. Start from the basics and work your way up to advanced concepts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topicsMeta.map((category, idx) => {
            const completedCount = category.subtopics.filter(sub => completedTopics.includes(sub.id)).length;
            const isFullyCompleted = completedCount > 0 && completedCount === category.subtopics.length;
            const progressValue = (completedCount / category.subtopics.length) * 100;
            const firstSubtopic = category.subtopics[0];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/topics/${firstSubtopic.id}`}>
                  <Card className="h-full flex flex-col hover:border-primary/50 transition-all hover:shadow-md cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                          {category.subtopics.length} TOPICS
                        </Badge>
                        {isFullyCompleted && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <CardTitle className="text-xl font-mono leading-tight group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {category.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col pt-0 gap-4">
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold">{completedCount}/{category.subtopics.length}</span>
                        </div>
                        <Progress value={progressValue} className="h-1.5" />
                      </div>
                      <div className="w-full flex items-center text-sm font-medium text-primary mt-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Start Category <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
