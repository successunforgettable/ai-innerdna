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
    className={`building-block ${isSelected ? 'selected' : ''}`}
    style={{ background: gradient }}
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