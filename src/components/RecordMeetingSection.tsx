import React, { useState, useEffect } from 'react';
import ActionButton from '@/components/shared/ActionButton'; // Adjusted path with @ alias
import Output from '@/components/shared/Output';
import { Mic, Square, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Adjusted path with @ alias

interface RecordMeetingSectionProps {
  onBack: () => void;
}

const RecordMeetingSection: React.FC<RecordMeetingSectionProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [meetingData, setMeetingData] = useState<{
    transcription: string;
    summary: string;
    tasks: string[];
    deadlines: string[];
    timestamp: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isRecording, recordingTime]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      setStatus('Listening...');
      setMeetingData(null);
      setRecordingTime(0);
    } else {
      setIsRecording(false);
      setStatus('Processing...');
      setIsProcessing(true);

      try {
        const response = await fetch('http://localhost:5001/meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMeetingData({
            transcription: data.transcription || 'No transcription available.',
            summary: data.summary || 'No summary available.',
            tasks: data.tasks || [],
            deadlines: data.deadlines || [],
            timestamp: data.timestamp || new Date().toISOString(),
          });
          setStatus('Recording complete');
        } else {
          toast({
            title: 'Error',
            description: data.error || 'Failed to process meeting.',
            variant: 'destructive',
          });
          setStatus('');
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'An error occurred while processing the meeting.',
          variant: 'destructive',
        });
        setStatus('');
      } finally {
        setIsProcessing(false);
        setRecordingTime(0);
      }
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
        <h2 className="text-2xl font-semibold ml-4">Record Meeting</h2>
      </div>

      <div className="flex flex-col items-center justify-center my-10">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
            isRecording ? 'bg-red-100 animate-pulse-slow' : 'bg-gray-100'
          }`}
        >
          {isRecording ? (
            <Square className="w-10 h-10 text-red-600" />
          ) : (
            <Mic className="w-10 h-10 text-gray-600" />
          )}
        </div>

        <div className="text-center mb-6">
          {isRecording && (
            <div className="font-mono text-2xl font-bold mb-2">
              {formatTime(recordingTime)}
            </div>
          )}

          {status && (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-block mb-4 ${
                status === 'Listening...'
                  ? 'status-recording'
                  : status === 'Processing...'
                  ? 'status-processing'
                  : status === 'Recording complete'
                  ? 'status-complete'
                  : 'bg-gray-200'
              }`}
            >
              {status}
            </div>
          )}
        </div>

        <ActionButton
          onClick={handleToggleRecording}
          disabled={isProcessing}
          variant={isRecording ? 'destructive' : 'default'}
          size="lg"
          isLoading={isProcessing}
          className="px-8"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </ActionButton>
      </div>

      {meetingData && (
        <div className="space-y-6 mt-10">
          <div className="text-right text-sm text-gray-500">
            Recorded on: {new Date(meetingData.timestamp).toLocaleString()}
          </div>

          <Output title="Transcription" content={meetingData.transcription} type="text" />

          <Output title="Summary" content={meetingData.summary} type="text" />

          <Output
            title="Tasks and Deadlines"
            content={{
              tasks: meetingData.tasks,
              deadlines: meetingData.deadlines,
            }}
            type="tasks"
          />
        </div>
      )}
    </div>
  );
};

export default RecordMeetingSection;