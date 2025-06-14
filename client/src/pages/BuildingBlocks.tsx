import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TowerVisualization } from '@/components/TowerVisualization';
import { useAssessment } from '@/context/AssessmentContext';
import { buildingBlocks } from '@/lib/stoneData';
import { motion } from 'framer-motion';

export default function BuildingBlocks() {
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const [towerBlocks, setTowerBlocks] = useState<any[]>([]);

  const handleBlockSelect = (blockIndex: number) => {
    const block = buildingBlocks[blockIndex];
    
    if (selectedBlocks.includes(blockIndex)) {
      // Remove block
      setSelectedBlocks(selectedBlocks.filter(id => id !== blockIndex));
      setTowerBlocks(towerBlocks.filter(b => b.type !== block.type));
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        buildingBlocks: assessmentData.buildingBlocks.filter(b => b.type !== block.type)
      });
    } else {
      // Add block
      setSelectedBlocks([...selectedBlocks, blockIndex]);
      
      const newTowerBlock = {
        gradient: block.gradient,
        width: 'w-32',
        height: 'h-8',
        type: block.type
      };
      setTowerBlocks([...towerBlocks, newTowerBlock]);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        buildingBlocks: [...assessmentData.buildingBlocks, {
          type: block.type,
          name: block.name,
          description: block.description
        }]
      });
    }
  };

  const handleContinue = () => {
    setCurrentScreen('color-states');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Building Blocks</h2>
          <p className="text-gray-600">Select the building blocks that will form your personality tower</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {buildingBlocks.map((block, index) => (
            <motion.div
              key={block.type}
              whileHover={{ y: -4 }}
              whileTap={{ y: -8 }}
              className={`building-block ${block.gradient} flex items-center justify-center text-white font-semibold text-center cursor-pointer ${
                selectedBlocks.includes(index) ? 'selected' : ''
              }`}
              onClick={() => handleBlockSelect(index)}
            >
              <div>
                <div className="text-lg mb-2">{block.name}</div>
                <div className="text-sm">{block.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mb-12">
          <TowerVisualization 
            title="Your Tower"
            blocks={towerBlocks}
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            Continue to Color States
          </Button>
        </div>
      </div>
    </div>
  );
}
