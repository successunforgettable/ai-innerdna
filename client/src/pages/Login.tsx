import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    completedAt: string | null;
    assessmentData: any;
  };
  message: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch("/api/auth/get-reports", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }
      
      return await response.json() as LoginResponse;
    },
    onSuccess: (data) => {
      // Store user data in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      
      // Navigate to user reports page
      setLocation("/reports");
    },
    onError: (error: any) => {
      setError(error.message || "Login failed. Please check your credentials.");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send recovery email");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setForgotSuccess(data.message);
      setForgotEmail("");
      // Auto-close modal after 4 seconds
      setTimeout(() => {
        closeForgotModal();
      }, 4000);
    },
    onError: (error: any) => {
      setError(error.message || "Failed to send recovery email");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setForgotSuccess("");
    
    if (!forgotEmail) {
      setError("Please enter your email address");
      return;
    }

    forgotPasswordMutation.mutate(forgotEmail);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotSuccess("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Glass Container */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold text-yellow-400 mb-2"
            >
              View Your Report
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-white/80 text-lg"
            >
              Enter your details to access your personality assessment report
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label htmlFor="password" className="block text-white/90 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter your password"
                required
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 text-sm underline"
                >
                  Forgot Password?
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loginMutation.isPending ? "Accessing Report..." : "Access My Report"}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              onClick={handleBackToHome}
              className="text-white/70 hover:text-white transition-colors duration-300 text-sm underline"
            >
              Back to Assessment
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-4 text-center text-white/50 text-xs"
          >
            Don't have an account? Complete the assessment to create one.
          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400 mb-2">Password Recovery</h2>
                <p className="text-white/70 text-sm">
                  Enter your email address and we'll send you password recovery assistance.
                </p>
              </div>

              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label htmlFor="forgotEmail" className="block text-white/90 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {forgotSuccess && (
                  <div className="mb-4 p-4 bg-green-400/20 border border-green-400/40 rounded-lg text-green-200 text-sm font-medium leading-relaxed">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-black text-xs font-bold">✓</span>
                      </div>
                      <div>
                        <div className="font-semibold mb-1">New Password Generated!</div>
                        <div>{forgotSuccess}</div>
                        <div className="mt-2 text-green-300 text-xs">Check your email for the temporary password and log in immediately.</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="flex-1 py-3 px-4 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send Recovery Email"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}