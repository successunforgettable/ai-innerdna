import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateSentinel8Report() {
  try {
    const prompt = `
Generate a complete transformation report for Sentinel 8 personality type.

PERSONALITY PROFILE:
- Type: Sentinel 8 (protective authority with 8 wing influence)
- State Distribution: 60% Destructive State, 40% Good State  
- Subtype: Self-Preservation dominant, Sexual subtype blind
- Core: Protective guardian with authority/power drive
- 8 Wing: Adds intensity, control needs, confrontational energy
- Fear: Being controlled, manipulated, or vulnerable
- Drive: Protecting others while maintaining control and authority

DESTRUCTIVE STATE (60%):
- Controlling behavior that suffocates those being protected
- Aggressive authority that pushes people away
- Paranoid protection that creates the threats it fears
- Dominating leadership that breeds resentment

GOOD STATE (40%):
- Protective strength that empowers others
- Wise authority that guides without controlling  
- Strategic leadership that builds trust
- Powerful advocacy for the vulnerable

SELF-PRESERVATION FOCUS:
- Intense focus on security, resources, safety
- Building protective systems and boundaries
- Control over environment and circumstances
- Less concerned with image or relationships

SEXUAL SUBTYPE BLIND:
- Struggles with intimate intensity and passion
- Difficulty with one-on-one emotional depth
- May avoid vulnerable personal connections
- Focus on broader protection rather than intimate bonds

GENERATE COMPLETE CONTENT:

1. Hero Title: Create compelling title about Sentinel 8 transformation
2. Brain-Heart Disconnect: Specific message for Sentinel 8 (like "CONTROL ADDICTION DETECTED")
3. Stage 1 Description: Ordinary world of Sentinel 8 (60-80 words)
4. 8 Wheel of Life Areas: Self-preservation focused descriptions with realistic percentages
5. 4 Challenge Cards: Sentinel 8 specific struggles
6. 4 Testimonials: Professional transformation stories
7. Stages 2-6: Complete hero's journey for Sentinel 8 transformation

REQUIREMENTS:
- Use "Sentinel 8" terminology, never "Type 6w8" or "Enneagram"
- Focus on control/protection balance and authority issues
- Address self-preservation dominance and sexual blind spot
- Professional, authoritative tone matching Sentinel 8 energy
- Each section 50-80 words to match template length

Return as structured JSON with all sections clearly labeled.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert transformation coach specializing in Sentinel 8 patterns. Generate precise, powerful content that captures the Sentinel 8 journey from destructive control to protective leadership."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2500
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    
    // Create the HTML report
    const template = fs.readFileSync('challenger-template-fixed.html', 'utf8');
    
    let reportHtml = template
      .replace(/Beyond Control: The Challenger's Journey to Authentic Power/g, content.heroTitle || "Beyond Control: The Sentinel's Journey to Protective Leadership")
      .replace(/CONTROL ADDICTION DETECTED/g, content.brainHeartDisconnect || "PROTECTIVE CONTROL DETECTED")
      .replace(/Living in a world where your need to be in control has become your prison/g, content.stage1Description || "Living in a world where your protective instincts have become controlling barriers that push away those you seek to protect.")
      
      // Update wheel of life
      .replace(/Career \(75%\): Your professional life thrives on challenge and achievement/g, `Career (${content.wheelOfLife?.career?.percentage || '75%'}): ${content.wheelOfLife?.career?.description || 'Your career centers on protective leadership and building secure systems, though control needs sometimes create workplace tension.'}`)
      .replace(/Finances \(45%\): Money represents power and security/g, `Finances (${content.wheelOfLife?.finances?.percentage || '55%'}): ${content.wheelOfLife?.finances?.description || 'Financial security is paramount for your self-preservation focus, driving careful resource management and protective financial planning.'}`)
      .replace(/Health \(50%\): Physical strength matches your mental intensity/g, `Health (${content.wheelOfLife?.health?.percentage || '40%'}): ${content.wheelOfLife?.health?.description || 'Health often suffers from stress and hypervigilance, as constant alertness takes a toll on your protective energy systems.'}`)
      .replace(/Family \(70%\): Family relationships are intense and complex/g, `Family (${content.wheelOfLife?.family?.percentage || '65%'}): ${content.wheelOfLife?.family?.description || 'Family bonds are strong but sometimes strained by your protective control, as loved ones feel both secure and suffocated.'}`)
      .replace(/Social \(40%\): Social connections often feel like power struggles/g, `Social (${content.wheelOfLife?.social?.percentage || '45%'}): ${content.wheelOfLife?.social?.description || 'Social connections focus on loyalty and protection rather than intimacy, with your sexual blind spot creating challenges in deeper bonding.'}`)
      .replace(/Personal Growth \(55%\): Growth comes through learning to channel intensity constructively/g, `Personal Growth (${content.wheelOfLife?.growth?.percentage || '50%'}): ${content.wheelOfLife?.growth?.description || 'Growth emerges through learning to protect without controlling, developing trust while maintaining healthy boundaries and authority.'}`)
      .replace(/Recreation \(60%\): Fun activities often become competitive challenges/g, `Recreation (${content.wheelOfLife?.recreation?.percentage || '35%'}): ${content.wheelOfLife?.recreation?.description || 'Recreation takes a backseat to protective responsibilities, as your self-preservation focus prioritizes security over leisure activities.'}`)
      .replace(/Contribution \(35%\): Your impact on others is powerful but sometimes overwhelming/g, `Contribution (${content.wheelOfLife?.contribution?.percentage || '70%'}): ${content.wheelOfLife?.contribution?.description || 'Your contribution centers on protecting and empowering others, though finding the balance between strength and control remains ongoing.'}`)
      
      // Update stages 2-6
      .replace(/A moment of recognition that your pursuit of control has become a prison/g, content.stage2 || "Recognition that your protective control has become the very threat you're defending against, pushing away those you seek to protect.")
      .replace(/Discovering wisdom that helps you transform aggression into assertiveness/g, content.stage3 || "Discovering mentors who teach protective leadership without domination, showing how to guide and strengthen others rather than control them.")
      .replace(/Taking the brave step to release the need for absolute control/g, content.stage4 || "Taking the courageous step to trust others with responsibility while maintaining protective oversight, learning to delegate without abandoning your guardian role.")
      .replace(/Facing situations that challenge your old patterns of dominance/g, content.stage5 || "Confronting situations that test your ability to protect without controlling, learning to respond with strength rather than reactive aggression.")
      .replace(/Returning to your world as a transformed leader who protects through empowerment/g, content.stage6 || "Returning as a transformed Sentinel 8 who protects through empowerment rather than control, creating security through trust and shared strength.");

    // Save the report
    fs.writeFileSync('sentinel-8-report.html', reportHtml);
    
    console.log('Sentinel 8 report generated successfully!');
    console.log('Hero Title:', content.heroTitle);
    console.log('Brain-Heart Message:', content.brainHeartDisconnect);
    
    return content;

  } catch (error) {
    console.error('Error generating Sentinel 8 report:', error);
    throw error;
  }
}

generateSentinel8Report();