import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { QuizEngine } from "@/components/QuizEngine";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { topicsMeta } from "@/data/topics";
import { useProgress } from "@/hooks/useProgress";
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
import { PlayCircle, Target } from "lucide-react";
import { motion } from "framer-motion";

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

export default function QuizPage() {
  const { topicId } = useParams();
  const { quizScores } = useProgress();

  if (topicId) {
    const data = allData[topicId];
    if (!data || !data.quiz || data.quiz.length === 0) {
      return (
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-3xl font-bold font-mono mb-4">Quiz Not Available</h1>
            <p className="text-muted-foreground mb-8">This topic doesn't have a quiz yet.</p>
            <Link href="/quiz">
              <Button>Back to Quizzes</Button>
            </Link>
          </div>
        </Layout>
      );
    }

    return (
      <Layout>
        <QuizEngine topicId={topicId} topicTitle={data.title} questions={data.quiz} />
      </Layout>
    );
  }

  // Quiz Listing
  const topicsWithQuizzes = Object.values(allData).filter(t => t.quiz && t.quiz.length > 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 font-mono">Quiz Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Test your knowledge across different OS topics. Your highest scores are saved.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topicsWithQuizzes.map((topic, idx) => {
            const score = quizScores[topic.id];
            
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="font-mono bg-muted">
                        {topic.quiz.length} Questions
                      </Badge>
                      {score !== undefined && (
                        <Badge variant="outline" className={score >= 80 ? "border-green-500 text-green-600" : "border-primary text-primary"}>
                          Best: {score}%
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="font-mono text-xl">{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {topic.overview}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/quiz/${topic.id}`} className="w-full">
                      <Button className="w-full font-mono group" variant={score !== undefined ? "outline" : "default"}>
                        {score !== undefined ? 'Retake Quiz' : 'Start Quiz'}
                        <PlayCircle className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {topicsWithQuizzes.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No quizzes available yet. Check back soon.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
