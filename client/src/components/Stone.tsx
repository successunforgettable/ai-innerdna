import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StoneProps {
  content: string[];
  gradient: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function Stone({ content, gradient, isSelected, onSelect }: StoneProps) {
  return (
    <motion.div
      className={`stone ${gradient} ${isSelected ? 'selected' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      <div className="stone-content">
        {content.map((word, index) => (
          <span key={index} className="stone-word">{word}</span>
        ))}
      </div>
      {isSelected && <Check className="stone-check" />}
    </motion.div>
  );
}
