import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TowerVisualization } from '@/components/TowerVisualization';
import { useAssessment } from '@/context/AssessmentContext';
import { determinePersonalityType, getTypeName } from '@/lib/assessmentAlgorithm';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Download, Share2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results() {
  const { 
    currentUser, 
    assessmentData, 
    setAssessmentData,
    stoneSelections, 
    setCurrentScreen 
  } = useAssessment();
  
  const [result, setResult] = useState<any>(null);

  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!currentUser) throw new Error('No user found');
      const response = await apiRequest('PATCH', `/api/users/${currentUser.id}`, data);
      return response.json();
    }
  });

  useEffect(() => {
    if (stoneSelections.length === 9) {
      const personalityResult = determinePersonalityType(stoneSelections);
      setResult(personalityResult);
      
      // Update assessment data with result
      const updatedAssessmentData = {
        ...assessmentData,
        result: personalityResult
      };
      setAssessmentData(updatedAssessmentData);
      
      // Save to backend
      if (currentUser) {
        updateUserMutation.mutate({
          completedAt: new Date(),
          assessmentData: updatedAssessmentData
        });
      }
    }
  }, [stoneSelections, assessmentData, currentUser]);

  const handleDownloadReport = () => {
    if (!result || !currentUser) return;
    
    const reportData = {
      user: currentUser,
      results: result,
      assessmentData,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inner-dna-report-${currentUser.id}.json`;
    link.click();
  };

  const handleRetakeAssessment = () => {
    setCurrentScreen('welcome');
    // Reset will be handled by remounting components
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your Inner DNA...</p>
        </div>
      </div>
    );
  }

  const typeName = getTypeName(result.primaryType);
  const confidencePercent = Math.round(result.confidence * 100);

  // Create final tower visualization
  const finalTowerBlocks = [
    { gradient: 'gradient-5', width: 'w-32', height: 'h-8' },
    { gradient: 'gradient-2', width: 'w-28', height: 'h-6' },
    { gradient: 'gradient-1', width: 'w-24', height: 'h-6' },
    { gradient: 'gradient-3', width: 'w-20', height: 'h-6' },
    { gradient: 'gradient-4', width: 'w-16', height: 'h-6' }
  ];

  const typeCharacteristics = {
    1: ['Principled and purposeful', 'Strives for improvement', 'Values integrity and quality'],
    2: ['Caring and interpersonal', 'Generous and people-pleasing', 'Values relationships and helping'],
    3: ['Success-oriented and pragmatic', 'Driven and image-conscious', 'Values achievement and efficiency'],
    4: ['Expressive and dramatic', 'Self-absorbed and temperamental', 'Values authenticity and individuality'],
    5: ['Intense and cerebral', 'Perceptive and innovative', 'Values knowledge and understanding'],
    6: ['Committed and security-oriented', 'Engaging and responsible', 'Values security and loyalty'],
    7: ['Spontaneous and versatile', 'Acquisitive and scattered', 'Values variety and adventure'],
    8: ['Self-confident and decisive', 'Willful and confrontational', 'Values justice and control'],
    9: ['Easygoing and self-effacing', 'Complacent and resigned', 'Values harmony and peace']
  };

  const growthAreas = {
    1: ['Balance criticism with acceptance', 'Practice flexibility', 'Embrace imperfection'],
    2: ['Focus on your own needs', 'Set healthy boundaries', 'Practice direct communication'],
    3: ['Develop authentic relationships', 'Value process over outcomes', 'Practice vulnerability'],
    4: ['Cultivate emotional stability', 'Focus on present achievements', 'Practice gratitude'],
    5: ['Engage with others more', 'Take action on insights', 'Share knowledge openly'],
    6: ['Build self-confidence', 'Trust your own judgment', 'Take calculated risks'],
    7: ['Develop depth and focus', 'Practice commitment', 'Process difficult emotions'],
    8: ['Practice vulnerability', 'Consider others' perspectives', 'Develop patience'],
    9: ['Assert your own agenda', 'Address conflicts directly', 'Take decisive action']
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Card className="p-12 mb-8">
            <h1 className="text-3xl font-bold mb-4">Your Inner DNA Profile</h1>
            <div className="mb-8">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {typeName} {result.primaryType}
              </div>
              <div className="text-xl text-gray-600 mb-4">Your Primary Type</div>
              <div className="flex justify-center items-center space-x-4">
                <span className="text-sm font-medium text-gray-600">Confidence:</span>
                <div className="w-48 bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidencePercent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-green-500 h-3 rounded-full"
                  />
                </div>
                <span className="text-sm font-bold text-green-600">{confidencePercent}%</span>
              </div>
            </div>
            
            <TowerVisualization 
              title="Your Complete Tower"
              blocks={finalTowerBlocks}
            />
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-blue-600">Core BASELINES</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold">Primary Focus</h4>
                  <p className="text-sm text-gray-600">
                    Your core drive centers around {typeName.toLowerCase()} characteristics
                  </p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold">Foundation BASELINES</h4>
                  <p className="text-sm text-gray-600">
                    Built upon your foundation stone selections and core motivations
                  </p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h4 className="font-semibold">Expression Style</h4>
                  <p className="text-sm text-gray-600">
                    Reflects your chosen building blocks and color states
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-green-600">Key Characteristics</h3>
              <div className="space-y-3">
                {typeCharacteristics[result.primaryType as keyof typeof typeCharacteristics]?.map((characteristic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{characteristic}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-orange-500">Growth Opportunities</h3>
              <div className="space-y-3">
                {growthAreas[result.primaryType as keyof typeof growthAreas]?.map((area, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-sm">{area}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-purple-600">Type Distribution</h3>
              <div className="space-y-3">
                {Object.entries(result.allScores)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([type, score]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm">{getTypeName(type)} ({type})</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-purple-600 h-2 rounded-full"
                          />
                        </div>
                        <span className="text-xs font-medium">{Math.round(score * 100)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <div className="space-x-4">
            <Button
              onClick={handleDownloadReport}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Results
            </Button>
          </div>
          <div>
            <Button
              variant="ghost"
              onClick={handleRetakeAssessment}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Assessment Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
