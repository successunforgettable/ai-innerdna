// Report Generator - ORCHESTRATION ONLY, NO CONTENT CREATION
// CONNECTS COMPONENTS: Parser → ChatGPT API → Template Injection
// ALL CONTENT CREATED BY CHATGPT VIA API KEY - NOT THIS FILE

const { parseAssessmentData } = require('./assessmentParser');
const { generatePersonalityContent } = require('./contentGenerator');
const { injectContentIntoTemplate } = require('./templateInjector');

async function generatePersonalizedReport(rawAssessmentData) {
  // NO CONTENT CREATION - ONLY ORCHESTRATION
  // All content comes from ChatGPT via API key
  
  try {
    // Step 1: Parse assessment data (no content creation)
    const parsedData = parseAssessmentData(rawAssessmentData);
    
    // Step 2: Call ChatGPT via API key to generate content
    // ChatGPT creates ALL content - not this file
    const chatgptGeneratedContent = await generatePersonalityContent(parsedData);
    
    // Step 3: Inject ChatGPT's API-generated content into template
    const finalReport = injectContentIntoTemplate(chatgptGeneratedContent);
    
    return finalReport;
    
  } catch (error) {
    console.error('Error in report generation orchestration:', error);
    throw new Error('Failed to orchestrate report generation');
  }
}

function generateSpecificPersonalityReport(personalityType, stateDistribution, subtype) {
  // Orchestration for specific personality profiles
  // NO CONTENT CREATION - only function calls
  
  const specificAssessmentData = {
    primaryType: personalityType,
    colorStates: stateDistribution,
    detailTokens: subtype,
    confidence: 85 // Default confidence
  };
  
  return generatePersonalizedReport(specificAssessmentData);
}

// NO CONTENT CREATION - ONLY ORCHESTRATION FUNCTIONS
module.exports = { 
  generatePersonalizedReport, 
  generateSpecificPersonalityReport 
};