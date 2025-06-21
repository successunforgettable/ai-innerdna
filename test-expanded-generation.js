// Test expanded ChatGPT content generation
const https = require('https');

async function testExpandedGeneration() {
  const testData = {
    personalityType: 6,
    personalityName: "Sentinel 6",
    dominantState: { name: "Anxious", percentage: 60 },
    secondaryState: { name: "Secure", percentage: 40 },
    dominantSubtype: "Social"
  };

  const prompt = `You are an expert personality transformation coach creating a comprehensive hero's journey report for a ${testData.personalityType} - ${testData.personalityName} with ${testData.dominantSubtype} subtype.

CRITICAL: Respond ONLY with valid JSON containing the exact field names specified below. Do not include any markdown formatting, explanations, or additional text.

User Profile:
- Personality Type: ${testData.personalityType} - ${testData.personalityName}
- Primary Mood State: ${testData.dominantState?.name} (${testData.dominantState?.percentage}%)
- Secondary Mood State: ${testData.secondaryState?.name} (${testData.secondaryState?.percentage}%)
- Subtype: ${testData.dominantSubtype}

Generate content for these 45 fields in valid JSON format:

{
  "PERSONALITY_TYPE": "Type ${testData.personalityType} - ${testData.personalityName}",
  "HERO_SUBTITLE": "Your Hero's Path to Heart-Brain Mastery",
  
  "STAGE1_OPENING": "Compelling opening about their ordinary world struggles",
  "STAGE2_OPENING": "Discovery of heart-brain disconnect revelation", 
  "STAGE3_OPENING": "Resistance to vulnerability and change",
  "STAGE4_OPENING": "Meeting The Incredible You mentorship system",
  "STAGE5_OPENING": "Crossing threshold into transformation",
  "STAGE6_OPENING": "Facing tests and trials during journey",
  "STAGE7_OPENING": "Core ordeal and breakthrough moment",
  "STAGE8_OPENING": "Reward of heart-brain coherence achieved",
  "STAGE9_OPENING": "Integration into real-world leadership",
  "STAGE10_OPENING": "Complete resurrection and transformation",
  "STAGE11_OPENING": "Return with gift of authentic leadership",
  
  "CARD1_TITLE": "Taking Charge",
  "CARD1_DESCRIPTION": "Leadership burden they carry secretly",
  "CARD2_TITLE": "Being the Strong One", 
  "CARD2_DESCRIPTION": "Strength others rely on but feels unsupported",
  "CARD3_TITLE": "Wanting Peace",
  "CARD3_DESCRIPTION": "Inner conflict between action and harmony",
  "CARD4_TITLE": "Push and Pause",
  "CARD4_DESCRIPTION": "Tension between moving forward and holding back",
  "CARD5_TITLE": "Tense Relationships",
  "CARD5_DESCRIPTION": "Defensive patterns creating distance",
  "CARD6_TITLE": "Low Emotional Bandwidth", 
  "CARD6_DESCRIPTION": "Running on empty emotionally",
  "CARD7_TITLE": "Chronic Restlessness",
  "CARD7_DESCRIPTION": "Constant unsettled feeling despite achievements",
  "CARD8_TITLE": "Control-Based Decisions",
  "CARD8_DESCRIPTION": "Choosing power over intuition and wisdom",
  
  "TESTIMONIAL1_QUOTE": "Authentic quote about realizing heart-brain disconnect",
  "TESTIMONIAL1_AUTHOR": "Sarah M., ${testData.personalityName} Graduate",
  "TESTIMONIAL2_QUOTE": "Quote about breakthrough in transformation process", 
  "TESTIMONIAL2_AUTHOR": "Marcus T., CEO & ${testData.personalityName} Graduate",
  "TESTIMONIAL3_QUOTE": "Quote about leading from presence not pressure",
  "TESTIMONIAL3_AUTHOR": "Jennifer L., ${testData.personalityName} Graduate",
  
  "WHEEL_CAREER_BEFORE": "Respected but not fulfilled leadership reality",
  "WHEEL_CAREER_AFTER": "Leading from presence with effortless influence",
  "WHEEL_FINANCES_BEFORE": "Self-reliant provider with constant money pressure", 
  "WHEEL_FINANCES_AFTER": "Clear financial decisions with calm confidence",
  "WHEEL_RELATIONSHIPS_BEFORE": "Leading but not feeling emotionally safe",
  "WHEEL_RELATIONSHIPS_AFTER": "Creating safety and connection, attracting followers",
  "WHEEL_MENTAL_BEFORE": "Constantly alert mind but tired and pressured",
  "WHEEL_MENTAL_AFTER": "Sharp clarity without pressure, calm assertiveness",
  "WHEEL_PHYSICAL_BEFORE": "Chronic tension, sleep issues, power mode stuck on",
  "WHEEL_PHYSICAL_AFTER": "Improved sleep, dissolved stress, body supporting mission",
  "WHEEL_SOCIAL_BEFORE": "Selective connections feeling like burdens", 
  "WHEEL_SOCIAL_AFTER": "Softened presence attracting deeper trust and quality",
  
  "WARNING_TEXT": "Most people stop here. Insight without integration leads to more frustration.",
  "INSIGHT_TEXT": "You now have insight. But transformation requires action.",
  "INVITATION_TEXT": "Trust inner calm over external control. Receive help as power, not weakness."
}

Generate exactly this structure with appropriate content for ${testData.personalityName}. Return ONLY the complete JSON object.`;

  const data = JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
    temperature: 0.7
  });

  const options = {
    hostname: 'api.openai.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          const content = response.choices[0]?.message?.content;
          
          if (!content) {
            reject(new Error('No content received from OpenAI'));
            return;
          }

          // Parse JSON response
          let jsonContent = content.trim();
          if (jsonContent.includes('```')) {
            jsonContent = jsonContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          }

          const parsedContent = JSON.parse(jsonContent);
          const actualKeys = Object.keys(parsedContent).length;
          
          console.log('✅ ChatGPT API response received, content length:', content.length);
          console.log(`📊 Content coverage: ${actualKeys}/45 placeholders generated`);
          console.log('📝 Generated content keys:', Object.keys(parsedContent));
          
          if (actualKeys >= 40) {
            console.log('🎉 SUCCESS: Expanded generation working! Generated', actualKeys, 'placeholders');
          } else {
            console.log('⚠️ Partial success: Generated only', actualKeys, 'placeholders');
          }
          
          resolve(parsedContent);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Run the test
testExpandedGeneration()
  .then(() => console.log('✅ Test completed successfully'))
  .catch(err => console.error('❌ Test failed:', err.message));