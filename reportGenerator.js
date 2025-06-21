const { parseAssessmentData } = require('./assessmentParser');
const { generatePersonalityContent } = require('./contentGenerator');
const { injectContentIntoTemplate } = require('./templateInjector');

async function generateCompleteReport(rawAssessmentData) {
  try {
    const parsedData = parseAssessmentData(rawAssessmentData);
    const contentData = await generatePersonalityContent(parsedData);
    const finalReport = injectContentIntoTemplate(contentData);
    
    return { success: true, report: finalReport };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { generateCompleteReport };