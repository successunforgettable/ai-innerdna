import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface SavedReport {
  id: number;
  userId: number;
  reportType: string;
  personalityType: string;
  reportUrl: string;
  reportData: any;
  generatedAt: string;
}

interface UserData {
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
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserReports = async () => {
      try {
        // Get user data from localStorage
        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) {
          setLocation("/login");
          return;
        }

        const user = JSON.parse(storedUser);
        setUserData(user);

        // Fetch saved reports from database
        const response = await fetch(`/api/users/${user.id}/reports`);
        if (response.ok) {
          const reports = await response.json();
          setSavedReports(reports);
        } else {
          console.error('Failed to fetch reports');
          setError('Failed to load your reports');
        }
      } catch (err) {
        console.error('Error loading reports:', err);
        setError('Error loading your reports');
      } finally {
        setLoading(false);
      }
    };

    loadUserReports();
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLocation("/");
  };

  const handleBackToAssessment = () => {
    setLocation("/");
  };

  const openReport = (reportUrl: string) => {
    window.open(reportUrl, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPersonalityName = (typeString: string) => {
    const typeNames: { [key: string]: string } = {
      'Type 1': 'The Reformer',
      'Type 2': 'The Helper',
      'Type 3': 'The Achiever',
      'Type 4': 'The Individualist',
      'Type 5': 'The Investigator',
      'Type 6': 'The Sentinel',
      'Type 7': 'The Enthusiast',
      'Type 8': 'The Challenger',
      'Type 9': 'The Peacemaker'
    };
    return typeNames[typeString] || typeString;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your reports...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">No user data found. Please log in again.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
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
                Your Transformation Reports
              </h1>
              <p className="text-white/80 text-lg">
                Welcome back, {userData.firstName} {userData.lastName}
              </p>
            </div>
            <div className="flex gap-4">
              <motion.button
                onClick={handleBackToAssessment}
                className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Assessment
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="btn-primary bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 shadow-2xl"
          >
            <p className="text-red-200 text-center">{error}</p>
          </motion.div>
        )}

        {/* Reports Grid */}
        {savedReports.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {savedReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">🧠</div>
                  <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    {report.reportType}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  {getPersonalityName(report.personalityType)}
                </h3>
                
                <p className="text-white/80 mb-4">
                  Generated on {formatDate(report.generatedAt)}
                </p>
                
                <motion.button
                  onClick={() => openReport(report.reportUrl)}
                  className="w-full btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Report
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* No Reports State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12 shadow-2xl text-center"
          >
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              No Reports Yet
            </h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              You haven't generated any transformation reports yet. Complete an assessment to create your first personalized report.
            </p>
            <motion.button
              onClick={handleBackToAssessment}
              className="btn-primary bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Assessment
            </motion.button>
          </motion.div>
        )}

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mt-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Account Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-sm">Email</p>
              <p className="text-white font-medium">{userData.email}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Phone</p>
              <p className="text-white font-medium">{userData.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Member Since</p>
              <p className="text-white font-medium">
                {new Date(userData.completedAt || '').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Total Reports</p>
              <p className="text-white font-medium">{savedReports.length}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}