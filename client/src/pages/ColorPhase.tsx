import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion, AnimatePresence } from 'framer-motion';
import StateCard from '@/components/StateCard';
import StateSlider from '@/components/StateSlider';
import ContinueButton from '@/components/ContinueButton';
import { TowerVisualization } from '@/components/TowerVisualization';
import { stateOptions } from '@/lib/stateOptions';
import stateDescriptionsPart1 from '@/lib/stateDescriptionsPart1';
import stateDescriptionsPart2 from '@/lib/stateDescriptionsPart2';
import stateDescriptionsPart3 from '@/lib/stateDescriptionsPart3';
import '@/styles/color-phase.css';

// Enhanced Page Animations
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

const cardVariants = {
  initial: { 
    opacity: 0, 
    x: -20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function ColorPhase() {
  const [, setLocation] = useLocation();
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  // ColorPhase state management
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const [distributions, setDistributions] = useState<Record<string, number>>({});
  const [colorDistribution, setColorDistribution] = useState({ primary: 70, secondary: 30 });
  
  // Get personality-specific state descriptions
  const getPersonalityStateDescriptions = () => {
    const personalityType = assessmentData.result?.primaryType;
    
    if (!personalityType) {
      return null;
    }
    
    // Combine all state descriptions into one object
    const allStateDescriptions: Record<string, any> = {
      ...stateDescriptionsPart1,
      ...stateDescriptionsPart2,
      ...stateDescriptionsPart3
    };
    
    return allStateDescriptions[personalityType as keyof typeof allStateDescriptions];
  };
  
  // Get enhanced state options with personality-specific descriptions
  const getEnhancedStateOptions = () => {
    const personalityDescriptions = getPersonalityStateDescriptions();
    
    if (!personalityDescriptions) {
      return stateOptions; // Fall back to generic if no personality type
    }
    
    return stateOptions.map(state => ({
      ...state,
      description: personalityDescriptions[state.id]?.description || state.description
    }));
  };
  
  const enhancedStateOptions = getEnhancedStateOptions();

  const handleStateSelect = (stateId: string) => {
    if (selectedStates.includes(stateId)) {
      setSelectedStates(selectedStates.filter(id => id !== stateId));
      const newDistributions = { ...distributions };
      delete newDistributions[stateId];
      setDistributions(newDistributions);
    } else if (selectedStates.length < 2) {
      const newSelected = [...selectedStates, stateId];
      setSelectedStates(newSelected);
      
      const newDistributions = { ...distributions };
      if (newSelected.length === 1) {
        newDistributions[stateId] = 100;
      } else if (newSelected.length === 2) {
        newDistributions[stateId] = 50;
        newDistributions[newSelected[0]] = 50;
      }
      setDistributions(newDistributions);
    }
  };

  // Tower color update functionality
  const updateTowerColors = (selectedStates: string[], distribution: { primary: number; secondary: number }) => {
    const primaryState = selectedStates[0];
    const secondaryState = selectedStates[1];
    
    if (!primaryState || !secondaryState) return;
    
    const primaryColor = stateOptions.find(s => s.id === primaryState)?.color;
    const secondaryColor = stateOptions.find(s => s.id === secondaryState)?.color;
    
    // Apply colors to tower visualization
    const towerElement = document.querySelector('.tower-visualization') as HTMLElement;
    if (towerElement && primaryColor && secondaryColor) {
      towerElement.style.background = `linear-gradient(${distribution.primary}%, ${primaryColor}, ${secondaryColor})`;
    }
  };

  const handleDistributionChange = (value: number) => {
    setColorDistribution({
      primary: value,
      secondary: 100 - value
    });
  };

  useEffect(() => {
    setCanProceed(selectedStates.length === 2);
  }, [selectedStates]);

  // Helper functions for animations
  const getSelectedColors = (): [string, string] => {
    return [
      stateOptions.find(s => s.id === selectedStates[0])?.color || '#000',
      stateOptions.find(s => s.id === selectedStates[1])?.color || '#000'
    ];
  };

  const getSelectedStateNames = (): [string, string] => {
    return [
      stateOptions.find(s => s.id === selectedStates[0])?.name || '',
      stateOptions.find(s => s.id === selectedStates[1])?.name || ''
    ];
  };

  // Update tower colors when selection or distribution changes
  useEffect(() => {
    if (selectedStates.length === 2) {
      updateTowerColors(selectedStates, colorDistribution);
    }
  }, [selectedStates, colorDistribution]);

  const handleContinue = () => {
    // Save color state data with proper structure
    const colorStateSelections = selectedStates.map(stateId => {
      const state = stateOptions.find(s => s.id === stateId);
      return {
        state: stateId,
        title: state?.name || ''
      };
    });

    const updatedAssessmentData = {
      ...assessmentData,
      colorStates: colorStateSelections
    };

    setAssessmentData(updatedAssessmentData);

    // Save to localStorage for persistence
    localStorage.setItem('innerDnaAssessment', JSON.stringify({
      ...updatedAssessmentData,
      colorState: {
        selectedStates,
        distribution: colorDistribution,
        primaryState: selectedStates[0],
        secondaryState: selectedStates[1],
        completedAt: new Date().toISOString()
      }
    }));

    // Navigate to Detail Tokens phase
    setCurrentScreen('detail-tokens');
    setLocation('/detail-tokens');
  };

  return (
    <motion.div
      className="color-phase"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="color-phase-header"
        variants={cardVariants}
      >
        <h1>Color State Selection</h1>
        <p>Select 2 color states that represent your current experience</p>
      </motion.div>
      
      <motion.div 
        className="color-phase-content"
        variants={containerVariants}
      >
        <motion.div 
          className="color-selection-column"
          variants={cardVariants}
        >
          <div className="glass-container">
            <h3 className="section-title">State Selection</h3>
            <p className="section-description">Choose exactly 2 color palettes from the 5 options below</p>
            
            <div className="color-states-grid">
              {enhancedStateOptions.map((state, index) => (
                <motion.div
                  key={state.id}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <StateCard
                    state={{
                      name: state.name,
                      color: state.color,
                      description: state.description
                    }}
                    isSelected={selectedStates.includes(state.id)}
                    onSelect={() => handleStateSelect(state.id)}
                  />
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {selectedStates.length === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -20, 
                    scale: 0.95,
                    transition: { duration: 0.3 }
                  }}
                >
                  <StateSlider
                    value={colorDistribution.primary}
                    onChange={handleDistributionChange}
                    colors={getSelectedColors()}
                    stateNames={getSelectedStateNames()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div 
          className="tower-column"
          variants={cardVariants}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <TowerVisualization
              title="Your Tower"
              selectedStates={selectedStates}
              distribution={colorDistribution}
              stateOptions={stateOptions}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="color-phase-navigation"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <ContinueButton canProceed={canProceed} onContinue={handleContinue}>
          Continue to Detail Tokens
        </ContinueButton>
      </motion.div>
    </motion.div>
  );
}