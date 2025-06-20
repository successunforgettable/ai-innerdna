import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AITestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAIIntegration = async () => {
    setLoading(true);
    
    try {
      // Test with sample assessment data
      const sampleData = {
        primaryType: 'Type 3',
        confidence: 85,
        wing: '4',
        colorStates: [
          { state: 'Achievement', percentage: 60 },
          { state: 'Security', percentage: 40 }
        ],
        detailTokens: [
          { category: 'self', token: '4' },
          { category: 'oneToOne', token: '3' },
          { category: 'social', token: '3' }
        ]
      };

      const response = await fetch('/api/generate-quick-insight', {
        method: 'POST',
        body: JSON.stringify({ assessmentData: sampleData }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTestResult(data.insight || 'AI response received but no insight content');
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
        >
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">
            AI Integration Test
          </h1>
          
          <button
            onClick={testAIIntegration}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-semibold py-3 px-6 rounded-xl mb-6"
          >
            {loading ? 'Testing AI...' : 'Test AI Integration'}
          </button>

          {testResult && (
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">AI Response:</h3>
              <p className="text-white/90 leading-relaxed">{testResult}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AITestPage;