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
  const getWidthClass = (width: string) => {
    switch(width) {
      case 'w-32': return 'blockWidth32';
      case 'w-28': return 'blockWidth28';
      case 'w-24': return 'blockWidth24';
      case 'w-20': return 'blockWidth20';
      case 'w-16': return 'blockWidth16';
      default: return 'blockWidth24';
    }
  };

  const getHeightClass = (height: string) => {
    switch(height) {
      case 'h-6': return 'blockHeight6';
      case 'h-8': return 'blockHeight8';
      default: return 'blockHeight6';
    }
  };

  return (
    <div className="towerViz">
      {title && <h3 className="towerTitle">{title}</h3>}
      <div className="towerBlocks">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`${block.gradient} ${getWidthClass(block.width)} ${getHeightClass(block.height)} towerBlock`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
