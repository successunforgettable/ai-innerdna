import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '../../context/AssessmentContext';
import { useLocation } from 'wouter';
import ContinueButton from '../ContinueButton';
import Token from './Token';
import { subtypeDescriptions, type PersonalityType, type SubtypeKey } from '../../utils/subtypeDescriptions';
import '../../styles/detail-phase.css';

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

const DetailPhase = () => {
  const { assessmentData, setAssessmentData } = useAssessment();
  const [, setLocation] = useLocation();
  
  const [tokenDistribution, setTokenDistribution] = useState<TokenDistribution>({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = Math.max(0, 10 - totalTokens);
  const isComplete = totalTokens === 10;

  const handleTokenDrop = (containerId: string) => {
    if (remainingTokens > 0) {
      setTokenDistribution(prev => ({
        ...prev,
        [containerId]: prev[containerId as keyof TokenDistribution] + 1
      }));
    }
  };

  const handleContainerClick = (containerId: string) => {
    if (remainingTokens > 0) {
      handleTokenDrop(containerId);
    }
  };

  const handleContinue = () => {
    const detailTokens = [
      { category: 'self', token: `${tokenDistribution.self} tokens` },
      { category: 'oneToOne', token: `${tokenDistribution.oneToOne} tokens` },
      { category: 'social', token: `${tokenDistribution.social} tokens` }
    ];

    setAssessmentData({
      ...assessmentData,
      detailTokens,
      result: {
        primaryType: 'Type 1',
        confidence: 85,
        allScores: {},
        rawScores: {}
      }
    });

    setLocation('/results');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    handleTokenDrop(containerId);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  // Get the user's personality type from assessment data
  const userPersonalityType = assessmentData.result?.primaryType as PersonalityType || 'Type 1';
  const typeData = subtypeDescriptions[userPersonalityType];

  const containers = [
    {
      id: 'self',
      title: 'Self-Preservation Focus',
      emoji: '🔒',
      subtypeKey: 'Self-Preservation' as SubtypeKey,
      descriptions: typeData['Self-Preservation']
    },
    {
      id: 'oneToOne',
      title: 'One-to-One Focus', 
      emoji: '🔥',
      subtypeKey: 'Sexual' as SubtypeKey,
      descriptions: typeData.Sexual
    },
    {
      id: 'social',
      title: 'Social Focus',
      emoji: '🧱',
      subtypeKey: 'Social' as SubtypeKey,
      descriptions: typeData.Social
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
      
      <div className="detail-phase-content-single">
        {/* Available Tokens Section - Compact */}
        <div className="glass-container token-container-compact">
          <h3 className="section-title">Available Tokens</h3>
          <div className="token-pool-compact">
            {Array.from({ length: remainingTokens }).map((_, index) => (
              <Token
                key={`token-${index}`}
                onDrop={handleTokenDrop}
              />
            ))}
            <span className="token-count-display">
              {remainingTokens}/10 Remaining
            </span>
          </div>
        </div>

        {/* Three Distribution Containers - Horizontal Layout */}
        <div className="containers-section-horizontal">
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
                  <div className="subtype-descriptions">
                    {container.descriptions.map((description, index) => (
                      <p key={index} className="subtype-description">
                        {description}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="token-count">
                  Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                </div>
              </div>
              
              <div className="tokens-display">
                {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                  <div key={index} className="placed-token" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tower Visualization Section - Bottom */}
        <div className="tower-section-bottom">
          <div className="glass-container tower-container">
            <h3 className="tower-title">Your Tower</h3>
            
            <div className="tower-building-view">
              {/* Detail Tokens Layer (Top - Current) */}
              <motion.div 
                className="tower-layer current-layer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  width: '120px',
                  height: '40px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#f59e0b', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Detail Tokens
                  <br />
                  {totalTokens}/10
                </span>
              </motion.div>

              {/* Color States Layer */}
              <motion.div 
                className="tower-layer completed-layer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  width: '140px',
                  height: '40px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#10b981', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Color States
                  <br />
                  Complete
                </span>
              </motion.div>

              {/* Building Blocks Layer */}
              <motion.div 
                className="tower-layer completed-layer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  width: '160px',
                  height: '40px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#8b5cf6', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Building Blocks
                  <br />
                  Complete
                </span>
              </motion.div>

              {/* Foundation Layer */}
              <motion.div 
                className="tower-layer completed-layer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: '180px',
                  height: '40px',
                  background: 'rgba(107, 114, 128, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
              >
                <span style={{ 
                  color: '#6b7280', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Foundation
                  <br />
                  Complete
                </span>
              </motion.div>
            </div>
          </div>
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
    </motion.div>
  );
};

export default DetailPhase;