import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000, // 2 minutes timeout
  maxRetries: 3
});

interface SentinelAssessmentData {
  personalityType: string;
  wing: string;
  stateDistribution: {
    destructive: number;
    good: number;
  };
  subtype: {
    dominant: string;
    blind: string;
  };
  confidence: number;
}

interface SentinelReportContent {
  heroTitle: string;
  brainHeartDisconnect: string;
  stage1Description: string;
  challengeCards: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  wheelOfLife: Array<{
    area: string;
    percentage: number;
    description: string;
  }>;
  testimonials: Array<{
    quote: string;
    name: string;
    title: string;
  }>;
  heroJourneyStages: {
    stage2: string;
    stage3: string;
    stage4: string;
    stage5: string;
    stage6: string;
  };
  callToAction: string;
}

export async function generateSentinel8Report(assessmentData: SentinelAssessmentData): Promise<SentinelReportContent> {
  try {
    const prompt = `
Generate a complete personalized transformation report for a Sentinel 8 personality type.

PERSONALITY PROFILE:
- Type: ${assessmentData.personalityType}
- Wing: ${assessmentData.wing} 
- State Distribution: ${assessmentData.stateDistribution.destructive}% Destructive, ${assessmentData.stateDistribution.good}% Good
- Subtype: ${assessmentData.subtype.dominant} dominant, ${assessmentData.subtype.blind} subtype blind
- Confidence: ${assessmentData.confidence}%

SENTINEL 8 CHARACTERISTICS:
- Core: Protective guardian with authority/power drive
- Fear: Being controlled, manipulated, or vulnerable
- Drive: Protecting others while maintaining control and authority
- 8 Wing Impact: Intensifies control needs, adds confrontational energy, increases dominance patterns

DESTRUCTIVE STATE (${assessmentData.stateDistribution.destructive}%): Controlling behavior that suffocates those being protected, aggressive authority that pushes people away, paranoid protection that creates threats it fears, dominating leadership that breeds resentment

GOOD STATE (${assessmentData.stateDistribution.good}%): Protective strength that empowers others, wise authority that guides without controlling, strategic leadership that builds trust, powerful advocacy for the vulnerable

SELF-PRESERVATION FOCUS: Intense focus on security, resources, safety, building protective systems and boundaries, control over environment, less concerned with image or relationships

SEXUAL SUBTYPE BLIND: Struggles with intimate intensity and passion, difficulty with one-on-one emotional depth, may avoid vulnerable personal connections, focus on broader protection rather than intimate bonds

GENERATE COMPLETE TRANSFORMATION REPORT CONTENT in JSON format with these sections:

1. heroTitle: Compelling transformation title for Sentinel 8 journey
2. brainHeartDisconnect: Specific message for Sentinel 8 patterns (like "PROTECTIVE CONTROL DETECTED")
3. stage1Description: 60-80 word description of Sentinel 8 ordinary world
4. challengeCards: Array of 4 specific Sentinel 8 struggles with titles, descriptions, and fontawesome icons
5. wheelOfLife: Array of 8 life areas with realistic percentages and self-preservation focused descriptions
6. testimonials: Array of 4 professional transformation stories from Sentinel 8 perspectives
7. heroJourneyStages: Object with stages 2-6 transformation descriptions
8. callToAction: Final transformation message

REQUIREMENTS:
- Use "Sentinel 8" terminology, never "Type 6w8" or "Enneagram"
- Focus on control/protection balance and authority transformation
- Address self-preservation dominance and sexual blind spot specifically
- Professional, authoritative tone matching Sentinel 8 energy
- Each description 50-80 words to match challenger template length
- Generate authentic content based on real Sentinel 8 patterns

Return as valid JSON object with all sections clearly structured.`;

    console.log('Generating Sentinel 8 report with OpenAI GPT-4o...');
    
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
      max_tokens: 3500
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate required sections
    const requiredSections = [
      'heroTitle', 'brainHeartDisconnect', 'stage1Description', 
      'challengeCards', 'wheelOfLife', 'testimonials', 'heroJourneyStages', 'callToAction'
    ];

    for (const section of requiredSections) {
      if (!content[section]) {
        throw new Error(`Missing required section: ${section}`);
      }
    }

    console.log('✅ Sentinel 8 report generated successfully by OpenAI');
    return content as SentinelReportContent;

  } catch (error) {
    console.error('❌ Error generating Sentinel 8 report:', error);
    throw new Error('Failed to generate Sentinel 8 transformation report');
  }
}