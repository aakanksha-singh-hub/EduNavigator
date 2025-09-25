import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerRecommendationsList } from '../components/CareerRecommendationsList';
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
  ArrowLeft, 
  RefreshCw, 
  User, 
  Target, 
  Bookmark,
  TrendingUp,
  BarChart3,
  Settings,
  Download
} from 'lucide-react';

export const CareerDashboard = () => {
  const navigate = useNavigate();
  const { profile, enhancedProfile, setEnhancedProfile } = useUserStore();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCareerIds, setSavedCareerIds] = useState<string[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState<string | undefined>();

  useEffect(() => {
    const checkAndLoad = async () => {
      console.log('CareerDashboard - checking profile and enhanced profile...');
      console.log('Profile:', profile);
      console.log('Enhanced Profile:', enhancedProfile);
      
      // Add a small delay to allow store to update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!profile) {
        console.log('No profile found, redirecting to details');
        toast.error('Please complete your profile first');
        navigate('/details');
        return;
      }

      if (!enhancedProfile?.careerAssessment) {
        console.log('No enhanced profile or assessment found, redirecting to assessment');
        toast.error('Please complete your career assessment first');
        navigate('/assessment');
        return;
      }

      console.log('Profile and assessment found, loading recommendations...');
      loadRecommendations();
    };

    checkAndLoad();
  }, [profile, enhancedProfile, navigate]);

  const loadRecommendations = async () => {
    if (!profile || !enhancedProfile?.careerAssessment) return;

    setIsLoading(true);
    try {
      const recs = await CareerService.generateRecommendations(
        profile,
        enhancedProfile.careerAssessment
      );
      setRecommendations(recs);
      
      // Update enhanced profile with recommendations
      const updatedProfile = {
        ...enhancedProfile,
        careerRecommendations: recs,
        updatedAt: new Date()
      };
      setEnhancedProfile(updatedProfile);
      
      toast.success(`Generated ${recs.length} personalized career recommendations!`);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load career recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshRecommendations = async () => {
    // Clear cache and regenerate
    await loadRecommendations();
  };

  const handleSelectCareer = (recommendation: CareerRecommendation) => {
    setSelectedCareerId(recommendation.id);
    
    if (enhancedProfile) {
      const updatedProfile = {
        ...enhancedProfile,
        selectedCareerPath: recommendation.id,
        updatedAt: new Date()
      };
      setEnhancedProfile(updatedProfile);
    }
    
    toast.success(`Selected ${recommendation.title} as your career path!`);
  };

  const handleSaveCareer = (recommendation: CareerRecommendation) => {
    setSavedCareerIds(prev => {
      const isAlreadySaved = prev.includes(recommendation.id);
      const newSavedIds = isAlreadySaved 
        ? prev.filter(id => id !== recommendation.id)
        : [...prev, recommendation.id];
      
      toast.success(
        isAlreadySaved 
          ? `Removed ${recommendation.title} from saved careers`
          : `Saved ${recommendation.title} to your favorites`
      );
      
      return newSavedIds;
    });
  };

  const handleViewDetails = () => {
    // Navigate to detailed view (could be implemented later)
    toast.info('Detailed career view coming soon!');
  };

  const handleExportData = () => {
    if (!enhancedProfile) return;
    
    const exportData = {
      profile: enhancedProfile,
      recommendations,
      savedCareers: savedCareerIds,
      selectedCareer: selectedCareerId,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career-recommendations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Career data exported successfully!');
  };

  const getAssessmentSummary = () => {
    if (!enhancedProfile?.careerAssessment) return '';
    return AssessmentService.generateAssessmentSummary(enhancedProfile.careerAssessment);
  };

  const getTopRecommendation = () => {
    return recommendations.length > 0 ? recommendations[0] : null;
  };

  if (!profile || !enhancedProfile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen light-rays-bg relative">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/assessment')}
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Career Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Personalized career recommendations based on your assessment
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mr-4">
                <User className="w-4 h-4" />
                <span>{profile.name}</span>
              </div>
              
              <NBButton
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </NBButton>
              
              <NBButton
                variant="secondary"
                size="sm"
                onClick={handleRefreshRecommendations}
                disabled={isLoading}
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </NBButton>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-8 px-4 relative">
        <GridBackgroundSmall 
          size={24} 
          lineColor="rgba(139, 92, 246, 0.1)" 
          opacity={0.2}
          className="absolute inset-0"
        >
          <div />
        </GridBackgroundSmall>
        <DotBackground 
          size={40} 
          dotColor="rgba(34, 197, 94, 0.08)" 
          opacity={0.3}
          className="absolute inset-0"
        >
          <div />
        </DotBackground>

        <div className="max-w-7xl mx-auto relative space-y-8">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <NBCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recommendations</p>
                  <p className="text-2xl font-bold text-foreground">{recommendations.length}</p>
                </div>
              </div>
            </NBCard>

            <NBCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Fit Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {getTopRecommendation()?.fitScore || 0}%
                  </p>
                </div>
              </div>
            </NBCard>

            <NBCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Bookmark className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saved Careers</p>
                  <p className="text-2xl font-bold text-foreground">{savedCareerIds.length}</p>
                </div>
              </div>
            </NBCard>

            <NBCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assessment Score</p>
                  <p className="text-2xl font-bold text-foreground">
                    {enhancedProfile.careerAssessment ? AssessmentService.getAssessmentProgress(enhancedProfile.careerAssessment) : 0}%
                  </p>
                </div>
              </div>
            </NBCard>
          </div>

          {/* Assessment Summary */}
          <NBCard className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">Your Career Profile</h2>
            <p className="text-muted-foreground mb-4">
              {getAssessmentSummary()}
            </p>
            <div className="flex space-x-4">
              <NBButton
                variant="secondary"
                size="sm"
                onClick={() => navigate('/assessment')}
                className="flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Retake Assessment</span>
              </NBButton>
              {selectedCareerId && (
                <NBButton
                  size="sm"
                  onClick={() => {
                    const selected = recommendations.find(r => r.id === selectedCareerId);
                    if (selected) {
                      toast.info(`Your selected career: ${selected.title}`);
                    }
                  }}
                  className="flex items-center space-x-1"
                >
                  <Target className="w-4 h-4" />
                  <span>View Selected Career</span>
                </NBButton>
              )}
            </div>
          </NBCard>

          {/* Recommendations */}
          {isLoading ? (
            <NBCard className="p-8 text-center">
              <div className="space-y-4">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Generating Recommendations</h3>
                  <p className="text-muted-foreground">
                    Analyzing your assessment and creating personalized career suggestions...
                  </p>
                </div>
              </div>
            </NBCard>
          ) : recommendations.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Your Career Recommendations
                </h2>
                <div className="text-sm text-muted-foreground">
                  Based on your assessment completed on{' '}
                  {enhancedProfile.careerAssessment?.completedAt.toLocaleDateString()}
                </div>
              </div>
              
              <CareerRecommendationsList
                recommendations={recommendations}
                onSelectCareer={handleSelectCareer}
                onSaveCareer={handleSaveCareer}
                onViewDetails={handleViewDetails}
                savedCareerIds={savedCareerIds}
                selectedCareerId={selectedCareerId}
              />
            </div>
          ) : (
            <NBCard className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">No Recommendations Yet</h3>
                  <p className="text-muted-foreground">
                    We couldn't generate recommendations. Please try refreshing or retaking your assessment.
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <NBButton
                    variant="secondary"
                    onClick={() => navigate('/assessment')}
                  >
                    Retake Assessment
                  </NBButton>
                  <NBButton onClick={handleRefreshRecommendations}>
                    Try Again
                  </NBButton>
                </div>
              </div>
            </NBCard>
          )}
        </div>
      </section>
    </div>
  );
};