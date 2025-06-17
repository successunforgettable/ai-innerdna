import React from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import ReportHeader from '@/components/Results/ReportHeader';
import TypeDescription from '@/components/Results/TypeDescription';
import MoodStates from '@/components/Results/MoodStates';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => {
            setCurrentScreen('detail-tokens');
            setLocation('/detail-tokens');
          }}
          className="btn-primary"
        >
          ← Back to Detail Tokens
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl">
          
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
          
        </div>
      </div>
    </div>
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