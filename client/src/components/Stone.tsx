import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StoneProps {
  context: string;
  statements: string[];
  gradient: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function Stone({ context, statements, gradient, isSelected, onSelect }: StoneProps) {
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
      <div className="stone-content" style={{
        fontSize: '13px',
        lineHeight: '1.2',
        padding: '10px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'white',
        fontWeight: 600,
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        wordBreak: 'keep-all',
        hyphens: 'none',
        whiteSpace: 'normal'
      }}>
        <div className="context-line" style={{ marginBottom: '8px' }}>{context}</div>
        {statements.map((statement, index) => (
          <div key={index} className="statement-line" style={{ marginBottom: '4px' }}>• {statement}</div>
        ))}
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
