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

  // Tower Preview Animation - exact from spec
  const towerBlocks = [
    { gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', width: 'w-48', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #10b981, #047857)', width: 'w-44', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', width: 'w-40', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', width: 'w-36', height: 'h-12' },
    { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', width: 'w-32', height: 'h-12' }
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
    <div className={styles.welcomeScreen}>
      <motion.div 
        className={styles.welcomeContainer}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header - exact from spec */}
        <motion.header 
          className={styles.header}
          variants={itemVariants}
        >
          <motion.div 
            className={styles.logo}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Inner DNA
          </motion.div>
          <motion.div 
            className={styles.tagline}
            variants={itemVariants}
          >
            Discover Your Unique Inner DNA
          </motion.div>
        </motion.header>
        
        {/* HeroSection - exact from spec */}
        <motion.section 
          className={styles.heroSection}
          variants={itemVariants}
        >
          {/* TowerPreview - Animated preview */}
          <motion.div 
            className={styles.towerPreview}
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
            className={styles.description}
            variants={itemVariants}
          >
            Build your personality tower through intuitive choices
            and discover your unique Inner DNA profile
          </motion.div>
        </motion.section>
        
        {/* EmailCollection - exact from spec */}
        <motion.div 
          className={styles.emailCollection}
          variants={itemVariants}
        >
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
            <motion.input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.formInput}
              required
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <motion.input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={styles.formInput}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <motion.input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className={styles.formInput}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
        
        {/* StartButton - exact from spec */}
        <motion.button
          onClick={handleStart}
          disabled={createUserMutation.isPending}
          className={styles.startButton}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
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
