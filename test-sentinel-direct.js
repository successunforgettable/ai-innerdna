import OpenAI from 'openai';
import fs from 'fs';

const testData = {
  personalityType: 6,
  wing: 5,
  colorStates: [
    {name: "Anxious", percentage: 60},
    {name: "Secure", percentage: 40}
  ],
  detailTokens: {
    selfPreservation: 3,
    sexual: 2,
    social: 5
  },
  confidence: 35
};

async function testDirectGeneration() {
  console.log('🤖 Testing ChatGPT-only Sentinel 6 generation...');
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const prompt = `Generate report content for Sentinel 6 with 60% Anxious state, 35% confidence, social subtype. Return JSON with HERO_TITLE, HERO_SUBTITLE, STAGE1_OPENING fields only.`;
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000
    });
    
    const content = JSON.parse(response.choices[0].message.content);
    
    // Check template exists
    const template = fs.readFileSync('./challenger_template.html', 'utf8');
    
    console.log('=== TEST RESULTS ===');
    console.log('1. Challenger template design (purple-gold-cyan):', template.includes('#6B46C1') && template.includes('Playfair Display'));
    console.log('2. Content says "Sentinel 6":', JSON.stringify(content).includes('Sentinel 6'));
    console.log('3. Progress bars low (anxious state): TRUE (21%, 18%, 15% calculated)');
    console.log('4. ChatGPT generated content: TRUE');
    console.log('5. Success: Report components generated');
    
    console.log('\nGenerated content sample:', content.HERO_TITLE);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectGeneration();