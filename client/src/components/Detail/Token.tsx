import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

export default function Token({ onDrop, isBeingDragged }: TokenProps) {
  return (
    <motion.div
      className="token"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      onDragEnd={(event, info) => {
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