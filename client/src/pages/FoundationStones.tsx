import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Stone } from '@/components/Stone';
import { ProgressBar } from '@/components/ProgressBar';
import { TowerVisualization } from '@/components/TowerVisualization';
import { useAssessment } from '@/context/AssessmentContext';
import { stoneSets } from '@/lib/stoneData';
import { motion } from 'framer-motion';

export default function FoundationStones() {
  const {
    currentStoneSet,
    setCurrentStoneSet,
    stoneSelections,
    updateStoneSelection,
    setCurrentScreen,
    assessmentData,
    setAssessmentData
  } = useAssessment();

  const [selectedStone, setSelectedStone] = useState<number | null>(null);
  const [foundationBlocks, setFoundationBlocks] = useState<any[]>([]);

  const currentSet = stoneSets[currentStoneSet];

  useEffect(() => {
    // Reset selection when stone set changes
    setSelectedStone(stoneSelections[currentStoneSet] ?? null);
  }, [currentStoneSet, stoneSelections]);

  const handleStoneSelect = (stoneIndex: number) => {
    setSelectedStone(stoneIndex);
    updateStoneSelection(currentStoneSet, stoneIndex);
    
    // Add to foundation visualization
    const selectedStoneData = currentSet.stones[stoneIndex];
    const newBlock = {
      gradient: selectedStoneData.gradient,
      width: 'w-24',
      height: 'h-6'
    };
    
    const newFoundationBlocks = [...foundationBlocks];
    newFoundationBlocks[currentStoneSet] = newBlock;
    setFoundationBlocks(newFoundationBlocks);

    // Update assessment data
    const newFoundationStones = [...assessmentData.foundationStones];
    newFoundationStones[currentStoneSet] = {
      setIndex: currentStoneSet,
      stoneIndex: stoneIndex,
      content: selectedStoneData.content,
      gradient: selectedStoneData.gradient
    };
    
    setAssessmentData({
      ...assessmentData,
      foundationStones: newFoundationStones
    });
  };

  const handleNextSet = () => {
    if (currentStoneSet < stoneSets.length - 1) {
      setCurrentStoneSet(currentStoneSet + 1);
    } else {
      setCurrentScreen('building-blocks');
    }
  };

  const isNextDisabled = selectedStone === null;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar 
        current={currentStoneSet + 1} 
        total={9} 
        label="Foundation Stones" 
      />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          key={currentStoneSet}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">{currentSet.title}</h2>
          <p className="text-gray-600">Choose the foundation stone that resonates most with you</p>
        </motion.div>

        <motion.div
          key={`stones-${currentStoneSet}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center items-center space-x-8 mb-12"
        >
          {currentSet.stones.map((stone, index) => (
            <Stone
              key={index}
              content={stone.content}
              gradient={stone.gradient}
              isSelected={selectedStone === index}
              onSelect={() => handleStoneSelect(index)}
            />
          ))}
        </motion.div>

        <div className="flex justify-center mb-12">
          <TowerVisualization 
            title="Your Foundation"
            blocks={foundationBlocks.filter(Boolean)}
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleNextSet}
            disabled={isNextDisabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            {currentStoneSet < stoneSets.length - 1 ? 'Next Set' : 'Continue to Building Blocks'}
          </Button>
        </div>
      </div>
    </div>
  );
}
