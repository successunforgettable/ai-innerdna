import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import Token from '@/components/Token';

interface DetailPhaseProps {
  personalityData?: any;
  onComplete?: (subtypeData: any) => void;
}

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

const DetailPhase: React.FC<DetailPhaseProps> = ({ personalityData, onComplete }) => {
  const { setCurrentScreen } = useAssessment();
  const [tokenDistribution, setTokenDistribution] = useState<TokenDistribution>({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;
  const isComplete = totalTokens === 10;

  const handleTokenDrop = (containerId: string) => {
    if (remainingTokens <= 0) return;
    
    const validIds: (keyof TokenDistribution)[] = ['self', 'oneToOne', 'social'];
    if (validIds.includes(containerId as keyof TokenDistribution)) {
      setTokenDistribution(prev => ({
        ...prev,
        [containerId]: prev[containerId as keyof TokenDistribution] + 1
      }));
    }
  };

  const determineSubtypeStack = (distribution: TokenDistribution) => {
    const { self, oneToOne, social } = distribution;
    
    // Validate total equals 10
    if (self + oneToOne + social !== 10) {
      throw new Error('Token distribution must total 10');
    }
    
    const sortedSubtypes = [
      { name: 'self', count: self, label: 'Self-Preservation' },
      { name: 'oneToOne', count: oneToOne, label: 'One-to-One' },
      { name: 'social', count: social, label: 'Social' }
    ].sort((a, b) => b.count - a.count);

    // Calculate dominance percentages
    const dominanceScores = {
      self: (self / 10) * 100,
      oneToOne: (oneToOne / 10) * 100,
      social: (social / 10) * 100
    };

    // Determine stack type
    const primaryCount = sortedSubtypes[0].count;
    let stackType;
    if (primaryCount >= 6) {
      stackType = 'dominant';
    } else if (primaryCount - sortedSubtypes[1].count <= 1) {
      stackType = 'balanced';
    } else {
      stackType = 'moderate';
    }

    return {
      primary: sortedSubtypes[0].name,
      secondary: sortedSubtypes[1].name,
      tertiary: sortedSubtypes[2].name,
      stackType: stackType,
      dominance: dominanceScores,
      description: generateSubtypeDescription(sortedSubtypes, stackType)
    };
  };

  const generateSubtypeDescription = (subtypes: any[], stackType: string) => {
    const primary = subtypes[0];
    const descriptions: Record<string, string> = {
      dominant: `You have a strongly ${primary.label.toLowerCase()}-focused approach to life, with ${primary.count} out of 10 energy units devoted to this area.`,
      balanced: `You maintain a relatively balanced approach across instincts, with your ${primary.label.toLowerCase()} focus slightly leading.`,
      moderate: `You focus moderately on ${primary.label.toLowerCase()} while maintaining some attention to other areas.`
    };
    return descriptions[stackType] || descriptions.moderate;
  };

  const handleContinue = () => {
    if (isComplete) {
      const subtypeData = determineSubtypeStack(tokenDistribution);
      if (onComplete) {
        onComplete({
          ...personalityData,
          subtypes: subtypeData,
          tokenDistribution
        });
      }
      setCurrentScreen('results');
    }
  };

  const containers = [
    {
      id: 'self',
      emoji: '🛡️',
      title: 'Self-Preservation Focus',
      description: 'Energy devoted to personal security, routines, and maintaining your environment'
    },
    {
      id: 'oneToOne',
      emoji: '🔥',
      title: 'One-to-One Focus',
      description: 'Energy devoted to intense personal connections and important relationships'
    },
    {
      id: 'social',
      emoji: '🧱',
      title: 'Social Focus',
      description: 'Energy devoted to group dynamics, community belonging, and social awareness'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Distribute Your Energy
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Place 10 tokens across the three areas based on where you naturally focus your energy
          </p>

          {/* Progress Counter */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg px-6 py-3 inline-block border border-white/20">
            <span className="text-lg font-semibold text-gray-700">
              Total: {totalTokens}/10 • Remaining: {remainingTokens}
            </span>
          </div>

          {/* Validation Message */}
          <div className="mt-3">
            <span className={`text-sm font-medium ${
              totalTokens === 10 ? 'text-green-600' : 
              totalTokens > 10 ? 'text-red-600' : 
              'text-blue-600'
            }`}>
              {totalTokens === 0 ? "Drag tokens to containers to begin" :
               totalTokens < 10 ? `${remainingTokens} tokens remaining` :
               totalTokens === 10 ? "Perfect! All tokens distributed" :
               "Too many tokens distributed"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Token Distribution */}
          <div className="space-y-6">
            {/* Available Tokens */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Tokens</h3>
              <div className="flex flex-wrap gap-3 justify-center min-h-[60px] items-center">
                {remainingTokens > 0 ? (
                  Array.from({ length: remainingTokens }).map((_, index) => (
                    <Token
                      key={`token-${index}`}
                      onDrop={handleTokenDrop}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 italic">All tokens distributed</p>
                )}
              </div>
            </div>

            {/* Three Containers */}
            <div className="space-y-4">
              {containers.map((container) => (
                <div 
                  key={container.id}
                  className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 min-h-[140px]"
                  data-container-id={container.id}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {container.emoji} {container.title}
                      </h4>
                      <p className="text-gray-600 text-sm mt-1">
                        {container.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-700">
                        Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                      </span>
                    </div>
                  </div>

                  {/* Display tokens in container */}
                  <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] items-center">
                    {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-orange-300"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            {isComplete && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                Continue to Results
              </motion.button>
            )}
          </div>

          {/* Right Column - Tower Visualization */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Tower</h3>
            <div className="flex justify-center">
              <div className="relative">
                {/* Tower visualization placeholder */}
                <div className="w-80 h-96 bg-gradient-to-t from-gray-200 to-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                  <p className="text-gray-600 text-center">
                    Tower visualization will update<br />
                    as you distribute tokens
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPhase;