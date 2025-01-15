import React from 'react';
import { GraduationCap } from 'lucide-react';
import { TopicSelector } from './components/TopicSelector';
import { LearningGoalSelector } from './components/LearningGoalSelector';
import { ProficiencySelector } from './components/ProficiencySelector';
import { LearningContent } from './components/LearningContent';
import { LearningGoal, Proficiency, LearningContent as LearningContentType } from './types';

function App() {
  const [topic, setTopic] = React.useState<string>();
  const [goal, setGoal] = React.useState<LearningGoal>();
  const [proficiency, setProficiency] = React.useState<Proficiency>();
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState<LearningContentType>();

  // const handleSubmit = async () => {
  //   if (!topic || !goal || !proficiency) return;

  //   setLoading(true);

  //   try {
  //     // Make API call to the backend
  //     console.log("API call started");
  //     const response = await fetch('http://localhost:5000/generate', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         topic,
  //         goal,
  //         proficiency,
  //       }),
  //     });

  //     console.log(response);
  //     console.log("response above:");

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'An unknown error occurred');
  //     }

  //     // Parse the response JSON
  //     const data = await response.json();
  //     const generatedContent = {
  //       title: `${topic} - ${goal.charAt(0).toUpperCase() + goal.slice(1)}`,
  //       content: data.output,
  //     };

  //     setContent(generatedContent);
  //   } catch (error: unknown) {
  //     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  //     console.error('Error generating content:', errorMessage);
  //     setContent({
  //       title: 'Error',
  //       content: `Failed to generate content. Reason: ${errorMessage}`,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!topic || !goal || !proficiency) return;
  
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:5001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          goal,
          proficiency,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred');
      }
  
      const data = await response.json();
      setContent({ title: `${topic} - ${goal}`, content: data.output });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error generating content:', errorMessage);
      setContent({ title: 'Error', content: `Failed to generate content. Reason: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-16 h-16 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal Learning Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Your AI-powered guide to understanding complex topics
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-center mb-4">
              What would you like to learn?
            </h2>
            <TopicSelector onTopicSelect={setTopic} />
          </div>

          {topic && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-center mb-4">
                How would you like to learn?
              </h2>
              <LearningGoalSelector onGoalSelect={setGoal} selectedGoal={goal} />
            </div>
          )}

          {goal && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-center mb-4">
                What's your current level?
              </h2>
              <ProficiencySelector onSelect={setProficiency} selected={proficiency} />
            </div>
          )}

          {topic && goal && proficiency && (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Analyzing materials and generating personalized content...
              </p>
            </div>
          )}

          {content && !loading && (
            <div className="mt-8">
              <LearningContent content={content} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;