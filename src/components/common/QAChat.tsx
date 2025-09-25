import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Send, User, Bot, Loader2, Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface SuggestedQuestion {
  id: string;
  question: string;
  category: string;
}

interface QAChatProps {
  documentText: string;
}

export function QAChat({ documentText }: QAChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    generateSuggestedQuestions();
  }, [documentText]);

  const generateSuggestedQuestions = async () => {
    try {
      setIsLoadingSuggestions(true);
      const response = await fetch("http://localhost:3002/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentText,
          questionCount: 6,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggested questions");
      }

      const result = await response.json();
      if (result.success) {
        setSuggestedQuestions(result.data);
      }
    } catch (error) {
      console.error("Error generating suggested questions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3002/api/ask-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          documentText,
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const result = await response.json();
      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.data.answer,
          timestamp: result.data.timestamp,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your question. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(inputValue);
  };

  const handleSuggestedQuestionClick = (question: string) => {
    handleSubmit(question);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bot className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">
          Ask Questions About Your Document
        </h2>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-foreground">Suggested Questions</h3>
            </div>
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Generating questions...</span>
              </div>
            ) : (
              <div className="grid gap-3">
                {suggestedQuestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    className="justify-start text-left h-auto py-3 px-4 whitespace-normal"
                    onClick={() => handleSuggestedQuestionClick(suggestion.question)}
                  >
                    <span className="text-sm">{suggestion.question}</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <Card className="max-h-96 overflow-y-auto">
          <CardContent className="p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-8"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (
                    <div className="text-sm">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>
      )}

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          placeholder="Ask a question about your document..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={!inputValue.trim() || isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {messages.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          Ask follow-up questions to dive deeper into your document
        </div>
      )}
    </div>
  );
}