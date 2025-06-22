import { readFileSync, writeFileSync } from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000
});

// Remaining two configurations
const remainingConfigs = [
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
Generate comprehensive content for a Challenger ${config.wing} personality with ${config.destructivePercentage}% destructive state and ${config.goodPercentage}% good state. This personality has ${config.dominantSubtype} dominant subtype and ${config.blindSubtype} blind subtype.

Create a JSON object with these exact fields:
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
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    temperature: 0.7,
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}

function injectContentIntoTemplate(content, config) {
  let template = readFileSync('./challenger_template.html', 'utf8');
  
  Object.entries(content).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), value);
  });
  
  template = template.replace(/{{personalityName}}/g, `Challenger ${config.wing}`);
  template = template.replace(/{{wingInfluence}}/g, config.wing);
  template = template.replace(/{{confidence}}/g, '85%');
  template = template.replace(/{{destructivePercentage}}/g, config.destructivePercentage);
  template = template.replace(/{{goodPercentage}}/g, config.goodPercentage);
  
  return template;
}

async function generateRemainingReports() {
  for (const config of remainingConfigs) {
    console.log(`Generating ${config.name}...`);
    
    const content = await generateChallengerContent(config);
    const htmlReport = injectContentIntoTemplate(content, config);
    writeFileSync(`${config.name}.html`, htmlReport);
    console.log(`Generated ${config.name}.html (${Math.round(htmlReport.length/1024)}KB)`);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('All remaining Challenger reports completed!');
}

generateRemainingReports();