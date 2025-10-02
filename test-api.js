// Simple test to verify API key works
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDNHICK5b7WqZ7n4aPZl3n9zUH98ohdSTw';

async function testAPI() {
  try {
    console.log('Testing API key:', API_KEY.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // Try different models
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`\nTesting model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Hello, this is a test message.');
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ ${modelName} works!`);
        console.log('Response:', text.substring(0, 100) + '...');
        break; // If one works, we're good
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error('API Test failed:', error);
  }
}

testAPI();