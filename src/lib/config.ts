// Environment configuration
export const config = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDNHICK5b7WqZ7n4aPZl3n9zUH98ohdSTw',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  appTitle: import.meta.env.VITE_APP_TITLE || 'EduNavigator',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Intelligent Career & Job Application Platform',
  isProduction: import.meta.env.PROD || false,
  isDevelopment: import.meta.env.DEV || true,
};

// Immediate debug log to see what's happening during module load
console.log('Config module loaded:');
console.log('- VITE_GEMINI_API_KEY from env:', import.meta.env.VITE_GEMINI_API_KEY ? 'EXISTS' : 'MISSING');
console.log('- RAW VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY);
console.log('- Final geminiApiKey:', config.geminiApiKey);
console.log('- Environment mode:', import.meta.env.MODE);

// Debug function to check configuration
export const debugConfig = () => {
  const debugInfo = {
    geminiApiKey: config.geminiApiKey ? `${config.geminiApiKey.substring(0, 10)}...` : 'NOT SET',
    apiKeyLength: config.geminiApiKey?.length || 0,
    isProduction: config.isProduction,
    isDevelopment: config.isDevelopment,
    envVars: {
      VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY ? 'SET' : 'NOT SET',
      raw: import.meta.env.VITE_GEMINI_API_KEY ? import.meta.env.VITE_GEMINI_API_KEY.substring(0, 10) + '...' : 'EMPTY'
    }
  };
  console.log('Config Debug:', debugInfo);
  console.table(debugInfo);
  return debugInfo;
};

// Validate required environment variables
export const validateConfig = () => {
  if (!config.geminiApiKey && config.isProduction) {
    console.warn('VITE_GEMINI_API_KEY is not set. Gemini API features will not work.');
    return false;
  }
  return true;
};
