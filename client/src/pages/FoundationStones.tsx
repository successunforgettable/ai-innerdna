import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Stone } from '@/components/Stone';
import { ProgressBar } from '@/components/ProgressBar';
import { FoundationTower } from '@/components/FoundationTower';
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

  useEffect(() => {
    // Initialize foundation blocks from existing assessment data
    const foundationWidths = ['w-48', 'w-44', 'w-40', 'w-36', 'w-32', 'w-28', 'w-24', 'w-20', 'w-16'];
    const initialBlocks = (assessmentData.foundationStones || []).map((stone, index) => {
      if (!stone) return null;
      return {
        gradient: stone.gradient,
        width: foundationWidths[index] || 'w-24',
        height: 'h-8'
      };
    });
    setFoundationBlocks(initialBlocks);
  }, [assessmentData.foundationStones]);

  const handleStoneSelect = (stoneIndex: number) => {
    setSelectedStone(stoneIndex);
    updateStoneSelection(currentStoneSet, stoneIndex);
    
    // Add to foundation visualization with proper stacking logic
    const selectedStoneData = currentSet.stones[stoneIndex];
    
    // Foundation blocks get progressively smaller as they stack upward
    const foundationWidths = ['w-48', 'w-44', 'w-40', 'w-36', 'w-32', 'w-28', 'w-24', 'w-20', 'w-16'];
    const foundationWidth = foundationWidths[currentStoneSet] || 'w-24';
    
    const newBlock = {
      gradient: selectedStoneData.gradient,
      width: foundationWidth,
      height: 'h-8' // Foundation blocks are taller for visual impact
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
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #eff6ff, #faf5ff)',
      fontFamily: 'var(--font-family)',
      color: 'var(--text-primary)'
    }}>
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
          <h2 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 700,
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family)'
          }}>{currentSet.title}</h2>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-family)'
          }}>Choose the foundation stone that resonates most with you</p>
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
          <FoundationTower 
            title="Your Foundation"
            blocks={foundationBlocks.filter(Boolean)}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleNextSet}
            disabled={isNextDisabled}
            style={{
              backgroundColor: isNextDisabled ? '#d1d5db' : 'var(--blue-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '0.75rem 2rem',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 600,
              cursor: isNextDisabled ? 'not-allowed' : 'pointer',
              transition: 'all var(--duration-normal) var(--ease-spring)',
              fontFamily: 'var(--font-family)',
              boxShadow: isNextDisabled ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transform: isNextDisabled ? 'none' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!isNextDisabled) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isNextDisabled) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--blue-primary)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }
            }}
          >
            {currentStoneSet < stoneSets.length - 1 ? 'Next Set' : 'Continue to Building Blocks'}
          </button>
        </div>
      </div>
    </div>
  );
}
