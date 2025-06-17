import { motion } from 'framer-motion';

interface BackButtonProps {
  onBack: () => void;
  children: React.ReactNode;
}

const BackButton = ({ onBack, children }: BackButtonProps) => (
  <motion.button
    className="continue-button enabled"
    onClick={onBack}
    whileHover={{ 
      scale: 1.05,
      y: -2,
      transition: { duration: 0.2 }
    }}
    whileTap={{ 
      scale: 0.95,
      y: 0,
      transition: { duration: 0.1 }
    }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.8, duration: 0.4 }
    }}
  >
    {children}
  </motion.button>
);

export default BackButton;