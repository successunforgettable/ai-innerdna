import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import ContinueButton from '@/components/ContinueButton';
import { TowerVisualization } from '@/components/TowerVisualization';
import Token from './Token';
import '@/styles/detail-phase.css';

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

// Enhanced Page Animations - exact from ColorPhase
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3
    }
  }
};

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

  // Drop zone handlers for containers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleTokenDrop(containerId);
  };

  // Click-to-add functionality as specified in Section 7.1
  const handleContainerClick = (containerId: string) => {
    console.log('Container clicked:', containerId, 'Remaining tokens:', remainingTokens);
    
    if (remainingTokens <= 0) {
      console.log('No tokens remaining');
      return;
    }
    
    const validIds: (keyof TokenDistribution)[] = ['self', 'oneToOne', 'social'];
    if (validIds.includes(containerId as keyof TokenDistribution)) {
      console.log('Adding token to:', containerId);
      setTokenDistribution(prev => {
        const newDistribution = {
          ...prev,
          [containerId]: prev[containerId as keyof TokenDistribution] + 1
        };
        console.log('New distribution:', newDistribution);
        return newDistribution;
      });
    }
  };

  // Remove token functionality
  const handleTokenRemove = (containerId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container click from firing
    
    const validIds: (keyof TokenDistribution)[] = ['self', 'oneToOne', 'social'];
    if (validIds.includes(containerId as keyof TokenDistribution)) {
      const currentCount = tokenDistribution[containerId as keyof TokenDistribution];
      if (currentCount > 0) {
        setTokenDistribution(prev => ({
          ...prev,
          [containerId]: prev[containerId as keyof TokenDistribution] - 1
        }));
      }
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
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="container mx-auto px-4 py-8 h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-w-7xl mx-auto">
            
            {/* Left Column - Token Distribution */}
            <div className="flex flex-col space-y-6 overflow-y-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h1 className="text-3xl font-bold text-white mb-2">Detail Token Distribution</h1>
                <p className="text-white/80 mb-6">Distribute 10 tokens across the three areas to show your energy focus</p>
                
                {/* Progress indicator */}
                <div className="text-white/80 mb-6">
                  Tokens distributed: {totalTokens}/10
                  {remainingTokens > 0 && <span className="text-orange-300 ml-2">({remainingTokens} remaining)</span>}
                  {isComplete && <span className="text-green-300 ml-2">✓ Complete!</span>}
                </div>

                {/* Available Tokens Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Available Tokens</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: remainingTokens }).map((_, index) => (
                      <Token
                        key={`token-${index}`}
                        onDrop={handleTokenDrop}
                      />
                    ))}
                    {remainingTokens === 0 && (
                      <p className="text-white/50 italic">All tokens distributed</p>
                    )}
                  </div>
                </div>

                {/* Three Containers */}
                <div className="space-y-6">
                  {containers.map((container) => (
                    <div 
                      key={container.id}
                      className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/20 hover:border-orange-400/50 transition-all duration-200 cursor-pointer"
                      data-container-id={container.id}
                      onClick={() => handleContainerClick(container.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, container.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                            {container.emoji} {container.title}
                          </h4>
                          <p className="text-white/70 text-sm mt-1">
                            {container.description}
                          </p>
                        </div>
                        <span className="text-orange-400 font-semibold">
                          Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                        </span>
                      </div>

                      {/* Container interaction area with tokens or add instruction */}
                      <div 
                        className="bg-white/5 rounded border border-white/20 hover:border-white/40 cursor-pointer transition-all duration-200 min-h-[60px] flex items-center justify-center p-3"
                        onClick={() => handleContainerClick(container.id)}
                      >
                        {tokenDistribution[container.id as keyof TokenDistribution] > 0 ? (
                          <div className="flex flex-wrap gap-2 justify-center">
                            {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full border border-orange-300/50 cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTokenRemove(container.id, e);
                                }}
                                title="Click to remove token"
                              />
                            ))}
                          </div>
                        ) : remainingTokens > 0 ? (
                          <div className="text-white/50 text-xs italic text-center">
                            Click to add token or drag token here
                          </div>
                        ) : (
                          <div className="text-white/30 text-xs italic text-center">
                            No tokens available
                          </div>
                        )}
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
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 w-fit">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">Your Tower Progress</h3>
                <div className="flex flex-col items-center" style={{ width: '300px', height: '400px' }}>
                  {/* Tower visualization */}
                  <div className="flex flex-col gap-2 w-full h-full justify-center">
                    {/* Detail Tokens Layer (Current) */}
                    <div className="bg-orange-500/20 rounded-lg p-3 border border-orange-400/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-medium">Detail Tokens</span>
                        <span className="text-orange-400 text-xs font-semibold">{totalTokens}/10</span>
                      </div>
                      <div className="flex gap-1 justify-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs">🛡️</span>
                          <div className="flex gap-1">
                            {Array.from({ length: tokenDistribution.self }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full" />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">🔥</span>
                          <div className="flex gap-1">
                            {Array.from({ length: tokenDistribution.oneToOne }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-red-400 rounded-full" />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs">🧱</span>
                          <div className="flex gap-1">
                            {Array.from({ length: tokenDistribution.social }).map((_, i) => (
                              <div key={i} className="w-2 h-2 bg-green-400 rounded-full" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color States Layer (Complete) */}
                    <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-medium">Color States</span>
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                      <div className="h-4 bg-gradient-to-r from-amber-500 to-green-500 rounded" />
                    </div>

                    {/* Building Blocks Layer (Complete) */}
                    <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-medium">Building Blocks</span>
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                      <div className="flex gap-1 justify-center">
                        <div className="w-6 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded" />
                        <div className="w-6 h-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded" />
                        <div className="w-6 h-4 bg-gradient-to-br from-green-500 to-green-600 rounded" />
                      </div>
                    </div>

                    {/* Foundation Layer (Complete) */}
                    <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white text-sm font-medium">Foundation</span>
                        <span className="text-green-400 text-xs">✓</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 max-w-16 mx-auto">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-gray-500 rounded-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailPhase;