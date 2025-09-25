import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Lightbulb, Target, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import type { DocumentAnalysisResult } from "../types";
import { QAChat } from "./QAChat";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface DocumentAnalysisProps {
  analysis: DocumentAnalysisResult;
  documentText: string;
  onReset: () => void;
  activeTab?: string;
}

export function DocumentAnalysis({
  analysis,
  documentText,
  onReset,
  activeTab = "summary",
}: DocumentAnalysisProps) {
  const getRiskColor = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return "text-destructive bg-destructive/10 border-destructive/20";
      case "MEDIUM":
        return "text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800";
      case "LOW":
        return "text-green-600 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
    }
  };

  const getRiskIcon = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "MEDIUM":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "LOW":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getOverallRiskColor = (level: "HIGH" | "MEDIUM" | "LOW") => {
    switch (level) {
      case "HIGH":
        return "text-destructive";
      case "MEDIUM":
        return "text-orange-500";
      case "LOW":
        return "text-green-500";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onReset} className="geist-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-8">
          {activeTab === "summary" && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8 geist-bold">
                Document Summary
              </h2>
              <div className="space-y-4">
                {analysis.summary.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
                    <div className="text-foreground leading-relaxed geist-regular">
                      <MarkdownRenderer
                        content={point
                          .replace(/^[\s]*[•\-\*\+]\s*/, "")
                          .replace(/^\d+\.\s*/, "")}
                        className="summary-content"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "risk" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground geist-bold">
                  Risk Assessment
                </h2>
                <div className="text-right">
                  <div className="text-4xl font-bold text-foreground geist-bold">
                    {analysis.riskAssessment.overallRiskScore}/100
                  </div>
                  <div
                    className={`text-sm font-semibold geist-semibold ${getOverallRiskColor(
                      analysis.riskAssessment.riskLevel
                    )}`}
                  >
                    {analysis.riskAssessment.riskLevel} RISK
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {analysis.riskAssessment.risks.map((risk, index) => (
                  <div
                    key={index}
                    className={`border rounded-xl p-6 transition-all hover:shadow-sm ${getRiskColor(
                      risk.riskLevel
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      {getRiskIcon(risk.riskLevel)}
                      <div className="flex-1">
                        <div className="font-semibold mb-3 text-lg geist-semibold">
                          <MarkdownRenderer
                            content={risk.clause
                              .replace(/^[\s]*[•\-\*\+]\s*/, "")
                              .replace(/^\d+\.\s*/, "")}
                            className="risk-content"
                          />
                        </div>
                        <div className="mb-4 leading-relaxed geist-regular">
                          <MarkdownRenderer
                            content={risk.explanation
                              .replace(/^[\s]*[•\-\*\+]\s*/, "")
                              .replace(/^\d+\.\s*/, "")}
                            className="risk-content"
                          />
                        </div>
                        <div className="border-l-4 border-border pl-4 italic text-muted-foreground geist-regular">
                          <MarkdownRenderer
                            content={risk.quote
                              .replace(/^[\s]*[•\-\*\+]\s*/, "")
                              .replace(/^\d+\.\s*/, "")}
                            className="risk-content"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "recommendations" && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Lightbulb className="h-8 w-8 text-yellow-500" />
                <h2 className="text-3xl font-bold text-foreground geist-bold">
                  Risk Mitigation Recommendations
                </h2>
              </div>
              
              {analysis.recommendations && analysis.recommendations.length > 0 ? (
                <div className="space-y-6">
                  {analysis.recommendations.map((recommendation, index) => {
                    const getPriorityColor = (priority: string) => {
                      switch (priority) {
                        case "URGENT":
                          return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
                        case "HIGH":
                          return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
                        case "MEDIUM":
                          return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
                        case "LOW":
                          return "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
                        default:
                          return "text-gray-600 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800";
                      }
                    };

                    const getPriorityIcon = (priority: string) => {
                      switch (priority) {
                        case "URGENT":
                          return <AlertTriangle className="h-5 w-5 text-red-500" />;
                        case "HIGH":
                          return <AlertCircle className="h-5 w-5 text-orange-500" />;
                        case "MEDIUM":
                          return <AlertCircle className="h-5 w-5 text-yellow-500" />;
                        case "LOW":
                          return <CheckCircle className="h-5 w-5 text-green-500" />;
                        default:
                          return <AlertCircle className="h-5 w-5 text-gray-500" />;
                      }
                    };

                    return (
                      <div
                        key={index}
                        className={`border rounded-xl p-6 transition-all hover:shadow-sm ${getPriorityColor(recommendation.priority)}`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          {getPriorityIcon(recommendation.priority)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg geist-semibold">
                                <MarkdownRenderer content={recommendation.title} />
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                                {recommendation.priority} PRIORITY
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-3 geist-regular">
                              Risk {recommendation.riskId} • {recommendation.riskLevel} Risk Level
                            </div>
                            <div className="mb-4 leading-relaxed geist-regular">
                              <MarkdownRenderer content={recommendation.description} />
                            </div>
                            <div>
                              <h4 className="font-semibold mb-3 geist-semibold">Action Steps:</h4>
                              <div className="space-y-2">
                                {recommendation.actionSteps.map((step, stepIndex) => (
                                  <div key={stepIndex} className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                                      {stepIndex + 1}
                                    </div>
                                    <div className="flex-1 text-sm leading-relaxed geist-regular">
                                      <MarkdownRenderer content={step} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2 geist-semibold">
                    No Significant Risks Found
                  </h3>
                  <p className="text-muted-foreground geist-regular max-w-md mx-auto">
                    Great news! Our analysis didn't identify any major risks that require immediate mitigation. 
                    However, we still recommend reviewing the document carefully and consulting with a legal professional if needed.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "glossary" && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8 geist-bold">
                Legal Terms Glossary
              </h2>
              <div className="grid gap-6">
                {analysis.glossary.map((term, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-xl p-6 bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="font-semibold text-xl text-foreground mb-3 geist-semibold">
                      <MarkdownRenderer content={term.term} />
                    </h3>
                    <div className="text-foreground mb-3 leading-relaxed geist-regular">
                      <MarkdownRenderer content={term.definition} />
                    </div>
                    <div className="text-sm text-muted-foreground italic geist-regular">
                      Context: <MarkdownRenderer content={term.context} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div>
              <QAChat documentText={documentText} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
