// Environment configuration
export const config = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  isProduction: import.meta.env.PROD || false,
};

// Validate required environment variables
export const validateConfig = () => {
  if (!config.geminiApiKey && config.isProduction) {
    console.warn('VITE_GEMINI_API_KEY is not set. Gemini API features will not work.');
    return false;
  }
  return true;
};
