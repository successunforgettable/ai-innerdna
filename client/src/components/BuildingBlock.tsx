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
  const isBlockA = blockName.includes('A') || blockName.includes('Block A');
  
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
    >
      {/* Main block body */}
      <div className={`w-80 h-24 bg-gradient-to-b ${
        isBlockA 
          ? 'from-purple-400 to-purple-600 border-purple-300' 
          : 'from-green-400 to-green-600 border-green-300'
      } rounded-lg shadow-lg border-2`}>
        
        {/* LEGO studs on top */}
        <div className="absolute -top-3 left-4 right-4 flex justify-around">
          <div className={`w-6 h-6 ${
            isBlockA ? 'bg-purple-300 border-purple-200' : 'bg-green-300 border-green-200'
          } rounded-full border-2`}></div>
          <div className={`w-6 h-6 ${
            isBlockA ? 'bg-purple-300 border-purple-200' : 'bg-green-300 border-green-200'
          } rounded-full border-2`}></div>
          <div className={`w-6 h-6 ${
            isBlockA ? 'bg-purple-300 border-purple-200' : 'bg-green-300 border-green-200'
          } rounded-full border-2`}></div>
          <div className={`w-6 h-6 ${
            isBlockA ? 'bg-purple-300 border-purple-200' : 'bg-green-300 border-green-200'
          } rounded-full border-2`}></div>
        </div>
        
        {/* Block content */}
        <div className="pt-4 px-4 text-center">
          <h3 className="text-lg font-bold text-white mb-1">{blockName}</h3>
          <p className="text-xs text-white/90 leading-tight">
            {shortContent}
          </p>
        </div>
      </div>
      
      {isSelected && <CheckIcon />}
    </motion.button>
  );
};

export default BuildingBlock;