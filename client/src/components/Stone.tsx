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
      className={`stone ${gradient} flex items-center justify-center text-white font-medium text-center p-4 relative ${
        isSelected ? 'selected' : ''
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
    >
      <div className="stone-content">
        <div className="font-semibold mb-2">{content[0]}</div>
        <div className="text-sm">{content[1]}</div>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2"
        >
          <Check className="w-6 h-6" />
        </motion.div>
      )}
    </motion.div>
  );
}
