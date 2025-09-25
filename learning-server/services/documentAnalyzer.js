export async function analyzeDocument(genAI, documentText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Generate educational summary
  const summary = await generateEducationalSummary(model, documentText);

  // Extract key learning points
  const keyPoints = await extractKeyPoints(model, documentText);

  // Extract glossary terms
  const glossary = await extractGlossary(model, documentText);

  // Determine difficulty level
  const difficulty = await assessDifficulty(model, documentText);

  return {
    summary,
    keyPoints,
    glossary,
    difficulty,
    documentLength: documentText.length,
    estimatedReadTime: Math.ceil(documentText.split(' ').length / 200), // ~200 words per minute
  };
}

async function generateEducationalSummary(model, documentText) {
  const prompt = `
    Analyze the following educational document and create a concise summary with key learning points.
    
    Document:
    ${documentText}
    
    Please provide:
    1. A brief overview of the main topic (1-2 sentences)
    2. 3-5 key learning points that students should understand
    3. Any important concepts or principles mentioned
    
    Format as a JSON array of summary strings:
    ["Overview sentence", "Key point 1", "Key point 2", ...]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const summaryPoints = JSON.parse(jsonMatch[0]);
      return Array.isArray(summaryPoints) ? summaryPoints : [text.split('\n')[0]];
    }
    
    // Fallback: split response by lines
    return text.split('\n').filter(line => line.trim()).slice(0, 5);
  } catch (error) {
    console.error("Error generating educational summary:", error);
    // Basic fallback
    const sentences = documentText.split(/[.!?]+/).filter(s => s.trim().length > 20);
    return sentences.slice(0, 5).map(sentence => `• ${sentence.trim()}`);
  }
}

async function extractKeyPoints(model, documentText) {
  const prompt = `
    Extract the most important learning points from this educational document.
    
    Document:
    ${documentText}
    
    Please identify:
    1. Core concepts that students must understand
    2. Key facts or information
    3. Important processes or procedures
    4. Critical thinking points
    5. Practical applications
    
    Format as a JSON array of key point strings (5-8 points max):
    ["Key point 1", "Key point 2", ...]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const keyPoints = JSON.parse(jsonMatch[0]);
      return Array.isArray(keyPoints) ? keyPoints.map(point => `• ${point}`) : [`• ${text.split('\n')[0]}`];
    }
    
    // Fallback: split response by lines
    return text.split('\n').filter(line => line.trim()).slice(0, 8).map(line => `• ${line.trim()}`);
  } catch (error) {
    console.error("Error extracting key points:", error);
    // Basic fallback
    const lines = documentText.split('\n').filter(line => line.trim().length > 10);
    const keyLines = lines.filter(line => 
      line.includes(':') || 
      line.match(/^\d+\./) || 
      line.startsWith('•') || 
      line.startsWith('-')
    ).slice(0, 8);
    
    return keyLines.length > 0 ? keyLines.map(line => `• ${line.trim()}`) : ['• Key points extracted from document'];
  }
}

async function extractGlossary(model, documentText) {
  const prompt = `
    Create a glossary of important terms from this educational document.
    
    Document:
    ${documentText}
    
    Please identify:
    1. Technical terms or jargon
    2. Key concepts that need definition
    3. Important vocabulary for understanding the topic
    4. Specialized terminology
    
    Format as a JSON array of glossary objects (max 8 terms):
    [
      {
        "term": "Term name",
        "definition": "Clear definition",
        "context": "How it's used in the document"
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const glossaryTerms = JSON.parse(jsonMatch[0]);
      return Array.isArray(glossaryTerms) ? glossaryTerms : [];
    }
    
    return [];
  } catch (error) {
    console.error("Error extracting glossary:", error);
    // Basic fallback
    const words = documentText.split(/\s+/);
    const capitalizedTerms = words
      .filter(word => /^[A-Z][a-z]+$/.test(word) && word.length > 4)
      .filter((term, index, array) => array.indexOf(term) === index)
      .slice(0, 5);
    
    return capitalizedTerms.map(term => ({
      term,
      definition: `A key concept mentioned in the document.`,
      context: `Referenced throughout the educational material.`
    }));
  }
}

async function assessDifficulty(model, documentText) {
  const prompt = `
    Analyze the difficulty level of this educational document based on:
    - Vocabulary complexity
    - Sentence structure
    - Conceptual depth
    - Technical terminology
    - Prerequisites needed
    
    Document:
    ${documentText}
    
    Respond with exactly one of these difficulty levels: BEGINNER, INTERMEDIATE, ADVANCED
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();
    
    if (['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(text)) {
      return text;
    }
    
    // Fallback to basic assessment
    return determineBasicDifficulty(documentText);
  } catch (error) {
    console.error("Error assessing difficulty:", error);
    return determineBasicDifficulty(documentText);
  }
}

function determineBasicDifficulty(documentText) {
  const wordCount = documentText.split(' ').length;
  const avgWordsPerSentence = documentText.split(/[.!?]+/).length > 0 
    ? wordCount / documentText.split(/[.!?]+/).length 
    : 0;
  
  if (wordCount < 500 || avgWordsPerSentence < 15) {
    return 'BEGINNER';
  } else if (wordCount > 1500 || avgWordsPerSentence > 25) {
    return 'ADVANCED';
  } else {
    return 'INTERMEDIATE';
  }
}