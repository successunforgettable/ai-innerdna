import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import StateCard from '@/components/StateCard';
import StateSlider from '@/components/StateSlider';
import { stateOptions } from '@/lib/stateOptions';
import '@/styles/color-phase.css';

export default function ColorPhase() {
  const [, setLocation] = useLocation();
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  // ColorPhase state management
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [canProceed, setCanProceed] = useState(false);
  const [distributions, setDistributions] = useState<Record<string, number>>({});

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

  useEffect(() => {
    setCanProceed(selectedStates.length === 2);
  }, [selectedStates]);

  const handleContinue = () => {
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

    setCurrentScreen('detail-tokens');
    setLocation('/detail-tokens');
  };

  return (
    <div className="color-phase">
      <div className="color-phase-header">
        <h1 className="foundation-title">Color State Selection</h1>
        <p className="phase-description">Select 2 color palettes that represent your current experience</p>
      </div>
      
      <div className="color-phase-content">
        <div className="color-selection-column">
          <div className="glass-container">
            <h3 className="title-primary">State Selection</h3>
            <p className="section-description">Choose exactly 2 color palettes from the 5 options below</p>
            
            <div className="color-states-grid">
              {stateOptions.map((state) => (
                <StateCard
                  key={state.id}
                  state={{
                    name: state.name,
                    color: state.color,
                    description: state.description
                  }}
                  isSelected={selectedStates.includes(state.id)}
                  onSelect={() => handleStateSelect(state.id)}
                />
              ))}
            </div>

            {selectedStates.length === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <StateSlider
                  value={distributions[selectedStates[0]] || 50}
                  onChange={(value) => {
                    const newDistributions = {
                      [selectedStates[0]]: value,
                      [selectedStates[1]]: 100 - value
                    };
                    setDistributions(newDistributions);
                  }}
                  colors={[
                    stateOptions.find(s => s.id === selectedStates[0])?.color || '#000',
                    stateOptions.find(s => s.id === selectedStates[1])?.color || '#000'
                  ] as [string, string]}
                  stateNames={[
                    stateOptions.find(s => s.id === selectedStates[0])?.name || '',
                    stateOptions.find(s => s.id === selectedStates[1])?.name || ''
                  ] as [string, string]}
                />
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="tower-column">
          <div className="glass-container">
            <h3 className="tower-title">Your Tower</h3>
            <div className="color-tower-visualization">
              <div className="foundation-base">
                <span className="foundation-text">Foundation Complete</span>
              </div>
              
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
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: distribution / 100 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {state?.name} ({distribution}%)
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <p className="foundation-description">
              Colors apply to tower in real-time
            </p>
          </div>
        </div>
      </div>
      
      <div className="color-phase-navigation">
        <motion.button 
          className="btn-primary"
          disabled={!canProceed}
          onClick={handleContinue}
          whileHover={canProceed ? { scale: 1.02 } : {}}
          whileTap={canProceed ? { scale: 0.98 } : {}}
        >
          Continue to Detail Tokens
        </motion.button>
      </div>
    </div>
  );
}