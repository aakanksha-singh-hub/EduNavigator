import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { cn } from '../lib/utils';
import { CareerAssessmentData, AssessmentQuestion, AssessmentResponse } from '../lib/types';
import { ChevronLeft, ChevronRight, CheckCircle, Heart, Briefcase, Award, Target, ArrowLeft } from 'lucide-react';

// Career domains data
const careerDomains = [
  {
    id: 'technology',
    name: 'Technology & Software',
    description: 'Software development, data science, cybersecurity, AI/ML',
    icon: '',
    skills: ['Programming Languages', 'Data Analysis', 'Cloud Computing', 'Machine Learning', 'Cybersecurity', 'Mobile Development']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medicine',
    description: 'Medical practice, nursing, therapy, medical research',
    icon: '',
    skills: ['Patient Care', 'Medical Knowledge', 'Research Skills', 'Clinical Skills', 'Communication', 'Empathy']
  },
  {
    id: 'business',
    name: 'Business & Finance',
    description: 'Management, consulting, finance, entrepreneurship',
    icon: '',
    skills: ['Financial Analysis', 'Project Management', 'Strategic Planning', 'Leadership', 'Sales', 'Market Research']
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    description: 'Graphic design, marketing, writing, media production',
    icon: '',
    skills: ['Graphic Design', 'Content Creation', 'Brand Strategy', 'Video Production', 'Writing', 'Social Media']
  },
  {
    id: 'education',
    name: 'Education & Training',
    description: 'Teaching, curriculum development, educational technology',
    icon: '',
    skills: ['Curriculum Design', 'Public Speaking', 'Mentoring', 'Educational Technology', 'Assessment', 'Learning Psychology']
  },
  {
    id: 'engineering',
    name: 'Engineering & Manufacturing',
    description: 'Mechanical, civil, electrical engineering, manufacturing',
    icon: '',
    skills: ['Technical Design', 'Problem Solving', 'CAD Software', 'Project Management', 'Quality Control', 'Manufacturing Processes']
  }
];

// Simplified assessment structure for 4-step flow
const stepQuestions = {
  interests: [
    {
      id: 'interests_main',
      question: 'What activities and subjects genuinely interest you?',
      description: 'Select all that apply - these will help us understand your natural inclinations',
      type: 'multiple-select',
      options: [
        'Solving complex problems and puzzles',
        'Creating and designing things',
        'Helping and working with people',
        'Analyzing data and finding patterns',
        'Leading teams and projects',
        'Learning about science and technology',
        'Writing and communicating ideas',
        'Building and fixing things',
        'Teaching and sharing knowledge',
        'Planning and organizing events',
        'Researching and discovering new information',
        'Working with numbers and finances'
      ]
    },
    {
      id: 'work_environment',
      question: 'What type of work environment appeals to you most?',
      type: 'single-select',
      options: [
        'Fast-paced, dynamic startup environment',
        'Structured, stable corporate setting',
        'Remote/flexible work arrangement',
        'Collaborative team-based environment',
        'Independent work with autonomy',
        'Client-facing, people-oriented setting'
      ]
    }
  ]
};

const assessmentSchema = z.object({
  step1: z.object({
    interests: z.array(z.string()).min(1, "Please select at least one interest"),
    workEnvironment: z.string().min(1, "Please select a work environment")
  }),
  step2: z.object({
    selectedDomains: z.array(z.string()).min(1, "Please select at least one career domain")
  }),
  step3: z.object({
    skills: z.array(z.string()).optional(),
    experience: z.string().optional()
  }),
  step4: z.object({
    timeline: z.string().min(1, "Please select your timeline"),
    goals: z.array(z.string()).min(1, "Please select at least one goal")
  })
});

interface CareerAssessmentFormProps {
  onComplete: (assessmentData: CareerAssessmentData) => void;
  onCancel?: () => void;
  className?: string;
}

interface FormData {
  step1: {
    interests: string[];
    workEnvironment: string;
  };
  step2: {
    selectedDomains: string[];
  };
  step3: {
    skills: string[];
    experience: string;
  };
  step4: {
    timeline: string;
    goals: string[];
  };
}

export const CareerAssessmentForm: React.FC<CareerAssessmentFormProps> = ({
  onComplete,
  onCancel,
  className
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    step1: { interests: [], workEnvironment: '' },
    step2: { selectedDomains: [] },
    step3: { skills: [], experience: '' },
    step4: { timeline: '', goals: [] }
  });

  const steps = [
    { 
      number: 1, 
      title: 'Tell us your interests', 
      description: 'What activities and subjects genuinely excite you?',
      icon: Heart 
    },
    { 
      number: 2, 
      title: 'Choose career domains', 
      description: 'Which career fields align with your interests?',
      icon: Briefcase 
    },
    { 
      number: 3, 
      title: 'Share your skills', 
      description: 'What skills do you have or want to develop?',
      icon: Award 
    },
    { 
      number: 4, 
      title: 'Get your roadmap', 
      description: 'Set your goals and timeline for success',
      icon: Target 
    }
  ];

  const updateFormData = (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    setFormData(prev => ({
      ...prev,
      [step]: { ...prev[step], ...data }
    }));
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return formData.step1.interests.length > 0 && formData.step1.workEnvironment;
      case 2:
        return formData.step2.selectedDomains.length > 0;
      case 3:
        return true; // Skills are optional
      case 4:
        return formData.step4.timeline && formData.step4.goals.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && isStepComplete()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (!isStepComplete()) return;

    // Convert form data to CareerAssessmentData format
    const assessmentData: CareerAssessmentData = {
      interests: formData.step1.interests,
      values: [], // Will be inferred from other selections
      workStyle: [formData.step1.workEnvironment],
      personalityTraits: [],
      careerGoals: formData.step4.goals,
      timeframe: formData.step4.timeline,
      preferredIndustries: formData.step2.selectedDomains,
      workEnvironmentPreferences: [formData.step1.workEnvironment],
      completedAt: new Date(),
      version: '2.0'
    };

    // Note: Skills and experience are handled in the user profile, not assessment data

    onComplete(assessmentData);
  };

  // Step 1: Interests and Work Environment
  const renderStep1 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-black mb-4">
          What activities and subjects genuinely interest you?
        </h3>
        <p className="text-black mb-6">
          Select all that apply - these will help us understand your natural inclinations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stepQuestions.interests[0].options.map((option, index) => {
            const isSelected = formData.step1.interests.includes(option);
            return (
              <label
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-blue-500 bg-blue-50 text-blue-900" 
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const current = formData.step1.interests;
                    if (e.target.checked) {
                      updateFormData('step1', { interests: [...current, option] });
                    } else {
                      updateFormData('step1', { interests: current.filter(item => item !== option) });
                    }
                  }}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-sm font-medium">{option}</span>
                {isSelected && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-black mb-4">
          What type of work environment appeals to you most?
        </h3>
        <div className="space-y-3">
          {stepQuestions.interests[1].options.map((option, index) => (
            <label
              key={index}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                formData.step1.workEnvironment === option
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black"
              )}
            >
              <input
                type="radio"
                name="workEnvironment"
                value={option}
                checked={formData.step1.workEnvironment === option}
                onChange={(e) => updateFormData('step1', { workEnvironment: e.target.value })}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400"
              />
              <span className="text-sm font-medium">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 2: Career Domains
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-black mb-4">
          Which career fields align with your interests?
        </h3>
        <p className="text-black mb-6">
          Select the domains that interest you most - you can choose multiple
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careerDomains.map((domain) => {
          const isSelected = formData.step2.selectedDomains.includes(domain.id);
          return (
            <div
              key={domain.id}
              onClick={() => {
                const current = formData.step2.selectedDomains;
                if (isSelected) {
                  updateFormData('step2', { 
                    selectedDomains: current.filter(id => id !== domain.id) 
                  });
                } else {
                  updateFormData('step2', { 
                    selectedDomains: [...current, domain.id] 
                  });
                }
              }}
              className={cn(
                "p-6 rounded-xl border-2 cursor-pointer transition-all duration-200",
                isSelected 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{domain.icon}</div>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-semibold text-lg mb-2",
                    isSelected ? "text-blue-900" : "text-black"
                  )}>
                    {domain.name}
                  </h4>
                  <p className={cn(
                    "text-sm mb-3",
                    isSelected ? "text-blue-700" : "text-gray-600"
                  )}>
                    {domain.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {domain.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          isSelected 
                            ? "bg-blue-200 text-blue-800" 
                            : "bg-gray-200 text-gray-700"
                        )}
                      >
                        {skill}
                      </span>
                    ))}
                    {domain.skills.length > 3 && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        isSelected 
                          ? "bg-blue-200 text-blue-800" 
                          : "bg-gray-200 text-gray-700"
                      )}>
                        +{domain.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Step 3: Skills (Optional)
  const renderStep3 = () => {
    const selectedDomainSkills = careerDomains
      .filter(domain => formData.step2.selectedDomains.includes(domain.id))
      .flatMap(domain => domain.skills);
    
    const uniqueSkills = [...new Set(selectedDomainSkills)];

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-black mb-4">
            What skills do you currently have or want to develop?
          </h3>
          <p className="text-black mb-6">
            This step is optional, but it helps us create a more personalized roadmap
          </p>
        </div>

        {uniqueSkills.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-black mb-4">
              Skills relevant to your selected domains:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {uniqueSkills.map((skill, index) => {
                const isSelected = formData.step3.skills.includes(skill);
                return (
                  <label
                    key={index}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                      isSelected 
                        ? "border-blue-500 bg-blue-50 text-blue-900" 
                        : "border-gray-200 hover:bg-gray-50 text-black"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = formData.step3.skills;
                        if (e.target.checked) {
                          updateFormData('step3', { skills: [...current, skill] });
                        } else {
                          updateFormData('step3', { skills: current.filter(s => s !== skill) });
                        }
                      }}
                      className="w-4 h-4 text-blue-500 focus:ring-blue-400"
                    />
                    <span className="text-sm font-medium">{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-lg font-medium text-black mb-4">
            What's your current experience level?
          </h4>
          <div className="space-y-3">
            {[
              'Complete beginner - just starting out',
              'Some basic knowledge or experience',
              'Intermediate - have practical experience',
              'Advanced - experienced professional',
              'Expert - highly skilled in my field'
            ].map((level, index) => (
              <label
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  formData.step3.experience === level
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black"
                )}
              >
                <input
                  type="radio"
                  name="experience"
                  value={level}
                  checked={formData.step3.experience === level}
                  onChange={(e) => updateFormData('step3', { experience: e.target.value })}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-sm font-medium">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Goals and Timeline
  const renderStep4 = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-black mb-4">
          What are your career goals?
        </h3>
        <p className="text-black mb-6">
          Select your primary objectives - you can choose multiple
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Land my first job in this field',
            'Switch careers completely',
            'Advance to a leadership role',
            'Increase my salary significantly',
            'Start my own business',
            'Become a subject matter expert',
            'Work for a specific company',
            'Achieve better work-life balance',
            'Work remotely or freelance',
            'Make a positive social impact'
          ].map((goal, index) => {
            const isSelected = formData.step4.goals.includes(goal);
            return (
              <label
                key={index}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                  isSelected 
                    ? "border-blue-500 bg-blue-50 text-blue-900" 
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    const current = formData.step4.goals;
                    if (e.target.checked) {
                      updateFormData('step4', { goals: [...current, goal] });
                    } else {
                      updateFormData('step4', { goals: current.filter(g => g !== goal) });
                    }
                  }}
                  className="w-4 h-4 text-blue-500 focus:ring-blue-400"
                />
                <span className="text-sm font-medium">{goal}</span>
                {isSelected && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-black mb-4">
          What's your timeline for achieving these goals?
        </h3>
        <div className="space-y-3">
          {[
            'Immediate (0-6 months)',
            'Short-term (6-12 months)',
            'Medium-term (1-2 years)',
            'Long-term (2-5 years)',
            'I\'m exploring options',
            'No specific timeline'
          ].map((timeline, index) => (
            <label
              key={index}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                formData.step4.timeline === timeline
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-black"
              )}
            >
              <input
                type="radio"
                name="timeline"
                value={timeline}
                checked={formData.step4.timeline === timeline}
                onChange={(e) => updateFormData('step4', { timeline: e.target.value })}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400"
              />
              <span className="text-sm font-medium">{timeline}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Back Arrow */}
      <div className="mb-4">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <NBCard className="border-gray-300 bg-white/95 backdrop-blur-sm shadow-xl">
        {/* Progress Header */}
        <div className="mb-8">
          {/* Step Indicators */}
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center text-center flex-1">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                    isActive 
                      ? "bg-blue-500 text-white shadow-lg scale-110" 
                      : isCompleted 
                        ? "bg-green-500 text-white shadow-md" 
                        : "bg-gray-200 text-gray-500"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="px-2">
                    <h4 className={cn(
                      "text-sm font-semibold mb-1",
                      isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-500"
                    )}>
                      {step.title}
                    </h4>
                    <p className={cn(
                      "text-xs",
                      isActive ? "text-blue-500" : isCompleted ? "text-green-500" : "text-gray-400"
                    )}>
                      {step.description}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "absolute w-full h-0.5 top-6 left-1/2 transform -translate-y-1/2 z-0",
                      isCompleted ? "bg-green-200" : "bg-transparent"
                    )} style={{ width: 'calc(100% - 3rem)', marginLeft: '1.5rem' }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          {/* Current Step Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-black">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <NBButton
            type="button"
            variant="secondary"
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Previous'}</span>
          </NBButton>

          <div className="flex space-x-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  index + 1 === currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-md' 
                    : index + 1 < currentStep 
                      ? 'bg-green-400 shadow-sm' 
                      : 'bg-gray-300'
                )}
              />
            ))}
          </div>

          <NBButton
            type="button"
            onClick={currentStep === 4 ? handleComplete : handleNext}
            disabled={!isStepComplete()}
            className="flex items-center space-x-2"
          >
            <span>{currentStep === 4 ? 'Get My Roadmap' : 'Next Step'}</span>
            {currentStep < 4 && <ChevronRight className="w-4 h-4" />}
          </NBButton>
        </div>
      </NBCard>
    </div>
  );
};