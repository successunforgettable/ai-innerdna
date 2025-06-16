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

const BuildingBlock = ({ content, isSelected, onSelect, gradient, blockName }: BuildingBlockProps) => {
  // Determine colors based on block name
  const isBlockA = blockName === "Block A";
  
  // Shorten content for LEGO blocks
  const shortContent = isBlockA 
    ? "I stay calm in tension and seek internal balance. I want clarity and order, without pressure."
    : "I help others grow by gently guiding them. I care about progress and feel responsible.";
  
  return (
    <motion.button
      className={`relative group ${isSelected ? 'ring-4 ring-blue-400 rounded-lg' : ''}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      style={{ 
        margin: '0 auto',
        display: 'block',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer'
      }}
    >
      {/* Main block body */}
      <div 
        className={`${
          isBlockA 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
            : 'bg-gradient-to-r from-blue-500 to-teal-500'
        } rounded-lg flex items-center justify-center p-4 border-4 border-gray-800 shadow-xl`}
        style={{ 
          width: '180px', 
          height: '100px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Block content */}
        <div className="text-center">
          <h3 className="text-white font-semibold text-sm mb-1">{blockName}</h3>
          <p className="text-white/90 text-xs leading-tight text-center">
            {shortContent}
          </p>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold z-20">
          ✓
        </div>
      )}
    </motion.button>
  );
};

export default BuildingBlock;