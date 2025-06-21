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

async function callOpenAI(prompt) {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000  // 30 seconds per chunk
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,  // Smaller token limit per chunk
    temperature: 0.7
  });
  
  return JSON.parse(response.choices[0].message.content);
}

async function generateContentInChunks(parsedData) {
  console.log('Starting chunked content generation...');
  const contentData = {};
  
  try {
    // Chunk 1: Hero section content
    console.log('Generating hero section...');
    const heroPrompt = `Generate hero section content for ${parsedData.personalityName} with ${parsedData.dominantState.name} state. Use "Sentinel 6" terminology, never "Enneagram". Return JSON:
    {
      "PERSONALITY_TYPE": "${parsedData.personalityName}",
      "HERO_TITLE": "The ${parsedData.personalityName} Transformation Journey",
      "HERO_SUBTITLE": "Your Path from ${parsedData.dominantState.name} to Security"
    }`;
    
    const heroContent = await callOpenAI(heroPrompt);
    Object.assign(contentData, heroContent);
    
    // Chunk 2: Stage openings
    console.log('Generating stage openings...');
    const stagePrompt = `Generate stage opening content for ${parsedData.personalityName} transformation journey. Return JSON:
    {
      "STAGE1_OPENING": "Opening text for current reality stage",
      "STAGE2_OPENING": "Opening text for awakening stage", 
      "STAGE3_OPENING": "Opening text for transformation stage",
      "STAGE4_OPENING": "Opening text for action stage",
      "STAGE5_OPENING": "Opening text for mastery stage",
      "STAGE6_OPENING": "Opening text for integration stage",
      "STAGE7_OPENING": "Opening text for choice stage",
      "STAGE8_OPENING": "Opening text for results stage",
      "STAGE9_OPENING": "Opening text for completion stage"
    }`;
    
    const stageContent = await callOpenAI(stagePrompt);
    Object.assign(contentData, stageContent);
    
    // Chunk 3: Challenge cards 1-6
    console.log('Generating challenge cards 1-6...');
    const cards1Prompt = `Generate challenge card content for ${parsedData.personalityName}. Return JSON:
    {
      "CARD1_TITLE": "Challenge card 1 title",
      "CARD1_DESCRIPTION": "Challenge card 1 description",
      "CARD2_TITLE": "Challenge card 2 title", 
      "CARD2_DESCRIPTION": "Challenge card 2 description",
      "CARD3_TITLE": "Challenge card 3 title",
      "CARD3_DESCRIPTION": "Challenge card 3 description",
      "CARD4_TITLE": "Challenge card 4 title",
      "CARD4_DESCRIPTION": "Challenge card 4 description",
      "CARD5_TITLE": "Growth card 5 title",
      "CARD5_DESCRIPTION": "Growth card 5 description",
      "CARD6_TITLE": "Growth card 6 title",
      "CARD6_DESCRIPTION": "Growth card 6 description"
    }`;
    
    const cards1Content = await callOpenAI(cards1Prompt);
    Object.assign(contentData, cards1Content);
    
    // Chunk 4: Challenge cards 7-12
    console.log('Generating challenge cards 7-12...');
    const cards2Prompt = `Generate more card content for ${parsedData.personalityName}. Return JSON:
    {
      "CARD7_TITLE": "Growth card 7 title",
      "CARD7_DESCRIPTION": "Growth card 7 description",
      "CARD8_TITLE": "Growth card 8 title",
      "CARD8_DESCRIPTION": "Growth card 8 description",
      "CARD9_TITLE": "Transformation card 9 title",
      "CARD9_DESCRIPTION": "Transformation card 9 description",
      "CARD10_TITLE": "Transformation card 10 title",
      "CARD10_DESCRIPTION": "Transformation card 10 description",
      "CARD11_TITLE": "Transformation card 11 title",
      "CARD11_DESCRIPTION": "Transformation card 11 description",
      "CARD12_TITLE": "Action card 12 title",
      "CARD12_DESCRIPTION": "Action card 12 description"
    }`;
    
    const cards2Content = await callOpenAI(cards2Prompt);
    Object.assign(contentData, cards2Content);
    
    // Chunk 5: Testimonials and quotes
    console.log('Generating testimonials...');
    const testimonialsPrompt = `Generate testimonial content for ${parsedData.personalityName} transformation. Return JSON:
    {
      "TESTIMONIAL1_QUOTE": "First testimonial quote about transformation",
      "TESTIMONIAL1_AUTHOR": "First testimonial author name",
      "TESTIMONIAL2_QUOTE": "Second testimonial quote",
      "TESTIMONIAL2_AUTHOR": "Second testimonial author",
      "TESTIMONIAL3_QUOTE": "Third testimonial quote",
      "TESTIMONIAL3_AUTHOR": "Third testimonial author",
      "TESTIMONIAL4_QUOTE": "Fourth testimonial quote",
      "TESTIMONIAL4_AUTHOR": "Fourth testimonial author",
      "TESTIMONIAL5_QUOTE": "Fifth testimonial quote",
      "TESTIMONIAL5_AUTHOR": "Fifth testimonial author",
      "MOTIVATIONAL_QUOTE": "Inspirational quote for journey"
    }`;
    
    const testimonialsContent = await callOpenAI(testimonialsPrompt);
    Object.assign(contentData, testimonialsContent);
    
    // Chunk 6: Assessment and final content
    console.log('Generating final content...');
    const finalPrompt = `Generate final content for ${parsedData.personalityName}. Return JSON:
    {
      "ASSESSMENT_SUMMARY": "${parsedData.dominantState.percentage}% ${parsedData.dominantState.name}, ${parsedData.secondaryState.percentage}% ${parsedData.secondaryState.name}, ${parsedData.dominantSubtype} focus",
      "TRANSFORMATION_SUMMARY": "Complete transformation summary",
      "WARNING_TEXT": "Important warning message",
      "INSIGHT_TEXT": "Key insight for transformation",
      "INVITATION_TEXT": "Invitation to take action",
      "CRITICAL_CHOICE_TEXT": "Critical choice description",
      "CHOICE_MOTIVATION": "Motivation for making the choice"
    }`;
    
    const finalContent = await callOpenAI(finalPrompt);
    Object.assign(contentData, finalContent);
    
    console.log('✓ Chunked content generation completed');
    console.log('Generated fields:', Object.keys(contentData).length);
    
    return contentData;
    
  } catch (error) {
    console.error('Error in chunked generation:', error.message);
    throw error;
  }
}

async function generateContent(parsedData) {
  return await generateContentInChunks(parsedData);
}

async function generatePersonalityContent(parsedData) {
  return await generateContentWithRetry(parsedData);
}

export { generatePersonalityContent };