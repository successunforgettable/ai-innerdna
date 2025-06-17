import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay
    setTimeout(() => {
      const success = login(password);
      if (success) {
        setLocation('/analytics');
      } else {
        setError('Invalid admin password');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Admin Access
          </h1>
          <p className="text-white/80">
            Enter admin password to access analytics
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-400/50 text-blue-900 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? 'Authenticating...' : 'Access Analytics'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation('/')}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to Assessment
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;