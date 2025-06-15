import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DetailPhase({ personalityData, onComplete }) {
  const [tokenDistribution, setTokenDistribution] = useState({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
          <p className="text-white/80 mb-8">Place 10 tokens across the three areas</p>
          
          <div className="text-white">Total: {totalTokens}/10 • Remaining: {remainingTokens}</div>
        </div>
      </div>
    </div>
  );
}