import { motion } from 'framer-motion';

interface TokenProps {
  onDrop?: (containerId: string) => void;
  isBeingDragged?: boolean;
}

// Token.jsx - Exact from Section 7.3 specification  
const Token = ({ onDrop, isBeingDragged }: TokenProps) => {
  const handleDragEnd = (event: any, info: any) => {
    console.log('Drag ended at:', info.point.x, info.point.y);
    
    if (onDrop) {
      // Find the drop target using data-container-id attributes as per spec
      const element = document.elementFromPoint(info.point.x, info.point.y);
      console.log('Element at point:', element);
      
      if (element) {
        const container = element.closest('[data-container-id]');
        console.log('Found container:', container);
        
        if (container) {
          const containerId = container.getAttribute('data-container-id');
          console.log('Container ID:', containerId);
          
          if (containerId) {
            onDrop(containerId);
            return;
          }
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
    />
  );
};

export default Token;