import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAssessment } from '@/context/AssessmentContext';
import { colorStates } from '@/lib/stoneData';
import { motion } from 'framer-motion';

export default function ColorStates() {
  const { setCurrentScreen, assessmentData, setAssessmentData } = useAssessment();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const maxSelections = 3;

  const handleStateSelect = (stateIndex: number) => {
    const state = colorStates[stateIndex];
    
    if (selectedStates.includes(state.state)) {
      // Deselect
      const newSelected = selectedStates.filter(s => s !== state.state);
      setSelectedStates(newSelected);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        colorStates: assessmentData.colorStates.filter(s => s.state !== state.state)
      });
    } else if (selectedStates.length < maxSelections) {
      // Select
      const newSelected = [...selectedStates, state.state];
      setSelectedStates(newSelected);
      
      // Update assessment data
      setAssessmentData({
        ...assessmentData,
        colorStates: [...assessmentData.colorStates, {
          state: state.state,
          title: state.title
        }]
      });
    }
  };

  const handleContinue = () => {
    setCurrentScreen('detail-tokens');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Color States</h2>
          <p className="text-gray-600">Select the colors that best represent your current mood and energy (up to 3)</p>
        </div>

        <div className="grid grid-cols-3 gap-8 justify-items-center mb-12">
          {colorStates.map((state, index) => (
            <motion.div
              key={state.state}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`color-state ${state.color} ${
                selectedStates.includes(state.state) ? 'selected' : ''
              }`}
              onClick={() => handleStateSelect(index)}
              title={state.title}
            />
          ))}
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Selected States</h3>
            <div className="flex justify-center space-x-4">
              {selectedStates.map(stateKey => {
                const state = colorStates.find(s => s.state === stateKey);
                return state ? (
                  <motion.div
                    key={state.state}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-12 h-12 rounded-full ${state.color}`}
                    title={state.title}
                  />
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
            Continue to Detail Tokens
          </Button>
        </div>
      </div>
    </div>
  );
}
