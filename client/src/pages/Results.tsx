import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAssessment } from '@/context/AssessmentContext';
import { motion } from 'framer-motion';

import { saveAssessmentData } from '@/lib/assessmentStorage';
import '@/styles/design-system.css';

const Results = () => {
  const [, setLocation] = useLocation();
  const { assessmentData, setCurrentScreen } = useAssessment();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Extract data from assessment context
  const foundationData = assessmentData.foundationStones;
  const buildingData = assessmentData.buildingBlocks;
  const colorData = assessmentData.colorStates;
  const detailData = assessmentData.detailTokens;
  const personalityResult = assessmentData.result;

  // Extract data for components - use actual assessment data
  const primaryType = personalityResult?.primaryType;
  const personalityName = primaryType ? getPersonalityName(primaryType) : undefined;
  const influenceNumber = buildingData?.[0]?.wing || '9'; // Show wing number, not block name
  const confidence = personalityResult?.confidence;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // Force scroll to top with a small delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
  }, []);

  // Save assessment data when results are displayed
  useEffect(() => {
    if (foundationData && buildingData && colorData && detailData && primaryType) {
      const storedUserInfo = localStorage.getItem('current-user-info');
      const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};

      const completeAssessment = {
        // User Information
        email: userInfo.email || '',
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        phone: userInfo.phone || '',
        
        // Core Results
        primaryType: primaryType,
        typeName: personalityName,
        wingName: influenceNumber,
        confidence: confidence,
        
        // Phase Data
        foundationSelections: foundationData || [],
        buildingSelections: buildingData || [],
        colorSelections: colorData || [],
        colorDistribution: colorData || {},
        subtypeDistribution: detailData || {},
        
        // Analysis Results
        subtypeResult: detailData || {},
        
        // Metadata
        completedAt: new Date().toISOString(),
        version: 'v1.0'
      };
      
      // Save to localStorage
      const assessmentId = saveAssessmentData(completeAssessment);
      if (assessmentId) {
        console.log('Assessment saved with ID:', assessmentId);
      }
      
      // Save to database if user is registered
      if (userInfo.email && userInfo.userId) {
        updateUserAssessmentInDatabase(userInfo.userId, {
          foundationStones: foundationData,
          buildingBlocks: buildingData,
          colorStates: colorData,
          detailTokens: detailData,
          result: personalityResult
        });
      }
      
      // Clear user info after saving assessment
      localStorage.removeItem('current-user-info');
    }
  }, [foundationData, buildingData, colorData, detailData, primaryType, personalityName, influenceNumber, confidence, personalityResult]);

  // Function to update user assessment in database
  const updateUserAssessmentInDatabase = async (userId: number, assessmentData: any) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentData: assessmentData,
          completedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        console.log('Assessment saved to database successfully');
      } else {
        console.error('Failed to save assessment to database');
      }
    } catch (error) {
      console.error('Error saving assessment to database:', error);
    }
  };

  // Generate emergency report URL with loading animation
  const generateReportUrl = () => {
    if (primaryType && !isGenerating) {
      setIsGenerating(true);
      setProgress(0);
      
      // Simulate progress with intervals
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Open report after progress completes
            setTimeout(() => {
              window.open(`/api/emergency-view/${primaryType}`, '_blank');
              setIsGenerating(false);
              setProgress(0);
            }, 500);
            return 100;
          }
          return prev + (Math.random() * 15 + 5); // Random increment between 5-20%
        });
      }, 200); // Update every 200ms for smooth animation
    }
  };

  // Check if assessment is complete
  const hasValidData = primaryType && personalityName && confidence;

  function getPersonalityName(typeId: number): string {
    const names: { [key: number]: string } = {
      1: "Reformer",
      2: "Helper", 
      3: "Achiever",
      4: "Individualist",
      5: "Investigator",
      6: "Sentinel",
      7: "Enthusiast",
      8: "Challenger",
      9: "Peacemaker"
    };
    return names[typeId] || "Challenger";
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 results-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-2xl results-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          
          {hasValidData ? (
            <>
              {/* Header */}
              <div className="text-center mb-12 results-header">
                <h1 className="text-6xl font-bold text-yellow-400 mb-4 results-title">
                  Assessment Complete!
                </h1>
                <p className="text-xl text-white/80 mb-4">
                  Your personalized transformation report is ready
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mt-6"></div>
              </div>

              {/* Report Button or Loading State */}
              <div className="flex flex-col items-center mt-12 mb-8">
                {!isGenerating ? (
                  <motion.button
                    onClick={generateReportUrl}
                    className="btn-primary bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate your personal Ai report
                  </motion.button>
                ) : (
                  <div className="w-full max-w-md">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        Generating Your Report...
                      </h3>
                      <p className="text-white/80 text-lg">
                        Creating your personalized transformation insights
                      </p>
                    </motion.div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-white/20 backdrop-blur-md rounded-full h-4 mb-4 overflow-hidden border border-white/30">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-inner"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    
                    {/* Progress Percentage */}
                    <div className="text-center">
                      <span className="text-white font-bold text-2xl">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>


            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Assessment Incomplete</h2>
              <p className="text-white/80 mb-8">
                It looks like your assessment isn't complete yet. Please complete all phases to see your results.
              </p>
              <motion.button
                onClick={() => setLocation('/')}
                className="btn-primary bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Assessment
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Results;