import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessment } from '@/context/AssessmentContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TowerVisualization } from '@/components/TowerVisualization';

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
    <div className="welcomeScreen">
      <div className="welcomeContainer">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="welcomeHeader fadeIn"
        >
          <h1 className="welcomeLogo">Inner DNA</h1>
          <p className="welcomeTagline">Discover Your Unique Inner DNA</p>
        </motion.div>

        {/* HeroSection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="heroSection"
        >
          <div className="towerPreview">
            <TowerVisualization title="" blocks={towerBlocks} />
          </div>
          
          <p className="heroDescription">
            Build your personality tower through intuitive choices and discover your unique Inner DNA profile
          </p>
        </motion.div>

        {/* EmailCollection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="emailCollection">
            <h3 className="emailCollectionTitle">Begin Your Journey</h3>
            <div className="formGroup">
              <label htmlFor="email" className="formLabel">Email Address *</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="formInput"
              />
            </div>
            <div className="formGrid">
              <div className="formGroup">
                <label htmlFor="firstName" className="formLabel">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="formInput"
                />
              </div>
              <div className="formGroup">
                <label htmlFor="lastName" className="formLabel">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="formInput"
                />
              </div>
            </div>
          </div>

          {/* StartButton */}
          <button
            onClick={handleStart}
            disabled={createUserMutation.isPending}
            className="startButton"
          >
            {createUserMutation.isPending ? 'Starting...' : 'Begin Your Journey'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
