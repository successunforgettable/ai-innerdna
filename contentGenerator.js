// Content Generator - API CALLS TO CHATGPT ONLY
// NO CONTENT CREATION BY THIS FILE - ONLY API MECHANICS
// ALL CONTENT CREATED BY CHATGPT VIA API KEY

const OpenAI = require('openai');

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generatePersonalityContent(parsedAssessmentData) {
  // NO CONTENT CREATION - ONLY API CALL TO CHATGPT
  // ChatGPT creates ALL content using API key
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are ChatGPT creating personality transformation content. Generate comprehensive content for this specific personality profile. Use Inner DNA terminology only. Include personalized elements based on the assessment data provided.`
        },
        {
          role: "user",
          content: `Generate transformation report content for:
          
Personality: ${parsedAssessmentData.personalityType}
Confidence: ${parsedAssessmentData.confidence}%
Wing: ${parsedAssessmentData.wing}
Primary State: ${parsedAssessmentData.primaryState?.state} (${parsedAssessmentData.primaryState?.percentage}%)
Secondary State: ${parsedAssessmentData.secondaryState?.state} (${parsedAssessmentData.secondaryState?.percentage}%)
Dominant Subtype: ${parsedAssessmentData.dominantSubtype}
Blind Subtype: ${parsedAssessmentData.blindSubtype}

Return JSON with complete content for all sections.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    // Return ChatGPT's generated content
    return JSON.parse(response.choices[0].message.content);
    
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw new Error('Failed to generate content via ChatGPT API');
  }
}

// NO CONTENT CREATION - ONLY API INTERFACE
module.exports = { generatePersonalityContent };