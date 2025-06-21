const OpenAI = require('openai').default;
const fs = require('fs');

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000,
  maxRetries: 3
});

async function generateSentinel8Content() {
  try {
    console.log('🚀 Generating Sentinel 8 transformation report content...');
    
    // Generate Hero Title and Brain-Heart Disconnect
    console.log('📝 Generating hero title and brain-heart disconnect...');
    const heroResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert transformation coach for Sentinel 8 personalities. Generate powerful, authoritative titles and messages.'
        },
        {
          role: 'user',
          content: `Generate for Sentinel 8 (60% destructive/40% good, self-preservation dominant, sexual blind):
1. heroTitle: Compelling transformation journey title
2. brainHeartDisconnect: Specific warning message (like "PROTECTIVE CONTROL CONFLICT DETECTED")
3. stage1Description: 60-80 words describing Sentinel 8 ordinary world

Return as JSON with these 3 fields only.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500
    });

    const heroContent = JSON.parse(heroResponse.choices[0].message.content);
    console.log('✅ Hero content generated');

    // Generate Challenge Cards
    console.log('🎯 Generating challenge cards...');
    const challengeResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate 4 specific challenge cards for Sentinel 8 transformation struggles.'
        },
        {
          role: 'user',
          content: `Generate 4 challenge cards for Sentinel 8 (protective control patterns):
Each card needs: title, description (40-60 words), icon (FontAwesome class)
Focus on: control vs protection, authority struggles, trust issues, vulnerability fears
Return as JSON: {"challengeCards": [array of 4 cards]}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 800
    });

    const challengeContent = JSON.parse(challengeResponse.choices[0].message.content);
    console.log('✅ Challenge cards generated');

    // Generate Wheel of Life
    console.log('⚡ Generating wheel of life...');
    const wheelResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate realistic wheel of life assessments for Sentinel 8 with self-preservation focus.'
        },
        {
          role: 'user',
          content: `Generate 8 wheel of life areas for Sentinel 8:
Areas: Career, Relationships, Health, Finance, Personal Growth, Family, Recreation, Contribution
Each needs: area name, percentage (realistic for someone struggling), description (30-40 words)
Focus on self-preservation themes, control issues, protective behaviors
Return as JSON: {"wheelOfLife": [array of 8 areas]}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000
    });

    const wheelContent = JSON.parse(wheelResponse.choices[0].message.content);
    console.log('✅ Wheel of life generated');

    // Generate Testimonials
    console.log('💬 Generating testimonials...');
    const testimonialResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate authentic testimonials from Sentinel 8 personalities who underwent transformation.'
        },
        {
          role: 'user',
          content: `Generate 4 professional testimonials from Sentinel 8 perspectives:
Each needs: quote (40-60 words about transformation), name, title
Focus on: moving from destructive control to empowering leadership
Themes: trust building, vulnerability, balanced authority, protective strength
Return as JSON: {"testimonials": [array of 4 testimonials]}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 800
    });

    const testimonialContent = JSON.parse(testimonialResponse.choices[0].message.content);
    console.log('✅ Testimonials generated');

    // Generate Hero Journey Stages
    console.log('🚀 Generating hero journey stages...');
    const stagesResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate transformation stages for Sentinel 8 hero journey from destructive control to empowering leadership.'
        },
        {
          role: 'user',
          content: `Generate hero journey stages 2-6 for Sentinel 8 transformation:
stage2: The Call (60-80 words)
stage3: Resistance (60-80 words) 
stage4: Meeting the Mentor (60-80 words)
stage5: Crossing the Threshold (60-80 words)
stage6: Tests and Trials (60-80 words)

Focus on: control patterns, trust building, vulnerability, leadership evolution
Return as JSON: {"heroJourneyStages": {stage2: "", stage3: "", stage4: "", stage5: "", stage6: ""}}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1200
    });

    const stagesContent = JSON.parse(stagesResponse.choices[0].message.content);
    console.log('✅ Hero journey stages generated');

    // Generate Call to Action
    console.log('📢 Generating call to action...');
    const ctaResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Generate a powerful call to action for Sentinel 8 transformation.'
        },
        {
          role: 'user',
          content: `Generate a compelling call to action for Sentinel 8 transformation (50-80 words):
Focus on: moving from destructive control to empowering protection
Tone: Authoritative, inspiring, action-oriented
Themes: balanced authority, trust, protective leadership
Return as JSON: {"callToAction": "your message here"}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 300
    });

    const ctaContent = JSON.parse(ctaResponse.choices[0].message.content);
    console.log('✅ Call to action generated');

    // Combine all content
    const completeReport = {
      ...heroContent,
      ...challengeContent,
      ...wheelContent,
      ...testimonialContent,
      ...stagesContent,
      ...ctaContent
    };

    // Save complete report
    fs.writeFileSync('sentinel-8-ai-report.json', JSON.stringify(completeReport, null, 2));
    
    console.log('');
    console.log('🎉 COMPLETE SENTINEL 8 REPORT GENERATED!');
    console.log('📝 Hero Title:', completeReport.heroTitle);
    console.log('🧠 Brain-Heart Disconnect:', completeReport.brainHeartDisconnect); 
    console.log('📊 Challenge Cards:', completeReport.challengeCards?.length || 0);
    console.log('⚡ Wheel Areas:', completeReport.wheelOfLife?.length || 0);
    console.log('💬 Testimonials:', completeReport.testimonials?.length || 0);
    console.log('🚀 Journey Stages:', Object.keys(completeReport.heroJourneyStages || {}).length);
    console.log('📢 Call to Action: ✓');
    console.log('');
    console.log('🤖 ALL CONTENT GENERATED BY: ChatGPT/OpenAI GPT-4o');
    console.log('💾 Saved to: sentinel-8-ai-report.json');
    console.log('📋 Total Characters:', JSON.stringify(completeReport).length);

  } catch (error) {
    console.error('❌ Error generating Sentinel 8 report:', error.message);
    process.exit(1);
  }
}

generateSentinel8Content();