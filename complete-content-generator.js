import OpenAI from 'openai';
import fs from 'fs';

async function generateCompleteContent(parsedData) {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000
  });

  console.log('Generating complete content for all 131 placeholders...');
  
  const requiredPlaceholders = JSON.parse(fs.readFileSync('./required_placeholders.json', 'utf8'));
  
  // Split into manageable chunks to avoid API timeouts
  const chunks = [
    // Chunk 1: Core content (17 fields)
    [
      'PERSONALITY_TYPE', 'HERO_SUBTITLE', 'HERO_JOURNEY_TEXT',
      'STAGE1_OPENING', 'STAGE2_OPENING', 'STAGE3_OPENING', 'STAGE4_OPENING',
      'STAT1_DESCRIPTION', 'STAT2_DESCRIPTION',
      'WARNING_TEXT', 'INSIGHT_TEXT', 'INVITATION_TEXT',
      'TRANSFORMATION_SUMMARY', 'CRITICAL_CHOICE_TEXT', 'CHOICE_MOTIVATION',
      'FINAL_CALL_TO_ACTION', 'INCREDIBLE_YOU_TEXT'
    ],
    
    // Chunk 2: Cards 1-11 (22 fields)
    [
      'CARD1_TITLE', 'CARD1_DESCRIPTION', 'CARD2_TITLE', 'CARD2_DESCRIPTION',
      'CARD3_TITLE', 'CARD3_DESCRIPTION', 'CARD4_TITLE', 'CARD4_DESCRIPTION',
      'CARD5_TITLE', 'CARD5_DESCRIPTION', 'CARD6_TITLE', 'CARD6_DESCRIPTION',
      'CARD7_TITLE', 'CARD7_DESCRIPTION', 'CARD8_TITLE', 'CARD8_DESCRIPTION',
      'CARD9_TITLE', 'CARD9_DESCRIPTION', 'CARD10_TITLE', 'CARD10_DESCRIPTION',
      'CARD11_TITLE', 'CARD11_DESCRIPTION'
    ],
    
    // Chunk 3: Cards 12-22 (22 fields)
    [
      'CARD12_TITLE', 'CARD12_DESCRIPTION', 'CARD13_TITLE', 'CARD13_DESCRIPTION',
      'CARD14_TITLE', 'CARD14_DESCRIPTION', 'CARD15_TITLE', 'CARD15_DESCRIPTION',
      'CARD16_TITLE', 'CARD16_DESCRIPTION', 'CARD17_TITLE', 'CARD17_DESCRIPTION',
      'CARD18_TITLE', 'CARD18_DESCRIPTION', 'CARD19_TITLE', 'CARD19_DESCRIPTION',
      'CARD20_TITLE', 'CARD20_DESCRIPTION', 'CARD21_TITLE', 'CARD21_DESCRIPTION',
      'CARD22_TITLE', 'CARD22_DESCRIPTION'
    ],
    
    // Chunk 4: Testimonials (14 fields)
    [
      'TESTIMONIAL1_QUOTE', 'TESTIMONIAL1_AUTHOR', 'TESTIMONIAL2_QUOTE', 'TESTIMONIAL2_AUTHOR',
      'TESTIMONIAL3_QUOTE', 'TESTIMONIAL3_AUTHOR', 'TESTIMONIAL4_QUOTE', 'TESTIMONIAL4_AUTHOR',
      'TESTIMONIAL5_QUOTE', 'TESTIMONIAL5_AUTHOR', 'TESTIMONIAL6_QUOTE', 'TESTIMONIAL6_AUTHOR',
      'TESTIMONIAL7_QUOTE', 'TESTIMONIAL7_AUTHOR'
    ],
    
    // Chunk 5: Timeline (12 fields)
    [
      'TIMELINE1_TITLE', 'TIMELINE1_DESCRIPTION', 'TIMELINE2_TITLE', 'TIMELINE2_DESCRIPTION',
      'TIMELINE3_TITLE', 'TIMELINE3_DESCRIPTION', 'TIMELINE4_TITLE', 'TIMELINE4_DESCRIPTION',
      'TIMELINE5_TITLE', 'TIMELINE5_DESCRIPTION', 'TIMELINE6_TITLE', 'TIMELINE6_DESCRIPTION'
    ],
    
    // Chunk 6: Before/After states (16 fields)
    [
      'BEFORE1', 'BEFORE2', 'BEFORE3', 'BEFORE4',
      'AFTER1', 'AFTER2', 'AFTER3', 'AFTER4',
      'RESURRECTION_BEFORE1', 'RESURRECTION_BEFORE2', 'RESURRECTION_BEFORE3', 'RESURRECTION_BEFORE4',
      'RESURRECTION_AFTER1', 'RESURRECTION_AFTER2', 'RESURRECTION_AFTER3', 'RESURRECTION_AFTER4'
    ],
    
    // Chunk 7: Remaining stages and final content (12 fields)
    [
      'STAGE5_OPENING', 'STAGE6_OPENING', 'STAGE7_OPENING', 'STAGE8_OPENING',
      'STAGE9_OPENING', 'STAGE10_OPENING', 'STAGE11_OPENING',
      'MOTIVATIONAL_QUOTE', 'FINAL_CHOICE_TEXT', 'FINAL_ENCOURAGEMENT',
      'FINAL_TRANSFORMATION_TEXT', 'WARNING_COMPLETION_TEXT'
    ]
  ];

  const allContent = {};

  // Generate content for each chunk
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Generating chunk ${i + 1}/${chunks.length} (${chunks[i].length} fields)...`);
    
    const chunkFields = chunks[i];
    const chunkPrompt = `Generate ${parsedData.personalityName} transformation content for these exact fields. Use "Sentinel 6" terminology, never "Enneagram". Return valid JSON:

{
${chunkFields.map(field => `  "${field}": "[appropriate ${parsedData.personalityName} content for ${field}]"`).join(',\n')}
}

Keep each field under 100 words. Generate personality-specific content for ${parsedData.dominantState.name} state patterns.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: chunkPrompt }],
        max_tokens: 1500,
        temperature: 0.7
      });
      
      const chunkContent = JSON.parse(response.choices[0].message.content);
      Object.assign(allContent, chunkContent);
      
      console.log(`✓ Chunk ${i + 1} completed`);
      
      // Brief pause between chunks to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error in chunk ${i + 1}:`, error.message);
      // Continue with next chunk
    }
  }

  // Generate wheel percentages using ChatGPT (16 fields)
  console.log('Generating wheel percentages via ChatGPT...');
  const wheelPrompt = `Generate wheel of life percentages for ${parsedData.personalityName} in ${parsedData.dominantState.name} state. Return JSON with realistic percentages (BEFORE: 15-40%, AFTER: 75-95%):

{
  "WHEEL_CAREER_BEFORE": "[percentage number only]",
  "WHEEL_FINANCES_BEFORE": "[percentage number only]", 
  "WHEEL_RELATIONSHIPS_BEFORE": "[percentage number only]",
  "WHEEL_MENTAL_BEFORE": "[percentage number only]",
  "WHEEL_PHYSICAL_BEFORE": "[percentage number only]",
  "WHEEL_SOCIAL_BEFORE": "[percentage number only]",
  "WHEEL_ENVIRONMENT_BEFORE": "[percentage number only]",
  "WHEEL_GROWTH_BEFORE": "[percentage number only]",
  "WHEEL_CAREER_AFTER": "[percentage number only]",
  "WHEEL_FINANCES_AFTER": "[percentage number only]",
  "WHEEL_RELATIONSHIPS_AFTER": "[percentage number only]",
  "WHEEL_MENTAL_AFTER": "[percentage number only]",
  "WHEEL_PHYSICAL_AFTER": "[percentage number only]",
  "WHEEL_SOCIAL_AFTER": "[percentage number only]",
  "WHEEL_ENVIRONMENT_AFTER": "[percentage number only]",
  "WHEEL_GROWTH_AFTER": "[percentage number only]"
}`;

  try {
    const wheelResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: wheelPrompt }],
      max_tokens: 500,
      temperature: 0.7
    });
    
    const wheelContent = JSON.parse(wheelResponse.choices[0].message.content);
    Object.assign(allContent, wheelContent);
    console.log('✓ Wheel percentages generated by ChatGPT');
    
  } catch (error) {
    console.error('Error generating wheel percentages:', error.message);
  }

  console.log(`✓ Complete content generation finished`);
  console.log(`Generated content for ${Object.keys(allContent).length} placeholders`);
  console.log(`Required: ${requiredPlaceholders.length} placeholders`);
  
  // Check for missing placeholders and generate via ChatGPT
  const missing = requiredPlaceholders.filter(p => !allContent[p]);
  if (missing.length > 0) {
    console.log(`Missing placeholders: ${missing.join(', ')}`);
    console.log('Generating missing content via ChatGPT...');
    
    const missingPrompt = `Generate ${parsedData.personalityName} transformation content for these missing fields. Return JSON:

{
${missing.map(field => `  "${field}": "[appropriate ${parsedData.personalityName} content]"`).join(',\n')}
}`;

    try {
      const missingResponse = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: missingPrompt }],
        max_tokens: 800,
        temperature: 0.7
      });
      
      const missingContent = JSON.parse(missingResponse.choices[0].message.content);
      Object.assign(allContent, missingContent);
      console.log('✓ Missing content generated by ChatGPT');
      
    } catch (error) {
      console.error('Error generating missing content:', error.message);
    }
  }

  return allContent;
}

export { generateCompleteContent };