import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, User, Settings, Zap } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: 'general' | 'features' | 'account';
}

export const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs: FAQ[] = [
    // General Questions
    {
      category: 'general',
      question: "What is EduNavigator?",
      answer: "EduNavigator is an all-in-one, AI-powered platform designed to guide students from their early career exploration to job readiness. We provide personalized career recommendations, skill-building roadmaps, an AI resume optimizer, and a learning assistant to make studying more effective."
    },
    {
      category: 'general',
      question: "Who is EduNavigator for?",
      answer: "Our platform is designed for: High school students exploring future career options, University and college students looking to build skills and prepare for internships or jobs, and Recent graduates aiming to optimize their job search and land their first role."
    },
    {
      category: 'general',
      question: "How is this different from traditional career counseling?",
      answer: "While traditional counseling is valuable, EduNavigator enhances it by being: Personalized at Scale - Our AI analyzes your unique profile against real-time market data to give you tailored advice. Always Available - Your AI mentor is accessible 24/7 to answer questions and provide guidance. Action-Oriented - We go beyond advice by providing tools like the Resume Optimizer and Learning Assistant to help you execute your plan."
    },

    // Feature Questions
    {
      category: 'features',
      question: "How does the AI recommend career paths?",
      answer: "Our AI uses a multi-factor approach. It analyzes the interests, academic performance, and skills you provide (often from an uploaded resume or a short quiz) and cross-references this information with real-time job market data, including in-demand skills, salary trends, and future growth prospects for various roles."
    },
    {
      category: 'features',
      question: "How accurate is the ATS Score on the Resume Optimizer?",
      answer: "Our ATS Score is a highly accurate simulation. It's designed to mimic how real Applicant Tracking Systems parse and score resumes. It checks for crucial elements like keyword alignment with the job description, proper formatting, quantifiable achievements, and the use of action verbs. While it's a simulation, improving your score significantly increases your chances of passing real ATS filters."
    },
    {
      category: 'features',
      question: "What kind of documents can I upload to the Learning Assistant?",
      answer: "You can upload a variety of text-based files, such as .pdf, .docx, and .txt files containing your lecture notes, articles, or study guides. You can also paste text directly into the tool."
    },

    // Account & Data Questions
    {
      category: 'account',
      question: "How do I get started with EduNavigator?",
      answer: "Getting started is easy! Simply sign up for an account, complete our short onboarding quiz to tell us about your interests and goals, and your personalized dashboard will be ready to guide you."
    },
    {
      category: 'account',
      question: "Is my personal data safe?",
      answer: "Yes, absolutely. We prioritize your privacy and data security. Your personal information is used solely to personalize your experience and power our AI recommendations. We adhere to strict data protection policies and do not share your data with third parties without your consent."
    }
  ];

  const categoryIcons = {
    general: HelpCircle,
    features: Zap,
    account: User
  };

  const categoryTitles = {
    general: 'General Questions',
    features: 'Feature Questions',
    account: 'Account & Data Questions'
  };

  const categoryColors = {
    general: 'from-blue-500 to-blue-600',
    features: 'from-purple-500 to-purple-600',
    account: 'from-pink-500 to-pink-600'
  };

  const categories = ['general', 'features', 'account'] as const;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 px-6 py-3 rounded-full text-sm font-medium text-blue-700 mb-6">
            <HelpCircle className="h-4 w-4" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Questions?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about EduNavigator and how we can help accelerate your career journey.
          </p>
        </div>

        {/* FAQ Sections */}
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const categoryFaqs = faqs.filter(faq => faq.category === category);
          
          return (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 bg-gradient-to-r ${categoryColors[category]} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {categoryTitles[category]}
                </h2>
              </div>

              <div className="space-y-4">
                {categoryFaqs.map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div
                      key={globalIndex}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
                      >
                        <span className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <div className="border-t border-gray-100 pt-4">
                            <p className="text-gray-700 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help you succeed.
          </p>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};