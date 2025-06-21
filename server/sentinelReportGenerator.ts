import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable must be set");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SentinelProfile {
  destructivePercentage: number;
  goodPercentage: number;
  dominantSubtype: 'sexual' | 'social' | 'selfPreservation';
  blindSubtype: 'sexual' | 'social' | 'selfPreservation';
}

export async function generateSentinel8Content(profile: SentinelProfile) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert Inner DNA personality analyst generating transformation report content for a Sentinel 8 personality type. 

CRITICAL REQUIREMENTS:
- Generate content for ALL placeholders in the Challenger template
- Use Inner DNA terminology (NO Enneagram terms like "Type 8", "Challenger", etc.)
- Focus on transformation and growth themes
- Match the heroic journey narrative structure
- Include brain-heart disconnect messaging
- Respond ONLY in JSON format with placeholder mappings

Sentinel 8 Profile:
- ${profile.destructivePercentage}% destructive state, ${profile.goodPercentage}% constructive state
- ${profile.dominantSubtype} dominant subtype
- ${profile.blindSubtype} blind spot subtype

Brain-heart disconnect: "CONTROL DEPENDENCY DETECTED"`
        },
        {
          role: "user", 
          content: `Generate personalized content for this Sentinel 8 profile. Return JSON with these exact placeholders:

{
  "HERO_TITLE": "transformation journey title",
  "BRAIN_HEART_DISCONNECT": "CONTROL DEPENDENCY DETECTED",
  "HERO_SUBTITLE": "subtitle about control to protection",
  "CHALLENGE_DESCRIPTION": "current challenge description",
  "STAGE_1_TITLE": "stage 1 title",
  "STAGE_1_DESCRIPTION": "stage 1 description",
  "STAGE_2_TITLE": "stage 2 title", 
  "STAGE_2_DESCRIPTION": "stage 2 description",
  "STAGE_3_TITLE": "stage 3 title",
  "STAGE_3_DESCRIPTION": "stage 3 description",
  "TESTIMONIAL_1_TEXT": "testimonial text",
  "TESTIMONIAL_1_AUTHOR": "testimonial author",
  "TESTIMONIAL_2_TEXT": "testimonial text",
  "TESTIMONIAL_2_AUTHOR": "testimonial author",
  "LIFE_AREA_1_TITLE": "life area title",
  "LIFE_AREA_1_DESCRIPTION": "life area description",
  "LIFE_AREA_2_TITLE": "life area title",
  "LIFE_AREA_2_DESCRIPTION": "life area description",
  "LIFE_AREA_3_TITLE": "life area title", 
  "LIFE_AREA_3_DESCRIPTION": "life area description",
  "TRANSFORMATION_OVERVIEW": "transformation summary",
  "NEXT_STEPS": "concrete next steps"
}

Make it highly personalized for this specific Sentinel 8 state distribution and subtype pattern.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000
    });

    const contentData = JSON.parse(response.choices[0].message.content || '{}');
    return contentData;
  } catch (error) {
    console.error('Error generating Sentinel 8 content:', error);
    throw new Error('Failed to generate Sentinel 8 content');
  }
}