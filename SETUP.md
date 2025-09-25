# AI Career Mentor - Development Setup

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Gemini AI API Key (required for AI-powered features)
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Replace `your_actual_gemini_api_key_here` in your `.env` file

### Development Mode

If you don't have a Gemini API key, the application will work with fallback recommendations:

- Career recommendations will use curated, static recommendations
- All other features will work normally
- The gamification system will function fully
- You'll see a notice that AI features are using fallback data

### Features That Require API Key

- **AI-Powered Career Recommendations**: Personalized career suggestions based on user profile and assessment
- **Dynamic Learning Path Generation**: AI-generated learning roadmaps
- **Intelligent Skill Gap Analysis**: AI-powered skill assessment and recommendations

### Features That Work Without API Key

- **Gamification System**: Full achievement, XP, and milestone tracking
- **Progress Tracking**: Learning activity tracking and progress visualization
- **Resume Analysis**: Basic resume parsing and optimization suggestions
- **Career Assessment**: Comprehensive career interest and personality assessment
- **Fallback Recommendations**: Curated career recommendations based on user profile

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## API Status

The application will automatically detect if the Gemini API is configured and show appropriate messages to users. You can check the API status in the browser console.

## Troubleshooting

### "API key not configured" Error

This error appears when:
- No `.env` file exists
- The `VITE_GEMINI_API_KEY` is empty or set to the placeholder value
- The API key is invalid

**Solution**: Follow the "Getting a Gemini API Key" steps above.

### Fallback Recommendations

If you see "Using curated career recommendations" messages, it means:
- The API key is not configured (expected in development)
- The application is working correctly with fallback data
- All features except AI-powered recommendations are fully functional

## Production Deployment

For production deployment, ensure:
1. Set the `VITE_GEMINI_API_KEY` environment variable
2. The API key has proper permissions and quotas
3. Test the API connection before deploying

## Development Notes

- The gamification system is fully functional regardless of API configuration
- Fallback recommendations are comprehensive and personalized based on user profile
- The application gracefully handles API failures and provides meaningful user feedback