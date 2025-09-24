import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'
import { GridBackground } from '@/components/ui/grid-background'
import { DotBackground } from '@/components/ui/dot-background'

function App() {
  return (
    <div className="dark relative min-h-screen bg-background text-foreground">
      <GridBackground 
        size={80} 
        lineColor="rgba(139, 92, 246, 0.08)" 
        opacity={0.15}
        className="fixed inset-0 z-[-20]" 
      >
        <div />
      </GridBackground>
      <DotBackground 
        size={120} 
        dotColor="rgba(34, 197, 94, 0.05)" 
        opacity={0.2}
        className="fixed inset-0 z-[-19]" 
      >
        <div />
      </DotBackground>
      <Router>
        <CommandMenu />
        <AppRoutes />
        <Toaster />
      </Router>
    </div>
  )
}

export default App
