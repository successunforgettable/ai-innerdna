import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import { TowerVisualization } from '@/components/TowerVisualization';
import Token from '@/components/Token';
import '@/styles/detail-phase.css';

interface DetailPhaseProps {
  personalityData?: any;
  onComplete?: (subtypeData: any) => void;
}

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

const DetailPhase: React.FC<DetailPhaseProps> = ({ personalityData, onComplete }) => {
  const { setCurrentScreen } = useAssessment();
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

  const determineSubtypeStack = (distribution: TokenDistribution) => {
    const { self, oneToOne, social } = distribution;
    
    // Validate total equals 10
    if (self + oneToOne + social !== 10) {
      throw new Error('Token distribution must total 10');
    }
    
    const sortedSubtypes = [
      { name: 'self', count: self, label: 'Self-Preservation' },
      { name: 'oneToOne', count: oneToOne, label: 'One-to-One' },
      { name: 'social', count: social, label: 'Social' }
    ].sort((a, b) => b.count - a.count);

    // Calculate dominance percentages
    const dominanceScores = {
      self: (self / 10) * 100,
      oneToOne: (oneToOne / 10) * 100,
      social: (social / 10) * 100
    };

    // Determine stack type
    const primaryCount = sortedSubtypes[0].count;
    let stackType;
    if (primaryCount >= 6) {
      stackType = 'dominant';
    } else if (primaryCount - sortedSubtypes[1].count <= 1) {
      stackType = 'balanced';
    } else {
      stackType = 'moderate';
    }

    return {
      primary: sortedSubtypes[0].name,
      secondary: sortedSubtypes[1].name,
      tertiary: sortedSubtypes[2].name,
      stackType: stackType,
      dominance: dominanceScores,
      description: generateSubtypeDescription(sortedSubtypes, stackType)
    };
  };

  const generateSubtypeDescription = (subtypes: any[], stackType: string) => {
    const primary = subtypes[0];
    const descriptions: Record<string, string> = {
      dominant: `You have a strongly ${primary.label.toLowerCase()}-focused approach to life, with ${primary.count} out of 10 energy units devoted to this area.`,
      balanced: `You maintain a relatively balanced approach across instincts, with your ${primary.label.toLowerCase()} focus slightly leading.`,
      moderate: `You focus moderately on ${primary.label.toLowerCase()} while maintaining some attention to other areas.`
    };
    return descriptions[stackType] || descriptions.moderate;
  };

  const handleContinue = () => {
    if (isComplete) {
      const subtypeData = determineSubtypeStack(tokenDistribution);
      if (onComplete) {
        onComplete({
          ...personalityData,
          subtypes: subtypeData,
          tokenDistribution
        });
      }
      setCurrentScreen('results');
    }
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header following exact spec pattern */}
      <div className="detail-phase-header">
        <h1 className="detail-phase__title">Distribute Your Energy</h1>
        <p className="detail-phase__subtitle">
          Place 10 tokens across the three areas based on where you naturally focus your energy
        </p>
        
        {/* Progress Counter */}
        <div className="progress-counter">
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
        </div>
      </div>
      
      {/* 2-column layout following Section 10.1 spec */}
      <div className="detail-phase-content">
        {/* Left Column - Token Distribution */}
        <div className="space-y-6">
          {/* Available Tokens */}
          <div className="glass-container token-container">
            <h3>Available Tokens</h3>
            <p className="section-description">Drag tokens to the containers below</p>
            
            <div className="token-pool">
              {remainingTokens > 0 ? (
                Array.from({ length: remainingTokens }).map((_, index) => (
                  <Token
                    key={`token-${index}`}
                    onDrop={handleTokenDrop}
                  />
                ))
              ) : (
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic' }}>
                  All tokens distributed
                </p>
              )}
            </div>
          </div>

          {/* Three Containers following Section 7.2 spec */}
          <div className="space-y-4">
            {containers.map((container) => (
              <div 
                key={container.id}
                className="energy-container"
                data-container-id={container.id}
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
                  <div className="token-count">
                    Tokens: {tokenDistribution[container.id as keyof TokenDistribution]}
                  </div>
                </div>

                {/* Display tokens in container */}
                <div className="tokens-display">
                  {Array.from({ length: tokenDistribution[container.id as keyof TokenDistribution] }).map((_, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-orange-300"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          {isComplete && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleContinue}
              className="continue-button"
            >
              Continue to Results
            </motion.button>
          )}
        </div>

        {/* Right Column - Tower Visualization following spec */}
        <div className="glass-container tower-container">
          <h3 className="tower-title">Your Tower</h3>
          <TowerVisualization 
            title=""
            data={{ tokenDistribution }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DetailPhase;