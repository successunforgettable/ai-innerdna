import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TowerVisualizationProps {
  title: string;
  blocks?: Array<{
    gradient: string;
    width: string;
    height: string;
  }>;
  selectedStates?: string[];
  distribution?: { primary: number; secondary: number };
  stateOptions?: Array<{
    id: string;
    name: string;
    color: string;
    description: string;
  }>;
}

export function TowerVisualization({ 
  title, 
  blocks, 
  selectedStates = [], 
  distribution = { primary: 50, secondary: 50 }, 
  stateOptions = [] 
}: TowerVisualizationProps) {
  const [towerGradient, setTowerGradient] = useState('');
  
  useEffect(() => {
    if (selectedStates.length === 2) {
      const primaryState = stateOptions.find(s => s.id === selectedStates[0]);
      const secondaryState = stateOptions.find(s => s.id === selectedStates[1]);
      
      if (primaryState && secondaryState) {
        const gradient = `linear-gradient(180deg, ${primaryState.color} 0%, ${primaryState.color} ${distribution.primary}%, ${secondaryState.color} ${distribution.primary}%, ${secondaryState.color} 100%)`;
        setTowerGradient(gradient);
      }
    } else {
      setTowerGradient('rgba(255, 255, 255, 0.1)');
    }
  }, [selectedStates, distribution, stateOptions]);

  // Legacy tower visualization for building blocks
  if (blocks) {
    const getWidthValue = (width: string) => {
      switch(width) {
        case 'w-48': return '12rem';
        case 'w-44': return '11rem';
        case 'w-40': return '10rem';
        case 'w-36': return '9rem';
        case 'w-32': return '8rem';
        case 'w-28': return '7rem';
        case 'w-24': return '6rem';
        case 'w-20': return '5rem';
        case 'w-16': return '4rem';
        default: return '6rem';
      }
    };

    const getHeightValue = (height: string) => {
      switch(height) {
        case 'h-12': return '3rem';
        case 'h-8': return '2rem';
        case 'h-6': return '1.5rem';
        default: return '2rem';
      }
    };

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.25rem',
        width: '100%',
        height: 'auto'
      }}>
        {title && (
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'white',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {title}
          </h3>
        )}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          width: '100%'
        }}>
          {blocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              style={{
                background: block.gradient,
                width: getWidthValue(block.width),
                height: getHeightValue(block.height),
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Color phase tower visualization
  return (
    <div className="tower-visualization-container">
      <h3 className="tower-title">{title}</h3>
      
      <motion.div
        className="tower-visualization"
        style={{ background: towerGradient }}
        animate={{
          background: towerGradient,
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        <div className="tower-content">
          {selectedStates.length === 0 && (
            <div className="tower-placeholder">
              <span>Select states to see colors</span>
            </div>
          )}
          
          {selectedStates.length === 1 && (
            <div className="tower-partial">
              <span>Select one more state</span>
            </div>
          )}
          
          {selectedStates.length === 2 && (
            <div className="tower-complete">
              <div className="foundation-indicator">
                Foundation Complete
              </div>
              <div className="color-preview">
                <div 
                  className="color-section primary"
                  style={{ 
                    background: stateOptions.find(s => s.id === selectedStates[0])?.color,
                    height: `${distribution.primary}%`
                  }}
                />
                <div 
                  className="color-section secondary"
                  style={{ 
                    background: stateOptions.find(s => s.id === selectedStates[1])?.color,
                    height: `${distribution.secondary}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      <div className="tower-description">
        {selectedStates.length === 2 ? 
          'Colors apply to tower in real-time' : 
          'Select 2 color states to preview'
        }
      </div>
    </div>
  );
}
