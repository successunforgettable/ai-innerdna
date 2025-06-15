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
    className={`state-card ${isSelected ? 'state-card--selected' : ''}`}
    style={{ 
      '--state-color': state.color,
    } as React.CSSProperties}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onSelect}
  >
    <div className="state-card__header">
      <div 
        className="state-card__color-indicator"
        style={{ backgroundColor: state.color }}
      />
      <h3 className="state-card__name">
        {state.name}
      </h3>
      {isSelected && (
        <motion.div 
          className="state-card__check"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15 
          }}
        >
          ✓
        </motion.div>
      )}
    </div>
    <div className="state-content">
      <p className="state-description">{state.description}</p>
    </div>
  </motion.div>
);

export default StateCard;