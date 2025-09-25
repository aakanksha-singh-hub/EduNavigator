import { useState } from "react";
import { DocumentUpload } from "./components/DocumentUpload";
import { DocumentAnalysis } from "./components/DocumentAnalysis";
import { LandingPage } from "./components/LandingPage";
import { Header } from "./components/Header";
import type { DocumentAnalysisResult } from "./types";

function App() {
  const [currentView, setCurrentView] = useState<
    "landing" | "upload" | "analysis"
  >("landing");
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [documentText, setDocumentText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("summary");

  const handleAnalysisComplete = (
    result: DocumentAnalysisResult,
    text: string
  ) => {
    setAnalysis(result);
    setDocumentText(text);
    setCurrentView("analysis");
  };

  const handleGetStarted = () => {
    setCurrentView("upload");
  };

  const handleReset = () => {
    setAnalysis(null);
    setDocumentText("");
    setCurrentView("upload");
  };

  const handleBackToHome = () => {
    setAnalysis(null);
    setDocumentText("");
    setCurrentView("landing");
  };

  return (
    <div className="min-h-screen bg-background text-foreground geist-regular">
      {currentView !== "landing" && (
        <Header
          onBackToHome={handleBackToHome}
          showTabs={currentView === "analysis"}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {currentView === "landing" && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {currentView === "upload" && (
        <main className="container mx-auto px-4 py-8 pt-32">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight geist-bold">
                  Legal Document Analysis
                </h2>
                <p className="text-xl text-muted-foreground geist-regular max-w-2xl mx-auto">
                  Upload your legal documents and get instant AI-powered
                  analysis to understand what you're signing
                </p>
              </div>
              <DocumentUpload
                onAnalysisComplete={handleAnalysisComplete}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          </div>
        </main>
      )}

      {currentView === "analysis" && analysis && (
        <main className="container mx-auto px-4 py-8 pt-32">
          <div className="mx-auto max-w-6xl">
            <DocumentAnalysis
              analysis={analysis}
              documentText={documentText}
              onReset={handleReset}
              activeTab={activeTab}
            />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
