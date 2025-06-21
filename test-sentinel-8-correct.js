import { generateCompleteReport } from './reportGenerator.js';
import fs from 'fs';

// Exact Sentinel 8 assessment data
const sentinelAssessmentData = {
  personalityType: 6,
  wing: 7,
  colorStates: [
    { name: "Destructive", percentage: 60 },
    { name: "Good", percentage: 40 }
  ],
  detailTokens: {
    sexual: 7,
    social: 2,
    selfPreservation: 1
  },
  confidence: 35
};

async function testSentinelCorrectGeneration() {
  console.log('🤖 Testing ChatGPT-only Sentinel 8 generation...');
  
  try {
    const result = await generateCompleteReport(sentinelAssessmentData);
    
    if (result.success) {
      // Save the report
      fs.writeFileSync('test-sentinel-8-correct.html', result.report);
      console.log('✅ ChatGPT-generated Sentinel 8 report saved');
      console.log('📊 Data should show: 60% destructive, 35% confidence, low wheel scores');
    } else {
      console.error('❌ Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSentinelCorrectGeneration();