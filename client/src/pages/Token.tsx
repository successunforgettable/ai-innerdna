import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

export default function Token({ onDrop, isBeingDragged }: TokenProps) {
  console.log('Token component rendering');
  return (
    <motion.div
      className="token w-8 h-8 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white/20"
      style={{ 
        backgroundColor: '#f97316',
        minWidth: '32px',
        minHeight: '32px',
        display: 'block'
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      onDragEnd={(event, info) => {
        console.log('Token dropped');
        const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
        const container = dropTarget?.closest('[data-container-id]');
        if (container && onDrop) {
          const containerId = container.getAttribute('data-container-id');
          if (containerId) onDrop(containerId);
        }
      }}
    />
  );
}