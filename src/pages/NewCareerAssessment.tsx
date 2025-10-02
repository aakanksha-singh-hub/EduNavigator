import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleDomainAssessment } from '../components/SimpleDomainAssessment';
import { SimpleDomainResults } from '../components/SimpleDomainResults';
import { useUserStore } from '../lib/stores/userStore';
import { toast } from 'sonner';

interface SimpleDomainData {
  domain: string;
  name: string;
}

export const NewCareerAssessment = () => {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentData, setAssessmentData] = useState<SimpleDomainData | null>(null);

  useEffect(() => {
    // Check if user has a profile
    const checkProfile = () => {
      console.log('Checking profile:', profile);
      
      if (!profile) {
        console.log('No profile found, redirecting to details');
        toast.error('Please complete your basic profile first');
        navigate('/details');
        return;
      }
      
      setIsCheckingProfile(false);
    };

    // Small delay to allow store hydration
    const timer = setTimeout(checkProfile, 100);
    return () => clearTimeout(timer);
  }, [profile, navigate]);

  const handleAssessmentComplete = (data: SimpleDomainData) => {
    console.log('🎯 Assessment completed:', data);
    setAssessmentData(data);
    setAssessmentComplete(true);
  };

  const handleRestart = () => {
    console.log('🔄 Restarting assessment');
    setAssessmentComplete(false);
    setAssessmentData(null);
  };

  // Loading state
  if (isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen">
      {!assessmentComplete ? (
        <SimpleDomainAssessment onComplete={handleAssessmentComplete} />
      ) : (
        assessmentData && (
          <SimpleDomainResults
            domain={assessmentData.domain}
            name={assessmentData.name}
            onRestart={handleRestart}
          />
        )
      )}
    </div>
  );
};