import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerRecommendationsList } from '../components/CareerRecommendationsList';
import { ProgressDashboard } from '../components/ProgressDashboard';
import { GridBackgroundSmall } from '../components/ui/grid-background';
import { DotBackground } from '../components/ui/dot-background';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { AssessmentService } from '../lib/services/assessmentService';
import { CareerRecommendation } from '../lib/types';
import { toast } from 'sonner';
import { 
  RefreshCw, 
  User, 
  Target, 
  Bookmark,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  BookOpen,
  Activity
} from 'lucide-react';

export const CareerDashboard = () => {
  const navigate = useNavigate();
  const { profile, enhancedProfile, setEnhancedProfile } = useUserStore();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCareerIds, setSavedCareerIds] = useState<string[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string | undefined>();

  useEffect(() => {
    if (!enhancedProfile) {
      navigate('/career-assessment');
      return;
    }

    // Set selected career from profile
    setSelectedCareerId(enhancedProfile.selectedCareerPath);
    
    // Load recommendations
    loadRecommendations();
  }, [enhancedProfile, navigate]);

  const loadRecommendations = async () => {
    if (!enhancedProfile) return;
    
    setIsLoading(true);
    try {
      const careerRecs = await CareerService.generateRecommendations(enhancedProfile);
      setRecommendations(careerRecs);
    } catch (error) {
      console.error('Failed to load career recommendations:', error);
      // Load fallback recommendations
      try {
        const fallbackRecs: CareerRecommendation[] = [];
        setRecommendations(fallbackRecs);
        toast.info('Loaded basic recommendations');
      } catch (fallbackError) {
        console.error('Failed to load fallback recommendations:', fallbackError);
        toast.error('Failed to load recommendations');
        setRecommendations([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = async (recommendation: CareerRecommendation) => {
    setSelectedCareerId(recommendation.id);
    
    if (enhancedProfile) {
      try {
        toast.loading('Setting up your career path...', { id: 'career-setup' });
        
        // Update profile with selected career
        const updatedProfile = {
          ...enhancedProfile,
          selectedCareerPath: recommendation.id,
          updatedAt: new Date()
        };
        
        setEnhancedProfile(updatedProfile);
        
        // Award gamification points
        const { useUserStore } = await import('../lib/stores/userStore');
        const store = useUserStore.getState();
        
        store.awardExperience(100, `Selected career path: ${recommendation.title}`);
        store.checkAndAwardAchievements('career_selected', { career: recommendation });
        store.updateMilestoneProgress();
        
        toast.success(`🎉 Career path set up successfully!`, { id: 'career-setup' });
        toast.info('Check out your personalized learning roadmap!');
        
        setTimeout(() => {
          navigate('/learning-roadmap');
        }, 2000);
        
      } catch (error) {
        console.error('Career selection failed:', error);
        toast.error('Failed to set up career path. Please try again.', { id: 'career-setup' });
      }
    } else {
      toast.error('Please complete your profile first');
      navigate('/career-assessment');
    }
  };

  const handleSaveCareer = (recommendation: CareerRecommendation) => {
    setSavedCareerIds(prev => {
      if (prev.includes(recommendation.id)) {
        toast.info(`Removed ${recommendation.title} from saved careers`);
        return prev.filter(id => id !== recommendation.id);
      } else {
        toast.success(`Saved ${recommendation.title} to your bookmarks`);
        return [...prev, recommendation.id];
      }
    });
  };

  const refreshRecommendations = () => {
    loadRecommendations();
    toast.info('Refreshing recommendations...');
  };

  if (!enhancedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Complete Your Assessment</h3>
          <p className="text-gray-600 mb-4">Please complete the career assessment first to get personalized recommendations.</p>
          <NBButton onClick={() => navigate('/career-assessment')}>
            Start Assessment
          </NBButton>
        </NBCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <DotBackground>
        <></>
      </DotBackground>
      <GridBackgroundSmall>
        <></>
      </GridBackgroundSmall>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Career Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back, {enhancedProfile.name}! Here's your personalized career guidance.
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <NBButton 
              variant="ghost"
              onClick={refreshRecommendations}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </NBButton>
            <NBButton onClick={() => navigate('/achievements')}>
              <Target className="h-4 w-4 mr-2" />
              Achievements
            </NBButton>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <NBCard className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold text-purple-600">{recommendations.length}</div>
            <p className="text-sm text-gray-600">Career Matches</p>
          </NBCard>
          
          <NBCard className="p-6 text-center">
            <Bookmark className="h-8 w-8 mx-auto mb-2 text-pink-500" />
            <div className="text-2xl font-bold text-pink-600">{savedCareerIds.length}</div>
            <p className="text-sm text-gray-600">Saved Careers</p>
          </NBCard>
          
          <NBCard className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold text-blue-600">{enhancedProfile.level}</div>
            <p className="text-sm text-gray-600">Current Level</p>
          </NBCard>
          
          <NBCard className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{enhancedProfile.experiencePoints}</div>
            <p className="text-sm text-gray-600">Experience Points</p>
          </NBCard>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Career Recommendations */}
          <div className="lg:col-span-2">
            <NBCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Career Recommendations</h2>
                <NBButton 
                  variant="ghost" 
                  onClick={() => navigate('/career-assessment')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Update Preferences
                </NBButton>
              </div>
              
              <CareerRecommendationsList
                recommendations={recommendations}
                onSelectCareer={handleSelectCareer}
                onSaveCareer={handleSaveCareer}
                savedCareerIds={savedCareerIds}
                selectedCareerId={selectedCareerId}
              />
            </NBCard>
          </div>

          {/* Progress Dashboard */}
          <div>
            <NBCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
              <ProgressDashboard />
              
              <div className="mt-6 space-y-3">
                <NBButton 
                  className="w-full" 
                  onClick={() => navigate('/learning-roadmap')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Roadmap
                </NBButton>
                
                <NBButton 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/resume-upload')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Resume Analysis
                </NBButton>
              </div>
            </NBCard>
          </div>
        </div>
      </div>
    </div>
  );
};