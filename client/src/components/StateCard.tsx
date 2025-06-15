import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StateCardProps {
  state: {
    name: string;
    color: string;
    description: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const StateCard = ({ state, isSelected, onSelect }: StateCardProps) => (
  <motion.div
    className={`state-card ${isSelected ? 'selected' : ''}`}
    style={{ 
      '--state-color': state.color,
    } as React.CSSProperties}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
  >
    <div className="state-color-indicator" />
    <div className="state-content">
      <h3 className="state-name">{state.name}</h3>
      <p className="state-description">{state.description}</p>
    </div>
    {isSelected && <Check className="state-check" />}
  </motion.div>
);

export default StateCard;