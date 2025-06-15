import { motion } from 'framer-motion';

interface ContinueButtonProps {
  canProceed: boolean;
  onContinue: () => void;
  children: React.ReactNode;
}

const ContinueButton = ({ canProceed, onContinue, children }: ContinueButtonProps) => (
  <motion.button
    className={`continue-button ${canProceed ? 'enabled' : 'disabled'}`}
    disabled={!canProceed}
    onClick={onContinue}
    whileHover={canProceed ? { scale: 1.05 } : {}}
    whileTap={canProceed ? { scale: 0.95 } : {}}
  >
    {children}
  </motion.button>
);

export default ContinueButton;