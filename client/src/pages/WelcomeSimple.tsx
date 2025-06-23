import { useState } from 'react';
import { useLocation } from 'wouter';

export default function WelcomeSimple() {
  const [email, setEmail] = useState('');
  const [, setLocation] = useLocation();

  const handleStart = () => {
    if (email.trim()) {
      localStorage.setItem('userEmail', email.trim());
      setLocation('/foundation-stones');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          textShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          Inner DNA
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '3rem',
          opacity: 0.9
        }}>
          Discover Your Unique Inner DNA using Ai
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '1.5rem',
          padding: '2rem',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255,255,255,0.25)',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '1.5rem',
            fontWeight: '600'
          }}>
            Begin Your Journey
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.025em'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '2px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.9)',
                fontSize: '1rem',
                color: '#1e293b',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <button
            onClick={handleStart}
            disabled={!email.trim()}
            style={{
              background: email.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: email.trim() ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.3s ease'
            }}
          >
            Start Assessment
          </button>
        </div>

        <button
          onClick={() => setLocation('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: '0.5rem'
          }}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}