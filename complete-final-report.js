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
    timeout: 60000
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
            resolve(parsed.choices[0].message.content);
          } else {
            reject(new Error('Invalid OpenAI response structure'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(data);
    req.end();
  });
}

async function generateFinalReport() {
  const personalityData = {
    personalityType: "Challenger 7",
    stateDistribution: "90% good, 10% destructive", 
    subtype: "Sexual dominant, Social blind",
    confidence: 88
  };
  
  const prompt = `
ROLE: You are an expert personality transformation coach creating content for a personalized transformation report.

PERSONALITY DATA:
- Personality: ${personalityData.personalityType}
- State Distribution: ${personalityData.stateDistribution}
- Subtype Pattern: ${personalityData.subtype}
- Confidence Level: ${personalityData.confidence}%

CONTENT REQUIREMENTS:
Create comprehensive transformation content using approved Inner DNA terminology. Generate content for ALL the following placeholders:

BASIC INFO:
1. PERSONALITY_TYPE: "${personalityData.personalityType}"
2. HERO_TITLE: Create engaging transformation title
3. BRAIN_HEART_DISCONNECT: Specific disconnect message for this personality
4. CHALLENGE_DESCRIPTION: Core personality challenge description
5. TRANSFORMATION_OVERVIEW: Complete transformation journey overview

HERO'S JOURNEY STAGES (11 stages):
6. STAGE1: Stage 1 description
7. STAGE2: Stage 2 description
8. STAGE3: Stage 3 description
9. STAGE4: Stage 4 description
10. STAGE5: Stage 5 description
11. STAGE6: Stage 6 description
12. STAGE7: Stage 7 description
13. STAGE8: Stage 8 description
14. STAGE9: Stage 9 description
15. STAGE10: Stage 10 description
16. STAGE11: Stage 11 description

CHALLENGE CARDS (8 cards):
17. CARD1: Challenge card 1 content
18. CARD2: Challenge card 2 content
19. CARD3: Challenge card 3 content
20. CARD4: Challenge card 4 content
21. CARD5: Challenge card 5 content
22. CARD6: Challenge card 6 content
23. CARD7: Challenge card 7 content
24. CARD8: Challenge card 8 content

LIFE AREAS:
25. CAREER_CONTENT: Career transformation content
26. RELATIONSHIP_CONTENT: Relationship transformation content
27. HEALTH_CONTENT: Health transformation content
28. FINANCIAL_CONTENT: Financial transformation content

TESTIMONIALS:
29. TESTIMONIAL1: First person testimonial
30. TESTIMONIAL2: Second person testimonial
31. TESTIMONIAL3: Third person testimonial

INSTRUCTIONS:
- Use only approved Inner DNA language
- No "Enneagram" terminology
- Personalize based on state distribution and subtype
- Make content authentic and transformational
- Each piece should be 2-4 sentences

Provide response in this exact JSON format:
{
  "PERSONALITY_TYPE": "content here",
  "HERO_TITLE": "content here",
  [continue for all 31 fields]
}`;

  try {
    console.log('🔄 Processing final Challenger 7 Good report...');
    console.log('Generating content for Challenger 7 Good...');
    
    const response = await callOpenAI(prompt);
    
    // Parse JSON response
    let contentData;
    try {
      contentData = JSON.parse(response);
    } catch (parseError) {
      // If JSON parsing fails, extract JSON from markdown
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse JSON from response');
      }
    }
    
    console.log(`✅ Generated ${Object.keys(contentData).length} content fields`);
    
    // Inject content into template
    const templatePath = 'challenger_template.html';
    const outputPath = 'challenger-7-good-sexual.html';
    
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Replace all placeholders with generated content
    for (const [key, value] of Object.entries(contentData)) {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), value);
    }
    
    fs.writeFileSync(outputPath, template);
    console.log(`✅ Report created: ${outputPath}`);
    console.log('✅ Successfully fixed challenger-7-good-sexual.html');
    console.log('\n🎯 All Challenger reports are now complete with ChatGPT content!');
    
  } catch (error) {
    console.error(`❌ Failed to process final report:`, error.message);
  }
}

// Run the final report generation
generateFinalReport().catch(console.error);