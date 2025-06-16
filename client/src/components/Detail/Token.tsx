import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

// Token.jsx - HTML5 drag and drop for container compatibility
const Token = ({ onDrop, isBeingDragged }: TokenProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'token');
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div
      className="token"
      draggable={true}
      onDragStart={handleDragStart}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    />
  );
};

export default Token;