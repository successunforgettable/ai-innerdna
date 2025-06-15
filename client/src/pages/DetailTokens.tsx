import { useState } from 'react';
import { motion } from 'framer-motion';
import { TowerVisualization } from '../components/TowerVisualization';
import Token from '../components/Token';
import Container from '../components/Container';

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
              
              {/* Token Pool */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Available Tokens: {remainingTokens}/10</h3>
                <div className="flex gap-2 flex-wrap">
                  {Array.from({ length: Math.max(0, remainingTokens) }).map((_, i) => (
                    <Token key={i} id={`token-${i}`} onDrop={handleTokenDrop} />
                  ))}
                </div>
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
            </div>
          </div>

          {/* Right Column - Tower */}
          <TowerVisualization title="Your Tower" />
        </div>
      </div>
    </div>
  );
}