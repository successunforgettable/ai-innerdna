import OpenAI from 'openai';

async function generateContentWithRetry(parsedData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`ChatGPT API attempt ${attempt}/${maxRetries}...`);
      const result = await Promise.race([
        generateContent(parsedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout after 45 seconds')), 45000)
        )
      ]);
      console.log(`✅ ChatGPT API successful on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.log(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) throw error;
      console.log(`Retrying in 3 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

async function generateContent(parsedData) {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000  // 60 seconds
  });

  const prompt = `Generate COMPLETE transformation report content for ${parsedData.personalityName} with ${parsedData.dominantState.name} state (${parsedData.dominantState.percentage}%).

CRITICAL: Generate ALL 100+ fields needed for the hero's journey template. Use "Sentinel 6" terminology, never "Enneagram".

Return complete JSON with ALL these fields (use ${parsedData.personalityName} patterns throughout):

{
  "PERSONALITY_TYPE": "${parsedData.personalityName}",
  "HERO_TITLE": "The ${parsedData.personalityName} Transformation Journey", 
  "HERO_SUBTITLE": "Your Path from ${parsedData.dominantState.name} to Security",
  "STAGE1_OPENING": "Opening text for stage 1",
  "STAGE1_TITLE": "Your Current Reality",
  "STAGE1_DESCRIPTION": "${parsedData.personalityName} description",
  "STAT1_DESCRIPTION": "Statistic 1 description",
  "STAT2_DESCRIPTION": "Statistic 2 description",
  "CARD1_TITLE": "Challenge card 1 title",
  "CARD1_DESCRIPTION": "Challenge card 1 description",
  "CARD2_TITLE": "Challenge card 2 title", 
  "CARD2_DESCRIPTION": "Challenge card 2 description",
  "CARD3_TITLE": "Challenge card 3 title",
  "CARD3_DESCRIPTION": "Challenge card 3 description",
  "CARD4_TITLE": "Challenge card 4 title",
  "CARD4_DESCRIPTION": "Challenge card 4 description",
  "WHEEL_CAREER_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_FINANCES_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_RELATIONSHIPS_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_MENTAL_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_PHYSICAL_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_SOCIAL_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_ENVIRONMENT_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "WHEEL_GROWTH_BEFORE": "${Math.round(Math.random() * 30 + 15)}",
  "STAGE2_OPENING": "Stage 2 opening text",
  "CARD5_TITLE": "Growth card 5 title",
  "CARD5_DESCRIPTION": "Growth card 5 description",
  "CARD6_TITLE": "Growth card 6 title",
  "CARD6_DESCRIPTION": "Growth card 6 description", 
  "CARD7_TITLE": "Growth card 7 title",
  "CARD7_DESCRIPTION": "Growth card 7 description",
  "CARD8_TITLE": "Growth card 8 title",
  "CARD8_DESCRIPTION": "Growth card 8 description",
  "TESTIMONIAL1_QUOTE": "First testimonial quote",
  "TESTIMONIAL1_AUTHOR": "First testimonial author",
  "STAGE3_OPENING": "Stage 3 opening text",
  "CARD9_TITLE": "Transformation card 9 title",
  "CARD9_DESCRIPTION": "Transformation card 9 description",
  "CARD10_TITLE": "Transformation card 10 title",
  "CARD10_DESCRIPTION": "Transformation card 10 description",
  "CARD11_TITLE": "Transformation card 11 title", 
  "CARD11_DESCRIPTION": "Transformation card 11 description",
  "BEFORE1": "Before state 1",
  "BEFORE2": "Before state 2",
  "BEFORE3": "Before state 3", 
  "BEFORE4": "Before state 4",
  "AFTER1": "After state 1",
  "AFTER2": "After state 2",
  "AFTER3": "After state 3",
  "AFTER4": "After state 4",
  "WARNING_TEXT": "Warning message",
  "INSIGHT_TEXT": "Key insight text",
  "INVITATION_TEXT": "Invitation message",
  "STAGE4_OPENING": "Stage 4 opening",
  "CARD12_TITLE": "Action card 12 title",
  "CARD12_DESCRIPTION": "Action card 12 description",
  "CARD13_TITLE": "Action card 13 title",
  "CARD13_DESCRIPTION": "Action card 13 description",
  "CARD14_TITLE": "Action card 14 title",
  "CARD14_DESCRIPTION": "Action card 14 description",
  "CARD15_TITLE": "Action card 15 title",
  "CARD15_DESCRIPTION": "Action card 15 description",
  "TESTIMONIAL2_QUOTE": "Second testimonial quote",
  "TESTIMONIAL2_AUTHOR": "Second testimonial author",
  "STAGE5_OPENING": "Stage 5 opening",
  "TIMELINE1_TITLE": "Timeline 1 title",
  "TIMELINE1_DESCRIPTION": "Timeline 1 description",
  "TIMELINE2_TITLE": "Timeline 2 title", 
  "TIMELINE2_DESCRIPTION": "Timeline 2 description",
  "TIMELINE3_TITLE": "Timeline 3 title",
  "TIMELINE3_DESCRIPTION": "Timeline 3 description",
  "MOTIVATIONAL_QUOTE": "Motivational quote",
  "STAGE6_OPENING": "Stage 6 opening",
  "CARD16_TITLE": "Mastery card 16 title",
  "CARD16_DESCRIPTION": "Mastery card 16 description",
  "CARD17_TITLE": "Mastery card 17 title",
  "CARD17_DESCRIPTION": "Mastery card 17 description",
  "CARD18_TITLE": "Mastery card 18 title",
  "CARD18_DESCRIPTION": "Mastery card 18 description", 
  "TESTIMONIAL3_QUOTE": "Third testimonial quote",
  "TESTIMONIAL3_AUTHOR": "Third testimonial author",
  "STAGE7_OPENING": "Stage 7 opening",
  "CRITICAL_CHOICE_TEXT": "Critical choice description",
  "CHOICE_MOTIVATION": "Choice motivation text",
  "TESTIMONIAL4_QUOTE": "Fourth testimonial quote",
  "TESTIMONIAL4_AUTHOR": "Fourth testimonial author",
  "STAGE8_OPENING": "Stage 8 opening",
  "WHEEL_CAREER_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_FINANCES_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_RELATIONSHIPS_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_MENTAL_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_PHYSICAL_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_SOCIAL_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_ENVIRONMENT_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "WHEEL_GROWTH_AFTER": "${Math.round(Math.random() * 30 + 70)}",
  "TESTIMONIAL5_QUOTE": "Fifth testimonial quote",
  "TESTIMONIAL5_AUTHOR": "Fifth testimonial author",
  "STAGE9_OPENING": "Stage 9 opening",
  "TIMELINE4_TITLE": "Timeline 4 title",
  "TIMELINE4_DESCRIPTION": "Timeline 4 description",
  "TIMELINE5_TITLE": "Timeline 5 title",
  "TIMELINE5_DESCRIPTION": "Timeline 5 description", 
  "TIMELINE6_TITLE": "Timeline 6 title",
  "TIMELINE6_DESCRIPTION": "Timeline 6 description",
  "TRANSFORMATION_SUMMARY": "Complete transformation summary",
  "ASSESSMENT_SUMMARY": "${parsedData.dominantState.percentage}% ${parsedData.dominantState.name}, ${parsedData.secondaryState.percentage}% ${parsedData.secondaryState.name}, ${parsedData.dominantSubtype} focus"
}

Generate ALL fields with ${parsedData.personalityName}-specific content. Keep each field under 100 words. Return ONLY valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
    temperature: 0.7
  });
  
  return JSON.parse(response.choices[0].message.content);
}

async function generatePersonalityContent(parsedData) {
  return await generateContentWithRetry(parsedData);
}

export { generatePersonalityContent };