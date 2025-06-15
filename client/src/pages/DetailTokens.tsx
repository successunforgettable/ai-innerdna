import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion, AnimatePresence } from 'framer-motion';
import ContinueButton from '@/components/ContinueButton';
import { TowerVisualization } from '@/components/TowerVisualization';
import Token from '@/components/Token';
import '@/styles/detail-phase.css';

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

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

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
      {/* Header following exact DetailPhase spec */}
      <div className="detail-phase-header">
        <motion.h1 
          className="detail-phase__title"
          variants={containerVariants}
        >
          Distribute Your Energy
        </motion.h1>
        
        <motion.p 
          className="detail-phase__subtitle"
          variants={containerVariants}
        >
          Place 10 tokens across the three areas based on where you naturally focus your energy
        </motion.p>
        
        {/* Progress Counter */}
        <motion.div 
          className="progress-counter"
          variants={containerVariants}
        >
          <span className="progress-text">
            Total: {totalTokens}/10 • Remaining: {remainingTokens}
          </span>
          <div className={`validation-message ${
            totalTokens === 10 ? 'success' : 
            totalTokens > 10 ? 'warning' : 
            'info'
          }`}>
            {totalTokens === 0 ? "Drag tokens to containers to begin" :
             totalTokens < 10 ? `${remainingTokens} tokens remaining` :
             totalTokens === 10 ? "Perfect! All tokens distributed" :
             "Too many tokens distributed"}
          </div>
        </motion.div>
      </div>
      
      {/* 2-column layout following DetailPhase spec */}
      <div className="detail-phase-content">
        {/* Left Column - Token Distribution */}
        <motion.div 
          className="token-section"
          variants={containerVariants}
        >
          <div className="glass-container">
            <h2 className="section-title">Available Tokens</h2>
            <p className="section-description">Drag tokens to the containers below</p>
            
            {/* Token Pool */}
            <div className="token-pool">
              {remainingTokens > 0 ? (
                Array.from({ length: remainingTokens }).map((_, index) => (
                  <Token
                    key={`token-${index}`}
                    onDrop={handleTokenDrop}
                  />
                ))
              ) : (
                <p className="empty-state">All tokens distributed</p>
              )}
            </div>
          </div>

          {/* Three Containers following Section 7.2 spec */}
          <div className="containers-section">
            {containers.map((container) => (
              <div 
                key={container.id}
                className="glass-container energy-container"
                data-container-id={container.id}
              >
                <div className="container-header">
                  <h4 className="container-title">
                    {container.emoji} {container.title}
                  </h4>
                  <span className="token-count">
                    Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                  </span>
                </div>
                <p className="container-description">
                  {container.description}
                </p>

                {/* Display tokens in container */}
                <div className="tokens-display">
                  {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                    <div
                      key={index}
                      className="token token-placed"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="detail-phase-navigation"
              >
                <ContinueButton
                  canProceed={isComplete}
                  onContinue={handleContinue}
                >
                  Continue to Results
                </ContinueButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Column - Tower Visualization */}
        <motion.div 
          className="glass-container tower-container"
          variants={containerVariants}
        >
          <h2 className="tower-title">Your Tower</h2>
          <TowerVisualization 
            title=""
            data={{ tokenDistribution }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailPhase;