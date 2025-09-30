import React from 'react';
import { Target, Users, Lightbulb, Heart, Zap, Shield } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 px-6 py-3 rounded-full text-sm font-medium text-blue-700 mb-6">
            <Heart className="h-4 w-4" />
            ABOUT US
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Future, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Clarified</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering every student to navigate their educational and professional journey with confidence and clarity.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission is to empower every student to navigate their educational and professional journey with confidence and clarity. 
              We believe that with the right guidance and tools, anyone can turn their ambition into achievement.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              </div>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  The journey from the classroom to a career is often a maze filled with generic advice, overwhelming information, 
                  and frustrating dead ends. Traditional counseling struggles to keep up with emerging industries, and valuable skills 
                  learned in school often don't translate into job offers because of a poorly optimized resume.
                </p>
                <p>
                  We saw this gap and imagined a better way. What if every student had a personal mentor in their pocket? 
                  A guide powered by intelligent technology that understands their unique strengths, provides a clear roadmap 
                  to their goals, and equips them with the practical tools to succeed.
                </p>
                <p className="font-semibold text-gray-900">
                  That's why we built EduNavigator.
                </p>
                <p>
                  We are a passionate team of educators, technologists, and innovators committed to bridging the gap between 
                  learning and earning. By harnessing the power of Generative AI, we've created a platform that delivers the 
                  personalized, actionable, and future-ready guidance that we wished we had as students.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Built by Students, for Students</h3>
                  <p className="text-gray-600">
                    Our team understands the challenges because we've been there too.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at EduNavigator
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Student-First */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Student-First</h3>
              <p className="text-gray-600 leading-relaxed">
                Your goals are our goals. Every feature is designed to solve real-world student challenges.
              </p>
            </div>

            {/* Data-Driven Guidance */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data-Driven Guidance</h3>
              <p className="text-gray-600 leading-relaxed">
                We replace guesswork with intelligent, data-powered recommendations to give you a competitive edge.
              </p>
            </div>

            {/* Empowerment Through Action */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Empowerment Through Action</h3>
              <p className="text-gray-600 leading-relaxed">
                We don't just give advice; we provide tools that help you build skills, create powerful resumes, and take confident steps toward your future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};