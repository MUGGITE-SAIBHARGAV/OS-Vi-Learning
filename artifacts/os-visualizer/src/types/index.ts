export interface TopicData {
  id: string;
  title: string;
  overview: string;
  whyItExists: string;
  analogy: string;
  keyPoints: KeyPoint[];
  interviewNotes: string[];
  quickRevision: string[];
  quiz: QuizQuestion[];
}

export interface KeyPoint {
  title: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicMeta {
  id: string;
  title: string;
  category: string;
  description: string;
  subtopics: SubtopicMeta[];
}

export interface SubtopicMeta {
  id: string;
  title: string;
}

export interface ProgressState {
  completedTopics: string[];
  quizScores: Record<string, number>;
}
