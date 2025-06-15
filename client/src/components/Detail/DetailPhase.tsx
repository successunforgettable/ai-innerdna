import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion, AnimatePresence } from 'framer-motion';
import ContinueButton from '@/components/ContinueButton';
import { TowerVisualization } from '@/components/TowerVisualization';
import Token from './Token';

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

const DetailPhase: React.FC = () => {
  const { assessmentData, setAssessmentData } = useAssessment();
  const [, setLocation] = useLocation();
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

  const handleContinue = () => {
    if (isComplete) {
      // Update assessment data with token distribution
      const newDetailTokens = [
        { category: 'self', token: tokenDistribution.self.toString() },
        { category: 'oneToOne', token: tokenDistribution.oneToOne.toString() },
        { category: 'social', token: tokenDistribution.social.toString() }
      ];

      setAssessmentData({
        ...assessmentData,
        detailTokens: newDetailTokens
      });

      setLocation('/results');
    }
  };

  // Section 7.2 Three Containers - exact from spec
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Token Distribution */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
              <p className="text-white/80 mb-8">Place 10 tokens across the three areas based on where you naturally focus your energy</p>
              
              <div className="text-white mb-6">Total: {totalTokens}/10 • Remaining: {remainingTokens}</div>

              {/* Available Tokens */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Available Tokens</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 min-h-[80px] border border-white/10">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {Array.from({ length: remainingTokens }).map((_, index) => (
                      <Token
                        key={`token-${index}`}
                        onDrop={handleTokenDrop}
                      />
                    ))}
                    {remainingTokens === 0 && (
                      <p className="text-white/60 italic">All tokens distributed</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Three Containers following Section 7.2 spec */}
              <div className="space-y-6">
                {containers.map((container) => (
                  <div 
                    key={container.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border-2 border-white/20 hover:border-orange-400/50 transition-all duration-300"
                    data-container-id={container.id}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        {container.emoji} {container.title}
                      </h4>
                      <span className="bg-orange-400/20 text-orange-300 px-3 py-1 rounded-full text-sm font-medium">
                        Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-4">
                      {container.description}
                    </p>

                    {/* Display tokens in container */}
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border-2 border-orange-300/30"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Button */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <ContinueButton
                    canProceed={isComplete}
                    onContinue={handleContinue}
                  >
                    Continue to Results
                  </ContinueButton>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Tower Visualization */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Your Tower</h2>
            <TowerVisualization 
              title=""
              data={{ tokenDistribution }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPhase;