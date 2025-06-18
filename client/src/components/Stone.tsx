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

  // Split content: "When making decisions, I think • statement 1 • statement 2"
  const parts = content[0].split(' • ');
  const contextPhrase = parts[0]; // "When making decisions, I think"
  const actionStatements = parts.slice(1); // ["statement 1", "statement 2"]

  return (
    <motion.div
      className="foundation-stone"
      style={stoneStyle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      <div style={{
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
        <div style={{ 
          marginBottom: '8px', 
          fontWeight: 700,
          color: '#ffffff',
          fontSize: '13px'
        }}>
          {contextPhrase}
        </div>
        {actionStatements.map((statement, index) => (
          <div key={`action-${index}-${Date.now()}`} style={{ 
            marginBottom: '6px',
            fontSize: '12px',
            color: '#ffffff',
            textAlign: 'center'
          }}>
            <span style={{ marginRight: '4px' }}>•</span>
            {statement.trim()}
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
