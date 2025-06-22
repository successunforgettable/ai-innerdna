import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000
});

interface AssessmentData {
  personalityType: number;
  personalityName?: string;
  wing?: number;
  colorStates: Array<{name: string; percentage: number}>;
  detailTokens: {selfPreservation: number; sexual: number; social: number};
  dominantState?: {name: string; percentage: number};
  secondaryState?: {name: string; percentage: number};
  dominantSubtype?: string;
  confidence?: number;
}

interface UserData {
  personalityType: string;
  personalityName: string;
  wingInfluence: number;
  moodStates: {
    primary: { name: string; percentage: number };
    secondary: { name: string; percentage: number };
  };
  subtype: string;
}

// CALL 1: Core Content (45 placeholders) - Proven working system
async function generateCoreChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach creating a comprehensive hero's journey report for a ${userData.personalityType} - ${userData.personalityName} with ${userData.subtype} subtype.

CRITICAL: Respond ONLY with valid JSON containing the exact field names specified below. Do not include any markdown formatting, explanations, or additional text.

User Profile:
- Personality Type: ${userData.personalityType} - ${userData.personalityName}
- Wing Influence: ${userData.wingInfluence}
- Primary Mood State: ${userData.moodStates.primary.name} (${userData.moodStates.primary.percentage}%)
- Secondary Mood State: ${userData.moodStates.secondary.name} (${userData.moodStates.secondary.percentage}%)
- Subtype: ${userData.subtype}

Generate authentic, personalized content for these 45 fields in valid JSON format:

{
  "PERSONALITY_TYPE": "Type X - Name format for this specific personality",
  "HERO_SUBTITLE": "Inspiring subtitle about their transformation journey",
  
  "STAGE1_OPENING": "Compelling opening about their ordinary world struggles as this personality type",
  "STAGE2_OPENING": "Discovery of heart-brain disconnect revelation specific to this type", 
  "STAGE3_OPENING": "Resistance to vulnerability and change typical of this personality",
  "STAGE4_OPENING": "Meeting The Incredible You mentorship system introduction",
  "STAGE5_OPENING": "Crossing threshold into transformation for this type",
  "STAGE6_OPENING": "Facing tests and trials during journey specific to their patterns",
  "STAGE7_OPENING": "Core ordeal and breakthrough moment for this personality",
  "STAGE8_OPENING": "Reward of heart-brain coherence achieved in their context",
  "STAGE9_OPENING": "Integration into real-world leadership for this type",
  "STAGE10_OPENING": "Complete resurrection and transformation specific to them",
  "STAGE11_OPENING": "Return with gift of authentic leadership in their style",
  
  "CARD1_TITLE": "First struggle card title for this personality type",
  "CARD1_DESCRIPTION": "Description of first core struggle this type faces",
  "CARD2_TITLE": "Second struggle card title specific to this type", 
  "CARD2_DESCRIPTION": "Description of second core pattern they experience",
  "CARD3_TITLE": "Third struggle card title for this personality",
  "CARD3_DESCRIPTION": "Description of third challenge they typically have",
  "CARD4_TITLE": "Fourth struggle card title relevant to this type",
  "CARD4_DESCRIPTION": "Description of fourth pattern causing them pain",
  
  "CARD5_TITLE": "Fifth discovery card title about their disconnect",
  "CARD5_DESCRIPTION": "Description of fifth realization they need to make",
  "CARD6_TITLE": "Sixth discovery card title about their patterns", 
  "CARD6_DESCRIPTION": "Description of sixth insight specific to this type",
  "CARD7_TITLE": "Seventh discovery card title about their blocks",
  "CARD7_DESCRIPTION": "Description of seventh breakthrough they need",
  "CARD8_TITLE": "Eighth discovery card title about their potential",
  "CARD8_DESCRIPTION": "Description of eighth transformation possibility",
  
  "TESTIMONIAL1_QUOTE": "Authentic first-person quote about realizing heart-brain disconnect as this personality type",
  "TESTIMONIAL1_AUTHOR": "Realistic name, profession & personality type graduate",
  "TESTIMONIAL2_QUOTE": "Authentic quote about breakthrough in transformation process for this type", 
  "TESTIMONIAL2_AUTHOR": "Realistic name, profession & personality type graduate",
  "TESTIMONIAL3_QUOTE": "Authentic quote about leading from presence not pressure as this type",
  "TESTIMONIAL3_AUTHOR": "Realistic name, profession & personality type graduate",
  
  "WHEEL_CAREER_BEFORE": "Current career reality for this personality type in their ordinary world",
  "WHEEL_CAREER_AFTER": "Transformed career state after heart-brain coherence for this type",
  "WHEEL_FINANCES_BEFORE": "Current financial patterns and struggles typical of this type", 
  "WHEEL_FINANCES_AFTER": "Transformed financial clarity and confidence for this personality",
  "WHEEL_RELATIONSHIPS_BEFORE": "Current relationship patterns and challenges for this type",
  "WHEEL_RELATIONSHIPS_AFTER": "Transformed relationship capacity and safety for this personality",
  "WHEEL_MENTAL_BEFORE": "Current mental state and thought patterns of this type",
  "WHEEL_MENTAL_AFTER": "Transformed mental clarity and peace for this personality",
  "WHEEL_PHYSICAL_BEFORE": "Current physical symptoms and tension patterns of this type",
  "WHEEL_PHYSICAL_AFTER": "Transformed physical health and energy for this personality",
  "WHEEL_SOCIAL_BEFORE": "Current social patterns and challenges for this type", 
  "WHEEL_SOCIAL_AFTER": "Transformed social presence and connections for this personality",
  
  "WARNING_TEXT": "Motivating warning about what happens if they don't transform",
  "INSIGHT_TEXT": "Powerful insight about the choice they face right now",
  "INVITATION_TEXT": "Compelling invitation to trust their potential for transformation"
}`;

  return await callChatGPTAPI(prompt, "Core Content");
}

// CALL 2: Additional Challenge Cards & Metrics (25 placeholders)
async function generateAdditionalCardsChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate additional challenge cards and transformation metrics for a ${userData.personalityType} - ${userData.personalityName} transformation report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype

Generate 25 additional card and metric fields:

{
  "CARD9_TITLE": "Ninth challenge card title for this personality type",
  "CARD9_DESCRIPTION": "Description of ninth struggle pattern they face",
  "CARD10_TITLE": "Tenth challenge card title specific to this type",
  "CARD10_DESCRIPTION": "Description of tenth core challenge they experience",
  "CARD11_TITLE": "Eleventh challenge card title for this personality",
  "CARD11_DESCRIPTION": "Description of eleventh pattern causing them difficulty",
  "CARD12_TITLE": "Twelfth challenge card title relevant to this type",
  "CARD12_DESCRIPTION": "Description of twelfth transformation opportunity",
  "CARD13_TITLE": "Thirteenth challenge card title for this personality",
  "CARD13_DESCRIPTION": "Description of thirteenth growth edge they need",
  "CARD14_TITLE": "Fourteenth challenge card title specific to this type",
  "CARD14_DESCRIPTION": "Description of fourteenth breakthrough potential",
  "CARD15_TITLE": "Fifteenth challenge card title for this personality",
  "CARD15_DESCRIPTION": "Description of fifteenth transformation possibility",
  
  "BEFORE1": "First before state description for this personality type",
  "AFTER1": "First after state transformation for this type",
  "BEFORE2": "Second before state description specific to this personality",
  "AFTER2": "Second after state transformation for this type",
  "BEFORE3": "Third before state description for this personality",
  "AFTER3": "Third after state transformation for this type",
  "BEFORE4": "Fourth before state description specific to this type",
  "AFTER4": "Fourth after state transformation for this personality",
  
  "STAT1_DESCRIPTION": "First statistical outcome description for this personality type",
  "STAT2_DESCRIPTION": "Second statistical outcome description for this type",
  "BRAIN_HEART_DISCONNECT": "Brain-heart disconnect message specific to this personality type"
}`;

  return await callChatGPTAPI(prompt, "Additional Cards & Metrics");
}

// CALL 3: Extended Testimonials & Wheel Content (20 placeholders)
async function generateTestimonialsChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate extended testimonials and wheel of life content for a ${userData.personalityType} - ${userData.personalityName} transformation report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype

Generate 20 testimonial and wheel fields:

{
  "TESTIMONIAL4_QUOTE": "Authentic quote about week 6 breakthrough moment for this personality type",
  "TESTIMONIAL4_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL5_QUOTE": "Authentic quote about relationship transformation specific to this type", 
  "TESTIMONIAL5_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL6_QUOTE": "Authentic quote about career leadership change for this personality",
  "TESTIMONIAL6_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL7_QUOTE": "Authentic quote about financial mindset shift for this type",
  "TESTIMONIAL7_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL8_QUOTE": "Authentic quote about family impact of transformation",
  "TESTIMONIAL8_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  
  "WHEEL_ENVIRONMENT_BEFORE": "Current environment and living situation challenges for this type",
  "WHEEL_ENVIRONMENT_AFTER": "Transformed environment and space creation for this personality",
  "WHEEL_GROWTH_BEFORE": "Current personal growth and learning patterns for this type",
  "WHEEL_GROWTH_AFTER": "Transformed growth mindset and learning capacity for this personality",
  "WHEEL_SPIRITUALITY_BEFORE": "Current spiritual/meaning state for this type",
  "WHEEL_SPIRITUALITY_AFTER": "Transformed spiritual connection and purpose",
  "WHEEL_RECREATION_BEFORE": "Current relationship with joy and play",
  "WHEEL_RECREATION_AFTER": "Transformed capacity for enjoyment and renewal",
  
  "SUCCESS_STORY_1": "Brief success story about rapid transformation for this personality type",
  "SUCCESS_STORY_2": "Brief success story about overcoming specific resistance pattern"
}`;

  return await callChatGPTAPI(prompt, "Testimonials & Wheel Content");
}

// CALL 4: Complete Missing Placeholders (30 placeholders)
async function generateMissingPlaceholdersChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate the remaining transformation content for a ${userData.personalityType} - ${userData.personalityName} report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype

Generate 30 remaining placeholder fields:

{
  "SUCCESS_STORY_3": "Brief success story about sustainable change achievement",
  "SUCCESS_STORY_4": "Brief success story about leadership evolution", 
  "SUCCESS_STORY_5": "Brief success story about relationship breakthrough",
  "BREAKTHROUGH_MOMENT_1": "Description of typical breakthrough moment for this personality type",
  "BREAKTHROUGH_MOMENT_2": "Description of relationship breakthrough specific to this type",
  
  "STAT1_DESCRIPTION": "First statistical outcome description for this personality type",
  "STAT2_DESCRIPTION": "Second statistical outcome description for this type",
  "BRAIN_HEART_DISCONNECT": "Brain-heart disconnect message specific to this personality type",
  
  "HERO_TITLE": "Compelling hero title for this personality's transformation journey",
  "CTA_BUTTON_TEXT": "Call-to-action button text for this personality type",
  "FOOTER_MESSAGE": "Footer message about transformation potential",
  "TESTIMONIAL_HEADER": "Header text for testimonials section",
  "WHEEL_HEADER": "Header text for wheel of life section",
  "CHALLENGE_HEADER": "Header text for challenges section",
  "OPPORTUNITY_HEADER": "Header text for opportunities section",
  
  "ASSESSMENT_SUMMARY": "Summary of their assessment results and patterns",
  "TRANSFORMATION_PROMISE": "Promise about what transformation will deliver",
  "URGENCY_MESSAGE": "Urgency message about starting transformation now",
  "RISK_WARNING": "Warning about risks of not transforming",
  "SUPPORT_MESSAGE": "Message about support and guidance available",
  
  "STAGE1_TITLE": "Title for stage 1 of the hero's journey",
  "STAGE2_TITLE": "Title for stage 2 of the hero's journey",
  "STAGE3_TITLE": "Title for stage 3 of the hero's journey",
  "STAGE4_TITLE": "Title for stage 4 of the hero's journey",
  "STAGE5_TITLE": "Title for stage 5 of the hero's journey",
  "STAGE6_TITLE": "Title for stage 6 of the hero's journey",
  "STAGE7_TITLE": "Title for stage 7 of the hero's journey",
  "STAGE8_TITLE": "Title for stage 8 of the hero's journey",
  "STAGE9_TITLE": "Title for stage 9 of the hero's journey",
  "STAGE10_TITLE": "Title for stage 10 of the hero's journey"
}`;

  return await callChatGPTAPI(prompt, "Missing Placeholders");
}

// CALL 5: Final Template Coverage (25 placeholders)
async function generateFinalCoverageChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate the final content pieces for complete ${userData.personalityType} - ${userData.personalityName} template coverage.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype

Generate 25 final placeholder fields:

{
  "STAGE11_TITLE": "Title for stage 11 of the hero's journey",
  "STAGE1_DESCRIPTION": "Description for stage 1 transformation",
  "STAGE2_DESCRIPTION": "Description for stage 2 transformation", 
  "STAGE3_DESCRIPTION": "Description for stage 3 transformation",
  "STAGE4_DESCRIPTION": "Description for stage 4 transformation",
  "STAGE5_DESCRIPTION": "Description for stage 5 transformation",
  "STAGE6_DESCRIPTION": "Description for stage 6 transformation",
  "STAGE7_DESCRIPTION": "Description for stage 7 transformation",
  "STAGE8_DESCRIPTION": "Description for stage 8 transformation",
  "STAGE9_DESCRIPTION": "Description for stage 9 transformation",
  "STAGE10_DESCRIPTION": "Description for stage 10 transformation",
  "STAGE11_DESCRIPTION": "Description for stage 11 transformation",
  
  "MILESTONE_1": "First transformation milestone for this personality",
  "MILESTONE_2": "Second transformation milestone for this type",
  "MILESTONE_3": "Third transformation milestone for this personality",
  "MILESTONE_4": "Fourth transformation milestone for this type",
  "MILESTONE_5": "Fifth transformation milestone for this personality",
  
  "OUTCOME_1": "First transformation outcome for this personality type",
  "OUTCOME_2": "Second transformation outcome for this type",
  "OUTCOME_3": "Third transformation outcome for this personality",
  "OUTCOME_4": "Fourth transformation outcome for this type",
  "OUTCOME_5": "Fifth transformation outcome for this personality",
  
  "COMMITMENT_TEXT": "Text about commitment required for transformation",
  "INVESTMENT_TEXT": "Text about investment in personal transformation",
  "GUARANTEE_TEXT": "Text about transformation guarantee and results"
}`;

  return await callChatGPTAPI(prompt, "Final Coverage");
}

// CALL 4: Advanced Content (41 placeholders) - Complete Template Coverage
async function generateAdvancedChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate advanced transformation content for a ${userData.personalityType} - ${userData.personalityName} to complete their comprehensive report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype, Wing ${userData.wingInfluence}

Generate 41 advanced content fields for complete template coverage:

{
  "HERO_JOURNEY_INTRO": "Introduction to their specific hero's journey as this personality type",
  "TRANSFORMATION_PROMISE": "Promise of transformation specific to this personality type",
  "CURRENT_REALITY_SUMMARY": "Summary of their current reality and struggles",
  "FUTURE_VISION_SUMMARY": "Vision of their transformed future state",
  
  "STAGE_TRANSITION_1": "Transition description from Stage 1 to Stage 2",
  "STAGE_TRANSITION_2": "Transition description from Stage 2 to Stage 3", 
  "STAGE_TRANSITION_3": "Transition description from Stage 3 to Stage 4",
  "STAGE_TRANSITION_4": "Transition description from Stage 4 to Stage 5",
  "STAGE_TRANSITION_5": "Transition description from Stage 5 to Stage 6",
  
  "CHALLENGE_PATTERN_1": "First major challenge pattern for this personality type",
  "CHALLENGE_PATTERN_2": "Second major challenge pattern they face",
  "CHALLENGE_PATTERN_3": "Third challenge pattern specific to this type",
  "CHALLENGE_SOLUTION_1": "Solution approach for first challenge pattern",
  "CHALLENGE_SOLUTION_2": "Solution approach for second challenge pattern", 
  "CHALLENGE_SOLUTION_3": "Solution approach for third challenge pattern",
  
  "WHEEL_ENVIRONMENT_BEFORE": "Current environment and living space challenges",
  "WHEEL_ENVIRONMENT_AFTER": "Transformed environment and space after program",
  "WHEEL_GROWTH_BEFORE": "Current personal growth and learning patterns",
  "WHEEL_GROWTH_AFTER": "Transformed growth mindset and learning capacity",
  "WHEEL_SPIRITUALITY_BEFORE": "Current spiritual or meaning-making challenges",
  "WHEEL_SPIRITUALITY_AFTER": "Transformed spiritual connection and purpose",
  
  "RESISTANCE_BREAKTHROUGH_1": "How they overcome their first major resistance",
  "RESISTANCE_BREAKTHROUGH_2": "How they overcome their second major resistance",
  "RESISTANCE_BREAKTHROUGH_3": "How they overcome their third major resistance",
  
  "WEEK_10_MILESTONE": "Final week transformation milestone achievement",
  "POST_PROGRAM_MONTH_1": "First month after program completion outcomes",
  "POST_PROGRAM_MONTH_6": "Six month sustained transformation results",
  "POST_PROGRAM_YEAR_1": "One year transformation maintenance success",
  
  "FAMILY_TRANSFORMATION": "How their transformation impacts family dynamics",
  "WORK_TRANSFORMATION": "How their transformation impacts work relationships",
  "COMMUNITY_TRANSFORMATION": "How their transformation impacts community connections",
  
  "LEADERSHIP_EVOLUTION": "Evolution of their leadership style and approach",
  "INFLUENCE_EXPANSION": "Expansion of their positive influence on others",
  "LEGACY_CREATION": "Legacy they create through their transformation",
  
  "FINAL_INVITATION": "Final compelling invitation to begin their journey",
  "URGENCY_MESSAGE": "Message about the urgency of starting now",
  "SUPPORT_PROMISE": "Promise of support throughout their journey",
  
  "CTA_PRIMARY_FINAL": "Primary call-to-action for enrollment",
  "CTA_SECONDARY_FINAL": "Secondary call-to-action with alternative approach",
  "GUARANTEE_MESSAGE": "Guarantee or confidence statement about results",
  
  "CLOSING_INSPIRATION": "Final inspirational message for this personality type",
  "TRANSFORMATION_VISION": "Ultimate vision of who they can become",
  "SUCCESS_CERTAINTY": "Statement of certainty about their success potential"
}`;

  return await callChatGPTAPI(prompt, "Advanced Content");
}

// CALL 6: Timeline & Additional Cards (25 placeholders)
async function generateTimelineCardsChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate timeline progression and additional challenge cards for a ${userData.personalityType} - ${userData.personalityName} transformation report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype

Generate 25 timeline and card fields:

{
  "TIMELINE1_TITLE": "Timeline milestone 1 title for this personality transformation",
  "TIMELINE1_DESCRIPTION": "Description of week 1-2 transformation progress for this type",
  "TIMELINE2_TITLE": "Timeline milestone 2 title for this personality journey",
  "TIMELINE2_DESCRIPTION": "Description of week 3-4 transformation progress for this type",
  "TIMELINE3_TITLE": "Timeline milestone 3 title for this personality evolution",
  "TIMELINE3_DESCRIPTION": "Description of week 5-6 transformation progress for this type",
  "TIMELINE4_TITLE": "Timeline milestone 4 title for this personality breakthrough",
  "TIMELINE4_DESCRIPTION": "Description of week 7-8 transformation progress for this type",
  "TIMELINE5_TITLE": "Timeline milestone 5 title for this personality mastery",
  "TIMELINE5_DESCRIPTION": "Description of week 9-10 transformation progress for this type",
  "TIMELINE6_TITLE": "Timeline milestone 6 title for this personality integration",
  "TIMELINE6_DESCRIPTION": "Description of week 11-12 transformation progress for this type",
  
  "CARD16_TITLE": "16th challenge card title for this personality type",
  "CARD16_DESCRIPTION": "Description of 16th transformation opportunity for this type",
  "CARD17_TITLE": "17th challenge card title for this personality",
  "CARD17_DESCRIPTION": "Description of 17th growth edge for this type",
  "CARD18_TITLE": "18th challenge card title for this personality",
  "CARD18_DESCRIPTION": "Description of 18th breakthrough potential for this type",
  
  "MOTIVATIONAL_QUOTE": "Inspiring motivational quote relevant to this personality type's journey",
  "CRITICAL_CHOICE_TEXT": "Description of the critical choice this personality type faces now",
  "CHOICE_MOTIVATION": "Motivation for making the transformation choice for this type",
  "TRANSFORMATION_URGENCY": "Urgency message about beginning transformation for this personality",
  "LEGACY_MESSAGE": "Message about the legacy this personality type can create",
  "FUTURE_VISION": "Vision of this personality type's transformed future self",
  "POTENTIAL_UNLOCKED": "Description of potential unlocked through transformation"
}`;

  return await callChatGPTAPI(prompt, "Timeline & Cards");
}

// CALL 7: Final Complete Coverage (20 placeholders)
async function generateFinalCompleteChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  const prompt = `You are an expert personality transformation coach. Generate the final content pieces to achieve 100% template coverage for a ${userData.personalityType} - ${userData.personalityName} transformation report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile: ${userData.personalityType} - ${userData.personalityName}, ${userData.subtype} subtype

Generate 20 final completion fields:

{
  "CLOSING_MESSAGE": "Powerful closing message for this personality type's transformation",
  "NEXT_STEPS": "Clear next steps for this personality to begin transformation",
  "SUPPORT_AVAILABLE": "Description of support available during transformation journey",
  "COMMUNITY_MESSAGE": "Message about joining the transformation community",
  "MENTORSHIP_PROMISE": "Promise about mentorship and guidance provided",
  "RESULTS_GUARANTEE": "Guarantee about transformation results for this personality type",
  "INVESTMENT_VALUE": "Value proposition of investing in transformation",
  "TIME_COMMITMENT": "Time commitment required for transformation success",
  "DIFFICULTY_ACKNOWLEDGMENT": "Acknowledgment of transformation difficulty for this type",
  "COURAGE_REQUIRED": "Message about courage required for this personality's transformation",
  "BREAKTHROUGH_PROMISE": "Promise about breakthrough moments this type will experience",
  "LIFE_CHANGE_SCOPE": "Scope of life changes this personality can expect",
  "RELATIONSHIP_IMPACT": "Impact transformation will have on this type's relationships",
  "CAREER_TRANSFORMATION": "Career transformation this personality type can achieve",
  "INNER_PEACE_PROMISE": "Promise of inner peace through heart-brain coherence",
  "AUTHENTIC_POWER": "Description of authentic power this type will develop",
  "LEADERSHIP_EVOLUTION": "Evolution in leadership capacity for this personality",
  "FINAL_INVITATION": "Final compelling invitation to begin transformation journey",
  "CONTACT_INFORMATION": "Contact information for transformation program enrollment",
  "ENROLLMENT_DETAILS": "Details about enrollment process and next steps"
}`;

  return await callChatGPTAPI(prompt, "Final Complete Coverage");
}

// Shared ChatGPT API call function
async function callChatGPTAPI(prompt: string, contentType: string): Promise<Record<string, string> | null> {
  try {
    console.log(`🤖 Calling ChatGPT API for ${contentType}...`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: 'system',
          content: 'You are an expert personality transformation coach. Respond only with valid JSON containing the exact field names requested. Do not include markdown formatting or explanations.'
        },
        {
          role: 'user', 
          content: prompt
        }
      ],
      max_tokens: 3000,
      temperature: 0.7,
    });

    if (!completion.choices[0]?.message?.content) {
      console.error(`❌ No content received for ${contentType}`);
      return null;
    }

    const content = completion.choices[0].message.content;
    console.log(`✅ ${contentType} API response: ${content.length} characters`);

    // Parse JSON response
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedContent = JSON.parse(jsonContent);
    const fieldCount = Object.keys(parsedContent).length;
    console.log(`✅ ${contentType} generated: ${fieldCount} fields`);
    return parsedContent;

  } catch (error) {
    console.error(`❌ ${contentType} generation failed:`, error);
    return null;
  }
}

// Calculate dynamic progress percentages
function calculateDynamicProgressPercentages(moodStates: any): Record<string, string> {
  const primaryPercentage = moodStates.primary.percentage;
  const isAnxious = moodStates.primary.name.includes("Anxious") || moodStates.primary.name.includes("Worried");
  
  if (isAnxious || primaryPercentage < 50) {
    return {
      CAREER_PERCENTAGE: "21%", 
      FINANCES_PERCENTAGE: "18%", 
      RELATIONSHIPS_PERCENTAGE: "15%",
      MENTAL_PERCENTAGE: "12%", 
      PHYSICAL_PERCENTAGE: "18%", 
      SOCIAL_PERCENTAGE: "20%",
      ENVIRONMENT_PERCENTAGE: "25%", 
      GROWTH_PERCENTAGE: "10%"
    };
  } else {
    return {
      CAREER_PERCENTAGE: "40%", 
      FINANCES_PERCENTAGE: "35%", 
      RELATIONSHIPS_PERCENTAGE: "30%",
      MENTAL_PERCENTAGE: "25%", 
      PHYSICAL_PERCENTAGE: "30%", 
      SOCIAL_PERCENTAGE: "35%", 
      ENVIRONMENT_PERCENTAGE: "45%", 
      GROWTH_PERCENTAGE: "20%"
    };
  }
}

function getPersonalityName(type: number): string {
  const names: Record<number, string> = {
    1: "Perfectionist", 2: "Helper", 3: "Achiever", 4: "Individualist",
    5: "Investigator", 6: "Sentinel", 7: "Enthusiast", 8: "Challenger", 9: "Peacemaker"
  };
  return names[type] || "Challenger";
}

function validateWing(type: number, wing: number): number {
  const validWings: { [key: number]: number[] } = {
    1: [9, 2], 2: [1, 3], 3: [2, 4], 4: [3, 5], 
    5: [4, 6], 6: [5, 7], 7: [6, 8], 8: [7, 9], 9: [8, 1]
  };
  const valid = validWings[type] || [5, 7];
  return valid.includes(wing) ? wing : valid[0];
}

// Main multi-call generation function
export async function generateWorkingReport(assessmentData?: Partial<AssessmentData>): Promise<string> {
  try {
    console.log("🚀 Starting MULTI-CALL ChatGPT content generation...");
    
    // Data structure validated: direct properties (personalityType, wing, colorStates, detailTokens, confidence)
    console.log("🔍 Processing assessment data:", {
      type: assessmentData?.personalityType,
      wing: assessmentData?.wing,
      confidence: assessmentData?.confidence
    });
    
    // Assessment data processing (technical only)
    const testData: AssessmentData = {
      personalityType: 6,
      personalityName: "Sentinel 6",
      colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
      detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
      dominantState: {name: "Anxious", percentage: 60},
      secondaryState: {name: "Secure", percentage: 40},
      dominantSubtype: "Social",
      ...assessmentData
    };
    
    const userData: UserData = {
      personalityType: `Type ${assessmentData?.personalityType || testData.personalityType}`,
      personalityName: getPersonalityName(assessmentData?.personalityType || testData.personalityType),
      wingInfluence: validateWing(assessmentData?.personalityType || 6, assessmentData?.wing || 7),
      moodStates: {
        primary: { name: testData.dominantState?.name || "Anxious", percentage: testData.dominantState?.percentage || 65 },
        secondary: { name: testData.secondaryState?.name || "Secure", percentage: testData.secondaryState?.percentage || 35 }
      },
      subtype: testData.dominantSubtype || "Self-Preservation"
    };
    
    // Execute ChatGPT API calls sequentially to avoid rate limits
    console.log("📞 Calling Core Content...");
    const coreContent = await generateCoreChatGPTContent(userData);
    if (!coreContent) {
      console.error("❌ Core content generation failed");
      throw new Error("Core content generation failed");
    }
    
    console.log("📞 Calling Additional Cards & Metrics...");
    const cardsContent = await generateAdditionalCardsChatGPTContent(userData);
    if (!cardsContent) {
      console.log("⚠️ Additional cards generation failed, continuing with core content only");
    }
    
    console.log("📞 Calling Testimonials & Wheel Content...");
    const testimonialsContent = await generateTestimonialsChatGPTContent(userData);
    if (!testimonialsContent) {
      console.log("⚠️ Testimonials generation failed, continuing with available content");
    }
    
    console.log("📞 Calling Missing Placeholders...");
    const missingContent = await generateMissingPlaceholdersChatGPTContent(userData);
    if (!missingContent) {
      console.log("⚠️ Missing placeholders generation failed, continuing with available content");
    }
    
    console.log("📞 Calling Final Coverage...");
    const finalContent = await generateFinalCoverageChatGPTContent(userData);
    if (!finalContent) {
      console.log("⚠️ Final coverage generation failed, continuing with available content");
    }
    
    console.log("📞 Calling Timeline & Cards...");
    const timelineContent = await generateTimelineCardsChatGPTContent(userData);
    if (!timelineContent) {
      console.log("⚠️ Timeline generation failed, continuing with available content");
    }
    
    console.log("📞 Calling Final Complete Coverage...");
    const completeContent = await generateFinalCompleteChatGPTContent(userData);
    if (!completeContent) {
      console.log("⚠️ Complete coverage generation failed, continuing with available content");
    }
    
    console.log("📞 Call 8: FINAL 24 PLACEHOLDERS (100% Coverage)...");
    const final24Content = await generateFinal24PlaceholdersChatGPTContent(userData);
    if (!final24Content) {
      console.log("⚠️ Call 8 failed, continuing with available content");
    } else {
      console.log(`✅ Call 8 completed: ${Object.keys(final24Content).length} fields`);
    }
    
    // Combine all successful ChatGPT content
    const allChatGPTContent = {
      ...coreContent,
      ...(cardsContent || {}),
      ...(testimonialsContent || {}),
      ...(missingContent || {}),
      ...(finalContent || {}),
      ...(timelineContent || {}),
      ...(completeContent || {}),
      ...(final24Content || {})
    };
    
    const totalFields = Object.keys(allChatGPTContent).length;
    console.log(`✅ Multi-call ChatGPT generation completed: ${totalFields} total fields`);
    
    // Calculate progress percentages (technical only)
    const progressPercentages = calculateDynamicProgressPercentages(userData.moodStates);
    
    // Read and process template
    const template = await fs.readFile('./challenger_template.html', 'utf-8');
    let html = template;
    
    // Inject all ChatGPT content
    Object.entries(allChatGPTContent).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Inject progress percentages
    Object.entries(progressPercentages).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    
    const filename = 'sentinel-6-working.html';
    await fs.writeFile(filename, html);
    
    const coveragePercent = Math.round((totalFields / 131) * 100);
    console.log(`✅ Multi-call report generated: ${totalFields} ChatGPT fields, ${coveragePercent}% template coverage`);
    return path.resolve(filename);
    
  } catch (error) {
    console.error("❌ Multi-call ChatGPT generation failed:", error);
    throw error;
  }
}

// CALL 8: Final 24 Placeholders for 100% Coverage
async function generateFinal24PlaceholdersChatGPTContent(userData: UserData): Promise<Record<string, string> | null> {
  try {
    console.log("🤖 Calling ChatGPT API for FINAL 24 PLACEHOLDERS...");
    
    const prompt = `ROLE: You are an expert transformation coach creating the FINAL 24 missing placeholders for ${userData.personalityType} - ${userData.personalityName} transformation report.

CRITICAL: Generate EXACTLY these 24 remaining placeholders for 100% template coverage:

REQUIRED JSON STRUCTURE:
{
  "CARD19_TITLE": "Challenge card 19 title",
  "CARD19_DESCRIPTION": "Challenge card 19 description (2-3 sentences)",
  "CARD20_TITLE": "Challenge card 20 title", 
  "CARD20_DESCRIPTION": "Challenge card 20 description (2-3 sentences)",
  "CARD21_TITLE": "Challenge card 21 title",
  "CARD21_DESCRIPTION": "Challenge card 21 description (2-3 sentences)",
  "CARD22_TITLE": "Challenge card 22 title",
  "CARD22_DESCRIPTION": "Challenge card 22 description (2-3 sentences)",
  "RESURRECTION_BEFORE1": "Life before transformation aspect 1",
  "RESURRECTION_BEFORE2": "Life before transformation aspect 2", 
  "RESURRECTION_BEFORE3": "Life before transformation aspect 3",
  "RESURRECTION_BEFORE4": "Life before transformation aspect 4",
  "RESURRECTION_AFTER1": "Life after transformation aspect 1",
  "RESURRECTION_AFTER2": "Life after transformation aspect 2",
  "RESURRECTION_AFTER3": "Life after transformation aspect 3", 
  "RESURRECTION_AFTER4": "Life after transformation aspect 4",
  "TRANSFORMATION_SUMMARY": "Complete transformation overview (3-4 sentences)",
  "INCREDIBLE_YOU_TEXT": "Empowering self-recognition text (2-3 sentences)",
  "HERO_JOURNEY_TEXT": "Hero's journey completion text (3-4 sentences)",
  "FINAL_CALL_TO_ACTION": "Powerful call to action (2-3 sentences)",
  "FINAL_CHOICE_TEXT": "Decision moment text (2-3 sentences)",
  "FINAL_ENCOURAGEMENT": "Final motivational message (2-3 sentences)",
  "FINAL_TRANSFORMATION_TEXT": "Ultimate transformation description (3-4 sentences)",
  "WARNING_COMPLETION_TEXT": "Gentle warning about completing journey (2-3 sentences)"
}

USER CONTEXT: ${userData.personalityName} with ${userData.moodStates.primary.name} (${userData.moodStates.primary.percentage}%) and ${userData.moodStates.secondary.name} (${userData.moodStates.secondary.percentage}%), ${userData.subtype} subtype.

Generate profound, transformational content for Type 6 anxiety-to-security journey completion.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content?.trim();
    if (!content) {
      console.error("❌ Empty response from ChatGPT API");
      return null;
    }

    console.log(`✅ Final 24 Placeholders API response: ${content.length} characters`);

    let parsedContent;
    try {
      // Handle potential markdown formatting
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      parsedContent = JSON.parse(jsonString);
      
      const fieldCount = Object.keys(parsedContent).length;
      console.log(`✅ Final 24 Placeholders generated: ${fieldCount} fields`);
      
      return parsedContent;
    } catch (parseError) {
      console.error("❌ Failed to parse ChatGPT response as JSON:", parseError);
      console.error("Raw response:", content);
      return null;
    }
    
  } catch (error) {
    console.error("❌ Failed to generate final 24 placeholders:", error);
    return null;
  }
}

// Keep the original single-call function as backup
export async function generateTransformationReport(assessmentData: any): Promise<string | null> {
  console.log("🔄 Using single-call backup generation...");
  
  const userData: UserData = {
    personalityType: `Type ${assessmentData?.personalityType || 6}`,
    personalityName: getPersonalityName(assessmentData?.personalityType || 6),
    wingInfluence: validateWing(assessmentData?.personalityType || 6, assessmentData?.wing || 7),
    moodStates: {
      primary: { name: "Anxious & Worried", percentage: 65 },
      secondary: { name: "Focused & Determined", percentage: 35 }
    },
    subtype: assessmentData?.dominantSubtype || "Self-Preservation"
  };
  
  const coreContent = await generateCoreChatGPTContent(userData);
  if (!coreContent) return null;
  
  const progressPercentages = calculateDynamicProgressPercentages(userData.moodStates);
  
  const template = await fs.readFile('./challenger_template.html', 'utf-8');
  let html = template;
  
  Object.entries({ ...coreContent, ...progressPercentages }).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), value);
  });
  
  console.log(`✅ Single-call report generated: ${Object.keys(coreContent).length} ChatGPT fields`);
  return html;
}