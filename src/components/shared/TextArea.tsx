
import React from 'react';

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  minLength?: number;
  className?: string;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  minLength = 0,
  className = '',
  rows = 6
}) => {
  const charCount = value.length;
  const isMinLengthMet = minLength ? charCount >= minLength : true;

  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
          !isMinLengthMet && charCount > 0 ? 'border-red-300' : 'border-gray-300'
        } ${className}`}
      ></textarea>
      {minLength > 0 && (
        <div className="flex justify-end mt-1">
          <span className={`text-sm ${!isMinLengthMet ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{minLength} characters {!isMinLengthMet ? '(minimum)' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
