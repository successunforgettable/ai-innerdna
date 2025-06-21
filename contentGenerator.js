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

  const prompt = `Generate transformation report content for ${parsedData.personalityName} with ${parsedData.dominantState.name} state (${parsedData.dominantState.percentage}%). 

Style: Professional transformation coach, direct but inspiring. Use "Sentinel 6" terminology, never "Enneagram" or "Type 6".

Return JSON with these exact fields:
{
  "PERSONALITY_TYPE": "${parsedData.personalityName}",
  "HERO_TITLE": "The ${parsedData.personalityName} Transformation Journey",
  "HERO_SUBTITLE": "Your Path from ${parsedData.dominantState.name} to Security",
  "STAGE1_TITLE": "Your Current Reality",
  "STAGE1_DESCRIPTION": "Brief description of ${parsedData.personalityName} ${parsedData.dominantState.name} state patterns",
  "ASSESSMENT_SUMMARY": "Quick summary of ${parsedData.dominantState.percentage}% ${parsedData.dominantState.name}, ${parsedData.secondaryState.percentage}% ${parsedData.secondaryState.name}, ${parsedData.dominantSubtype} focus"
}

Keep responses under 100 words per field. Return only valid JSON.`;

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