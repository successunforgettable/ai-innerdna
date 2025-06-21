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
    
    const prompt = `Create comprehensive transformation report content for ${data.personalityName} with ${data.dominantState?.percentage}% ${data.dominantState?.name} state and ${data.dominantSubtype} subtype focus.

You must generate content for ALL 26 placeholders below. Return complete JSON with actual content (not placeholder text):

{
  "PERSONALITY_TYPE": "${data.personalityName}",
  "HERO_SUBTITLE": "actual transformation tagline here",
  "STAGE1_OPENING": "actual current reality paragraph for ${data.personalityName}",
  "STAGE1_DESCRIPTION": "detailed current state analysis paragraph",
  "STAGE2_OPENING": "call to adventure paragraph",
  "STAGE3_OPENING": "refusal of call paragraph", 
  "STAGE4_OPENING": "meeting mentor paragraph",
  "CARD1_TITLE": "primary challenge title",
  "CARD1_DESCRIPTION": "15-30 word challenge description",
  "CARD2_TITLE": "core pattern title",
  "CARD2_DESCRIPTION": "15-30 word pattern description",
  "CARD3_TITLE": "emotional state title", 
  "CARD3_DESCRIPTION": "15-30 word emotional description",
  "CARD4_TITLE": "behavioral pattern title",
  "CARD4_DESCRIPTION": "15-30 word behavioral description",
  "TESTIMONIAL1_QUOTE": "20-40 word transformation quote",
  "TESTIMONIAL1_AUTHOR": "Name, Professional Title",
  "TESTIMONIAL2_QUOTE": "20-40 word breakthrough quote", 
  "TESTIMONIAL2_AUTHOR": "Name, Professional Title",
  "TESTIMONIAL3_QUOTE": "20-40 word results quote",
  "TESTIMONIAL3_AUTHOR": "Name, Professional Title",
  "WHEEL_CAREER_BEFORE": "current career state description",
  "WHEEL_CAREER_AFTER": "transformed career state description",
  "WHEEL_RELATIONSHIPS_BEFORE": "current relationship patterns",
  "WHEEL_RELATIONSHIPS_AFTER": "transformed relationship approach",
  "WHEEL_MENTAL_BEFORE": "current mental state with ${data.dominantState?.name}",
  "WHEEL_MENTAL_AFTER": "transformed mental clarity description",
  "WARNING_TEXT": "warning about staying stuck in ${data.dominantState?.name} patterns",
  "INSIGHT_TEXT": "key transformation insight for ${data.personalityName}",
  "INVITATION_TEXT": "invitation to transform ${data.dominantState?.name} into strength",
  "TRANSFORMATION_SUMMARY": "complete transformation summary",
  "MOTIVATIONAL_QUOTE": "inspiring motivational quote",
  "CRITICAL_CHOICE_TEXT": "critical decision moment text",
  "FINAL_CALL_TO_ACTION": "final compelling action statement"
}

Generate ALL 32 fields with real content. Return only valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 8000,
      temperature: 0.7
    });

    const content = completion.choices[0].message.content || '{}';
    console.log('✅ ChatGPT API response received, content length:', content.length);
    console.log('Raw content preview:', content.substring(0, 200));
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```')) {
      // Remove markdown code block markers
      jsonContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    }
    
    // Clean up any remaining formatting issues
    jsonContent = jsonContent.trim();
    
    console.log('Cleaned JSON preview:', jsonContent.substring(0, 200));
    
    const parsedContent = JSON.parse(jsonContent);
    console.log('📝 Generated content keys:', Object.keys(parsedContent));
    
    return parsedContent;
  } catch (error) {
    console.error('❌ ChatGPT API Error:', error);
    throw new Error(`ChatGPT API failed: ${error}`);
  }
}