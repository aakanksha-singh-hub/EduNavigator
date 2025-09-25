import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { FileUploader } from '../components/resume/FileUploader';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedResumeVersion } from '../lib/types';

export const ResumeUpload: React.FC = () => {
  const navigate = useNavigate();
  const { enhancedProfile, setEnhancedProfile } = useUserStore();
  
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');

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
      // Create resume analysis object
      const analysisId = `resume_${Date.now()}`;
      const resumeAnalysis: EnhancedResumeVersion = {
        id: analysisId,
        name: `${companyName} - ${jobTitle}`,
        description: `Resume analysis for ${jobTitle} at ${companyName}`,
        resumeData: {
          file: file,
          extractedText: '', // Will be populated by AI
          extractedInfo: {
            skills: [],
            experience: [],
            education: []
          }
        },
        companyName,
        jobTitle,
        jobDescription,
        resumeUrl: URL.createObjectURL(file),
        createdAt: new Date(),
        isActive: true,
        status: 'analyzing'
      };

      setStatusText('Analyzing resume content...');
      
      // Simulate AI analysis (replace with actual AI service call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock feedback (replace with actual AI analysis)
      const mockFeedback = {
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        ATS: {
          score: Math.floor(Math.random() * 20) + 75,
          tips: [
            { type: "good" as const, tip: "Good use of industry keywords" },
            { type: "improve" as const, tip: "Add more quantifiable achievements" }
          ]
        },
        toneAndStyle: {
          score: Math.floor(Math.random() * 25) + 70,
          tips: [
            { 
              type: "good" as const, 
              tip: "Professional tone maintained", 
              explanation: "Your resume maintains a professional and confident tone throughout." 
            },
            { 
              type: "improve" as const, 
              tip: "Use stronger action verbs", 
              explanation: "Replace weak verbs like 'responsible for' with stronger alternatives like 'managed', 'led', or 'implemented'." 
            }
          ]
        },
        content: {
          score: Math.floor(Math.random() * 25) + 65,
          tips: [
            { 
              type: "good" as const, 
              tip: "Relevant experience highlighted", 
              explanation: "Your work experience aligns well with the target role." 
            },
            { 
              type: "improve" as const, 
              tip: "Add more quantified results", 
              explanation: "Include specific numbers, percentages, or metrics to demonstrate your impact." 
            }
          ]
        },
        structure: {
          score: Math.floor(Math.random() * 20) + 75,
          tips: [
            { 
              type: "good" as const, 
              tip: "Clear section organization", 
              explanation: "Your resume sections are well-organized and easy to follow." 
            }
          ]
        },
        skills: {
          score: Math.floor(Math.random() * 25) + 70,
          tips: [
            { 
              type: "improve" as const, 
              tip: "Include more technical skills", 
              explanation: "Add specific technical skills mentioned in the job description." 
            }
          ]
        }
      };

      resumeAnalysis.feedback = mockFeedback;
      resumeAnalysis.status = 'completed';

      // Update user profile with resume analysis
      if (enhancedProfile) {
        const updatedProfile = {
          ...enhancedProfile,
          resumeVersions: [...(enhancedProfile.resumeVersions || []), resumeAnalysis],
          updatedAt: new Date()
        };
        setEnhancedProfile(updatedProfile);
      }

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
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Resume Analyzer</h1>
            <p className="text-muted-foreground">
              Get instant feedback and ATS optimization suggestions
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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