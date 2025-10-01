import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { CareerRecommendation } from '../lib/types';
import { toast } from 'sonner';
import { 
  Trophy, 
  BookOpen, 
  Star,
  ExternalLink,
  Play,
  Award,
  Target
} from 'lucide-react';

export const CareerDashboard = () => {
  const navigate = useNavigate();
  const { profile, enhancedProfile } = useUserStore();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);

  // Simple learning resources data
  const getLearningResources = (careerTitle: string) => {
    const resources = {
      // TECHNOLOGY CAREERS
      'Software Developer': [
        { platform: 'Coursera', title: 'Full-Stack Web Development', url: 'https://coursera.org/learn/web-development', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete JavaScript Course', url: 'https://udemy.com/course/javascript', level: 'Beginner' },
        { platform: 'Coursera', title: 'React Specialization', url: 'https://coursera.org/specializations/react', level: 'Intermediate' }
      ],
      'Data Scientist': [
        { platform: 'Coursera', title: 'Data Science Specialization', url: 'https://coursera.org/specializations/data-science', level: 'Beginner' },
        { platform: 'Udemy', title: 'Python for Data Science', url: 'https://udemy.com/course/python-data-science', level: 'Beginner' },
        { platform: 'Coursera', title: 'Machine Learning Course', url: 'https://coursera.org/learn/machine-learning', level: 'Intermediate' }
      ],
      'Cybersecurity Analyst': [
        { platform: 'Coursera', title: 'Cybersecurity Specialization', url: 'https://coursera.org/specializations/cyber-security', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Ethical Hacking', url: 'https://udemy.com/course/ethical-hacking', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Network Security', url: 'https://coursera.org/learn/network-security', level: 'Intermediate' }
      ],
      'Software Engineer': [
        { platform: 'Coursera', title: 'Software Engineering Fundamentals', url: 'https://coursera.org/specializations/software-engineering', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Software Architecture', url: 'https://udemy.com/course/software-architecture', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Agile Development', url: 'https://coursera.org/learn/agile', level: 'Beginner' }
      ],

      // EDUCATION CAREERS
      'High School Teacher': [
        { platform: 'Coursera', title: 'Teaching Skills for University', url: 'https://coursera.org/learn/teaching-skills', level: 'Beginner' },
        { platform: 'Udemy', title: 'Classroom Management Techniques', url: 'https://udemy.com/course/classroom-management', level: 'Beginner' },
        { platform: 'Coursera', title: 'Educational Technology', url: 'https://coursera.org/learn/educational-technology', level: 'Intermediate' }
      ],
      'University Professor': [
        { platform: 'Coursera', title: 'Research Methods in Education', url: 'https://coursera.org/learn/research-methods', level: 'Intermediate' },
        { platform: 'Udemy', title: 'Academic Writing & Publishing', url: 'https://udemy.com/course/academic-writing', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Higher Education Teaching', url: 'https://coursera.org/learn/university-teaching', level: 'Beginner' }
      ],
      'Special Education Teacher': [
        { platform: 'Coursera', title: 'Special Education Needs', url: 'https://coursera.org/learn/special-education', level: 'Beginner' },
        { platform: 'Udemy', title: 'IEP Development & Management', url: 'https://udemy.com/course/iep-development', level: 'Beginner' },
        { platform: 'Coursera', title: 'Inclusive Education Strategies', url: 'https://coursera.org/learn/inclusive-education', level: 'Intermediate' }
      ],
      'Education Technology Specialist': [
        { platform: 'Coursera', title: 'Educational Technology Fundamentals', url: 'https://coursera.org/learn/edtech', level: 'Beginner' },
        { platform: 'Udemy', title: 'Learning Management Systems', url: 'https://udemy.com/course/lms-development', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Digital Learning Design', url: 'https://coursera.org/learn/digital-learning', level: 'Intermediate' }
      ],
      'School Counselor': [
        { platform: 'Coursera', title: 'Counseling Psychology', url: 'https://coursera.org/learn/counseling-psychology', level: 'Beginner' },
        { platform: 'Udemy', title: 'Student Mental Health Support', url: 'https://udemy.com/course/student-mental-health', level: 'Beginner' },
        { platform: 'Coursera', title: 'Career Guidance & Planning', url: 'https://coursera.org/learn/career-guidance', level: 'Intermediate' }
      ],

      // HEALTHCARE CAREERS
      'Registered Nurse': [
        { platform: 'Coursera', title: 'Nursing Fundamentals', url: 'https://coursera.org/learn/nursing-fundamentals', level: 'Beginner' },
        { platform: 'Udemy', title: 'Medical Terminology Complete', url: 'https://udemy.com/course/medical-terminology', level: 'Beginner' },
        { platform: 'Coursera', title: 'Patient Care & Safety', url: 'https://coursera.org/learn/patient-safety', level: 'Intermediate' }
      ],
      'Medical Technologist': [
        { platform: 'Coursera', title: 'Laboratory Science Fundamentals', url: 'https://coursera.org/learn/lab-science', level: 'Beginner' },
        { platform: 'Udemy', title: 'Medical Laboratory Techniques', url: 'https://udemy.com/course/lab-techniques', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Clinical Diagnostics', url: 'https://coursera.org/learn/clinical-diagnostics', level: 'Intermediate' }
      ],
      'Physical Therapist': [
        { platform: 'Coursera', title: 'Human Anatomy & Physiology', url: 'https://coursera.org/learn/anatomy-physiology', level: 'Beginner' },
        { platform: 'Udemy', title: 'Physical Therapy Techniques', url: 'https://udemy.com/course/physical-therapy', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Rehabilitation Science', url: 'https://coursera.org/learn/rehabilitation', level: 'Intermediate' }
      ],

      // BUSINESS CAREERS
      'Marketing Manager': [
        { platform: 'Coursera', title: 'Digital Marketing Specialization', url: 'https://coursera.org/specializations/digital-marketing', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Marketing Strategy', url: 'https://udemy.com/course/marketing-strategy', level: 'Beginner' },
        { platform: 'Coursera', title: 'Social Media Marketing', url: 'https://coursera.org/learn/social-media-marketing', level: 'Intermediate' }
      ],
      'Human Resources Manager': [
        { platform: 'Coursera', title: 'Human Resources Management', url: 'https://coursera.org/learn/human-resources', level: 'Beginner' },
        { platform: 'Udemy', title: 'Recruitment & Selection', url: 'https://udemy.com/course/recruitment', level: 'Beginner' },
        { platform: 'Coursera', title: 'Employee Relations & Law', url: 'https://coursera.org/learn/employment-law', level: 'Intermediate' }
      ],
      'Project Coordinator': [
        { platform: 'Coursera', title: 'Project Management Fundamentals', url: 'https://coursera.org/learn/project-management', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Project Management', url: 'https://udemy.com/course/project-management-course', level: 'Beginner' },
        { platform: 'Coursera', title: 'Agile Project Management', url: 'https://coursera.org/learn/agile-project-management', level: 'Intermediate' }
      ],
      'Business Analyst': [
        { platform: 'Coursera', title: 'Business Analysis Fundamentals', url: 'https://coursera.org/learn/business-analysis', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Business Analysis', url: 'https://udemy.com/course/business-analysis', level: 'Beginner' },
        { platform: 'Coursera', title: 'Data Analysis for Business', url: 'https://coursera.org/learn/business-data-analysis', level: 'Intermediate' }
      ],

      // CREATIVE & DESIGN CAREERS
      'UX Designer': [
        { platform: 'Coursera', title: 'UX Design Specialization', url: 'https://coursera.org/specializations/ux-design', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete UX/UI Design', url: 'https://udemy.com/course/ux-ui-design', level: 'Beginner' },
        { platform: 'Coursera', title: 'User Research Methods', url: 'https://coursera.org/learn/user-research', level: 'Intermediate' }
      ],
      'Web Designer': [
        { platform: 'Coursera', title: 'Web Design for Everybody', url: 'https://coursera.org/specializations/web-design', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Web Design Course', url: 'https://udemy.com/course/web-design', level: 'Beginner' },
        { platform: 'Coursera', title: 'Advanced CSS & JavaScript', url: 'https://coursera.org/learn/advanced-css', level: 'Intermediate' }
      ],
      'Interior Designer': [
        { platform: 'Coursera', title: 'Interior Design Fundamentals', url: 'https://coursera.org/learn/interior-design', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Interior Design', url: 'https://udemy.com/course/interior-design-course', level: 'Beginner' },
        { platform: 'Coursera', title: 'Space Planning & Color Theory', url: 'https://coursera.org/learn/space-planning', level: 'Intermediate' }
      ],
      'Graphic Designer': [
        { platform: 'Coursera', title: 'Graphic Design Specialization', url: 'https://coursera.org/specializations/graphic-design', level: 'Beginner' },
        { platform: 'Udemy', title: 'Complete Adobe Creative Suite', url: 'https://udemy.com/course/adobe-creative-suite', level: 'Beginner' },
        { platform: 'Coursera', title: 'Brand Identity Design', url: 'https://coursera.org/learn/brand-design', level: 'Intermediate' }
      ],

      // ENGINEERING CAREERS
      'Biomedical Engineer': [
        { platform: 'Coursera', title: 'Biomedical Engineering Fundamentals', url: 'https://coursera.org/learn/biomedical-engineering', level: 'Beginner' },
        { platform: 'Udemy', title: 'Medical Device Design', url: 'https://udemy.com/course/medical-device-design', level: 'Intermediate' },
        { platform: 'Coursera', title: 'FDA Regulations & Compliance', url: 'https://coursera.org/learn/fda-regulations', level: 'Intermediate' }
      ],
      'Environmental Engineer': [
        { platform: 'Coursera', title: 'Environmental Engineering', url: 'https://coursera.org/learn/environmental-engineering', level: 'Beginner' },
        { platform: 'Udemy', title: 'Water Treatment Systems', url: 'https://udemy.com/course/water-treatment', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Sustainability & Green Technology', url: 'https://coursera.org/learn/sustainability', level: 'Intermediate' }
      ],
      'Mechanical Engineer': [
        { platform: 'Coursera', title: 'Mechanical Engineering Fundamentals', url: 'https://coursera.org/learn/mechanical-engineering', level: 'Beginner' },
        { platform: 'Udemy', title: 'CAD Design & Manufacturing', url: 'https://udemy.com/course/cad-design', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Thermodynamics & Fluid Mechanics', url: 'https://coursera.org/learn/thermodynamics', level: 'Intermediate' }
      ],
      'Electrical Engineer': [
        { platform: 'Coursera', title: 'Electrical Engineering Fundamentals', url: 'https://coursera.org/learn/electrical-engineering', level: 'Beginner' },
        { platform: 'Udemy', title: 'Circuit Analysis & Design', url: 'https://udemy.com/course/circuit-analysis', level: 'Intermediate' },
        { platform: 'Coursera', title: 'Power Systems Engineering', url: 'https://coursera.org/learn/power-systems', level: 'Intermediate' }
      ]
    };
    
    return resources[careerTitle as keyof typeof resources] || [
      { platform: 'Coursera', title: 'Professional Skills Development', url: 'https://coursera.org/browse', level: 'Beginner' },
      { platform: 'Udemy', title: 'Career Development Course', url: 'https://udemy.com/courses/', level: 'Beginner' }
    ];
  };

  useEffect(() => {
    if (!enhancedProfile) {
      navigate('/assessment');
      return;
    }
    loadRecommendations();
  }, [enhancedProfile, navigate]);

  const loadRecommendations = async () => {
    if (!enhancedProfile) return;
    
    setIsLoading(true);
    try {
      const careerRecs = await CareerService.generateRecommendations(enhancedProfile);
      setRecommendations(careerRecs);
      if (careerRecs.length > 0) {
        setSelectedCareer(careerRecs[0]); // Auto-select first career
      }
    } catch (error) {
      console.error('Failed to load career recommendations:', error);
      toast.error('Failed to load recommendations');
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCareer = (career: CareerRecommendation) => {
    setSelectedCareer(career);
    toast.success(`Selected ${career.title}! Check out the learning roadmap below.`);
  };

  if (!enhancedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center dashboard-bg">
        <NBCard className="p-8 text-center max-w-md bg-white/95 shadow-xl">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-blue-500" />
          <h3 className="text-lg font-semibold mb-2 text-black">Complete Your Assessment</h3>
          <p className="text-gray-700 mb-4">Take the career assessment to get personalized recommendations.</p>
          <NBButton onClick={() => navigate('/assessment')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Assessment
          </NBButton>
        </NBCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-bg pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            🎯 Your Career Journey
          </h1>
          <p className="text-lg text-black">
            Hi {enhancedProfile.name}! Here are your personalized career recommendations
          </p>
        </div>

        {/* Simple Gamification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <NBCard className="p-4 text-center bg-white/95 shadow-lg border">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-xl font-bold text-yellow-600">Level {enhancedProfile.level || 1}</div>
            <p className="text-sm text-black">Your Level</p>
          </NBCard>
          
          <NBCard className="p-4 text-center bg-white/95 shadow-lg border">
            <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-xl font-bold text-blue-600">{enhancedProfile.experiencePoints || 0}</div>
            <p className="text-sm text-black">Experience Points</p>
          </NBCard>
          
          <NBCard className="p-4 text-center bg-white/95 shadow-lg border">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-xl font-bold text-green-600">{recommendations.length}</div>
            <p className="text-sm text-black">Career Matches</p>
          </NBCard>
        </div>

        {/* Career Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Career Options */}
          <div>
            <NBCard className="p-6 bg-white/95 shadow-lg border">
              <h2 className="text-2xl font-bold text-black mb-4">🚀 Your Top Career Matches</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-black mt-4">Finding your perfect careers...</p>
                </div>
              ) : recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.slice(0, 5).map((career) => (
                    <div
                      key={career.id}
                      onClick={() => handleSelectCareer(career)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCareer?.id === career.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-black text-lg">{career.title}</h3>
                          <p className="text-gray-700 text-sm mt-1 line-clamp-2">{career.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-green-600 font-medium">
                              💰 ${career.salaryRange?.min.toLocaleString()} - ${career.salaryRange?.max.toLocaleString()}
                            </span>
                            <span className="text-sm text-blue-600 font-medium">
                              📈 {career.fitScore}% Match
                            </span>
                          </div>
                        </div>
                        {selectedCareer?.id === career.id && (
                          <Award className="h-6 w-6 text-blue-500 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No recommendations found. Please retake the assessment.</p>
                  <NBButton 
                    onClick={() => navigate('/assessment')} 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retake Assessment
                  </NBButton>
                </div>
              )}
            </NBCard>
          </div>

          {/* Right: Learning Roadmap */}
          <div>
            <NBCard className="p-6 bg-white/95 shadow-lg border">
              <h2 className="text-2xl font-bold text-black mb-4">📚 Learning Roadmap</h2>
              
              {selectedCareer ? (
                <div>
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
                    <h3 className="font-semibold text-blue-900">Selected Career:</h3>
                    <p className="text-blue-800">{selectedCareer.title}</p>
                  </div>
                  
                  <h4 className="font-semibold text-black mb-3">🎓 Recommended Courses:</h4>
                  <div className="space-y-3">
                    {getLearningResources(selectedCareer.title).map((resource, index) => (
                      <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                resource.platform === 'Coursera' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {resource.platform}
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {resource.level}
                              </span>
                            </div>
                            <h5 className="font-medium text-black mt-1">{resource.title}</h5>
                          </div>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Open course"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Learning Progress</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Complete courses to earn XP and level up!</p>
                  </div>
                  
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Select a career to see your personalized learning roadmap</p>
                </div>
              )}
            </NBCard>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8 space-x-4">
          <NBButton 
            onClick={() => navigate('/assessment')} 
            variant="secondary"
            className="bg-gray-100 hover:bg-gray-200 text-black border"
          >
            Retake Assessment
          </NBButton>
          {selectedCareer && (
            <NBButton 
              onClick={() => toast.success('Career path locked in! Keep learning to advance.')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              🎯 Lock In This Career
            </NBButton>
          )}
        </div>
      </div>
    </div>
  );
};