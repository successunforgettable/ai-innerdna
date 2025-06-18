import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Stone } from '@/components/Stone';
import { ProgressBar } from '@/components/ProgressBar';
import { FoundationTower } from '@/components/FoundationTower';
import { useAssessment } from '@/context/AssessmentContext';
import { stoneSets } from '@/lib/stoneData';
import { determinePersonalityType } from '@/lib/assessmentAlgorithm';
import { motion } from 'framer-motion';

export default function FoundationStones() {
  const [, setLocation] = useLocation();
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

  // Contextual questions for each set
  const setQuestions = [
    "How do you typically make important decisions?",
    "What drives you most deeply?",
    "Where do you naturally focus your energy?",
    "How do you prefer to interact with people?",
    "How do you naturally process information and experiences?",
    "How do you typically respond when under pressure?",
    "How do you handle disagreements and conflicts?",
    "How do you measure success and achievement?",
    "What do you value most in your relationships with others?"
  ];

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

    // Auto-advance to next set after a brief delay
    setTimeout(() => {
      handleNextSet();
    }, 800);
  };

  const handleNextSet = () => {
    if (currentStoneSet < stoneSets.length - 1) {
      setCurrentStoneSet(currentStoneSet + 1);
    } else {
      // Calculate personality type when all foundation stones are completed
      const personalityResult = determinePersonalityType(stoneSelections);
      
      // Update assessment data with foundation stones and calculated personality type
      const foundationStoneSelections = stoneSelections.map((selection, setIndex) => ({
        setIndex,
        stoneIndex: selection,
        content: stoneSets[setIndex].stones[selection].content,
        gradient: stoneSets[setIndex].stones[selection].gradient
      }));
      
      const updatedAssessmentData = {
        ...assessmentData,
        foundationStones: foundationStoneSelections,
        result: personalityResult
      };
      
      setAssessmentData(updatedAssessmentData);
      
      // Navigate to building blocks
      setCurrentScreen('building-blocks');
      setLocation('/building-blocks');
    }
  };

  const handlePrevious = () => {
    if (currentStoneSet > 0) {
      setCurrentStoneSet(currentStoneSet - 1);
    }
  };



  return (
    <div className="page-container">
      <ProgressBar 
        current={currentStoneSet + 1} 
        total={9} 
        label="Foundation Stones" 
      />
      
      <div className="foundation-content">
        <div className="glass-container">
          <motion.div
            key={currentStoneSet}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <p style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#64748b',
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              {setQuestions[currentStoneSet]}
            </p>
            <h2 className="title-primary">{currentSet.title}</h2>
            <p className="section-description">Choose the foundation stone that resonates most with you</p>
          </motion.div>

          <motion.div
            key={`stones-${currentStoneSet}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="stones-grid"
          >
            {currentSet.stones.map((stone, index) => (
              <Stone
                key={index}
                context={stone.context}
                statements={stone.statements}
                gradient={stone.gradient}
                isSelected={selectedStone === index}
                onSelect={() => handleStoneSelect(index)}
              />
            ))}
          </motion.div>

          <div className="flex justify-between items-center mt-6">
            <motion.button
              className="btn-primary"
              onClick={() => {
                if (currentStoneSet > 0) {
                  setCurrentStoneSet(currentStoneSet - 1);
                } else {
                  setCurrentScreen('welcome');
                  setLocation('/');
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentStoneSet > 0 ? '← Previous Set' : '← Back to Welcome'}
            </motion.button>
            
            {selectedStone !== null && (
              <motion.button
                className="btn-primary"
                onClick={handleNextSet}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentStoneSet === stoneSets.length - 1 ? 'Complete Foundation' : 'Next Set →'}
              </motion.button>
            )}
          </div>
        </div>

        <div className="glass-container">
          <div className="tower-visualization">
            <h3 className="title-primary">Your Foundation</h3>
            <div className="tower-container">
              <div className="foundation-base">
                <div className="foundation-stones-display">
                  {stoneSelections.map((stoneIndex, index) => {
                    if (stoneIndex === null) return null;
                    const stone = stoneSets[index].stones[stoneIndex];
                    return (
                      <div 
                        key={index}
                        className={`foundation-stone-placed stone-${stoneIndex}`}
                        style={{
                          '--position': index,
                          background: stone.gradient
                        } as React.CSSProperties & { '--position': number }}
                      />
                    );
                  })}
                </div>
                <div className="foundation-center">
                  <span className="foundation-count">{stoneSelections.filter(s => s !== null).length}/9</span>
                </div>
              </div>
            </div>
            <p className="foundation-description">
              Building your personality foundation...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
