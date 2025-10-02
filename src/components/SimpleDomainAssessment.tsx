import React, { useState } from 'react';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { cn } from '../lib/utils';
import { ChevronRight, Briefcase, User } from 'lucide-react';

// CSS override for black text
const blackTextStyle = {
  color: '#000000',
  textShadow: 'none',
  fontWeight: 'inherit'
} as React.CSSProperties;

const blackTextForceStyle = `
  .force-black-text, 
  .force-black-text *, 
  .force-black-text p, 
  .force-black-text div, 
  .force-black-text span, 
  .force-black-text h1, 
  .force-black-text h2, 
  .force-black-text h3 {
    color: #000000 !important;
    text-shadow: none !important;
  }
`;

// Super simple domain selection
const domains = [
  {
    id: 'creative',
    name: 'Creative & Design',
    description: 'Graphic design, UX/UI, content creation, marketing',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'technology', 
    name: 'Technology',
    description: 'Software development, data science, cybersecurity',
    icon: '💻',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'business',
    name: 'Business & Finance',
    description: 'Business analysis, project management, consulting',
    icon: '💼',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Nursing, medical research, therapy',
    icon: '🏥',
    color: 'from-red-500 to-pink-500'
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Teaching, curriculum development, training',
    icon: '📚',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Mechanical, civil, electrical engineering',
    icon: '⚙️',
    color: 'from-purple-500 to-violet-500'
  }
];

interface SimpleDomainAssessmentProps {
  onComplete: (data: { domain: string; name: string }) => void;
}

export const SimpleDomainAssessment: React.FC<SimpleDomainAssessmentProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleNext = () => {
    if (step === 1 && selectedDomain) {
      setStep(2);
    } else if (step === 2 && name.trim()) {
      // Complete the assessment
      onComplete({
        domain: selectedDomain,
        name: name.trim()
      });
    }
  };

  const canProceed = step === 1 ? selectedDomain : name.trim();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blackTextForceStyle }} />
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        backgroundImage: "url('/bg2.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-6 text-white">
              🚀 Find Your Perfect Career
            </h1>
            <p className="text-xl font-medium mt-8 text-white">
              Just 2 simple questions to get personalized career recommendations!
            </p>
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step >= 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
              )}>
                1
              </div>
              <div className={cn(
                "w-16 h-1 rounded",
                step >= 2 ? "bg-blue-500" : "bg-gray-200"
              )} />
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step >= 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
              )}>
                2
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Domain Selection */}
        {step === 1 && (
          <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
            <div className="text-center mb-8 force-black-text">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2 force-black-text">
                Which field interests you most?
              </h2>
              <p className="font-semibold force-black-text">
                Select the domain that excites you the most. We'll show you the best careers in that field!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className={cn(
                    "p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 bg-white/90 force-black-text",
                    selectedDomain === domain.id
                      ? "border-blue-500 bg-blue-50/90 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  )}
                >
                  <div className="text-center force-black-text">
                    <div className="text-4xl mb-3">{domain.icon}</div>
                    <h3 className="font-bold mb-2 force-black-text">
                      {domain.name}
                    </h3>
                    <p className="text-sm font-semibold force-black-text">
                      {domain.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <NBButton
                onClick={handleNext}
                disabled={!canProceed}
                className="px-8 py-3 text-lg"
              >
                Next Step
                <ChevronRight className="ml-2 w-5 h-5" />
              </NBButton>
            </div>
          </div>
        )}

        {/* Step 2: Name Input */}
        {step === 2 && (
          <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
            <div className="text-center mb-8 force-black-text">
              <User className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2 force-black-text">
                What's your name?
              </h2>
              <p className="font-semibold force-black-text">
                We'll personalize your career recommendations just for you!
              </p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && canProceed) {
                    handleNext();
                  }
                }}
              />
            </div>

            <div className="text-center space-x-4">
              <NBButton
                onClick={() => setStep(1)}
                variant="ghost"
                className="px-6 py-3"
              >
                Back
              </NBButton>
              <NBButton
                onClick={handleNext}
                disabled={!canProceed}
                className="px-8 py-3 text-lg"
              >
                Get My Career Recommendations! 🚀
              </NBButton>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};