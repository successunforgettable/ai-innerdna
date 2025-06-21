import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateSentinel8Report() {
  try {
    const assessmentData = {
      personalityType: "Sentinel 8",
      wing: "8",
      stateDistribution: {
        destructive: 60,
        good: 40
      },
      subtype: {
        dominant: "self-preservation",
        blind: "sexual"
      },
      confidence: 85
    };

    const prompt = `
You are an expert transformation coach. Generate a complete personalized transformation report for a Sentinel 8 personality.

PERSONALITY PROFILE:
- Type: Sentinel 8 (protective authority with 8 wing influence)
- Wing: 8 (adds intensity, control needs, confrontational energy)
- State Distribution: 60% Destructive, 40% Good
- Subtype: Self-Preservation dominant, Sexual subtype blind
- Confidence: 85%

SENTINEL 8 CHARACTERISTICS:
- Core: Protective guardian with authority/power drive
- Fear: Being controlled, manipulated, or vulnerable
- Drive: Protecting others while maintaining control and authority
- 8 Wing Impact: Intensifies control needs, adds confrontational energy, increases dominance patterns

DESTRUCTIVE STATE (60%): Controlling behavior that suffocates those being protected, aggressive authority that pushes people away, paranoid protection that creates threats it fears, dominating leadership that breeds resentment

GOOD STATE (40%): Protective strength that empowers others, wise authority that guides without controlling, strategic leadership that builds trust, powerful advocacy for the vulnerable

SELF-PRESERVATION FOCUS: Intense focus on security, resources, safety, building protective systems and boundaries, control over environment, less concerned with image or relationships

SEXUAL SUBTYPE BLIND: Struggles with intimate intensity and passion, difficulty with one-on-one emotional depth, may avoid vulnerable personal connections, focus on broader protection rather than intimate bonds

GENERATE COMPLETE TRANSFORMATION REPORT CONTENT:

1. Hero Title: Compelling transformation title for Sentinel 8
2. Brain-Heart Disconnect Message: Specific to Sentinel 8 patterns 
3. Stage 1 Ordinary World: 60-80 word description of Sentinel 8 daily reality
4. Challenge Cards (4): Specific Sentinel 8 struggles with control, authority, protection
5. Wheel of Life (8 areas): Self-preservation focused descriptions with realistic percentages
6. Testimonials (4): Professional transformation stories from Sentinel 8 perspectives
7. Hero's Journey Stages 2-6: Complete transformation arc from destructive control to protective leadership

REQUIREMENTS:
- Use "Sentinel 8" terminology, never "Type 6w8" or "Enneagram"
- Focus on control/protection balance and authority transformation
- Address self-preservation dominance and sexual blind spot specifically
- Professional, authoritative tone matching Sentinel 8 energy
- Each section 50-80 words matching challenger template length
- Generate authentic content based on real Sentinel 8 patterns

Return structured JSON with all sections clearly labeled for HTML insertion.`;

    console.log('Generating Sentinel 8 transformation report with OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert transformation coach specializing in Sentinel 8 patterns. Generate precise, powerful content that captures the Sentinel 8 journey from destructive control to protective leadership. Focus on authentic personality-specific content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    
    console.log('AI-generated Sentinel 8 content:');
    console.log(JSON.stringify(content, null, 2));
    
    // Save the generated content
    fs.writeFileSync('sentinel-8-ai-content.json', JSON.stringify(content, null, 2));
    
    // Now create the HTML report using the Challenger template
    const template = fs.readFileSync('challenger-template-fixed.html', 'utf8');
    
    let reportHtml = template
      // Update hero section
      .replace(/Beyond Control: The Challenger's Journey to Authentic Power/g, content.heroTitle || "Beyond Control: The Sentinel's Journey to Protective Leadership")
      .replace(/CONTROL ADDICTION DETECTED/g, content.brainHeartDisconnect || "PROTECTIVE CONTROL DETECTED")
      
      // Update Stage 1
      .replace(/Living in a world where your need to be in control has become your prison, and there's a different way to create positive change\./g, content.stage1Description || "Living in a world where your protective instincts have become controlling barriers that push away those you seek to protect.")
      
      // Update challenge cards
      .replace(/Taking control of every situation/g, content.challengeCards?.[0]?.title || "Controlling Protection")
      .replace(/Your need to dominate conversations and decisions creates resistance/g, content.challengeCards?.[0]?.description || "Your need to control every variable creates the insecurity you're trying to prevent")
      
      // Update wheel of life with AI-generated content
      .replace(/Career \(75%\): Your professional life thrives on challenge and achievement/g, `Career (${content.wheelOfLife?.career?.percentage || '75%'}): ${content.wheelOfLife?.career?.description || 'Career focused on protective leadership and security'}`)
      .replace(/Finances \(45%\): Money represents power and security/g, `Finances (${content.wheelOfLife?.finances?.percentage || '65%'}): ${content.wheelOfLife?.finances?.description || 'Financial security paramount for self-preservation focus'}`)
      
      // Update stages with AI content
      .replace(/A moment of recognition that your pursuit of control has become a prison/g, content.stage2 || "Recognition that your protective control has become the threat you're defending against")
      .replace(/Discovering wisdom that helps you transform aggression into assertiveness/g, content.stage3 || "Discovering mentors who teach protective leadership without domination")
      .replace(/Taking the brave step to release the need for absolute control/g, content.stage4 || "Taking the step to trust others with responsibility while maintaining oversight")
      .replace(/Facing situations that challenge your old patterns of dominance/g, content.stage5 || "Confronting situations that test your ability to protect without controlling")
      .replace(/Returning to your world as a transformed leader who protects through empowerment/g, content.stage6 || "Returning as a Sentinel 8 who protects through empowerment rather than control");

    // Save the final report
    fs.writeFileSync('ai-generated-sentinel-8-report.html', reportHtml);
    
    console.log('✅ Sentinel 8 transformation report generated successfully!');
    console.log('📄 Report saved as: ai-generated-sentinel-8-report.html');
    console.log('🤖 All content generated by OpenAI GPT-4o');
    
    return content;

  } catch (error) {
    console.error('❌ Error generating Sentinel 8 report:', error);
    throw error;
  }
}

generateSentinel8Report();