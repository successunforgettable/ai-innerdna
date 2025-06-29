import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { buildingBlocks } from '@/lib/stoneData';
import { determinePersonalityType, determineWing } from '@/lib/assessmentAlgorithm';
import { motion } from 'framer-motion';
import BuildingBlock from '@/components/BuildingBlock';
import '@/styles/detail-phase.css';

interface BuildingBlockData {
  id: number;
  type: number;
  wing: string;
  name: string;
  description: string;
  gradient: string;
}

export default function BuildingBlocks() {
  const [, setLocation] = useLocation();
  const { setCurrentScreen, assessmentData, setAssessmentData, stoneSelections } = useAssessment();
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [primaryType, setPrimaryType] = useState<string>('1');
  const [availableBlocks, setAvailableBlocks] = useState<BuildingBlockData[]>([]);

  useEffect(() => {
    // Determine primary type from foundation stones assessment
    const validSelections = stoneSelections.filter(s => s !== null) as number[];
    if (validSelections.length === 9) {
      const result = determinePersonalityType(validSelections);
      setPrimaryType(result.primaryType);
      const typeNum = parseInt(result.primaryType);
      const blocks = buildingBlocks[typeNum as keyof typeof buildingBlocks] || buildingBlocks[1];
      setAvailableBlocks(blocks);
    } else {
      // Default to type 1 for testing if assessment not complete
      const blocks = buildingBlocks[1];
      setAvailableBlocks(blocks);
    }
  }, [stoneSelections]);

  const handleBlockSelect = (blockId: number) => {
    setSelectedBlock(blockId);
    
    if (availableBlocks[blockId]) {
      const selectedBlockData = availableBlocks[blockId];
      const wingResult = determineWing(primaryType, blockId);
      
      setAssessmentData({
        ...assessmentData,
        buildingBlocks: [{
          type: selectedBlockData.type,
          name: selectedBlockData.name,
          description: selectedBlockData.description,
          wing: wingResult.wing
        }]
      });
    }
  };

  // Get the current wing number for display
  const getCurrentWing = () => {
    if (selectedBlock !== null) {
      return availableBlocks[selectedBlock]?.wing;
    }
    return null;
  };

  const handleContinue = () => {
    if (selectedBlock !== null) {
      const wingData = determineWing(primaryType, selectedBlock);
      setCurrentScreen('color-phase');
      setLocation('/color-phase');
    }
  };



  return (
    <div className="page-container">
      <div className="building-content">
        <header className="building-header">
          <h1 className="detail-phase__title">Building Block Experience</h1>
          <p className="detail-phase__subtitle">Based on your determined type, select 1 block representing your influence</p>
        </header>
        
        <section className="block-selection-area">
          <h3 className="detail-phase__title">Building Block Selection</h3>
          <p className="section-description">Select one building block from options below</p>
          
          <div className="blocks-grid">
            {availableBlocks.map((option) => (
              <BuildingBlock
                key={option.id}
                content={option.description}
                isSelected={selectedBlock === option.id}
                onSelect={() => handleBlockSelect(option.id)}
                gradient={option.gradient}
                blockName={option.name}
              />
            ))}
          </div>
          
          <div className="flex justify-center items-center mt-6 gap-8">
            <motion.button 
              className="btn-primary"
              onClick={() => {
                setCurrentScreen('foundation-stones');
                setLocation('/foundation-stones');
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Foundation Stones
            </motion.button>
            
            <motion.button 
              className="btn-primary"
              disabled={selectedBlock === null}
              onClick={handleContinue}
              whileHover={selectedBlock !== null ? { scale: 1.02 } : {}}
              whileTap={selectedBlock !== null ? { scale: 0.98 } : {}}
            >
              Continue
            </motion.button>
          </div>
        </section>
        
        <aside className="tower-visualization-area">
          <h3 className="detail-phase__title">Your Tower</h3>
          <div className="tower-building-view">
            <motion.div 
              className="foundation-base"
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="foundation-text">Foundation Stones Complete</span>
            </motion.div>
            
            <div className="building-block-area">
              {selectedBlock !== null && (
                <motion.div 
                  className="placed-block"
                  style={{ background: availableBlocks[selectedBlock]?.gradient }}
                  initial={{ y: -20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25,
                    delay: 0.1
                  }}
                >
                  {availableBlocks[selectedBlock]?.name}
                  <br />
                  {getCurrentWing()}
                </motion.div>
              )}
            </div>
          </div>
          <p className="foundation-description">
            {selectedBlock === null 
              ? "Select a building block to add to your tower..." 
              : `${availableBlocks[selectedBlock]?.name} block added to tower position`
            }
          </p>
        </aside>
      </div>
    </div>
  );
}