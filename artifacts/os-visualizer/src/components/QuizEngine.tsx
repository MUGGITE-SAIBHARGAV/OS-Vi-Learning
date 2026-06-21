import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/useProgress";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

interface QuizEngineProps {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestion[];
}

export function QuizEngine({ topicId, topicTitle, questions }: QuizEngineProps) {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { saveQuizScore } = useProgress();

  const currentQ = questions[currentIdx];
  const isAnswered = selectedIdx !== null;
  const isCorrect = selectedIdx === currentQ?.correctIndex;

  const handleStart = () => {
    setStarted(true);
    setCurrentIdx(0);
    setScore(0);
    setSelectedIdx(null);
    setShowResult(false);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    if (idx === currentQ.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedIdx(null);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const percentage = Math.round((finalScore / questions.length) * 100);
      saveQuizScore(topicId, percentage);
      setShowResult(true);
    }
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-mono">{topicTitle} Quiz</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Test your knowledge with {questions.length} questions. You'll get immediate feedback after each answer.
          </p>
          <Button size="lg" onClick={handleStart} className="font-mono px-8" data-testid="button-start-quiz">
            Start Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    let message = "Keep studying!";
    if (percentage >= 80) message = "Excellent work!";
    else if (percentage >= 60) message = "Good job!";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-7xl font-bold font-mono text-primary mb-2">
            {percentage}%
          </div>
          <h2 className="text-2xl font-semibold mb-2">{message}</h2>
          <p className="text-muted-foreground mb-8">
            You scored {score} out of {questions.length} correctly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleStart} data-testid="button-retry-quiz">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retry Quiz
            </Button>
            <Link href="/quiz">
              <Button data-testid="link-back-to-quizzes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center justify-between font-mono text-sm">
        <span className="text-muted-foreground">Question {currentIdx + 1} of {questions.length}</span>
        <span className="font-semibold text-primary">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrectOption = idx === currentQ.correctIndex;
                
                let btnVariant: "outline" | "default" | "destructive" | "secondary" = "outline";
                let btnClass = "w-full justify-start text-left h-auto py-4 px-6 text-base font-normal whitespace-normal";
                
                if (isAnswered) {
                  if (isCorrectOption) {
                    btnClass += " border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                  } else if (isSelected && !isCorrectOption) {
                    btnClass += " border-destructive bg-destructive/10 text-destructive";
                  } else {
                    btnClass += " opacity-50 cursor-not-allowed";
                  }
                } else {
                  btnClass += " hover:bg-muted transition-colors";
                }

                return (
                  <Button
                    key={idx}
                    variant={btnVariant}
                    className={btnClass}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    data-testid={`button-option-${idx}`}
                  >
                    <div className="flex items-center w-full">
                      <span className="w-6 h-6 rounded border flex items-center justify-center mr-4 text-xs font-mono shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                      {isAnswered && isCorrectOption && <CheckCircle2 className="w-5 h-5 ml-auto text-green-500" />}
                      {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 ml-auto text-destructive" />}
                    </div>
                  </Button>
                );
              })}
            </CardContent>
            
            {isAnswered && (
              <CardFooter className="flex-col items-stretch pt-0 mt-4">
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className={`p-4 rounded-lg text-sm mb-6 ${isCorrect ? 'bg-green-500/10 text-green-800 dark:text-green-200' : 'bg-muted text-muted-foreground'}`}
                >
                  <p className="font-semibold mb-1">{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
                  <p>{currentQ.explanation}</p>
                </motion.div>
                <div className="flex justify-end">
                  <Button size="lg" onClick={handleNext} className="font-mono" data-testid="button-next-question">
                    {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
