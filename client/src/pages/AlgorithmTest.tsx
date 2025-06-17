import React, { useState } from 'react';
import { runAlgorithmValidation, testSpecificScenario } from '@/tests/algorithmValidation';
import { determinePersonalityType, determineWing, getTypeName } from '@/lib/assessmentAlgorithm';
import { determineSubtypeStack } from '@/utils/subtypeCalculation';

const AlgorithmTest = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customSelections, setCustomSelections] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [customResult, setCustomResult] = useState<any>(null);
  const [testingInProgress, setTestingInProgress] = useState(false);

  const runComprehensiveTests = () => {
    setTestingInProgress(true);
    console.log("Running comprehensive algorithm validation...");
    
    setTimeout(() => {
      const results = runAlgorithmValidation();
      setTestResults(results);
      setTestingInProgress(false);
    }, 100);
  };

  const testCustomScenario = () => {
    const result = testSpecificScenario(customSelections, "Custom Test Scenario");
    setCustomResult(result);
  };

  const debugType7Test = () => {
    console.log("=== DEBUGGING TYPE 7 ALGORITHM ===");
    
    // Get the exact Type 7 test case
    const type7Selections = [0, 0, 1, 2, 1, 2, 2, 2, 2];
    console.log("Type 7 Test Selections:", type7Selections);
    
    // Run the algorithm with detailed logging
    const result = determinePersonalityType(type7Selections);
    
    console.log("Algorithm Result:", result);
    console.log("All Type Scores:", result.rawScores);
    console.log("Normalized Scores:", result.allScores);
    
    // Check specific scoring patterns
    console.log("\n=== SCORE ANALYSIS ===");
    if (result.rawScores) {
      console.log(`Type 5 Raw Score: ${result.rawScores[5] || 0}`);
      console.log(`Type 6 Raw Score: ${result.rawScores[6] || 0}`);
      console.log(`Type 7 Raw Score: ${result.rawScores[7] || 0}`);
      console.log(`Type 8 Raw Score: ${result.rawScores[8] || 0}`);
      
      const type7Score = result.rawScores[7] || 0;
      const type5Score = result.rawScores[5] || 0;
      console.log(`Type 7 vs Type 5 Difference: ${type7Score - type5Score}`);
    }
    
    // Test individual selection impacts
    console.log("\n=== SELECTION IMPACT ANALYSIS ===");
    const selectionLabels = [
      ['Head', 'Heart', 'Body'],
      ['Security', 'Identity', 'Power'],
      ['Internal', 'Assertive', 'Cooperative'],
      ['Independence', 'Connection', 'Autonomy'],
      ['Conceptual', 'Emotional', 'Practical'],
      ['Cautious', 'Recognition', 'Control'],
      ['Harmony', 'Support', 'Directness'],
      ['Standard', 'Relational', 'Achievement'],
      ['Independence', 'Reciprocity', 'Leadership']
    ];
    
    type7Selections.forEach((selection, index) => {
      const label = selectionLabels[index] ? selectionLabels[index][selection] : `Option ${selection}`;
      console.log(`Set ${index + 1}: Selection ${selection} (${label})`);
    });
    
    console.log("=== END DEBUG ===");
  };

  const testType5Pattern = () => {
    console.log("Testing Type 5 Pattern...");
    const type5Selections = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // All Head/Security/Internal pattern
    const result = determinePersonalityType(type5Selections);
    console.log("Type 5 Test:", result);
  };

  const testType8Pattern = () => {
    console.log("Testing Type 8 Pattern...");
    const type8Selections = [2, 2, 1, 2, 2, 2, 2, 2, 2]; // All Body/Power/Assertive pattern
    const result = determinePersonalityType(type8Selections);
    console.log("Type 8 Test:", result);
  };

  const testWingCalculation = () => {
    console.log("Testing Wing Calculation...");
    const wing1Test = determineWing("1", 0);
    const wing2Test = determineWing("1", 1);
    console.log("Type 1 Wing 0:", wing1Test);
    console.log("Type 1 Wing 1:", wing2Test);
  };

  const updateSelection = (index: number, value: number) => {
    const newSelections = [...customSelections];
    newSelections[index] = value;
    setCustomSelections(newSelections);
  };

  const getTestSummary = () => {
    if (testResults.length === 0) return null;
    
    const total = testResults.length;
    const passed = testResults.filter(r => r.passed).length;
    const failed = total - passed;
    
    return { total, passed, failed, accuracy: Math.round(passed/total*100) };
  };

  const summary = getTestSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          
          <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
            Algorithm Validation Testing
          </h1>
          
          {/* Comprehensive Test Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Comprehensive Algorithm Test</h2>
            <p className="text-white/80 mb-4">
              Tests all 9 personality types, 18 wing combinations, and 7 subtype scenarios against the specification.
            </p>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={runComprehensiveTests}
                disabled={testingInProgress}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                {testingInProgress ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <button
                onClick={debugType7Test}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
              >
                Debug Type 7 Test
              </button>
            </div>
            
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{summary.total}</div>
                  <div className="text-white/70">Total Tests</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{summary.passed}</div>
                  <div className="text-white/70">Passed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{summary.failed}</div>
                  <div className="text-white/70">Failed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{summary.accuracy}%</div>
                  <div className="text-white/70">Accuracy</div>
                </div>
              </div>
            )}
            
            {testResults.length > 0 && (
              <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-2">Test Results</h3>
                {testResults.map((result, index) => (
                  <div key={index} className={`text-sm mb-1 ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                    {result.passed ? '✓' : '✗'} {result.testId}: Expected {result.expectedType}, Got {result.actualType}
                    {result.error && ` - ${result.error}`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Test Section */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Custom Scenario Test</h2>
            <p className="text-white/80 mb-4">
              Test specific foundation stone selections to verify algorithm accuracy.
            </p>
            
            <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-4">
              {customSelections.map((selection, index) => (
                <div key={index} className="text-center">
                  <label className="block text-white/70 text-sm mb-1">Set {index + 1}</label>
                  <select
                    value={selection}
                    onChange={(e) => updateSelection(index, parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                  >
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                  </select>
                </div>
              ))}
            </div>
            
            <button
              onClick={testCustomScenario}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors mb-4"
            >
              Test Custom Scenario
            </button>
            
            {customResult && (
              <div className="bg-black/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Custom Test Result</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">Type {customResult.primaryType}</div>
                    <div className="text-white/70">{getTypeName(customResult.primaryType)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{Math.round(customResult.confidence * 100)}%</div>
                    <div className="text-white/70">Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{customResult.rawScores[customResult.primaryType]}</div>
                    <div className="text-white/70">Raw Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{Math.round(customResult.allScores[customResult.primaryType] * 100)}%</div>
                    <div className="text-white/70">Normalized</div>
                  </div>
                </div>
                
                <div className="text-sm text-white/80">
                  <div className="mb-2"><strong>Raw Scores:</strong></div>
                  <div className="grid grid-cols-3 md:grid-cols-9 gap-2 mb-4">
                    {Object.entries(customResult.rawScores).map(([type, score]) => (
                      <div key={type} className="text-center">
                        <div className="text-white/60">Type {type}</div>
                        <div className={type === customResult.primaryType ? 'text-yellow-400 font-bold' : 'text-white/80'}>
                          {score as number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Validation Buttons */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Validation Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <button
                onClick={() => {
                  const result = determinePersonalityType([0, 0, 0, 0, 0, 0, 0, 0, 0]);
                  console.log("Type 5 Test:", result);
                  alert(`Type 5 Test: Got Type ${result.primaryType} (${Math.round(result.confidence * 100)}% confidence)`);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Test Type 5 Pattern
              </button>
              
              <button
                onClick={() => {
                  const result = determinePersonalityType([2, 2, 1, 2, 2, 2, 2, 2, 2]);
                  console.log("Type 8 Test:", result);
                  alert(`Type 8 Test: Got Type ${result.primaryType} (${Math.round(result.confidence * 100)}% confidence)`);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Test Type 8 Pattern
              </button>
              
              <button
                onClick={() => {
                  const result = determineWing("6", 1);
                  console.log("Wing Test:", result);
                  alert(`Wing Test: Type 6 Selection 1 = Wing ${result.wing}`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Test Wing Calculation
              </button>
              
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Open browser console (F12) to see detailed test output and validation results.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlgorithmTest;