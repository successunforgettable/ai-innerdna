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
    
    const prompt = `Generate transformation report content for ${data.personalityName}:
    - Dominant state: ${data.dominantState?.name} (${data.dominantState?.percentage}%)
    - Secondary state: ${data.secondaryState?.name} (${data.secondaryState?.percentage}%)
    - Dominant subtype: ${data.dominantSubtype}
    
    Create content for these key placeholders:
    PERSONALITY_TYPE, HERO_SUBTITLE, STAGE1_OPENING, CARD1_TITLE, CARD1_DESCRIPTION, 
    CARD2_TITLE, CARD2_DESCRIPTION, TESTIMONIAL1_QUOTE, TESTIMONIAL1_AUTHOR, 
    WARNING_TEXT, INSIGHT_TEXT, TRANSFORMATION_SUMMARY, MOTIVATIONAL_QUOTE, 
    CRITICAL_CHOICE_TEXT, FINAL_CALL_TO_ACTION
    
    Return valid JSON only with these exact keys.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.7
    });

    const content = completion.choices[0].message.content || '{}';
    console.log('✅ ChatGPT API response received, content length:', content.length);
    
    const parsedContent = JSON.parse(content);
    console.log('📝 Generated content keys:', Object.keys(parsedContent));
    
    return parsedContent;
  } catch (error) {
    console.error('❌ ChatGPT API Error:', error);
    throw new Error(`ChatGPT API failed: ${error}`);
  }
}