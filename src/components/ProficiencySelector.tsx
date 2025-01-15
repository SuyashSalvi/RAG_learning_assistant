import React from 'react';
import { Proficiency } from '../types';

type ProficiencyOption = {
  value: Proficiency;
  label: string;
  description: string;
};

const options: ProficiencyOption[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to the topic'
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Some knowledge'
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Advanced understanding'
  }
];

type Props = {
  onSelect: (proficiency: Proficiency) => void;
  selected?: Proficiency;
};

export function ProficiencySelector({ onSelect, selected }: Props) {
  return (
    <div className="flex gap-4 w-full max-w-2xl justify-center">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`px-6 py-3 rounded-lg border transition-all ${
            selected === option.value
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
          }`}
        >
          <div className="text-center">
            <div className="font-semibold">{option.label}</div>
            <div className="text-sm text-gray-600">{option.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}