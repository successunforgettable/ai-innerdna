import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TowerVisualization } from '@/components/TowerVisualization';
import styles from './Welcome.module.css';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setCurrentUser, setCurrentScreen } = useAssessment();

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return response.json();
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      setCurrentScreen('foundation-stones');
    }
  });

  const handleStart = () => {
    // Required fields validation - exact from spec
    if (!email.trim()) {
      alert('Email is required to continue');
      return;
    }

    // emailForm structure - exact from spec
    const emailForm = {
      email: email.trim(), // Required
      firstName: firstName.trim() || '', // Optional
      lastName: lastName.trim() || '', // Optional
      timestamp: Date.now()
    };

    createUserMutation.mutate(emailForm);
  };

  // Tower Preview Animation - correct orientation with largest at bottom
  const towerBlocks = [
    { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', width: 'w-32', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: 'w-36', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', width: 'w-40', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #10b981, #047857)', width: 'w-44', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', width: 'w-48', height: 'h-12' }
  ];

  // Animation variants from spec
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="page-container">
      <motion.div 
        className="glass-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - exact from spec */}
        <motion.header 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="title-primary text-3xl mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Inner DNA
          </motion.div>
          <motion.div 
            className="text-primary text-xl"
            variants={itemVariants}
          >
            Discover Your Unique Inner DNA
          </motion.div>
        </motion.header>
        
        {/* HeroSection - exact from spec */}
        <motion.section 
          className="mb-8 text-center"
          variants={itemVariants}
        >
          {/* TowerPreview - Animated preview */}
          <motion.div 
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <TowerVisualization title="" blocks={towerBlocks} />
          </motion.div>
          
          {/* Description - exact from spec */}
          <motion.div 
            className="text-secondary max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Build your personality tower through intuitive choices
            and discover your unique Inner DNA profile
          </motion.div>
        </motion.section>
        
        {/* EmailCollection - enhanced design and animations */}
        <motion.div 
          className="glass-container max-w-md mx-auto"
          variants={itemVariants}
          whileHover={{ 
            y: -2
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h3 
            className="title-primary text-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            Begin Your Journey
          </motion.h3>
          
          <motion.div 
            className={styles.formGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
            <motion.input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.formInput}
              required
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.15)",
                borderColor: "var(--blue-primary)"
              }}
              whileHover={{ 
                borderColor: "var(--blue-primary)",
                boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)"
              }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
          
          <motion.div 
            className={styles.formGrid}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <motion.div 
              className={styles.formGroup}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <motion.input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={styles.formInput}
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.15)",
                  borderColor: "var(--blue-primary)"
                }}
                whileHover={{ 
                  borderColor: "var(--blue-primary)",
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)"
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
            <motion.div 
              className={styles.formGroup}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <motion.input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className={styles.formInput}
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.15)",
                  borderColor: "var(--blue-primary)"
                }}
                whileHover={{ 
                  borderColor: "var(--blue-primary)",
                  boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.1)"
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* StartButton - exact from spec */}
        <motion.button
          onClick={handleStart}
          disabled={createUserMutation.isPending}
          className="btn-primary mx-auto px-8 py-3 text-lg"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {createUserMutation.isPending ? 'Starting...' : 'Begin Your Journey'}
        </motion.button>
      </motion.div>
    </div>
  );
}
