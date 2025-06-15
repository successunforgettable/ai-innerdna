import { useState } from 'react';
import { motion } from 'framer-motion';
import { TowerVisualization } from '../components/TowerVisualization';

export default function DetailPhase({ personalityData, onComplete }) {
  const [tokenDistribution, setTokenDistribution] = useState({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;

  // Simple token display first
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Token Distribution */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
              <p className="text-white/80 mb-8">Place 10 tokens across the three areas</p>
              
              <div className="text-white mb-6">Total: {totalTokens}/10 • Remaining: {remainingTokens}</div>

              {/* Simple token display */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Available Tokens</h2>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 min-h-[80px] border border-white/10">
                  <div className="flex flex-wrap gap-3 justify-center">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg border-2 border-white/20"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Containers from previous prompts */}
              <div className="space-y-6">
                <div 
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  data-container-id="self"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🛡️</span>
                    <h3 className="text-xl font-semibold text-white">Self-Preservation Focus</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    Energy devoted to personal security, routines, and maintaining your environment
                  </p>
                  <div className="text-white font-medium">Tokens: {tokenDistribution.self}</div>
                </div>

                <div 
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  data-container-id="oneToOne"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🔥</span>
                    <h3 className="text-xl font-semibold text-white">One-to-One Focus</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    Energy devoted to intense personal connections and important relationships
                  </p>
                  <div className="text-white font-medium">Tokens: {tokenDistribution.oneToOne}</div>
                </div>

                <div 
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  data-container-id="social"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">🧱</span>
                    <h3 className="text-xl font-semibold text-white">Social Focus</h3>
                  </div>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    Energy devoted to group dynamics, community belonging, and social awareness
                  </p>
                  <div className="text-white font-medium">Tokens: {tokenDistribution.social}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tower */}
          <TowerVisualization 
            title="Your Tower" 
            data={{
              tokenDistribution: tokenDistribution
            }}
          />
        </div>
      </div>
    </div>
  );
}