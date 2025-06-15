import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';
import StateCard from '@/components/StateCard';
import '@/styles/color-phase.css';

export default function ColorPhase() {
  const [, setLocation] = useLocation();
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [distributions, setDistributions] = useState<Record<string, number>>({});

  // Exact 5 state options from Section 6.2
  const colorStates = [
    { 
      id: 'very-good', 
      name: 'Very Good State', 
      color: '#22c55e', 
      description: 'Peak performance - You feel balanced, authentic, and naturally flowing' 
    },
    { 
      id: 'good', 
      name: 'Good State', 
      color: '#34d399', 
      description: 'Positive functioning - You\'re engaged, healthy, and constructive' 
    },
    { 
      id: 'average', 
      name: 'Average State', 
      color: '#f59e0b', 
      description: 'Mixed patterns - Some restrictions, habitual responses, moderate stress' 
    },
    { 
      id: 'below-average', 
      name: 'Below Average State', 
      color: '#f97316', 
      description: 'Stress responses - Defensive patterns, energy depletion, reactive' 
    },
    { 
      id: 'destructive', 
      name: 'Destructive State', 
      color: '#ef4444', 
      description: 'Crisis mode - Harmful patterns, disconnection, overwhelming stress' 
    }
  ];

  const handleStateSelect = (stateId: string) => {
    if (selectedStates.includes(stateId)) {
      // Deselect
      const newSelected = selectedStates.filter(id => id !== stateId);
      setSelectedStates(newSelected);
      
      const newDistributions = { ...distributions };
      delete newDistributions[stateId];
      setDistributions(newDistributions);
    } else if (selectedStates.length < 2) {
      // Select - exactly 2 as per Section 6.1
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

  const handleDistributionChange = (stateId: string, value: number) => {
    const otherStateId = selectedStates.find(id => id !== stateId);
    if (otherStateId) {
      const newDistributions = {
        [stateId]: value,
        [otherStateId]: 100 - value
      };
      setDistributions(newDistributions);
    }
  };

  const handleContinue = () => {
    const colorStateSelections = selectedStates.map(stateId => {
      const state = colorStates.find(s => s.id === stateId);
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

  const canContinue = selectedStates.length === 2;

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
              {colorStates.map((state) => (
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
                className="distribution-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h4 className="distribution-title">Adjust Distribution</h4>
                <p className="distribution-description">Set the balance between your selected states (must total 100%)</p>
                
                {selectedStates.map((stateId) => {
                  const state = colorStates.find(s => s.id === stateId);
                  return (
                    <div key={stateId} className="distribution-slider">
                      <label className="slider-label">
                        {state?.name}: {distributions[stateId]}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={distributions[stateId] || 0}
                        onChange={(e) => handleDistributionChange(stateId, parseInt(e.target.value))}
                        className="color-slider"
                        style={{ 
                          background: `linear-gradient(to right, ${state?.color}, ${state?.color})`
                        }}
                      />
                      <div className="percentage-display">
                        {distributions[stateId] || 0}% / {100 - (distributions[stateId] || 0)}%
                      </div>
                    </div>
                  );
                })}
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
                    const state = colorStates.find(s => s.id === stateId);
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
          disabled={!canContinue}
          onClick={handleContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
        >
          Continue to Detail Tokens
        </motion.button>
      </div>
    </div>
  );
}