import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { FormInput } from '../components/FormInput';
import { ResumeUpload } from '../components/ResumeUpload';
import { GridBackgroundSmall } from '../components/ui/grid-background';
import { DotBackground } from '../components/ui/dot-background';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { EducationLevel, ResumeData } from '../lib/types';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, FileText } from 'lucide-react';

const educationLevels: { value: EducationLevel; label: string }[] = [
  { value: 'high-school', label: 'High School' },
  { value: 'associates', label: 'Associate Degree' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' }
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(16, 'Age must be at least 16').max(100, 'Age must be less than 100'),
  educationLevel: z.enum(['high-school', 'associates', 'bachelors', 'masters', 'phd', 'other']),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  careerInterest: z.string().min(5, 'Career interest must be at least 5 characters'),
  location: z.string().optional(),
  resume: z.any().optional()
});

export const Details = () => {
  const navigate = useNavigate();
  const { setProfile, setResults } = useUserStore();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: []
    }
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setValue('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setValue('skills', newSkills);
  };

  const handleResumeUploaded = (resume: ResumeData) => {
    setResumeData(resume);
    setValue('resume', resume);
    
    // Auto-populate skills from resume if user hasn't added any yet
    if (skills.length === 0 && resume.extractedInfo.skills.length > 0) {
      const resumeSkills = resume.extractedInfo.skills.slice(0, 10); // Limit to first 10 skills
      setSkills(resumeSkills);
      setValue('skills', resumeSkills);
      toast.success(`Added ${resumeSkills.length} skills from your resume!`);
    }
  };

  const handleResumeRemoved = () => {
    setResumeData(null);
    setValue('resume', undefined);
  };

  const onSubmit = async (data: any) => {
    const profile = {
      ...data,
      skills: data.skills,
      resume: resumeData || undefined
    };
    
    setProfile(profile);
    setIsLoading(true);
    
    // Generate career recommendation with Gemini API
    try {
      const results = await CareerService.generatePath(profile);
      setResults(results);
      toast.success('Career path generated successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Error generating career path:', error);
      toast.error('Failed to generate career path. Using fallback data.');
      // The service will automatically fall back to mock data
      const results = await CareerService.generatePath(profile);
      setResults(results);
      navigate('/results');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen light-rays-bg relative">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="text-2xl font-bold text-foreground">
                Enter Your Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="py-12 px-4 relative">
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
        <div className="max-w-2xl mx-auto relative">
          <NBCard className="border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Tell us about yourself
            </h2>
            <p className="text-muted-foreground mb-8">
              The more details you provide, the better our AI-powered career recommendations will be.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  register={register}
                  error={errors.name as any}
                  required
                />

              <FormInput
                label="Age"
                name="age"
                type="number"
                placeholder="Enter your age"
                register={register}
                error={errors.age as any}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Education Level <span className="text-destructive ml-1">*</span>
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('educationLevel')}
                >
                  {educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.educationLevel && (
                  <p className="text-sm text-destructive font-medium">
                    {(errors.educationLevel as any).message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Skills <span className="text-destructive ml-1">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., JavaScript, Python, Design)"
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <NBButton
                    type="button"
                    onClick={addSkill}
                    variant="accent"
                    className="px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </NBButton>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-accent-foreground/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <p className="text-sm text-destructive font-medium">
                    {(errors.skills as any).message}
                  </p>
                )}
              </div>

              <FormInput
                label="Career Interest"
                name="careerInterest"
                placeholder="What career are you interested in? (e.g., Software Development, Data Science, Product Management)"
                register={register}
                error={errors.careerInterest as any}
                required
              />

              <FormInput
                label="Location (Optional)"
                name="location"
                placeholder="City, Country"
                register={register}
                error={errors.location as any}
              />

              {/* Resume Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Resume Upload (Optional)
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Upload your resume to automatically extract skills, experience, and education details for more personalized recommendations.
                </p>
                <ResumeUpload
                  onResumeUploaded={handleResumeUploaded}
                  onResumeRemoved={handleResumeRemoved}
                  resumeData={resumeData || undefined}
                  disabled={isLoading}
                />
                {resumeData && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                    <FileText className="w-3 h-3" />
                    <span>Resume data will be used to enhance your career recommendations</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <NBButton
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/')}
                  disabled={isLoading}
                >
                  Cancel
                </NBButton>
                <NBButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Career Path'}
                </NBButton>
              </div>
            </form>
          </NBCard>
        </div>
      </section>
    </div>
  );
};
