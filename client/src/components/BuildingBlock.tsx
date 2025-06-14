import React from 'react';
import { motion } from 'framer-motion';

interface BuildingBlockProps {
  id: number;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: (id: number) => void;
  gradient: string;
}

const BuildingBlock = ({ 
  id, 
  title, 
  description, 
  isSelected, 
  onSelect,
  gradient 
}: BuildingBlockProps) => {
  return (
    <motion.div
      className={`building-block ${isSelected ? 'selected' : ''}`}
      style={{ background: gradient }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <div className="block-content">
        <h4 className="block-title">{title}</h4>
        <p className="block-description">{description}</p>
      </div>
      {isSelected && (
        <motion.div 
          className="block-selected-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
};

export default BuildingBlock;