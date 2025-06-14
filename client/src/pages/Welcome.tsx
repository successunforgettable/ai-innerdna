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

  const towerBlocks = [
    { gradient: 'gradient-1', width: 'w-32', height: 'h-8' },
    { gradient: 'gradient-2', width: 'w-28', height: 'h-8' },
    { gradient: 'gradient-3', width: 'w-24', height: 'h-8' },
    { gradient: 'gradient-4', width: 'w-20', height: 'h-8' },
    { gradient: 'gradient-5', width: 'w-16', height: 'h-8' }
  ];

  return (
    <motion.div 
      className={styles.welcomeScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className={styles.welcomeContainer}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div 
          className={styles.header}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className={styles.logo}>Inner DNA</div>
          <div className={styles.tagline}>Discover Your Unique Inner DNA</div>
        </motion.div>
        
        <motion.div 
          className={styles.heroSection}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.towerPreview}>
            <TowerVisualization title="" blocks={towerBlocks} />
          </div>
          <div className={styles.description}>
            Build your personality tower through intuitive choices and discover your unique Inner DNA profile
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.emailCollection}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className={styles.emailCollectionTitle}>Begin Your Journey</h3>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={styles.formInput}
              required
            />
          </div>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className={styles.formInput}
              />
            </div>
          </div>
        </motion.div>
        
        <motion.button
          onClick={handleStart}
          disabled={createUserMutation.isPending}
          className={styles.startButton}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {createUserMutation.isPending ? 'Starting...' : 'Begin Your Journey'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
