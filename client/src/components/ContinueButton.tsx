import { motion } from 'framer-motion';

interface ContinueButtonProps {
  canProceed: boolean;
  onContinue: () => void;
  children: React.ReactNode;
}

const ContinueButton = ({ canProceed, onContinue, children }: ContinueButtonProps) => (
  <motion.button
    className={`btn-primary ${canProceed ? '' : 'opacity-50 cursor-not-allowed'}`}
    disabled={!canProceed}
    onClick={onContinue}
    whileHover={canProceed ? { 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    } : {}}
    whileTap={canProceed ? { 
      scale: 0.95,
      y: 0,
      transition: { duration: 0.1 }
    } : {}}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.8, duration: 0.4 }
    }}
  >
    {canProceed ? children : 'Select 2 States to Continue'}
  </motion.button>
);

export default ContinueButton;