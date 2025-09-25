import { CareerRecommendation } from '../types'

export interface CareerProfile {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  requiredSkills: SkillRequirement[]
  preferredSkills: SkillRequirement[]
  experienceLevel: 'entry' | 'mid' | 'senior'
  salaryRange: {
    min: number
    max: number
    currency: string
    period: string
  }
  growthProspects: 'high' | 'medium' | 'low'
  workEnvironment: {
    remote: boolean
    hybrid: boolean
    onsite: boolean
    teamSize: string
    workStyle: string[]
  }
  industryTrends: {
    demand: 'high' | 'medium' | 'low'
    growth: number
    competitiveness: 'high' | 'medium' | 'low'
  }
  relatedCareers: string[]
  keywords: string[]
}

export interface SkillRequirement {
  skill: string
  importance: 'critical' | 'important' | 'nice-to-have'
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'technical' | 'soft' | 'domain' | 'certification'
}

export const CAREER_DATABASE: CareerProfile[] = [
  // Technology & Software Development
  {
    id: 'software-developer',
    title: 'Software Developer',
    description: 'Design, develop, and maintain software applications using various programming languages and frameworks. Work on web applications, mobile apps, or desktop software.',
    category: 'Technology',
    subcategory: 'Software Development',
    requiredSkills: [
      { skill: 'JavaScript', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'HTML/CSS', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Git', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Problem Solving', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'React', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Node.js', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'TypeScript', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['collaborative', 'analytical', 'creative']
    },
    industryTrends: { demand: 'high', growth: 15, competitiveness: 'medium' },
    relatedCareers: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    keywords: ['programming', 'coding', 'web development', 'software engineering', 'frontend', 'backend']
  },
  
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze complex data to extract insights and build predictive models. Use statistical methods, machine learning, and data visualization to solve business problems.',
    category: 'Technology',
    subcategory: 'Data & Analytics',
    requiredSkills: [
      { skill: 'Python', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Statistics', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'SQL', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Data Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Machine Learning', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'R', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Tableau', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 80000, max: 150000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['analytical', 'research-oriented', 'detail-oriented']
    },
    industryTrends: { demand: 'high', growth: 20, competitiveness: 'high' },
    relatedCareers: ['Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst'],
    keywords: ['data science', 'machine learning', 'analytics', 'statistics', 'python', 'modeling']
  },

  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    description: 'Design user-centered digital experiences by researching user needs, creating wireframes, prototypes, and visual designs for websites and applications.',
    category: 'Design',
    subcategory: 'User Experience',
    requiredSkills: [
      { skill: 'User Research', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Wireframing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Prototyping', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Design Thinking', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Figma', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Adobe Creative Suite', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'HTML/CSS', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 55000, max: 110000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-5 people',
      workStyle: ['creative', 'user-focused', 'collaborative']
    },
    industryTrends: { demand: 'high', growth: 12, competitiveness: 'medium' },
    relatedCareers: ['Product Designer', 'Visual Designer', 'Interaction Designer'],
    keywords: ['ux design', 'ui design', 'user experience', 'design', 'prototyping', 'user research']
  },

  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Lead product development from conception to launch. Define product strategy, work with cross-functional teams, and ensure products meet user needs and business goals.',
    category: 'Business',
    subcategory: 'Product Management',
    requiredSkills: [
      { skill: 'Product Strategy', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Market Research', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Project Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Agile/Scrum', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'User Experience', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 90000, max: 160000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '5-15 people',
      workStyle: ['strategic', 'collaborative', 'leadership']
    },
    industryTrends: { demand: 'high', growth: 18, competitiveness: 'high' },
    relatedCareers: ['Business Analyst', 'Program Manager', 'Strategy Consultant'],
    keywords: ['product management', 'strategy', 'leadership', 'business', 'agile', 'roadmap']
  },

  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    description: 'Protect organizations from cyber threats by monitoring security systems, investigating incidents, implementing security measures, and ensuring compliance.',
    category: 'Technology',
    subcategory: 'Security',
    requiredSkills: [
      { skill: 'Network Security', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Risk Assessment', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Incident Response', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Security Tools', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Penetration Testing', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'CISSP', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'certification' },
      { skill: 'Python', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 65000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['analytical', 'detail-oriented', 'problem-solving']
    },
    industryTrends: { demand: 'high', growth: 25, competitiveness: 'medium' },
    relatedCareers: ['Information Security Specialist', 'Security Engineer', 'Penetration Tester'],
    keywords: ['cybersecurity', 'security', 'network security', 'incident response', 'risk management']
  },

  {
    id: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    description: 'Develop and execute digital marketing campaigns across various channels including social media, email, content marketing, and paid advertising.',
    category: 'Marketing',
    subcategory: 'Digital Marketing',
    requiredSkills: [
      { skill: 'Digital Marketing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Content Creation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Social Media Marketing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Analytics', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Google Ads', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'SEO', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Email Marketing', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 45000, max: 85000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['creative', 'data-driven', 'fast-paced']
    },
    industryTrends: { demand: 'high', growth: 10, competitiveness: 'medium' },
    relatedCareers: ['Content Marketing Manager', 'Social Media Manager', 'SEO Specialist'],
    keywords: ['digital marketing', 'social media', 'content marketing', 'advertising', 'seo', 'analytics']
  },

  {
    id: 'business-analyst',
    title: 'Business Analyst',
    description: 'Bridge the gap between business needs and technology solutions by analyzing processes, gathering requirements, and recommending improvements.',
    category: 'Business',
    subcategory: 'Analysis',
    requiredSkills: [
      { skill: 'Business Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Requirements Gathering', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Process Mapping', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'SQL', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Excel', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Agile', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 55000, max: 95000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '4-10 people',
      workStyle: ['analytical', 'collaborative', 'detail-oriented']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'medium' },
    relatedCareers: ['Systems Analyst', 'Product Owner', 'Process Improvement Specialist'],
    keywords: ['business analysis', 'requirements', 'process improvement', 'stakeholder management']
  },

  {
    id: 'cloud-architect',
    title: 'Cloud Solutions Architect',
    description: 'Design and implement cloud infrastructure solutions, migrate applications to cloud platforms, and optimize cloud environments for performance and cost.',
    category: 'Technology',
    subcategory: 'Cloud Computing',
    requiredSkills: [
      { skill: 'Cloud Platforms', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'System Architecture', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'DevOps', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Security', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'AWS', importance: 'important', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Docker', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Kubernetes', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 120000, max: 200000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['strategic', 'technical', 'problem-solving']
    },
    industryTrends: { demand: 'high', growth: 22, competitiveness: 'high' },
    relatedCareers: ['DevOps Engineer', 'Infrastructure Engineer', 'Site Reliability Engineer'],
    keywords: ['cloud computing', 'aws', 'azure', 'architecture', 'devops', 'infrastructure']
  },

  {
    id: 'healthcare-data-analyst',
    title: 'Healthcare Data Analyst',
    description: 'Analyze healthcare data to improve patient outcomes, reduce costs, and support clinical decision-making using statistical methods and healthcare informatics.',
    category: 'Healthcare',
    subcategory: 'Health Informatics',
    requiredSkills: [
      { skill: 'Healthcare Knowledge', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Data Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'SQL', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Statistics', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Python', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Tableau', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'HIPAA Compliance', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 65000, max: 110000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-7 people',
      workStyle: ['analytical', 'detail-oriented', 'healthcare-focused']
    },
    industryTrends: { demand: 'high', growth: 18, competitiveness: 'medium' },
    relatedCareers: ['Clinical Data Manager', 'Health Informatics Specialist', 'Epidemiologist'],
    keywords: ['healthcare', 'medical data', 'health informatics', 'clinical analysis', 'patient outcomes']
  },

  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    description: 'Analyze financial data, create financial models, prepare reports, and provide recommendations to support business decisions and investment strategies.',
    category: 'Finance',
    subcategory: 'Financial Analysis',
    requiredSkills: [
      { skill: 'Financial Modeling', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Excel', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Financial Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Accounting Principles', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'SQL', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'PowerBI', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'CFA', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'certification' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 55000, max: 95000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['analytical', 'detail-oriented', 'deadline-driven']
    },
    industryTrends: { demand: 'medium', growth: 5, competitiveness: 'medium' },
    relatedCareers: ['Investment Analyst', 'Budget Analyst', 'Risk Analyst'],
    keywords: ['finance', 'financial analysis', 'modeling', 'investment', 'budgeting', 'forecasting']
  },

  // Additional careers to reach 50+ diverse options
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer',
    description: 'Develop mobile applications for iOS and Android platforms using native or cross-platform technologies.',
    category: 'Technology',
    subcategory: 'Mobile Development',
    requiredSkills: [
      { skill: 'Mobile Development', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Programming', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'UI/UX Design', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'React Native', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Swift', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Kotlin', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 65000, max: 125000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['creative', 'technical', 'user-focused']
    },
    industryTrends: { demand: 'high', growth: 15, competitiveness: 'medium' },
    relatedCareers: ['iOS Developer', 'Android Developer', 'Frontend Developer'],
    keywords: ['mobile development', 'ios', 'android', 'react native', 'app development']
  },

  {
    id: 'content-creator',
    title: 'Content Creator',
    description: 'Create engaging content across various digital platforms including video, podcasts, blogs, and social media to build audiences and drive engagement.',
    category: 'Creative',
    subcategory: 'Content Creation',
    requiredSkills: [
      { skill: 'Content Creation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Storytelling', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Social Media', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Video Editing', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Photography', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Adobe Creative Suite', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'SEO', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 35000, max: 75000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: false,
      teamSize: '1-3 people',
      workStyle: ['creative', 'independent', 'audience-focused']
    },
    industryTrends: { demand: 'high', growth: 12, competitiveness: 'high' },
    relatedCareers: ['Social Media Manager', 'Video Producer', 'Blogger'],
    keywords: ['content creation', 'social media', 'video', 'blogging', 'influencer', 'digital content']
  },

  {
    id: 'sustainability-consultant',
    title: 'Sustainability Consultant',
    description: 'Help organizations develop and implement sustainable practices, reduce environmental impact, and achieve sustainability goals.',
    category: 'Consulting',
    subcategory: 'Environmental',
    requiredSkills: [
      { skill: 'Sustainability Knowledge', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Environmental Science', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Project Management', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'LEED Certification', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'certification' },
      { skill: 'Carbon Accounting', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Stakeholder Engagement', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 60000, max: 110000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-5 people',
      workStyle: ['analytical', 'mission-driven', 'collaborative']
    },
    industryTrends: { demand: 'high', growth: 20, competitiveness: 'medium' },
    relatedCareers: ['Environmental Consultant', 'ESG Analyst', 'Climate Change Analyst'],
    keywords: ['sustainability', 'environmental', 'green technology', 'climate', 'renewable energy']
  },

  {
    id: 'ai-engineer',
    title: 'AI/Machine Learning Engineer',
    description: 'Design, develop, and deploy artificial intelligence and machine learning systems to solve complex problems and automate processes.',
    category: 'Technology',
    subcategory: 'Artificial Intelligence',
    requiredSkills: [
      { skill: 'Machine Learning', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Python', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Deep Learning', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Statistics', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'TensorFlow', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'PyTorch', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'MLOps', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 100000, max: 180000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['research-oriented', 'technical', 'innovative']
    },
    industryTrends: { demand: 'high', growth: 30, competitiveness: 'high' },
    relatedCareers: ['Data Scientist', 'Research Scientist', 'Computer Vision Engineer'],
    keywords: ['artificial intelligence', 'machine learning', 'deep learning', 'ai', 'neural networks']
  },

  {
    id: 'technical-writer',
    title: 'Technical Writer',
    description: 'Create clear, concise documentation for technical products, APIs, software, and complex systems to help users understand and use technology effectively.',
    category: 'Communication',
    subcategory: 'Technical Writing',
    requiredSkills: [
      { skill: 'Technical Writing', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Documentation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Research Skills', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Markdown', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Git', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'API Documentation', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 50000, max: 90000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '1-4 people',
      workStyle: ['detail-oriented', 'collaborative', 'user-focused']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'low' },
    relatedCareers: ['Content Strategist', 'UX Writer', 'Documentation Specialist'],
    keywords: ['technical writing', 'documentation', 'api docs', 'user guides', 'technical communication']
  }
]

export const SKILL_TAXONOMY = {
  categories: [
    {
      id: 'programming',
      name: 'Programming Languages',
      skills: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'Swift', 'Kotlin']
    },
    {
      id: 'web-development',
      name: 'Web Development',
      skills: ['HTML', 'CSS', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask']
    },
    {
      id: 'data-science',
      name: 'Data Science & Analytics',
      skills: ['SQL', 'R', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Statistics', 'Machine Learning']
    },
    {
      id: 'cloud-platforms',
      name: 'Cloud Platforms',
      skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins']
    },
    {
      id: 'design',
      name: 'Design & Creative',
      skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Canva', 'Photography', 'Video Editing']
    },
    {
      id: 'business',
      name: 'Business & Management',
      skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Strategy', 'Business Analysis']
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      skills: ['Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing']
    }
  ],
  synonyms: [
    { canonical: 'JavaScript', synonyms: ['JS', 'ECMAScript', 'Node.js', 'Frontend Development'] },
    { canonical: 'Python', synonyms: ['Python3', 'Data Science', 'Machine Learning', 'AI'] },
    { canonical: 'React', synonyms: ['ReactJS', 'React.js', 'Frontend Framework'] },
    { canonical: 'SQL', synonyms: ['Database', 'MySQL', 'PostgreSQL', 'Data Querying'] },
    { canonical: 'Machine Learning', synonyms: ['ML', 'AI', 'Artificial Intelligence', 'Data Science'] },
    { canonical: 'User Experience', synonyms: ['UX', 'User Research', 'Usability', 'Design Thinking'] },
    { canonical: 'Digital Marketing', synonyms: ['Online Marketing', 'Internet Marketing', 'Web Marketing'] },
    { canonical: 'Project Management', synonyms: ['PM', 'Program Management', 'Agile', 'Scrum'] }
  ]
}