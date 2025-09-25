// Simple test to verify Gemini integration
import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGemini() {
  try {
    const apiKey = 'AIzaSyDtd4Kxwf9RQEhFaDZRqZaFVVa6AyAV5-E';
    console.log('Testing Gemini AI integration...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // First, let's list available models
    console.log('Listing available models...');
    try {
      const listResult = await genAI.listModels();
      console.log('Available models:', listResult);
    } catch (listError) {
      console.log('Could not list models:', listError.message);
    }

    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

    const prompt = "Say hello world";
    
    console.log('Sending simple request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini AI is working!');
    console.log('Response:', text);
    
    return true;
  } catch (error) {
    console.error('❌ Gemini AI test failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

testGemini().then(success => {
  if (success) {
    console.log('\n🎉 Gemini integration is working correctly!');
  } else {
    console.log('\n💥 There are issues with the Gemini integration');
  }
});