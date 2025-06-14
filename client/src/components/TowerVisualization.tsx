import { motion, AnimatePresence } from 'framer-motion';
import styles from './TowerVisualization.module.css';

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
      case 'w-32': return styles.blockWidth32;
      case 'w-28': return styles.blockWidth28;
      case 'w-24': return styles.blockWidth24;
      case 'w-20': return styles.blockWidth20;
      case 'w-16': return styles.blockWidth16;
      default: return styles.blockWidth24;
    }
  };

  const getHeightClass = (height: string) => {
    switch(height) {
      case 'h-6': return styles.blockHeight6;
      case 'h-8': return styles.blockHeight8;
      default: return styles.blockHeight6;
    }
  };

  const getGradientClass = (gradient: string) => {
    switch(gradient) {
      case 'gradient-1': return styles.gradient1;
      case 'gradient-2': return styles.gradient2;
      case 'gradient-3': return styles.gradient3;
      case 'gradient-4': return styles.gradient4;
      case 'gradient-5': return styles.gradient5;
      case 'gradient-6': return styles.gradient6;
      case 'gradient-7': return styles.gradient7;
      case 'gradient-8': return styles.gradient8;
      case 'gradient-9': return styles.gradient9;
      default: return styles.gradient1;
    }
  };

  return (
    <div className={styles.towerViz}>
      {title && <h3 className={styles.towerTitle}>{title}</h3>}
      <div className={styles.towerBlocks}>
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`${getGradientClass(block.gradient)} ${getWidthClass(block.width)} ${getHeightClass(block.height)} ${styles.towerBlock}`}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
