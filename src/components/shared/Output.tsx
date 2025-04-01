
import React from 'react';

interface OutputProps {
  title: string;
  content: string | string[] | { tasks: string[]; deadlines: string[] };
  type?: 'text' | 'list' | 'tasks';
  isLoading?: boolean;
}

const Output: React.FC<OutputProps> = ({ 
  title, 
  content, 
  type = 'text',
  isLoading = false
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      );
    }

    if (type === 'text') {
      return <p className="text-gray-700">{content as string}</p>;
    }

    if (type === 'list' && Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {(content as string[]).map((item, index) => (
            <li key={index} className="text-gray-700">{item}</li>
          ))}
        </ul>
      );
    }

    if (type === 'tasks' && typeof content === 'object' && 'tasks' in content) {
      const { tasks, deadlines } = content as { tasks: string[]; deadlines: string[] };
      return (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Tasks:</h4>
          <ul className="list-disc list-inside space-y-1 mb-4">
            {tasks.map((task, index) => (
              <li key={index} className="text-gray-700">
                {task} {deadlines[index] && <span className="text-gray-500">({deadlines[index]})</span>}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      {renderContent()}
    </div>
  );
};

export default Output;
