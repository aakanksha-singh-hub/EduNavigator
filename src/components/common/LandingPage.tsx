import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Brain,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Custom hook for scroll animations
  const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.3 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    return [ref, isVisible] as const;
  };

  const [aboutRef, aboutVisible] = useScrollAnimation();

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Learning",
      description:
        "Advanced AI technology helps you understand complex documents through intelligent analysis and summaries.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Interactive Analysis",
      description:
        "Get detailed breakdowns, key insights, and visual representations of your document content.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Instant Understanding",
      description:
        "Upload documents and receive comprehensive analysis, summaries, and learning materials in seconds.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Personalized Learning",
      description:
        "Generate custom quizzes, ask questions, and get tailored explanations to enhance your learning experience.",
    },
  ];

  const services = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Document Analysis",
      description:
        "Upload any text document and get comprehensive analysis with key insights and summaries.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Smart Recommendations",
      description:
        "Receive intelligent suggestions and actionable insights based on your document content.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Interactive Quizzes",
      description:
        "Generate personalized quizzes to test your understanding and reinforce key concepts.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "AI Chat Assistant",
      description:
        "Ask questions about your documents and get instant, intelligent answers to deepen your understanding.",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "What types of documents can I analyze?",
      answer:
        "You can analyze any text-based document including PDFs, Word documents, research papers, articles, reports, and more. Our AI works best with educational, academic, and informational content.",
    },
    {
      question: "How does the AI analysis work?",
      answer:
        "Our AI uses advanced language models to understand document content, extract key concepts, generate summaries, create learning materials, and provide intelligent answers to your questions.",
    },
    {
      question: "Is my document data secure?",
      answer:
        "Yes, we prioritize your privacy and security. Documents are processed securely and are not stored permanently on our servers. All data is encrypted in transit and at rest.",
    },
    {
      question: "Can I generate quizzes from any document?",
      answer:
        "Yes! Our AI can generate personalized quizzes from any document content. The quizzes include various question types and difficulty levels to enhance your learning experience.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-4 overflow-hidden pt-32">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              POWERED BY AI
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Transform documents into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                interactive learning
              </span>{" "}
              experiences
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload any document and let our AI create personalized summaries, 
              generate quizzes, answer your questions, and help you learn more effectively.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-base font-medium transition-colors inline-flex items-center justify-center"
              >
                Start Learning Now
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-full text-base font-medium transition-colors"
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Analysis</h3>
              <p className="text-sm text-gray-600">Upload and analyze any document with AI-powered insights</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Quizzes</h3>
              <p className="text-sm text-gray-600">Generate personalized quizzes to test your understanding</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Chat</h3>
              <p className="text-sm text-gray-600">Ask questions and get instant intelligent answers</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div
            ref={aboutRef}
            className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-center transition-all duration-1000 relative overflow-hidden ${
              aboutVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-8">
                  ABOUT THE PROJECT
                </div>
                <h2
                  className={`text-4xl md:text-5xl font-bold text-white mb-8 transition-all duration-1000 delay-300 ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  Learning Assistant
                </h2>
                <p
                  className={`text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <span className="text-white font-medium">
                    We've created an AI-powered Learning Assistant that transforms how you interact with documents. 
                    Upload any text, get instant analysis, generate quizzes, and chat with an AI that understands your content. 
                    Whether you're studying, researching, or just curious, our assistant makes learning more interactive and engaging.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                HOW IT WORKS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Intelligent document analysis with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  personalized learning
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our AI doesn't just read your documents—it understands them. 
                Get comprehensive analysis, generate learning materials, and engage 
                in meaningful conversations about your content.
              </p>
            </div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:border-blue-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                enhanced learning
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Comprehensive document analysis and learning tools powered by advanced AI 
              to help you understand and learn from any content more effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:border-blue-200"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common questions
            </h2>
            <p className="text-gray-600">
              Find answers to frequently asked questions about our AI-powered learning assistant.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-sm transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <div className="pl-12">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 relative overflow-hidden">
            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-center">
                <div className="lg:col-span-3 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Ready to enhance your{" "}
                    <span className="text-blue-100">
                      learning experience?
                    </span>
                  </h2>
                  <p className="text-blue-100 leading-relaxed">
                    Join students, researchers, and lifelong learners who are using AI 
                    to understand documents better and learn more effectively.
                  </p>
                </div>

                <div className="lg:col-span-1 flex justify-center lg:justify-end">
                  <Button
                    onClick={onGetStarted}
                    size="lg"
                    className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-full font-medium transition-colors inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}