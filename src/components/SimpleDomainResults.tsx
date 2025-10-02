import React, { useState } from 'react';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { FlowChart } from './FlowChart';
import { DomainCareerService } from '../lib/services/domainCareerService';
import { 
  Download, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Award,
  Target,
  Clock,
  CheckCircle,
  ExternalLink,
  GitBranch
} from 'lucide-react';

// CSS override for black text
const blackTextForceStyle = `
  .force-black-text, 
  .force-black-text *, 
  .force-black-text p, 
  .force-black-text div, 
  .force-black-text span, 
  .force-black-text h1, 
  .force-black-text h2, 
  .force-black-text h3 {
    color: #000000 !important;
    text-shadow: none !important;
  }
`;

// Simple UI career interface
interface UICareer {
  id: string;
  title: string;
  description: string;
  icon: string;
  matchScore: number;
  salary: string;
  growth: string;
  workStyle: string;
  timeToEntry: string;
  keySkills: string[];
}

interface SimpleDomainResultsProps {
  domain: string;
  name: string;
  onRestart: () => void;
}

const getCareerIcon = (title: string): string => {
  const iconMap: Record<string, string> = {
    'Graphic Designer': '', 'UX/UI Designer': '', 'Content Creator': '',
    'Digital Marketer': '', 'Brand Designer': '', 'Video Editor': '🎬',
    'Software Developer': '💻', 'Data Scientist': '📊', 'Cybersecurity Analyst': '🔒',
    'DevOps Engineer': '⚙️', 'Mobile App Developer': '📱', 'AI/ML Engineer': '🤖',
    'Business Analyst': '📈', 'Project Manager': '📋', 'Management Consultant': '💼',
    'Financial Analyst': '💰', 'Marketing Manager': '📊', 'Operations Manager': '⚙️',
    'Registered Nurse': '👩‍⚕️', 'Physical Therapist': '🏃‍♂️', 'Healthcare Administrator': '🏥',
    'Medical Researcher': '🔬', 'Mental Health Counselor': '🧠', 'Pharmacy Technician': '💊',
    'Elementary Teacher': '📚', 'High School Teacher': '🎓', 'Curriculum Developer': '📖',
    'Educational Coordinator': '📋', 'Training Specialist': '🎯', 'School Counselor': '👥',
    'Mechanical Engineer': '⚙️', 'Civil Engineer': '🏗️', 'Electrical Engineer': '⚡',
    'Environmental Engineer': '🌱', 'Chemical Engineer': '⚗️', 'Biomedical Engineer': '🔬'
  };
  return iconMap[title] || '💼';
};

const getGrowthText = (title: string): string => {
  const growthMap: Record<string, string> = {
    'Software Developer': 'High growth (25%)', 'Data Scientist': 'Very high growth (35%)',
    'Cybersecurity Analyst': 'Very high growth (32%)', 'UX/UI Designer': 'High growth (22%)',
    'Project Manager': 'Steady growth (7%)', 'Business Analyst': 'Good growth (11%)',
    'Registered Nurse': 'High growth (15%)', 'Physical Therapist': 'Very high growth (28%)',
    'Elementary Teacher': 'Steady growth (4%)', 'High School Teacher': 'Stable (3%)',
    'Mechanical Engineer': 'Steady growth (6%)', 'Civil Engineer': 'Good growth (8%)'
  };
  return growthMap[title] || 'Good growth (8%)';
};

const getWorkStyle = (title: string): string => {
  const workStyleMap: Record<string, string> = {
    'Software Developer': 'Remote-friendly', 'Data Scientist': 'Hybrid',
    'Graphic Designer': 'Remote/Freelance', 'UX/UI Designer': 'Remote/Office',
    'Content Creator': 'Fully remote', 'Digital Marketer': 'Remote-friendly',
    'Project Manager': 'Hybrid', 'Business Analyst': 'Office/Hybrid',
    'Registered Nurse': 'In-person', 'Physical Therapist': 'In-person',
    'Elementary Teacher': 'In-person', 'High School Teacher': 'In-person',
    'Mechanical Engineer': 'Office/Field', 'Civil Engineer': 'Office/Field'
  };
  return workStyleMap[title] || 'Hybrid';
};

const getTimeToEntry = (title: string): string => {
  const timeMap: Record<string, string> = {
    'Software Developer': '6-12 months', 'Data Scientist': '12-18 months',
    'Graphic Designer': '3-6 months', 'UX/UI Designer': '6-12 months',
    'Content Creator': '1-3 months', 'Digital Marketer': '3-6 months',
    'Project Manager': '1-2 years', 'Business Analyst': '6-12 months',
    'Registered Nurse': '2-4 years', 'Physical Therapist': '6-7 years',
    'Elementary Teacher': '4-5 years', 'High School Teacher': '4-5 years',
    'Mechanical Engineer': '4-5 years', 'Civil Engineer': '4-5 years'
  };
  return timeMap[title] || '1-2 years';
};

// Helper function to generate flowchart data for career path
const generateCareerFlowchartData = (domain: string, careers: UICareer[]) => {
  const nodes = [];
  const edges = [];
  
  // Education nodes (starting point)
  nodes.push({
    id: 'education',
    type: 'course' as const,
    position: { x: 100, y: 50 },
    title: 'Education & Learning',
    description: `Start with ${domain.toLowerCase()} fundamentals`,
    duration: '6-12 months',
    difficulty: 'beginner' as const
  });

  // Skills development
  nodes.push({
    id: 'skills',
    type: 'skill' as const,
    position: { x: 400, y: 50 },
    title: 'Core Skills',
    description: 'Build essential technical and soft skills'
  });

  // Entry-level roles
  nodes.push({
    id: 'entry-role',
    type: 'internship' as const,
    position: { x: 100, y: 200 },
    title: 'Entry-Level Position',
    description: 'Start your career journey',
    duration: '1-2 years'
  });

  // Career progression
  careers.slice(0, 3).forEach((career, index) => {
    nodes.push({
      id: `career-${index}`,
      type: 'job' as const,
      position: { x: 100 + (index * 250), y: 350 },
      title: career.title,
      description: career.description.slice(0, 80) + '...',
      salary: career.salary
    });
  });

  // Add edges
  edges.push(
    { id: 'e1', source: 'education', target: 'skills', animated: true },
    { id: 'e2', source: 'education', target: 'entry-role', animated: true },
    { id: 'e3', source: 'skills', target: 'entry-role', animated: true }
  );

  careers.slice(0, 3).forEach((_, index) => {
    edges.push({
      id: `e-career-${index}`,
      source: 'entry-role',
      target: `career-${index}`,
      animated: true
    });
  });

  return { nodes, edges };
};

// Helper function to make resources clickable
const makeResourceClickable = (resource: string) => {
  // Common learning platforms and their URLs
  const platformUrls: Record<string, string> = {
    'Coursera': 'https://www.coursera.org',
    'Udemy': 'https://www.udemy.com',
    'edX': 'https://www.edx.org',
    'Khan Academy': 'https://www.khanacademy.org',
    'Codecademy': 'https://www.codecademy.com',
    'LinkedIn Learning': 'https://www.linkedin.com/learning',
    'Pluralsight': 'https://www.pluralsight.com',
    'FreeCodeCamp': 'https://www.freecodecamp.org',
    'YouTube': 'https://www.youtube.com',
    'MDN Web Docs': 'https://developer.mozilla.org',
    'GitHub': 'https://github.com',
    'Stack Overflow': 'https://stackoverflow.com',
    'Medium': 'https://medium.com'
  };

  // Try to extract platform name from resource text
  const platform = Object.keys(platformUrls).find(p => 
    resource.toLowerCase().includes(p.toLowerCase())
  );

  if (platform) {
    return {
      text: resource,
      url: platformUrls[platform],
      isClickable: true
    };
  }

  // Generate search URLs for resources that don't match known platforms
  const searchQuery = encodeURIComponent(resource);
  return {
    text: resource,
    url: `https://www.google.com/search?q=${searchQuery}`,
    isClickable: true
  };
};

export const SimpleDomainResults: React.FC<SimpleDomainResultsProps> = ({ 
  domain, 
  name, 
  onRestart 
}) => {
  const rawCareers = DomainCareerService.getCareersByDomain(domain);
  const checklist = DomainCareerService.getDomainChecklist(domain);
  
  // Convert to UI format
  const careers: UICareer[] = rawCareers.map(career => ({
    id: career.id,
    title: career.title,
    description: career.description,
    icon: getCareerIcon(career.title),
    matchScore: career.fitScore,
    salary: `$${career.salaryRange.min.toLocaleString()}-$${career.salaryRange.max.toLocaleString()}/year`,
    growth: getGrowthText(career.title),
    workStyle: getWorkStyle(career.title),
    timeToEntry: getTimeToEntry(career.title),
    keySkills: career.requiredSkills.map(skill => skill.name)
  }));
  
  // Generate flowchart data
  const { nodes: flowNodes, edges: flowEdges } = generateCareerFlowchartData(checklist.domainName, careers);
  
  const [selectedCareer, setSelectedCareer] = useState(careers[0]?.title || '');
  const [showFlowchart, setShowFlowchart] = useState(false);

  const downloadChecklist = () => {
    const checklistText = `${name}'s Career Checklist - ${checklist.domainName}

IMMEDIATE ACTIONS (Next 30 Days):
${checklist.immediateActions.map(action => `☐ ${action}`).join('\n')}

3-MONTH GOALS:
${checklist.shortTermGoals.map(goal => `☐ ${goal}`).join('\n')}

6-12 MONTH GOALS:
${checklist.longTermGoals.map(goal => `☐ ${goal}`).join('\n')}

KEY SKILLS TO DEVELOP:
${checklist.keySkills.map(skill => `☐ ${skill}`).join('\n')}

RECOMMENDED RESOURCES:
${checklist.resources.map(resource => `• ${resource}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
Career Assessment Tool`;

    const blob = new Blob([checklistText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}_career_checklist_${domain}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blackTextForceStyle }} />
      <div className="min-h-screen p-4" style={{
        backgroundImage: "url('/bg2.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎉 Perfect! Here are your {checklist.domainName} careers, {name}!
            </h1>
            <p className="text-xl text-white mb-6">
              We've found the best career paths in your chosen field
            </p>
            <div className="flex justify-center gap-4">
              <NBButton onClick={downloadChecklist} className="px-6 py-3">
                <Download className="mr-2 w-5 h-5" />
                Download Action Plan
              </NBButton>
              <NBButton 
                onClick={() => setShowFlowchart(!showFlowchart)} 
                variant={showFlowchart ? "primary" : "ghost"}
                className="px-6 py-3"
              >
                <GitBranch className="mr-2 w-5 h-5" />
                {showFlowchart ? 'Hide' : 'Show'} Career Path
              </NBButton>
              <NBButton onClick={onRestart} variant="ghost" className="px-6 py-3">
                Start Over
              </NBButton>
            </div>
          </div>

        {/* Career Path Flowchart */}
        {showFlowchart && (
          <div className="mb-8">
            <div className="p-6 rounded-2xl border-2 bg-white/95 backdrop-blur-sm force-black-text">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold force-black-text mb-2">
                  🗺️ Your {checklist.domainName} Career Journey
                </h2>
                <p className="force-black-text">
                  Visualize your path from learning to career success
                </p>
              </div>
              <FlowChart 
                nodes={flowNodes} 
                edges={flowEdges} 
                height="500px"
                className="border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {careers.map((career, index) => (
            <div 
              key={career.title} 
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg rounded-2xl border-2 bg-white force-black-text ${
                selectedCareer === career.title ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedCareer(career.title)}
            >
              <div className="flex items-start gap-4 force-black-text">
                <div className="text-4xl">{career.icon}</div>
                <div className="flex-1 force-black-text">
                  <div className="flex items-center gap-2 mb-2 force-black-text">
                    <h3 className="text-xl font-bold force-black-text">{career.title}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{career.matchScore}% Match</span>
                    </div>
                  </div>
                  
                  <p className="mb-4 force-black-text">{career.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm force-black-text">
                      <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                      <span className="force-black-text">{career.salary}</span>
                    </div>
                    <div className="flex items-center text-sm force-black-text">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="force-black-text">{career.growth}</span>
                    </div>
                    <div className="flex items-center text-sm force-black-text">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="force-black-text">{career.workStyle}</span>
                    </div>
                    <div className="flex items-center text-sm force-black-text">
                      <Clock className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="force-black-text">{career.timeToEntry}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {career.keySkills.slice(0, 3).map((skill) => (
                      <span 
                        key={skill}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {career.keySkills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{career.keySkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Plan Section */}
        <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
          <div className="text-center mb-6 force-black-text">
            <Target className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-2 force-black-text">
              Your {checklist.domainName} Action Plan
            </h2>
            <p className="force-black-text">
              Follow this roadmap to launch your career in {checklist.domainName.toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Immediate Actions */}
            <div className="space-y-3">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 mr-2 text-green-500" />
                <h3 className="font-semibold force-black-text">Next 30 Days</h3>
              </div>
              {checklist.immediateActions.map((action, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-500" />
                  <span className="text-sm force-black-text">{action}</span>
                </div>
              ))}
            </div>

            {/* Short Term Goals */}
            <div className="space-y-3">
              <div className="flex items-center mb-3">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                <h3 className="font-semibold force-black-text">3-Month Goals</h3>
              </div>
              {checklist.shortTermGoals.map((goal, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-500" />
                  <span className="text-sm force-black-text">{goal}</span>
                </div>
              ))}
            </div>

            {/* Long Term Goals */}
            <div className="space-y-3">
              <div className="flex items-center mb-3">
                <Award className="w-5 h-5 mr-2 text-purple-500" />
                <h3 className="font-semibold force-black-text">6-12 Months</h3>
              </div>
              {checklist.longTermGoals.map((goal, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-purple-500" />
                  <span className="text-sm force-black-text">{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Skills Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 mr-2 text-orange-500" />
              <h3 className="font-semibold force-black-text">Essential Skills to Master</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {checklist.keySkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm force-black-text">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-4 force-black-text">📚 Recommended Learning Resources</h3>
            <div className="space-y-2">
              {checklist.resources.map((resource, index) => {
                const clickableResource = makeResourceClickable(resource);
                return (
                  <div key={index} className="flex items-start gap-2 text-sm force-black-text">
                    <span className="text-blue-500 font-bold">•</span>
                    {clickableResource.isClickable ? (
                      <a 
                        href={clickableResource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="force-black-text hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors"
                      >
                        <span className="force-black-text">{clickableResource.text}</span>
                        <ExternalLink className="w-3 h-3 text-blue-500" />
                      </a>
                    ) : (
                      <span className="force-black-text">{clickableResource.text}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white">
          <p>🚀 Ready to start your {checklist.domainName.toLowerCase()} journey? Download your action plan and get started today!</p>
        </div>
      </div>
    </div>
    </>
  );
};