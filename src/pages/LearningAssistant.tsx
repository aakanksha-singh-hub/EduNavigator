import React, { useState } from 'react';
import { Upload, FileText, Brain, Zap, BookOpen, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentProcessorService } from '../lib/services/documentProcessorService';
import { DocumentAnalysisResult, QuizQuestion } from '../lib/types/learningTypes';

// CSS override for black text
const blackTextForceStyle = `
  .force-black-text, 
  .force-black-text *, 
  .force-black-text p, 
  .force-black-text div, 
  .force-black-text span, 
  .force-black-text h1, 
  .force-black-text h2, 
  .force-black-text h3 {
    color: #000000 !important;
    text-shadow: none !important;
  }
`;

interface StudyMaterial {
  analysis: DocumentAnalysisResult;
  quizQuestions: QuizQuestion[];
  originalText: string;
  fileName: string;
}

export const LearningAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [textInput, setTextInput] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processDocument(file, file.name);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    await processDocument(textInput, 'Text Input');
  };

  const processDocument = async (input: File | string, fileName: string) => {
    setIsLoading(true);
    setLoadingStep('Extracting text from document...');
    setError(null);

    try {
      // Extract text
      let documentText: string;
      if (typeof input === 'string') {
        documentText = input;
      } else {
        documentText = await DocumentProcessorService.extractTextFromFile(input);
      }

      // Analyze document
      setLoadingStep('Analyzing document content...');
      const analysis = await DocumentProcessorService.analyzeDocument(documentText);

      // Generate quiz
      setLoadingStep('Generating quiz questions...');
      const quizQuestions = await DocumentProcessorService.generateQuiz(documentText, 5);

      const material: StudyMaterial = {
        analysis,
        quizQuestions,
        originalText: documentText,
        fileName
      };

      setStudyMaterial(material);
    } catch (error) {
      console.error('Error processing document:', error);
      setError(error instanceof Error ? error.message : 'Failed to process document. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  if (isLoading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: blackTextForceStyle }} />
        <div className="min-h-screen p-4" style={{
          backgroundImage: "url('/bg2.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-6">
                <Brain className="h-16 w-16 animate-pulse text-blue-600" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white animate-bounce" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Processing Your Document</h2>
              <p className="text-white mb-4">{loadingStep}</p>
              <div className="w-64 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!studyMaterial && !error) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: blackTextForceStyle }} />
        <div className="min-h-screen p-4" style={{
          backgroundImage: "url('/bg2.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-white hover:text-gray-200 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-white">Learning Assistant</h1>
                </div>
                <p className="text-white max-w-2xl mx-auto">
                </p>
              </div>
            </div>

            {/* Upload Interface */}
            <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'file'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Upload File
                </button>
                <button
                  onClick={() => setUploadMethod('text')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2 inline" />
                  Paste Text
                </button>
              </div>

              {uploadMethod === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors relative">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold force-black-text">Upload Learning Material</h3>
                      <p className="force-black-text mt-2">Drop your document here or click to browse</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm force-black-text">
                      <AlertCircle className="w-4 h-4" />
                      <span>Currently supports TXT files only</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your learning content here... (notes, textbook chapters, articles, etc.)"
                    className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors force-black-text placeholder-gray-500"
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Brain className="w-5 h-5" />
                    <span>Generate Study Materials</span>
                  </button>
                </div>
              )}
            </div>

            {/* Features Preview */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <FeatureCard
                icon={FileText}
                title="Smart Notes"
                description="AI-generated notes with key points and concepts"
              />
              <FeatureCard
                icon={BookOpen}
                title="Interactive Glossary"
                description="Important terms and definitions with context"
              />
              <FeatureCard
                icon={Brain}
                title="Study Ready"
                description="Organized content perfect for learning and review"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: blackTextForceStyle }} />
        <div className="min-h-screen p-4" style={{
          backgroundImage: "url('/bg2.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-white hover:text-gray-200 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold force-black-text mb-4">Upload Error</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-left">{error}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Solutions:</h3>
                    <ul className="text-left text-blue-800 space-y-2 text-sm">
                      <li>• <strong>For PDF files:</strong> Copy the text content and use the "Paste Text" option</li>
                      <li>• <strong>For Word documents:</strong> Save as a .txt file or copy the content</li>
                      <li>• <strong>For empty files:</strong> Make sure your file contains readable text content</li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={() => {
                      setError(null);
                      setTextInput('');
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Results state - Notes and Glossary combined
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blackTextForceStyle }} />
      <div className="min-h-screen p-4" style={{
        backgroundImage: "url('/bg2.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="max-w-6xl mx-auto px-4 py-16">{/* Increased from py-8 to py-16 for more top space */}
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-white hover:text-gray-200 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{studyMaterial?.fileName || 'Document'}</h1>
                <div className="flex items-center space-x-4 text-sm text-white">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{studyMaterial?.analysis.estimatedReadTime || 0} min read</span>
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    studyMaterial?.analysis.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                    studyMaterial?.analysis.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {studyMaterial?.analysis.difficulty || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                setStudyMaterial(null);
                setTextInput('');
                setError(null);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              New Document
            </button>
          </div>

          {/* Notes and Glossary Content */}
          <div className="space-y-8">
            {/* Key Learning Points */}
            <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
              <h2 className="text-2xl font-bold force-black-text mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                📝 Key Learning Notes
              </h2>
              
              {/* Study Instructions */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                  🎯 Study Instructions:
                </h3>
                <p className="text-sm text-blue-800 force-black-text">
                  <strong>Focus on the highlighted concepts below.</strong> Each note contains important information you should understand thoroughly. 
                  Pay special attention to items marked as IMPORTANT, CRITICAL, or MUST KNOW - these are essential for mastery.
                </p>
              </div>

              <div className="space-y-4">
                {studyMaterial?.analysis.keyPoints.map((point, index) => {
                  // Check if this is a high-priority item
                  const isHighPriority = point.includes('IMPORTANT') || point.includes('CRITICAL') || point.includes('MUST KNOW');
                  const isImportant = point.includes('📌 IMPORTANT');
                  const isCritical = point.includes('⭐ CRITICAL');
                  const isMustKnow = point.includes('🔥 MUST KNOW');
                  
                  return (
                    <div key={index} className={`p-4 border-l-4 rounded-r-lg ${
                      isMustKnow ? 'border-red-500 bg-red-50' :
                      isCritical ? 'border-yellow-500 bg-yellow-50' :
                      isImportant ? 'border-blue-500 bg-blue-50' :
                      'border-green-500 bg-green-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 ${
                          isMustKnow ? 'bg-red-500' :
                          isCritical ? 'bg-yellow-500' :
                          isImportant ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="force-black-text leading-relaxed" dangerouslySetInnerHTML={{ __html: point }} />
                          {isHighPriority && (
                            <div className="mt-2 text-xs font-medium text-gray-600">
                              💡 This is a priority concept - spend extra time understanding this!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Study Tips */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-900 mb-2 flex items-center">
                  💡 Study Tips:
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Review each point multiple times until you can explain it in your own words</li>
                  <li>• Create connections between different concepts</li>
                  <li>• Test yourself by covering the explanations and trying to recall the key points</li>
                  <li>• Focus extra attention on items marked as CRITICAL or MUST KNOW</li>
                </ul>
              </div>
            </div>

            {/* Interactive Glossary */}
            {studyMaterial?.analysis.glossary && studyMaterial.analysis.glossary.length > 0 && (
              <div className="p-8 rounded-2xl border-2 bg-white force-black-text">
                <h2 className="text-2xl font-bold force-black-text mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3 text-purple-600" />
                  📚 Interactive Glossary
                </h2>
                
                {/* Glossary Instructions */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center">
                    📖 How to Use This Glossary:
                  </h3>
                  <p className="text-sm text-purple-800 force-black-text">
                    <strong>Master these terms for deeper understanding.</strong> Each definition includes context and importance. 
                    Try to use these terms in your own explanations to reinforce learning.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {studyMaterial.analysis.glossary.map((item, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-purple-900 mb-3 text-lg flex items-center">
                            {item.term}
                            <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">KEY TERM</span>
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 border border-purple-100">
                              <h4 className="font-medium text-purple-800 mb-2">📝 Definition:</h4>
                              <p className="force-black-text leading-relaxed" dangerouslySetInnerHTML={{ __html: item.definition }} />
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-purple-100">
                              <h4 className="font-medium text-purple-800 mb-2">🎯 Why It Matters:</h4>
                              <p className="text-sm force-black-text italic leading-relaxed">
                                {item.context}
                              </p>
                            </div>
                            
                            <div className="text-xs text-purple-600 bg-purple-100 rounded px-2 py-1 text-center">
                              💡 Study Tip: Try to explain this term to someone else!
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Study Resources */}
                <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                  <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                    🚀 Next Steps:
                  </h3>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• Quiz yourself on these terms without looking at the definitions</li>
                    <li>• Create flashcards for terms you find challenging</li>
                    <li>• Try to use these terms when discussing the subject with others</li>
                    <li>• Look for connections between different glossary terms</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border-2 bg-white force-black-text text-center">
                <div className="text-3xl font-bold text-blue-600">{studyMaterial?.analysis.keyPoints.length || 0}</div>
                <div className="text-sm force-black-text">Key Points</div>
              </div>
              <div className="p-6 rounded-2xl border-2 bg-white force-black-text text-center">
                <div className="text-3xl font-bold text-purple-600">{studyMaterial?.analysis.glossary?.length || 0}</div>
                <div className="text-sm force-black-text">Terms</div>
              </div>
              <div className="p-6 rounded-2xl border-2 bg-white force-black-text text-center">
                <div className="text-3xl font-bold text-green-600">{studyMaterial?.analysis.estimatedReadTime || 0}</div>
                <div className="text-sm force-black-text">Minutes</div>
              </div>
              <div className="p-6 rounded-2xl border-2 bg-white force-black-text text-center">
                <div className="text-3xl font-bold text-orange-600">{studyMaterial?.analysis.documentLength || 0}</div>
                <div className="text-sm force-black-text">Characters</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const FeatureCard: React.FC<{ icon: React.ComponentType<any>, title: string, description: string }> = 
  ({ icon: Icon, title, description }) => (
  <div className="p-6 rounded-xl border-2 bg-white force-black-text">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <h3 className="font-semibold force-black-text mb-2">{title}</h3>
    <p className="text-sm force-black-text">{description}</p>
  </div>
);
