import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedResumeInfo } from '../types';
import { config, debugConfig } from '../config';

// Debug configuration
console.log('ResumeService: Checking config...');
debugConfig();

// Create function to get AI instance with fallback models
const getGeminiInstance = () => {
  if (!config.geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }
  console.log('Creating Gemini instance with key:', config.geminiApiKey.substring(0, 10) + '...');
  return new GoogleGenerativeAI(config.geminiApiKey);
};

const tryMultipleModels = async (genAI: GoogleGenerativeAI, prompt: string) => {
  const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
  
  for (const modelName of models) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      console.log(`✅ ${modelName} worked!`);
      return result;
    } catch (error: any) {
      console.log(`❌ ${modelName} failed:`, error.message);
      if (error.message.includes('overloaded') && models.indexOf(modelName) < models.length - 1) {
        console.log(`Model ${modelName} is overloaded, trying next model...`);
        continue;
      }
      if (models.indexOf(modelName) === models.length - 1) {
        // This is the last model, throw the error
        throw error;
      }
    }
  }
  throw new Error('All models failed');
};

export class ResumeService {
  static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    try {
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        const text = await file.text();
        if (!text.trim()) {
          throw new Error('The uploaded text file appears to be empty. Please upload a file with content.');
        }
        return text;
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await this.extractTextFromPDF(file);
      } else {
        const extension = fileName.split('.').pop()?.toUpperCase() || 'Unknown';
        throw new Error(`Unsupported file type: ${extension}. Please upload a PDF or text file (.txt).`);
      }
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error('Failed to read the file. Please ensure the file is not corrupted and try again.');
    }
  }

  /**
   * Extract text from PDF files using PDF.js
   */
  private static async extractTextFromPDF(file: File): Promise<string> {
    try {
      // Dynamic import to avoid bundling issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source - check if worker file exists in public folder
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items and join them
        const pageText = textContent.items
          .map((item: any) => {
            // Handle both regular text items and marked content
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ');
        
        fullText += pageText + '\n\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('The PDF appears to be empty or contains no extractable text. This might be a scanned document or image-based PDF. Please try converting it to text or use a different resume format.');
      }
      
      return fullText.trim();
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      
      if (error.message && error.message.includes('extractable text')) {
        throw error; // Re-throw our custom message
      }
      
      // Provide helpful error messages for common PDF issues
      if (error.message && error.message.includes('Invalid PDF')) {
        throw new Error('The uploaded file appears to be corrupted or not a valid PDF. Please try uploading a different file.');
      }
      
      if (error.message && error.message.includes('worker')) {
        throw new Error('PDF processing is temporarily unavailable. Please convert your PDF to a text file (.txt) or copy and paste your resume content.');
      }
      
      // Generic PDF processing error
      throw new Error('Failed to extract text from PDF. This might be a scanned document or protected PDF. Please try converting to text format or use a different resume file.');
    }
  }

  static async extractResumeInfo(file: File): Promise<ExtractedResumeInfo> {
    try {
      // Check if API key is available
      if (!config.geminiApiKey) {
        console.warn('Gemini API key not found, using fallback extraction');
        return this.getFallbackExtraction();
      }

      // Extract text from file
      const extractedText = await this.extractTextFromFile(file);
      
      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the file');
      }

      const prompt = `
        You are a resume parsing AI. Extract structured information from the following resume text.
        
        Resume Text:
        ${extractedText}
        
        Please extract and return the information in the following JSON format:
        {
          "name": "Full Name (if found)",
          "email": "email@example.com (if found)",
          "phone": "phone number (if found)",
          "skills": ["skill1", "skill2", "skill3", ...],
          "experience": [
            {
              "company": "Company Name",
              "position": "Job Title",
              "duration": "Start Date - End Date",
              "description": "Job description and responsibilities",
              "skills": ["skill1", "skill2", ...]
            }
          ],
          "education": [
            {
              "institution": "University/College Name",
              "degree": "Degree Type (Bachelor's, Master's, etc.)",
              "field": "Field of Study",
              "year": "Graduation Year",
              "gpa": "GPA (if mentioned)"
            }
          ],
          "summary": "Professional summary or objective (if found)",
          "languages": ["Language1", "Language2", ...],
          "certifications": ["Certification1", "Certification2", ...]
        }
        
        Guidelines:
        - Extract all technical skills, programming languages, tools, and technologies
        - Include soft skills like communication, leadership, etc.
        - For experience, extract company names, job titles, duration, and key responsibilities
        - For education, extract institution, degree, field of study, and graduation year
        - If any field is not found, use an empty array or omit the field
        - Be thorough in extracting skills from job descriptions and experience
        - Normalize skill names (e.g., "JavaScript" not "javascript" or "JS")
        - Return only valid JSON, no additional text
      `;

      const genAI = getGeminiInstance();
      const result = await tryMultipleModels(genAI, prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const extractedInfo = JSON.parse(jsonMatch[0]) as ExtractedResumeInfo;
      
      // Ensure arrays are properly initialized
      return {
        name: extractedInfo.name || undefined,
        email: extractedInfo.email || undefined,
        phone: extractedInfo.phone || undefined,
        skills: extractedInfo.skills || [],
        experience: extractedInfo.experience || [],
        education: extractedInfo.education || [],
        summary: extractedInfo.summary || undefined,
        languages: extractedInfo.languages || [],
        certifications: extractedInfo.certifications || []
      };
    } catch (error) {
      console.error('Error extracting resume info:', error);
      return this.getFallbackExtraction();
    }
  }

  private static getFallbackExtraction(): ExtractedResumeInfo {
    return {
      skills: [],
      experience: [],
      education: [],
      languages: [],
      certifications: []
    };
  }

  static async processResumeFile(file: File): Promise<{ extractedText: string; extractedInfo: ExtractedResumeInfo }> {
    try {
      const extractedText = await this.extractTextFromFile(file);
      const extractedInfo = await this.extractResumeInfo(file);
      
      return {
        extractedText,
        extractedInfo
      };
    } catch (error) {
      console.error('Error processing resume file:', error);
      throw new Error('Failed to process resume file. Please try again.');
    }
  }
}
