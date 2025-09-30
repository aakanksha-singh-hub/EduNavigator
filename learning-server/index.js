import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeDocument } from "./services/documentAnalyzer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Check for required environment variables
if (
  !process.env.GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
) {
  console.error("❌ GEMINI_API_KEY is not configured!");
  console.error("📝 Please create a .env file in the server directory with:");
  console.error("   GEMINI_API_KEY=your_actual_api_key");
  console.error(
    "🔗 Get your API key from: https://makersuite.google.com/app/apikey"
  );
  process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173",
  "http://localhost:5174", 
  "http://127.0.0.1:5174",
  "http://localhost:5175", 
  "http://127.0.0.1:5175"
];

// Add production frontend URL if specified
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/plain",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only TXT files are allowed."
        )
      );
    }
  },
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Learning Assistant Server is running!",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Document analysis endpoint
app.post("/api/analyze", upload.single("document"), async (req, res) => {
  try {
    let documentText = "";

    if (req.file) {
      // Handle file upload
      documentText = req.file.buffer.toString("utf-8");
    } else if (req.body.text) {
      // Handle text input
      documentText = req.body.text;
    } else {
      return res.status(400).json({
        success: false,
        error: "No document or text provided",
      });
    }

    if (!documentText.trim()) {
      return res.status(400).json({
        success: false,
        error: "Document appears to be empty",
      });
    }

    console.log("📄 Analyzing document...");
    const analysis = await analyzeDocument(genAI, documentText);

    console.log("✅ Analysis complete");
    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("❌ Analysis failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Document analysis failed",
    });
  }
});

// Quiz generation endpoint
app.post("/api/generate-quiz", express.json(), async (req, res) => {
  try {
    const { documentText, questionCount = 5 } = req.body;

    if (!documentText?.trim()) {
      return res.status(400).json({
        success: false,
        error: "No document text provided",
      });
    }

    console.log("🧠 Generating quiz...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Based on the following document, generate ${questionCount} educational quiz questions.
      
      Document:
      ${documentText}
      
      Requirements:
      - Create diverse question types (multiple choice, true/false, short answer)
      - Questions should test comprehension, analysis, and application
      - Include proper explanations for each answer
      - Vary difficulty levels (BEGINNER, INTERMEDIATE, ADVANCED)
      - Make questions educational and engaging
      
      Please respond with a JSON array of quiz questions in this exact format:
      [
        {
          "id": "unique-id",
          "type": "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER",
          "question": "Question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "correct answer",
          "explanation": "detailed explanation",
          "difficulty": "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
          "tags": ["tag1", "tag2"]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const quizData = JSON.parse(jsonMatch[0]);
    
    const processedQuestions = quizData.map((q, index) => ({
      id: q.id || `question-${Date.now()}-${index}`,
      type: q.type || 'SHORT_ANSWER',
      question: q.question,
      options: q.options || undefined,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'No explanation provided.',
      difficulty: q.difficulty || 'MEDIUM',
      tags: q.tags || ['generated']
    }));

    console.log("✅ Quiz generation complete");
    res.json({
      success: true,
      data: processedQuestions,
    });
  } catch (error) {
    console.error("❌ Quiz generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Quiz generation failed",
    });
  }
});

// Ask question endpoint for Q&A chat
app.post("/api/ask-question", express.json(), async (req, res) => {
  try {
    const { question, documentText, chatHistory = [] } = req.body;

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        error: "No question provided",
      });
    }

    if (!documentText?.trim()) {
      return res.status(400).json({
        success: false,
        error: "No document context provided",
      });
    }

    console.log("💬 Processing Q&A question...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Build context from chat history
    const chatContext = chatHistory.length > 0 
      ? chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')
      : '';
    
    const prompt = `
      You are an AI assistant helping users understand documents by answering their questions.
      
      Document Context:
      ${documentText}
      
      ${chatContext ? `Previous Conversation:\n${chatContext}\n` : ''}
      
      User Question: ${question}
      
      Instructions:
      - Answer the question based on the document content
      - Be accurate and specific
      - Quote relevant parts of the document when applicable
      - If the question cannot be answered from the document, say so clearly
      - Keep responses conversational but informative
      - Use markdown formatting for better readability
      - If referencing specific sections, use quotes
      
      Please provide a helpful and accurate response.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    console.log("✅ Q&A response generated");
    res.json({
      success: true,
      data: {
        answer: answer,
        timestamp: new Date().toISOString()
      },
    });
  } catch (error) {
    console.error("❌ Q&A failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Question answering failed",
    });
  }
});

// Generate suggested questions endpoint
app.post("/api/generate-questions", express.json(), async (req, res) => {
  try {
    const { documentText, questionCount = 5 } = req.body;

    if (!documentText?.trim()) {
      return res.status(400).json({
        success: false,
        error: "No document text provided",
      });
    }

    console.log("❓ Generating suggested questions...");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Based on the following document, generate ${questionCount} thoughtful questions that would help someone better understand the content.
      
      Document:
      ${documentText}
      
      Requirements:
      - Generate questions that explore key concepts, implications, and details
      - Include questions about main ideas, supporting details, and practical applications
      - Make questions natural and conversational
      - Vary the types of questions (clarification, analysis, examples, etc.)
      - Focus on questions that would genuinely help understanding
      
      Please respond with a JSON array of suggested questions in this exact format:
      [
        {
          "id": "unique-id",
          "question": "What does this mean?",
          "category": "clarification" | "analysis" | "examples" | "implications" | "details"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const questionsData = JSON.parse(jsonMatch[0]);
    
    const processedQuestions = questionsData.map((q, index) => ({
      id: q.id || `suggested-${Date.now()}-${index}`,
      question: q.question,
      category: q.category || 'general'
    }));

    console.log("✅ Suggested questions generated");
    res.json({
      success: true,
      data: processedQuestions,
    });
  } catch (error) {
    console.error("❌ Question generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Question generation failed",
    });
  }
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "SmartApply AI Server is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("🔥 Server error:", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SmartApply AI server running on port ${PORT}`);
  console.log(`📄 Document analysis ready`);
  console.log(`🤖 Gemini AI configured`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  if (process.env.FRONTEND_URL) {
    console.log(`🖥️ Frontend URL: ${process.env.FRONTEND_URL}`);
  }
});