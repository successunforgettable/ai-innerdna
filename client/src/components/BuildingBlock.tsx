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
  <div className="building-block">
    <div className="building-block-label">{blockName}</div>
    <motion.div
      className={`building-block-container ${isSelected ? 'selected' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      <div className="building-block-description">
        {content}
      </div>
      {isSelected && <CheckIcon />}
    </motion.div>
  </div>
);

export default BuildingBlock;