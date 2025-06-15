// src/components/Detail/Token.tsx
import { motion } from 'framer-motion';

interface TokenProps {
  id: string;
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

export default function Token({ id, onDrop, isBeingDragged }: TokenProps) {
  return (
    <motion.div
      className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white/20 flex-shrink-0"
      style={{
        minWidth: '32px',
        minHeight: '32px',
        background: 'linear-gradient(135deg, #fb923c, #ea580c)'
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ 
        scale: 1.1, 
        zIndex: 1000,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}
      whileHover={{ scale: 1.05 }}
      onDragEnd={(event, info) => {
        // Detect drop target and call onDrop
        const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
        const container = dropTarget?.closest('[data-container-id]');
        if (container && onDrop) {
          const containerId = container.getAttribute('data-container-id');
          if (containerId) onDrop(containerId);
        }
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: isBeingDragged ? 1.1 : 1,
        transition: { duration: 0.2 }
      }}
    />
  );
}