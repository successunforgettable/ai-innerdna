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
      case 'w-48': return '16rem'; // Much larger foundation blocks
      case 'w-44': return '15rem';
      case 'w-40': return '14rem';
      case 'w-36': return '13rem';
      case 'w-32': return '12rem';
      case 'w-28': return '11rem';
      case 'w-24': return '10rem';
      case 'w-20': return '9rem';
      case 'w-16': return '8rem';
      default: return '10rem';
    }
  };

  const getHeightValue = (height: string) => {
    switch(height) {
      case 'h-12': return '4rem';
      case 'h-8': return '3rem'; // Taller foundation blocks
      case 'h-6': return '2.5rem';
      default: return '3rem';
    }
  };

  const towerContainerStyle = {
    width: '500px', // Much larger tower container
    minHeight: '400px',
    padding: '3rem',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  };

  const blockStyle = (block: any, index: number) => ({
    background: block.gradient,
    width: getWidthValue(block.width),
    height: getHeightValue(block.height),
    borderRadius: '0.5rem',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    margin: '2px 0'
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
        gap: '0.5rem',
        width: '100%',
        minHeight: '200px',
        justifyContent: 'flex-end',
        padding: '1rem'
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
