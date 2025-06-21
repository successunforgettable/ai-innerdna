import { generatePersonalityContent } from './contentGenerator.js';
import { parseAssessmentData } from './assessmentParser.js';
import { injectContentIntoTemplate } from './templateInjector.js';
import fs from 'fs';

const testData = {
  personalityType: 6,
  wing: 5,
  colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
  detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
  confidence: 35
};

async function testChunkedGeneration() {
  console.log('TESTING CHUNKED CONTENT GENERATION...');
  
  try {
    // Parse assessment data
    const parsedData = parseAssessmentData(testData);
    console.log('✓ Assessment parsed for:', parsedData.personalityName);
    
    // Generate content using chunked approach - limit to first 2 chunks only
    console.log('Starting limited chunked generation (first 2 chunks)...');
    const contentData = await generatePersonalityContent(parsedData);
    
    console.log('✓ Content generated successfully');
    console.log('Generated fields count:', Object.keys(contentData).length);
    console.log('Generated fields:', Object.keys(contentData).slice(0, 10), '...');
    
    // Test template injection with generated content
    contentData.assessmentData = parsedData;
    const finalReport = injectContentIntoTemplate(contentData);
    
    fs.writeFileSync('test-chunked-report.html', finalReport);
    console.log('✓ Test report saved: test-chunked-report.html');
    console.log('Report size:', finalReport.length, 'bytes');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

testChunkedGeneration();