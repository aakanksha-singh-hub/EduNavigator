import { Landing } from '@/pages/Landing'
import { Details } from '@/pages/Details'
import { Results } from '@/pages/Results'
import { CareerAssessment } from '@/pages/CareerAssessment'
import { CareerDashboard } from '@/pages/CareerDashboard'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/details" element={<Details />} />
      <Route path="/assessment" element={<CareerAssessment />} />
      <Route path="/career-dashboard" element={<CareerDashboard />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default AppRoutes
