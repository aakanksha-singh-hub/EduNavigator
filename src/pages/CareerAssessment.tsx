import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerAssessmentForm } from '../components/CareerAssessmentForm';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { useUserStore } from '../lib/stores/userStore';
import { AssessmentService } from '../lib/services/assessmentService';
import { CareerAssessmentData, EnhancedUserProfile } from '../lib/types';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, Clock, User } from 'lucide-react';

export const CareerAssessment = () => {
  const navigate = useNavigate();
  const { profile, enhancedProfile, setEnhancedProfile } = useUserStore();
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);
  const [existingAssessment, setExistingAssessment] = useState<CareerAssessmentData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    // Add a small delay to allow store to hydrate from localStorage
    const checkProfile = () => {
      console.log('Checking profile:', profile); // Debug log
      
      if (!profile) {
        console.log('No profile found, redirecting to details'); // Debug log
        toast.error('Please complete your basic profile first');
        navigate('/details');
        return;
      }

      // Check for existing assessment
      const existing = AssessmentService.getAssessmentData();
      if (existing) {
        setHasExistingAssessment(true);
        setExistingAssessment(existing);
      } else {
        setShowForm(true);
      }
      
      setIsCheckingProfile(false);
    };

    // Small delay to allow store hydration
    const timer = setTimeout(checkProfile, 100);
    return () => clearTimeout(timer);
  }, [profile, navigate]);

  const handleAssessmentComplete = async (assessmentData: CareerAssessmentData) => {
    console.log('Assessment completed, processing...', assessmentData);
    
    try {
      // Save assessment data
      console.log('Saving assessment data...');
      AssessmentService.saveAssessmentData(assessmentData);

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Create or update enhanced profile
      console.log('Creating enhanced profile...');
      const newEnhancedProfile: EnhancedUserProfile = {
        ...profile,
        careerAssessment: assessmentData,
        careerRecommendations: [],
        progressData: {
          overallProgress: 0,
          skillProgress: {},
          milestoneProgress: {},
          learningActivities: [],
          lastUpdated: new Date()
        },
        achievements: [{
          id: `achievement_${Date.now()}`,
          title: 'Assessment Complete',
          description: 'Completed your first career assessment',
          badgeIcon: '🎯',
          category: 'learning' as const,
          earnedAt: new Date(),
          experiencePoints: 100,
          rarity: 'common' as const
        }],
        currentMilestones: [],
        level: 1,
        experiencePoints: 100,
        badges: [],
        streaks: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: new Date(),
          streakType: 'daily',
          streakGoal: 7
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to store
      console.log('Saving enhanced profile to store...');
      setEnhancedProfile(newEnhancedProfile);

      // Small delay to ensure store is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('Navigating to career dashboard...');
      toast.success('Career assessment completed successfully!');
      navigate('/career-dashboard');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
    }
  };

  const handleRetakeAssessment = () => {
    setShowForm(true);
    setHasExistingAssessment(false);
  };

  const handleContinueWithExisting = () => {
    if (existingAssessment && profile) {
      // Create enhanced profile with existing assessment
      const newEnhancedProfile: EnhancedUserProfile = enhancedProfile || {
        ...profile,
        careerAssessment: existingAssessment,
        careerRecommendations: [],
        progressData: {
          overallProgress: 0,
          skillProgress: {},
          milestoneProgress: {},
          learningActivities: [],
          lastUpdated: new Date()
        },
        achievements: [],
        currentMilestones: [],
        level: 1,
        experiencePoints: 0,
        badges: [],
        streaks: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: new Date(),
          streakType: 'daily',
          streakGoal: 7
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setEnhancedProfile(newEnhancedProfile);
      navigate('/career-dashboard');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isCheckingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative flex items-center justify-center">
        <NBCard className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-8 h-8 animate-spin mx-auto border-2 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </NBCard>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen career-assessment-bg relative pt-32">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm fixed top-20 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/details')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                Career Discovery Journey
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{profile.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-12 px-4 relative mt-24">
        <div className="max-w-6xl mx-auto relative">
          {!showForm && hasExistingAssessment && existingAssessment ? (
            // Show existing assessment summary
            <div className="max-w-2xl mx-auto">
              <NBCard className="border-gray-200 bg-white/95 backdrop-blur-sm text-center">
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Assessment Already Completed
                  </h2>
                  <p className="text-gray-700">
                    You've already completed your career assessment. You can continue with your existing results or retake the assessment.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      Completed on {formatDate(existingAssessment.completedAt)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Top Interests:</span>{' '}
                      <span className="text-gray-700">
                        {existingAssessment.interests.slice(0, 3).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Key Values:</span>{' '}
                      <span className="text-gray-700">
                        {existingAssessment.values.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Career Goals:</span>{' '}
                      <span className="text-gray-700">
                        {existingAssessment.careerGoals.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Timeline:</span>{' '}
                      <span className="text-gray-700">
                        {existingAssessment.timeframe}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <NBButton
                    onClick={handleContinueWithExisting}
                    className="flex-1 sm:flex-none"
                  >
                    Continue with Existing Assessment
                  </NBButton>
                  <NBButton
                    variant="secondary"
                    onClick={handleRetakeAssessment}
                    className="flex-1 sm:flex-none"
                  >
                    Retake Assessment
                  </NBButton>
                </div>
              </NBCard>
            </div>
          ) : showForm ? (
            // Show assessment form
            <CareerAssessmentForm
              onComplete={handleAssessmentComplete}
              onCancel={() => navigate('/details')}
            />
          ) : (
            // Loading or initial state
            <div className="max-w-2xl mx-auto">
              <NBCard className="border-gray-200 bg-white/95 backdrop-blur-sm text-center">
                <h2 className="text-2xl font-bold text-black mb-4">
                  Welcome to Your Career Discovery Journey
                </h2>
                <p className="text-black mb-6">
                  Follow our guided 4-step process to discover your ideal career path with personalized recommendations and roadmaps.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-semibold mb-4 text-black">Your Journey Steps:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <div className="font-medium text-gray-900">Tell us your interests</div>
                        <div className="text-sm text-gray-600">What activities and subjects excite you most?</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <div className="font-medium text-gray-900">Choose career domains</div>
                        <div className="text-sm text-gray-600">Select from tech, health, business, creative, and more</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <div className="font-medium text-gray-900">Share your skills (optional)</div>
                        <div className="text-sm text-gray-600">Let us know what you're already good at</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <div className="font-medium text-gray-900">Get your personalized roadmap</div>
                        <div className="text-sm text-gray-600">Career options, flowchart, and step-by-step guidance</div>
                      </div>
                    </div>
                  </div>
                </div>
                <NBButton onClick={() => setShowForm(true)}>
                  Start Assessment
                </NBButton>
              </NBCard>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};