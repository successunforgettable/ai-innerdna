import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StoneProps {
  stone: {
    id: string;
    statements: string[];
    gradient: string;
  };
  context: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function Stone({ stone, context, isSelected, onSelect }: StoneProps) {
  const stoneStyle = {
    background: stone.gradient,
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
        textAlign: 'center',
        fontSize: '13px',
        lineHeight: '1.2',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        wordBreak: 'keep-all',
        hyphens: 'none',
        color: 'white',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
        padding: '12px'
      }}>
        {/* Context line - no bullet, slightly bold */}
        <div className="context-line" style={{
          fontWeight: '500',
          marginBottom: '8px',
          fontSize: '14px'
        }}>
          {context}
        </div>
        
        {/* Statement lines - with bullets */}
        {stone.statements.map((statement, index) => (
          <div key={index} className="statement-line" style={{
            fontWeight: '400',
            marginBottom: index === stone.statements.length - 1 ? '0' : '6px',
            fontSize: '12px'
          }}>
            • {statement}
          </div>
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
