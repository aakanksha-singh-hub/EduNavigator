import { 
  CareerAssessmentData, 
  UserProfile, 
  CareerRecommendation
} from '../types';
import { GeminiService } from './geminiService';

interface CareerFitCalculation {
  interestMatch: number;
  skillMatch: number;
  valueAlignment: number;
  experienceRelevance: number;
  overallFit: number;
}

export class CareerRecommendationService {
  private static readonly CACHE_KEY = 'career_recommendations_cache';
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate personalized career recommendations based on assessment and profile data
   */
  static async generateRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): Promise<CareerRecommendation[]> {
    try {
      // Check cache first
      const cached = this.getCachedRecommendations(profile, assessmentData);
      if (cached) {
        return cached;
      }

      // Generate new recommendations
      const recommendations = await this.generateNewRecommendations(profile, assessmentData);
      
      // Cache the results
      this.cacheRecommendations(profile, assessmentData, recommendations);
      
      return recommendations;
    } catch (error) {
      console.error('Error generating career recommendations:', error);
      // Fallback to basic recommendations
      return this.getFallbackRecommendations(profile, assessmentData);
    }
  }

  /**
   * Generate new recommendations using AI service
   */
  private static async generateNewRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): Promise<CareerRecommendation[]> {
    const prompt = this.buildRecommendationPrompt(profile, assessmentData);
    
    try {
      const aiResponse = await GeminiService.generateCareerRecommendations(prompt);
      const recommendations = this.parseAIResponse(aiResponse);
      
      // Calculate fit scores for each recommendation and ensure all required fields
      return recommendations.map(rec => ({
        id: rec.id || `career_${Date.now()}_${Math.random()}`,
        title: rec.title || 'Unknown Career',
        description: rec.description || 'No description available',
        fitScore: this.calculateFitScore(rec, profile, assessmentData).overallFit,
        salaryRange: rec.salaryRange || { min: 50000, max: 80000, currency: 'USD', period: 'yearly' },
        growthProspects: rec.growthProspects || 'medium',
        requiredSkills: rec.requiredSkills || [],
        recommendedPath: rec.recommendedPath || {
          id: `path_${rec.id || 'default'}`,
          title: `${rec.title || 'Career'} Learning Path`,
          description: `Learning path for ${rec.title || 'this career'}`,
          totalDuration: '6-12 months',
          phases: [],
          estimatedCost: 2000,
          difficulty: 'intermediate' as const,
          prerequisites: [],
          outcomes: []
        },
        jobMarketData: rec.jobMarketData || {
          demand: 'medium',
          competitiveness: 'medium',
          locations: ['Remote'],
          industryGrowth: 5,
          averageSalary: 65000
        },
        primaryCareer: rec.primaryCareer || rec.title || 'Unknown Career',
        relatedRoles: rec.relatedRoles || [],
        summary: rec.summary || 'Career recommendation based on your profile.'
      })) as CareerRecommendation[];
    } catch (error) {
      console.error('AI service error:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive prompt for AI recommendation generation
   */
  private static buildRecommendationPrompt(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): string {
    let prompt = `
      Generate 5 personalized career recommendations based on the following profile:

      BASIC PROFILE:
      - Name: ${profile.name}
      - Age: ${profile.age}
      - Education: ${profile.educationLevel}
      - Skills: ${profile.skills.join(', ')}
      - Career Interest: ${profile.careerInterest}
      - Location: ${profile.location || 'Not specified'}
    `;

    if (profile.resume) {
      prompt += `
      
      RESUME DATA:
      - Professional Skills: ${profile.resume.extractedInfo.skills.join(', ')}
      - Work Experience: ${profile.resume.extractedInfo.experience.length} positions
      - Education Background: ${profile.resume.extractedInfo.education.length} degrees
      - Languages: ${profile.resume.extractedInfo.languages?.join(', ') || 'Not specified'}
      - Certifications: ${profile.resume.extractedInfo.certifications?.join(', ') || 'Not specified'}
      
      WORK EXPERIENCE DETAILS:
      ${profile.resume.extractedInfo.experience.map(exp => 
        `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`
      ).join('\n')}
      `;
    }

    if (assessmentData) {
      prompt += `
      
      CAREER ASSESSMENT DATA:
      - Top Interests: ${assessmentData.interests.join(', ')}
      - Core Values: ${assessmentData.values.join(', ')}
      - Work Style Preferences: ${assessmentData.workStyle.join(', ')}
      - Personality Traits: ${assessmentData.personalityTraits.join(', ')}
      - Career Goals: ${assessmentData.careerGoals.join(', ')}
      - Timeline: ${assessmentData.timeframe}
      - Assessment Completed: ${assessmentData.completedAt.toDateString()}
      `;
    }

    prompt += `
    
    Please provide 5 career recommendations in the following JSON format:
    [
      {
        "id": "career_1",
        "title": "Career Title",
        "description": "Detailed description of the career path and what it involves",
        "fitScore": 85,
        "salaryRange": {
          "min": 60000,
          "max": 90000,
          "currency": "USD",
          "period": "yearly"
        },
        "growthProspects": "high",
        "requiredSkills": [
          {
            "id": "skill_1",
            "name": "Skill Name",
            "category": "Technical",
            "isRequired": true,
            "priority": "critical"
          }
        ],
        "jobMarketData": {
          "demand": "high",
          "competitiveness": "medium",
          "locations": ["San Francisco", "New York", "Remote"],
          "industryGrowth": 15,
          "averageSalary": 75000
        },
        "primaryCareer": "Main Career Title",
        "relatedRoles": ["Related Role 1", "Related Role 2", "Related Role 3"],
        "summary": "Personalized summary explaining why this career fits the user"
      }
    ]

    IMPORTANT REQUIREMENTS:
    1. Base fit scores on alignment between user profile/assessment and career requirements
    2. Consider both technical skills and soft skills from assessment
    3. Factor in user's experience level and education
    4. Provide realistic salary ranges based on location and experience
    5. Include growth prospects based on industry trends
    6. Make recommendations diverse across different career paths
    7. Ensure each recommendation has a compelling, personalized summary
    ${assessmentData ? '8. Heavily weight the career assessment data in your recommendations' : ''}
    `;

    return prompt;
  }

  /**
   * Calculate fit score based on multiple factors
   */
  private static calculateFitScore(
    recommendation: Partial<CareerRecommendation>,
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerFitCalculation {
    let interestMatch = 50; // Base score
    let skillMatch = 50;
    let valueAlignment = 50;
    let experienceRelevance = 50;

    // Calculate interest match from assessment
    if (assessmentData && recommendation.title) {
      const titleLower = recommendation.title.toLowerCase();
      const interestKeywords = assessmentData.interests.join(' ').toLowerCase();
      const goalKeywords = assessmentData.careerGoals.join(' ').toLowerCase();
      
      if (interestKeywords.includes(titleLower) || goalKeywords.includes(titleLower)) {
        interestMatch = 90;
      } else if (this.hasKeywordOverlap(titleLower, interestKeywords)) {
        interestMatch = 75;
      }
    }

    // Calculate skill match
    if (recommendation.requiredSkills) {
      const userSkills = [...profile.skills];
      if (profile.resume) {
        userSkills.push(...profile.resume.extractedInfo.skills);
      }
      
      const requiredSkillNames = recommendation.requiredSkills.map(s => s.name.toLowerCase());
      const userSkillsLower = userSkills.map(s => s.toLowerCase());
      
      const matchingSkills = requiredSkillNames.filter(skill => 
        userSkillsLower.some(userSkill => 
          userSkill.includes(skill) || skill.includes(userSkill)
        )
      );
      
      skillMatch = Math.min(95, (matchingSkills.length / requiredSkillNames.length) * 100);
    }

    // Calculate value alignment from assessment
    if (assessmentData) {
      const careerValues = this.extractCareerValues(recommendation.title || '');
      const userValues = assessmentData.values.map(v => v.toLowerCase());
      
      const alignmentScore = careerValues.filter(cv => 
        userValues.some(uv => uv.includes(cv) || cv.includes(uv))
      ).length;
      
      valueAlignment = Math.min(95, (alignmentScore / Math.max(careerValues.length, 1)) * 100);
    }

    // Calculate experience relevance
    if (profile.resume && profile.resume.extractedInfo.experience.length > 0) {
      const experienceYears = profile.resume.extractedInfo.experience.length;
      const careerLevel = this.determineCareerLevel(recommendation.title || '');
      
      if (careerLevel === 'entry' && experienceYears <= 2) {
        experienceRelevance = 90;
      } else if (careerLevel === 'mid' && experienceYears >= 2 && experienceYears <= 5) {
        experienceRelevance = 90;
      } else if (careerLevel === 'senior' && experienceYears >= 5) {
        experienceRelevance = 90;
      } else {
        experienceRelevance = Math.max(30, 90 - Math.abs(experienceYears - this.getIdealExperience(careerLevel)) * 10);
      }
    }

    // Calculate weighted overall fit score
    const weights = {
      interest: assessmentData ? 0.35 : 0.25,
      skill: 0.30,
      value: assessmentData ? 0.25 : 0.15,
      experience: 0.10
    };

    const overallFit = Math.round(
      interestMatch * weights.interest +
      skillMatch * weights.skill +
      valueAlignment * weights.value +
      experienceRelevance * weights.experience
    );

    return {
      interestMatch,
      skillMatch,
      valueAlignment,
      experienceRelevance,
      overallFit: Math.min(100, Math.max(0, overallFit))
    };
  }

  /**
   * Helper method to check keyword overlap
   */
  private static hasKeywordOverlap(text1: string, text2: string): boolean {
    const words1 = text1.split(' ').filter(w => w.length > 3);
    const words2 = text2.split(' ').filter(w => w.length > 3);
    
    return words1.some(w1 => words2.some(w2 => w1.includes(w2) || w2.includes(w1)));
  }

  /**
   * Extract career-related values from career title
   */
  private static extractCareerValues(careerTitle: string): string[] {
    const titleLower = careerTitle.toLowerCase();
    const valueMap = {
      'innovation': ['developer', 'engineer', 'designer', 'architect'],
      'leadership': ['manager', 'director', 'lead', 'head'],
      'helping others': ['teacher', 'consultant', 'advisor', 'support'],
      'creativity': ['designer', 'artist', 'creative', 'marketing'],
      'analysis': ['analyst', 'scientist', 'researcher', 'data'],
      'stability': ['administrator', 'coordinator', 'specialist']
    };

    const values: string[] = [];
    Object.entries(valueMap).forEach(([value, keywords]) => {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        values.push(value);
      }
    });

    return values;
  }

  /**
   * Determine career level from title
   */
  private static determineCareerLevel(careerTitle: string): 'entry' | 'mid' | 'senior' {
    const titleLower = careerTitle.toLowerCase();
    
    if (titleLower.includes('junior') || titleLower.includes('entry') || titleLower.includes('associate')) {
      return 'entry';
    } else if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
      return 'senior';
    }
    
    return 'mid';
  }

  /**
   * Get ideal experience years for career level
   */
  private static getIdealExperience(level: 'entry' | 'mid' | 'senior'): number {
    const experienceMap = {
      entry: 1,
      mid: 3,
      senior: 7
    };
    return experienceMap[level];
  }

  /**
   * Parse AI response into structured recommendations
   */
  private static parseAIResponse(response: string): Partial<CareerRecommendation>[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  /**
   * Get cached recommendations if available and valid
   */
  private static getCachedRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerRecommendation[] | null {
    try {
      const cacheKey = this.generateCacheKey(profile, assessmentData);
      const cached = localStorage.getItem(`${this.CACHE_KEY}_${cacheKey}`);
      
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Check if cache is still valid
      if (now - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(`${this.CACHE_KEY}_${cacheKey}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  /**
   * Cache recommendations for future use
   */
  private static cacheRecommendations(
    profile: UserProfile,
    assessmentData: CareerAssessmentData | undefined,
    recommendations: CareerRecommendation[]
  ): void {
    try {
      const cacheKey = this.generateCacheKey(profile, assessmentData);
      const cacheData = {
        data: recommendations,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`${this.CACHE_KEY}_${cacheKey}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error caching recommendations:', error);
    }
  }

  /**
   * Generate cache key based on profile and assessment data
   */
  private static generateCacheKey(profile: UserProfile, assessmentData?: CareerAssessmentData): string {
    const profileHash = btoa(JSON.stringify({
      skills: profile.skills.sort(),
      careerInterest: profile.careerInterest,
      educationLevel: profile.educationLevel,
      resumeSkills: profile.resume?.extractedInfo.skills.sort() || []
    }));
    
    const assessmentHash = assessmentData 
      ? btoa(JSON.stringify({
          interests: assessmentData.interests.sort(),
          values: assessmentData.values.sort(),
          goals: assessmentData.careerGoals.sort()
        }))
      : 'no_assessment';
    
    return `${profileHash}_${assessmentHash}`.substring(0, 50);
  }

  /**
   * Provide fallback recommendations when AI service fails
   */
  private static getFallbackRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerRecommendation[] {
    const fallbackRecommendations: Partial<CareerRecommendation>[] = [
      {
        id: 'fallback_1',
        title: 'Software Developer',
        description: 'Design, develop, and maintain software applications using various programming languages and frameworks.',
        salaryRange: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
        growthProspects: 'high',
        primaryCareer: 'Software Developer',
        relatedRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
        summary: 'Based on your technical interests and skills, software development offers excellent growth opportunities.'
      },
      {
        id: 'fallback_2',
        title: 'Data Analyst',
        description: 'Analyze data to help organizations make informed business decisions using statistical tools and techniques.',
        salaryRange: { min: 50000, max: 90000, currency: 'USD', period: 'yearly' },
        growthProspects: 'high',
        primaryCareer: 'Data Analyst',
        relatedRoles: ['Business Analyst', 'Data Scientist', 'Research Analyst'],
        summary: 'Your analytical skills and attention to detail make you well-suited for data analysis roles.'
      },
      {
        id: 'fallback_3',
        title: 'Product Manager',
        description: 'Lead product development from conception to launch, working with cross-functional teams.',
        salaryRange: { min: 70000, max: 130000, currency: 'USD', period: 'yearly' },
        growthProspects: 'high',
        primaryCareer: 'Product Manager',
        relatedRoles: ['Project Manager', 'Product Owner', 'Business Analyst'],
        summary: 'Your leadership potential and strategic thinking align well with product management roles.'
      }
    ];

    return fallbackRecommendations.map(rec => ({
      ...rec,
      fitScore: this.calculateFitScore(rec, profile, assessmentData).overallFit,
      requiredSkills: [],
      jobMarketData: {
        demand: 'high',
        competitiveness: 'medium',
        locations: ['Remote', 'Major Cities'],
        industryGrowth: 10,
        averageSalary: (rec.salaryRange!.min + rec.salaryRange!.max) / 2
      }
    })) as CareerRecommendation[];
  }

  /**
   * Clear all cached recommendations
   */
  static clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.CACHE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get recommendation by ID
   */
  static getRecommendationById(
    recommendations: CareerRecommendation[],
    id: string
  ): CareerRecommendation | null {
    return recommendations.find(rec => rec.id === id) || null;
  }

  /**
   * Sort recommendations by fit score
   */
  static sortByFitScore(recommendations: CareerRecommendation[]): CareerRecommendation[] {
    return [...recommendations].sort((a, b) => b.fitScore - a.fitScore);
  }

  /**
   * Filter recommendations by minimum fit score
   */
  static filterByMinFitScore(
    recommendations: CareerRecommendation[],
    minScore: number
  ): CareerRecommendation[] {
    return recommendations.filter(rec => rec.fitScore >= minScore);
  }
}