export async function analyzeDocument(genAI, documentText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Generate summary
  const summary = await generateSummary(model, documentText);

  // Assess risks
  const riskAssessment = await assessRisks(model, documentText);

  // Extract glossary terms
  const glossary = await extractGlossary(model, documentText);

  // Generate risk mitigation recommendations if risks are found
  const recommendations = await generateRiskMitigations(model, documentText, riskAssessment.risks);

  return {
    summary,
    riskAssessment,
    glossary,
    recommendations,
    documentLength: documentText.length,
  };
}

async function generateSummary(model, documentText) {
  const prompt = `Analyze this legal document and provide a plain-language summary in exactly 5-7 bullet points. Focus on:
- Key obligations and responsibilities
- Important deadlines and time periods
- Financial terms and penalties
- Termination conditions
- User rights and limitations

Document:
${documentText}

Instructions:
- Use **bold** text to emphasize key terms, amounts, and deadlines
- Use *italics* for legal terminology and document references
- Make each point clear and actionable

Provide ONLY the bullet points, no additional text:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log("Raw summary response:", text);

  // Clean up the response and split into lines
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  console.log("Processed lines:", lines);

  // If we have bullet points, filter for them
  const bulletPoints = lines.filter(
    (line) =>
      line.startsWith("•") ||
      line.startsWith("-") ||
      line.startsWith("*") ||
      line.match(/^\d+\./)
  );

  console.log("Found bullet points:", bulletPoints);

  // If we found bullet points, use them, otherwise use the first few non-empty lines
  if (bulletPoints.length > 0) {
    return bulletPoints.slice(0, 7);
  } else {
    return lines.slice(0, 7);
  }
}

async function assessRisks(model, documentText) {
  const prompt = `Analyze this legal document for risk factors. Identify clauses that could be unfavorable to the user and assign risk levels.

Document:
${documentText}

For each risk found, provide:
1. Risk Level: HIGH, MEDIUM, or LOW
2. Clause Description: Brief description of the problematic clause (use **bold** for key terms)
3. Risk Explanation: Why this is risky in plain language (use **bold** for important points, *italics* for legal terms)
4. Quote: Direct quote from the document

Format as JSON array:
[
  {
    "riskLevel": "HIGH|MEDIUM|LOW",
    "clause": "Brief description with **bold** key terms",
    "explanation": "Why this is risky with **bold** important points and *italic* legal terms",
    "quote": "Direct quote from document"
  }
]

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
    const risks = JSON.parse(text);

    // Calculate overall risk score
    const riskScore = calculateRiskScore(risks);

    return {
      risks,
      overallRiskScore: riskScore,
      riskLevel: getRiskLevel(riskScore),
    };
  } catch (error) {
    console.error("Error parsing risk assessment:", error);
    return {
      risks: [],
      overallRiskScore: 0,
      riskLevel: "LOW",
      error: "Could not parse risk assessment",
    };
  }
}

async function extractGlossary(model, documentText) {
  const prompt = `Extract legal jargon and complex terms from this document and provide simple definitions.

Document:
${documentText}

For each term, provide:
1. Term: The legal term or jargon
2. Definition: Simple, plain-English explanation (use **bold** for key concepts, *italics* for examples)
3. Context: How it's used in this document (use **bold** for important usage details)

Format as JSON array:
[
  {
    "term": "legal term",
    "definition": "simple explanation with **bold** key concepts and *italic* examples",
    "context": "how it's used in this document with **bold** important details"
  }
]

Focus on terms that non-lawyers would find confusing. Respond with ONLY the JSON array:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Clean up the response to extract JSON
  text = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing glossary:", error);
    return [];
  }
}

function calculateRiskScore(risks) {
  if (!risks || risks.length === 0) return 0;

  let totalScore = 0;
  const weights = { HIGH: 30, MEDIUM: 15, LOW: 5 };

  risks.forEach((risk) => {
    totalScore += weights[risk.riskLevel] || 0;
  });

  // Cap at 100
  return Math.min(totalScore, 100);
}

function getRiskLevel(score) {
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

async function generateRiskMitigations(model, documentText, risks) {
  if (!risks || risks.length === 0) {
    return [];
  }

  const prompt = `Based on the following identified risks in a legal document, provide specific, actionable recommendations to mitigate each risk. Focus on practical steps the user can take.

Document: ${documentText}

Identified Risks:
${risks.map((risk, index) => `${index + 1}. ${risk.riskLevel} RISK: ${risk.clause} - ${risk.explanation}`).join('\n')}

For each risk, provide a mitigation recommendation with:
1. Risk ID: The number of the risk (1, 2, 3, etc.)
2. Title: Brief, action-oriented title for the recommendation
3. Description: Detailed explanation of the mitigation strategy (use **bold** for key actions, *italics* for legal terms)
4. Action Steps: 3-5 specific steps the user should take
5. Priority: URGENT, HIGH, MEDIUM, or LOW based on risk level

Format as JSON array:
[
  {
    "riskId": 1,
    "title": "Action-oriented recommendation title",
    "description": "Detailed mitigation strategy with **bold** key actions and *italic* legal terms",
    "actionSteps": ["Step 1", "Step 2", "Step 3"],
    "priority": "URGENT|HIGH|MEDIUM|LOW"
  }
]

Make recommendations practical and specific to this document. Respond with ONLY the JSON array:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Clean up the response to extract JSON
  text = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    const recommendations = JSON.parse(text);
    
    // Add risk level to each recommendation based on the original risk
    return recommendations.map(rec => ({
      ...rec,
      riskLevel: risks[rec.riskId - 1]?.riskLevel || "LOW"
    }));
  } catch (error) {
    console.error("Error parsing risk mitigations:", error);
    return [];
  }
}
