# EduNavigator - AI-Powered Career Guidance Platform

**Map your future, one skill at a time.**

EduNavigator is a comprehensive, AI-powered career guidance platform that helps students and professionals navigate their educational and career journey with confidence. From career exploration to job readiness, we provide personalized recommendations, skill-building roadmaps, and intelligent resume optimization.

![EduNavigator](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

### **AI-Powered Career Discovery**
- **Smart Career Assessment** - Simplified 2-question domain-based career assessment
- **Personalized Recommendations** - AI-generated career suggestions using Google Gemini
- **Career Fit Scoring** - Intelligent compatibility scoring for different career paths
- **Interactive Flowcharts** - Visual career path with courses, internships, jobs, and companies
- **Alternative Paths** - Multiple career options based on your unique profile

### **Intelligent Resume System**
- **AI Resume Optimizer** - Upload PDF/text resumes for comprehensive AI analysis
- **Automatic Skill Extraction** - AI extracts and categorizes skills from resume content
- **ATS Score Simulation** - Applicant Tracking System compatibility scoring
- **Job-Specific Optimization** - Tailored feedback for specific job descriptions
- **Detailed Analysis** - In-depth resume improvement suggestions

### **Learning & Education Tools**
- **Learning Assistant** - AI-powered document analysis and study material generation
- **PDF/Text Processing** - Upload lectures, PDFs, or notes for AI summarization
- **Smart Notes** - AI-generated notes with key points and concepts
- **Interactive Glossary** - Important terms and definitions with context
- **Study Materials** - Organized content optimized for learning and review

### **Skill Development & Analytics**
- **Skill Gap Analysis** - Compare current skills vs. target career requirements
- **Learning Roadmaps** - Personalized learning paths with course recommendations
- **Progress Tracking** - Visual progress monitoring for individual skills
- **Course Integration** - Recommendations for Udemy, Coursera, LinkedIn Learning, freeCodeCamp
- **Proficiency Assessment** - AI-powered skill level evaluation and tracking

### **Gamification & Progress**
- **Achievement System** - Badges and rewards for completing milestones
- **Experience Points** - Point-based progression system with levels
- **Progress Dashboard** - Visual charts and analytics for skill development
- **Milestone Tracking** - Career and learning milestone monitoring
- **User Levels** - Gamified progression system to keep you motivated

## 🛠 Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict type checking
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Radix UI** - Accessible, unstyled UI components
- **React Router** - Client-side routing and navigation
- **React Flow** - Interactive flowchart and node-based visualizations

### **AI Integration**
- **Google Gemini AI** - Advanced AI for career recommendations and analysis
- **Multi-Model Support** - gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash
- **Fallback System** - Robust multi-model fallback for reliable AI responses
- **Frontend Processing** - All AI operations handled client-side

### **File Processing**
- **PDF.js** - Client-side PDF parsing and text extraction
- **React Dropzone** - Drag-and-drop file upload interface
- **Multi-format Support** - PDF, TXT, and manual text input

### **State Management & Storage**
- **Zustand** - Lightweight state management
- **Local Storage** - Client-side data persistence
- **React Hook Form** - Efficient form handling and validation
- **Zod** - TypeScript-first schema validation

## Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Gemini API key (optional - platform works with fallback data)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/aakanksha-singh-hub/VirtuHack-genai.git
cd VirtuHack-genai
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
# Copy the environment template
cp .env.example .env

# Add your Gemini API key (optional)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173` to see EduNavigator in action!

### Production Build
```bash
npm run build
npm run preview
```

## 🔐 API Configuration

### Google Gemini API (Optional)
EduNavigator uses Google Gemini AI for enhanced features. While optional, it provides the best experience:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Features with API Key
- ✅ AI-powered career recommendations
- ✅ Dynamic learning path generation
- ✅ Intelligent skill gap analysis
- ✅ Resume optimization with AI feedback
- ✅ Learning assistant document analysis

### Features without API Key
- ✅ Comprehensive career assessment
- ✅ Fallback career recommendations
- ✅ Gamification and progress tracking
- ✅ Basic resume analysis
- ✅ Interactive career flowcharts

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── common/         # Common layout components
│   ├── gamification/   # Achievement and progress components
│   └── resume/         # Resume-related components
├── pages/              # Main application pages
│   ├── Landing.tsx     # Landing page
│   ├── CareerAssessment.tsx
│   ├── ResumeUpload.tsx
│   ├── LearningAssistant.tsx
│   └── ...
├── lib/                # Core application logic
│   ├── services/       # AI and business logic services
│   ├── stores/         # State management
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── router/             # Application routing
└── styles/             # Global styles and themes
```

## 🎯 Usage Guide

### 1. **Start Your Journey**
- Begin with the career assessment to discover your interests and strengths
- Answer the simplified 2-question assessment for quick results

### 2. **Explore Career Paths**
- View personalized career recommendations with fit scores
- Explore interactive flowcharts showing your path from courses to dream job
- Discover alternative career options in your areas of interest

### 3. **Optimize Your Resume**
- Upload your resume (PDF or text) for AI-powered analysis
- Get specific feedback and improvement suggestions
- Receive ATS compatibility scores and optimization tips

### 4. **Enhance Your Learning**
- Use the Learning Assistant to analyze study materials
- Upload PDFs, lectures, or notes for AI-generated summaries
- Get organized study materials with key concepts and glossaries

### 5. **Track Your Progress**
- Monitor your skill development and learning milestones
- Earn achievements and experience points for completed activities
- Visualize your growth with comprehensive progress dashboards

## 🌟 Who Is This For?

- **High School Students** - Exploring future career options and planning education
- **University Students** - Building skills for internships and job preparation
- **Recent Graduates** - Optimizing job search and career launch strategies
- **Career Changers** - Exploring new career paths and identifying skill gaps
- **Professionals** - Continuous learning and career development planning

## 🚀 Deployment

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm run start`
4. Add environment variables in Render dashboard
5. Deploy!

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
git commit -m 'Add amazing feature'
```
4. **Push to the branch**
```bash
git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components and design patterns
- Write meaningful commit messages
- Test your changes across different devices
- Ensure accessibility standards are met

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powering our intelligent recommendations
- **React Flow** - For beautiful interactive flowcharts
- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For rapid and responsive styling
- **PDF.js** - For client-side PDF processing

## 📞 Support

Having issues or questions? We're here to help!

- 📧 **Email**: support@edunavigator.com
- 🐛 **Bug Reports**: [Create an issue](https://github.com/aakanksha-singh-hub/VirtuHack-genai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/aakanksha-singh-hub/VirtuHack-genai/discussions)

---

**Made with ❤️ by the EduNavigator Team**

*Empowering every student to navigate their educational and professional journey with confidence and clarity.*