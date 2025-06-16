import React from 'react';

interface ReportHeaderProps {
  primaryType: string;
  typeName: string;
  wingName: string;
  confidence: number;
}

const ReportHeader = ({ primaryType, typeName, wingName, confidence }: ReportHeaderProps) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.7) return 'text-green-400';
    if (conf >= 0.5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getConfidenceText = (conf: number) => {
    if (conf >= 0.7) return 'High Confidence';
    if (conf >= 0.5) return 'Medium Confidence';
    return 'Moderate Confidence';
  };

  return (
    <div className="text-center mb-12">
      <div className="mb-4">
        <h2 className="text-6xl font-bold text-yellow-400 mb-2">
          Type {primaryType}
        </h2>
        <h3 className="text-3xl font-semibold text-white">
          The {typeName}
        </h3>
      </div>
      
      <div className="mb-6">
        <p className="text-xl text-white/80 mb-2">
          Your influence: {wingName}
        </p>
        <div className={`text-lg ${getConfidenceColor(confidence)}`}>
          {getConfidenceText(confidence)} ({Math.round(confidence * 100)}%)
        </div>
      </div>
      
      <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
    </div>
  );
};

export default ReportHeader;