import { Layout } from "@/components/layout/Layout";
import { useProgress } from "@/hooks/useProgress";
import { topicsMeta } from "@/data/topics";
import { ProgressRing } from "@/components/ProgressRing";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Circle, Trophy, BookOpen, RefreshCcw } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function ProgressPage() {
  const { completedTopics, quizScores, resetProgress } = useProgress();

  const totalTopics = topicsMeta.reduce((acc, cat) => acc + cat.subtopics.length, 0);
  const completionPercent = totalTopics === 0 ? 0 : Math.round((completedTopics.length / totalTopics) * 100);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 font-mono">Your Progress</h1>
            <p className="text-lg text-muted-foreground">
              Track your journey through Operating Systems concepts.
            </p>
          </div>
          <div className="flex-shrink-0 bg-card p-6 rounded-2xl border shadow-sm flex flex-col items-center">
            <ProgressRing percentage={completionPercent} size={140} />
            <span className="text-sm text-muted-foreground mt-4 font-mono font-medium">
              {completedTopics.length} / {totalTopics} Topics
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-mono">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  Syllabus Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {topicsMeta.map(category => {
                    const compCount = category.subtopics.filter(s => completedTopics.includes(s.id)).length;
                    const totalCount = category.subtopics.length;
                    
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{category.title}</span>
                          <span className="text-muted-foreground font-mono">{compCount}/{totalCount}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(compCount/totalCount)*100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-mono">
                  <Trophy className="w-5 h-5 mr-2 text-primary" />
                  Quiz Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(quizScores).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Circle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="mb-4">You haven't taken any quizzes yet.</p>
                    <Link href="/quiz">
                      <Button variant="outline" className="font-mono">Go to Quiz Center</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(quizScores).map(([topicId, score]) => (
                      <div key={topicId} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex items-center">
                          <CheckCircle2 className={`w-4 h-4 mr-3 ${score >= 80 ? 'text-green-500' : 'text-muted-foreground'}`} />
                          <span className="font-medium font-mono text-sm">
                            {topicId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <span className={`font-bold font-mono ${score >= 80 ? 'text-green-500' : 'text-primary'}`}>
                          {score}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-center border-t pt-10">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-white font-mono" data-testid="button-reset-progress">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset All Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you completely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your progress history and quiz scores from this browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetProgress} className="bg-destructive text-white hover:bg-destructive/90 font-mono">
                  Reset Progress
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Layout>
  );
}
