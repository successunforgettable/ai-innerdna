import { useState, useEffect } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { buildingBlocks } from '@/lib/stoneData';
import { determinePersonalityType, determineWing } from '@/lib/assessmentAlgorithm';
import { motion } from 'framer-motion';
import BuildingBlock from '@/components/BuildingBlock';

interface BuildingBlockData {
  id: number;
  type: number;
  wing: string;
  name: string;
  description: string;
  gradient: string;
}

export default function BuildingBlocks() {
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

  const handleBlockSelect = (blockIndex: number) => {
    setSelectedBlock(blockIndex);
    
    const selectedBlockData = availableBlocks[blockIndex];
    const wingResult = determineWing(primaryType, blockIndex);
    
    setAssessmentData({
      ...assessmentData,
      buildingBlocks: [{
        type: selectedBlockData.type,
        name: selectedBlockData.name,
        description: selectedBlockData.description
      }]
    });
  };

  const handleContinue = () => {
    setCurrentScreen('color-states');
  };

  return (
    <div className="page-container">
      <div className="building-content">
        <header className="building-header">
          <h2 className="title-primary">Building Blocks</h2>
          <p className="phase-description">Choose your wing influence to complete your personality foundation</p>
        </header>
        
        <section className="block-selection-area">
          <h3 className="title-primary">Wing Selection</h3>
          <p className="section-description">Choose the building block that best describes your approach</p>
          
          <div className="blocks-grid">
            {availableBlocks.map((block, index) => (
              <BuildingBlock
                key={index}
                id={index}
                title={block.name}
                description={block.description}
                isSelected={selectedBlock === index}
                onSelect={handleBlockSelect}
                gradient={block.gradient}
              />
            ))}
          </div>
          
          <button 
            className="btn-primary"
            disabled={selectedBlock === null}
            onClick={handleContinue}
          >
            Continue to Colors
          </button>
        </section>
        
        <aside className="tower-visualization-area">
          <h3 className="tower-title">Your Tower</h3>
          <div className="tower-building-view">
            <div className="foundation-base">
              <span className="foundation-text">Foundation Complete</span>
            </div>
            <div className="building-block-area">
              {selectedBlock !== null && (
                <div className="placed-block" style={{ background: availableBlocks[selectedBlock].gradient }}>
                  {availableBlocks[selectedBlock]?.name}
                </div>
              )}
            </div>
          </div>
          <p className="foundation-description">
            {selectedBlock === null 
              ? "Select a building block to add to your foundation..." 
              : "Building block selected! Ready for next phase."
            }
          </p>
        </aside>
      </div>
    </div>
  );
}