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
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="header">
          <div className="logo">Inner DNA</div>
          <div className="tagline">Discover Your Unique Inner DNA</div>
        </div>
        
        <div className="hero-section">
          <div className="tower-preview">
            <TowerVisualization title="" blocks={towerBlocks} />
          </div>
          <div className="description">
            Build your personality tower through intuitive choices and discover your unique Inner DNA profile
          </div>
        </div>
        
        <div className="email-collection">
          <h3>Begin Your Journey</h3>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>
        </div>
        
        <button
          onClick={handleStart}
          disabled={createUserMutation.isPending}
          className="start-button"
        >
          {createUserMutation.isPending ? 'Starting...' : 'Begin Your Journey'}
        </button>
      </div>
    </div>
  );
}
