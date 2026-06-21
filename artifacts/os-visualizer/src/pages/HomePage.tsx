import { motion } from "framer-motion";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { topicsMeta } from "@/data/topics";
import { introToOsData } from "@/data/intro-to-os";
import { TerminalSquare, TrendingUp, BookOpen, Award, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { completedTopics, quizScores } = useProgress();

  const totalTopics = topicsMeta.reduce((acc, cat) => acc + cat.subtopics.length, 0);
  const completionPercent = Math.round((completedTopics.length / totalTopics) * 100) || 0;
  
  const featuredTopics = [
    introToOsData['what-is-an-os'],
    introToOsData['kernel'],
    introToOsData['system-calls'],
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6">
            <TerminalSquare className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-mono">
            Master Operating <span className="text-primary">Systems</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            A comprehensive, interactive guide to OS internals. Designed for serious students who want to understand how computers really work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/topics">
              <Button size="lg" className="font-mono text-base px-8 h-14" data-testid="button-start-learning">
                Start Learning <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/progress">
              <Button size="lg" variant="outline" className="font-mono text-base px-8 h-14" data-testid="button-view-progress">
                View Progress
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Progress</CardTitle>
                <TrendingUp className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-primary">{completionPercent}%</div>
                <p className="text-sm text-muted-foreground mt-1">{completedTopics.length} of {totalTopics} topics completed</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Categories</CardTitle>
                <BookOpen className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-primary">{topicsMeta.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Core OS concepts covered</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium font-mono text-muted-foreground">Average Score</CardTitle>
                <Award className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono text-primary">
                  {Object.keys(quizScores).length > 0 
                    ? Math.round(Object.values(quizScores).reduce((a,b)=>a+b,0)/Object.keys(quizScores).length)
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Across {Object.keys(quizScores).length} quizzes</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold font-mono mb-8 text-center">Featured Topics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredTopics.map((topic, idx) => (
              <motion.div 
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
              >
                <Link href={`/topics/${topic.id}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader>
                      <CardTitle className="font-mono text-lg group-hover:text-primary transition-colors">{topic.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{topic.overview}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
