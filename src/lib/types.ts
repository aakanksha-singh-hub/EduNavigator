// User Profile Types
export interface UserProfile {
  name: string;
  age: number;
  educationLevel: EducationLevel;
  skills: string[];
  careerInterest: string;
  location?: string;
  resume?: ResumeData;
}

// Resume Types
export interface ResumeData {
  file: File;
  extractedText: string;
  extractedInfo: ExtractedResumeInfo;
}

export interface ExtractedResumeInfo {
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  experience: WorkExperience[];
  education: EducationInfo[];
  summary?: string;
  languages?: string[];
  certifications?: string[];
}

export interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
  skills?: string[];
}

export interface EducationInfo {
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export type EducationLevel = 
  | 'high-school'
  | 'associates'
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'other';

// Career Path Types
export interface CareerNode {
  id: string;
  type: 'course' | 'internship' | 'job' | 'company' | 'skill';
  title: string;
  description: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  salary?: string;
  requirements?: string[];
  position: { x: number; y: number };
}

export interface CareerEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'default' | 'straight' | 'step' | 'smoothstep';
  animated?: boolean;
}

export interface CareerPath {
  nodes: CareerNode[];
  edges: CareerEdge[];
}

// Alternative Career Types
export interface AlternativeCareer {
  id: string;
  title: string;
  description: string;
  matchScore: number;
  salary: string;
  requirements: string[];
  growth: 'high' | 'medium' | 'low';
}

// Career Service Response Types
export interface CareerRecommendation {
  primaryCareer: string;
  relatedRoles: string[];
  careerPath: CareerPath;
  alternatives: AlternativeCareer[];
  summary: string;
}

// Form Types
export interface UserDetailsForm {
  name: string;
  age: number;
  educationLevel: EducationLevel;
  skills: string[];
  careerInterest: string;
  location?: string;
}

// Store Types
export interface UserStore {
  profile: UserProfile | null;
  results: CareerRecommendation | null;
  setProfile: (profile: UserProfile) => void;
  setResults: (results: CareerRecommendation) => void;
  clearData: () => void;
}
