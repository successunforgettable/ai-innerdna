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
    <div style={towerContainerStyle}>
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
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                y: 20,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                scale: 0.8
              }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)'
              }}
              style={blockStyle(block, index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
