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
  const { assessmentData, setAssessmentData, setCurrentScreen } = useAssessment();
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

  const handleTokenRemove = (containerId: string) => {
    const currentCount = tokenDistribution[containerId as keyof TokenDistribution];
    if (currentCount > 0) {
      setTokenDistribution(prev => ({
        ...prev,
        [containerId]: prev[containerId as keyof TokenDistribution] - 1
      }));
    }
  };

  const handleContinue = () => {
    const detailTokens = [
      { category: 'Self-Preservation', token: `${tokenDistribution.self} tokens` },
      { category: 'One-to-One', token: `${tokenDistribution.oneToOne} tokens` },
      { category: 'Social', token: `${tokenDistribution.social} tokens` }
    ];

    setAssessmentData({
      ...assessmentData,
      detailTokens
    });

    setCurrentScreen('results');
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

  // Check if previous phases are completed
  const hasFoundation = assessmentData.foundationStones && assessmentData.foundationStones.length > 0;
  const hasBuildingBlocks = assessmentData.buildingBlocks && assessmentData.buildingBlocks.length > 0;
  const hasColorStates = assessmentData.colorStates && assessmentData.colorStates.length > 0;

  // Get the user's personality type from assessment data
  let userPersonalityType: PersonalityType = 'Type 1';
  
  if (assessmentData.result?.primaryType) {
    // Convert stored primaryType (e.g., "4") to PersonalityType format (e.g., "Type 4")
    userPersonalityType = `Type ${assessmentData.result.primaryType}` as PersonalityType;
  }
  const typeData = subtypeDescriptions[userPersonalityType];

  // Only require typeData if we actually have a personality type, otherwise use default
  const safeTypeData = typeData || {
    'Self-Preservation': ['Focus on security and stability'],
    Sexual: ['Focus on intensity and connection'],
    Social: ['Focus on community and belonging']
  };

  const containers = [
    {
      id: 'self',
      title: 'Self-Preservation Focus',
      emoji: '🔒',
      subtypeKey: 'Self-Preservation' as SubtypeKey,
      descriptions: safeTypeData['Self-Preservation'] || []
    },
    {
      id: 'oneToOne',
      title: 'One-to-One Focus', 
      emoji: '🔥',
      subtypeKey: 'Sexual' as SubtypeKey,
      descriptions: safeTypeData.Sexual || []
    },
    {
      id: 'social',
      title: 'Social Focus',
      emoji: '🧱',
      subtypeKey: 'Social' as SubtypeKey,
      descriptions: safeTypeData.Social || []
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
        <p className="detail-phase__subtitle">Drag or click any container to place all 10 tokens across the three areas based on where you naturally focus your energy</p>
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
                  <div 
                    key={index} 
                    className="placed-token clickable-token" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTokenRemove(container.id);
                    }}
                    title="Click to remove token"
                  />
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
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#000000', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Subtypes
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
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#000000', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  States
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
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#000000', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {assessmentData.buildingBlocks && assessmentData.buildingBlocks.length > 0 ? assessmentData.buildingBlocks[0].name : 'Building Block'}
                  <br />
                  {assessmentData.buildingBlocks && assessmentData.buildingBlocks.length > 0 ? assessmentData.buildingBlocks[0].wing || 'Complete' : 'Complete'}
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
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  margin: '0 auto 4px auto'
                }}
              >
                <span style={{ 
                  color: '#000000', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {userPersonalityType}
                  <br />
                  Complete
                </span>
              </motion.div>

              {/* Base Layer - Blue */}
              <motion.div 
                className="tower-layer completed-layer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: -0.1 }}
                style={{
                  width: '200px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
              >
                <span style={{ 
                  color: '#000000', 
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

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex justify-center items-center w-full gap-8"
        >
          <motion.button
            className="btn-primary"
            onClick={() => {
              setCurrentScreen('color-phase');
              setLocation('/color-phase');
            }}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.95,
              y: 0,
              transition: { duration: 0.1 }
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.8, duration: 0.4 }
            }}
          >
            ← Back to Color Phase
          </motion.button>
          
          {isComplete && (
            <ContinueButton
              canProceed={isComplete}
              onContinue={handleContinue}
            >
              Continue to Results
            </ContinueButton>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DetailPhase;