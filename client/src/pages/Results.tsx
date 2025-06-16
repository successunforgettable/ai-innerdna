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

  // Extract data for components
  const primaryType = personalityResult?.primaryType || '1';
  const typeName = getTypeName(primaryType);
  const wingName = buildingData?.[0]?.name || 'Reformer 9';
  const confidence = personalityResult?.confidence || 0.75;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-4xl mx-auto">
          
          <ReportHeader 
            primaryType={primaryType}
            typeName={typeName}
            wingName={wingName}
            confidence={confidence}
          />
          
          <TypeDescription 
            primaryType={primaryType}
            typeName={typeName}
          />
          
          <MoodStates 
            primaryType={primaryType}
          />
          
          {/* State Analysis and Subtype components will be added later */}
          
          {/* Debug: Show received data */}
          <div className="text-white/80 text-xs mt-8 p-4 bg-black/20 rounded">
            <p>Debug Data:</p>
            <p>Primary Type: {personalityResult?.primaryType || 'Not determined'}</p>
            <p>Wing: {buildingData?.[0]?.name || 'Not determined'}</p>
            <p>States: {colorData?.[0]?.state || 'Not determined'}</p>
            <p>Subtype: {detailData?.[0]?.token || 'Not determined'}</p>
          </div>
          
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