async function generatePersonalizedReport(rawAssessmentData) {
  const { parseAssessmentData } = require('./assessmentParser');
  const { generatePersonalityContent } = require('./contentGenerator');
  const { injectContentIntoTemplate } = require('./templateInjector');
  
  try {
    // Step 1: Parse assessment data
    const parsedData = parseAssessmentData(rawAssessmentData);
    
    // Step 2: Generate content via ChatGPT
    const generatedContent = await generatePersonalityContent(parsedData);
    
    // Step 3: Inject content into template
    const finalReport = injectContentIntoTemplate(generatedContent);
    
    return finalReport;
  } catch (error) {
    console.error('Error generating personalized report:', error);
    throw error;
  }
}

function generateSpecificPersonalityReport(personalityType, stateDistribution, subtype) {
  // This function generates reports for specific personality configurations
  // Used for creating targeted reports like Sentinel 8, Helper 3, etc.
  const mockAssessmentData = {
    personalityType: personalityType,
    wing: personalityType === 8 ? 9 : personalityType + 1,
    colorStates: stateDistribution,
    detailTokens: subtype,
    confidence: 35
  };
  
  return generatePersonalizedReport(mockAssessmentData);
}

module.exports = { generatePersonalizedReport, generateSpecificPersonalityReport };