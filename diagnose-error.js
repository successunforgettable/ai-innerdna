import { parseAssessmentData } from './assessmentParser.js';
import { generatePersonalityContent } from './contentGenerator.js';
import { calculateProgressPercentages } from './calculateProgressPercentages.js';
import { injectContentIntoTemplate } from './templateInjector.js';
import { generateCompleteReport } from './reportGenerator.js';
import fs from 'fs';

const testData = {
  personalityType: 6,
  wing: 5,
  colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
  detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
  confidence: 35
};

async function diagnoseError() {
  console.log('DIAGNOSING REPORT GENERATION ERROR...');
  
  try {
    // Step 1: Test parsing
    console.log('1. Testing assessment parsing...');
    const parsedData = parseAssessmentData(testData);
    console.log('✓ Parsing successful:', parsedData.personalityName);
    
    // Step 2: Test percentage calculation
    console.log('2. Testing percentage calculation...');
    const percentages = calculateProgressPercentages(parsedData);
    console.log('✓ Percentages calculated:', percentages.before.career + '%');
    
    // Step 3: Test template existence
    console.log('3. Testing template file...');
    const templateExists = fs.existsSync('./challenger_template.html');
    console.log('✓ Template exists:', templateExists);
    
    // Step 4: Test ChatGPT content generation
    console.log('4. Testing ChatGPT content generation...');
    const contentData = await generatePersonalityContent(parsedData);
    console.log('✓ Content generated:', contentData.HERO_TITLE);
    
    // Step 5: Test template injection
    console.log('5. Testing template injection...');
    contentData.assessmentData = parsedData;
    const finalReport = injectContentIntoTemplate(contentData);
    console.log('✓ Template injection successful, size:', finalReport.length);
    
    // Step 6: Test complete flow
    console.log('6. Testing complete report generation...');
    const result = await generateCompleteReport(testData);
    if (result.success) {
      fs.writeFileSync('diagnosis-report.html', result.report);
      console.log('✓ Complete flow successful');
      console.log('✓ Report saved: diagnosis-report.html');
    } else {
      console.log('✗ Complete flow failed:', result.error);
    }
    
  } catch (error) {
    console.log('✗ ERROR DETECTED:', error.message);
    console.log('Stack:', error.stack);
  }
}

diagnoseError();