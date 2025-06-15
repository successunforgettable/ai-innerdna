import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

// Exact Token component from Section 7.3 specification
const Token = ({ onDrop, isBeingDragged }: TokenProps) => {
  const handleDragEnd = (event: any, info: any) => {
    if (onDrop) {
      // Find the drop target using data-container-id attributes as per spec
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
      className="token"
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onDragEnd={handleDragEnd}
      style={{
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #fb923c, #ea580c)',
        borderRadius: '50%',
        border: '2px solid rgba(251, 191, 36, 0.3)',
        cursor: 'grab',
        boxShadow: '0 4px 12px rgba(251, 146, 60, 0.3)',
        opacity: isBeingDragged ? 0.7 : 1,
      }}
    />
  );
};

export default Token;