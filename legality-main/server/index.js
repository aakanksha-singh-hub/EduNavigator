import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { analyzeDocument } from "./services/documentAnalyzer.js";
import { extractTextFromFile } from "./services/textExtractor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, DOCX, and TXT files are allowed."
        )
      );
    }
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Legality API Server",
    status: "running",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      analyzeDocument: "/api/analyze-document",
      askQuestion: "/api/ask-question",
      generateQuestions: "/api/generate-questions",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    service: "Legality API",
  });
});

// Document upload and analysis endpoint
app.post(
  "/api/analyze-document",
  upload.single("document"),
  async (req, res) => {
    try {
      let documentText = "";

      if (req.file) {
        // Extract text from uploaded file
        documentText = await extractTextFromFile(req.file);
      } else if (req.body.text) {
        // Use provided text
        documentText = req.body.text;
      } else {
        return res.status(400).json({ error: "No document or text provided" });
      }

      if (!documentText.trim()) {
        return res.status(400).json({
          error: "Document appears to be empty or text could not be extracted",
        });
      }

      // Analyze document with Gemini AI
      const analysis = await analyzeDocument(genAI, documentText);

      res.json({
        success: true,
        analysis,
        documentText: documentText,
        documentLength: documentText.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Document analysis error:", error);

      // Provide more specific error messages
      let errorMessage = "Failed to analyze document";
      if (error.message.includes("fetch failed")) {
        errorMessage =
          "AI service is currently unavailable. Please check your internet connection and API key configuration.";
      } else if (error.message.includes("API key")) {
        errorMessage =
          "Invalid API key configuration. Please check your GEMINI_API_KEY environment variable.";
      }

      res.status(500).json({
        error: errorMessage,
        details: error.message,
      });
    }
  }
);

// Q&A endpoint for document-specific questions
app.post("/api/ask-question", async (req, res) => {
  try {
    const { question, documentText } = req.body;

    if (!question || !documentText) {
      return res
        .status(400)
        .json({ error: "Question and document text are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based ONLY on the following legal document, answer this question: "${question}"

Document:
${documentText}

Instructions:
- Answer only based on information found in the document
- Use **bold** text to emphasize key points and important terms
- Use *italics* for document references and legal terminology  
- Include direct quotes from the document to support your answer
- Use bullet points (-) to list multiple items when appropriate
- If the information is not in the document, say "This information is not found in the provided document"
- Be specific and cite the relevant sections

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({
      question,
      answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Q&A error:", error);

    let errorMessage = "Failed to answer question";
    if (error.message.includes("fetch failed")) {
      errorMessage =
        "AI service is currently unavailable. Please check your internet connection and API key configuration.";
    } else if (error.message.includes("API key")) {
      errorMessage =
        "Invalid API key configuration. Please check your GEMINI_API_KEY environment variable.";
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message,
    });
  }
});

// Generate suggested questions endpoint
app.post("/api/generate-questions", async (req, res) => {
  try {
    const { documentText } = req.body;

    if (!documentText) {
      return res.status(400).json({ error: "Document text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on this legal document, generate 5 specific, relevant questions that someone should ask to better understand their obligations and rights.

Document:
${documentText}

Requirements:
- Questions should be specific to this document's content
- Focus on key obligations, risks, deadlines, fees, and termination conditions
- Make questions practical and actionable
- Use clear, non-legal language

Format as JSON array of strings:
["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]

Respond with ONLY the JSON array:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response to extract JSON
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const questions = JSON.parse(text);
      res.json({
        questions: Array.isArray(questions) ? questions : [],
        timestamp: new Date().toISOString(),
      });
    } catch (parseError) {
      console.error("Error parsing questions:", parseError);
      // Fallback to default questions if parsing fails
      res.json({
        questions: [
          "What are my main obligations under this agreement?",
          "What happens if I need to terminate this agreement?",
          "Are there any fees or penalties I should be aware of?",
          "What are the notice requirements in this document?",
          "Are there any automatic renewal clauses?",
        ],
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Question generation error:", error);

    let errorMessage = "Failed to generate questions";
    if (error.message.includes("fetch failed")) {
      errorMessage =
        "AI service is currently unavailable. Please check your internet connection and API key configuration.";
    } else if (error.message.includes("API key")) {
      errorMessage =
        "Invalid API key configuration. Please check your GEMINI_API_KEY environment variable.";
    }

    res.status(500).json({
      error: errorMessage,
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Legality server running on http://localhost:${PORT}`);
  console.log("📄 Document analysis ready");
  console.log("🤖 Gemini AI configured");
});
