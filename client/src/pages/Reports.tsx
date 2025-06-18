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
            <div className="text-center mb-8 results-header">
              <h2 className="text-6xl font-bold text-yellow-400 mb-4 results-title">
                Type {assessmentData?.result?.primaryType || "Unknown"}
              </h2>
              <p className="text-xl text-white/90 mb-2 results-influence">
                Your primary personality influence
              </p>
              <p className="text-lg text-green-400 results-confidence">
                Confidence: {Math.round((assessmentData?.result?.confidence || 0) * 100)}%
              </p>
            </div>

            {/* Assessment Summary */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Assessment Summary</h3>
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span>{new Date(userReport.completedAt!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Foundation Stones:</span>
                    <span>{assessmentData?.foundationStones?.length || 0}/9</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Building Blocks:</span>
                    <span>{assessmentData?.buildingBlocks?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Color States:</span>
                    <span>{assessmentData?.colorStates?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Detail Tokens:</span>
                    <span>{assessmentData?.detailTokens?.length || 0}</span>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-yellow-400 mb-4">Contact Information</h3>
                <div className="space-y-3 text-white/80">
                  <div>
                    <span className="text-white/60">Email:</span>
                    <div>{userReport.email}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Phone:</span>
                    <div>{userReport.phoneNumber}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Name:</span>
                    <div>{userReport.firstName} {userReport.lastName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color States */}
            {assessmentData?.colorStates && assessmentData.colorStates.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Your Selected States</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {assessmentData.colorStates.map((state: any, index: number) => (
                    <div
                      key={index}
                      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <h4 className="font-semibold text-white mb-2">{state.title}</h4>
                      <p className="text-white/70 text-sm">{state.state}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Building Blocks */}
            {assessmentData?.buildingBlocks && assessmentData.buildingBlocks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Your Building Blocks</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {assessmentData.buildingBlocks.map((block: any, index: number) => (
                    <div
                      key={index}
                      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                    >
                      <div className="text-2xl font-bold text-yellow-400 mb-2">
                        Type {block.type}
                      </div>
                      <div className="text-white font-medium mb-1">{block.name}</div>
                      {block.wing && (
                        <div className="text-white/70 text-sm">Wing {block.wing}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Scores */}
            {assessmentData?.result?.allScores && (
              <div>
                <h3 className="text-2xl font-semibold text-yellow-400 mb-4">Complete Type Scores</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {Object.entries(assessmentData.result.allScores)
                    .sort(([,a]: [string, any], [,b]: [string, any]) => b - a)
                    .map(([type, score]: [string, any]) => (
                    <div
                      key={type}
                      className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between items-center"
                    >
                      <span className="text-white font-medium">Type {type}</span>
                      <span className="text-yellow-400 font-bold">{Math.round(score * 100) / 100}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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