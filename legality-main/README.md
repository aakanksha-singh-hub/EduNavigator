# Legality – Know what you're signing

Legality is an AI-powered assistant that simplifies complex legal documents such as rental agreements, loan contracts, and terms of service. Our mission is to empower individuals and small businesses to understand legal documents clearly and make informed decisions without being trapped by legal jargon.

## Why Legality?

Legal documents are often filled with dense and confusing language. This creates an imbalance where people may miss critical details like:

> Unfair clauses such as automatic renewals or hidden fees  
> Complex termination terms and lengthy notice periods  
> One-sided obligations and liabilities  
> Jurisdiction or arbitration clauses that restrict user rights

Legality translates this complexity into accessible guidance, ensuring that key points and risks are easy to understand.

## Features

When you upload a document, Legality provides:

- Plain-language summaries of key terms
- Risk flags that highlight unfavorable clauses
- Question-and-answer support with citations to the original text
- A glossary that explains legal jargon in simple terms
- Downloadable reports for easy reference and sharing

## How It Works

```
User uploads legal document
         |
         v
Document AI extracts and parses text
         |
         v
Generative AI (Vertex AI Gemini) analyzes clauses
         |
         v
Summaries + Risk Flags generated
         |
         v
User views plain-language explanation
         |
         v
Optional: Ask follow-up questions (Q&A)
         |
         v
Downloadable report or next steps (e.g., lawyer connect)
```

## Example Output

**Lease term:** 12 months starting 01 Oct 2025  
**Early exit fee:** 2 months' rent  
**Rent may increase** up to 8% annually upon renewal  
**Notice period:** 60 days required to avoid auto-renewal  
**High-risk clause:** Mandatory arbitration, limiting ability to take legal action in court

## Tech Stack

Legality is built using Google Cloud and Firebase services for scalability, security, and performance.

- **Frontend:** React
- **Backend:** Firebase Functions (serverless, Node.js/TypeScript)
- **Database:** Firestore for session data, summaries, and chat history
- **Storage:** Firebase Storage for secure file handling
- **AI Services:** Will decide, from Hugging Face will choose a better model or go with Vertex AI

## Privacy and Safety

Since legal documents contain sensitive information, Legality is designed with privacy as a priority:

> Files are encrypted and processed securely  
> Documents can be auto-deleted after processing (no forced storage)  
> Every AI answer is grounded with direct citations from the document  
> A clear disclaimer: Legality is not a substitute for professional legal advice

## Additional Features

- **MVP:** Document upload, summary generation, and risk flagging
- **Multilingual support** (starting with English and Hindi)
- **Side-by-side contract comparison**
- **Voice mode** for accessibility
- **Lawyer connect option** for high-risk findings

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aditisingh02/legality.git
   cd legality
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   ```bash
   # In server/.env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

5. **Start the development servers**

   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev

   # Terminal 2 - Client
   cd client
   npm run dev
   ```

## Deployment

### Production Deployment (Vercel + Render)

#### Backend Deployment (Render)

1. **Deploy to Render:**

   - Connect your GitHub repository to Render
   - Set the **Root Directory** to `server`
   - Render will automatically detect the `render.yaml` configuration
   - Set the following environment variables in Render:
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `NODE_ENV`: `production`

2. **Get your Render API URL:**
   - After deployment, copy your Render service URL (e.g., `https://legality-api.onrender.com`)

#### Frontend Deployment (Vercel)

1. **Deploy to Vercel:**

   - Connect your GitHub repository to Vercel
   - Set the **Root Directory** to `client`
   - Set **Build Command** to `npm run build`
   - Set **Output Directory** to `dist`

2. **Configure Environment Variables in Vercel:**

   - Go to your Vercel project settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-render-app.onrender.com` (your Render URL)

3. **Update CORS Configuration:**
   - After Vercel deployment, update the CORS origins in `server/index.js`
   - Replace the Vercel URLs with your actual deployment URLs

#### Alternative: Vercel Serverless Functions

If you prefer to deploy everything on Vercel:

1. **Move API routes to Vercel functions:**
   - Create `client/api/` directory
   - Convert Express routes to Vercel serverless functions
   - Update environment variables accordingly

### Environment Variables

#### Server (.env)

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=10000
```

#### Client (.env.local)

```bash
VITE_API_URL=https://your-render-app.onrender.com
```

### Post-Deployment Steps

1. **Test the application:**

   - Upload a test document
   - Verify API calls work correctly
   - Check that Q&A functionality works

2. **Monitor logs:**

   - Check Render logs for backend errors
   - Check Vercel function logs for frontend issues

3. **Performance optimization:**
   - Monitor API response times
   - Consider implementing caching if needed

## Contributing

We welcome contributions! Please see our Contributing Guidelines for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Legality** - Making legal documents accessible to everyone.
