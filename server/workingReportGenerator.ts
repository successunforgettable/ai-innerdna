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
    console.log('🤖 Calling ChatGPT API for expanded content generation...');
    
    const prompt = `You are an expert personality transformation coach creating a comprehensive hero's journey report for a ${data.personalityType} - ${data.personalityName} with ${data.dominantSubtype} subtype.

CRITICAL: Respond ONLY with valid JSON containing the exact field names specified below. Do not include any markdown formatting, explanations, or additional text.

User Profile:
- Personality Type: ${data.personalityType} - ${data.personalityName}
- Primary Mood State: ${data.dominantState?.name} (${data.dominantState?.percentage}%)
- Secondary Mood State: ${data.secondaryState?.name} (${data.secondaryState?.percentage}%)
- Subtype: ${data.dominantSubtype}

Generate content for these 45 fields in valid JSON format:

{
  "PERSONALITY_TYPE": "Type ${data.personalityType} - ${data.personalityName}",
  "HERO_SUBTITLE": "Your Hero's Path to Heart-Brain Mastery",
  
  "STAGE1_OPENING": "Compelling opening about their ordinary world struggles",
  "STAGE2_OPENING": "Discovery of heart-brain disconnect revelation", 
  "STAGE3_OPENING": "Resistance to vulnerability and change",
  "STAGE4_OPENING": "Meeting The Incredible You mentorship system",
  "STAGE5_OPENING": "Crossing threshold into transformation",
  "STAGE6_OPENING": "Facing tests and trials during journey",
  "STAGE7_OPENING": "Core ordeal and breakthrough moment",
  "STAGE8_OPENING": "Reward of heart-brain coherence achieved",
  "STAGE9_OPENING": "Integration into real-world leadership",
  "STAGE10_OPENING": "Complete resurrection and transformation",
  "STAGE11_OPENING": "Return with gift of authentic leadership",
  
  "CARD1_TITLE": "Taking Charge",
  "CARD1_DESCRIPTION": "Leadership burden they carry secretly",
  "CARD2_TITLE": "Being the Strong One", 
  "CARD2_DESCRIPTION": "Strength others rely on but feels unsupported",
  "CARD3_TITLE": "Wanting Peace",
  "CARD3_DESCRIPTION": "Inner conflict between action and harmony",
  "CARD4_TITLE": "Push and Pause",
  "CARD4_DESCRIPTION": "Tension between moving forward and holding back",
  "CARD5_TITLE": "Tense Relationships",
  "CARD5_DESCRIPTION": "Defensive patterns creating distance",
  "CARD6_TITLE": "Low Emotional Bandwidth", 
  "CARD6_DESCRIPTION": "Running on empty emotionally",
  "CARD7_TITLE": "Chronic Restlessness",
  "CARD7_DESCRIPTION": "Constant unsettled feeling despite achievements",
  "CARD8_TITLE": "Control-Based Decisions",
  "CARD8_DESCRIPTION": "Choosing power over intuition and wisdom",
  
  "TESTIMONIAL1_QUOTE": "Authentic quote about realizing heart-brain disconnect",
  "TESTIMONIAL1_AUTHOR": "Sarah M., ${data.personalityName} Graduate",
  "TESTIMONIAL2_QUOTE": "Quote about breakthrough in transformation process", 
  "TESTIMONIAL2_AUTHOR": "Marcus T., CEO & ${data.personalityName} Graduate",
  "TESTIMONIAL3_QUOTE": "Quote about leading from presence not pressure",
  "TESTIMONIAL3_AUTHOR": "Jennifer L., ${data.personalityName} Graduate",
  
  "WHEEL_CAREER_BEFORE": "Respected but not fulfilled leadership reality",
  "WHEEL_CAREER_AFTER": "Leading from presence with effortless influence",
  "WHEEL_FINANCES_BEFORE": "Self-reliant provider with constant money pressure", 
  "WHEEL_FINANCES_AFTER": "Clear financial decisions with calm confidence",
  "WHEEL_RELATIONSHIPS_BEFORE": "Leading but not feeling emotionally safe",
  "WHEEL_RELATIONSHIPS_AFTER": "Creating safety and connection, attracting followers",
  "WHEEL_MENTAL_BEFORE": "Constantly alert mind but tired and pressured",
  "WHEEL_MENTAL_AFTER": "Sharp clarity without pressure, calm assertiveness",
  "WHEEL_PHYSICAL_BEFORE": "Chronic tension, sleep issues, power mode stuck on",
  "WHEEL_PHYSICAL_AFTER": "Improved sleep, dissolved stress, body supporting mission",
  "WHEEL_SOCIAL_BEFORE": "Selective connections feeling like burdens", 
  "WHEEL_SOCIAL_AFTER": "Softened presence attracting deeper trust and quality",
  
  "WARNING_TEXT": "Most people stop here. Insight without integration leads to more frustration.",
  "INSIGHT_TEXT": "You now have insight. But transformation requires action.",
  "INVITATION_TEXT": "Trust inner calm over external control. Receive help as power, not weakness."
}

Generate exactly this structure with appropriate content for ${data.personalityName}. Return ONLY the complete JSON object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000, // Increased from 1500 to 3000 for expanded content
      temperature: 0.7
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
    const expectedKeys = 45; // Updated for expanded content generation
    const actualKeys = Object.keys(parsedContent).length;
    
    console.log(`📊 Content coverage: ${actualKeys}/${expectedKeys} placeholders generated`);
    console.log('📝 Generated content keys:', Object.keys(parsedContent));
    
    if (actualKeys < expectedKeys) {
      const missingKeys = ['STAGE5_OPENING', 'STAGE6_OPENING', 'STAGE7_OPENING', 'CARD5_TITLE', 'CARD6_TITLE', 'WHEEL_FINANCES_BEFORE', 'WHEEL_PHYSICAL_BEFORE'].filter(key => !parsedContent[key]);
      console.log('⚠️ Incomplete response, missing keys:', missingKeys);
    }
    
    return parsedContent;
  } catch (error) {
    console.error('❌ ChatGPT API Error:', error);
    throw new Error(`ChatGPT API failed: ${error}`);
  }
}