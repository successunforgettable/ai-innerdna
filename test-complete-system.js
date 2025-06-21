import { parseAssessmentData } from './assessmentParser.js';
import { generateCompleteContent } from './complete-content-generator.js';
import { injectContentIntoTemplate } from './templateInjector.js';
import { calculateProgressPercentages } from './calculateProgressPercentages.js';
import fs from 'fs';

async function testCompleteSystem() {
  console.log('TESTING COMPLETE SYSTEM WITH ALL 131 PLACEHOLDERS...');
  
  try {
    const testData = {
      personalityType: 6,
      wing: 5,
      colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
      detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
      confidence: 35
    };
    
    // Step 1: Parse assessment data
    console.log('1. Parsing assessment data...');
    const parsedData = parseAssessmentData(testData);
    console.log(`✓ Assessment parsed for: ${parsedData.personalityName}`);
    
    // Step 2: Calculate progress percentages
    console.log('2. Calculating progress percentages...');
    const percentages = calculateProgressPercentages(parsedData);
    console.log(`✓ Progress percentages calculated: Career ${percentages.before.career}%`);
    
    // Step 3: Generate complete content via ChatGPT
    console.log('3. Generating complete content via ChatGPT for all 131 placeholders...');
    const completeContent = await generateCompleteContent(parsedData);
    console.log(`✓ Complete content generated: ${Object.keys(completeContent).length} fields`);
    
    // Step 4: Prepare final content object
    console.log('4. Preparing final content object...');
    const finalContent = {
      ...completeContent,
      assessmentData: parsedData
    };
    
    // Step 5: Inject content into template
    console.log('5. Injecting content into challenger template...');
    const finalReport = injectContentIntoTemplate(finalContent);
    
    // Step 6: Save and verify
    console.log('6. Saving complete report...');
    fs.writeFileSync('complete-system-test.html', finalReport);
    
    console.log('✓ COMPLETE SYSTEM TEST SUCCESSFUL');
    console.log(`Report size: ${finalReport.length} bytes`);
    console.log(`Content fields: ${Object.keys(completeContent).length}`);
    console.log('Saved as: complete-system-test.html');
    
    // Verify no placeholders remain
    const remainingPlaceholders = finalReport.match(/\{\{[^}]+\}\}/g) || [];
    if (remainingPlaceholders.length === 0) {
      console.log('✓ ALL PLACEHOLDERS SUCCESSFULLY REPLACED');
    } else {
      console.log(`⚠ ${remainingPlaceholders.length} placeholders remain:`, remainingPlaceholders.slice(0, 5));
    }
    
  } catch (error) {
    console.error('✗ Complete system test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testCompleteSystem();