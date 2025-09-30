import { Link } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { BGPattern } from '../components/ui/bg-pattern';
import { ArrowRight, Target, Map, Zap, Heart, Users, HelpCircle, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export const Landing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      question: "What is EduNavigator?",
      answer: "EduNavigator is an all-in-one, AI-powered platform designed to guide students from their early career exploration to job readiness. We provide personalized career recommendations, skill-building roadmaps, and an AI resume optimizer."
    },
    {
      question: "Who is EduNavigator for?",
      answer: "High school students exploring future career options, university students looking to build skills and prepare for internships or jobs, and recent graduates aiming to optimize their job search."
    },
    {
      question: "How does the AI recommend career paths?",
      answer: "Our AI analyzes your interests, skills, and academic performance against real-time job market data, including in-demand skills, salary trends, and future growth prospects for various roles."
    },
    {
      question: "Is my personal data safe?",
      answer: "Yes, absolutely. We prioritize your privacy and data security. Your personal information is used solely to personalize your experience and we adhere to strict data protection policies."
    },
    {
      question: "How do I get started?",
      answer: "Simply click 'Start Your Journey', complete our short onboarding quiz to tell us about your interests and goals, and your personalized dashboard will be ready to guide you."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Section */}
      <section className="hero-section pt-24 pb-10 px-4 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <BGPattern variant="grid" mask="fade-edges" size={40} fill="rgba(139, 92, 246, 0.08)" />
        <BGPattern variant="dots" mask="fade-center" size={60} fill="rgba(34, 197, 94, 0.05)" />
        <div className="max-w-7xl mx-auto text-center relative w-full">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Map your future,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              one skill at a time.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized career advice powered by AI. Upload your resume for automatic 
            skill extraction, visualize your career path, discover new opportunities, and 
            bridge skill gaps with our interactive flowchart.
          </p>
          <div className="flex justify-center">
            <Link to="/details" className="start-journey-button">
              <span>
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </span>
              <span>
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: About Us Section */}
      <section id="about" className="about-section py-10 px-4 relative min-h-screen flex items-center">
        <BGPattern variant="grid" mask="fade-edges" size={32} fill="rgba(139, 92, 246, 0.04)" />
        <div className="max-w-7xl mx-auto relative w-full">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 px-6 py-3 rounded-full text-sm font-medium text-blue-700 mb-6">
              <Heart className="h-4 w-4" />
              ABOUT US
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Your Future, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Clarified</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're a passionate team of educators, technologists, and innovators committed to bridging the gap between learning and earning.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="max-w-4xl w-full">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Our Mission</h3>
              <div className="mission-box">
                <p className="mb-4">Our mission is to empower every student to navigate their educational and professional journey with confidence and clarity. We believe that with the right guidance and tools, anyone can turn their ambition into achievement.</p>
                <div className="mission-points">
                  <p><strong>Student-First:</strong> Your goals are our goals. Every feature is designed to solve real-world student challenges.</p>
                  <p><strong>Data-Driven:</strong> We replace guesswork with intelligent, data-powered recommendations.</p>
                  <p><strong>Empowerment Through Action:</strong> We provide tools that help you build skills and take confident steps toward your future.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features Section */}
      <section className="features-section py-10 px-4 relative min-h-screen flex items-center">
        <BGPattern variant="grid" mask="fade-center" size={32} fill="rgba(139, 92, 246, 0.05)" />
        <div className="max-w-7xl mx-auto relative w-full">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16">
            Why Choose EduNavigator?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Personalized Advice
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Get tailored career recommendations based on your skills, interests, 
                and goals. Upload your resume for automatic skill extraction and more 
                personalized AI-powered career advice.
              </p>
            </NBCard>

            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Map className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Visual Career Flowchart
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                See your career journey as an interactive flowchart. Explore courses, 
                internships, jobs, and companies in a visual, easy-to-understand format.
              </p>
            </NBCard>

            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Skill-Gap Mapping
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Identify exactly what skills you need to develop for your dream job. 
                Get specific recommendations for courses, certifications, and experiences.
              </p>
            </NBCard>
          </div>
        </div>
      </section>

      {/* Section 4: FAQ Section */}
      <section id="faq" className="faq-section py-10 px-4 relative border-t border-border/20 min-h-screen flex items-center">
        <BGPattern variant="dots" mask="fade-center" size={24} fill="rgba(34, 197, 94, 0.06)" />
        <div className="max-w-7xl mx-auto relative w-full">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 px-6 py-3 rounded-full text-sm font-medium text-green-700 mb-6">
              <HelpCircle className="h-4 w-4" />
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Questions?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find answers to the most common questions about EduNavigator and how we can help accelerate your career journey.
            </p>
          </div>

          {/* Collapsible FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <span className="text-lg font-semibold text-foreground pr-4">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-muted-foreground leading-relaxed">
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
    </div>
  );
};
