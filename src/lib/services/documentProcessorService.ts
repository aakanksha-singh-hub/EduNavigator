import { DocumentAnalysisResult, QuizQuestion } from '../types/learningTypes';
import { config } from '../config';

export class DocumentProcessorService {
  /**
   * Extract text from various file types (PDF, DOCX, TXT)
   */
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
        throw new Error('PDF files are temporarily not supported. Please convert your PDF to a text file (.txt) or copy and paste the content using the "Paste Text" option.');
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        // For now, just return a message that DOCX support is coming
        throw new Error('DOCX files are not yet supported. Please save your document as a text file (.txt) or copy and paste the content using the "Paste Text" option.');
      } else {
        const extension = fileName.split('.').pop()?.toUpperCase() || 'Unknown';
        throw new Error(`Unsupported file type: ${extension}. Currently only TXT files are supported. Please use the "Paste Text" option to input your content directly.`);
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
      // For now, disable PDF support to avoid import issues
      // We can re-enable this once PDF.js is properly configured
      throw new Error('PDF support is temporarily disabled. Please convert your PDF to a text file (.txt) or copy and paste the content using the "Paste Text" option.');
      
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      throw new Error('PDF files are not currently supported. Please convert your PDF to a text file (.txt) or copy and paste the content using the "Paste Text" option.');
    }
  }

  /**
   * Analyze document content for educational purposes using Gemini AI
   */
  static async analyzeDocument(documentText: string): Promise<DocumentAnalysisResult> {
    try {
      if (!config.geminiApiKey) {
        console.warn('Gemini API key not configured, using basic analysis');
        return this.generateBasicAnalysis(documentText);
      }

      const prompt = `
Please analyze the following document for learning purposes and provide a structured response in JSON format with detailed educational content:

DOCUMENT TEXT:
${documentText}

Please respond with a JSON object that has this exact structure:
{
  "summary": ["Comprehensive summary point 1", "Summary point 2", "Summary point 3"],
  "keyPoints": [
    "📌 IMPORTANT: Detailed explanation of key concept 1 - Why this matters and how to remember it",
    "⭐ CRITICAL: In-depth explanation of key concept 2 - Real-world applications and examples", 
    "🔥 MUST KNOW: Comprehensive explanation of key concept 3 - Common mistakes to avoid"
  ],
  "glossary": [
    {
      "term": "Technical Term",
      "definition": "Detailed definition with examples and context - explain like you're teaching someone",
      "context": "Why this term is important and how it relates to the broader topic"
    }
  ],
  "documentLength": ${documentText.length},
  "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  "estimatedReadTime": 5
}

Guidelines for creating educational content:
- Summary: 3-5 comprehensive points that capture the essence of the document
- Key Points: 5-8 detailed educational notes with explanations, examples, and importance indicators
- Use emojis like 📌 IMPORTANT, ⭐ CRITICAL, 🔥 MUST KNOW, 💡 TIP, ⚠️ NOTE to highlight importance
- Glossary: 5-12 terms with detailed definitions that actually teach the concept
- Focus on WHY things matter, not just WHAT they are
- Include learning tips, memory aids, and practical applications
- Make each point substantial and educational (2-3 sentences minimum)
- Emphasize key concepts that students should prioritize
- Only respond with valid JSON, no additional text
`;

      console.log('🤖 Calling Gemini AI for document analysis...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const generatedText = result.candidates[0].content.parts[0].text;
      console.log('✅ Received AI analysis response');
      
      // Parse the JSON response
      try {
        const analysisResult = JSON.parse(generatedText);
        console.log('🎯 Successfully parsed AI analysis');
        return analysisResult as DocumentAnalysisResult;
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', generatedText);
        console.warn('⚠️ Falling back to basic analysis');
        // Fallback to basic analysis
        return this.generateBasicAnalysis(documentText);
      }

    } catch (error) {
      console.error('Error analyzing document:', error);
      console.warn('⚠️ Falling back to basic analysis');
      // Fallback to basic analysis
      return this.generateBasicAnalysis(documentText);
    }
  }

  /**
   * Generate quiz questions from document using Gemini AI
   */
  static async generateQuiz(documentText: string, questionCount: number = 5): Promise<QuizQuestion[]> {
    try {
      if (!config.geminiApiKey) {
        console.warn('Gemini API key not configured, using basic quiz generation');
        return this.generateBasicQuiz(documentText, questionCount);
      }

      const prompt = `
Create ${questionCount} quiz questions based on the following document. Respond with a JSON array of questions:

DOCUMENT TEXT:
${documentText}

Please respond with a JSON array that has this exact structure:
[
  {
    "id": "unique-id",
    "type": "MCQ" | "SHORT_ANSWER" | "TRUE_FALSE",
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Only for MCQ
    "correctAnswer": "Correct answer or option index for MCQ",
    "explanation": "Why this is the correct answer",
    "difficulty": "EASY" | "MEDIUM" | "HARD",
    "tags": ["tag1", "tag2"]
  }
]

Guidelines:
- Mix question types (MCQ, short answer, true/false)
- Focus on key concepts from the document
- Provide clear explanations
- Vary difficulty levels
- Only respond with valid JSON, no additional text
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.candidates || !result.candidates[0] || !result.candidates[0].content) {
        throw new Error('Invalid response from Gemini API');
      }

      const generatedText = result.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      try {
        const questions = JSON.parse(generatedText);
        return questions as QuizQuestion[];
      } catch (parseError) {
        console.error('Failed to parse Gemini quiz response:', generatedText);
        // Fallback to basic quiz generation
        return this.generateBasicQuiz(documentText, questionCount);
      }

    } catch (error) {
      console.error('Error generating quiz with Gemini:', error);
      // Fallback to basic quiz generation
      return this.generateBasicQuiz(documentText, questionCount);
    }
  }

  /**
   * Fallback basic document analysis
   */
  private static generateBasicAnalysis(documentText: string): DocumentAnalysisResult {
    const words = documentText.split(/\s+/).length;
    const sentences = documentText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Generate educational summary (first few sentences with context)
    const summary = sentences.slice(0, 3).map((s, i) => 
      `${i + 1}. ${s.trim()}${s.trim().endsWith('.') ? '' : '.'}`
    ).filter(s => s.length > 10);
    
    // Extract potential key terms and create educational content
    const wordFreq: { [key: string]: number } = {};
    const cleanText = documentText.toLowerCase().replace(/[^\w\s]/g, ' ');
    cleanText.split(/\s+/).forEach(word => {
      if (word.length > 4) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    const keyTerms = Object.entries(wordFreq)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 6)
      .map(([term, _]) => term);

    // Create educational key points with importance indicators
    const educationalKeyPoints = [
      `📌 IMPORTANT: This document covers ${keyTerms.length > 0 ? keyTerms[0] : 'key concepts'} - Understanding this foundation is crucial for mastering the subject.`,
      `⭐ CRITICAL: Pay special attention to ${keyTerms.length > 1 ? keyTerms[1] : 'the main themes'} as they appear frequently throughout the content.`,
      `🔥 MUST KNOW: The document contains ${sentences.length} key statements - Focus on understanding the relationships between concepts.`,
      `💡 TIP: This is ${words > 1000 ? 'a comprehensive' : words > 500 ? 'a moderate' : 'an introductory'} level document - Budget appropriate study time.`,
      `⚠️ NOTE: Key terms are mentioned multiple times - Create flashcards for better retention of important vocabulary.`
    ];

    return {
      summary: summary.length > 0 ? summary : [
        '1. This document provides educational content for study and review.',
        '2. Key concepts and terminology are presented for learning.',
        '3. The material requires careful reading and understanding.'
      ],
      keyPoints: educationalKeyPoints,
      glossary: keyTerms.slice(0, 5).map((term, i) => ({
        term: term.charAt(0).toUpperCase() + term.slice(1),
        definition: `Important term that appears frequently in this document. Understanding this concept is essential for grasping the main ideas presented.`,
        context: `This term is mentioned ${wordFreq[term]} times and represents a key concept you should focus on while studying.`
      })),
      documentLength: words,
      difficulty: words > 1000 ? 'ADVANCED' : words > 500 ? 'INTERMEDIATE' : 'BEGINNER',
      estimatedReadTime: Math.max(1, Math.ceil(words / 200))
    };
  }

  /**
   * Fallback basic quiz generation
   */
  private static generateBasicQuiz(documentText: string, questionCount: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const sentences = documentText.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
      const sentence = sentences[i].trim();
      questions.push({
        id: `question-${Date.now()}-${i}`,
        type: 'SHORT_ANSWER',
        question: `What is the main concept discussed in: "${sentence.substring(0, 100)}..."?`,
        correctAnswer: sentence.substring(0, 200),
        explanation: `This question tests comprehension of key concepts in the document.`,
        difficulty: 'MEDIUM',
        tags: ['comprehension', 'basic']
      });
    }
    
    return questions;
  }
}