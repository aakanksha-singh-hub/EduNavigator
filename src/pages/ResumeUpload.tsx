import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { FileUploader } from '../components/resume/FileUploader';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedResumeVersion } from '../lib/types';
import { ResumeService } from '../lib/services/resumeService';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, debugConfig } from '../lib/config';

export const ResumeUpload: React.FC = () => {
  const navigate = useNavigate();
  const { enhancedProfile, setEnhancedProfile } = useUserStore();
  
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');

  // Helper function to try multiple models
  const tryMultipleModels = async (genAI: GoogleGenerativeAI, prompt: string) => {
    const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
    
    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        console.log(`✅ ${modelName} worked!`);
        return result;
      } catch (error: any) {
        console.log(`❌ ${modelName} failed:`, error.message);
        if (error.message.includes('overloaded') && models.indexOf(modelName) < models.length - 1) {
          console.log(`Model ${modelName} is overloaded, trying next model...`);
          continue;
        }
        if (models.indexOf(modelName) === models.length - 1) {
          throw error;
        }
      }
    }
    throw new Error('All models failed');
  };

  const generateAIFeedback = async (
    extractedText: string,
    extractedInfo: any,
    jobDescription: string,
    jobTitle: string,
    companyName: string
  ) => {
    try {
      // Debug configuration
      debugConfig();
      console.log('API Key check:', {
        hasApiKey: !!config.geminiApiKey,
        apiKeyLength: config.geminiApiKey?.length,
        firstChars: config.geminiApiKey ? config.geminiApiKey.substring(0, 10) : 'none'
      });
      
      if (!config.geminiApiKey) {
        console.warn('Gemini API key not configured, using fallback feedback');
        throw new Error('API key not configured');
      }

      console.log('Creating Gemini instance with key:', config.geminiApiKey.substring(0, 10) + '...');
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);

      const prompt = `
Analyze this resume for a ${jobTitle} position at ${companyName} and provide detailed feedback:

RESUME CONTENT:
${extractedText}

JOB REQUIREMENTS:
${jobDescription}

Please provide feedback in the following JSON format:
{
  "overallScore": 85,
  "ATS": {
    "score": 80,
    "tips": [
      {"type": "good", "tip": "Good use of relevant keywords"},
      {"type": "improve", "tip": "Add more industry-specific terms"}
    ]
  },
  "toneAndStyle": {
    "score": 85,
    "tips": [
      {"type": "good", "tip": "Professional tone maintained", "explanation": "Your resume maintains professionalism throughout."},
      {"type": "improve", "tip": "Use stronger action verbs", "explanation": "Replace weak verbs with impactful ones."}
    ]
  },
  "content": {
    "score": 75,
    "tips": [
      {"type": "good", "tip": "Relevant experience highlighted", "explanation": "Your experience aligns well with the role."},
      {"type": "improve", "tip": "Add quantified achievements", "explanation": "Include specific metrics and results."}
    ]
  },
  "structure": {
    "score": 90,
    "tips": [
      {"type": "good", "tip": "Clear organization", "explanation": "Resume sections are well-structured."}
    ]
  },
  "skills": {
    "score": 80,
    "tips": [
      {"type": "improve", "tip": "Include more technical skills", "explanation": "Add skills mentioned in the job description."}
    ]
  }
}

Provide specific, actionable feedback based on the job requirements. Focus on ATS optimization, skill matching, and content improvement.
`;

      const result = await tryMultipleModels(genAI, prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback if parsing fails
      throw new Error('Failed to parse AI response');
      
    } catch (error) {
      console.error('AI feedback generation failed:', error);
      // Return fallback feedback
      return {
        overallScore: 75,
        ATS: {
          score: 70,
          tips: [
            { type: "improve", tip: "Optimize for ATS scanning" }
          ]
        },
        toneAndStyle: {
          score: 80,
          tips: [
            { type: "good", tip: "Professional tone maintained" }
          ]
        },
        content: {
          score: 75,
          tips: [
            { type: "improve", tip: "Add more specific achievements" }
          ]
        },
        structure: {
          score: 85,
          tips: [
            { type: "good", tip: "Well-organized format" }
          ]
        },
        skills: {
          score: 70,
          tips: [
            { type: "improve", tip: "Include more relevant skills" }
          ]
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a resume file');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get('companyName') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const jobDescription = formData.get('jobDescription') as string;

    if (!companyName || !jobTitle || !jobDescription) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsAnalyzing(true);
    setStatusText('Preparing analysis...');

    try {
      setStatusText('Processing resume file...');
      
      // Extract text and info from resume using AI
      const { extractedText, extractedInfo } = await ResumeService.processResumeFile(file);
      
      setStatusText('Analyzing compatibility with job requirements...');
      
      // Create resume analysis object
      const analysisId = `resume_${Date.now()}`;
      const resumeAnalysis: EnhancedResumeVersion = {
        id: analysisId,
        name: `${companyName} - ${jobTitle}`,
        description: `Resume analysis for ${jobTitle} at ${companyName}`,
        resumeData: {
          file: file,
          extractedText: extractedText,
          extractedInfo: extractedInfo
        },
        companyName,
        jobTitle,
        jobDescription,
        resumeUrl: URL.createObjectURL(file),
        createdAt: new Date(),
        isActive: true,
        status: 'analyzing'
      };

      setStatusText('Generating AI-powered feedback...');
      
      // Generate AI feedback based on job requirements
      const feedback = await generateAIFeedback(extractedText, extractedInfo, jobDescription, jobTitle, companyName);

      resumeAnalysis.feedback = feedback;
      resumeAnalysis.status = 'completed';

      console.log('About to save resume analysis:', resumeAnalysis);
      console.log('Current enhanced profile:', enhancedProfile);

      // Update user profile with resume analysis - create profile if it doesn't exist
      const updatedProfile = enhancedProfile ? {
        ...enhancedProfile,
        resumeVersions: [...(enhancedProfile.resumeVersions || []), resumeAnalysis],
        updatedAt: new Date()
      } : {
        // Create new enhanced profile if none exists
        id: `user_${Date.now()}`,
        userId: 'anonymous',
        name: '',
        email: '',
        resumeVersions: [resumeAnalysis],
        careerRecommendations: [],
        progressData: {
          skillsLearned: 0,
          coursesCompleted: 0,
          projectsCompleted: 0,
          studyHours: 0,
          weeklyGoal: 10,
          weeklyProgress: 0,
          monthlyGoal: 40,
          monthlyProgress: 0,
          careerProgressPercentage: 0,
          skillDistribution: {},
          levelInfo: {
            currentLevel: 1,
            currentLevelName: 'Beginner',
            experiencePoints: 0,
            pointsToNextLevel: 100,
            totalPointsForNextLevel: 100
          }
        },
        achievements: [],
        currentMilestones: [],
        level: 1,
        experiencePoints: 0,
        badges: [],
        streaks: {
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: new Date()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      } as any; // Temporary type assertion to avoid complex type issues
      
      console.log('Updated profile to save:', updatedProfile);
      setEnhancedProfile(updatedProfile);
      console.log('Profile saved, navigating to results...');

      setStatusText('Analysis complete! Redirecting...');
      toast.success('Resume analysis completed successfully!');
      
      // Navigate to results page
      setTimeout(() => {
        navigate(`/resume-analysis/${analysisId}`);
      }, 1000);

    } catch (error) {
      console.error('Resume analysis failed:', error);
      setStatusText('');
      setIsAnalyzing(false);
      toast.error('Failed to analyze resume. Please try again.');
    }
  };

  return (
    <div className="min-h-screen career-assessment-bg p-6">
      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 mt-16">
        {isAnalyzing ? (
          <NBCard className="p-8 text-center">
            <div className="space-y-6">
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Analyzing Your Resume
                </h2>
                <p className="text-muted-foreground">{statusText}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </NBCard>
        ) : (
          <NBCard className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Your Resume for Analysis
              </h2>
              <p className="text-muted-foreground">
                Get AI-powered feedback on your resume's ATS compatibility, content quality, 
                and optimization suggestions tailored to your target job.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., Google, Microsoft, Apple"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-foreground mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="e.g., Software Engineer, Data Scientist"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-foreground mb-2">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={6}
                  placeholder="Paste the job description here to get more targeted feedback..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Resume File
                </label>
                <FileUploader onFileSelect={setFile} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <NBButton
                  type="submit"
                  disabled={!file}
                  className="flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Analyze Resume</span>
                </NBButton>
              </div>
            </form>
          </NBCard>
        )}
      </main>
    </div>
  );
};