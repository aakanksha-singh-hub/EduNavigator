import React, { useState } from 'react';
import { SimpleDomainAssessment } from './components/SimpleDomainAssessment';
import { SimpleDomainResults } from './components/SimpleDomainResults';

interface AssessmentData {
  domain: string;
  name: string;
}

function App() {
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const handleAssessmentComplete = (data: AssessmentData) => {
    console.log('🎯 Assessment completed:', data);
    setAssessmentData(data);
    setAssessmentComplete(true);
  };

  const handleRestart = () => {
    console.log('🔄 Restarting assessment');
    setAssessmentComplete(false);
    setAssessmentData(null);
  };

  if (assessmentComplete && assessmentData) {
    return (
      <SimpleDomainResults
        domain={assessmentData.domain}
        name={assessmentData.name}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <SimpleDomainAssessment onComplete={handleAssessmentComplete} />
  );
}

export default App;