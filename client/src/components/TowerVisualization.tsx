import { motion, AnimatePresence } from 'framer-motion';

interface TowerVisualizationProps {
  title: string;
  blocks: Array<{
    gradient: string;
    width: string;
    height: string;
  }>;
}

export function TowerVisualization({ title, blocks }: TowerVisualizationProps) {
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

  const towerContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.25rem',
    width: '100%',
    height: 'auto'
  };

  const blockStyle = (block: any, index: number) => ({
    background: block.gradient,
    width: getWidthValue(block.width),
    height: getHeightValue(block.height),
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)'
  });

  return (
    <div style={{
      ...towerContainerStyle,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    }}>
      {title && (
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-family)'
        }}>
          {title}
        </h3>
      )}
      <div style={{
        display: 'flex',
        flexDirection: 'column-reverse', // Foundation builds from bottom up
        alignItems: 'center',
        gap: '0.25rem',
        width: '100%',
        minHeight: '120px',
        justifyContent: 'flex-end'
      }}>
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={`foundation-${index}`}
              initial={{ 
                opacity: 0, 
                y: 30,
                scale: 0.8,
                rotateX: -15
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
                rotateX: 0
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                scale: 0.8
              }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }}
              style={{
                ...blockStyle(block, index),
                transformStyle: 'preserve-3d'
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
