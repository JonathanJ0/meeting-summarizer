import React, { useState } from 'react';
import Header from '@/components/Header';
import HomeSection from '@/components/HomeSection';
import SummarizeSection from '@/components/SummarizeSection';
import ExtractTasksSection from '@/components/ExtractTasksSection';
import RecordMeetingSection from '@/components/RecordMeetingSection';

const Index: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    window.scrollTo(0, 0);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'summarize':
        return <SummarizeSection onBack={() => handleNavigate('home')} />;
      case 'extract':
        return <ExtractTasksSection onBack={() => handleNavigate('home')} />;
      case 'record':
        return <RecordMeetingSection onBack={() => handleNavigate('home')} />;
      default:
        return <HomeSection onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 pb-16 section-transition">
        {renderSection()}
      </main>
    </div>
  );
};

export default Index;