import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { Layout } from '@/components/Layout'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'

// Import API test utility for debugging
import '@/lib/utils/apiTest'

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Light educational background patterns */}
      <div className="fixed inset-0 z-[-20]">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #ec4899 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #a855f7 1px, transparent 1px),
              radial-gradient(circle at 75% 25%, #3b82f6 1px, transparent 1px),
              radial-gradient(circle at 25% 75%, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px, 100px 100px, 80px 80px, 140px 140px',
            backgroundPosition: '0 0, 40px 40px, 80px 0, 0 80px'
          }}
        ></div>
      </div>
      
      <Router>
        <CommandMenu />
        <Layout>
          <AppRoutes />
        </Layout>
        <Toaster />
      </Router>
    </div>
  )
}

export default App
