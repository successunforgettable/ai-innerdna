async function generatePersonalityContent(parsedAssessmentData) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{
        role: "system",
        content: `Generate personalized transformation report content for ${parsedAssessmentData.personalityName}.

ASSESSMENT DATA:
- Personality: ${parsedAssessmentData.personalityName}
- Wing Influence: ${parsedAssessmentData.influence}
- Primary State: ${parsedAssessmentData.dominantState.name} (${parsedAssessmentData.dominantState.percentage}%)
- Secondary State: ${parsedAssessmentData.secondaryState.name} (${parsedAssessmentData.secondaryState.percentage}%)
- Dominant Subtype: ${parsedAssessmentData.dominantSubtype}
- Confidence: ${parsedAssessmentData.confidence}%

Generate comprehensive content sections for transformation report. Include specific percentages and personality-specific insights. Return as JSON with all required content sections.`
      }]
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

module.exports = { generatePersonalityContent };