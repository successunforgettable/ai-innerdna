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
    <div className={styles.welcomeScreen}>
      <div className={styles.welcomeContainer}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${styles.header} ${styles.fadeIn}`}
        >
          <h1 className={styles.logo}>Inner DNA</h1>
          <p className={styles.tagline}>Discover Your Unique Inner DNA</p>
        </motion.div>

        {/* HeroSection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.heroSection}
        >
          <div className={styles.towerPreview}>
            <TowerVisualization title="" blocks={towerBlocks} />
          </div>
          
          <p className={styles.description}>
            Build your personality tower through intuitive choices and discover your unique Inner DNA profile
          </p>
        </motion.div>

        {/* EmailCollection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.emailCollection}>
            <h3 className={styles.emailCollectionTitle}>Begin Your Journey</h3>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className={styles.formInput}
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
          </div>

          {/* StartButton */}
          <button
            onClick={handleStart}
            disabled={createUserMutation.isPending}
            className={styles.startButton}
          >
            {createUserMutation.isPending ? 'Starting...' : 'Begin Your Journey'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
