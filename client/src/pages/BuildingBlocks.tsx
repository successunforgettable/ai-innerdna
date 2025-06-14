import { useState, useEffect } from 'react';
import { useAssessment } from '@/context/AssessmentContext';
import { buildingBlocks } from '@/lib/stoneData';
import { determinePersonalityType, determineWing } from '@/lib/assessmentAlgorithm';
import { motion } from 'framer-motion';

interface BuildingBlock {
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
  const [availableBlocks, setAvailableBlocks] = useState<BuildingBlock[]>([]);

  useEffect(() => {
    // Determine primary type from foundation stones assessment
    const validSelections = stoneSelections.filter(s => s !== null) as number[];
    if (validSelections.length === 9) {
      const result = determinePersonalityType(validSelections);
      setPrimaryType(result.primaryType);
      const typeKey = result.primaryType as keyof typeof buildingBlocks;
      const blocks = buildingBlocks[typeKey] || buildingBlocks['1'];
      setAvailableBlocks(blocks);
    } else {
      // Default to type 1 for testing if assessment not complete
      const blocks = buildingBlocks['1'];
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
      <div className="foundation-content">
        <div className="glass-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h2 className="title-primary">Building Blocks</h2>
            <p className="section-description">Choose your wing influence to complete your personality foundation</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {availableBlocks.map((block, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`glass-container cursor-pointer transition-all duration-300 p-6 ${
                  selectedBlock === index ? 'ring-2 ring-white/50' : ''
                }`}
                onClick={() => handleBlockSelect(index)}
                style={{ background: block.gradient }}
              >
                <h3 className="title-primary text-lg mb-2">{block.name}</h3>
                <p className="section-description text-sm">{block.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              className="btn-primary"
              onClick={handleContinue}
              disabled={selectedBlock === null}
            >
              Continue to Color States
            </button>
          </div>
        </div>

        <div className="glass-container">
          <h3 className="title-primary">Your Tower</h3>
          <div className="tower-container">
            <div className="foundation-base">
              <div className="foundation-center">
                <span className="foundation-count">9/9</span>
              </div>
            </div>
            {selectedBlock !== null && (
              <div className="mt-4 p-4 rounded-lg" style={{ background: availableBlocks[selectedBlock].gradient }}>
                <div className="text-white font-semibold">
                  Selected Wing: {availableBlocks[selectedBlock]?.name}
                </div>
              </div>
            )}
          </div>
          <p className="foundation-description">
            {selectedBlock === null 
              ? "Select a building block to add to your foundation..." 
              : "Building block selected! Ready for next phase."
            }
          </p>
        </div>
      </div>
    </div>
  );
}