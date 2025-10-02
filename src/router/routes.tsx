import { Landing } from '@/pages/Landing'
import { Details } from '@/pages/Details'
import { Results } from '@/pages/Results'
import { CareerAssessment } from '@/pages/CareerAssessment'
import { CareerDashboard } from '@/pages/CareerDashboard'
import { CareerDetails } from '@/pages/CareerDetails'
import { CareerPathGenerator } from '@/pages/CareerPathGenerator'
import { LearningRoadmap } from '@/pages/LearningRoadmap'
import { EnhancedLearningRoadmap } from '@/pages/EnhancedLearningRoadmap'
import { LearningAssistant } from '@/pages/LearningAssistant'
import { AchievementsPage } from '@/pages/AchievementsPage'
import { ResumeUpload } from '@/pages/ResumeUpload'
import { ResumeAnalysisResults } from '@/pages/ResumeAnalysisResults'
import { AboutUs } from '@/pages/AboutUs'
import { FAQ } from '@/pages/FAQ'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import PlatformLinksDemo from '@/pages/PlatformLinksDemo'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/details" element={<Details />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/assessment" element={<CareerAssessment />} />
      <Route path="/dashboard" element={<CareerDashboard />} />
      <Route path="/career-dashboard" element={<CareerDashboard />} />
      <Route path="/progress-dashboard" element={<ProgressDashboard />} />
      <Route path="/career-details/:id" element={<CareerDetails />} />
      <Route path="/career-path-generator" element={<CareerPathGenerator />} />
      <Route path="/learning-roadmap" element={<EnhancedLearningRoadmap />} />
      <Route path="/learning-roadmap-detailed" element={<LearningRoadmap />} />
      <Route path="/learning-assistant" element={<LearningAssistant />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/resume-upload" element={<ResumeUpload />} />
      <Route path="/resume-analysis/:id" element={<ResumeAnalysisResults />} />
      <Route path="/platform-links-demo" element={<PlatformLinksDemo />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default AppRoutes
