import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserProfile, CareerRecommendation, AlternativeCareer } from '../types';
import { config } from '../config';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export class GeminiService {
  static async generateCareerPath(profile: UserProfile): Promise<CareerRecommendation> {
    // Check if API key is available
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback data');
      throw new Error('API key not configured');
    }

    try {
      const prompt = `
        You are a career advisor AI. Based on the user's profile, generate a comprehensive career recommendation.

        User Profile:
        - Name: ${profile.name}
        - Age: ${profile.age}
        - Education: ${profile.educationLevel}
        - Skills: ${profile.skills.join(', ')}
        - Career Interest: ${profile.careerInterest}
        - Location: ${profile.location || 'Not specified'}
        
        ${profile.resume ? `
        Resume Information (Extracted):
        - Resume Skills: ${profile.resume.extractedInfo.skills.join(', ')}
        - Work Experience: ${profile.resume.extractedInfo.experience.length} positions
        - Education: ${profile.resume.extractedInfo.education.length} degrees
        - Languages: ${profile.resume.extractedInfo.languages?.join(', ') || 'Not specified'}
        - Certifications: ${profile.resume.extractedInfo.certifications?.join(', ') || 'Not specified'}
        - Professional Summary: ${profile.resume.extractedInfo.summary || 'Not provided'}
        
        Work Experience Details:
        ${profile.resume.extractedInfo.experience.map(exp => 
          `- ${exp.position} at ${exp.company} (${exp.duration}): ${exp.description}`
        ).join('\n')}
        
        Education Details:
        ${profile.resume.extractedInfo.education.map(edu => 
          `- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.year})`
        ).join('\n')}
        ` : ''}

        Please provide a detailed career recommendation in the following JSON format:
        {
          "primaryCareer": "Main career title",
          "relatedRoles": ["Role 1", "Role 2", "Role 3", "Role 4"],
          "summary": "Personalized summary explaining why this career path fits the user",
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
              "title": "Alternative Career 1",
              "description": "Description of alternative career",
              "matchScore": 85,
              "salary": "$70k-100k",
              "requirements": ["Skill 1", "Skill 2", "Skill 3"],
              "growth": "high"
            },
            {
              "id": "alt2",
              "title": "Alternative Career 2",
              "description": "Description of alternative career",
              "matchScore": 75,
              "salary": "$60k-90k",
              "requirements": ["Skill 1", "Skill 2", "Skill 3"],
              "growth": "medium"
            },
            {
              "id": "alt3",
              "title": "Alternative Career 3",
              "description": "Description of alternative career",
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
        ${profile.resume ? 'Use the detailed resume information to create a more personalized and accurate career path that builds on their existing experience and skills.' : ''}
        Provide 3 alternative careers with realistic match scores, salaries, and requirements.
        
        IMPORTANT: All edges must include sourceHandle and targetHandle properties:
        - Use "bottom" for sourceHandle and "top" for targetHandle for vertical connections
        - Use "right" for sourceHandle and "left" for targetHandle for horizontal connections
        - This is required for React Flow to render the connections properly
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const careerData = JSON.parse(jsonMatch[0]);
      return careerData as CareerRecommendation;
    } catch (error) {
      console.error('Error generating career path with Gemini:', error);
      // Fallback to mock data if API fails
      return this.getFallbackRecommendation(profile);
    }
  }

  static async suggestAlternatives(profile: UserProfile): Promise<AlternativeCareer[]> {
    // Check if API key is available
    if (!config.geminiApiKey) {
      console.warn('Gemini API key not found, using fallback data');
      throw new Error('API key not configured');
    }

    try {
      const prompt = `
        Based on this user profile, suggest 3 alternative career paths:
        - Name: ${profile.name}
        - Age: ${profile.age}
        - Education: ${profile.educationLevel}
        - Skills: ${profile.skills.join(', ')}
        - Career Interest: ${profile.careerInterest}
        - Location: ${profile.location || 'Not specified'}
        
        ${profile.resume ? `
        Resume Information (Extracted):
        - Resume Skills: ${profile.resume.extractedInfo.skills.join(', ')}
        - Work Experience: ${profile.resume.extractedInfo.experience.length} positions
        - Education: ${profile.resume.extractedInfo.education.length} degrees
        - Professional Summary: ${profile.resume.extractedInfo.summary || 'Not provided'}
        ` : ''}

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
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      return JSON.parse(jsonMatch[0]) as AlternativeCareer[];
    } catch (error) {
      console.error('Error generating alternatives with Gemini:', error);
      return this.getFallbackAlternatives(profile);
    }
  }

  private static getFallbackRecommendation(profile: UserProfile): CareerRecommendation {
    // Fallback to mock data if API fails
    const mockPaths = {
      'software-developer': {
        nodes: [
          { id: '1', type: 'course' as const, title: 'Learn JavaScript', description: 'Master the fundamentals of JavaScript programming', duration: '3 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
          { id: '2', type: 'course' as const, title: 'React Development', description: 'Build modern web applications with React', duration: '4 months', difficulty: 'intermediate' as const, position: { x: 300, y: 100 } },
          { id: '3', type: 'internship' as const, title: 'Frontend Internship', description: '6-month internship at a tech startup', duration: '6 months', position: { x: 500, y: 100 } },
          { id: '4', type: 'job' as const, title: 'Junior Developer', description: 'Entry-level software developer position', salary: '$60k-80k', position: { x: 700, y: 100 } },
          { id: '5', type: 'job' as const, title: 'Senior Developer', description: 'Lead development projects and mentor juniors', salary: '$90k-120k', position: { x: 900, y: 100 } },
          { id: '6', type: 'company' as const, title: 'Google', description: 'Work at one of the top tech companies', position: { x: 1100, y: 100 } },
          { id: '7', type: 'skill' as const, title: 'TypeScript', description: 'Advanced JavaScript with type safety', position: { x: 100, y: 300 } },
          { id: '8', type: 'skill' as const, title: 'Node.js', description: 'Backend development with JavaScript', position: { x: 300, y: 300 } },
        ],
        edges: [
          { id: 'e1-2', source: '1', target: '2', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const, animated: true },
          { id: 'e2-3', source: '2', target: '3', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const, animated: true },
          { id: 'e3-4', source: '3', target: '4', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const, animated: true },
          { id: 'e4-5', source: '4', target: '5', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const, animated: true },
          { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const, animated: true },
          { id: 'e1-7', source: '1', target: '7', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const },
          { id: 'e2-8', source: '2', target: '8', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const },
        ]
      }
    };

    const pathData = mockPaths['software-developer'];
    return {
      primaryCareer: 'Software Developer',
      relatedRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'],
      careerPath: {
        nodes: pathData.nodes,
        edges: pathData.edges
      },
      alternatives: this.getFallbackAlternatives(profile),
      summary: `Based on your interest in ${profile.careerInterest} and skills in ${profile.skills.join(', ')}, a career in software development would be perfect for you. Your skills provide a strong foundation for building modern web applications.`
    };
  }

  private static getFallbackAlternatives(_profile: UserProfile): AlternativeCareer[] {
    return [
      { id: 'alt1', title: 'DevOps Engineer', description: 'Focus on deployment and infrastructure', matchScore: 85, salary: '$70k-100k', requirements: ['Docker', 'Kubernetes', 'AWS'], growth: 'high' },
      { id: 'alt2', title: 'UI/UX Designer', description: 'Design user interfaces and experiences', matchScore: 75, salary: '$60k-90k', requirements: ['Figma', 'User Research', 'Prototyping'], growth: 'medium' },
      { id: 'alt3', title: 'Technical Writer', description: 'Create technical documentation', matchScore: 70, salary: '$50k-80k', requirements: ['Writing', 'Technical Knowledge', 'Tools'], growth: 'medium' }
    ];
  }
}
