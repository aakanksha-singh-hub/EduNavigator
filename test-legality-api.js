// Test the legality server Gemini API
async function testLegalityAPI() {
  try {
    const formData = new FormData();
    const testDoc = new Blob(['This is a test legal document about contract terms and conditions.'], { type: 'text/plain' });
    formData.append('document', testDoc, 'test.txt');

    console.log('Testing legality server API...');
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Legality server API works!');
      console.log('Response:', result);
      return true;
    } else {
      console.error('❌ API request failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
}

testLegalityAPI();