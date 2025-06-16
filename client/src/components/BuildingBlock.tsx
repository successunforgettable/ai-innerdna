// BuildingBlock.jsx - Following Section 5.3 Component Implementation
import { motion } from 'framer-motion';

interface BuildingBlockProps {
  content: string;
  isSelected: boolean;
  onSelect: () => void;
  gradient: string;
  blockName: string;
}

// CheckIcon component
const CheckIcon = () => (
  <div className="check-icon">✓</div>
);

const BuildingBlock = ({ content, isSelected, onSelect, gradient, blockName }: BuildingBlockProps) => (
  <motion.div
    className="p-6 rounded-lg w-full max-w-md mx-auto relative cursor-pointer transition-all duration-300 hover:scale-105"
    style={{ 
      background: gradient,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      border: isSelected ? '3px solid #3b82f6' : '3px solid transparent'
    }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
  >
    {/* Block Title */}
    <h3 className="text-xl font-bold text-white mb-4 text-center">{blockName}</h3>
    
    {/* Block Content - Full text with proper spacing */}
    <p className="text-sm text-white leading-relaxed text-center">
      {content}
    </p>
    
    {isSelected && <CheckIcon />}
  </motion.div>
);

export default BuildingBlock;