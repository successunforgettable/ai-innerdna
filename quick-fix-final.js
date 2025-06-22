import fs from 'fs';
import https from 'https';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt) {
  const data = JSON.stringify({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 3000,
    temperature: 0.7
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Length': data.length
    },
    timeout: 30000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed.choices[0].message.content);
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(data);
    req.end();
  });
}

async function fixFinalReport() {
  console.log('Fixing final Challenger 7 Good report...');
  
  const prompt = `Create transformation content for Challenger 7 with 90% good/10% destructive state, sexual dominant subtype. Return JSON with these 31 fields:

{
  "PERSONALITY_TYPE": "Challenger 7",
  "HERO_TITLE": "The Challenger 7 Transformation Journey",
  "BRAIN_HEART_DISCONNECT": "PERFECTIONISM PARALYSIS DETECTED",
  "CHALLENGE_DESCRIPTION": "Core challenge description",
  "TRANSFORMATION_OVERVIEW": "Journey overview",
  "STAGE1": "Stage 1 content",
  "STAGE2": "Stage 2 content",
  "STAGE3": "Stage 3 content",
  "STAGE4": "Stage 4 content",
  "STAGE5": "Stage 5 content",
  "STAGE6": "Stage 6 content",
  "STAGE7": "Stage 7 content",
  "STAGE8": "Stage 8 content",
  "STAGE9": "Stage 9 content",
  "STAGE10": "Stage 10 content",
  "STAGE11": "Stage 11 content",
  "CARD1": "Challenge card 1",
  "CARD2": "Challenge card 2",
  "CARD3": "Challenge card 3",
  "CARD4": "Challenge card 4",
  "CARD5": "Challenge card 5",
  "CARD6": "Challenge card 6",
  "CARD7": "Challenge card 7",
  "CARD8": "Challenge card 8",
  "CAREER_CONTENT": "Career content",
  "RELATIONSHIP_CONTENT": "Relationship content",
  "HEALTH_CONTENT": "Health content",
  "FINANCIAL_CONTENT": "Financial content",
  "TESTIMONIAL1": "Testimonial 1",
  "TESTIMONIAL2": "Testimonial 2",
  "TESTIMONIAL3": "Testimonial 3"
}

Each field should be 2-4 sentences. Use approved Inner DNA language only.`;

  try {
    const response = await callOpenAI(prompt);
    let contentData = JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
    
    let template = fs.readFileSync('challenger_template.html', 'utf8');
    
    for (const [key, value] of Object.entries(contentData)) {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    fs.writeFileSync('challenger-7-good-sexual.html', template);
    console.log('✅ Final report completed successfully!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixFinalReport();