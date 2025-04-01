
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, CheckSquare, Mic } from 'lucide-react';

interface HomeSectionProps {
  onNavigate: (section: string) => void;
}

const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Turn your meetings into actionable insights</h2>
        <p className="text-xl text-gray-600 mb-10">
          Transcribe, summarize, and extract tasks from your meetings with just a few clicks
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card flex flex-col items-center transition-transform duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Summarize Text</h3>
            <p className="text-gray-600 mb-6">
              Convert lengthy text into concise, readable summaries
            </p>
            <Button 
              onClick={() => onNavigate('summarize')}
              className="mt-auto"
            >
              Start Summarizing
            </Button>
          </div>
          
          <div className="card flex flex-col items-center transition-transform duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Extract Tasks</h3>
            <p className="text-gray-600 mb-6">
              Identify actionable items and deadlines from your notes
            </p>
            <Button 
              onClick={() => onNavigate('extract')}
              className="mt-auto"
              variant="secondary"
            >
              Extract Tasks
            </Button>
          </div>
          
          <div className="card flex flex-col items-center transition-transform duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Mic className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Record Meeting</h3>
            <p className="text-gray-600 mb-6">
              Transcribe and analyze your meetings in real-time
            </p>
            <Button 
              onClick={() => onNavigate('record')}
              className="mt-auto"
              variant="outline"
            >
              Start Recording
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
