import { useState } from 'react';
import { motion } from 'framer-motion';
import { TowerVisualization } from '../components/TowerVisualization';
import Token from '../components/Token';
import Container from '../components/Container';
import { determineSubtypeStack } from '../lib/subtypeCalculation';

export default function DetailTokens() {
  const [tokenDistribution, setTokenDistribution] = useState({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;

  const handleTokenAdd = (containerId: string) => {
    if (remainingTokens <= 0) return;
    
    setTokenDistribution(prev => ({
      ...prev,
      [containerId]: prev[containerId as keyof typeof prev] + 1
    }));
  };

  const handleTokenDrop = (containerId: string) => {
    if (remainingTokens <= 0) return;
    
    setTokenDistribution(prev => ({
      ...prev,
      [containerId]: prev[containerId as keyof typeof prev] + 1
    }));
  };

  const canContinue = totalTokens === 10;

  // Container data from Section 7.2
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
              <p className="text-white/80 mb-8">Place 10 tokens across the three areas based on where you focus most of your energy</p>
              
              {/* Token pool and validation display */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Available Tokens</h2>
                  <div className="text-white/80">
                    {remainingTokens} remaining • {totalTokens}/10 distributed
                  </div>
                </div>
                
                {/* Token pool */}
                <div className="bg-white/5 rounded-lg p-4 min-h-[60px] flex flex-wrap gap-2">
                  {remainingTokens > 0 ? (
                    Array.from({ length: remainingTokens }).map((_, i) => (
                      <Token 
                        key={`available-${i}`} 
                        id={`available-${i}`}
                        onDrop={handleTokenDrop}
                      />
                    ))
                  ) : (
                    <div className="text-white/60 text-sm">All tokens distributed</div>
                  )}
                </div>
                
                {/* Validation message */}
                {totalTokens < 10 && (
                  <motion.div 
                    className="mt-3 text-orange-200 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Distribute all 10 tokens to continue
                  </motion.div>
                )}
                
                {totalTokens === 10 && (
                  <motion.div 
                    className="mt-3 text-green-200 text-sm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    ✓ All tokens distributed! You can continue.
                  </motion.div>
                )}
              </div>

              {/* Containers */}
              <div className="space-y-4">
                {containers.map(container => (
                  <Container
                    key={container.id}
                    id={container.id}
                    emoji={container.emoji}
                    title={container.title}
                    description={container.description}
                    tokenCount={tokenDistribution[container.id as keyof typeof tokenDistribution]}
                    onTokenClick={() => handleTokenAdd(container.id)}
                  />
                ))}
              </div>
              
              {/* Continue button */}
              <motion.button
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all mt-6 ${
                  canContinue 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                }`}
                disabled={!canContinue}
                onClick={() => {
                  if (canContinue) {
                    const subtypeResult = determineSubtypeStack(tokenDistribution);
                    console.log('Subtype Result:', subtypeResult);
                    // Navigate to results or handle completion
                  }
                }}
                whileHover={canContinue ? { scale: 1.02 } : {}}
                whileTap={canContinue ? { scale: 0.98 } : {}}
              >
                Continue to Results
              </motion.button>
            </div>
          </div>

          {/* Right Column - Tower */}
          <TowerVisualization 
            title="Your Tower" 
            data={{ tokenDistribution }}
          />
        </div>
      </div>
    </div>
  );
}