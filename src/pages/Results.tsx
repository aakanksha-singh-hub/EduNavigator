import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { FlowChart } from '../components/FlowChart';
import { SummaryPanel } from '../components/SummaryPanel';
import { GridBackground } from '../components/ui/grid-background';
import { DotBackground } from '../components/ui/dot-background';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { AlternativeCareer } from '../lib/types';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';

export const Results = () => {
  const navigate = useNavigate();
  const { profile, results, setResults, clearData } = useUserStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAlternative, setSelectedAlternative] = useState<string | null>(null);
  const [originalResults, setOriginalResults] = useState(results);

  useEffect(() => {
    if (!profile || !results) {
      navigate('/details');
      return;
    }
    
    // Store original results when first loaded
    if (!originalResults) {
      setOriginalResults(results);
    }
    
    // Show success toast
    toast.success('Career path generated! (demo)');
  }, [profile, results, navigate, originalResults]);

  const handleStartOver = () => {
    clearData();
    navigate('/details');
  };

  const handleBackToOriginal = () => {
    if (originalResults) {
      setResults(originalResults);
      toast.success('Returned to original career path');
    }
  };

  const handleAlternativeCareerClick = async (alternative: AlternativeCareer) => {
    if (!profile || isGenerating) return;

    setSelectedAlternative(alternative.id);
    setIsGenerating(true);

    try {
      // Create a modified profile with the alternative career as the main interest
      const modifiedProfile = {
        ...profile,
        careerInterest: alternative.title,
        skills: [...profile.skills, ...alternative.requirements]
      };

      // Generate new career path for the selected alternative
      const newResults = await CareerService.generatePath(modifiedProfile);
      setResults(newResults);
      
      toast.success(`Generated career path for ${alternative.title}!`);
    } catch (error) {
      console.error('Error generating alternative career path:', error);
      toast.error('Failed to generate career path for this alternative. Please try again.');
    } finally {
      setIsGenerating(false);
      setSelectedAlternative(null);
    }
  };

  if (!profile || !results) {
    return null;
  }

  return (
    <div className="min-h-screen light-rays-bg relative">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-2xl font-bold text-foreground">
                Your Career Path
              </h1>
            </div>
            <div className="flex space-x-2">
              {originalResults && results !== originalResults && (
                <NBButton
                  variant="secondary"
                  onClick={handleBackToOriginal}
                  className="flex items-center space-x-2 border-border/50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Original</span>
                </NBButton>
              )}
              <NBButton
                variant="secondary"
                onClick={handleStartOver}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Start Over</span>
              </NBButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-8 px-4 relative">
        <GridBackground 
          size={40} 
          lineColor="rgba(139, 92, 246, 0.15)" 
          opacity={0.2}
          className="absolute inset-0"
        >
          <div />
        </GridBackground>
        <DotBackground 
          size={60} 
          dotColor="rgba(34, 197, 94, 0.1)" 
          opacity={0.3}
          className="absolute inset-0"
        >
          <div />
        </DotBackground>
        <div className="max-w-7xl mx-auto relative">
          {/* Summary Panel - Full Width */}
          <div className="mb-8">
            <SummaryPanel 
              recommendation={results} 
              userName={profile.name} 
            />
          </div>

          {/* Flow Chart - Full Width Below */}
          <div className="w-full">
            <NBCard className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="p-6 pb-4">
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Your Career Journey
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Explore your AI-generated career path. Click and drag to navigate, 
                  zoom in/out to see details, and discover the connections between 
                  different opportunities.
                </p>
              </div>
              <div className="px-6 pb-6">
                <FlowChart 
                  nodes={results.careerPath.nodes}
                  edges={results.careerPath.edges}
                  className="w-full"
                  height="600px"
                />
              </div>
            </NBCard>
          </div>

          {/* Legend */}
          <div className="mt-8">
            <NBCard className="border-border/50 bg-card/50 backdrop-blur-sm">
              <h4 className="text-lg font-bold text-foreground mb-6">
                Career Path Legend
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Courses</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Internships</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-accent to-green-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Jobs</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Companies</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                  <span className="text-sm font-medium text-foreground">Skills</span>
                </div>
              </div>
            </NBCard>
          </div>

          {/* Alternative Career Options */}
          <div className="mt-8">
            <NBCard className="border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Alternative Career Options
                </h3>
                <p className="text-sm text-muted-foreground">
                  Click on any career below to generate a personalized career path for that role
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => handleAlternativeCareerClick(alt)}
                    className={`group bg-gradient-to-r from-card to-card/50 border border-border/50 rounded-xl p-5 shadow-lg transition-all duration-300 cursor-pointer ${
                      selectedAlternative === alt.id
                        ? 'border-primary/50 bg-primary/5 scale-[1.02]'
                        : 'hover:shadow-xl hover:border-primary/30 hover:scale-[1.02]'
                    } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                        {alt.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-sm font-bold text-foreground">{alt.matchScore}%</div>
                          <div className="text-xs text-muted-foreground">match</div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                          {selectedAlternative === alt.id ? (
                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          ) : (
                            <div className="w-6 h-6 bg-primary/30 rounded-full flex items-center justify-center">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {alt.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span className="text-primary">💰</span>
                          <span className="font-medium">{alt.salary}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-primary">📈</span>
                          <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                            alt.growth === 'high' 
                              ? 'bg-green-500/20 text-green-400' 
                              : alt.growth === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {alt.growth} growth
                          </span>
                        </div>
                      </div>
                      
                      {selectedAlternative === alt.id ? (
                        <div className="flex items-center justify-center text-sm text-primary font-medium">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating career path...
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground bg-primary/10 px-3 py-1 rounded-full inline-block">
                            Click to explore this career path
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </NBCard>
          </div>
        </div>
      </div>
    </div>
  );
};
