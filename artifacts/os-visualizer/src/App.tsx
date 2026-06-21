import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import TopicsPage from "@/pages/TopicsPage";
import TopicPage from "@/pages/TopicPage";
import QuizPage from "@/pages/QuizPage";
import ProgressPage from "@/pages/ProgressPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/topics" component={TopicsPage} />
      <Route path="/topics/:topicId" component={TopicPage} />
      <Route path="/quiz" component={QuizPage} />
      <Route path="/quiz/:topicId" component={QuizPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
