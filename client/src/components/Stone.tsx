import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StoneProps {
  content: string[];
  gradient: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function Stone({ content, gradient, isSelected, onSelect }: StoneProps) {
  const stoneStyle = {
    background: gradient,
    border: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
    boxShadow: isSelected 
      ? '0 8px 25px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(59, 130, 246, 0.5)'
      : '0 4px 12px rgba(0, 0, 0, 0.2)'
  };

  return (
    <motion.div
      className="foundation-stone"
      style={stoneStyle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      <div style={{
        textAlign: 'center',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.75rem',
        lineHeight: '1.1',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        wordBreak: 'break-word',
        hyphens: 'auto'
      }}>
        {content[0]}
      </div>
      {isSelected && (
        <Check 
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            color: 'white',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            padding: '2px'
          }}
        />
      )}
    </motion.div>
  );
}
