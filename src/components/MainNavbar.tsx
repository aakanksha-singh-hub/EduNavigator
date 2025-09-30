import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  FileText, 
  User,
  Home,
  Route,
  BookOpen
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUserStore } from '../lib/stores/userStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
  requiresProfile?: boolean;
  requiresCareerPath?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
    description: 'Get started with your career journey'
  },
  {
    id: 'career-discovery',
    label: 'Career Discovery',
    icon: ClipboardList,
    path: '/assessment', // Will be dynamically determined
    description: 'Discover and progress through your career journey'
  },
  {
    id: 'generate-career-path',
    label: 'Generate Career Path',
    icon: Route,
    path: '/career-path-generator',
    description: 'Generate personalized career paths based on your profile'
  },
  {
    id: 'learning-assistant',
    label: 'Learning Assistant',
    icon: BookOpen,
    path: '/learning-assistant',
    description: 'AI-powered notes, summaries, flashcards, and quizzes'
  },
  {
    id: 'resume',
    label: 'Resume Optimizer',
    icon: FileText,
    path: '/resume-upload',
    description: 'AI-powered resume analysis'
  }
];

export const MainNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enhancedProfile } = useUserStore();

  const getCareerDiscoveryPath = () => {
    if (!enhancedProfile) {
      return '/assessment'; // Start with assessment for new users
    }
    
    // Always go to dashboard for returning users (those with a profile)
    return '/dashboard';
  };

  const getActiveTab = () => {
    const currentPath = location.pathname;
    
    // Handle career discovery related routes
    if (currentPath.startsWith('/assessment') || 
        currentPath.startsWith('/dashboard') || 
        currentPath.startsWith('/career-details') || 
        currentPath.startsWith('/learning-roadmap') || 
        currentPath.startsWith('/achievements')) {
      return 'career-discovery';
    }
    
    // Handle career path generator routes
    if (currentPath.startsWith('/career-path-generator')) {
      return 'generate-career-path';
    }
    
    // Handle learning assistant routes
    if (currentPath.startsWith('/learning-assistant')) {
      return 'learning-assistant';
    }
    
    // Handle resume routes
    if (currentPath.startsWith('/resume-upload') || currentPath.startsWith('/resume-analysis')) {
      return 'resume';
    }
    
    // Home route
    if (currentPath === '/') return 'home';
    
    return '';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (item: NavItem) => {
    if (item.id === 'career-discovery') {
      navigate(getCareerDiscoveryPath());
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        {/* White navbar container */}
        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white rounded-2xl"></div>
          
          <div className="relative px-6 py-3">
            <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EN</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduNavigator</h1>
              <p className="text-xs text-gray-500">Intelligent Career Platform</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                  title={item.description}
                >
                  <Icon className={cn(
                    'w-4 h-4',
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  )} />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            {enhancedProfile && (
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{enhancedProfile.name}</p>
                  <p className="text-gray-500">Level {enhancedProfile.level}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pt-4 mt-4 border-t border-white/20">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 flex-shrink-0',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      </div>
      </div>
    </nav>
  );
};