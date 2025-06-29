import { motion } from 'framer-motion';

interface TokenProps {
  id: string;
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

export default function Token({ id, onDrop, isBeingDragged }: TokenProps) {
  return (
    <motion.div
      className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white/20"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ 
        scale: 1.1, 
        zIndex: 1000,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}
      whileHover={{ scale: 1.05 }}
      onDragEnd={(event, info) => {
        const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
        const container = dropTarget?.closest('[data-container-id]');
        if (container && onDrop) {
          const containerId = container.getAttribute('data-container-id');
          if (containerId) onDrop(containerId);
        }
      }}
      animate={isBeingDragged ? { scale: 1.1 } : { scale: 1 }}
    />
  );
}