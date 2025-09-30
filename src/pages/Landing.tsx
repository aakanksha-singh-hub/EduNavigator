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
    <div className="min-h-screen light-rays-bg">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <BGPattern variant="grid" mask="fade-edges" size={40} fill="rgba(139, 92, 246, 0.08)" />
        <BGPattern variant="dots" mask="fade-center" size={60} fill="rgba(34, 197, 94, 0.05)" />
        <div className="max-w-7xl mx-auto text-center relative">

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

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <BGPattern variant="grid" mask="fade-center" size={32} fill="rgba(139, 92, 246, 0.05)" />
        <div className="max-w-7xl mx-auto relative">
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

      {/* About Us Preview Section */}
      <section id="about" className="py-20 px-4 relative">
        <BGPattern variant="grid" mask="fade-edges" size={32} fill="rgba(139, 92, 246, 0.04)" />
        <div className="max-w-7xl mx-auto relative">
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

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our mission is to empower every student to navigate their educational and professional journey with confidence and clarity. 
                We believe that with the right guidance and tools, anyone can turn their ambition into achievement.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground"><strong>Student-First:</strong> Your goals are our goals. Every feature is designed to solve real-world student challenges.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground"><strong>Data-Driven:</strong> We replace guesswork with intelligent, data-powered recommendations.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground"><strong>Empowerment Through Action:</strong> We provide tools that help you build skills and take confident steps toward your future.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 text-center border border-border/20">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-white" />
              </div>
              <h4 className="text-xl font-bold text-foreground mb-3">Built by Students, for Students</h4>
              <p className="text-muted-foreground">
                Our team understands the challenges because we've been there too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30 backdrop-blur-sm relative border-t border-border/20">
        <BGPattern variant="dots" mask="fade-y" size={24} fill="rgba(34, 197, 94, 0.06)" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 px-6 py-3 rounded-full text-sm font-medium text-green-700 mb-6">
              <Zap className="h-4 w-4" />
              HOW IT WORKS
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Your Success Story Starts <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Here</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Follow our simple 3-step process to unlock your career potential and discover the path to your dream job.
            </p>
          </div>
          
          {/* Table Format */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary/10 to-accent/10">
                    <th className="px-8 py-6 text-left text-lg font-bold text-foreground">Step</th>
                    <th className="px-8 py-6 text-left text-lg font-bold text-foreground">Action</th>
                    <th className="px-8 py-6 text-left text-lg font-bold text-foreground">What You Get</th>
                    <th className="px-8 py-6 text-left text-lg font-bold text-foreground">Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/10 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold text-accent-foreground">1</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">Enter Your Details</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      Tell us about your skills, education, interests, and career goals. Upload your resume for automatic analysis.
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      Personalized profile with skill extraction and experience mapping
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">5 minutes</span>
                    </td>
                  </tr>
                  <tr className="border-b border-border/10 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold text-primary-foreground">2</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">See Your Career Path</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      Get a personalized flowchart showing your recommended career journey with courses and opportunities.
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      Interactive career roadmap with actionable next steps
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Instant</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent to-green-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl font-bold text-white">3</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">Explore Opportunities</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      Discover alternative career paths, skill requirements, and real-world opportunities that match your profile.
                    </td>
                    <td className="px-8 py-6 text-muted-foreground">
                      Curated job listings, skill gap analysis, and learning resources
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Ongoing</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-card/30 backdrop-blur-sm relative border-t border-border/20">
        <BGPattern variant="dots" mask="fade-center" size={24} fill="rgba(34, 197, 94, 0.06)" />
        <div className="max-w-7xl mx-auto relative">
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
