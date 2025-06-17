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
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20
    }}
  >
    <div className="block-content">
      <div className="building-block-label">{blockName}</div>
      <div className="building-block-description">
        {content}
      </div>
    </div>
    {isSelected && <CheckIcon />}
  </motion.div>
);

export default BuildingBlock;