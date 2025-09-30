import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { Layout } from '@/components/Layout'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'

// Import API test utility for debugging
import '@/lib/utils/apiTest'

function AppContent() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  
  return (
    <div className={`relative min-h-screen ${isHomePage ? 'bg-home' : 'bg-other'}`}>
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      
      <CommandMenu />
      <Layout>
        <AppRoutes />
      </Layout>
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
