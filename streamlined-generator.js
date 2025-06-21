import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000
});

async function generateStreamlinedContent(parsedData) {
  console.log('Generating streamlined content for essential placeholders...');
  
  // Generate only essential visible content via ChatGPT
  const essentialPrompt = `Generate content for ${parsedData.personalityName} transformation report. Use "Sentinel 6" terminology, never "Enneagram". Return JSON:

{
  "PERSONALITY_TYPE": "${parsedData.personalityName}",
  "HERO_SUBTITLE": "Your Path from ${parsedData.dominantState.name} to Transformation",
  "STAGE1_OPENING": "Current reality description for ${parsedData.personalityName} with ${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} state",
  "STAGE2_OPENING": "Awakening stage for ${parsedData.personalityName}",
  "STAGE3_OPENING": "Transformation stage progression",
  "CARD1_TITLE": "Primary Challenge",
  "CARD1_DESCRIPTION": "Main challenge description for ${parsedData.personalityName}",
  "CARD2_TITLE": "Core Pattern", 
  "CARD2_DESCRIPTION": "Core ${parsedData.dominantState.name} pattern description",
  "CARD3_TITLE": "Growth Path",
  "CARD3_DESCRIPTION": "Path to security and growth",
  "TESTIMONIAL1_QUOTE": "Transformation testimonial quote about ${parsedData.personalityName} journey",
  "TESTIMONIAL1_AUTHOR": "Professional Name, ${parsedData.personalityName}",
  "WARNING_TEXT": "Critical message about ${parsedData.dominantState.name} patterns",
  "INSIGHT_TEXT": "Key insight for ${parsedData.personalityName} transformation",
  "TRANSFORMATION_SUMMARY": "Complete transformation summary for ${parsedData.personalityName}",
  "MOTIVATIONAL_QUOTE": "Inspiring quote for ${parsedData.personalityName} journey"
}

Keep each field under 100 words. Focus on ${parsedData.personalityName}-specific content.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: essentialPrompt }],
    max_tokens: 1500,
    temperature: 0.7
  });

  const essentialContent = JSON.parse(completion.choices[0].message.content);
  console.log('✓ Essential content generated via ChatGPT');
  
  // Add systematic fallback content for remaining placeholders
  console.log('Generating systematic fallbacks...');
  const fallbackContent = generateFallbacks(parsedData);
  
  const allContent = { ...essentialContent, ...fallbackContent };
  console.log(`✓ Complete content prepared: ${Object.keys(allContent).length} fields`);
  
  return allContent;
}

function generateFallbacks(parsedData) {
  const fallbacks = {};
  
  // Generate systematic fallbacks for all missing placeholders
  // Cards 4-22
  for (let i = 4; i <= 22; i++) {
    fallbacks[`CARD${i}_TITLE`] = `${parsedData.personalityName} Pattern ${i}`;
    fallbacks[`CARD${i}_DESCRIPTION`] = `Key insight for ${parsedData.personalityName} development and growth.`;
  }
  
  // Stages 4-11
  for (let i = 4; i <= 11; i++) {
    fallbacks[`STAGE${i}_OPENING`] = `Stage ${i} of the ${parsedData.personalityName} transformation journey.`;
  }
  
  // Testimonials 2-7
  for (let i = 2; i <= 7; i++) {
    fallbacks[`TESTIMONIAL${i}_QUOTE`] = `The ${parsedData.personalityName} transformation approach really worked for me.`;
    fallbacks[`TESTIMONIAL${i}_AUTHOR`] = `${i === 2 ? 'Alex' : i === 3 ? 'Jordan' : i === 4 ? 'Casey' : i === 5 ? 'Morgan' : i === 6 ? 'Taylor' : 'Riley'} K.`;
  }
  
  // Timeline entries
  for (let i = 1; i <= 6; i++) {
    fallbacks[`TIMELINE${i}_TITLE`] = `Transformation Milestone ${i}`;
    fallbacks[`TIMELINE${i}_DESCRIPTION`] = `Key progress marker in your ${parsedData.personalityName} journey.`;
  }
  
  // Before/After states
  for (let i = 1; i <= 4; i++) {
    fallbacks[`BEFORE${i}`] = `${parsedData.dominantState.name} state pattern ${i}`;
    fallbacks[`AFTER${i}`] = `Transformed secure state pattern ${i}`;
    fallbacks[`RESURRECTION_BEFORE${i}`] = `Previous ${parsedData.dominantState.name} limitation ${i}`;
    fallbacks[`RESURRECTION_AFTER${i}`] = `New empowered state ${i}`;
  }
  
  // Wheel percentages (realistic values based on state)
  const beforeRange = parsedData.dominantState.name === 'Anxious' ? [15, 40] : [30, 55];
  const afterRange = [75, 95];
  
  const wheelAreas = ['CAREER', 'FINANCES', 'RELATIONSHIPS', 'MENTAL', 'PHYSICAL', 'SOCIAL', 'ENVIRONMENT', 'GROWTH'];
  wheelAreas.forEach(area => {
    fallbacks[`WHEEL_${area}_BEFORE`] = Math.round(Math.random() * (beforeRange[1] - beforeRange[0]) + beforeRange[0]).toString();
    fallbacks[`WHEEL_${area}_AFTER`] = Math.round(Math.random() * (afterRange[1] - afterRange[0]) + afterRange[0]).toString();
  });
  
  // Other essential fields
  fallbacks['HERO_JOURNEY_TEXT'] = `Your complete ${parsedData.personalityName} transformation journey awaits.`;
  fallbacks['INVITATION_TEXT'] = `Step into your transformed ${parsedData.personalityName} life today.`;
  fallbacks['CRITICAL_CHOICE_TEXT'] = `Choose growth over ${parsedData.dominantState.name} patterns.`;
  fallbacks['CHOICE_MOTIVATION'] = `Your future ${parsedData.personalityName} self depends on this decision.`;
  fallbacks['FINAL_CALL_TO_ACTION'] = `Begin your ${parsedData.personalityName} transformation now.`;
  fallbacks['FINAL_CHOICE_TEXT'] = `The choice for transformation is yours.`;
  fallbacks['FINAL_ENCOURAGEMENT'] = `You have everything needed for ${parsedData.personalityName} success.`;
  fallbacks['FINAL_TRANSFORMATION_TEXT'] = `Your ${parsedData.personalityName} transformation is complete.`;
  fallbacks['INCREDIBLE_YOU_TEXT'] = `You are an incredible ${parsedData.personalityName} with unlimited potential.`;
  fallbacks['WARNING_COMPLETION_TEXT'] = `Complete your ${parsedData.personalityName} transformation journey.`;
  fallbacks['STAT1_DESCRIPTION'] = `${parsedData.confidence}% assessment confidence level achieved.`;
  fallbacks['STAT2_DESCRIPTION'] = `${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} state identified.`;
  
  return fallbacks;
}

export { generateStreamlinedContent };