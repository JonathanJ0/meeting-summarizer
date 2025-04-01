import React, { useState } from 'react';
import TextArea from '@/components/shared/TextArea'; // Adjusted path with @ alias
import ActionButton from '@/components/shared/ActionButton';
import Output from '@/components/shared/Output';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Adjusted path with @ alias

interface SummarizeSectionProps {
  onBack: () => void;
}

const SummarizeSection: React.FC<SummarizeSectionProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (text.length < 200) {
      toast({
        title: 'Error',
        description: 'Text must be at least 200 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const response = await fetch('http://localhost:5001/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to summarize text.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An error occurred while summarizing.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>
        <h2 className="text-2xl font-semibold ml-4">Summarize Text</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Enter your text</h3>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize (minimum 200 characters)"
          rows={8}
        />
        <p className="text-gray-500 mt-2">Character count: {text.length}</p>
      </div>

      <div className="mb-8">
        <ActionButton
          onClick={handleSummarize}
          disabled={isLoading || text.length < 200}
          isLoading={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? 'Summarizing...' : 'Start Summarizing'}
        </ActionButton>
      </div>

      {summary && (
        <div className="mt-8">
          <Output title="Summary" content={summary} type="text" />
        </div>
      )}
    </div>
  );
};

export default SummarizeSection;