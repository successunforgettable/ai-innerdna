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
  
  // Access previous phase data from navigation state
  const foundationData = (window.history.state?.usr?.foundationData) || assessmentData.result;
  const buildingData = (window.history.state?.usr?.buildingData) || assessmentData.buildingBlocks?.[0];
  const colorData = (window.history.state?.usr?.colorData) || assessmentData.colorStates?.[0];
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
      className="detail-phase"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="detail-phase-header">
        <h1 className="detail-phase__title">Distribute Your Energy</h1>
        <p className="detail-phase__subtitle">Place 10 tokens across the three areas based on where you naturally focus your energy</p>
      </div>
      
      <div className="detail-phase-content">
        {/* Left Column - Token Distribution Section */}
        <div className="left-column">
          {/* Progress Counter */}
          <div className="progress-counter">
            <div className="progress-text">
              Total: {totalTokens}/10 • Remaining: {remainingTokens}
              {totalTokens === 10 && (
                <span className="validation-message success ml-2">✓ Complete</span>
              )}
              {totalTokens > 10 && (
                <span className="validation-message warning ml-2">⚠ Over limit</span>
              )}
            </div>
          </div>

          {/* Available Tokens Section */}
          <div className="glass-container token-container">
            <h3 className="section-title">Available Tokens</h3>
            <div className="token-pool">
              {Array.from({ length: remainingTokens }).map((_, index) => (
                <Token
                  key={`token-${index}`}
                  onDrop={handleTokenDrop}
                />
              ))}
              {remainingTokens === 0 && (
                <p className="section-description italic">All tokens distributed</p>
              )}
            </div>
          </div>

          {/* Three Distribution Containers */}
          <div className="containers-section">
            {containers.map((container) => (
              <div 
                key={container.id}
                className="glass-container energy-container"
                data-container-id={container.id}
                onClick={() => handleContainerClick(container.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, container.id)}
              >
                <div className="container-header">
                  <div>
                    <h4 className="container-title">
                      {container.emoji} {container.title}
                    </h4>
                    <p className="container-description">
                      {container.description}
                    </p>
                  </div>
                  <span className="token-count">
                    Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                  </span>
                </div>

                {/* Container interaction area with tokens or add instruction */}
                <div 
                  className="container-interaction-area mt-2 p-3 rounded border border-white/20 hover:border-white/40 cursor-pointer transition-all duration-200 min-h-[60px] flex items-center justify-center"
                  onClick={() => handleContainerClick(container.id)}
                >
                  {tokenDistribution[container.id as keyof TokenDistribution] > 0 ? (
                    <div className="container-tokens-display">
                      {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                        <div
                          key={index}
                          className="token container-token"
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

        {/* Right Column - Tower Visualization Section */}
        <div className="right-column">
          <div className="glass-container tower-container">
            <h3 className="tower-title">Your Tower</h3>
            
            {/* Visual Tower Building - Continuation of previous phases */}
            <div className="tower-building-view">
              
              {/* Detail Tokens Layer (Top - Current) */}
              <motion.div 
                className="detail-tokens-layer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  width: '140px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="text-white text-sm font-semibold">
                  Tokens {totalTokens}/10
                </span>
              </motion.div>

              {/* Color States Layer */}
              <motion.div 
                className="color-states-layer"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                style={{
                  width: '180px',
                  height: '60px',
                  background: colorData?.primaryColor ? 
                    `linear-gradient(135deg, ${colorData.primaryColor}, ${colorData.secondaryColor || colorData.primaryColor})` :
                    'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="text-white text-sm font-semibold">
                  Color States
                </span>
              </motion.div>

              {/* Building Blocks Layer */}
              <motion.div 
                className="building-blocks-layer"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                style={{
                  width: '220px',
                  height: '70px',
                  background: buildingData?.gradient || 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="text-white text-sm font-semibold">
                  {buildingData?.name || 'Building Block'}
                </span>
              </motion.div>

              {/* Foundation Layer (Base) */}
              <motion.div 
                className="foundation-base"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                style={{
                  width: '260px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(100, 116, 139, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className="text-white font-semibold">
                  Foundation Complete
                </span>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailPhase;