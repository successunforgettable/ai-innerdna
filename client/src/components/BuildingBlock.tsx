// BuildingBlock.jsx - Following Section 5.3 Component Implementation
import { motion } from 'framer-motion';

interface BuildingBlockProps {
  content: string;
  isSelected: boolean;
  onSelect: () => void;
  gradient: string;
}

// CheckIcon component
const CheckIcon = () => (
  <div className="check-icon">✓</div>
);

const BuildingBlock = ({ content, isSelected, onSelect, gradient }: BuildingBlockProps) => (
  <motion.div
    className={`building-block ${isSelected ? 'selected' : ''}`}
    style={{ background: gradient }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onSelect}
  >
    <div className="block-content">
      <p className="building-block-text">{content}</p>
    </div>
    {isSelected && <CheckIcon />}
  </motion.div>
);

export default BuildingBlock;