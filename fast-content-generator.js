import OpenAI from 'openai';

async function generateFastContent(parsedData) {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 20000  // 20 seconds
  });

  console.log('Generating essential content only...');

  const prompt = `Generate essential transformation content for ${parsedData.personalityName}. Use "Sentinel 6" terminology, never "Enneagram". Return JSON:

{
  "PERSONALITY_TYPE": "${parsedData.personalityName}",
  "HERO_TITLE": "The ${parsedData.personalityName} Transformation Journey",
  "HERO_SUBTITLE": "Your Path from ${parsedData.dominantState.name} to Security",
  "STAGE1_OPENING": "You are living with ${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} state patterns",
  "STAGE2_OPENING": "Your transformation journey begins now",
  "STAGE3_OPENING": "Breaking through limiting patterns",
  "CARD1_TITLE": "Core Challenge",
  "CARD1_DESCRIPTION": "${parsedData.personalityName} primary challenge description",
  "CARD2_TITLE": "Growth Path", 
  "CARD2_DESCRIPTION": "Your path to transformation",
  "TESTIMONIAL1_QUOTE": "This journey changed everything for me",
  "TESTIMONIAL1_AUTHOR": "Sarah M., ${parsedData.personalityName}",
  "WARNING_TEXT": "Your ${parsedData.dominantState.name} patterns are holding you back",
  "INSIGHT_TEXT": "Transform your ${parsedData.dominantState.name} state into security",
  "TRANSFORMATION_SUMMARY": "Complete ${parsedData.personalityName} transformation journey",
  "ASSESSMENT_SUMMARY": "${parsedData.dominantState.percentage}% ${parsedData.dominantState.name}, ${parsedData.secondaryState.percentage}% ${parsedData.secondaryState.name}, ${parsedData.dominantSubtype} focus"
}

Keep responses under 50 words per field. Return only valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7
    });
    
    const content = JSON.parse(response.choices[0].message.content);
    
    // Fill remaining placeholders with generic content to prevent template errors
    const allPlaceholders = {
      ...content,
      "STAGE4_OPENING": "Taking decisive action",
      "STAGE5_OPENING": "Mastering new patterns", 
      "STAGE6_OPENING": "Integration and growth",
      "STAGE7_OPENING": "Critical transformation moment",
      "STAGE8_OPENING": "Your new reality emerges",
      "STAGE9_OPENING": "Complete transformation achieved",
      "CARD3_TITLE": "Inner Strength",
      "CARD3_DESCRIPTION": "Building resilience and confidence",
      "CARD4_TITLE": "New Perspective",
      "CARD4_DESCRIPTION": "Seeing opportunities in challenges",
      "CARD5_TITLE": "Daily Practice",
      "CARD5_DESCRIPTION": "Consistent growth habits",
      "CARD6_TITLE": "Support Network",
      "CARD6_DESCRIPTION": "Building meaningful connections",
      "CARD7_TITLE": "Skill Development",
      "CARD7_DESCRIPTION": "Mastering new abilities",
      "CARD8_TITLE": "Mindset Shift",
      "CARD8_DESCRIPTION": "Transforming limiting beliefs",
      "CARD9_TITLE": "Action Steps",
      "CARD9_DESCRIPTION": "Concrete next moves",
      "CARD10_TITLE": "Progress Tracking",
      "CARD10_DESCRIPTION": "Measuring transformation",
      "CARD11_TITLE": "Integration",
      "CARD11_DESCRIPTION": "Making changes permanent",
      "CARD12_TITLE": "New Identity",
      "CARD12_DESCRIPTION": "Embodying your transformed self",
      "TESTIMONIAL2_QUOTE": "The insights were life-changing",
      "TESTIMONIAL2_AUTHOR": "Michael R.",
      "TESTIMONIAL3_QUOTE": "I found my true strength",
      "TESTIMONIAL3_AUTHOR": "Jennifer L.",
      "TESTIMONIAL4_QUOTE": "My relationships improved dramatically",
      "TESTIMONIAL4_AUTHOR": "David K.",
      "TESTIMONIAL5_QUOTE": "I feel confident and secure now",
      "TESTIMONIAL5_AUTHOR": "Lisa T.",
      "MOTIVATIONAL_QUOTE": "Your transformation is inevitable when you commit to growth",
      "CRITICAL_CHOICE_TEXT": "Choose growth over comfort",
      "CHOICE_MOTIVATION": "Your future self depends on this decision",
      "INVITATION_TEXT": "Step into your transformed life today"
    };
    
    console.log('✓ Fast content generation completed');
    console.log('Generated fields:', Object.keys(allPlaceholders).length);
    
    return allPlaceholders;
    
  } catch (error) {
    console.error('Fast content generation failed:', error.message);
    throw error;
  }
}

export { generateFastContent };