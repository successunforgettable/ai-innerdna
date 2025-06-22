import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000
});

// Three Challenger configurations
const challengerConfigs = [
  {
    name: 'challenger-7-destructive-sexual',
    personalityType: 8,
    wing: 7,
    destructivePercentage: 90,
    goodPercentage: 10,
    dominantSubtype: 'Sexual',
    blindSubtype: 'Social',
    title: 'The Sexual Challenger: Destructive Dominance Path'
  },
  {
    name: 'challenger-9-destructive-social', 
    personalityType: 9,
    wing: 8,
    destructivePercentage: 90,
    goodPercentage: 10,
    dominantSubtype: 'Social',
    blindSubtype: 'Sexual',
    title: 'The Social Challenger: Destructive Control Path'
  },
  {
    name: 'challenger-7-good-sexual',
    personalityType: 8,
    wing: 7,
    destructivePercentage: 10,
    goodPercentage: 90,
    dominantSubtype: 'Sexual',
    blindSubtype: 'Social', 
    title: 'The Sexual Challenger: Constructive Leadership Path'
  }
];

async function generateChallengerContent(config) {
  const prompt = `
ROLE: You are an expert personality transformation coach creating content for a personalized transformation report.

CONTEXT: Generate comprehensive content for a Challenger ${config.wing} personality with ${config.destructivePercentage}% destructive state and ${config.goodPercentage}% good state. This personality has ${config.dominantSubtype} dominant subtype and ${config.blindSubtype} blind subtype.

PERSONALITY PROFILE:
- Core Type: Challenger ${config.wing}
- State Distribution: ${config.destructivePercentage}% destructive, ${config.goodPercentage}% good
- Subtype Pattern: ${config.dominantSubtype} dominant, ${config.blindSubtype} blind
- Confidence Level: 85%

REQUIRED JSON STRUCTURE:
Generate exactly these 15 key content sections as a JSON object:

{
  "heroTitle": "${config.title}",
  "brainHeartMessage": "CONTROL DEPENDENCY DETECTED - Your brain craves dominance while your heart seeks authentic connection",
  "heroDescription": "Comprehensive description of this specific Challenger pattern (150+ words)",
  "currentChallenge": "Primary challenge this personality faces with this state distribution",
  "transformationPath": "Key transformation opportunity based on subtype and state pattern",
  "coreStrength": "Primary strength of this Challenger configuration",
  "hiddenWeakness": "Core vulnerability specific to this pattern",
  "relationshipPattern": "How this person approaches relationships with this subtype dominance",
  "careerGuidance": "Career advice tailored to this specific configuration",
  "dailyPractice": "Specific daily practice for this Challenger type",
  "stage1": "First transformation stage description",
  "stage5": "Middle transformation stage description", 
  "stage11": "Final transformation stage description",
  "testimonial1": "Success story from someone with similar pattern",
  "wheelFinances": "Financial life description for this configuration"
}

Generate authentic, personalized content that reflects the specific combination of Challenger ${config.wing}, ${config.destructivePercentage}% destructive state, and ${config.dominantSubtype} dominant subtype. Make each section detailed and specific to this exact personality configuration.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    let content = response.choices[0].message.content;
    
    // Clean markdown formatting if present
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error generating content for ${config.name}:`, error);
    return null;
  }
}

function injectContentIntoTemplate(content, config) {
  let template = readFileSync('./challenger_template.html', 'utf8');
  
  // Inject the generated content into template
  Object.entries(content).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), value);
  });
  
  // Replace any remaining basic placeholders
  template = template.replace(/{{personalityName}}/g, `Challenger ${config.wing}`);
  template = template.replace(/{{wingInfluence}}/g, config.wing);
  template = template.replace(/{{confidence}}/g, '85%');
  template = template.replace(/{{destructivePercentage}}/g, config.destructivePercentage);
  template = template.replace(/{{goodPercentage}}/g, config.goodPercentage);
  
  return template;
}

async function generateAllChallengerReports() {
  console.log('🎯 Generating 3 Challenger transformation reports...\n');
  
  for (const config of challengerConfigs) {
    console.log(`📝 Generating ${config.name}...`);
    
    const content = await generateChallengerContent(config);
    if (content) {
      const htmlReport = injectContentIntoTemplate(content, config);
      writeFileSync(`${config.name}.html`, htmlReport);
      console.log(`✅ Generated ${config.name}.html (${Math.round(htmlReport.length/1024)}KB)`);
    } else {
      console.log(`❌ Failed to generate ${config.name}`);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 All Challenger reports generated successfully!');
}

generateAllChallengerReports();