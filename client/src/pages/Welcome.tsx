import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { TowerVisualization } from '@/components/TowerVisualization';
import NotificationBell from '../components/Common/NotificationBell';
import styles from './Welcome.module.css';

export default function Welcome() {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [, setLocation] = useLocation();
  const { setCurrentUser, setCurrentScreen } = useAssessment();

  const authMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
      try {
        const response = await apiRequest('POST', endpoint, data);
        return await response.json();
      } catch (error: any) {
        console.error('Auth error:', error);
        throw new Error(error.message || 'Authentication failed');
      }
    },
    onSuccess: (result) => {
      console.log('Auth success:', result);
      if (result.requiresVerification) {
        setShowVerification(true);
      } else {
        // Store user info for later use in assessment
        const fullPhoneNumber = isLoginMode ? 
          (result.user?.phoneNumber || '') : 
          `${countryCode}${phoneNumber.trim()}`;
          
        const userInfo = {
          userId: result.user?.id,
          email: email.trim(),
          firstName: firstName.trim() || result.user?.firstName || 'User',
          lastName: lastName.trim() || result.user?.lastName || '',
          phoneNumber: fullPhoneNumber,
          registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('current-user-info', JSON.stringify(userInfo));
        
        setCurrentUser(result.user);
        setCurrentScreen('foundation-stones');
        setLocation('/foundation-stones');
      }
    },
    onError: (error: any) => {
      console.error('Auth mutation error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const response = await apiRequest('POST', '/api/auth/verify-email', data);
      return response.json();
    },
    onSuccess: () => {
      // Store user info for later use in assessment
      const userInfo = {
        userId: null, // Will be set after successful verification
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: `${countryCode}${phoneNumber.trim()}`,
        registeredAt: new Date().toISOString()
      };
      
      localStorage.setItem('current-user-info', JSON.stringify(userInfo));
      
      // After verification, start assessment
      setCurrentUser({ 
        id: 0, 
        email, 
        firstName, 
        lastName, 
        phoneNumber,
        startedAt: new Date(),
        completedAt: null,
        assessmentData: null,
        passwordHash: null,
        emailVerified: new Date(),
        phoneVerified: null,
        verificationCode: null,
        resetToken: null,
        resetTokenExpiry: null
      });
      setCurrentScreen('foundation-stones');
      setLocation('/foundation-stones');
    }
  });

  const handleStart = () => {
    if (!email.trim()) {
      alert('Email is required to continue');
      return;
    }
    if (!password.trim()) {
      alert('Password is required');
      return;
    }

    if (isLoginMode) {
      // Login validation
      authMutation.mutate({
        email: email.trim(),
        password: password.trim()
      });
    } else {
      // Registration validation
      if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
        alert('All fields are required for registration');
        return;
      }
      
      if (!termsAccepted) {
        alert('Please accept the terms and conditions to continue');
        return;
      }

      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;

      authMutation.mutate({
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phoneNumber: fullPhoneNumber,
        password: password.trim()
      });
    }
  };

  const handleVerification = () => {
    if (!verificationCode.trim()) {
      alert('Verification code is required');
      return;
    }

    verifyMutation.mutate({
      email: email.trim(),
      code: verificationCode.trim()
    });
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

  if (showVerification) {
    return (
      <div className={styles.welcomeScreen}>
        <motion.div 
          className={styles.welcomeContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.header 
            className={styles.header}
            variants={itemVariants}
          >
            <motion.div className={styles.logo}>Inner DNA</motion.div>
            <motion.div className={styles.tagline}>Email Verification Required</motion.div>
          </motion.header>
          
          <motion.div 
            className={styles.emailCollection}
            variants={itemVariants}
          >
            <h3 className={styles.emailCollectionTitle}>
              Check Your Email
            </h3>
            <p style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
              We've sent a verification code to {email}
            </p>
            
            <div className={styles.formGroup}>
              <label htmlFor="verificationCode" className={styles.formLabel}>Verification Code</label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className={styles.formInput}
                maxLength={6}
                required
              />
            </div>
            
            <button
              className={styles.startButton}
              onClick={handleVerification}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Email'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
          style={{ position: 'relative' }}
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
          
          {/* Top Right Header Actions */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000
          }}>
            {/* Notification Bell */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <NotificationBell />
            </div>
            
            {/* Login Button */}
            <motion.button
              onClick={() => setLocation('/login')}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                opacity: 0.9
              }}
              whileTap={{
                scale: 0.98
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                textDecoration: 'none'
              }}
            >
              Login
            </motion.button>
          </div>
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
        
        {/* EmailCollection - enhanced design and animations */}
        <motion.div 
          className={styles.emailCollection}
          variants={itemVariants}
          whileHover={{ 
            boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)",
            y: -2
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.h3 
            className={styles.emailCollectionTitle}
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
          
          {!isLoginMode && (
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
                <label htmlFor="firstName" className={styles.formLabel}>First Name *</label>
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
                <label htmlFor="lastName" className={styles.formLabel}>Last Name *</label>
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
          )}
          
          {/* Phone Number Field with Country Code - Registration only */}
          {!isLoginMode && (
            <motion.div 
              className={styles.formGroup}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <label htmlFor="phoneNumber" className={styles.formLabel}>Phone Number (for WhatsApp report) *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className={styles.formInput}
                  style={{ width: '100px', flexShrink: 0 }}
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.15)",
                    borderColor: "var(--blue-primary)"
                  }}
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+7">🇷🇺 +7</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+358">🇫🇮 +358</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+43">🇦🇹 +43</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+351">🇵🇹 +351</option>
                  <option value="+48">🇵🇱 +48</option>
                  <option value="+420">🇨🇿 +420</option>
                  <option value="+36">🇭🇺 +36</option>
                  <option value="+30">🇬🇷 +30</option>
                  <option value="+90">🇹🇷 +90</option>
                  <option value="+972">🇮🇱 +972</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+20">🇪🇬 +20</option>
                  <option value="+27">🇿🇦 +27</option>
                  <option value="+234">🇳🇬 +234</option>
                  <option value="+254">🇰🇪 +254</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+60">🇲🇾 +60</option>
                  <option value="+66">🇹🇭 +66</option>
                  <option value="+84">🇻🇳 +84</option>
                  <option value="+63">🇵🇭 +63</option>
                  <option value="+62">🇮🇩 +62</option>
                  <option value="+54">🇦🇷 +54</option>
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+51">🇵🇪 +51</option>
                  <option value="+58">🇻🇪 +58</option>
                </motion.select>
                <motion.input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="555 123-4567"
                  className={styles.formInput}
                  style={{ flex: 1 }}
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
              </div>
            </motion.div>
          )}
          
          {/* Password Field */}
          <motion.div 
            className={styles.formGroup}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <label htmlFor="password" className={styles.formLabel}>Password *</label>
            <motion.input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a secure password"
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
          
          {/* Terms and Conditions - Registration only */}
          {!isLoginMode && (
            <motion.div 
              className={styles.formGroup}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
            >
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className={styles.checkbox}
                  required
                />
                <span>I accept the terms and conditions and privacy policy *</span>
              </label>
            </motion.div>
          )}
          
          {/* Toggle between Login/Register */}
          <motion.div 
            className={styles.toggleMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.3 }}
          >
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className={styles.toggleButton}
            >
              {isLoginMode ? 'New user? Create account' : 'Already have an account? Login'}
            </button>
          </motion.div>
        </motion.div>

        {/* StartButton - exact from spec */}
        <motion.button
          className={styles.startButton}
          onClick={handleStart}
          variants={itemVariants}
          disabled={authMutation.isPending}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
          }}
          whileTap={{
            scale: 0.98
          }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {authMutation.isPending ? 'Processing...' : (isLoginMode ? 'Login & Begin' : 'Begin Your Journey')}
        </motion.button>
      </motion.div>
    </div>
  );
}