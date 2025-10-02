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

export const CareerAssessment = () => {
  const navigate = useNavigate();
  const { profile } = useUserStore();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentData, setAssessmentData] = useState<SimpleDomainData | null>(null);

  useEffect(() => {
    // No profile check needed - assessment can work without it
    setIsCheckingProfile(false);
  }, []);

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

  return (
    <div className="min-h-screen career-assessment-bg">
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