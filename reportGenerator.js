import { parseAssessmentData } from './assessmentParser.js';
import { generatePersonalityContent } from './contentGenerator.js';
import { injectContentIntoTemplate } from './templateInjector.js';

async function generateCompleteReport(rawAssessmentData) {
  try {
    const parsedData = parseAssessmentData(rawAssessmentData);
    const contentData = await generatePersonalityContent(parsedData);
    
    // Add assessment data for percentage calculation
    contentData.assessmentData = parsedData;
    
    const finalReport = injectContentIntoTemplate(contentData);
    
    return { success: true, report: finalReport };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { generateCompleteReport };