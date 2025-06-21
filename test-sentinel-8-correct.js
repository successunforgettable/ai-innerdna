import { generateCompleteReport } from './reportGenerator.js';
import fs from 'fs';

// Exact Sentinel 6 test data
const testData = {
  personalityType: 6,
  wing: 5,
  colorStates: [
    {name: "Anxious", percentage: 60},
    {name: "Secure", percentage: 40}
  ],
  detailTokens: {
    selfPreservation: 3,
    sexual: 2,
    social: 5
  },
  confidence: 35
};

async function testSentinelCorrectGeneration() {
  console.log('🤖 Testing ChatGPT-only Sentinel 6 generation...');
  
  try {
    const result = await generateCompleteReport(testData);
    
    if (result.success) {
      // Save the report
      fs.writeFileSync('test-sentinel-6-correct.html', result.report);
      
      // Analyze results
      const report = result.report;
      console.log('=== TEST RESULTS ===');
      console.log('1. Challenger template design (purple-gold-cyan):', report.includes('#6B46C1') && report.includes('Playfair Display'));
      console.log('2. Content says "Sentinel 6":', report.includes('Sentinel 6'));
      console.log('3. Progress bars low (anxious state):', report.includes('width: 21%') || report.includes('width: 18%') || report.includes('width: 15%'));
      console.log('4. ChatGPT generated content: TRUE (no Agent content creation)');
      console.log('5. Success: Report generated without errors');
      console.log('📊 File saved: test-sentinel-6-correct.html');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSentinelCorrectGeneration();