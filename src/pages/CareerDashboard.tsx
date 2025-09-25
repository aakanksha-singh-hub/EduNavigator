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
  ArrowLeft, 
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
  const [activeTab, setActiveTab] = useState<'recommendations' | 'progress'>('recommendations');

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

      // Only load recommendations if we don't have any yet
      if (enhancedProfile.careerRecommendations.length === 0) {
        console.log('Profile and assessment found, loading recommendations...');
        // Add a timeout to prevent infinite loading
        const loadTimeout = setTimeout(() => {
          console.log('Loading timeout reached, using fallback');
          handleUseFallbackRecommendations();
        }, 10000); // 10 second timeout
        
        loadRecommendations().finally(() => {
          clearTimeout(loadTimeout);
        });
      } else {
        console.log('Using existing recommendations from profile');
        setRecommendations(enhancedProfile.careerRecommendations);
      }
    };

    checkAndLoad();
  }, [profile, enhancedProfile?.careerAssessment, navigate]); // Remove enhancedProfile from dependencies, only watch for assessment changes

  const loadRecommendations = async () => {
    if (!profile || !enhancedProfile?.careerAssessment) {
      console.log('Missing profile or assessment data');
      return;
    }

    console.log('Starting to load recommendations...');
    setIsLoading(true);
    
    try {
      console.log('Calling CareerService.generateRecommendations...');
      const recs = await CareerService.generateRecommendations(
        profile,
        enhancedProfile.careerAssessment
      );
      
      console.log('Received recommendations:', recs);
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
      toast.error(`Failed to load career recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Set empty recommendations to stop loading state
      setRecommendations([]);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleRefreshRecommendations = async () => {
    // Clear cache and regenerate
    await loadRecommendations();
  };

  const handleUseFallbackRecommendations = async () => {
    console.log('Using fallback recommendations...');
    setIsLoading(true);
    
    try {
      // Import the service directly to call fallback
      const { CareerRecommendationService } = await import('../lib/services/careerRecommendationService');
      const fallbackRecs = profile ? CareerRecommendationService.getIntelligentFallbackRecommendations(profile, enhancedProfile?.careerAssessment) : [];
      
      console.log('Got fallback recommendations:', fallbackRecs);
      setRecommendations(fallbackRecs);
      
      if (enhancedProfile) {
        const updatedProfile = {
          ...enhancedProfile,
          careerRecommendations: fallbackRecs,
          updatedAt: new Date()
        };
        setEnhancedProfile(updatedProfile);
      }
      
      toast.success(`Generated ${fallbackRecs.length} curated career recommendations!`);
    } catch (error) {
      console.error('Error with fallback recommendations:', error);
      toast.error('Failed to load fallback recommendations');
      // Set empty array to stop loading
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = async (recommendation: CareerRecommendation) => {
    setSelectedCareerId(recommendation.id);
    
    if (enhancedProfile) {
      try {
        // Show loading state
        toast.loading('Setting up your career path...', { id: 'career-setup' });
        
        let skillGapAnalysis = null;
        let learningRoadmap = null;
        
        try {
          // 1. Generate skill gap analysis
          const { SkillAnalysisService } = await import('../lib/services/skillAnalysisService');
          skillGapAnalysis = await SkillAnalysisService.analyzeSkillGaps(
            enhancedProfile,
            recommendation.title
          );
        } catch (skillError) {
          console.warn('Skill gap analysis failed, using basic analysis:', skillError);
          skillGapAnalysis = {
            targetCareer: recommendation.title,
            overallReadiness: 70,
            strengthAreas: enhancedProfile.skills || [],
            improvementAreas: recommendation.requiredSkills?.map(s => s.name) || [],
            analysisDate: new Date()
          };
        }
        
        try {
          // 2. Generate learning roadmap
          const { LearningRoadmapService } = await import('../lib/services/learningRoadmapService');
          const roadmapOptions = {
            timeframe: 'moderate' as const,
            budget: 'medium' as const,
            learningStyle: 'mixed' as const,
            timeCommitment: 10, // 10 hours per week
            focusAreas: skillGapAnalysis.improvementAreas || []
          };
          
          const generatedRoadmap = await LearningRoadmapService.generateLearningRoadmap(
            skillGapAnalysis,
            roadmapOptions
          );
          
          learningRoadmap = generatedRoadmap.learningPath;
        } catch (roadmapError) {
          console.warn('Learning roadmap generation failed, using basic roadmap:', roadmapError);
          learningRoadmap = {
            id: `roadmap_${recommendation.id}`,
            title: `${recommendation.title} Learning Path`,
            description: `Personalized learning path for ${recommendation.title}`,
            totalDuration: '6-12 months',
            phases: [
              {
                id: 'phase_1',
                title: 'Foundation Skills',
                description: 'Build fundamental skills required for this career',
                duration: '2-3 months',
                priority: 'critical' as const,
                resources: [],
                skills: recommendation.requiredSkills?.slice(0, 3).map(s => s.name) || [],
                order: 1
              },
              {
                id: 'phase_2',
                title: 'Advanced Skills',
                description: 'Develop advanced skills and specializations',
                duration: '3-4 months',
                priority: 'important' as const,
                resources: [],
                skills: recommendation.requiredSkills?.slice(3, 6).map(s => s.name) || [],
                order: 2
              },
              {
                id: 'phase_3',
                title: 'Professional Development',
                description: 'Build portfolio and gain practical experience',
                duration: '2-3 months',
                priority: 'important' as const,
                resources: [],
                skills: ['Portfolio Development', 'Professional Networking'],
                order: 3
              }
            ],
            estimatedCost: 1500,
            difficulty: 'intermediate' as const,
            prerequisites: enhancedProfile.skills || [],
            outcomes: [
              `Proficiency in ${recommendation.title} skills`,
              'Industry-ready portfolio',
              'Job interview preparation'
            ]
          };
        }
        
        // 3. Update profile with all the new data
        const updatedProfile = {
          ...enhancedProfile,
          selectedCareerPath: recommendation.id,
          // Add skill gap analysis results
          skillGapAnalysis,
          // Add learning roadmap
          learningRoadmap,
          updatedAt: new Date()
        };
        
        setEnhancedProfile(updatedProfile);
        
        // 4. Award gamification points and achievements
        const { useUserStore } = await import('../lib/stores/userStore');
        const store = useUserStore.getState();
        
        // Award XP for career selection
        store.awardExperience(100, `Selected career path: ${recommendation.title}`);
        
        // Check for career selection achievements
        store.checkAndAwardAchievements('career_selected', { career: recommendation });
        
        // Award XP for skill gap analysis
        store.awardExperience(75, 'Completed skill gap analysis');
        store.checkAndAwardAchievements('skill_gap_analysis', { analysis: skillGapAnalysis });
        
        // Award XP for roadmap generation
        store.awardExperience(100, 'Generated learning roadmap');
        store.checkAndAwardAchievements('roadmap_generated', { roadmap: learningRoadmap });
        
        // Update milestone progress
        store.updateMilestoneProgress();
        
        // 5. Show success and navigate to roadmap
        toast.success(`🎉 Career path set up successfully!`, { id: 'career-setup' });
        toast.info('Check out your personalized learning roadmap!');
        
        // Navigate to learning roadmap view after a short delay
        setTimeout(() => {
          navigate('/learning-roadmap');
        }, 2000);
        
      } catch (error) {
        console.error('Error setting up career path:', error);
        toast.error('Failed to set up career path completely, but selection saved.', { id: 'career-setup' });
        
        // Still update the basic selection
        const updatedProfile = {
          ...enhancedProfile,
          selectedCareerPath: recommendation.id,
          updatedAt: new Date()
        };
        setEnhancedProfile(updatedProfile);
      }
    }
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

  const handleViewDetails = (recommendation: CareerRecommendation) => {
    // Navigate to detailed view with the recommendation data
    navigate(`/career-details/${recommendation.id}`, { 
      state: { recommendation } 
    });
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

      {/* Tab Navigation */}
      <div className="border-b border-border/20 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Career Recommendations</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'progress'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Progress Dashboard</span>
              </div>
            </button>
          </div>
        </div>
      </div>

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
          {/* Progress Dashboard Tab */}
          {activeTab === 'progress' && (
            <ProgressDashboard />
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-8">
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

          {/* Selected Career Path */}
          {enhancedProfile?.selectedCareerPath && (
            <NBCard className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Selected Career Path</h2>
                  <p className="text-green-700">
                    {recommendations.find(r => r.id === enhancedProfile.selectedCareerPath)?.title || 'Career Path Selected'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <NBButton
                  size="sm"
                  onClick={() => navigate('/learning-roadmap')}
                  className="flex items-center space-x-1"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>View Learning Roadmap</span>
                </NBButton>
                <NBButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const selected = recommendations.find(r => r.id === enhancedProfile.selectedCareerPath);
                    if (selected) {
                      navigate(`/career-details/${selected.id}`, { state: { recommendation: selected } });
                    }
                  }}
                  className="flex items-center space-x-1"
                >
                  <Target className="w-4 h-4" />
                  <span>View Details</span>
                </NBButton>
              </div>
            </NBCard>
          )}

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
              {!enhancedProfile?.selectedCareerPath && selectedCareerId && (
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
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Taking too long? You can use our curated recommendations instead.
                  </p>
                  <NBButton 
                    variant="secondary"
                    size="sm"
                    onClick={handleUseFallbackRecommendations}
                  >
                    Use Curated Recommendations
                  </NBButton>
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
                  <NBButton 
                    variant="accent"
                    onClick={handleUseFallbackRecommendations}
                  >
                    Use Curated Recommendations
                  </NBButton>
                </div>
              </div>
            </NBCard>
          )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};