import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { FormInput } from '../components/FormInput';
import { useUserStore } from '../lib/stores/userStore';
import { EducationLevel } from '../lib/types';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

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
  educationLevel: z.enum(['high-school', 'associates', 'bachelors', 'masters', 'phd', 'other'])
});

export const Details = () => {
  const navigate = useNavigate();
  const { setProfile } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const handleTakeAssessment = async (data: any) => {
    const profile = {
      ...data,
      skills: [] // Empty skills array since we'll get this from assessment
    };
    
    setProfile(profile);
    toast.success('Profile saved! Starting career assessment...');
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen career-assessment-bg relative pt-20">
      {/* Form Section */}
      <section className="py-12 px-4 relative">
        <div className="max-w-2xl mx-auto relative">
          <NBCard className="border-gray-300 bg-white/95 backdrop-blur-sm shadow-xl">
            <h2 className="text-3xl font-bold text-black mb-6">
              Tell us about yourself
            </h2>
            <p className="text-black mb-8">
              The more details you provide, the better our AI-powered career recommendations will be.
            </p>

            <form className="space-y-6">
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
                <label className="block text-sm font-medium text-black">
                  Education Level <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black"
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

              <div className="flex justify-between items-center pt-6">
                <NBButton
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </NBButton>
                
                <NBButton
                  type="button"
                  variant="primary"
                  onClick={handleSubmit(handleTakeAssessment)}
                  className="px-8"
                >
                  Start Career Assessment
                </NBButton>
              </div>
            </form>
          </NBCard>
        </div>
      </section>
    </div>
  );
};
