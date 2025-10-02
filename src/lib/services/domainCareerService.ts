import { CareerRecommendation, LearningResource } from '../types'

interface DomainCareerData {
  careers: Array<{
    id: string
    title: string
    description: string
    salaryRange: { min: number; max: number; currency: string; period: string }
    fitScore: number
    skills: string[]
    courses: LearningResource[]
  }>
  roadmap: {
    phases: Array<{
      title: string
      duration: string
      courses: string[]
      skills: string[]
      checklist: string[]
    }>
  }
}

interface DomainChecklist {
  domainName: string
  immediateActions: string[]
  shortTermGoals: string[]
  longTermGoals: string[]
  keySkills: string[]
  resources: string[]
}

/**
 * SIMPLE DOMAIN-ONLY CAREER SERVICE
 * This service ONLY cares about the domain selected by the user.
 * No complex AI, no scoring algorithms, just pure domain-based recommendations.
 */
export class DomainCareerService {
  
  private static readonly DOMAIN_DATA: Record<string, DomainCareerData> = {
    creative: {
      careers: [
        {
          id: 'ux-ui-designer',
          title: 'UX/UI Designer',
          description: 'Design user-centered digital experiences by researching user needs, creating wireframes, prototypes, and visual designs for websites and applications.',
          salaryRange: { min: 55000, max: 110000, currency: 'USD', period: 'yearly' as const },
          fitScore: 95,
          skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
          courses: [
            {
              id: 'ux-design-coursera',
              title: 'Google UX Design Professional Certificate',
              type: 'course' as const,
              provider: 'Coursera',
              duration: '3-6 months',
              cost: 49,
              rating: 4.8,
              url: 'https://www.coursera.org/professional-certificates/google-ux-design',
              description: 'Complete UX design program by Google',
              difficulty: 'beginner' as const,
              skills: ['UX Design', 'Figma', 'Prototyping']
            },
            {
              id: 'ui-design-udemy',
              title: 'Complete Web & Mobile Designer in 2024: UI/UX, Figma, +more',
              type: 'course' as const,
              provider: 'Udemy',
              duration: '24 hours',
              cost: 89,
              rating: 4.6,
              url: 'https://www.udemy.com/course/complete-web-designer-mobile-designer-zero-to-mastery/',
              description: 'Comprehensive UI/UX design course',
              difficulty: 'beginner' as const,
              skills: ['UI Design', 'Figma', 'Adobe XD']
            }
          ]
        },
        {
          id: 'graphic-designer',
          title: 'Graphic Designer',
          description: 'Create visual concepts and designs for print, digital media, branding, and marketing materials.',
          salaryRange: { min: 42000, max: 75000, currency: 'USD', period: 'yearly' as const },
          fitScore: 90,
          skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Typography', 'Branding', 'Print Design'],
          courses: [
            {
              id: 'graphic-design-coursera',
              title: 'Graphic Design Specialization',
              type: 'course' as const,
              provider: 'Coursera',
              duration: '4-6 months',
              cost: 49,
              rating: 4.7,
              url: 'https://www.coursera.org/specializations/graphic-design',
              description: 'Complete graphic design specialization',
              difficulty: 'beginner' as const,
              skills: ['Graphic Design', 'Adobe Creative Suite', 'Typography']
            }
          ]
        },
        {
          id: 'content-creator',
          title: 'Content Creator',
          description: 'Develop engaging content for digital platforms including social media, blogs, videos, and marketing campaigns.',
          salaryRange: { min: 38000, max: 85000, currency: 'USD', period: 'yearly' as const },
          fitScore: 85,
          skills: ['Content Writing', 'Social Media', 'Video Editing', 'Photography', 'SEO'],
          courses: [
            {
              id: 'content-marketing-hubspot',
              title: 'Content Marketing Certification',
              type: 'course' as const,
              provider: 'HubSpot',
              duration: '4 hours',
              cost: 0,
              rating: 4.5,
              url: 'https://academy.hubspot.com/courses/content-marketing',
              description: 'Free content marketing certification',
              difficulty: 'beginner' as const,
              skills: ['Content Marketing', 'SEO', 'Social Media']
            }
          ]
        }
      ],
      roadmap: {
        phases: [
          {
            title: 'Foundation: Design Basics',
            duration: '2-3 months',
            courses: ['Google UX Design Professional Certificate', 'Graphic Design Fundamentals'],
            skills: ['Design Principles', 'Color Theory', 'Typography', 'Adobe Creative Suite'],
            checklist: [
              'Complete design fundamentals course',
              'Learn Figma basics',
              'Create 3 practice designs',
              'Build basic design portfolio'
            ]
          },
          {
            title: 'Specialization: Choose Your Path',
            duration: '3-4 months',
            courses: ['Advanced UX/UI Design', 'Brand Identity Design', 'Digital Marketing Design'],
            skills: ['User Research', 'Prototyping', 'Brand Strategy', 'Web Design'],
            checklist: [
              'Choose specialization (UX/UI, Graphic, or Content)',
              'Complete advanced courses in chosen area',
              'Create 5 professional portfolio pieces',
              'Learn industry-standard tools'
            ]
          },
          {
            title: 'Professional Practice',
            duration: '2-3 months',
            courses: ['Freelance Design Business', 'Client Communication', 'Portfolio Development'],
            skills: ['Client Management', 'Project Management', 'Business Skills', 'Portfolio Presentation'],
            checklist: [
              'Create professional portfolio website',
              'Complete 2 real client projects',
              'Network with other designers',
              'Apply for design positions'
            ]
          }
        ]
      }
    },

    technology: {
      careers: [
        {
          id: 'software-developer',
          title: 'Software Developer',
          description: 'Design, develop, and maintain software applications and systems using various programming languages and frameworks.',
          salaryRange: { min: 70000, max: 130000, currency: 'USD', period: 'yearly' as const },
          fitScore: 95,
          skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'Database Management'],
          courses: [
            {
              id: 'full-stack-meta',
              title: 'Meta Front-End Developer Professional Certificate',
              type: 'course' as const,
              provider: 'Coursera',
              duration: '7 months',
              cost: 49,
              rating: 4.7,
              url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
              description: 'Complete front-end development program by Meta',
              difficulty: 'beginner' as const,
              skills: ['JavaScript', 'React', 'HTML/CSS']
            }
          ]
        },
        {
          id: 'data-scientist',
          title: 'Data Scientist',
          description: 'Analyze complex data sets to extract insights and build predictive models using statistical methods and machine learning.',
          salaryRange: { min: 80000, max: 150000, currency: 'USD', period: 'yearly' as const },
          fitScore: 90,
          skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
          courses: []
        },
        {
          id: 'cybersecurity-analyst',
          title: 'Cybersecurity Analyst',
          description: 'Protect organizations from cyber threats by monitoring security systems, investigating incidents, implementing security measures, and ensuring compliance.',
          salaryRange: { min: 65000, max: 120000, currency: 'USD', period: 'yearly' as const },
          fitScore: 85,
          skills: ['Network Security', 'Risk Assessment', 'Incident Response', 'Security Tools'],
          courses: []
        }
      ],
      roadmap: {
        phases: [
          {
            title: 'Programming Fundamentals',
            duration: '3-4 months',
            courses: ['Python for Beginners', 'JavaScript Fundamentals', 'Git Version Control'],
            skills: ['Python', 'JavaScript', 'Git', 'Problem Solving', 'Algorithm Basics'],
            checklist: [
              'Master one programming language (Python or JavaScript)',
              'Complete 50 coding challenges',
              'Build 3 simple projects',
              'Learn Git and GitHub'
            ]
          },
          {
            title: 'Web Development or Data Science',
            duration: '4-6 months',
            courses: ['React Development', 'Node.js Backend', 'Data Science with Python'],
            skills: ['React', 'Node.js', 'Database Management', 'API Development'],
            checklist: [
              'Choose specialization (Web Dev, Data Science, or Cybersecurity)',
              'Complete advanced courses in chosen area',
              'Build 5 portfolio projects',
              'Learn deployment and hosting'
            ]
          }
        ]
      }
    },

    business: {
      careers: [
        {
          id: 'business-analyst',
          title: 'Business Analyst',
          description: 'Bridge the gap between business needs and technology solutions by analyzing processes, gathering requirements, and recommending improvements.',
          salaryRange: { min: 55000, max: 95000, currency: 'USD', period: 'yearly' as const },
          fitScore: 95,
          skills: ['Business Analysis', 'Requirements Gathering', 'Process Mapping', 'Communication'],
          courses: []
        },
        {
          id: 'project-manager',
          title: 'Project Manager',
          description: 'Plan, execute, and oversee projects from initiation to completion, ensuring they meet objectives, timelines, and budgets.',
          salaryRange: { min: 60000, max: 110000, currency: 'USD', period: 'yearly' as const },
          fitScore: 90,
          skills: ['Project Management', 'Leadership', 'Risk Management', 'Agile/Scrum'],
          courses: []
        }
      ],
      roadmap: {
        phases: [
          {
            title: 'Business Fundamentals',
            duration: '2-3 months',
            courses: ['Business Analysis Fundamentals', 'Project Management Basics'],
            skills: ['Business Analysis', 'Project Management', 'Communication', 'Excel'],
            checklist: [
              'Learn business analysis basics',
              'Master Excel and data analysis',
              'Complete project management course',
              'Practice presentation skills'
            ]
          }
        ]
      }
    },

    healthcare: {
      careers: [
        {
          id: 'registered-nurse',
          title: 'Registered Nurse',
          description: 'Provide direct patient care, administer medications, and collaborate with healthcare teams to promote patient health and recovery.',
          salaryRange: { min: 60000, max: 90000, currency: 'USD', period: 'yearly' as const },
          fitScore: 95,
          skills: ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking'],
          courses: []
        }
      ],
      roadmap: {
        phases: [
          {
            title: 'Healthcare Fundamentals',
            duration: '6-12 months',
            courses: ['Medical Terminology', 'Anatomy & Physiology', 'Healthcare Ethics'],
            skills: ['Medical Knowledge', 'Patient Care', 'Communication', 'Ethics'],
            checklist: [
              'Complete medical terminology course',
              'Learn anatomy and physiology',
              'Study healthcare regulations',
              'Gain hands-on experience'
            ]
          }
        ]
      }
    },

    education: {
      careers: [
        {
          id: 'teacher',
          title: 'Teacher',
          description: 'Educate and inspire students, develop curriculum, assess learning progress, and create supportive learning environments.',
          salaryRange: { min: 40000, max: 70000, currency: 'USD', period: 'yearly' as const },
          fitScore: 95,
          skills: ['Teaching', 'Curriculum Development', 'Classroom Management', 'Communication'],
          courses: []
        }
      ],
      roadmap: {
        phases: [
          {
            title: 'Education Fundamentals',
            duration: '4-6 months',
            courses: ['Teaching Methods', 'Classroom Management', 'Educational Psychology'],
            skills: ['Teaching', 'Classroom Management', 'Educational Technology', 'Assessment'],
            checklist: [
              'Complete teaching certification program',
              'Learn classroom management techniques',
              'Practice lesson planning',
              'Gain teaching experience'
            ]
          }
        ]
      }
    },

    engineering: {
      careers: [
        {
          id: 'mechanical-engineer',
          title: 'Mechanical Engineer',
          description: 'Design, develop, and test mechanical and thermal devices including tools, engines, and machines using engineering principles.',
          salaryRange: { min: 65000, max: 110000, currency: 'USD', period: 'yearly' as const },
          fitScore: 95,
          skills: ['CAD Design', 'Thermodynamics', 'Materials Science', 'Project Management'],
          courses: []
        }
      ],
      roadmap: {
        phases: [
          {
            title: 'Engineering Fundamentals',
            duration: '6-12 months',
            courses: ['Engineering Mathematics', 'CAD Software', 'Physics for Engineers'],
            skills: ['Mathematics', 'CAD Design', 'Physics', 'Problem Solving'],
            checklist: [
              'Master engineering mathematics',
              'Learn CAD software (AutoCAD/SolidWorks)',
              'Complete physics courses',
              'Work on engineering projects'
            ]
          }
        ]
      }
    }
  }

  /**
   * Get career recommendations based PURELY on domain selection
   */
  static getCareersByDomain(domain: string): CareerRecommendation[] {
    console.log(`🎯 DOMAIN-ONLY SERVICE: Getting careers for domain "${domain}"`)
    
    const domainData = this.DOMAIN_DATA[domain]
    if (!domainData) {
      console.error(`❌ Domain "${domain}" not found!`)
      return []
    }

    const recommendations = domainData.careers.map(career => ({
      id: career.id,
      title: career.title,
      description: career.description,
      fitScore: career.fitScore,
      salaryRange: {
        ...career.salaryRange,
        period: career.salaryRange.period as 'yearly' | 'hourly' | 'monthly'
      },
      growthProspects: 'high' as const,
      requiredSkills: career.skills.map(skill => ({
        id: `skill_${skill.toLowerCase().replace(/\s+/g, '_')}`,
        name: skill,
        category: 'technical' as const,
        isRequired: true,
        priority: 'critical' as const
      })),
      recommendedPath: {
        id: `path_${career.id}`,
        title: `${career.title} Learning Path`,
        description: `Comprehensive roadmap to become a ${career.title}`,
        totalDuration: '6-12 months',
        phases: domainData.roadmap.phases.map((phase, index) => ({
          id: `phase_${index + 1}`,
          order: index + 1,
          title: phase.title,
          description: `Learn ${phase.skills.join(', ')}`,
          duration: phase.duration,
          priority: 'important' as const,
          resources: career.courses,
          skills: phase.skills,
          estimatedHours: 80,
          milestones: phase.checklist,
          projects: [`Build ${career.title} portfolio project`]
        })),
        estimatedCost: 500,
        difficulty: 'intermediate' as const,
        prerequisites: [],
        outcomes: [`Job-ready skills for ${career.title}`, 'Professional portfolio', 'Industry certification']
      },
      jobMarketData: {
        demand: 'high' as const,
        competitiveness: 'medium' as const,
        locations: ['Remote', 'Hybrid', 'On-site'],
        industryGrowth: 15,
        averageSalary: (career.salaryRange.min + career.salaryRange.max) / 2
      },
      primaryCareer: career.title,
      relatedRoles: domainData.careers.filter(c => c.id !== career.id).map(c => c.title),
      summary: `${career.title} is a perfect match for your ${domain} interests. This role offers excellent growth opportunities and aligns with current market demands.`,
      careerPath: { nodes: [], edges: [] },
      alternatives: [],
      
      // Additional UI-specific properties for SimpleDomainResults
      icon: this.getCareerIcon(career.title),
      matchScore: career.fitScore,
      salary: `$${career.salaryRange.min.toLocaleString()}-$${career.salaryRange.max.toLocaleString()}/year`,
      growth: this.getGrowthText(career.title),
      workStyle: this.getWorkStyle(career.title),
      timeToEntry: this.getTimeToEntry(career.title),
      keySkills: career.skills
    } as any))

    console.log(`✅ DOMAIN-ONLY SERVICE: Generated ${recommendations.length} recommendations for ${domain}`)
    recommendations.forEach(rec => {
      console.log(`  ✅ ${rec.title} - ${rec.fitScore}% match`)
    })

    return recommendations
  }

  /**
   * Get downloadable checklist for domain
   */
  static getDomainChecklist(domain: string): DomainChecklist {
    const domainMap = {
      creative: 'Creative & Design',
      technology: 'Technology',
      business: 'Business & Finance',
      healthcare: 'Healthcare',
      education: 'Education',
      engineering: 'Engineering'
    }

    const domainName = domainMap[domain as keyof typeof domainMap] || 'Selected Field'

    // Domain-specific checklists
    const checklists: Record<string, DomainChecklist> = {
      creative: {
        domainName: 'Creative & Design',
        immediateActions: [
          'Create online portfolio showcasing best work',
          'Join design communities (Dribbble, Behance)',
          'Update LinkedIn with creative portfolio link',
          'Research 10 companies you want to work for'
        ],
        shortTermGoals: [
          'Complete 3 personal projects in chosen specialization',
          'Network with 20 creative professionals',
          'Apply to 15 entry-level creative positions',
          'Attend 2 design meetups or conferences'
        ],
        longTermGoals: [
          'Land first creative role or freelance clients',
          'Build reputation in chosen creative niche',
          'Develop signature creative style',
          'Consider specialization certification'
        ],
        keySkills: [
          'Adobe Creative Suite',
          'Design Thinking',
          'Branding',
          'Typography',
          'Color Theory',
          'User Experience',
          'Visual Communication',
          'Project Management'
        ],
        resources: [
          'Adobe Creative Cloud Tutorials',
          'Coursera UX Design Certificate',
          'Udemy Graphic Design Bootcamp',
          'Skillshare Creative Courses',
          'YouTube Design Channels',
          'Local design meetup groups'
        ]
      },
      technology: {
        domainName: 'Technology',
        immediateActions: [
          'Set up GitHub profile with sample projects',
          'Choose primary programming language to master',
          'Complete coding bootcamp or online course',
          'Join tech communities (Stack Overflow, Reddit)'
        ],
        shortTermGoals: [
          'Build 5 portfolio projects',
          'Contribute to open source projects',
          'Network with local tech professionals',
          'Apply to junior developer positions'
        ],
        longTermGoals: [
          'Land first tech role',
          'Specialize in chosen tech stack',
          'Earn relevant certifications',
          'Mentor other aspiring developers'
        ],
        keySkills: [
          'Programming Languages',
          'Problem Solving',
          'Version Control (Git)',
          'Database Management',
          'Web Development',
          'Algorithm Design',
          'Testing',
          'Cloud Computing'
        ],
        resources: [
          'FreeCodeCamp Curriculum',
          'Codecademy Pro',
          'Udemy Programming Courses',
          'LinkedIn Learning Tech Paths',
          'YouTube Programming Channels',
          'Local coding bootcamps'
        ]
      },
      business: {
        domainName: 'Business & Finance',
        immediateActions: [
          'Update resume with business achievements',
          'Research target companies and roles',
          'Join professional networks (LinkedIn)',
          'Identify business mentors to connect with'
        ],
        shortTermGoals: [
          'Complete business analysis certification',
          'Network with business professionals',
          'Apply to entry-level business roles',
          'Develop industry-specific knowledge'
        ],
        longTermGoals: [
          'Secure first business role',
          'Build expertise in chosen business area',
          'Consider MBA or advanced certifications',
          'Develop leadership skills'
        ],
        keySkills: [
          'Business Analysis',
          'Financial Modeling',
          'Project Management',
          'Data Analysis',
          'Strategic Thinking',
          'Communication',
          'Leadership',
          'Process Improvement'
        ],
        resources: [
          'Coursera Business Courses',
          'edX Business Programs',
          'LinkedIn Learning Business Skills',
          'Harvard Business Review',
          'Local business networking events',
          'Professional business associations'
        ]
      },
      healthcare: {
        domainName: 'Healthcare',
        immediateActions: [
          'Research healthcare career requirements',
          'Identify required certifications',
          'Volunteer at healthcare facilities',
          'Shadow healthcare professionals'
        ],
        shortTermGoals: [
          'Complete prerequisite courses',
          'Apply to healthcare programs',
          'Gain healthcare volunteer experience',
          'Network with healthcare professionals'
        ],
        longTermGoals: [
          'Complete healthcare education program',
          'Pass required licensing exams',
          'Secure healthcare internship or role',
          'Specialize in chosen healthcare area'
        ],
        keySkills: [
          'Patient Care',
          'Medical Knowledge',
          'Communication',
          'Empathy',
          'Attention to Detail',
          'Critical Thinking',
          'Teamwork',
          'Stress Management'
        ],
        resources: [
          'Khan Academy Medicine',
          'Coursera Healthcare Courses',
          'Local healthcare volunteer programs',
          'Healthcare professional associations',
          'Medical training institutions',
          'Healthcare career counseling'
        ]
      },
      education: {
        domainName: 'Education',
        immediateActions: [
          'Research teaching requirements in your area',
          'Identify subject areas of interest',
          'Volunteer in educational settings',
          'Connect with current educators'
        ],
        shortTermGoals: [
          'Complete teacher preparation program',
          'Gain classroom experience',
          'Apply for teaching positions',
          'Develop teaching philosophy'
        ],
        longTermGoals: [
          'Secure teaching position',
          'Earn teaching license',
          'Specialize in subject area',
          'Consider advanced education degrees'
        ],
        keySkills: [
          'Teaching Methods',
          'Curriculum Development',
          'Classroom Management',
          'Communication',
          'Patience',
          'Creativity',
          'Assessment',
          'Technology Integration'
        ],
        resources: [
          'Teach for America',
          'Local teaching programs',
          'Education courses on Coursera',
          'Teaching certification programs',
          'Education professional associations',
          'Teaching internship opportunities'
        ]
      },
      engineering: {
        domainName: 'Engineering',
        immediateActions: [
          'Choose engineering specialization',
          'Review math and science fundamentals',
          'Research engineering programs',
          'Connect with practicing engineers'
        ],
        shortTermGoals: [
          'Complete engineering prerequisites',
          'Apply to engineering programs',
          'Gain hands-on project experience',
          'Join engineering student organizations'
        ],
        longTermGoals: [
          'Complete engineering degree',
          'Pass FE exam',
          'Secure engineering internship',
          'Develop engineering specialty'
        ],
        keySkills: [
          'Mathematical Analysis',
          'Problem Solving',
          'Technical Design',
          'Project Management',
          'Computer-Aided Design',
          'Engineering Principles',
          'Critical Thinking',
          'Innovation'
        ],
        resources: [
          'Khan Academy Engineering',
          'Coursera Engineering Courses',
          'Local engineering programs',
          'Professional engineering societies',
          'Engineering internship programs',
          'STEM education resources'
        ]
      }
    }

    return checklists[domain] || checklists.creative
  }

  private static getCareerIcon(title: string): string {
    const iconMap: Record<string, string> = {
      'Graphic Designer': '🎨',
      'UX/UI Designer': '📱',
      'Content Creator': '✍️',
      'Digital Marketer': '📢',
      'Brand Designer': '🏷️',
      'Video Editor': '🎬',
      'Software Developer': '💻',
      'Data Scientist': '📊',
      'Cybersecurity Analyst': '🔒',
      'DevOps Engineer': '⚙️',
      'Mobile App Developer': '📱',
      'AI/ML Engineer': '🤖',
      'Business Analyst': '📈',
      'Project Manager': '📋',
      'Management Consultant': '💼',
      'Financial Analyst': '💰',
      'Marketing Manager': '📊',
      'Operations Manager': '⚙️',
      'Registered Nurse': '👩‍⚕️',
      'Physical Therapist': '🏃‍♂️',
      'Healthcare Administrator': '🏥',
      'Medical Researcher': '🔬',
      'Mental Health Counselor': '🧠',
      'Pharmacy Technician': '💊',
      'Elementary Teacher': '📚',
      'High School Teacher': '🎓',
      'Curriculum Developer': '📖',
      'Educational Coordinator': '📋',
      'Training Specialist': '🎯',
      'School Counselor': '👥',
      'Mechanical Engineer': '⚙️',
      'Civil Engineer': '🏗️',
      'Electrical Engineer': '⚡',
      'Environmental Engineer': '🌱',
      'Chemical Engineer': '⚗️',
      'Biomedical Engineer': '🔬'
    }
    return iconMap[title] || '💼'
  }

  private static getGrowthText(title: string): string {
    const growthMap: Record<string, string> = {
      'Software Developer': 'High growth (25%)',
      'Data Scientist': 'Very high growth (35%)',
      'Cybersecurity Analyst': 'Very high growth (32%)',
      'UX/UI Designer': 'High growth (22%)',
      'Project Manager': 'Steady growth (7%)',
      'Business Analyst': 'Good growth (11%)',
      'Registered Nurse': 'High growth (15%)',
      'Physical Therapist': 'Very high growth (28%)',
      'Elementary Teacher': 'Steady growth (4%)',
      'High School Teacher': 'Stable (3%)',
      'Mechanical Engineer': 'Steady growth (6%)',
      'Civil Engineer': 'Good growth (8%)'
    }
    return growthMap[title] || 'Good growth (8%)'
  }

  private static getWorkStyle(title: string): string {
    const workStyleMap: Record<string, string> = {
      'Software Developer': 'Remote-friendly',
      'Data Scientist': 'Hybrid',
      'Graphic Designer': 'Remote/Freelance',
      'UX/UI Designer': 'Remote/Office',
      'Content Creator': 'Fully remote',
      'Digital Marketer': 'Remote-friendly',
      'Project Manager': 'Hybrid',
      'Business Analyst': 'Office/Hybrid',
      'Registered Nurse': 'In-person',
      'Physical Therapist': 'In-person',
      'Elementary Teacher': 'In-person',
      'High School Teacher': 'In-person',
      'Mechanical Engineer': 'Office/Field',
      'Civil Engineer': 'Office/Field'
    }
    return workStyleMap[title] || 'Hybrid'
  }

  private static getTimeToEntry(title: string): string {
    const timeMap: Record<string, string> = {
      'Software Developer': '6-12 months',
      'Data Scientist': '12-18 months',
      'Graphic Designer': '3-6 months',
      'UX/UI Designer': '6-12 months',
      'Content Creator': '1-3 months',
      'Digital Marketer': '3-6 months',
      'Project Manager': '1-2 years',
      'Business Analyst': '6-12 months',
      'Registered Nurse': '2-4 years',
      'Physical Therapist': '6-7 years',
      'Elementary Teacher': '4-5 years',
      'High School Teacher': '4-5 years',
      'Mechanical Engineer': '4-5 years',
      'Civil Engineer': '4-5 years'
    }
    return timeMap[title] || '1-2 years'
  }

  /**
   * Generate career graph data for domain
   */
  static getDomainCareerGraph(domain: string) {
    const domainData = this.DOMAIN_DATA[domain]
    if (!domainData) return { nodes: [], edges: [] }

    const nodes = domainData.careers.map((career, index) => ({
      id: career.id,
      label: career.title,
      x: (index % 3) * 200 + 100,
      y: Math.floor(index / 3) * 150 + 100,
      size: career.fitScore,
      color: this.getDomainColor(domain)
    }))

    const edges = domainData.careers.slice(0, -1).map((career, index) => ({
      id: `edge_${index}`,
      source: career.id,
      target: domainData.careers[index + 1].id,
      color: '#999'
    }))

    return { nodes, edges }
  }

  private static getDomainColor(domain: string): string {
    const colors = {
      creative: '#FF6B6B',
      technology: '#4ECDC4',
      business: '#45B7D1',
      healthcare: '#96CEB4',
      education: '#FFEAA7',
      engineering: '#DDA0DD'
    }
    return colors[domain as keyof typeof colors] || '#999'
  }
}