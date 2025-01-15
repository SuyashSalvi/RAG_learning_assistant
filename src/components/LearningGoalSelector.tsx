import React from 'react';
import { BookOpen, HelpCircle, List, Brain } from 'lucide-react';
import { LearningGoal } from '../types';

type GoalOption = {
  value: LearningGoal;
  label: string;
  icon: React.ReactNode;
  description: string;
};

const goals: GoalOption[] = [
  {
    value: 'summary',
    label: 'Summary',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Get a concise overview of the topic'
  },
  {
    value: 'guide',
    label: 'Step-by-Step Guide',
    icon: <List className="w-6 h-6" />,
    description: 'Learn with detailed instructions'
  },
  {
    value: 'faq',
    label: 'FAQ',
    icon: <HelpCircle className="w-6 h-6" />,
    description: 'Common questions and answers'
  },
  {
    value: 'quiz',
    label: 'Quiz',
    icon: <Brain className="w-6 h-6" />,
    description: 'Test your knowledge'
  }
];

type Props = {
  onGoalSelect: (goal: LearningGoal) => void;
  selectedGoal?: LearningGoal;
};

export function LearningGoalSelector({ onGoalSelect, selectedGoal }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
      {goals.map((goal) => (
        <button
          key={goal.value}
          onClick={() => onGoalSelect(goal.value)}
          className={`p-4 rounded-lg border transition-all ${
            selectedGoal === goal.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className={`${
              selectedGoal === goal.value ? 'text-blue-500' : 'text-gray-600'
            }`}>
              {goal.icon}
            </div>
            <h3 className="font-semibold">{goal.label}</h3>
            <p className="text-sm text-gray-600">{goal.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}