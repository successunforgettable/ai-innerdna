import { motion } from 'framer-motion';

interface BackButtonProps {
  onBack: () => void;
  children: React.ReactNode;
  variant?: 'small' | 'full';
}

const BackButton = ({ onBack, children, variant = 'full' }: BackButtonProps) => {
  if (variant === 'small') {
    return (
      <motion.button
        className="back-button-small"
        onClick={onBack}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.95,
          transition: { duration: 0.1 }
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          transition: { delay: 0.3, duration: 0.3 }
        }}
      >
        {children}
      </motion.button>
    );
  }

  return (
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
};

export default BackButton;