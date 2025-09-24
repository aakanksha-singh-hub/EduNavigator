import { Link } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { BGPattern } from '../components/ui/bg-pattern';
import { FlowChart } from '../components/FlowChart';
import { ArrowRight, Target, Map, Zap } from 'lucide-react';

// Demo data for the flowchart
const demoNodes = [
  {
    id: '1',
    type: 'course' as const,
    position: { x: 100, y: 50 },
    title: 'Modern JavaScript & TypeScript',
    description: 'Master modern web development fundamentals',
    duration: '2 months',
    difficulty: 'intermediate' as const
  },
  {
    id: '2',
    type: 'course' as const,
    position: { x: 400, y: 50 },
    title: 'Advanced React Development',
    description: 'Build complex React applications with hooks, context, and best practices',
    duration: '3 months',
    difficulty: 'intermediate' as const
  },
  {
    id: '3',
    type: 'internship' as const,
    position: { x: 250, y: 250 },
    title: 'Frontend Developer Internship',
    description: 'Gain real-world experience building web applications',
    duration: '6 months'
  },
  {
    id: '4',
    type: 'job' as const,
    position: { x: 100, y: 450 },
    title: 'Frontend Web Developer',
    description: 'Build responsive websites and web applications',
    salary: '₹8-15 LPA'
  },
  {
    id: '5',
    type: 'job' as const,
    position: { x: 400, y: 450 },
    title: 'React Developer',
    description: 'Specialize in React ecosystem development',
    salary: '₹12-20 LPA'
  },
  {
    id: '6',
    type: 'company' as const,
    position: { x: 250, y: 650 },
    title: 'Tech Startups & MNCs',
    description: 'Join innovative companies building the future of web'
  },
  {
    id: '7',
    type: 'skill' as const,
    position: { x: 650, y: 150 },
    title: 'Redux & State Management',
    description: 'Advanced state management patterns'
  },
  {
    id: '8',
    type: 'skill' as const,
    position: { x: 650, y: 350 },
    title: 'Performance Optimization',
    description: 'Web performance and optimization techniques'
  }
];

const demoEdges = [
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' as const, animated: true },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' as const, animated: true },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' as const, animated: true },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep' as const, animated: true },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep' as const, animated: true },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' as const, animated: true },
  { id: 'e2-7', source: '2', target: '7', type: 'smoothstep' as const, animated: true },
  { id: 'e5-8', source: '5', target: '8', type: 'smoothstep' as const, animated: true }
];

export const Landing = () => {
  return (
    <div className="min-h-screen light-rays-bg">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                CareerFlow
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-foreground font-medium hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/details" className="text-foreground font-medium hover:text-accent transition-colors">
                Start
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <BGPattern variant="grid" mask="fade-edges" size={40} fill="rgba(139, 92, 246, 0.08)" />
        <BGPattern variant="dots" mask="fade-center" size={60} fill="rgba(34, 197, 94, 0.05)" />
        <div className="max-w-7xl mx-auto text-center relative">

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Map your future,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              one skill at a time.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized career advice powered by AI. Upload your resume for automatic 
            skill extraction, visualize your career path, discover new opportunities, and 
            bridge skill gaps with our interactive flowchart.
          </p>
          <div className="flex justify-center">
            <Link to="/details">
              <NBButton size="lg" className="text-lg px-8 py-4 group hover:scale-105 transition-all duration-300 bg-primary hover:bg-primary/90">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </NBButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <BGPattern variant="grid" mask="fade-center" size={32} fill="rgba(139, 92, 246, 0.05)" />
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">
            Why Choose CareerFlow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Personalized Advice
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get tailored career recommendations based on your skills, interests, 
                and goals. Upload your resume for automatic skill extraction and more 
                personalized AI-powered career advice.
              </p>
            </NBCard>

            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Map className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Visual Career Flowchart
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                See your career journey as an interactive flowchart. Explore courses, 
                internships, jobs, and companies in a visual, easy-to-understand format.
              </p>
            </NBCard>

            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Skill-Gap Mapping
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Identify exactly what skills you need to develop for your dream job. 
                Get specific recommendations for courses, certifications, and experiences.
              </p>
            </NBCard>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30 backdrop-blur-sm relative border-t border-border/20">
        <BGPattern variant="dots" mask="fade-y" size={24} fill="rgba(34, 197, 94, 0.06)" />
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-accent-foreground">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Enter Your Details
              </h3>
              <p className="text-muted-foreground">
                Tell us about your skills, education, interests, and career goals. 
                Upload your resume for automatic skill extraction and experience analysis. 
                The more details you provide, the better our recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-primary-foreground">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                See Your Career Path
              </h3>
              <p className="text-muted-foreground">
                Get a personalized flowchart showing your recommended career journey, 
                including courses, internships, and job opportunities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Explore Opportunities
              </h3>
              <p className="text-muted-foreground">
                Discover alternative career paths, skill requirements, and real-world 
                opportunities that match your profile and interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Flowchart Section */}
      <section className="py-0 relative bg-gradient-to-br from-background/95 to-muted/20 border-t border-border/20">
        <BGPattern variant="grid" mask="fade-center" size={32} fill="rgba(139, 92, 246, 0.03)" />
        <div className="w-full relative">
          <div className="text-center py-20 px-4">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Interactive Career Visualization
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              See how your career path unfolds with our interactive flowchart. This demo shows 
              a Frontend Web Developer journey with courses, internships, jobs, and skill development.
            </p>
          </div>
          
          {/* Full-width Flowchart */}
          <div className="w-full bg-gradient-to-br from-card/20 to-muted/10 border-y border-border/30">
            <FlowChart 
              nodes={demoNodes}
              edges={demoEdges}
              className="w-full rounded-none border-0"
              height="800px"
            />
          </div>
          
          {/* Legend */}
          <div className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <NBCard className="border-border/50 bg-card/50 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-foreground mb-6">
                  Career Path Elements
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="flex items-center space-x-3 group">
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-medium text-foreground">Courses</span>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-medium text-foreground">Internships</span>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-medium text-foreground">Jobs</span>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <div className="w-5 h-5 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-medium text-foreground">Companies</span>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <div className="w-5 h-5 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-sm group-hover:scale-110 transition-transform"></div>
                    <span className="text-sm font-medium text-foreground">Skills</span>
                  </div>
                </div>
              </NBCard>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-card/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="text-foreground font-bold">© 2025 CareerFlow (demo)</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
