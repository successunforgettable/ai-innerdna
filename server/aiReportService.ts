import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AssessmentData {
  primaryType: string;
  confidence: number;
  wing?: string;
  colorStates?: Array<{ state: string; percentage: number }>;
  detailTokens?: Array<{ category: string; token: string }>;
  foundationStones?: any[];
  buildingBlocks?: any[];
}

export interface AIReportData {
  personalityOverview: string;
  strengthsAndChallenges: string;
  relationshipInsights: string;
  careerGuidance: string;
  growthRecommendations: string;
  dailyPractices: string;
}

export async function generatePersonalizedReport(assessmentData: AssessmentData): Promise<AIReportData> {
  try {
    // Prepare detailed context about the user's assessment
    const userContext = `
User Assessment Data:
- Primary Personality Type: ${assessmentData.primaryType}
- Confidence Level: ${assessmentData.confidence}%
- Wing Influence: ${assessmentData.wing || 'None specified'}
- Color States: ${assessmentData.colorStates?.map(state => `${state.state} (${state.percentage}%)`).join(', ') || 'Not completed'}
- Subtype Distribution: ${assessmentData.detailTokens?.map(token => `${token.category}: ${token.token}`).join(', ') || 'Not completed'}
- Foundation Assessment: ${assessmentData.foundationStones?.length || 0} stone sets completed
- Building Blocks: ${assessmentData.buildingBlocks?.length || 0} selected
`;

    const systemPrompt = `You are an expert personality assessment analyst specializing in the Inner DNA methodology. You create highly personalized, insightful reports that help individuals understand their unique personality patterns and grow.

Your task is to analyze the user's complete assessment data and generate a comprehensive, personalized report with specific insights based on their exact combination of traits.

Guidelines:
- Write in a warm, encouraging, yet professional tone
- Provide specific, actionable insights rather than generic descriptions
- Connect different aspects of their assessment (type, wing, states, subtypes) to show patterns
- Include concrete examples and practical applications
- Avoid clinical language - make it accessible and engaging
- Each section should be 150-250 words for depth while maintaining readability
- Base insights on the specific combination of their traits, not just their primary type

Return your response as a JSON object with these exact keys:
{
  "personalityOverview": "A comprehensive overview of their unique personality pattern",
  "strengthsAndChallenges": "Specific strengths they can leverage and challenges to be aware of",
  "relationshipInsights": "How they show up in relationships and what others experience with them",
  "careerGuidance": "Career environments and roles that would suit their specific pattern",
  "growthRecommendations": "Specific development areas and approaches for growth",
  "dailyPractices": "Practical daily habits and practices tailored to their profile"
}`;

    const userPrompt = `Please analyze this user's assessment data and create a personalized report:

${userContext}

Focus on their unique combination of traits and provide specific insights that acknowledge their individual pattern rather than generic type descriptions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const aiReport = JSON.parse(response.choices[0].message.content || '{}');

    // Validate that we got all required sections
    const requiredSections = [
      'personalityOverview',
      'strengthsAndChallenges', 
      'relationshipInsights',
      'careerGuidance',
      'growthRecommendations',
      'dailyPractices'
    ];

    for (const section of requiredSections) {
      if (!aiReport[section]) {
        throw new Error(`Missing required section: ${section}`);
      }
    }

    return aiReport as AIReportData;

  } catch (error) {
    console.error('Error generating AI report:', error);
    throw new Error('Failed to generate personalized report');
  }
}

export async function generateQuickInsight(assessmentData: AssessmentData): Promise<string> {
  try {
    const userContext = `
User's Primary Type: ${assessmentData.primaryType}
Wing: ${assessmentData.wing || 'None'}
Confidence: ${assessmentData.confidence}%
Color States: ${assessmentData.colorStates?.map(s => `${s.state} (${s.percentage}%)`).join(', ') || 'Not assessed'}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a personality expert. Generate a single, insightful paragraph (50-80 words) that captures the essence of this person's unique personality pattern based on their assessment data. Be specific and personal, not generic."
        },
        {
          role: "user", 
          content: `Create a personalized insight for: ${userContext}`
        }
      ],
      temperature: 0.8,
      max_tokens: 150
    });

    return response.choices[0].message.content || 'Unable to generate insight at this time.';

  } catch (error) {
    console.error('Error generating quick insight:', error);
    return 'Your unique personality pattern shows interesting combinations that we\'re still analyzing.';
  }
}