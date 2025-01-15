export type Topic = {
  id: string;
  name: string;
  description: string;
};

export type LearningGoal = 'summary' | 'guide' | 'faq' | 'quiz';

export type Proficiency = 'beginner' | 'intermediate' | 'expert';

export type LearningRequest = {
  topic: string;
  goal: LearningGoal;
  proficiency: Proficiency;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type LearningContent = {
  title: string;
  content: string;
  questions?: QuizQuestion[];
};