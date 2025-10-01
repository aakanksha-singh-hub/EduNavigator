import {
  CareerAssessmentData,
  UserProfile,
  CareerRecommendation,
} from '../types'
import { GeminiService } from './geminiService'
import { CAREER_DATABASE, CareerProfile } from '../data/careerDatabase'
import { AdvancedScoringEngine, DetailedFitScore } from './advancedScoringEngine'
import { SemanticSkillAnalyzer } from './semanticSkillAnalyzer'

interface CareerFitCalculation {
  interestMatch: number
  skillMatch: number
  valueAlignment: number
  experienceRelevance: number
  overallFit: number
}

export class CareerRecommendationService {
  private static readonly CACHE_KEY = 'career_recommendations_cache'
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private static scoringEngine = new AdvancedScoringEngine()
  private static skillAnalyzer = new SemanticSkillAnalyzer()

  /**
   * Generate personalized career recommendations based on assessment and profile data
   */
  static async generateRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): Promise<CareerRecommendation[]> {
    try {
      console.log('CareerRecommendationService: Starting advanced recommendation generation...')
      
      // Always skip cache to ensure fresh recommendations with new system
      console.log('Skipping cache to ensure fresh recommendations with new advanced system')
      
      // Clear old cache entries to prevent conflicts
      this.clearCache()
      
      // Force clear localStorage completely for career recommendations
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.includes('career') || key.includes('recommendation')) {
            localStorage.removeItem(key)
            console.log('Force cleared cache key:', key)
          }
        })
      } catch (e) {
        console.log('Cache clear error:', e)
      }

      // Use advanced matching system as primary method (synchronous, no AI needed)
      const recommendations = this.generateAdvancedRecommendations(profile, assessmentData)
      
      console.log(`CareerRecommendationService: Generated ${recommendations.length} personalized recommendations`)

      // Cache the results
      this.cacheRecommendations(profile, assessmentData, recommendations)
      return recommendations

    } catch (error) {
      console.error('Error generating advanced career recommendations:', error)
      
      // Final fallback to intelligent recommendations (no AI needed)
      return this.getIntelligentFallbackRecommendations(profile, assessmentData)
    }
  }

  /**
   * Generate recommendations using advanced matching algorithms
   * GUARANTEED to always return at least 3 job recommendations
   */
  private static generateAdvancedRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerRecommendation[] {
    console.log('CareerRecommendationService: Using advanced matching algorithms')
    console.log('Assessment Data:', assessmentData)
    console.log('Preferred Industries:', assessmentData?.preferredIndustries)
    console.log(`Processing ${CAREER_DATABASE.length} careers from database`)

    // DOMAIN-SPECIFIC FILTERING: If user selected specific domains, filter careers first
    let relevantCareers = CAREER_DATABASE
    if (assessmentData?.preferredIndustries && assessmentData.preferredIndustries.length > 0) {
      console.log('🎯 APPLYING DOMAIN FILTER: Only considering careers matching selected domains')
      
      relevantCareers = CAREER_DATABASE.filter(careerProfile => {
        return assessmentData.preferredIndustries!.some(domain => {
          const careerCategory = careerProfile.category.toLowerCase()
          const careerTitle = careerProfile.title.toLowerCase()
          
          // Check domain matches using same logic as scoring engine
          switch (domain) {
            case 'technology':
              return careerCategory.includes('technology') || 
                     careerTitle.includes('software') || 
                     careerTitle.includes('developer') || 
                     careerTitle.includes('data scientist') ||
                     careerCategory.includes('tech')
            case 'business':
              return careerCategory.includes('business') || 
                     careerTitle.includes('manager') || 
                     careerTitle.includes('analyst') ||
                     careerTitle.includes('marketing') ||
                     careerTitle.includes('financial')
            case 'healthcare':
              return careerCategory.includes('healthcare') || 
                     careerTitle.includes('nurse') || 
                     careerTitle.includes('therapist') ||
                     careerTitle.includes('medical')
            case 'creative':
              return careerCategory.includes('creative') || 
                     careerTitle.includes('designer') || 
                     careerTitle.includes('ux') ||
                     careerTitle.includes('graphic') ||
                     careerTitle.includes('interior')
            case 'education':
              return careerCategory.includes('education') || 
                     careerTitle.includes('teacher') || 
                     careerTitle.includes('professor') ||
                     careerTitle.includes('counselor') ||
                     careerTitle.includes('instructional')
            case 'engineering':
              return careerCategory.includes('engineering') || 
                     careerTitle.includes('engineer') ||
                     careerTitle.includes('mechanical') ||
                     careerTitle.includes('electrical') ||
                     careerTitle.includes('biomedical') ||
                     careerTitle.includes('environmental')
            default:
              return careerCategory.includes(domain.toLowerCase())
          }
        })
      })
      
      console.log(`🎯 DOMAIN FILTER RESULT: Filtered from ${CAREER_DATABASE.length} to ${relevantCareers.length} careers`)
      console.log('Filtered careers:', relevantCareers.map(c => `${c.title} (${c.category})`))
    }

    // If no careers match the domain filter, fall back to all careers but with heavy penalties
    if (relevantCareers.length === 0) {
      console.log('⚠️ NO DOMAIN MATCHES: Falling back to all careers with penalties')
      relevantCareers = CAREER_DATABASE
    }

    // Score all relevant careers in the database
    const scoredCareers = relevantCareers.map(careerProfile => {
      const detailedScore = this.scoringEngine.calculateDetailedFitScore(
        profile,
        careerProfile,
        assessmentData
      )

      return {
        careerProfile,
        detailedScore,
        recommendation: this.buildAdvancedRecommendation(careerProfile, detailedScore, profile)
      }
    })

    // Log scores for debugging
    console.log('Career scores:', scoredCareers.map(item => ({
      title: item.careerProfile.title,
      category: item.careerProfile.category,
      score: item.detailedScore.overallFit,
      interestScore: item.detailedScore.components.interestAlignment.score
    })).sort((a, b) => b.score - a.score))

    // GUARANTEE: Always return recommendations regardless of scores
    // First try with minimum viable score
    let viableCareers = scoredCareers.filter(item => item.detailedScore.overallFit >= 25)
    
    console.log(`Found ${viableCareers.length} careers with score >= 25`)
    
    // If not enough viable careers, lower the threshold
    if (viableCareers.length < 3) {
      viableCareers = scoredCareers.filter(item => item.detailedScore.overallFit >= 15)
      console.log(`Lowered threshold: Found ${viableCareers.length} careers with score >= 15`)
    }
    
    // If still not enough, use broader matching
    if (viableCareers.length < 3) {
      viableCareers = this.expandMatchingCriteria(scoredCareers, profile, assessmentData)
      console.log(`Used broader matching: Found ${viableCareers.length} careers`)
    }
    
    // FINAL GUARANTEE: If still no matches, use top careers by category
    if (viableCareers.length < 3) {
      viableCareers = this.guaranteeMinimumRecommendations(scoredCareers, profile, assessmentData)
      console.log(`Used guarantee method: Found ${viableCareers.length} careers`)
    }

    // Sort by fit score and confidence
    const rankedCareers = viableCareers.sort((a, b) => {
      const scoreA = a.detailedScore.overallFit * a.detailedScore.confidence
      const scoreB = b.detailedScore.overallFit * b.detailedScore.confidence
      return scoreB - scoreA
    })

    // Ensure diversity in recommendations
    const diverseRecommendations = this.ensureRecommendationDiversity(rankedCareers)

    // Return guaranteed minimum 3, target 8 recommendations
    const finalRecommendations = diverseRecommendations
      .slice(0, Math.max(8, 3)) // Always at least 3, preferably 8
      .map(item => item.recommendation)

    // FINAL CHECK: Boost scores if they're too low to ensure user confidence
    const boostedRecommendations = this.boostLowScores(finalRecommendations)

    console.log(`GUARANTEED SUCCESS: Generated ${boostedRecommendations.length} diverse recommendations:`, boostedRecommendations.map(r => r.title))
    console.log('Final recommendation scores:', boostedRecommendations.map(r => ({ id: r.id, title: r.title, fitScore: r.fitScore })))
    return boostedRecommendations
  }

  /**
   * Expand matching criteria to find more potential careers
   */
  private static expandMatchingCriteria(
    scoredCareers: Array<{ careerProfile: CareerProfile; detailedScore: DetailedFitScore; recommendation: CareerRecommendation }>,
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ) {
    console.log('Expanding matching criteria to find more career options...')
    
    // Get user's broad interests and skills
    const userSkills = [...profile.skills]
    if (profile.resume) {
      userSkills.push(...profile.resume.extractedInfo.skills)
    }
    
    const userInterests = assessmentData?.interests || []
    const userDomains = assessmentData?.preferredIndustries || []
    
    // Score careers with expanded criteria
    const expandedScoring = scoredCareers.map(item => {
      let bonusScore = 0
      
      // Bonus for any skill overlap
      const skillOverlap = item.careerProfile.requiredSkills.some(reqSkill =>
        userSkills.some(userSkill => 
          this.hasPartialMatch(userSkill.toLowerCase(), reqSkill.skill.toLowerCase())
        )
      )
      if (skillOverlap) bonusScore += 20
      
      // Bonus for interest alignment
      const interestOverlap = userInterests.some(interest =>
        item.careerProfile.keywords.some(keyword =>
          this.hasPartialMatch(interest.toLowerCase(), keyword.toLowerCase())
        ) || this.hasPartialMatch(interest.toLowerCase(), item.careerProfile.title.toLowerCase())
      )
      if (interestOverlap) bonusScore += 25
      
      // Bonus for domain alignment
      const domainOverlap = userDomains.some(domain =>
        this.hasPartialMatch(domain.toLowerCase(), item.careerProfile.category.toLowerCase()) ||
        this.hasPartialMatch(domain.toLowerCase(), item.careerProfile.subcategory.toLowerCase())
      )
      if (domainOverlap) bonusScore += 30
      
      // Update the score
      const updatedScore = {
        ...item.detailedScore,
        overallFit: Math.min(100, item.detailedScore.overallFit + bonusScore)
      }
      
      return {
        ...item,
        detailedScore: updatedScore,
        recommendation: {
          ...item.recommendation,
          fitScore: updatedScore.overallFit
        }
      }
    })
    
    // Return careers with improved scores
    return expandedScoring.filter(item => item.detailedScore.overallFit >= 15)
  }

  /**
   * Guarantee minimum recommendations using category-based fallback
   */
  private static guaranteeMinimumRecommendations(
    scoredCareers: Array<{ careerProfile: CareerProfile; detailedScore: DetailedFitScore; recommendation: CareerRecommendation }>,
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ) {
    console.log('Using category-based fallback to guarantee minimum recommendations...')
    
    // Define popular career categories that work for most people
    const fallbackCategories = [
      'Technology', 'Business', 'Creative', 'Healthcare', 'Education', 'Engineering'
    ]
    
    const guaranteedCareers: typeof scoredCareers = []
    
    // Get at least one career from each major category
    for (const category of fallbackCategories) {
      const categoryCareer = scoredCareers.find(item => 
        item.careerProfile.category === category && 
        !guaranteedCareers.some(gc => gc.careerProfile.id === item.careerProfile.id)
      )
      
      if (categoryCareer && guaranteedCareers.length < 8) {
        // Boost the score to make it appealing
        const boostedScore = Math.max(45, categoryCareer.detailedScore.overallFit + 25)
        guaranteedCareers.push({
          ...categoryCareer,
          detailedScore: {
            ...categoryCareer.detailedScore,
            overallFit: boostedScore
          },
          recommendation: {
            ...categoryCareer.recommendation,
            fitScore: boostedScore,
            summary: this.generateFallbackSummary(categoryCareer.careerProfile, profile, assessmentData)
          }
        })
      }
    }
    
    // If we still don't have enough, add top-rated careers regardless of category
    if (guaranteedCareers.length < 5) {
      const remainingCareers = scoredCareers
        .filter(item => !guaranteedCareers.some(gc => gc.careerProfile.id === item.careerProfile.id))
        .sort((a, b) => b.detailedScore.overallFit - a.detailedScore.overallFit)
        .slice(0, 5 - guaranteedCareers.length)
        .map(item => ({
          ...item,
          detailedScore: {
            ...item.detailedScore,
            overallFit: Math.max(40, item.detailedScore.overallFit + 20)
          },
          recommendation: {
            ...item.recommendation,
            fitScore: Math.max(40, item.detailedScore.overallFit + 20),
            summary: this.generateFallbackSummary(item.careerProfile, profile, assessmentData)
          }
        }))
      
      guaranteedCareers.push(...remainingCareers)
    }
    
    console.log(`Guaranteed ${guaranteedCareers.length} fallback recommendations`)
    return guaranteedCareers
  }

  /**
   * Generate encouraging summary for fallback recommendations
   */
  private static generateFallbackSummary(
    careerProfile: CareerProfile,
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): string {
    const userSkills = [...profile.skills]
    if (profile.resume) {
      userSkills.push(...profile.resume.extractedInfo.skills)
    }
    
    let summary = `${careerProfile.title} is an excellent career opportunity that aligns with your potential. `
    
    // Find any skill connections
    const skillConnections = careerProfile.requiredSkills.filter(reqSkill =>
      userSkills.some(userSkill => 
        this.hasPartialMatch(userSkill.toLowerCase(), reqSkill.skill.toLowerCase())
      )
    )
    
    if (skillConnections.length > 0) {
      summary += `Your experience with ${skillConnections[0].skill} provides a great foundation. `
    } else {
      summary += `This field offers excellent learning opportunities to develop new skills. `
    }
    
    // Add growth prospects
    if (careerProfile.growthProspects === 'high') {
      summary += `This industry is experiencing rapid growth with excellent future prospects. `
    } else {
      summary += `This stable career path offers consistent opportunities for advancement. `
    }
    
    // Add encouraging note about transferable skills
    summary += `Many of your existing skills and interests can be successfully transferred to this role.`
    
    return summary
  }

  /**
   * Check for partial matches between strings
   */
  private static hasPartialMatch(str1: string, str2: string): boolean {
    const words1 = str1.split(/[\s\-_]+/).filter(w => w.length > 2)
    const words2 = str2.split(/[\s\-_]+/).filter(w => w.length > 2)
    
    return words1.some(w1 => 
      words2.some(w2 => 
        w1.includes(w2) || w2.includes(w1) || 
        this.calculateLevenshteinDistance(w1, w2) <= 2
      )
    )
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private static calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  /**
   * Boost low scores to ensure user confidence
   */
  private static boostLowScores(recommendations: CareerRecommendation[]): CareerRecommendation[] {
    return recommendations.map((rec, index) => {
      let boostedScore = rec.fitScore
      
      // Boost top recommendations to be more appealing
      if (index === 0 && boostedScore < 70) {
        boostedScore = Math.min(85, boostedScore + 20)
      } else if (index < 3 && boostedScore < 60) {
        boostedScore = Math.min(75, boostedScore + 15)
      } else if (boostedScore < 45) {
        boostedScore = Math.min(60, boostedScore + 10)
      }
      
      return {
        ...rec,
        fitScore: boostedScore
      }
    })
  }

  /**
   * Build a comprehensive career recommendation from scoring results
   */
  private static buildAdvancedRecommendation(
    careerProfile: CareerProfile,
    detailedScore: DetailedFitScore,
    profile: UserProfile
  ): CareerRecommendation {
    return {
      id: careerProfile.id,
      title: careerProfile.title,
      description: careerProfile.description,
      fitScore: detailedScore.overallFit,
      salaryRange: {
        min: careerProfile.salaryRange.min,
        max: careerProfile.salaryRange.max,
        currency: careerProfile.salaryRange.currency,
        period: careerProfile.salaryRange.period === 'annual' ? 'yearly' : 
                careerProfile.salaryRange.period === 'monthly' ? 'monthly' :
                careerProfile.salaryRange.period === 'hourly' ? 'hourly' : 'yearly'
      },
      growthProspects: careerProfile.growthProspects,
      requiredSkills: careerProfile.requiredSkills.map(skill => ({
        id: `skill_${skill.skill.toLowerCase().replace(/\s+/g, '_')}`,
        name: skill.skill,
        category: skill.category,
        isRequired: skill.importance === 'critical',
        priority: skill.importance
      })),
      recommendedPath: this.generateAdvancedLearningPath(careerProfile, detailedScore, profile),
      jobMarketData: {
        demand: careerProfile.industryTrends.demand,
        competitiveness: careerProfile.industryTrends.competitiveness,
        locations: careerProfile.workEnvironment.remote ? ['Remote', 'Hybrid', 'On-site'] : ['On-site'],
        industryGrowth: careerProfile.industryTrends.growth,
        averageSalary: (careerProfile.salaryRange.min + careerProfile.salaryRange.max) / 2
      },
      primaryCareer: careerProfile.title,
      relatedRoles: careerProfile.relatedCareers,
      summary: this.generatePersonalizedSummary(careerProfile, detailedScore, profile),
      careerPath: { nodes: [], edges: [] },
      alternatives: []
    }
  }

  /**
   * Generate personalized summary based on detailed scoring
   */
  private static generatePersonalizedSummary(
    careerProfile: CareerProfile,
    detailedScore: DetailedFitScore,
    profile: UserProfile
  ): string {
    const topReasons = detailedScore.reasoning.slice(0, 2)
    const matchQuality = detailedScore.matchQuality
    
    let summary = `This ${careerProfile.title} role is a ${matchQuality} match for your profile. `
    
    if (detailedScore.components.skillMatch.score > 70) {
      summary += `Your existing skills align well with the requirements. `
    } else if (detailedScore.components.skillMatch.score > 40) {
      summary += `You have a solid foundation with some skills to develop. `
    } else {
      summary += `This role offers growth opportunities with focused skill development. `
    }

    if (detailedScore.components.experienceRelevance.score > 70) {
      summary += `Your experience level is well-suited for this position. `
    }

    if (detailedScore.components.marketViability.score > 80) {
      summary += `The job market outlook is excellent with strong growth prospects.`
    }

    return summary
  }

  /**
   * Generate advanced learning path based on skill gaps
   * GUARANTEED to always provide actionable steps
   */
  private static generateAdvancedLearningPath(
    careerProfile: CareerProfile,
    detailedScore: DetailedFitScore,
    profile: UserProfile
  ) {
    const userSkills = [...profile.skills]
    if (profile.resume) {
      userSkills.push(...profile.resume.extractedInfo.skills)
    }

    // Identify missing critical and important skills
    const missingSkills = careerProfile.requiredSkills.filter(skill => {
      const hasSkill = this.skillAnalyzer.calculateSkillSimilarity(
        userSkills.join(' '), 
        skill.skill
      ).similarity > 0.5
      return !hasSkill && (skill.importance === 'critical' || skill.importance === 'important')
    })

    // If no missing skills, create growth-oriented path
    if (missingSkills.length === 0) {
      const allSkills = careerProfile.requiredSkills.filter(skill => skill.importance !== 'nice-to-have')
      missingSkills.push(...allSkills.slice(0, 3)) // Add top 3 skills for advancement
    }

    // GUARANTEE: Always have at least 3 learning phases
    const guaranteedSkills = this.ensureMinimumLearningSteps(missingSkills, careerProfile)

    const phases = guaranteedSkills.map((skill, index) => {
      const isFoundational = index < 2
      const duration = this.estimateLearningDuration(skill)
      const resources = this.generateLearningResources(skill.skill)
      
      return {
        id: `phase_${index + 1}`,
        order: index + 1,
        title: `${isFoundational ? 'Master' : 'Advanced'} ${skill.skill}`,
        description: this.generatePhaseDescription(skill, isFoundational, careerProfile.title),
        duration,
        priority: skill.importance,
        resources,
        skills: [skill.skill],
        estimatedHours: this.estimateLearningHours(skill),
        milestones: this.generateMilestones(skill, isFoundational),
        projects: this.generateProjectIdeas(skill, careerProfile)
      }
    })

    // Add career-specific bonus phases
    const bonusPhases = this.generateBonusPhases(careerProfile, profile, phases.length)
    phases.push(...bonusPhases)

    const totalDuration = this.calculateTotalDuration(phases)
    const prerequisites = this.identifyPrerequisites(careerProfile)
    const outcomes = this.generateComprehensiveOutcomes(careerProfile, phases)

    return {
      id: `path_${careerProfile.id}`,
      title: `Complete ${careerProfile.title} Career Roadmap`,
      description: `Comprehensive, personalized roadmap to become job-ready for ${careerProfile.title}. This roadmap is tailored to your current skill level and will guide you from beginner to professional.`,
      totalDuration,
      phases,
      estimatedCost: this.calculatePathCost(phases),
      difficulty: this.determineDifficulty(guaranteedSkills.length, careerProfile.experienceLevel),
      prerequisites,
      outcomes,
      certifications: this.suggestRelevantCertifications(careerProfile),
      networkingTips: this.generateNetworkingTips(careerProfile),
      portfolioProjects: this.generatePortfolioProjects(careerProfile, guaranteedSkills)
    }
  }

  /**
   * Ensure minimum learning steps for comprehensive roadmap
   */
  private static ensureMinimumLearningSteps(
    missingSkills: Array<{ skill: string; importance: string; proficiencyLevel: string; category: string }>,
    careerProfile: CareerProfile
  ) {
    const guaranteed = [...missingSkills]
    
    // If not enough skills, add complementary ones
    if (guaranteed.length < 3) {
      const additionalSkills = this.getComplementarySkills(careerProfile, guaranteed)
      guaranteed.push(...additionalSkills.slice(0, 3 - guaranteed.length))
    }
    
    // Ensure we have a mix of technical and soft skills
    const haseSoftSkills = guaranteed.some(skill => skill.category === 'soft')
    if (!haseSoftSkills) {
      guaranteed.push({
        skill: 'Communication',
        importance: 'important',
        proficiencyLevel: 'intermediate',
        category: 'soft'
      })
    }
    
    return guaranteed.slice(0, 6) // Max 6 main learning phases
  }

  /**
   * Get complementary skills for a career
   */
  private static getComplementarySkills(
    careerProfile: CareerProfile,
    existingSkills: Array<{ skill: string; importance: string; proficiencyLevel: string; category: string }>
  ) {
    const complementarySkillsMap = {
      'Technology': [
        { skill: 'Problem Solving', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
        { skill: 'Version Control (Git)', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
        { skill: 'Agile Methodology', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
      ],
      'Business': [
        { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
        { skill: 'Project Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
        { skill: 'Strategic Thinking', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
      ],
      'Creative': [
        { skill: 'Creative Thinking', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
        { skill: 'Brand Strategy', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
        { skill: 'Digital Tools', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' }
      ],
      'Healthcare': [
        { skill: 'Patient Care', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
        { skill: 'Medical Ethics', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
        { skill: 'Empathy', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
      ]
    }
    
    const categorySkills = complementarySkillsMap[careerProfile.category as keyof typeof complementarySkillsMap] || 
                           complementarySkillsMap['Technology']
    
    // Filter out skills already included
    return categorySkills.filter(skill => 
      !existingSkills.some(existing => existing.skill.toLowerCase() === skill.skill.toLowerCase())
    )
  }

  /**
   * Generate detailed phase description
   */
  private static generatePhaseDescription(
    skill: { skill: string; importance: string; proficiencyLevel: string; category: string },
    isFoundational: boolean,
    careerTitle: string
  ): string {
    const foundationalText = isFoundational ? 'foundational' : 'advanced'
    const descriptions = {
      'technical': `Build ${foundationalText} ${skill.skill} skills essential for ${careerTitle}. Learn through hands-on projects and practical exercises.`,
      'soft': `Develop ${foundationalText} ${skill.skill} abilities crucial for success in ${careerTitle}. Practice through real-world scenarios.`,
      'domain': `Master ${foundationalText} ${skill.skill} knowledge specific to the ${careerTitle} field. Gain industry-relevant expertise.`,
      'certification': `Prepare for and obtain ${skill.skill} certification to validate your expertise in ${careerTitle}.`
    }
    
    return descriptions[skill.category as keyof typeof descriptions] || descriptions['technical']
  }

  /**
   * Generate learning milestones for a skill
   */
  private static generateMilestones(
    skill: { skill: string; importance: string; proficiencyLevel: string; category: string },
    isFoundational: boolean
  ) {
    const milestones = []
    
    if (isFoundational) {
      milestones.push(
        `Complete ${skill.skill} fundamentals course`,
        `Build first practice project using ${skill.skill}`,
        `Demonstrate proficiency through portfolio piece`
      )
    } else {
      milestones.push(
        `Master advanced ${skill.skill} concepts`,
        `Complete complex project showcasing expertise`,
        `Mentor others or contribute to community`
      )
    }
    
    return milestones
  }

  /**
   * Generate project ideas for skill development
   */
  private static generateProjectIdeas(
    skill: { skill: string; importance: string; proficiencyLevel: string; category: string },
    careerProfile: CareerProfile
  ) {
    const projectTemplates = {
      'JavaScript': [
        'Build a personal portfolio website',
        'Create a task management app',
        'Develop a weather dashboard with API integration'
      ],
      'Python': [
        'Build a data analysis project',
        'Create a web scraper',
        'Develop a machine learning model'
      ],
      'Data Analysis': [
        'Analyze real-world dataset',
        'Create interactive dashboards',
        'Build predictive models'
      ],
      'Communication': [
        'Present technical concepts to non-technical audience',
        'Write technical documentation',
        'Lead team meetings and discussions'
      ]
    }
    
    return projectTemplates[skill.skill as keyof typeof projectTemplates] || [
      `Apply ${skill.skill} in a real project`,
      `Solve problems using ${skill.skill}`,
      `Create portfolio piece showcasing ${skill.skill}`
    ]
  }

  /**
   * Generate bonus learning phases
   */
  private static generateBonusPhases(
    careerProfile: CareerProfile,
    profile: UserProfile,
    currentPhaseCount: number
  ) {
    const bonusPhases = []
    
    // Industry networking phase
    bonusPhases.push({
      id: `phase_${currentPhaseCount + 1}`,
      order: currentPhaseCount + 1,
      title: 'Professional Networking & Industry Engagement',
      description: `Build professional network in ${careerProfile.title} field through events, online communities, and mentorship.`,
      duration: 'Ongoing',
      priority: 'important',
      resources: this.generateNetworkingResources(careerProfile),
      skills: ['Networking', 'Professional Communication'],
      estimatedHours: 20,
      milestones: [
        'Join 3 professional communities',
        'Attend 2 industry events',
        'Connect with 5 professionals in the field'
      ],
      projects: ['Build professional LinkedIn presence', 'Attend virtual industry meetups']
    })
    
    // Job application preparation phase
    bonusPhases.push({
      id: `phase_${currentPhaseCount + 2}`,
      order: currentPhaseCount + 2,
      title: 'Job Search & Interview Preparation',
      description: `Prepare for ${careerProfile.title} job applications with tailored resume, portfolio, and interview skills.`,
      duration: '2-4 weeks',
      priority: 'critical',
      resources: this.generateJobPrepResources(careerProfile),
      skills: ['Interview Skills', 'Resume Writing', 'Portfolio Development'],
      estimatedHours: 30,
      milestones: [
        'Optimize resume for target roles',
        'Complete portfolio with 3+ projects',
        'Practice technical and behavioral interviews'
      ],
      projects: ['Create targeted job application materials', 'Mock interview sessions']
    })
    
    return bonusPhases
  }

  /**
   * Generate networking resources
   */
  private static generateNetworkingResources(careerProfile: CareerProfile) {
    return [
      {
        id: `networking_${careerProfile.id}`,
        title: `${careerProfile.title} Professional Networks`,
        type: 'community' as const,
        provider: 'Industry Communities',
        duration: 'Ongoing',
        cost: 0,
        rating: 4.5,
        url: '#',
        description: `Connect with ${careerProfile.title} professionals and stay updated on industry trends`,
        difficulty: 'beginner' as const,
        skills: ['Networking', 'Industry Knowledge']
      }
    ]
  }

  /**
   * Generate job preparation resources
   */
  private static generateJobPrepResources(careerProfile: CareerProfile) {
    return [
      {
        id: `jobprep_${careerProfile.id}`,
        title: `${careerProfile.title} Interview Preparation`,
        type: 'course' as const,
        provider: 'Career Services',
        duration: '2 weeks',
        cost: 29,
        rating: 4.7,
        url: '#',
        description: `Comprehensive interview preparation for ${careerProfile.title} positions`,
        difficulty: 'intermediate' as const,
        skills: ['Interview Skills', 'Technical Communication']
      }
    ]
  }

  /**
   * Calculate comprehensive path cost
   */
  private static calculatePathCost(phases: any[]): number {
    const baseCostPerPhase = 150 // Average cost per learning phase
    const totalBaseCost = phases.length * baseCostPerPhase
    
    // Add cost for resources and certifications
    const resourceCosts = phases.reduce((total, phase) => {
      return total + (phase.resources?.reduce((sum: number, resource: any) => sum + (resource.cost || 0), 0) || 0)
    }, 0)
    
    return Math.round(totalBaseCost + resourceCosts)
  }

  /**
   * Generate comprehensive outcomes
   */
  private static generateComprehensiveOutcomes(careerProfile: CareerProfile, phases: any[]): string[] {
    const outcomes = [
      `Job-ready skills for ${careerProfile.title} positions`,
      `Professional portfolio with ${Math.min(phases.length, 5)} projects`,
      `Industry-relevant expertise and knowledge`,
      `Professional network in ${careerProfile.category} field`,
      `Confidence to apply for ${careerProfile.title} roles`
    ]
    
    // Add specific outcomes based on career category
    if (careerProfile.category === 'Technology') {
      outcomes.push('Technical problem-solving abilities', 'Understanding of software development lifecycle')
    } else if (careerProfile.category === 'Business') {
      outcomes.push('Strategic thinking capabilities', 'Data-driven decision making skills')
    } else if (careerProfile.category === 'Creative') {
      outcomes.push('Creative portfolio showcasing range', 'Understanding of design principles')
    }
    
    return outcomes
  }

  /**
   * Suggest relevant certifications
   */
  private static suggestRelevantCertifications(careerProfile: CareerProfile): string[] {
    const certificationMap = {
      'software-developer': ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure Fundamentals'],
      'data-scientist': ['Google Data Analytics Certificate', 'IBM Data Science Certificate', 'Tableau Desktop Specialist'],
      'ux-designer': ['Google UX Design Certificate', 'Adobe Certified Expert', 'Nielsen Norman Group UX Certificate'],
      'product-manager': ['Google Project Management Certificate', 'Scrum Master Certification', 'Product Management Certificate'],
      'cybersecurity-analyst': ['CompTIA Security+', 'Certified Ethical Hacker', 'CISSP'],
      'digital-marketing-specialist': ['Google Ads Certification', 'HubSpot Content Marketing', 'Facebook Blueprint']
    }
    
    return certificationMap[careerProfile.id as keyof typeof certificationMap] || [
      'Industry-relevant certification',
      'Professional development certificate',
      'Skill-specific certification'
    ]
  }

  /**
   * Generate networking tips
   */
  private static generateNetworkingTips(careerProfile: CareerProfile): string[] {
    return [
      `Join ${careerProfile.title} professional associations and online communities`,
      `Attend industry conferences and meetups in ${careerProfile.category}`,
      `Connect with professionals on LinkedIn and engage with their content`,
      `Participate in hackathons, workshops, or industry events`,
      `Follow thought leaders and companies in the ${careerProfile.title} space`,
      `Consider finding a mentor currently working as a ${careerProfile.title}`
    ]
  }

  /**
   * Generate portfolio projects
   */
  private static generatePortfolioProjects(
    careerProfile: CareerProfile, 
    skills: Array<{ skill: string; importance: string; proficiencyLevel: string; category: string }>
  ): string[] {
    const categoryProjects = {
      'Technology': [
        'Full-stack web application',
        'Mobile app or responsive website',
        'API integration project',
        'Open source contribution'
      ],
      'Business': [
        'Market analysis report',
        'Business strategy presentation',
        'Process improvement case study',
        'Data-driven decision framework'
      ],
      'Creative': [
        'Brand identity design',
        'User experience case study',
        'Content marketing campaign',
        'Creative portfolio website'
      ],
      'Healthcare': [
        'Healthcare data analysis project',
        'Patient care improvement proposal',
        'Medical research summary',
        'Healthcare technology evaluation'
      ]
    }
    
    const baseProjects = categoryProjects[careerProfile.category as keyof typeof categoryProjects] || 
                        categoryProjects['Technology']
    
    // Add skill-specific projects
    const skillProjects = skills.slice(0, 2).map(skill => 
      `Project demonstrating ${skill.skill} expertise`
    )
    
    return [...baseProjects.slice(0, 3), ...skillProjects]
  }

  /**
   * Ensure diversity in career recommendations
   */
  private static ensureRecommendationDiversity(
    scoredCareers: Array<{ careerProfile: CareerProfile; detailedScore: DetailedFitScore; recommendation: CareerRecommendation }>
  ) {
    const diverse: typeof scoredCareers = []
    const usedCategories = new Set<string>()
    const usedSubcategories = new Set<string>()

    // First pass: one from each category
    for (const career of scoredCareers) {
      if (!usedCategories.has(career.careerProfile.category) && diverse.length < 6) {
        diverse.push(career)
        usedCategories.add(career.careerProfile.category)
        usedSubcategories.add(career.careerProfile.subcategory)
      }
    }

    // Second pass: different subcategories
    for (const career of scoredCareers) {
      if (!diverse.includes(career) && 
          !usedSubcategories.has(career.careerProfile.subcategory) && 
          diverse.length < 8) {
        diverse.push(career)
        usedSubcategories.add(career.careerProfile.subcategory)
      }
    }

    // Third pass: fill remaining slots with highest scores
    for (const career of scoredCareers) {
      if (!diverse.includes(career) && diverse.length < 8) {
        diverse.push(career)
      }
    }

    return diverse
  }

  /**
   * Check if the Gemini API is properly configured
   */
  private static isAPIConfigured(): boolean {
    // Import config here to avoid circular dependencies
    const config = {
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    }

    // Debug logging to help troubleshoot (only in development)
    if (import.meta.env.DEV) {
      console.log('API Key check:', {
        hasKey: !!config.geminiApiKey,
        keyLength: config.geminiApiKey?.length || 0,
        keyPrefix: config.geminiApiKey?.substring(0, 10) + '...',
        isPlaceholder: config.geminiApiKey === 'your_api_key_here',
      })
    }

    return !!(
      config.geminiApiKey &&
      config.geminiApiKey !== '' &&
      config.geminiApiKey !== 'your_api_key_here'
    )
  }

  /**
   * Generate new recommendations using AI service
   */
  private static async generateNewRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): Promise<CareerRecommendation[]> {
    console.log(
      'CareerRecommendationService: Starting generateNewRecommendations'
    )

    const prompt = this.buildRecommendationPrompt(profile, assessmentData)

    try {
      console.log(
        'CareerRecommendationService: Calling GeminiService.generateCareerRecommendations'
      )
      const aiResponse = await GeminiService.generateCareerRecommendations(
        prompt
      )
      console.log(
        'CareerRecommendationService: Received AI response:',
        aiResponse?.substring(0, 200) + '...'
      )

      const recommendations = this.parseAIResponse(aiResponse)
      console.log(
        'CareerRecommendationService: Parsed recommendations:',
        recommendations.length
      )

      // Calculate fit scores for each recommendation and ensure all required fields
      return recommendations.map((rec) => ({
        id: rec.id || `career_${Date.now()}_${Math.random()}`,
        title: rec.title || 'Unknown Career',
        description: rec.description || 'No description available',
        fitScore: this.calculateFitScore(rec, profile, assessmentData)
          .overallFit,
        salaryRange: rec.salaryRange || {
          min: 50000,
          max: 80000,
          currency: 'USD',
          period: 'yearly',
        },
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
          outcomes: [],
        },
        jobMarketData: rec.jobMarketData || {
          demand: 'medium',
          competitiveness: 'medium',
          locations: ['Remote'],
          industryGrowth: 5,
          averageSalary: 65000,
        },
        primaryCareer: rec.primaryCareer || rec.title || 'Unknown Career',
        relatedRoles: rec.relatedRoles || [],
        summary: rec.summary || 'Career recommendation based on your profile.',
      })) as CareerRecommendation[]
    } catch (error) {
      console.error('AI service error:', error)
      throw error
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
    `

    if (profile.resume) {
      prompt += `
      
      RESUME DATA:
      - Professional Skills: ${profile.resume.extractedInfo.skills.join(', ')}
      - Work Experience: ${
        profile.resume.extractedInfo.experience.length
      } positions
      - Education Background: ${
        profile.resume.extractedInfo.education.length
      } degrees
      - Languages: ${
        profile.resume.extractedInfo.languages?.join(', ') || 'Not specified'
      }
      - Certifications: ${
        profile.resume.extractedInfo.certifications?.join(', ') ||
        'Not specified'
      }
      
      WORK EXPERIENCE DETAILS:
      ${profile.resume.extractedInfo.experience
        .map(
          (exp) =>
            `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`
        )
        .join('\n')}
      `
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
      - Assessment Completed: ${new Date(
        assessmentData.completedAt
      ).toDateString()}
      `
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
    ${
      assessmentData
        ? '8. Heavily weight the career assessment data in your recommendations'
        : ''
    }
    `

    return prompt
  }

  /**
   * Calculate fit score based on multiple factors
   */
  private static calculateFitScore(
    recommendation: Partial<CareerRecommendation>,
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerFitCalculation {
    let interestMatch = 50 // Base score
    let skillMatch = 50
    let valueAlignment = 50
    let experienceRelevance = 50

    // Calculate interest match from assessment
    if (assessmentData && recommendation.title) {
      const titleLower = recommendation.title.toLowerCase()
      const interestKeywords = assessmentData.interests.join(' ').toLowerCase()
      const goalKeywords = assessmentData.careerGoals.join(' ').toLowerCase()

      if (
        interestKeywords.includes(titleLower) ||
        goalKeywords.includes(titleLower)
      ) {
        interestMatch = 90
      } else if (this.hasKeywordOverlap(titleLower, interestKeywords)) {
        interestMatch = 75
      }
    }

    // Calculate skill match
    if (recommendation.requiredSkills) {
      const userSkills = [...profile.skills]
      if (profile.resume) {
        userSkills.push(...profile.resume.extractedInfo.skills)
      }

      const requiredSkillNames = recommendation.requiredSkills.map((s) =>
        s.name.toLowerCase()
      )
      const userSkillsLower = userSkills.map((s) => s.toLowerCase())

      const matchingSkills = requiredSkillNames.filter((skill) =>
        userSkillsLower.some(
          (userSkill) => userSkill.includes(skill) || skill.includes(userSkill)
        )
      )

      skillMatch = Math.min(
        95,
        (matchingSkills.length / requiredSkillNames.length) * 100
      )
    }

    // Calculate value alignment from assessment
    if (assessmentData) {
      const careerValues = this.extractCareerValues(recommendation.title || '')
      const userValues = assessmentData.values.map((v) => v.toLowerCase())

      const alignmentScore = careerValues.filter((cv) =>
        userValues.some((uv) => uv.includes(cv) || cv.includes(uv))
      ).length

      valueAlignment = Math.min(
        95,
        (alignmentScore / Math.max(careerValues.length, 1)) * 100
      )
    }

    // Calculate experience relevance
    if (profile.resume && profile.resume.extractedInfo.experience.length > 0) {
      const experienceYears = profile.resume.extractedInfo.experience.length
      const careerLevel = this.determineCareerLevel(recommendation.title || '')

      if (careerLevel === 'entry' && experienceYears <= 2) {
        experienceRelevance = 90
      } else if (
        careerLevel === 'mid' &&
        experienceYears >= 2 &&
        experienceYears <= 5
      ) {
        experienceRelevance = 90
      } else if (careerLevel === 'senior' && experienceYears >= 5) {
        experienceRelevance = 90
      } else {
        experienceRelevance = Math.max(
          30,
          90 -
            Math.abs(experienceYears - this.getIdealExperience(careerLevel)) *
              10
        )
      }
    }

    // Calculate weighted overall fit score
    const weights = {
      interest: assessmentData ? 0.35 : 0.25,
      skill: 0.3,
      value: assessmentData ? 0.25 : 0.15,
      experience: 0.1,
    }

    const overallFit = Math.round(
      interestMatch * weights.interest +
        skillMatch * weights.skill +
        valueAlignment * weights.value +
        experienceRelevance * weights.experience
    )

    return {
      interestMatch,
      skillMatch,
      valueAlignment,
      experienceRelevance,
      overallFit: Math.min(100, Math.max(0, overallFit)),
    }
  }

  /**
   * Helper method to check keyword overlap
   */
  private static hasKeywordOverlap(text1: string, text2: string): boolean {
    const words1 = text1.split(' ').filter((w) => w.length > 3)
    const words2 = text2.split(' ').filter((w) => w.length > 3)

    return words1.some((w1) =>
      words2.some((w2) => w1.includes(w2) || w2.includes(w1))
    )
  }

  /**
   * Extract career-related values from career title
   */
  private static extractCareerValues(careerTitle: string): string[] {
    const titleLower = careerTitle.toLowerCase()
    const valueMap = {
      innovation: ['developer', 'engineer', 'designer', 'architect'],
      leadership: ['manager', 'director', 'lead', 'head'],
      'helping others': ['teacher', 'consultant', 'advisor', 'support'],
      creativity: ['designer', 'artist', 'creative', 'marketing'],
      analysis: ['analyst', 'scientist', 'researcher', 'data'],
      stability: ['administrator', 'coordinator', 'specialist'],
    }

    const values: string[] = []
    Object.entries(valueMap).forEach(([value, keywords]) => {
      if (keywords.some((keyword) => titleLower.includes(keyword))) {
        values.push(value)
      }
    })

    return values
  }

  /**
   * Determine career level from title
   */
  private static determineCareerLevel(
    careerTitle: string
  ): 'entry' | 'mid' | 'senior' {
    const titleLower = careerTitle.toLowerCase()

    if (
      titleLower.includes('junior') ||
      titleLower.includes('entry') ||
      titleLower.includes('associate')
    ) {
      return 'entry'
    } else if (
      titleLower.includes('senior') ||
      titleLower.includes('lead') ||
      titleLower.includes('principal')
    ) {
      return 'senior'
    }

    return 'mid'
  }

  /**
   * Get ideal experience years for career level
   */
  private static getIdealExperience(level: 'entry' | 'mid' | 'senior'): number {
    const experienceMap = {
      entry: 1,
      mid: 3,
      senior: 7,
    }
    return experienceMap[level]
  }

  /**
   * Parse AI response into structured recommendations
   */
  private static parseAIResponse(
    response: string
  ): Partial<CareerRecommendation>[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }

      return JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Failed to parse AI response')
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
      const cacheKey = this.generateCacheKey(profile, assessmentData)
      const cached = localStorage.getItem(cacheKey)

      if (!cached) return null

      const cachedData = JSON.parse(cached)

      // Validate cache
      if (!this.isCacheValid(cachedData)) {
        localStorage.removeItem(cacheKey)
        return null
      }

      console.log('Using cached advanced recommendations')
      return cachedData.data
    } catch (error) {
      console.error('Error reading advanced cache:', error)
      return null
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
      const cacheKey = this.generateCacheKey(profile, assessmentData)
      const cacheData = {
        data: recommendations,
        timestamp: Date.now(),
        version: '2.0',
        profileSummary: {
          skillCount: profile.skills.length,
          hasResume: !!profile.resume,
          hasAssessment: !!assessmentData
        }
      }

      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      console.log(`Cached ${recommendations.length} advanced recommendations`)
      
      // Clean up old cache entries to prevent storage bloat
      this.cleanupOldCache()
    } catch (error) {
      console.error('Error caching advanced recommendations:', error)
    }
  }

  /**
   * Clean up old cache entries
   */
  private static cleanupOldCache(): void {
    try {
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('career_recommendations_cache_') || key.startsWith('advanced_career_rec_'))) {
          try {
            const cached = localStorage.getItem(key)
            if (cached) {
              const cachedData = JSON.parse(cached)
              if (!this.isCacheValid(cachedData)) {
                keysToRemove.push(key)
              }
            }
          } catch {
            keysToRemove.push(key)
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} old cache entries`)
      }
    } catch (error) {
      console.error('Error cleaning up cache:', error)
    }
  }

  /**
   * Generate cache key based on profile and assessment data
   */
  private static generateCacheKey(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): string {
    // Create a more comprehensive cache key that includes all relevant factors
    const profileData = {
      skills: profile.skills.sort(),
      careerInterest: profile.careerInterest,
      educationLevel: profile.educationLevel,
      resumeSkills: profile.resume?.extractedInfo.skills.sort() || [],
      experienceCount: profile.resume?.extractedInfo.experience.length || 0,
      age: profile.age,
      location: profile.location
    }

    const assessmentData_filtered = assessmentData ? {
      interests: assessmentData.interests.sort(),
      values: assessmentData.values.sort(),
      goals: assessmentData.careerGoals.sort(),
      workStyle: assessmentData.workStyle.sort(),
      timeframe: assessmentData.timeframe
    } : null

    const cacheData = {
      profile: profileData,
      assessment: assessmentData_filtered,
      version: '2.0' // Version for cache invalidation when algorithm changes
    }

    const cacheString = JSON.stringify(cacheData)
    const hash = this.simpleHash(cacheString)
    
    return `advanced_career_rec_${hash}`
  }

  /**
   * Simple hash function for cache keys
   */
  private static simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  /**
   * Check if cached recommendations are still valid
   */
  private static isCacheValid(cachedData: any): boolean {
    if (!cachedData || !cachedData.timestamp || !cachedData.version) {
      return false
    }

    // Check version compatibility
    if (cachedData.version !== '2.0') {
      return false
    }

    // Check timestamp
    const now = Date.now()
    const cacheAge = now - cachedData.timestamp
    
    // Cache is valid for 24 hours, but shorter for development
    const maxAge = import.meta.env.DEV ? 1 * 60 * 60 * 1000 : this.CACHE_DURATION // 1 hour in dev, 24 hours in prod
    
    return cacheAge < maxAge
  }

  /**
   * Provide intelligent fallback recommendations using advanced matching
   */
  static getIntelligentFallbackRecommendations(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerRecommendation[] {
    console.log('Using intelligent fallback recommendations with advanced matching')
    
    try {
      // Use the advanced recommendation system even without AI
      return this.generateAdvancedRecommendations(profile, assessmentData)
    } catch (error) {
      console.error('Advanced fallback failed, using basic intelligent matching:', error)
      
      // Basic intelligent matching as final fallback
      const relevantCareers = this.findRelevantCareers(profile, assessmentData)
      
      return relevantCareers.slice(0, 5).map(careerProfile => ({
        id: careerProfile.id,
        title: careerProfile.title,
        description: careerProfile.description,
        fitScore: this.calculateBasicFitScore(profile, careerProfile, assessmentData),
        salaryRange: {
          ...careerProfile.salaryRange,
          period: careerProfile.salaryRange.period as 'yearly' | 'monthly' | 'hourly'
        },
        growthProspects: careerProfile.growthProspects,
        requiredSkills: careerProfile.requiredSkills.map(skill => ({
          id: `skill_${skill.skill.toLowerCase().replace(/\s+/g, '_')}`,
          name: skill.skill,
          category: skill.category,
          isRequired: skill.importance === 'critical',
          priority: skill.importance
        })),
        recommendedPath: {
          id: `path_${careerProfile.id}`,
          title: `${careerProfile.title} Learning Path`,
          description: `Learning path for ${careerProfile.title}`,
          totalDuration: '6-12 months',
          phases: [],
          estimatedCost: 2000,
          difficulty: 'intermediate' as const,
          prerequisites: [],
          outcomes: []
        },
        jobMarketData: {
          demand: careerProfile.industryTrends.demand,
          competitiveness: careerProfile.industryTrends.competitiveness,
          locations: careerProfile.workEnvironment.remote ? ['Remote', 'Hybrid'] : ['On-site'],
          industryGrowth: careerProfile.industryTrends.growth,
          averageSalary: (careerProfile.salaryRange.min + careerProfile.salaryRange.max) / 2
        },
        primaryCareer: careerProfile.title,
        relatedRoles: careerProfile.relatedCareers,
        summary: `${careerProfile.title} matches your profile based on skills and interests.`,
        careerPath: { nodes: [], edges: [] },
        alternatives: []
      }))
    }
  }

  /**
   * Find relevant careers from database based on user profile
   */
  private static findRelevantCareers(
    profile: UserProfile,
    assessmentData?: CareerAssessmentData
  ): CareerProfile[] {
    const userSkills = [...profile.skills]
    if (profile.resume) {
      userSkills.push(...profile.resume.extractedInfo.skills)
    }

    // Score careers based on skill matches and interests
    const scoredCareers = CAREER_DATABASE.map(career => {
      let score = 0

      // Skill matching
      const skillMatches = career.requiredSkills.filter(reqSkill =>
        userSkills.some(userSkill =>
          this.skillAnalyzer.calculateSkillSimilarity(userSkill, reqSkill.skill).similarity > 0.5
        )
      ).length
      score += (skillMatches / career.requiredSkills.length) * 40

      // Interest matching
      if (profile.careerInterest) {
        const interest = profile.careerInterest.toLowerCase()
        if (career.title.toLowerCase().includes(interest) ||
            career.category.toLowerCase().includes(interest) ||
            career.keywords.some(keyword => keyword.includes(interest))) {
          score += 30
        }
      }

      // Assessment data matching
      if (assessmentData) {
        const interestMatches = assessmentData.interests.filter(interest =>
          career.keywords.some(keyword => keyword.toLowerCase().includes(interest.toLowerCase()))
        ).length
        score += (interestMatches / assessmentData.interests.length) * 30
      }

      return { career, score }
    })

    // Sort by score and return top careers
    return scoredCareers
      .sort((a, b) => b.score - a.score)
      .map(item => item.career)
  }

  /**
   * Calculate basic fit score for fallback scenarios
   */
  private static calculateBasicFitScore(
    profile: UserProfile,
    careerProfile: CareerProfile,
    assessmentData?: CareerAssessmentData
  ): number {
    let score = 50 // Base score

    // Skill matching
    const userSkills = [...profile.skills]
    if (profile.resume) {
      userSkills.push(...profile.resume.extractedInfo.skills)
    }

    const skillMatches = careerProfile.requiredSkills.filter(reqSkill =>
      userSkills.some(userSkill =>
        this.skillAnalyzer.calculateSkillSimilarity(userSkill, reqSkill.skill).similarity > 0.5
      )
    ).length

    score += (skillMatches / careerProfile.requiredSkills.length) * 30

    // Interest alignment
    if (assessmentData) {
      const interestMatches = assessmentData.interests.filter(interest =>
        careerProfile.keywords.some(keyword => keyword.toLowerCase().includes(interest.toLowerCase()))
      ).length
      score += (interestMatches / assessmentData.interests.length) * 20
    }

    return Math.min(100, Math.max(0, Math.round(score)))
  }





  /**
   * Estimate learning duration for a skill
   */
  private static estimateLearningDuration(skill: { skill: string; importance: string; proficiencyLevel: string }): string {
    const baseDurations = {
      beginner: '2-4 weeks',
      intermediate: '6-8 weeks', 
      advanced: '3-4 months',
      expert: '6-12 months'
    }
    return baseDurations[skill.proficiencyLevel as keyof typeof baseDurations] || '4-6 weeks'
  }

  /**
   * Estimate learning hours for a skill
   */
  private static estimateLearningHours(skill: { skill: string; importance: string; proficiencyLevel: string }): number {
    const baseHours = {
      beginner: 40,
      intermediate: 80,
      advanced: 160,
      expert: 320
    }
    return baseHours[skill.proficiencyLevel as keyof typeof baseHours] || 60
  }

  /**
   * Generate learning resources for a skill
   */
  private static generateLearningResources(skillName: string) {
    // This would ideally connect to a real course database
    return [
      {
        id: `resource_${skillName.toLowerCase().replace(/\s+/g, '_')}`,
        title: `Learn ${skillName}`,
        type: 'course' as const,
        provider: 'Online Learning Platform',
        duration: '4-6 weeks',
        cost: 49,
        rating: 4.5,
        url: '#',
        description: `Comprehensive course covering ${skillName} fundamentals and practical applications`,
        difficulty: 'intermediate' as const,
        skills: [skillName]
      }
    ]
  }

  /**
   * Calculate total duration for learning path
   */
  private static calculateTotalDuration(phases: any[]): string {
    if (phases.length === 0) return '0 weeks'
    if (phases.length <= 2) return '2-3 months'
    if (phases.length <= 4) return '4-6 months'
    return '6-12 months'
  }

  /**
   * Determine learning path difficulty
   */
  private static determineDifficulty(missingSkillsCount: number, experienceLevel: string): 'beginner' | 'intermediate' | 'advanced' {
    if (experienceLevel === 'entry' && missingSkillsCount <= 3) return 'beginner'
    if (experienceLevel === 'senior' || missingSkillsCount > 5) return 'advanced'
    return 'intermediate'
  }

  /**
   * Identify prerequisites for a career
   */
  private static identifyPrerequisites(careerProfile: CareerProfile): string[] {
    const prerequisites: string[] = []
    
    if (careerProfile.category === 'Technology') {
      prerequisites.push('Basic computer literacy', 'Problem-solving mindset')
    }
    if (careerProfile.subcategory === 'Software Development') {
      prerequisites.push('Logical thinking', 'Attention to detail')
    }
    if (careerProfile.experienceLevel === 'senior') {
      prerequisites.push('Leadership experience', 'Industry knowledge')
    }

    return prerequisites
  }








  /**
   * Get API configuration status for user feedback
   */
  static getAPIStatus(): { configured: boolean; message: string } {
    const isConfigured = this.isAPIConfigured()

    if (isConfigured) {
      return {
        configured: true,
        message: 'AI-powered recommendations are available',
      }
    } else {
      return {
        configured: false,
        message:
          'Using curated career recommendations. Configure Gemini API for personalized AI recommendations.',
      }
    }
  }

  /**
   * Clear all cached recommendations
   */
  static clearCache(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(this.CACHE_KEY) || key.startsWith('career_recommendations_cache') || key.startsWith('advanced_career_rec')) {
          localStorage.removeItem(key)
          console.log('Cleared cache key:', key)
        }
      })
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  /**
   * Get recommendation by ID
   */
  static getRecommendationById(
    recommendations: CareerRecommendation[],
    id: string
  ): CareerRecommendation | null {
    return recommendations.find((rec) => rec.id === id) || null
  }

  /**
   * Sort recommendations by fit score
   */
  static sortByFitScore(
    recommendations: CareerRecommendation[]
  ): CareerRecommendation[] {
    return [...recommendations].sort((a, b) => b.fitScore - a.fitScore)
  }

  /**
   * Filter recommendations by minimum fit score
   */
  static filterByMinFitScore(
    recommendations: CareerRecommendation[],
    minScore: number
  ): CareerRecommendation[] {
    return recommendations.filter((rec) => rec.fitScore >= minScore)
  }
}
