import { UserProfile, CareerRecommendation, AlternativeCareer, CareerAssessmentData } from '../types';
import { GeminiService } from './geminiService';
import { CareerRecommendationService } from './careerRecommendationService';

// Mock data for different career paths
const mockCareerPaths = {
  'software-developer': {
    nodes: [
      // Main career path - horizontal line
      { id: '1', type: 'course' as const, title: 'AI Ethics Fundamentals', description: 'Learn ethical principles in AI development', duration: '3 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Machine Learning Ethics', description: 'Advanced ethical considerations in ML systems', duration: '4 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'internship' as const, title: 'AI Policy Internship', description: '6-month internship at an AI ethics organization', duration: '6 months', position: { x: 800, y: 100 } },
      { id: '4', type: 'job' as const, title: 'Junior AI Ethics Analyst', description: 'Entry-level AI ethics and policy position', salary: '$70k-90k', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Senior AI Ethics Specialist', description: 'Lead AI governance and ethical AI initiatives', salary: '$100k-140k', position: { x: 1500, y: 100 } },
      
      // Skills below main path
      { id: '7', type: 'skill' as const, title: 'Philosophy & Ethics', description: 'Understanding ethical frameworks and moral reasoning', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Policy Development', description: 'Creating governance frameworks and policies', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'AI Auditing', description: 'Evaluating AI systems for bias and fairness', position: { x: 800, y: 350 } },
      
      // Companies at the end
      { id: '6', type: 'company' as const, title: 'Partnership on AI', description: 'Work at leading AI ethics organizations', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e4-6', source: '4', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'data-scientist': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Python Basics', description: 'Learn Python programming fundamentals', duration: '2 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Data Analysis', description: 'Pandas, NumPy, and data manipulation', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Machine Learning', description: 'Scikit-learn and ML algorithms', duration: '4 months', difficulty: 'advanced' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Data Science Intern', description: 'Work on real-world data projects', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Data Scientist', description: 'Build ML models and analyze data', salary: '$80k-110k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'SQL', description: 'Database querying and management', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'TensorFlow', description: 'Deep learning framework', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Statistics', description: 'Statistical analysis and hypothesis testing', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Netflix', description: 'Recommendation systems and analytics', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-8', source: '3', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-9', source: '2', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'product-manager': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Quantum Physics Fundamentals', description: 'Learn quantum mechanics principles', duration: '4 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Quantum Programming', description: 'Programming quantum computers with Qiskit', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Quantum Algorithms', description: 'Advanced quantum algorithm design', duration: '4 months', difficulty: 'advanced' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Quantum Research Intern', description: 'Research internship at quantum computing lab', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Quantum Computing Engineer', description: 'Develop quantum algorithms and applications', salary: '$90k-160k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'Linear Algebra', description: 'Mathematical foundations for quantum computing', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Python Programming', description: 'Programming language for quantum development', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Quantum Error Correction', description: 'Advanced quantum computing techniques', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'IBM Quantum', description: 'Quantum computing research at IBM', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-7', source: '2', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-8', source: '3', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-9', source: '5', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  }
};

const mockAlternatives = {
  'software-developer': [
    { id: 'alt1', title: 'DevOps Engineer', description: 'Focus on deployment and infrastructure', matchScore: 85, salary: '$70k-100k', requirements: ['Docker', 'Kubernetes', 'AWS'], growth: 'high' as const },
    { id: 'alt2', title: 'UI/UX Designer', description: 'Design user interfaces and experiences', matchScore: 75, salary: '$60k-90k', requirements: ['Figma', 'User Research', 'Prototyping'], growth: 'medium' as const },
    { id: 'alt3', title: 'Technical Writer', description: 'Create technical documentation', matchScore: 70, salary: '$50k-80k', requirements: ['Writing', 'Technical Knowledge', 'Tools'], growth: 'medium' as const }
  ],
  'data-scientist': [
    { id: 'alt1', title: 'Business Analyst', description: 'Analyze business data and processes', matchScore: 80, salary: '$60k-90k', requirements: ['Excel', 'SQL', 'Business Acumen'], growth: 'medium' as const },
    { id: 'alt2', title: 'Research Scientist', description: 'Conduct research in academia or industry', matchScore: 90, salary: '$70k-120k', requirements: ['PhD', 'Research Skills', 'Publications'], growth: 'high' as const },
    { id: 'alt3', title: 'Data Engineer', description: 'Build and maintain data pipelines', matchScore: 85, salary: '$80k-110k', requirements: ['Python', 'SQL', 'Cloud Platforms'], growth: 'high' as const }
  ],
  'product-manager': [
    { id: 'alt1', title: 'Project Manager', description: 'Manage projects and timelines', matchScore: 85, salary: '$70k-100k', requirements: ['PMP', 'Agile', 'Leadership'], growth: 'medium' as const },
    { id: 'alt2', title: 'Business Analyst', description: 'Analyze business requirements', matchScore: 80, salary: '$60k-90k', requirements: ['Analysis', 'Communication', 'Tools'], growth: 'medium' as const },
    { id: 'alt3', title: 'Marketing Manager', description: 'Lead marketing strategies and campaigns', matchScore: 75, salary: '$65k-95k', requirements: ['Marketing', 'Analytics', 'Creativity'], growth: 'high' as const }
  ]
};

export class CareerService {
  static async generatePath(profile: UserProfile, assessmentData?: CareerAssessmentData): Promise<CareerRecommendation> {
    try {
      // Use new recommendation service if assessment data is available
      if (assessmentData) {
        const recommendations = await CareerRecommendationService.generateRecommendations(profile, assessmentData);
        return recommendations[0]; // Return the top recommendation
      }
      
      // Fallback to original Gemini API method
      return await GeminiService.generateCareerPath(profile);
    } catch (error) {
      console.error('Error with career generation, falling back to mock data:', error);
      // Fallback to mock data if API fails
      return this.getMockRecommendation(profile);
    }
  }

  static async generateRecommendations(profile: UserProfile, assessmentData?: CareerAssessmentData): Promise<CareerRecommendation[]> {
    try {
      return await CareerRecommendationService.generateRecommendations(profile, assessmentData);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Return single recommendation as array for consistency
      const singleRec = await this.generatePath(profile, assessmentData);
      return [singleRec];
    }
  }

  static async suggestAlternatives(profile: UserProfile): Promise<AlternativeCareer[]> {
    try {
      // Try to use Gemini API first
      return await GeminiService.suggestAlternatives(profile);
    } catch (error) {
      console.error('Error with Gemini API, falling back to mock data:', error);
      // Fallback to mock data if API fails
      const recommendation = this.getMockRecommendation(profile);
      return recommendation.alternatives;
    }
  }

  private static getMockRecommendation(profile: UserProfile): CareerRecommendation {
    // Simple logic to determine career path based on interests and skills
    let careerType = 'software-developer'; // default
    
    if (profile.careerInterest.toLowerCase().includes('data') || 
        profile.careerInterest.toLowerCase().includes('analytics') ||
        profile.careerInterest.toLowerCase().includes('machine learning')) {
      careerType = 'data-scientist';
    } else if (profile.careerInterest.toLowerCase().includes('product') ||
               profile.careerInterest.toLowerCase().includes('management') ||
               profile.careerInterest.toLowerCase().includes('strategy')) {
      careerType = 'product-manager';
    }

    const pathData = mockCareerPaths[careerType as keyof typeof mockCareerPaths];
    const alternatives = mockAlternatives[careerType as keyof typeof mockAlternatives];

    return {
      id: `career_${careerType}_${Date.now()}`,
      title: this.getCareerTitle(careerType),
      description: `A career path in ${this.getCareerTitle(careerType)} based on your interests and skills.`,
      fitScore: 75, // Default fit score for mock data
      salaryRange: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
      growthProspects: 'high' as const,
      requiredSkills: [],
      recommendedPath: {
        id: `path_${careerType}`,
        title: `${this.getCareerTitle(careerType)} Learning Path`,
        description: `Comprehensive learning path for ${this.getCareerTitle(careerType)}`,
        totalDuration: '6-12 months',
        phases: [],
        estimatedCost: 2000,
        difficulty: 'intermediate' as const,
        prerequisites: [],
        outcomes: []
      },
      jobMarketData: {
        demand: 'high' as const,
        competitiveness: 'medium' as const,
        locations: ['Remote', 'Major Cities'],
        industryGrowth: 10,
        averageSalary: 90000
      },
      primaryCareer: this.getCareerTitle(careerType),
      relatedRoles: this.getRelatedRoles(careerType),
      careerPath: {
        nodes: pathData.nodes,
        edges: pathData.edges
      },
      alternatives: alternatives,
      summary: this.generateSummary(profile, careerType)
    };
  }

  private static getCareerTitle(careerType: string): string {
    const titles = {
      'ai-ethics-specialist': 'AI Ethics Specialist',
      'quantum-computing-engineer': 'Quantum Computing Engineer',
      'climate-tech-architect': 'Climate Tech Solutions Architect',
      'bioinformatics-specialist': 'Bioinformatics Specialist',
      'xr-developer': 'Extended Reality (XR) Developer'
    };
    return titles[careerType as keyof typeof titles] || 'AI Ethics Specialist';
  }

  private static getRelatedRoles(careerType: string): string[] {
    const roles = {
      'ai-ethics-specialist': ['AI Policy Researcher', 'Algorithmic Auditor', 'Tech Ethics Consultant', 'AI Governance Manager'],
      'quantum-computing-engineer': ['Quantum Research Scientist', 'Quantum Software Developer', 'Quantum Algorithm Designer', 'Quantum Systems Architect'],
      'climate-tech-architect': ['Sustainability Engineer', 'Clean Energy Analyst', 'Environmental Data Scientist', 'Green Technology Consultant'],
      'bioinformatics-specialist': ['Computational Biologist', 'Genomics Data Analyst', 'Biomedical Software Engineer', 'Precision Medicine Developer'],
      'xr-developer': ['VR Developer', 'AR Developer', '3D Graphics Programmer', 'Immersive Experience Designer']
    };
    return roles[careerType as keyof typeof roles] || ['AI Policy Researcher', 'Tech Ethics Consultant'];
  }

  private static generateSummary(profile: UserProfile, careerType: string): string {
    const resumeSkills = profile.resume?.extractedInfo.skills || [];
    const allSkills = [...new Set([...profile.skills, ...resumeSkills])];
    const experienceCount = profile.resume?.extractedInfo.experience.length || 0;
    
    const summaries = {
      'software-developer': `Based on your interest in ${profile.careerInterest}, a career in software development would be perfect for you. Your skills in ${allSkills.join(', ')} provide a strong foundation for building modern web applications.${experienceCount > 0 ? ` Your ${experienceCount} years of experience will give you an advantage in the job market.` : ''}`,
      'data-scientist': `Your interest in ${profile.careerInterest} and skills in ${allSkills.join(', ')} make you an excellent candidate for data science. This field offers great opportunities to work with data and machine learning.${experienceCount > 0 ? ` Your professional experience will be valuable in this analytical field.` : ''}`,
      'product-manager': `With your interest in ${profile.careerInterest} and skills in ${allSkills.join(', ')}, product management could be your ideal career path. You'll be able to bridge technical and business worlds.${experienceCount > 0 ? ` Your industry experience will help you understand user needs and market dynamics.` : ''}`
    };
    return summaries[careerType as keyof typeof summaries] || summaries['software-developer'];
  }
}
