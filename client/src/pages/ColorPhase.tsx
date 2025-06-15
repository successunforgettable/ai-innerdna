import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion, AnimatePresence } from 'framer-motion';
import StateCard from '@/components/StateCard';
import StateSlider from '@/components/StateSlider';
import ContinueButton from '@/components/ContinueButton';
import { stateOptions } from '@/lib/stateOptions';
import '@/styles/color-phase.css';

// Page entrance animation
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// State card animations
const cardVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  hover: { scale: 1.02, y: -2 }
};

// Slider animations
const sliderVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 }
};

// Tower animations
const towerVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 }
};

export default function ColorPhase() {
  const [, setLocation] = useLocation();
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  // ColorPhase state management
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const [distributions, setDistributions] = useState<Record<string, number>>({});
  const [colorDistribution, setColorDistribution] = useState({ primary: 70, secondary: 30 });

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
    // Save color state data
    const colorStateData = {
      selectedStates,
      distribution: colorDistribution,
      timestamp: Date.now()
    };

    const colorStateSelections = selectedStates.map(stateId => {
      const state = stateOptions.find(s => s.id === stateId);
      return {
        state: stateId,
        title: state?.name || '',
        distribution: distributions[stateId] || 0
      };
    });

    setAssessmentData({
      ...assessmentData,
      colorStates: colorStateSelections
    });

    // Navigate to Detail Phase (Section 7)
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
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="color-phase-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="foundation-title">Color State Selection</h1>
        <p className="phase-description">Select 2 color palettes that represent your current experience</p>
      </motion.div>
      
      <motion.div 
        className="color-phase-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.div 
          className="color-selection-column"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="glass-container">
            <h3 className="section-title">State Selection</h3>
            <p className="section-description">Choose exactly 2 color palettes from the 5 options below</p>
            
            <div className="color-states-grid">
              {stateOptions.map((state, index) => (
                <motion.div
                  key={state.id}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
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
                  variants={sliderVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
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
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="glass-container">
            <h3 className="tower-title">Your Tower</h3>
            <motion.div 
              className="tower-color-preview"
              variants={towerVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="tower-visualization">
                <motion.div 
                  className="foundation-base"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  <span className="foundation-text">Foundation Complete</span>
                </motion.div>
                
                <AnimatePresence>
                  {selectedStates.length > 0 && (
                    <div className="color-tower-blocks">
                      {selectedStates.map((stateId, index) => {
                        const state = stateOptions.find(s => s.id === stateId);
                        const distribution = distributions[stateId] || 0;
                        
                        return (
                          <motion.div
                            key={stateId}
                            className="color-tower-block"
                            style={{ 
                              background: state?.color,
                              height: `${Math.max(distribution / 2, 20)}px`,
                              opacity: distribution / 100
                            }}
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{ 
                              scale: 1, 
                              opacity: distribution / 100,
                              y: 0
                            }}
                            exit={{ scale: 0, opacity: 0, y: -20 }}
                            transition={{ 
                              delay: 1.1 + index * 0.1,
                              duration: 0.5,
                              type: "spring",
                              stiffness: 100
                            }}
                          >
                            {state?.name} ({distribution}%)
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
            
            <motion.p 
              className="foundation-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              Colors apply to tower in real-time
            </motion.p>
          </div>
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