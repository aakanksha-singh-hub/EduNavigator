export interface DocumentAnalysisResult {
  summary: string[];
  riskAssessment: {
    risks: Array<{
      riskLevel: "HIGH" | "MEDIUM" | "LOW";
      clause: string;
      explanation: string;
      quote: string;
    }>;
    overallRiskScore: number;
    riskLevel: "HIGH" | "MEDIUM" | "LOW";
  };
  glossary: Array<{
    term: string;
    definition: string;
    context: string;
  }>;
  recommendations: Array<{
    riskId: number;
    riskLevel: "HIGH" | "MEDIUM" | "LOW";
    title: string;
    description: string;
    actionSteps: string[];
    priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  }>;
  documentLength: number;
}
