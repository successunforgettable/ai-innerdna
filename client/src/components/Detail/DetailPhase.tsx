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

                {/* Display tokens in container */}
                <div className="tokens-display">
                  {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                    <div
                      key={index}
                      className="token"
                      onClick={(e) => handleTokenRemove(container.id, e)}
                      title="Click to remove token"
                      style={{
                        cursor: 'pointer',
                        opacity: 1,
                        visibility: 'visible'
                      }}
                    />
                  ))}
                </div>
                
                {/* Click instruction area */}
                <div className="click-instruction-area mt-2">
                  {remainingTokens > 0 ? (
                    <div 
                      className="text-white/50 text-xs italic cursor-pointer hover:text-white/70 transition-colors duration-200 p-2 rounded border border-white/20 hover:border-white/40"
                      onClick={() => handleContainerClick(container.id)}
                    >
                      Click to add token or drag token here
                    </div>
                  ) : (
                    tokenDistribution[container.id as keyof TokenDistribution] > 0 && (
                      <div className="text-white/40 text-xs italic p-2">
                        Click tokens above to remove them
                      </div>
                    )
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
            
            {/* Visual Tower Building */}
            <div className="tower-building">
              {/* Detail Tokens Layer (Current) */}
              <div className="tower-layer current-layer">
                <div className="layer-header">
                  <span className="layer-title">Detail Tokens</span>
                  <span className="layer-progress">{totalTokens}/10</span>
                </div>
                <div className="layer-block detail-tokens-block">
                  <div className="token-distribution-mini">
                    <div className="mini-token-group">
                      <span className="mini-label">🛡️</span>
                      <div className="mini-tokens">
                        {Array.from({ length: tokenDistribution.self }).map((_, i) => (
                          <div key={i} className="mini-token blue" />
                        ))}
                      </div>
                    </div>
                    <div className="mini-token-group">
                      <span className="mini-label">🔥</span>
                      <div className="mini-tokens">
                        {Array.from({ length: tokenDistribution.oneToOne }).map((_, i) => (
                          <div key={i} className="mini-token red" />
                        ))}
                      </div>
                    </div>
                    <div className="mini-token-group">
                      <span className="mini-label">🧱</span>
                      <div className="mini-tokens">
                        {Array.from({ length: tokenDistribution.social }).map((_, i) => (
                          <div key={i} className="mini-token green" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color States Layer (Complete) */}
              <div className="tower-layer completed-layer">
                <div className="layer-header">
                  <span className="layer-title">Color States</span>
                  <span className="layer-status">✓</span>
                </div>
                <div className="layer-block color-states-block">
                  <div className="color-gradient-display">
                    <div className="gradient-bar" style={{
                      background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)'
                    }} />
                  </div>
                </div>
              </div>

              {/* Building Blocks Layer (Complete) */}
              <div className="tower-layer completed-layer">
                <div className="layer-header">
                  <span className="layer-title">Building Blocks</span>
                  <span className="layer-status">✓</span>
                </div>
                <div className="layer-block building-blocks-block">
                  <div className="block-stack">
                    <div className="mini-block" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }} />
                    <div className="mini-block" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }} />
                    <div className="mini-block" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} />
                  </div>
                </div>
              </div>

              {/* Foundation Layer (Complete) */}
              <div className="tower-layer completed-layer foundation-layer">
                <div className="layer-header">
                  <span className="layer-title">Foundation</span>
                  <span className="layer-status">✓</span>
                </div>
                <div className="layer-block foundation-block">
                  <div className="foundation-stones">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="foundation-stone" />
                    ))}
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