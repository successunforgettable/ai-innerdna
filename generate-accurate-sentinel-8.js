import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ACTUAL SENTINEL 8 ASSESSMENT DATA
const sentinelData = {
  personalityType: "The Sentinel",
  destructiveState: 60,
  goodState: 40,
  confidence: 35, // Realistic confidence for destructive state
  subtype: "Sexual dominant with social blind spots",
  wheelOfLife: {
    career: 25, // Low scores appropriate for destructive state
    relationships: 30,
    health: 35,
    spirituality: 20,
    personalGrowth: 25,
    finances: 30
  }
};

async function generateAccurateSentinelContent() {
  console.log('🤖 Generating accurate Sentinel 8 content via ChatGPT...');
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are creating personalized transformation report content for The Sentinel personality type. 

CRITICAL ASSESSMENT DATA - USE THESE EXACT NUMBERS:
- 60% destructive state, 40% good state
- 35% confidence level (realistic for destructive state)
- Sexual dominant subtype with social blind spots
- Wheel of Life scores: Career 25%, Relationships 30%, Health 35%, Spirituality 20%, Personal Growth 25%, Finances 30%

CONTROL DEPENDENCY DETECTED - Include this brain-heart disconnect message.

Generate content that reflects someone struggling with control issues, protective intensity, and destructive patterns. Do NOT use high confidence levels or unrealistic wheel scores.

Format as JSON with these exact keys:
{
  "heroTitle": "Title for hero section",
  "heroSubtitle": "Subtitle describing journey",
  "stage1Title": "Current Reality section title", 
  "stage1Description": "Detailed description of current state with exact percentages",
  "assessmentSummary": "Summary with exact confidence and subtype data",
  "brainHeartMessage": "CONTROL DEPENDENCY DETECTED message",
  "wheelOfLifeDescription": "Description matching the low scores provided"
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = JSON.parse(response.choices[0].message.content);
    console.log('✅ ChatGPT generated accurate content');
    
    // Read template
    const template = fs.readFileSync('challenger-template-with-placeholders.html', 'utf8');
    
    // Replace placeholders with ChatGPT content
    let report = template
      .replace('{{HERO_TITLE}}', content.heroTitle)
      .replace('{{HERO_SUBTITLE}}', content.heroSubtitle)
      .replace('{{STAGE1_TITLE}}', content.stage1Title)
      .replace('{{STAGE1_DESCRIPTION}}', content.stage1Description)
      .replace('{{ASSESSMENT_SUMMARY}}', content.assessmentSummary);
    
    // Fix statistics with correct numbers
    report = report
      .replace('70%', '60%')
      .replace('30%', '40%')
      .replace('Current Functioning<br>Room for Growth', 'Destructive State<br>Control Patterns')
      .replace('Below Potential<br>Transformation Needed', 'Good State<br>Guardian Potential');
    
    // Add realistic wheel of life scores
    report = report
      .replace('78%', '25%') // Career
      .replace('68%', '30%') // Relationships  
      .replace('48%', '35%') // Health
      .replace('60%', '20%') // Spirituality
      .replace('55%', '25%') // Personal Growth
      .replace('42%', '30%'); // Finances
    
    // Save accurate report
    fs.writeFileSync('sentinel-8-accurate-report.html', report);
    console.log('✅ Accurate Sentinel 8 report saved');
    
    return content;
    
  } catch (error) {
    console.error('❌ Error generating content:', error);
    throw error;
  }
}

// Run if called directly
generateAccurateSentinelContent()
  .then(() => console.log('🎉 Complete!'))
  .catch(console.error);

export { generateAccurateSentinelContent };