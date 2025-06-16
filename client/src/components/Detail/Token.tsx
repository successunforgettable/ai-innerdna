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
    <div
      className="token"
      draggable={true}
      onDragStart={handleDragStart}
      style={{
        transform: isBeingDragged ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}
    />
  );
};

export default Token;