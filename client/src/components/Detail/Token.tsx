import React from 'react';
import { motion } from 'framer-motion';

interface TokenProps {
  onDrop: (containerId: string) => void;
  isBeingDragged: boolean;
}

const Token: React.FC<TokenProps> = ({ onDrop, isBeingDragged }) => {
  const handleDragEnd = (event: any, info: any) => {
    const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
    const container = dropTarget?.closest('[data-container-id]');

    if (container) {
      const containerId = container.getAttribute('data-container-id');
      if (containerId) {
        onDrop(containerId);
      }
    }
  };

  return (
    <motion.div
      className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-orange-300 cursor-grab active:cursor-grabbing shadow-sm"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      whileHover={{ scale: 1.05 }}
      onDragEnd={handleDragEnd}
      dragElastic={0.2}
      dragMomentum={false}
    />
  );
};

export default Token;