const OpenAI = require('openai');

async function generatePersonalityContent(parsedData) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Generate content for: ${parsedData.personalityName}, ${parsedData.influence}, ${parsedData.dominantState.name} ${parsedData.dominantState.percentage}%, ${parsedData.secondaryState.name} ${parsedData.secondaryState.percentage}%, ${parsedData.dominantSubtype}. Return JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000
  });
  
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generatePersonalityContent };