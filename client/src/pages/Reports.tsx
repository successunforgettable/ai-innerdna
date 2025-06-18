import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface UserReport {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  completedAt: string | null;
  assessmentData: any;
}

export default function Reports() {
  const [, setLocation] = useLocation();
  const [userReport, setUserReport] = useState<UserReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserReport(userData);
    } else {
      // No user data, redirect to login
      setLocation("/login");
    }
    setLoading(false);
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLocation("/");
  };

  const handleBackToAssessment = () => {
    setLocation("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your report...</div>
      </div>
    );
  }

  if (!userReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">No report found. Please log in again.</div>
      </div>
    );
  }

  const hasCompletedAssessment = userReport.completedAt && userReport.assessmentData;
  const assessmentData = userReport.assessmentData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                Welcome back, {userReport.firstName}!
              </h1>
              <p className="text-white/80">
                Here's your personality assessment report
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBackToAssessment}
                className="px-4 py-2 bg-blue-500/30 text-white border border-blue-400/50 rounded-lg hover:bg-blue-500/40 transition-all duration-300"
              >
                New Assessment
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/30 text-white border border-red-400/50 rounded-lg hover:bg-red-500/40 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {hasCompletedAssessment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl results-container"
          >
            {/* Results Header */}
            <div className="text-center mb-12 results-header">
              <h2 className="text-6xl font-bold text-yellow-400 mb-4 results-title">
                The Challenger
              </h2>
              <p className="text-xl text-white/90 mb-2 results-influence">
                Your primary personality influence
              </p>
              <p className="text-lg text-green-400 results-confidence">
                Confidence: {Math.round((assessmentData?.result?.confidence || 0) * 100)}%
              </p>
            </div>

            {/* Core Description */}
            <div className="mb-12">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-lg text-white/90 leading-relaxed">
                  Powerful, dominating type. Self-confident, decisive, willful, and confrontational. 
                  Can be egoistic and dominating at their worst. At their best: self-mastering, 
                  they use their strength to improve others' lives, becoming heroic, magnanimous, and inspiring.
                </p>
              </div>
            </div>

            {/* Mood States */}
            <div className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-green-400 mb-4">
                    When you're in a good mood
                  </h4>
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                    <ul className="space-y-2 text-white/90">
                      <li>• Magnanimous and generous</li>
                      <li>• Protective and championing</li>
                      <li>• Self-restraining and merciful</li>
                      <li>• Heroic and inspiring</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-red-400 mb-4">
                    When you're in a bad mood
                  </h4>
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4">
                    <ul className="space-y-2 text-white/90">
                      <li>• Vindictive and ruthless</li>
                      <li>• Dictatorial and tyrannical</li>
                      <li>• Destructive and megalomaniacal</li>
                      <li>• Violent and antisocial</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Influence Description */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Influence: 9
              </h3>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-lg text-white/90 leading-relaxed">
                  The 9 influence brings a peaceful, harmonizing quality to your assertive nature. 
                  You approach challenges through steady, measured means rather than pure force. This influence 
                  helps you maintain relationships while still standing firm in your convictions.
                </p>
              </div>
            </div>

            {/* State Analysis */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Current State Distribution
              </h3>
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {assessmentData?.colorStates?.map((state: any, index: number) => (
                    <div key={index}>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {index === 0 ? 'Primary' : 'Secondary'} State
                      </h4>
                      <p className="text-white/80">{state.title}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/90">
                  You tend to operate from a strong state, showing consistency in your emotional patterns 
                  while maintaining access to focused energy when needed.
                </p>
              </div>
            </div>

            {/* Subtype Analysis */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                Your Subtype Focus
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">Self-Preservation</h4>
                  <p className="text-2xl font-bold text-yellow-400">30%</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">Social</h4>
                  <p className="text-2xl font-bold text-yellow-400">30%</p>
                </div>
                <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <h4 className="text-lg font-semibold text-white mb-2">Sexual</h4>
                  <p className="text-2xl font-bold text-yellow-400">40%</p>
                </div>
              </div>
              <div className="mt-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="text-white/90 leading-relaxed">
                  Your Sexual subtype focus means you're drawn to intensity, passion, and one-on-one connections. 
                  You seek powerful experiences and aren't afraid of conflict or challenge. This subtype brings 
                  magnetic energy and the desire to make a significant impact on others.
                </p>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Assessment Not Completed
            </h2>
            <p className="text-white/80 mb-6">
              You haven't completed your personality assessment yet.
            </p>
            <button
              onClick={handleBackToAssessment}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Assessment
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}