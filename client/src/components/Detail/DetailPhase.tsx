// src/components/Detail/DetailPhase.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import TowerVisualization from '../Common/TowerVisualization';
import Token from './Token';

interface DetailPhaseProps {
  personalityData: any;
  onComplete: (data: any) => void;
}

export default function DetailPhase({ personalityData, onComplete }: DetailPhaseProps) {
  const [tokenDistribution, setTokenDistribution] = useState({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;

  const handleTokenDrop = (containerId: string) => {
    if (remainingTokens <= 0) return;

    setTokenDistribution(prev => ({
      ...prev,
      [containerId]: prev[containerId] + 1
    }));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Token Distribution */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
              <p className="text-white/80 mb-8">Place 10 tokens across the three areas based on where you focus most of your energy</p>

              <div className="text-white mb-6">Total: {totalTokens}/10 • Remaining: {remainingTokens}</div>

              {/* Token Pool */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Available Tokens</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 min-h-[80px] border border-white/10">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {Array.from({ length: remainingTokens }).map((_, i) => (
                      <Token 
                        key={`available-${i}`} 
                        id={`available-${i}`}
                        onDrop={handleTokenDrop}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Containers */}
              <div className="space-y-6 mt-8">
                {containers.map((container) => (
                  <div 
                    key={container.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                    data-container-id={container.id}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{container.emoji}</span>
                      <h3 className="text-xl font-semibold text-white">{container.title}</h3>
                    </div>
                    <p className="text-white/70 text-sm mb-4 leading-relaxed">
                      {container.description}
                    </p>
                    <div className="text-white font-medium">Tokens: {tokenDistribution[container.id as keyof typeof tokenDistribution]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Tower Visualization */}
          <div className="lg:sticky lg:top-8">
            <TowerVisualization data={{...personalityData, tokenDistribution}} />
          </div>
        </div>
      </div>
    </div>
  );
}