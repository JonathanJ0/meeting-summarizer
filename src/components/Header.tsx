
import React from 'react';

const Header: React.FC = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <header className="py-6 mb-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800">AudioBrief</h1>
        <p className="text-lg text-gray-600 mt-1">{formattedDate}</p>
      </div>
    </header>
  );
};

export default Header;
