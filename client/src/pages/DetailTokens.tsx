// src/components/Detail/DetailPhase.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TowerVisualization } from '../components/TowerVisualization';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Token Distribution */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h1 className="text-3xl font-bold text-white mb-2">Distribute Your Energy</h1>
              <p className="text-white/80 mb-8">Place 10 tokens across the three areas based on where you focus most of your energy</p>
              
              {/* Token containers and distribution logic will go here */}
            </div>
          </div>

          {/* Right Column - Tower */}
          <TowerVisualization data={personalityData} />
        </div>
      </div>
    </div>
  );
}