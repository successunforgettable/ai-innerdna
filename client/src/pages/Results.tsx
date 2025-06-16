import React from 'react';
import { useAssessment } from '@/context/AssessmentContext';

const Results = () => {
  const { assessmentData } = useAssessment();
  
  // Extract data from assessment context
  const foundationData = assessmentData.foundationStones;
  const buildingData = assessmentData.buildingBlocks;
  const colorData = assessmentData.colorStates;
  const detailData = assessmentData.detailTokens;
  const personalityResult = assessmentData.result;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-4xl mx-auto">
          
          <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
            Your Inner DNA Results
          </h1>
          
          {/* Debug: Show received data */}
          <div className="text-white/80 text-sm mb-8">
            <p>Primary Type: {personalityResult?.primaryType || 'Not determined'}</p>
            <p>Wing: {buildingData?.[0]?.name || 'Not determined'}</p>
            <p>States: {colorData?.[0]?.state || 'Not determined'}</p>
            <p>Subtype: {detailData?.[0]?.token || 'Not determined'}</p>
            
            {/* Additional debugging */}
            <div className="mt-4 p-4 bg-black/20 rounded">
              <p className="text-xs">Full Assessment Data:</p>
              <pre className="text-xs overflow-auto max-h-40">
                {JSON.stringify(assessmentData, null, 2)}
              </pre>
            </div>
          </div>
          
          {/* Report components will go here */}
          
        </div>
      </div>
    </div>
  );
};

export default Results;