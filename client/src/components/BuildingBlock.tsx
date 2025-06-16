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
  const baseColor = isBlockA ? 'purple' : 'green';
  
  return (
    <motion.button
      className={`relative w-full h-32 rounded-lg bg-gradient-to-br ${
        isBlockA 
          ? 'from-purple-500 to-purple-700 border-purple-300' 
          : 'from-green-500 to-green-700 border-green-300'
      } shadow-xl border-4 hover:scale-105 transition-transform group ${
        isSelected ? 'ring-4 ring-blue-400' : ''
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
    >
      {/* Block face with 3D effect */}
      <div className={`absolute inset-2 bg-gradient-to-br ${
        isBlockA 
          ? 'from-purple-400 to-purple-600 border-purple-200' 
          : 'from-green-400 to-green-600 border-green-200'
      } rounded border-2 flex flex-col justify-center p-4`}>
        <h3 className="text-lg font-bold text-white mb-2 text-center">{blockName}</h3>
        <p className="text-sm text-white/90 text-center leading-tight">
          {content}
        </p>
      </div>
      
      {/* 3D shadow effect */}
      <div className={`absolute -bottom-1 -right-1 w-full h-full ${
        isBlockA ? 'bg-purple-800/50' : 'bg-green-800/50'
      } rounded-lg -z-10`}></div>
      
      {isSelected && <CheckIcon />}
    </motion.button>
  );
};

export default BuildingBlock;