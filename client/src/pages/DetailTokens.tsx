import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessment } from '@/context/AssessmentContext';
import { detailTokens } from '@/lib/stoneData';
import { motion } from 'framer-motion';

export default function DetailTokens() {
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const handleTokenSelect = (category: string, token: string) => {
    const tokenKey = `${category}-${token}`;
    
    if (selectedTokens.includes(tokenKey)) {
      // Deselect
      const newSelected = selectedTokens.filter(t => t !== tokenKey);
      setSelectedTokens(newSelected);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        detailTokens: assessmentData.detailTokens.filter(t => t.token !== token || t.category !== category)
      });
    } else {
      // Select
      const newSelected = [...selectedTokens, tokenKey];
      setSelectedTokens(newSelected);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        detailTokens: [...assessmentData.detailTokens, {
          category,
          token
        }]
      });
    }
  };

  const handleContinue = () => {
    setCurrentScreen('results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Detail Tokens</h2>
          <p className="text-gray-600">Choose the detail tokens that add nuance to your personality profile</p>
        </div>

        <div className="space-y-8 mb-12">
          {Object.entries(detailTokens).map(([category, tokens]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                {tokens.map(tokenData => {
                  const tokenKey = `${category}-${tokenData.token}`;
                  const isSelected = selectedTokens.includes(tokenKey);
                  
                  return (
                    <motion.div
                      key={tokenData.token}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`detail-token ${tokenData.color} flex items-center justify-center font-medium ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => handleTokenSelect(category, tokenData.token)}
                    >
                      {tokenData.label}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Selected Tokens</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedTokens.map(tokenKey => {
                const [category, token] = tokenKey.split('-');
                const tokenData = detailTokens[category]?.find(t => t.token === token);
                
                return tokenData ? (
                  <motion.div
                    key={tokenKey}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`text-xs px-3 py-1 m-1 rounded-full ${tokenData.color}`}
                  >
                    {tokenData.label}
                  </motion.div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
          >
            See Your Results
          </Button>
        </div>
      </div>
    </div>
  );
}
