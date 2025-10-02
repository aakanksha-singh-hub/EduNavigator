import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { SimpleDomainAssessment } from '../components/SimpleDomainAssessment';
import { SimpleDomainResults } from '../components/SimpleDomainResults';
import { LearningRoadmap } from './LearningRoadmap';
import { 
  ArrowLeft, 
  BookOpen, 
  Zap, 
  Map,
  Target
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AssessmentData {
  domain: string;
  name: string;
}

type TabType = 'quick-start' | 'detailed-roadmap';

export const EnhancedLearningRoadmap: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('quick-start');
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const handleAssessmentComplete = (data: AssessmentData) => {
    console.log('🎯 Assessment completed:', data);
    setAssessmentData(data);
    setAssessmentComplete(true);
  };

  const handleRestart = () => {
    console.log('🔄 Restarting assessment');
    setAssessmentComplete(false);
    setAssessmentData(null);
  };

  const tabs = [
    {
      id: 'quick-start' as TabType,
      name: 'Quick Start',
      description: 'Get instant career recommendations in 2 questions',
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      id: 'detailed-roadmap' as TabType,
      name: 'Detailed Roadmap',
      description: 'Comprehensive learning path with progress tracking',
      icon: Map,
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <NBButton
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </NBButton>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Career Roadmap</h1>
              <p className="text-muted-foreground">
                Choose your preferred path to career success
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className={cn("w-5 h-5", activeTab === tab.id ? tab.color : "text-gray-400")} />
                    <span>{tab.name}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'quick-start' && (
          <div className="space-y-6">
            {/* Quick Start Introduction */}
            {!assessmentComplete && (
              <NBCard className="p-8 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Zap className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Quick Start Career Assessment
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Get personalized career recommendations in just 2 simple questions! 
                    No complex forms, no lengthy assessments - just pick your domain and get started.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="w-5 h-5 text-green-500" />
                      <span>Domain-specific careers</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <span>Downloadable action plans</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Zap className="w-5 h-5 text-purple-500" />
                      <span>Instant results</span>
                    </div>
                  </div>
                </div>
              </NBCard>
            )}

            {/* Assessment or Results */}
            {!assessmentComplete ? (
              <SimpleDomainAssessment onComplete={handleAssessmentComplete} />
            ) : (
              assessmentData && (
                <SimpleDomainResults
                  domain={assessmentData.domain}
                  name={assessmentData.name}
                  onRestart={handleRestart}
                />
              )
            )}
          </div>
        )}

        {activeTab === 'detailed-roadmap' && (
          <div className="space-y-6">
            {/* Detailed Roadmap Introduction */}
            <NBCard className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Map className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Detailed Learning Roadmap
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Follow a comprehensive, step-by-step learning path with progress tracking, 
                  milestones, and detailed resources for your chosen career.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span>Phase-by-phase learning</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span>Progress tracking</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <span>Milestone achievements</span>
                  </div>
                </div>
              </div>
            </NBCard>

            {/* Render the existing detailed roadmap */}
            <div className="bg-white rounded-lg border border-gray-200">
              <LearningRoadmap />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};