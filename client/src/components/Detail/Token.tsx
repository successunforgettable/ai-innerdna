import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

// Token.jsx - Exact from Section 7.3 specification
const Token = ({ onDrop, isBeingDragged }: TokenProps) => (
  <motion.div
    className="token"
    drag
    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    whileDrag={{ scale: 1.1, zIndex: 1000 }}
    onDragEnd={(event, info) => {
      if (onDrop) {
        // Find the drop target using data-container-id attributes as per spec
        const element = document.elementFromPoint(info.point.x, info.point.y);
        if (element) {
          const container = element.closest('[data-container-id]');
          if (container) {
            const containerId = container.getAttribute('data-container-id');
            if (containerId) {
              onDrop(containerId);
            }
          }
        }
      }
    }}
  />
);

export default Token;