import { useState, useEffect, useRef } from "react";
import {
  Scale,
  FileText,
  Shield,
  Brain,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Target,
} from "lucide-react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

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
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyze your legal documents with precision and accuracy.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Assessment",
      description:
        "Comprehensive risk evaluation highlighting potential issues and vulnerabilities in your contracts.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Instant Results",
      description:
        "Get detailed analysis and plain-language summaries in minutes, not hours or days.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Key Terms Identification",
      description:
        "Automatically identify and explain critical clauses, obligations, and important legal terminology.",
    },
  ];

  const services = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Contract Analysis",
      description:
        "Comprehensive review of employment contracts, service agreements, and business partnerships.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Risk Evaluation",
      description:
        "Detailed assessment of potential legal and financial risks within your documents.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Legal Compliance",
      description:
        "Ensure your agreements meet current legal standards and regulatory requirements.",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Plain Language Translation",
      description:
        "Convert complex legal jargon into clear, understandable explanations for informed decision-making.",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "What types of legal documents can be analyzed?",
      answer:
        "Our AI can analyze various legal documents including employment contracts, service agreements, NDAs, lease agreements, terms of service, privacy policies, and business partnerships. We support DOCX and TXT formats with PDF support coming soon.",
    },
    {
      question: "How accurate is the AI analysis?",
      answer:
        "Our AI system has been trained on thousands of legal documents and provides highly accurate analysis. However, our service is designed to supplement, not replace, professional legal advice. For critical decisions, we recommend consulting with a qualified attorney.",
    },
    {
      question: "Is my document data secure and private?",
      answer:
        "Yes, we take data security seriously. All documents are processed securely, encrypted in transit and at rest. We do not store your documents permanently, and they are automatically deleted after analysis completion.",
    },
    {
      question: "How long does the analysis take?",
      answer:
        "Most document analyses are completed within 2-5 minutes, depending on the document length and complexity. You'll receive real-time progress updates during the analysis process.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        backgroundImage: "url('/bg-img.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Glass Navbar */}
      <Navbar onGetStarted={onGetStarted} />

      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-4 overflow-hidden pt-32">
        <div className="absolute inset-0" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium">
              <Shield className="h-3 w-3" />
              SECURING YOUR LEGAL INTERESTS
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-black leading-tight">
              Legal solutions for the{" "}
              <span className="text-black playfair-display-italic">
                digital age
              </span>{" "}
              that you can trust
            </h1>

            <p className="text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Empower yourself with AI-driven legal document analysis. Get
              instant insights, risk assessments, and plain-language
              explanations to make informed decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onGetStarted}
                className="bg-black hover:text-orange-200 text-white px-6 py-3 rounded-full text-sm font-medium transition-colors inline-flex items-center justify-center cursor-pointer"
              >
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
              <button className="border border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-full text-sm font-medium transition-colors cursor-pointer">
                View Demo
              </button>
            </div>
          </div>

          {/* Legal Images */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="/istockphoto-2193704550-612x612.webp"
                alt="Legal justice and law concept"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="/premium_photo-1698084059560-9a53de7b816b.avif"
                alt="Legal scales and justice"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div
            ref={aboutRef}
            className={`bg-black rounded-3xl p-16 text-center transition-all duration-1000 relative overflow-hidden ${
              aboutVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Background Design SVG */}
            <div className="absolute inset-0 opacity-20">
              <img
                src="/design.svg"
                alt="Background Design"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium mb-8">
                  ABOUT US
                </div>
                <h2
                  className={`text-4xl md:text-5xl font-bold text-white mb-8 transition-all duration-1000 delay-300 playfair-display-italic ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  Who are we
                </h2>
                <p
                  className={`text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <span className="text-white font-medium">
We are the creators of Legality, a project dedicated to applying specialized Large Language Models to the legal domain. Our goal is to build powerful, accessible AI tools that can reason over and simplify complex legal documents for everyone.
                  </span>
                </p>
              </div>
            </div>

            {/* <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Scale className="h-8 w-8" />,
                  number: "235",
                  label: "NUMBER OF CLIENTS",
                },
                {
                  icon: <Star className="h-8 w-8" />,
                  number: "12+",
                  label: "YEARS OF EXPERIENCE",
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  number: "19",
                  label: "TEAM MEMBERS",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${700 + index * 200}ms` }}
                >
                  <div className="flex justify-center mb-6">
                    <div className="text-black p-4 bg-gray-100 rounded-2xl">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-black mb-3">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white/90">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium mb-4">
                WHAT WE DO
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
                Delivering practical solutions through{" "}
                <span className="text-black playfair-display-italic text-shadow-black">
                  trusted AI analysis
                </span>
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                Transform complex legal documents into clear, actionable
                insights with our advanced AI technology. Make confident
                decisions with comprehensive analysis and risk assessment.
              </p>
            </div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-black text-white p-2 rounded-xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-black mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs">
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
      <section
        id="services"
        className="py-16 px-4 bg-gradient-to-b from-white/90 to-transparent"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium mb-4">
              FEATURES
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Everything you need for{" "}
              <span className="text-black playfair-display-italic">
                cutting-edge
              </span>{" "}
              legal analysis
            </h2>
            <p className="text-sm text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Comprehensive document analysis powered by advanced AI to help you
              understand and navigate complex legal agreements with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-black text-white p-2 rounded-xl">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
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
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs font-medium mb-4">
              ANSWERS FOR YOUR QUESTIONS
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 playfair-display-italic">
              Frequently asked questions
            </h2>
            <p className="text-sm text-gray-700">
              Find answers to common questions about our AI-powered legal
              document analysis service.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-black">
                      {faq.question}
                    </span>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-4 w-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-5 pb-5">
                    <div className="pl-9">
                      <p className="text-gray-600 text-xs leading-relaxed">
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
          <div className="bg-black rounded-3xl p-12 relative overflow-hidden">
            {/* Background Design SVG */}
            <div className="absolute inset-0 opacity-20">
              <img
                src="/design.svg"
                alt="Background Design"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Responsive grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-center">
                {/* Text content */}
                <div className="lg:col-span-3 text-center lg:text-left">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                    Start analyzing your{" "}
                    <span className="text-white playfair-display-italic">
                      legal documents
                    </span>{" "}
                    today
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Join thousands of satisfied users who trust our AI-powered
                    analysis for their legal document needs.
                  </p>
                </div>

                {/* Button */}
                <div className="lg:col-span-1 flex justify-center lg:justify-end">
                  <button
                    onClick={onGetStarted}
                    className="bg-white hover:bg-gray-100 text-black px-6 lg:px-8 py-3 rounded-full text-sm lg:text-md font-medium transition-colors inline-flex items-center justify-center shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
                  >
                    Get Started Now
                    <ArrowRight className="h-4 lg:h-5 w-4 lg:w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
