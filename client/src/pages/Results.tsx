import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import ReportHeader from '@/components/Results/ReportHeader';
import TypeDescription from '@/components/Results/TypeDescription';
import MoodStates from '@/components/Results/MoodStates';

const Results = () => {
  const { assessmentData } = useAssessment();
  
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

  // Check if assessment is complete
  const hasValidData = primaryType && typeName && confidence;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-4xl mx-auto">
          
          {hasValidData ? (
            <>
              <ReportHeader 
                primaryType={primaryType!}
                typeName={typeName!}
                wingName={wingName || 'Not determined'}
                confidence={confidence!}
              />
              
              <TypeDescription 
                primaryType={primaryType!}
                typeName={typeName!}
              />
              
              <MoodStates 
                primaryType={primaryType!}
              />
              
              {/* State Analysis and Subtype components will be added later */}
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-yellow-400 mb-8">
                Complete Your Assessment
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Please complete the full Inner DNA assessment to see your personalized results.
              </p>
              <p className="text-white/60">
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