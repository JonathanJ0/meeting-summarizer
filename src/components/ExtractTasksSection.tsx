import React, { useState } from 'react';
import TextArea from '@/components/shared/TextArea'; // Adjusted path with @ alias
import ActionButton from '@/components/shared/ActionButton';
import Output from '@/components/shared/Output';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Adjusted path with @ alias

interface ExtractTasksSectionProps {
  onBack: () => void;
}

const ExtractTasksSection: React.FC<ExtractTasksSectionProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [taskData, setTaskData] = useState<{ tasks: string[]; deadlines: string[] } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleExtract = async () => {
    if (text.length < 50) {
      toast({
        title: 'Error',
        description: 'Please enter at least 50 characters to extract tasks.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setTaskData(null);

    try {
      const response = await fetch('http://localhost:5001/extract-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setTaskData({
          tasks: data.tasks || [],
          deadlines: data.deadlines || [],
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to extract tasks. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while extracting tasks.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
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
        <h2 className="text-2xl font-semibold ml-4">Extract Tasks</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Enter your text</h3>
        <TextArea
          value={text}
          onChange={handleTextChange}
          placeholder="Paste your meeting notes, emails, or text containing tasks and deadlines..."
          minLength={50}
          rows={8}
        />
      </div>

      <div className="mb-8">
        <ActionButton
          onClick={handleExtract}
          disabled={text.length < 50 || isProcessing}
          isLoading={isProcessing}
          className="w-full md:w-auto"
        >
          Extract Tasks
        </ActionButton>
      </div>

      {(taskData || isProcessing) && (
        <div className="mt-8">
          <Output
            title="Extracted Tasks and Deadlines"
            content={taskData || { tasks: [], deadlines: [] }}
            type="tasks"
            isLoading={isProcessing}
          />
        </div>
      )}
    </div>
  );
};

export default ExtractTasksSection;