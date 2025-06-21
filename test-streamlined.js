import { parseAssessmentData } from './assessmentParser.js';
import { generateStreamlinedContent } from './streamlined-generator.js';
import { injectContentIntoTemplate } from './templateInjector.js';
import fs from 'fs';

async function testStreamlined() {
  console.log('TESTING STREAMLINED CONTENT GENERATOR...');
  
  try {
    const testData = {
      personalityType: 6,
      wing: 5,
      colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
      detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
      confidence: 35
    };
    
    // Parse assessment data
    console.log('1. Parsing assessment data...');
    const parsedData = parseAssessmentData(testData);
    console.log(`✓ Assessment parsed for: ${parsedData.personalityName}`);
    
    // Generate streamlined content
    console.log('2. Generating streamlined content...');
    const content = await generateStreamlinedContent(parsedData);
    
    // Add assessment data
    content.assessmentData = parsedData;
    
    // Inject into template
    console.log('3. Injecting content into template...');
    const finalReport = injectContentIntoTemplate(content);
    
    // Save report
    const filename = 'streamlined-test-report.html';
    fs.writeFileSync(filename, finalReport);
    
    console.log('✓ STREAMLINED TEST SUCCESSFUL');
    console.log(`Report size: ${finalReport.length} bytes`);
    console.log(`Content fields: ${Object.keys(content).length}`);
    console.log(`Saved as: ${filename}`);
    
    // Check placeholder replacement
    const remainingPlaceholders = finalReport.match(/\{\{[^}]+\}\}/g) || [];
    if (remainingPlaceholders.length === 0) {
      console.log('✓ ALL PLACEHOLDERS SUCCESSFULLY REPLACED');
    } else {
      console.log(`⚠ ${remainingPlaceholders.length} placeholders remain:`, remainingPlaceholders.slice(0, 5));
    }
    
    return {
      success: true,
      reportSize: finalReport.length,
      contentFields: Object.keys(content).length,
      remainingPlaceholders: remainingPlaceholders.length
    };
    
  } catch (error) {
    console.error('✗ Streamlined test failed:', error.message);
    return { success: false, error: error.message };
  }
}

testStreamlined();