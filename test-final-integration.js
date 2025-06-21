import { generateCompleteReport } from './reportGenerator.js';
import fs from 'fs';

// Test different personality types and states
const testCases = [
  {
    name: "Sentinel 6 - Anxious State",
    data: {
      personalityType: 6,
      wing: 5,
      colorStates: [
        {name: "Anxious", percentage: 60},
        {name: "Secure", percentage: 40}
      ],
      detailTokens: { selfPreservation: 3, sexual: 2, social: 5 },
      confidence: 35
    },
    expectedProgress: { career: 21, finances: 18, relationships: 15 }
  },
  {
    name: "Helper 2 - Destructive State", 
    data: {
      personalityType: 2,
      wing: 3,
      colorStates: [
        {name: "Destructive", percentage: 70},
        {name: "Good", percentage: 30}
      ],
      detailTokens: { selfPreservation: 2, sexual: 6, social: 2 },
      confidence: 40
    },
    expectedProgress: { career: 19, finances: 16, relationships: 13 }
  }
];

async function runFinalIntegrationTest() {
  console.log('🔄 Running final integration test for 5-prompt methodology...\n');
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const result = await generateCompleteReport(testCase.data);
      
      if (result.success) {
        const filename = `final-test-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.html`;
        fs.writeFileSync(filename, result.report);
        
        // Verify key elements
        const report = result.report;
        const hasCorrectDesign = report.includes('#6B46C1') && report.includes('Playfair Display');
        const hasPersonalityType = report.includes('Sentinel 6') || report.includes('Helper 2');
        const hasLowProgress = report.includes(`width: ${testCase.expectedProgress.career}%;`);
        const noPlaceholders = !report.includes('{{') && !report.includes('}}');
        
        console.log(`  ✅ Design integrity: ${hasCorrectDesign}`);
        console.log(`  ✅ Personality type: ${hasPersonalityType}`);
        console.log(`  ✅ Dynamic progress: ${hasLowProgress}`);
        console.log(`  ✅ Content complete: ${noPlaceholders}`);
        console.log(`  📄 Saved: ${filename}\n`);
        
      } else {
        console.log(`  ❌ Failed: ${result.error}\n`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log('🎯 Final integration test complete');
}

runFinalIntegrationTest();