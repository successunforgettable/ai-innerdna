import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

const Token = ({ onDrop, isBeingDragged }: TokenProps) => {
  const handleDragEnd = (event: any, info: any) => {
    if (onDrop) {
      // Find the drop target
      const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
      const container = dropTarget?.closest('[data-container-id]');
      
      if (container) {
        const containerId = container.getAttribute('data-container-id');
        if (containerId) {
          onDrop(containerId);
        }
      }
    }
  };

  return (
    <motion.div
      className="token w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full border-2 border-orange-300 cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDragEnd={handleDragEnd}
      style={{
        opacity: isBeingDragged ? 0.7 : 1,
      }}
    />
  );
};

export default Token;