import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import type { DocumentAnalysisResult } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface DocumentUploadProps {
  onAnalysisComplete: (
    analysis: DocumentAnalysisResult,
    documentText: string
  ) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function DocumentUpload({
  onAnalysisComplete,
  isLoading,
  setIsLoading,
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "text">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(`${API_URL}/api/analyze-document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze document");
      }

      const data = await response.json();
      onAnalysisComplete(data.analysis, data.documentText || "");
    } catch (error) {
      console.error("Error analyzing document:", error);
      alert("Failed to analyze document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/analyze-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze document");
      }

      const data = await response.json();
      onAnalysisComplete(data.analysis, textInput);
    } catch (error) {
      console.error("Error analyzing document:", error);
      alert("Failed to analyze document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2 geist-semibold">
          Analyzing Document
        </h2>
        <p className="text-muted-foreground geist-regular">
          This may take a few moments...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-sm border border-border p-8">
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setUploadMethod("file")}
            variant={uploadMethod === "file" ? "default" : "outline"}
            className="geist-medium"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
          <Button
            onClick={() => setUploadMethod("text")}
            variant={uploadMethod === "text" ? "default" : "outline"}
            className="geist-medium"
          >
            <FileText className="h-4 w-4 mr-2" />
            Paste Text
          </Button>
        </div>

        {uploadMethod === "file" ? (
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
              dragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
            />

            <div className="relative inline-block mb-6">
              <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2 geist-semibold">
              Drop your document here
            </h3>
            <p className="text-muted-foreground mb-6 geist-regular">
              or click to browse files
            </p>

            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="geist-medium"
            >
              Choose File
            </Button>

            <p className="text-sm text-muted-foreground mt-6 geist-regular">
              Supports PDF, DOCX, and TXT files (max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste your legal document text here..."
              className="w-full h-64 p-4 bg-background border border-border rounded-xl resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors geist-regular text-foreground placeholder:text-muted-foreground"
            />
            <Button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              size="lg"
              className="w-full geist-medium"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Analyze Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
