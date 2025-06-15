import { useState } from 'react';

export default function DetailPhase() {
  const [tokenDistribution, setTokenDistribution] = useState({
    self: 0, 
    oneToOne: 0, 
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = 10 - totalTokens;
  
  console.log('DetailPhase Debug:', { tokenDistribution, totalTokens, remainingTokens });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
            <p className="text-white/80 mb-8">Place 10 tokens across the three areas</p>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Available Tokens</h2>
                <div className="text-white/80">{remainingTokens} remaining</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 min-h-[100px]">
                <div className="flex flex-wrap gap-4 justify-center">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-lg border-2 border-white/20"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}