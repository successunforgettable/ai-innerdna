import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AuthTest = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated, login, logout } = useAuth();

  const handleLogin = () => {
    const success = login(password);
    if (success) {
      setMessage('Login successful!');
    } else {
      setMessage('Invalid password');
    }
    setPassword('');
  };

  const handleLogout = () => {
    logout();
    setMessage('Logged out successfully');
  };

  return (
    <div className="p-4 bg-white/10 rounded-lg border border-white/20 mb-4">
      <h3 className="text-lg font-bold text-yellow-400 mb-4">Auth Test</h3>
      
      <div className="mb-4">
        <p className="text-white">Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
      </div>

      {!isAuthenticated ? (
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="px-3 py-2 rounded bg-white/20 text-white mr-2"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}

      {message && (
        <p className="mt-2 text-green-400">{message}</p>
      )}
    </div>
  );
};

export default AuthTest;