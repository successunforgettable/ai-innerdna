import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';

interface AIReportData {
  personalityOverview: string;
  strengthsAndChallenges: string;
  relationshipInsights: string;
  careerGuidance: string;
  growthRecommendations: string;
  dailyPractices: string;
}

interface AIReportSectionProps {
  assessmentData: any;
}

const AIReportSection: React.FC<AIReportSectionProps> = ({ assessmentData }) => {
  const [aiReport, setAiReport] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const generateReport = async () => {
    if (!assessmentData?.result?.primaryType) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare assessment data for AI analysis
      const aiAssessmentData = {
        primaryType: `Type ${assessmentData.result.primaryType}`,
        confidence: assessmentData.result.confidence,
        wing: assessmentData.buildingBlocks?.[0]?.wing,
        colorStates: assessmentData.colorStates?.map((state: any) => ({
          state: state.state,
          percentage: state.percentage
        })),
        detailTokens: assessmentData.detailTokens,
        foundationStones: assessmentData.foundationStones,
        buildingBlocks: assessmentData.buildingBlocks
      };

      const response = await apiRequest('/api/generate-ai-report', {
        method: 'POST',
        body: JSON.stringify({ assessmentData: aiAssessmentData }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setAiReport(response);
      setExpanded(true);
    } catch (err) {
      setError('Failed to generate AI insights. Please try again.');
      console.error('AI report generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reportSections = [
    {
      title: 'Personality Overview',
      key: 'personalityOverview',
      icon: '🧠',
      description: 'Your unique personality pattern'
    },
    {
      title: 'Strengths & Challenges',
      key: 'strengthsAndChallenges',
      icon: '⚡',
      description: 'What you excel at and areas for growth'
    },
    {
      title: 'Relationship Insights',
      key: 'relationshipInsights',
      icon: '💝',
      description: 'How you connect with others'
    },
    {
      title: 'Career Guidance',
      key: 'careerGuidance',
      icon: '🎯',
      description: 'Professional environments that suit you'
    },
    {
      title: 'Growth Recommendations',
      key: 'growthRecommendations',
      icon: '🌱',
      description: 'Specific development opportunities'
    },
    {
      title: 'Daily Practices',
      key: 'dailyPractices',
      icon: '🔄',
      description: 'Practical habits for your type'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-12"
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">
              🤖 AI-Powered Insights
            </h2>
            <p className="text-white/80">
              Get personalized insights generated specifically for your unique personality combination
            </p>
          </div>
          
          {!aiReport && (
            <motion.button
              onClick={generateReport}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-semibold py-3 px-6 rounded-xl 
                         transition-all duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                'Generate AI Report'
              )}
            </motion.button>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6"
          >
            <p className="text-red-300">{error}</p>
            <button
              onClick={generateReport}
              className="mt-2 text-red-200 hover:text-white underline"
            >
              Try again
            </button>
          </motion.div>
        )}

        {aiReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportSections.map((section, index) => (
                <motion.div
                  key={section.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{section.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {section.title}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-white/90 leading-relaxed">
                    {aiReport[section.key as keyof AIReportData]?.split('\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className="mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30"
            >
              <p className="text-white/80 text-sm text-center">
                ✨ This AI-generated report is personalized based on your unique combination of personality traits, 
                providing insights that go beyond generic type descriptions.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIReportSection;