import React from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import ReportHeader from '@/components/Results/ReportHeader';
import TypeDescription from '@/components/Results/TypeDescription';
import MoodStates from '@/components/Results/MoodStates';
import '@/styles/design-system.css';

const Results = () => {
  const [, setLocation] = useLocation();
  const { assessmentData, setCurrentScreen } = useAssessment();
  
  // Extract data from assessment context
  const foundationData = assessmentData.foundationStones;
  const buildingData = assessmentData.buildingBlocks;
  const colorData = assessmentData.colorStates;
  const detailData = assessmentData.detailTokens;
  const personalityResult = assessmentData.result;

  // Extract data for components - use actual assessment data
  const primaryType = personalityResult?.primaryType;
  const typeName = primaryType ? getTypeName(primaryType) : undefined;
  const wingName = buildingData?.[0]?.name;
  const confidence = personalityResult?.confidence;

  // Debug logging
  console.log('Results Debug:', {
    assessmentData,
    foundationData,
    buildingData,
    colorData,
    detailData,
    personalityResult,
    primaryType,
    typeName,
    confidence
  });

  // Check if assessment is complete
  const hasValidData = primaryType && typeName && confidence;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <motion.button
          onClick={() => {
            setCurrentScreen('detail-tokens');
            setLocation('/detail-tokens');
          }}
          className="btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back to Detail Tokens
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
          {hasValidData ? (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-6xl font-bold text-yellow-400 mb-4">
                  Type {primaryType}
                </h1>
                <h2 className="text-4xl font-bold text-white mb-2">
                  The {typeName}
                </h2>
                <p className="text-xl text-white/80 mb-4">
                  Your influence: {wingName || `${typeName} ${buildingData?.[0]?.wing || ''}`}
                </p>
                <div className="text-lg text-green-400">
                  High Confidence ({Math.round((confidence || 0) * 100)}%)
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-6"></div>
              </div>

              {/* Type Description */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Your Inner DNA: The {typeName}
                </h3>
                <TypeDescription 
                  primaryType={primaryType!}
                  typeName={typeName!}
                />
              </div>

              {/* Mood States */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Your Mood States
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/20 rounded-lg p-6 border border-green-400/30 backdrop-blur-sm">
                    <h4 className="text-xl font-semibold text-green-400 mb-3">
                      When you're in a good mood
                    </h4>
                    <MoodStates 
                      primaryType={primaryType!}
                      moodType="good"
                    />
                  </div>
                  
                  <div className="bg-red-500/20 rounded-lg p-6 border border-red-400/30 backdrop-blur-sm">
                    <h4 className="text-xl font-semibold text-red-400 mb-3">
                      When you're in a bad mood
                    </h4>
                    <MoodStates 
                      primaryType={primaryType!}
                      moodType="bad"
                    />
                  </div>
                </div>
              </div>

              {/* Wing Influence */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Your Influence: {wingName}
                </h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  The {wingName} influence brings a peaceful, harmonizing quality to your assertive nature. 
                  You approach challenges through steady, measured means rather than pure force. This influence 
                  helps you maintain relationships while still standing firm in your convictions.
                </p>
              </div>

              {/* State Analysis */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Your Current State Distribution
                </h3>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(() => {
                      // Extract state data from localStorage according to spec
                      const savedAssessment = JSON.parse(localStorage.getItem('innerDnaAssessment') || '{}');
                      const colorState = savedAssessment.colorState;
                      const colorDistribution = JSON.parse(localStorage.getItem('colorDistribution') || '{"left": 50, "right": 50}');
                      
                      if (colorData && colorData.length >= 2 && colorState) {
                        const primaryStatePercent = Math.round(colorDistribution.left);
                        const secondaryStatePercent = Math.round(colorDistribution.right);
                        
                        return (
                          <>
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-2">Primary State</h4>
                              <p className="text-white/80">{colorData[0]?.title}: {primaryStatePercent}%</p>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-white mb-2">Secondary State</h4>
                              <p className="text-white/80">{colorData[1]?.title}: {secondaryStatePercent}%</p>
                            </div>
                          </>
                        );
                      }
                      
                      return (
                        <div className="col-span-2">
                          <p className="text-white/80">Complete the Color States phase to see your state distribution</p>
                        </div>
                      );
                    })()}
                  </div>
                  <p className="text-white/90 mt-4">
                    {(() => {
                      const savedAssessment = JSON.parse(localStorage.getItem('innerDnaAssessment') || '{}');
                      const colorDistribution = JSON.parse(localStorage.getItem('colorDistribution') || '{"left": 50, "right": 50}');
                      
                      if (colorData && colorData.length >= 2) {
                        const primaryPercent = Math.round(colorDistribution.left);
                        const primaryState = colorData[0]?.title;
                        
                        if (primaryPercent >= 60) {
                          return `You tend to operate from a ${primaryState.toLowerCase()} state, showing strong consistency in your emotional patterns.`;
                        } else if (primaryPercent >= 40) {
                          return `You tend to operate from a balanced but occasionally ${primaryState.toLowerCase()} state, with access to healthier patterns when conditions are supportive.`;
                        } else {
                          return `Your energy alternates between different states, showing flexibility in how you respond to various situations.`;
                        }
                      }
                      
                      return 'Your state distribution will be analyzed based on your Color States selections.';
                    })()}
                  </p>
                </div>
              </div>

              {/* Subtype Analysis */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Your Subtype Focus
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    // Calculate actual subtype percentages from detail token distribution according to spec
                    if (!detailData || detailData.length === 0) {
                      return (
                        <div className="col-span-3">
                          <p className="text-white/80">Complete the Detail Tokens phase to see your subtype focus</p>
                        </div>
                      );
                    }
                    
                    const selfTokens = detailData.filter(token => token.category === 'Self-Preservation').length;
                    const oneToOneTokens = detailData.filter(token => token.category === 'One-to-One').length;
                    const socialTokens = detailData.filter(token => token.category === 'Social').length;
                    const totalTokens = selfTokens + oneToOneTokens + socialTokens;
                    
                    // Calculate percentages based on actual token distribution
                    const selfPercent = totalTokens > 0 ? Math.round((selfTokens / totalTokens) * 100) : 0;
                    const oneToOnePercent = totalTokens > 0 ? Math.round((oneToOneTokens / totalTokens) * 100) : 0;
                    const socialPercent = totalTokens > 0 ? Math.round((socialTokens / totalTokens) * 100) : 0;
                    
                    // Determine dominant subtype according to spec
                    const dominantSubtype = selfPercent >= oneToOnePercent && selfPercent >= socialPercent ? 'self-preservation' :
                                          oneToOnePercent >= socialPercent ? 'one-to-one' : 'social';
                    
                    return (
                      <>
                        <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">🛡️</span>
                            <h4 className="text-lg font-semibold text-blue-400">Self-Preservation</h4>
                          </div>
                          <p className="text-sm text-white/80">
                            {selfPercent}% - Focus on personal security and routines
                          </p>
                        </div>
                        
                        <div className="bg-red-500/20 rounded-lg p-4 border border-red-400/30">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">🔥</span>
                            <h4 className="text-lg font-semibold text-red-400">One-to-One</h4>
                          </div>
                          <p className="text-sm text-white/80">
                            {oneToOnePercent}% - Focus on intense personal connections
                          </p>
                        </div>
                        
                        <div className="bg-green-500/20 rounded-lg p-4 border border-green-400/30">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">🧱</span>
                            <h4 className="text-lg font-semibold text-green-400">Social</h4>
                          </div>
                          <p className="text-sm text-white/80">
                            {socialPercent}% - Focus on group dynamics and community
                          </p>
                        </div>
                        
                        <div className="col-span-3 mt-4">
                          <p className="text-white/90">
                            Your energy is primarily focused on {dominantSubtype}, showing how you naturally prioritize and direct your attention.
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Growth Recommendations */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                  Growth Recommendations
                </h3>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">For Personal Development:</h4>
                      <p className="text-white/90">
                        Practice vulnerability and emotional openness. Allow others to support you without 
                        seeing it as weakness. Develop patience with those who process differently than you.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">In Relationships:</h4>
                      <p className="text-white/90">
                        Work on expressing your softer emotions and needs. Practice listening without 
                        immediately moving to action or solutions. Show appreciation for others' contributions.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">At Work:</h4>
                      <p className="text-white/90">
                        Delegate more and trust others' capabilities. Practice collaborative decision-making. 
                        Use your natural leadership to empower others rather than controlling outcomes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-6xl font-bold text-yellow-400 mb-8">
                Complete Your Assessment
              </h1>
              <p className="text-white/80 text-xl mb-8">
                Please complete the full Inner DNA assessment to see your personalized results.
              </p>
              <p className="text-white/60 text-lg">
                Go through Foundation Stones, Building Blocks, Color States, and Detail Tokens to generate your authentic personality profile.
              </p>
            </div>
          )}
          
        </motion.div>
      </div>
    </motion.div>
  );
};

// Helper function to get type name
const getTypeName = (primaryType: string): string => {
  const typeNames: Record<string, string> = {
    '1': 'Reformer',
    '2': 'Helper',
    '3': 'Achiever',
    '4': 'Individualist',
    '5': 'Investigator',
    '6': 'Sentinel',
    '7': 'Enthusiast',
    '8': 'Challenger',
    '9': 'Peacemaker'
  };
  return typeNames[primaryType] || 'Reformer';
};

export default Results;