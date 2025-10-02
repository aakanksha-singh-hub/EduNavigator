import { GoogleGenerativeAI } from '@google/generative-ai'
import { UserProfile, CareerRecommendation, AlternativeCareer } from '../types'
import { config } from '../config'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export class GeminiService {
  static async generateCareerPath(
    profile: UserProfile,
    assessmentData?: any
  ): Promise<CareerRecommendation> {
    // Check if API key is available
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback data')
      throw new Error('API key not configured')
    }

    try {
      // Build domain-specific prompt
      let domainFocus = 'general career guidance'
      if (assessmentData?.preferredIndustries?.length > 0) {
        domainFocus = assessmentData.preferredIndustries.join(', ')
      }

      const prompt = `You are an expert career advisor AI. Based on the user's profile and assessment data, generate a comprehensive career recommendation.

User Profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Education: ${profile.educationLevel}
- Skills: ${profile.skills?.join(', ') || 'Not specified'}
- Career Interest: ${profile.careerInterest}
- Location: ${profile.location || 'Not specified'}

${assessmentData ? `
Assessment Data:
- Selected Career Domains: ${assessmentData.preferredIndustries?.join(', ') || 'Not specified'}
- Interests: ${assessmentData.interests?.join(', ') || 'Not specified'}
- Career Goals: ${assessmentData.careerGoals?.join(', ') || 'Not specified'}
- Timeline: ${assessmentData.timeframe || 'Not specified'}
- Work Style Preferences: ${assessmentData.workStyle?.join(', ') || 'Not specified'}
` : ''}

IMPORTANT: 
1. Focus SPECIFICALLY on the selected career domains: ${domainFocus}
2. If education domain is selected, suggest ONLY education careers (teacher, professor, counselor, etc.)
3. If healthcare domain is selected, suggest ONLY healthcare careers (nurse, therapist, medical, etc.)  
4. If business domain is selected, suggest ONLY business careers (manager, analyst, marketing, etc.)
5. Include REAL Coursera and Udemy course links that actually work

Provide a career recommendation matching the selected domains with learning resources.

IMPORTANT: Avoid suggesting the same common tech jobs (Software Developer, Data Analyst, Product Manager, UX/UI Designer, Digital Marketing Specialist). 

Instead, explore diverse, emerging, and specialized career paths that match the user's unique profile. Consider:
- Emerging tech roles (AI Ethics Specialist, Blockchain Developer, AR/VR Designer, etc.)
- Cross-industry opportunities (FinTech, HealthTech, EdTech, GreenTech, etc.)
- Specialized technical roles (DevOps Engineer, Cybersecurity Analyst, Cloud Architect, etc.)
- Creative-tech hybrid roles (Technical Writer, Developer Advocate, Solutions Engineer, etc.)
- Industry-specific roles based on user's background and interests

Please provide a detailed career recommendation in the following JSON format.
For learning resources, include specific course titles and skills that can be found on platforms like Udemy, Coursera, LinkedIn Learning, and freeCodeCamp:
{
  "primaryCareer": "Main career title matching the domains: ${domainFocus}",
  "relatedRoles": ["Role 1", "Role 2", "Role 3", "Role 4"],
  "summary": "Personalized summary explaining why this career path fits the user in the ${domainFocus} domain(s)",
  "careerPath": {
    "nodes": [
      {
        "id": "1",
        "type": "course",
        "title": "Course Name",
        "description": "Course description",
        "duration": "3 months",
        "difficulty": "beginner",
        "position": {"x": 100, "y": 100}
      },
      {
        "id": "2",
        "type": "internship",
        "title": "Internship Name",
        "description": "Internship description",
        "duration": "6 months",
        "position": {"x": 300, "y": 100}
      },
      {
        "id": "3",
        "type": "job",
        "title": "Job Title",
        "description": "Job description",
        "salary": "$60k-80k",
        "position": {"x": 500, "y": 100}
      },
      {
        "id": "4",
        "type": "company",
        "title": "Company Name",
        "description": "Company description",
        "position": {"x": 700, "y": 100}
      },
      {
        "id": "5",
        "type": "skill",
        "title": "Skill Name",
        "description": "Skill description",
        "position": {"x": 100, "y": 300}
      }
    ],
    "edges": [
      {
        "id": "e1-2",
        "source": "1",
        "target": "2",
        "sourceHandle": "bottom",
        "targetHandle": "top",
        "type": "smoothstep",
        "animated": true
      },
      {
        "id": "e2-3",
        "source": "2",
        "target": "3",
        "sourceHandle": "bottom",
        "targetHandle": "top",
        "type": "smoothstep",
        "animated": true
      },
      {
        "id": "e3-4",
        "source": "3",
        "target": "4",
        "sourceHandle": "bottom",
        "targetHandle": "top",
        "type": "smoothstep",
        "animated": true
      },
      {
        "id": "e1-5",
        "source": "1",
        "target": "5",
        "sourceHandle": "right",
        "targetHandle": "left",
        "type": "smoothstep"
      }
    ]
  },
  "alternatives": [
    {
      "id": "alt1",
      "title": "Alternative Career 1 in ${domainFocus}",
      "description": "Description of alternative career in the selected domains",
      "matchScore": 85,
      "salary": "$70k-100k",
      "requirements": ["Skill 1", "Skill 2", "Skill 3"],
      "growth": "high"
    },
    {
      "id": "alt2",
      "title": "Alternative Career 2 in ${domainFocus}",
      "description": "Description of alternative career in the selected domains",
      "matchScore": 75,
      "salary": "$60k-90k",
      "requirements": ["Skill 1", "Skill 2", "Skill 3"],
      "growth": "medium"
    },
    {
      "id": "alt3",
      "title": "Alternative Career 3 in ${domainFocus}",
      "description": "Description of alternative career in the selected domains",
      "matchScore": 70,
      "salary": "$50k-80k",
      "requirements": ["Skill 1", "Skill 2", "Skill 3"],
      "growth": "medium"
    }
  ]
}

Create a realistic career path with 5-8 nodes including courses, internships, jobs, companies, and skills.
Make sure the positions are spread out appropriately for a flowchart (x: 100-1200, y: 100-400).
The career path should be relevant to the user's interests and skills.
Provide 3 alternative careers with realistic match scores, salaries, and requirements.

IMPORTANT: All edges must include sourceHandle and targetHandle properties:
- Use "bottom" for sourceHandle and "top" for targetHandle for vertical connections
- Use "right" for sourceHandle and "left" for targetHandle for horizontal connections
- This is required for React Flow to render the connections properly

CRITICAL: Focus ONLY on careers in the selected domains: ${domainFocus}. Do not suggest tech careers unless technology was specifically selected.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      console.log('Gemini raw response:', text)

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const careerData = JSON.parse(jsonMatch[0])
      return careerData as CareerRecommendation
    } catch (error) {
      console.error('Error generating career path with Gemini:', error)
      // Fallback to mock data if API fails
      return this.getFallbackRecommendation(profile, assessmentData)
    }
  }

  static async generateCareerRecommendations(prompt: string): Promise<string> {
    // Check if API key is available
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback data')
      throw new Error('API key not configured')
    }

    console.log(
      'GeminiService: Starting API call with key:',
      config.geminiApiKey?.substring(0, 10) + '...'
    )

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('API call timeout after 5 seconds')),
          5000
        )
      })

      const apiPromise = (async () => {
        console.log('GeminiService: Calling model.generateContent...')
        const result = await model.generateContent(prompt)
        console.log('GeminiService: Got result, getting response...')
        const response = await result.response
        console.log('GeminiService: Got response, getting text...')
        const text = response.text()
        console.log('GeminiService: Got text, length:', text?.length)
        return text
      })()

      return await Promise.race([apiPromise, timeoutPromise])
    } catch (error) {
      console.error(
        'Error generating career recommendations with Gemini:',
        error
      )
      throw error
    }
  }

  static async suggestAlternatives(
    profile: UserProfile
  ): Promise<AlternativeCareer[]> {
    // Check if API key is available
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback data')
      throw new Error('API key not configured')
    }

    try {
      const prompt = `
        Based on this user profile, suggest 3 UNIQUE and DIVERSE alternative career paths. 
        
        AVOID these overused suggestions: Software Developer, Data Analyst, Product Manager, UX/UI Designer, Digital Marketing Specialist.
        
        Instead, focus on:
        - Emerging technology roles
        - Industry-specific specializations  
        - Cross-functional hybrid positions
        - Creative-technical combinations
        - Niche expertise areas
        - Name: ${profile.name}
        - Age: ${profile.age}
        - Education: ${profile.educationLevel}
        - Skills: ${profile.skills.join(', ')}
        - Career Interest: ${profile.careerInterest}
        - Location: ${profile.location || 'Not specified'}

        Return only a JSON array of alternative careers in this format:
        [
          {
            "id": "alt1",
            "title": "Career Title",
            "description": "Brief description",
            "matchScore": 85,
            "salary": "$60k-90k",
            "requirements": ["Skill 1", "Skill 2", "Skill 3"],
            "growth": "high"
          }
        ]
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      return JSON.parse(jsonMatch[0]) as AlternativeCareer[]
    } catch (error) {
      console.error('Error generating alternatives with Gemini:', error)
      return this.getFallbackAlternatives(profile)
    }
  }

  private static getFallbackRecommendation(
    profile: UserProfile,
    assessmentData?: any
  ): CareerRecommendation {
    // Build domain-specific fallback based on selected domains
    let domainFocus = 'general careers'
    let careerTitle = 'AI Solutions Engineer'
    let careerDescription = 'Bridge the gap between AI research and practical applications by designing, implementing, and optimizing AI systems for real-world problems.'
    let relatedRoles = ['Machine Learning Engineer', 'AI Research Scientist', 'Computer Vision Engineer', 'NLP Specialist']
    
    if (assessmentData?.preferredIndustries?.length > 0) {
      domainFocus = assessmentData.preferredIndustries.join(', ')
      
      // Domain-specific fallback careers
      if (assessmentData.preferredIndustries.includes('engineering')) {
        careerTitle = 'Mechanical Engineer'
        careerDescription = 'Design, develop, and test mechanical and thermal devices including tools, engines, and machines using engineering principles and manufacturing processes.'
        relatedRoles = ['Design Engineer', 'Manufacturing Engineer', 'Project Engineer', 'Systems Engineer']
      } else if (assessmentData.preferredIndustries.includes('education')) {
        careerTitle = 'Educational Technology Specialist'
        careerDescription = 'Design and implement technology solutions to enhance learning experiences and improve educational outcomes in schools and universities.'
        relatedRoles = ['Instructional Designer', 'Learning Experience Designer', 'Academic Technology Coordinator', 'E-Learning Developer']
      } else if (assessmentData.preferredIndustries.includes('healthcare')) {
        careerTitle = 'Healthcare Information Systems Analyst'
        careerDescription = 'Analyze and improve healthcare information systems to enhance patient care, streamline operations, and ensure regulatory compliance.'
        relatedRoles = ['Medical Records Technician', 'Health Information Manager', 'Clinical Data Analyst', 'Healthcare IT Specialist']
      } else if (assessmentData.preferredIndustries.includes('business')) {
        careerTitle = 'Business Intelligence Analyst'
        careerDescription = 'Transform business data into actionable insights to drive strategic decision-making and improve organizational performance.'
        relatedRoles = ['Data Analyst', 'Business Analyst', 'Management Consultant', 'Operations Analyst']
      } else if (assessmentData.preferredIndustries.includes('creative')) {
        careerTitle = 'UX/UI Designer'
        careerDescription = 'Create intuitive and engaging user experiences for digital products by researching user needs and designing interfaces that are both functional and beautiful.'
        relatedRoles = ['Graphic Designer', 'Web Designer', 'Product Designer', 'Interaction Designer']
      }
    }

    // Fallback to mock data if API fails
    const mockPaths = {
      'default': {
        nodes: [
          {
            id: '1',
            type: 'course' as const,
            title: 'Foundation Skills Course',
            description: 'Master the fundamentals needed for your career path',
            duration: '3 months',
            difficulty: 'beginner' as const,
            position: { x: 100, y: 100 },
          },
          {
            id: '2',
            type: 'course' as const,
            title: 'Advanced Specialization',
            description: 'Develop advanced skills in your chosen field',
            duration: '4 months',
            difficulty: 'intermediate' as const,
            position: { x: 300, y: 100 },
          },
          {
            id: '3',
            type: 'internship' as const,
            title: 'Professional Internship',
            description: '6-month internship to gain real-world experience',
            duration: '6 months',
            position: { x: 500, y: 100 },
          },
          {
            id: '4',
            type: 'job' as const,
            title: 'Entry-Level Position',
            description: 'Start your professional career',
            salary: '$60k-80k',
            position: { x: 700, y: 100 },
          },
          {
            id: '5',
            type: 'job' as const,
            title: 'Senior Position',
            description: 'Lead projects and mentor others',
            salary: '$90k-120k',
            position: { x: 900, y: 100 },
          },
          {
            id: '6',
            type: 'skill' as const,
            title: 'Core Skill',
            description: 'Essential skill for your field',
            position: { x: 100, y: 300 },
          },
          {
            id: '7',
            type: 'skill' as const,
            title: 'Advanced Skill',
            description: 'Specialized skill for career growth',
            position: { x: 300, y: 300 },
          },
        ],
        edges: [
          {
            id: 'e1-2',
            source: '1',
            target: '2',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e2-3',
            source: '2',
            target: '3',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e3-4',
            source: '3',
            target: '4',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e4-5',
            source: '4',
            target: '5',
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep' as const,
            animated: true,
          },
          {
            id: 'e1-6',
            source: '1',
            target: '6',
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep' as const,
          },
          {
            id: 'e2-7',
            source: '2',
            target: '7',
            sourceHandle: 'right',
            targetHandle: 'left',
            type: 'smoothstep' as const,
          },
        ],
      },
    }

    const pathData = mockPaths['default']
    return {
      id: `fallback_career_${Date.now()}`,
      title: careerTitle,
      description: careerDescription,
      fitScore: 75,
      salaryRange: {
        min: 60000,
        max: 120000,
        currency: 'USD',
        period: 'yearly',
      },
      growthProspects: 'high' as const,
      requiredSkills: [],
      recommendedPath: {
        id: 'fallback_path',
        title: `${careerTitle} Learning Path`,
        description: `Comprehensive learning path for ${careerTitle}`,
        totalDuration: '6-12 months',
        phases: [
          {
            id: 'phase1',
            title: 'Foundation Skills',
            description: 'Learn the basics needed for your career',
            duration: '3 months',
            priority: 'critical' as const,
            order: 1,
            skills: ['Foundation Skill 1', 'Foundation Skill 2'],
            resources: [
              {
                id: 'foundation-course',
                title: 'Foundation Course',
                description: 'Master the core concepts',
                type: 'course' as const,
                provider: 'Multiple Platforms',
                duration: '4 weeks',
                cost: 50,
                difficulty: 'beginner' as const,
                skills: ['Foundation Skills']
              }
            ]
          }
        ],
        estimatedCost: 2000,
        difficulty: 'intermediate' as const,
        prerequisites: ['Basic computer skills', 'Problem-solving mindset'],
        outcomes: ['Career readiness', 'Professional skills', 'Industry knowledge'],
      },
      jobMarketData: {
        demand: 'high' as const,
        competitiveness: 'medium' as const,
        locations: ['Remote', 'Major Cities'],
        industryGrowth: 15,
        averageSalary: 90000,
      },
      primaryCareer: careerTitle,
      relatedRoles: relatedRoles,
      careerPath: {
        nodes: pathData.nodes,
        edges: pathData.edges,
      },
      alternatives: this.getFallbackAlternatives(profile, assessmentData),
      summary: `Based on your interest in ${profile.careerInterest} and the selected domains (${domainFocus}), a career in ${careerTitle} would be perfect for you. This field combines your skills with the growing opportunities in ${domainFocus}.`,
    }
  }

  private static getFallbackAlternatives(
    profile: UserProfile,
    assessmentData?: any
  ): AlternativeCareer[] {
    // Domain-specific alternatives
    if (assessmentData?.preferredIndustries?.includes('engineering')) {
      return [
        {
          id: 'alt1',
          title: 'Electrical Engineer',
          description: 'Design and develop electrical systems and components',
          matchScore: 85,
          salary: '$75k-110k',
          requirements: ['Electrical Engineering', 'Circuit Design', 'Project Management'],
          growth: 'high',
        },
        {
          id: 'alt2',
          title: 'Civil Engineer',
          description: 'Plan and design infrastructure projects like roads and buildings',
          matchScore: 75,
          salary: '$65k-95k',
          requirements: ['Civil Engineering', 'AutoCAD', 'Project Planning'],
          growth: 'medium',
        },
        {
          id: 'alt3',
          title: 'Environmental Engineer',
          description: 'Develop solutions to environmental problems using engineering principles',
          matchScore: 70,
          salary: '$60k-90k',
          requirements: ['Environmental Science', 'Engineering', 'Sustainability'],
          growth: 'high',
        },
      ]
    } else if (assessmentData?.preferredIndustries?.includes('healthcare')) {
      return [
        {
          id: 'alt1',
          title: 'Registered Nurse',
          description: 'Provide direct patient care and support in healthcare settings',
          matchScore: 85,
          salary: '$60k-90k',
          requirements: ['Nursing License', 'Patient Care', 'Medical Knowledge'],
          growth: 'high',
        },
        {
          id: 'alt2',
          title: 'Physical Therapist',
          description: 'Help patients recover mobility and manage pain through exercise',
          matchScore: 75,
          salary: '$70k-100k',
          requirements: ['PT License', 'Anatomy', 'Rehabilitation Techniques'],
          growth: 'high',
        },
        {
          id: 'alt3',
          title: 'Medical Technologist',
          description: 'Perform laboratory tests to help diagnose diseases',
          matchScore: 70,
          salary: '$55k-85k',
          requirements: ['Medical Technology', 'Laboratory Skills', 'Attention to Detail'],
          growth: 'medium',
        },
      ]
    }
    
    // Default alternatives for other domains
    return [
      {
        id: 'alt1',
        title: 'Domain Expert Consultant',
        description: 'Provide specialized consulting in your chosen field',
        matchScore: 85,
        salary: '$80k-120k',
        requirements: ['Domain Knowledge', 'Communication', 'Problem Solving'],
        growth: 'high',
      },
      {
        id: 'alt2',
        title: 'Training and Development Specialist',
        description: 'Design and deliver professional development programs',
        matchScore: 75,
        salary: '$60k-90k',
        requirements: ['Training Design', 'Communication', 'Subject Matter Expertise'],
        growth: 'medium',
      },
      {
        id: 'alt3',
        title: 'Research Analyst',
        description: 'Conduct research and analysis in your field of expertise',
        matchScore: 70,
        salary: '$55k-85k',
        requirements: ['Research Skills', 'Data Analysis', 'Critical Thinking'],
        growth: 'medium',
      },
    ]
  }
}
