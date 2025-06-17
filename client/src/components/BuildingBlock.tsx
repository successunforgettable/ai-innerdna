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
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
    <div style={{ 
      width: '60px', 
      fontSize: '18px', 
      fontWeight: '700', 
      color: '#fbbf24',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100px'
    }}>
      {blockName}
    </div>
    <motion.div
      style={{
        flex: 1,
        minHeight: '100px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        border: isSelected ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div style={{
        color: '#ffffff',
        fontSize: '14px',
        lineHeight: '1.5',
        width: '100%'
      }}>
        {content}
      </div>
      {isSelected && <CheckIcon />}
    </motion.div>
  </div>
);

export default BuildingBlock;