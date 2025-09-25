import { Landing } from '@/pages/Landing'
import { Details } from '@/pages/Details'
import { Results } from '@/pages/Results'
import { CareerAssessment } from '@/pages/CareerAssessment'
import { CareerDashboard } from '@/pages/CareerDashboard'
import { CareerDetails } from '@/pages/CareerDetails'
import { LearningRoadmap } from '@/pages/LearningRoadmap'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import PlatformLinksDemo from '@/pages/PlatformLinksDemo'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/details" element={<Details />} />
      <Route path="/assessment" element={<CareerAssessment />} />
      <Route path="/dashboard" element={<CareerDashboard />} />
      <Route path="/career-dashboard" element={<CareerDashboard />} />
      <Route path="/progress-dashboard" element={<ProgressDashboard />} />
      <Route path="/career-details/:id" element={<CareerDetails />} />
      <Route path="/learning-roadmap" element={<LearningRoadmap />} />
      <Route path="/platform-links-demo" element={<PlatformLinksDemo />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default AppRoutes
