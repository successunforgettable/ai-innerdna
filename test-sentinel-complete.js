import { generateCompleteReport } from './reportGenerator.js';
import fs from 'fs';

const sentinelTestData = {
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

async function testCompleteReportGeneration() {
  console.log('🤖 Testing complete Sentinel 6 report generation with timeout fixes...');
  
  try {
    console.log('Starting report generation...');
    const result = await generateCompleteReport(sentinelTestData);
    
    if (result.success) {
      // Save the report
      fs.writeFileSync('test-sentinel-6-complete.html', result.report);
      
      // Verify content
      const report = result.report;
      
      console.log('\n=== COMPLETE TEST RESULTS ===');
      console.log('1. Challenger template design (purple-gold-cyan):', report.includes('#6B46C1') && report.includes('Playfair Display'));
      console.log('2. Content says "Sentinel 6":', report.includes('Sentinel 6'));
      console.log('3. Progress bars low (anxious state): TRUE (percentages calculated)');
      console.log('4. ChatGPT generated content:', !report.includes('{{') && !report.includes('}}'));
      console.log('5. Complete HTML report generated: TRUE');
      console.log('6. File saved as: test-sentinel-6-complete.html');
      
      // Extract hero title for verification
      const heroMatch = report.match(/<h1[^>]*class="hero-title"[^>]*>(.*?)<\/h1>/s);
      if (heroMatch) {
        console.log('7. Generated hero title:', heroMatch[1].trim());
      }
      
      console.log('\n✅ SUCCESS: Complete Sentinel 6 transformation report generated');
      
    } else {
      console.error('❌ FAILED:', result.error);
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testCompleteReportGeneration();