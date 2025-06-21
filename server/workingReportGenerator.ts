import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000
});

interface AssessmentData {
  personalityType: number;
  personalityName?: string;
  colorStates: Array<{name: string; percentage: number}>;
  detailTokens: {selfPreservation: number; sexual: number; social: number};
  dominantState?: {name: string; percentage: number};
  secondaryState?: {name: string; percentage: number};
  dominantSubtype?: string;
}

export async function generateWorkingReport(assessmentData?: Partial<AssessmentData>): Promise<string> {
  // Assessment data processing (technical only)
  const testData: AssessmentData = {
    personalityType: 6,
    personalityName: "Sentinel 6",
    colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
    detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
    dominantState: {name: "Anxious", percentage: 60},
    secondaryState: {name: "Secure", percentage: 40},
    dominantSubtype: "Social",
    ...assessmentData
  };

  // ChatGPT generates ALL content via API
  console.log('Starting ChatGPT content generation for:', testData.personalityName);
  const contentData = await generateContentViaAPI(testData);
  console.log('Content generation completed, proceeding with template injection');
  
  // Technical template injection only
  const template = fs.readFileSync('./challenger_template.html', 'utf8');
  let html = template;
  
  Object.keys(contentData).forEach(key => {
    html = html.replaceAll(`{{${key}}}`, contentData[key]);
  });

  const filename = 'sentinel-6-working.html';
  fs.writeFileSync(filename, html);
  return path.resolve(filename);
}

async function generateContentViaAPI(data: AssessmentData): Promise<Record<string, string>> {
  try {
    console.log('🤖 Calling ChatGPT API for content generation...');
    
    const prompt = `You are generating content for a ${data.personalityName} transformation report. You MUST generate ALL of these exact fields:

REQUIRED JSON STRUCTURE (generate ALL fields):
{
  "PERSONALITY_TYPE": "${data.personalityName}",
  "HERO_SUBTITLE": "transformation tagline here",
  "STAGE1_OPENING": "current reality description here",
  "STAGE1_DESCRIPTION": "detailed analysis here", 
  "STAGE2_OPENING": "call to adventure here",
  "STAGE3_OPENING": "refusal description here",
  "STAGE4_OPENING": "mentor meeting here",
  "CARD1_TITLE": "primary challenge title",
  "CARD1_DESCRIPTION": "15-30 word description",
  "CARD2_TITLE": "core pattern title",
  "CARD2_DESCRIPTION": "15-30 word description", 
  "CARD3_TITLE": "emotional state title",
  "CARD3_DESCRIPTION": "15-30 word description",
  "CARD4_TITLE": "behavioral pattern title", 
  "CARD4_DESCRIPTION": "15-30 word description",
  "TESTIMONIAL1_QUOTE": "20-40 word testimonial quote",
  "TESTIMONIAL1_AUTHOR": "Name, Professional Title",
  "TESTIMONIAL2_QUOTE": "20-40 word testimonial quote", 
  "TESTIMONIAL2_AUTHOR": "Name, Professional Title",
  "TESTIMONIAL3_QUOTE": "20-40 word testimonial quote",
  "TESTIMONIAL3_AUTHOR": "Name, Professional Title",
  "WHEEL_CAREER_BEFORE": "current career state",
  "WHEEL_CAREER_AFTER": "transformed career state",
  "WHEEL_RELATIONSHIPS_BEFORE": "current relationship patterns",
  "WHEEL_RELATIONSHIPS_AFTER": "transformed relationships",
  "WHEEL_MENTAL_BEFORE": "current mental state with ${data.dominantState?.name}",
  "WHEEL_MENTAL_AFTER": "transformed mental clarity",
  "WARNING_TEXT": "warning about staying stuck",
  "INSIGHT_TEXT": "key transformation insight", 
  "INVITATION_TEXT": "invitation to transform"
}

Generate exactly this structure with appropriate ${data.personalityName} content. Return ONLY the complete JSON object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000, // Increased token limit
      temperature: 0.5  // Lower temperature for more consistent structure
    });

    const content = completion.choices[0].message.content || '{}';
    console.log('✅ ChatGPT API response received, content length:', content.length);
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```')) {
      // Remove markdown code block markers
      jsonContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    }
    
    // Clean up any remaining formatting issues
    jsonContent = jsonContent.trim();
    
    // Add validation to ensure all expected keys are present
    const parsedContent = JSON.parse(jsonContent);
    const expectedKeys = 28; // Total expected keys
    const actualKeys = Object.keys(parsedContent).length;
    
    console.log(`📊 Content coverage: ${actualKeys}/${expectedKeys} placeholders generated`);
    console.log('📝 Generated content keys:', Object.keys(parsedContent));
    
    if (actualKeys < expectedKeys) {
      console.log('⚠️ Incomplete response, missing keys:', 
        ['STAGE2_OPENING', 'STAGE3_OPENING', 'STAGE4_OPENING'].filter(key => !parsedContent[key]));
    }
    
    return parsedContent;
  } catch (error) {
    console.error('❌ ChatGPT API Error:', error);
    throw new Error(`ChatGPT API failed: ${error}`);
  }
}