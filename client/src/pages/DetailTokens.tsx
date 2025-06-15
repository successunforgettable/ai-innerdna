import { useState } from 'react';
import { motion } from 'framer-motion';
import { TowerVisualization } from '../components/TowerVisualization';

export default function DetailPhase({ personalityData, onComplete }) {
  const [tokenDistribution, setTokenDistribution] = useState({
    self: 0, oneToOne: 0, social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
            <p className="text-white/80 mb-8">Place 10 tokens across the three areas</p>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Available Tokens</h2>
                <div className="text-white/80">{remainingTokens} remaining</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 min-h-[60px] flex gap-2">
                {Array.from({ length: remainingTokens }).map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-orange-400 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <TowerVisualization data={personalityData} />
        </div>
      </div>
    </div>
  );
}