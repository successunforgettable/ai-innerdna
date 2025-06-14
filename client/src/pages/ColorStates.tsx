import { useState } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { colorStates } from '@/lib/stoneData';
import { motion } from 'framer-motion';

export default function ColorStates() {
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const maxSelections = 3;

  const handleStateSelect = (stateIndex: number) => {
    const state = colorStates[stateIndex];
    
    if (selectedStates.includes(state.state)) {
      // Deselect
      const newSelected = selectedStates.filter(s => s !== state.state);
      setSelectedStates(newSelected);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        colorStates: assessmentData.colorStates.filter(s => s.state !== state.state)
      });
    } else if (selectedStates.length < maxSelections) {
      // Select
      const newSelected = [...selectedStates, state.state];
      setSelectedStates(newSelected);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        colorStates: [...assessmentData.colorStates, {
          state: state.state,
          title: state.title
        }]
      });
    }
  };

  const handleContinue = () => {
    setCurrentScreen('detail-tokens');
  };

  return (
    <div className="page-container">
      <div className="color-states-content">
        <header className="color-states-header">
          <h2 className="foundation-title">Color States</h2>
          <p className="phase-description">Select up to 3 colors that represent your current emotional and energetic states</p>
        </header>

        <div className="color-states-main">
          <section className="glass-container color-selection-area">
            <h3 className="title-primary">State Selection</h3>
            <p className="section-description">Choose the colors that best reflect your current inner state</p>
            
            <div className="color-grid">
              {colorStates.map((state, index) => (
                <motion.div
                  key={state.state}
                  className={`color-state ${state.color} ${
                    selectedStates.includes(state.state) ? 'selected' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStateSelect(index)}
                  title={state.title}
                >
                  {selectedStates.includes(state.state) && (
                    <motion.div 
                      className="color-check-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="selection-info">
              <p className="selection-count">
                {selectedStates.length} of {maxSelections} selected
              </p>
            </div>
            
            <motion.button 
              className="btn-primary"
              disabled={selectedStates.length === 0}
              onClick={handleContinue}
              whileHover={selectedStates.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedStates.length > 0 ? { scale: 0.98 } : {}}
            >
              Continue
            </motion.button>
          </section>
          
          <aside className="glass-container color-visualization-area">
            <h3 className="tower-title">Selected Colors</h3>
            <div className="color-display">
              {selectedStates.length === 0 ? (
                <p className="empty-state">No colors selected yet</p>
              ) : (
                <div className="selected-colors">
                  {selectedStates.map(stateKey => {
                    const state = colorStates.find(s => s.state === stateKey);
                    return state ? (
                      <motion.div
                        key={state.state}
                        className={`selected-color ${state.color}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 25 
                        }}
                        title={state.title}
                      >
                        <span className="color-label">{state.title}</span>
                      </motion.div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <p className="foundation-description">
              {selectedStates.length === 0 
                ? "Select colors to see your emotional palette..." 
                : `${selectedStates.length} color${selectedStates.length !== 1 ? 's' : ''} representing your current state`
              }
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}