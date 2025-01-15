import React from 'react';
import { Search } from 'lucide-react';

type TopicSelectorProps = {
  onTopicSelect: (topic: string) => void;
};

export function TopicSelector({ onTopicSelect }: TopicSelectorProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onTopicSelect(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="What would you like to learn about?"
          className="w-full px-4 py-3 pl-12 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </form>
  );
}