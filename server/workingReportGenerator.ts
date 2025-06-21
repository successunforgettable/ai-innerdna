import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000
});

interface AssessmentData {
  personalityType: number;
  personalityName?: string;
  colorStates: Array<{name: string; percentage: number}>;
  detailTokens: {selfPreservation: number; sexual: number; social: number};
  dominantState?: {name: string; percentage: number};
  secondaryState?: {name: string; percentage: number};
  dominantSubtype?: string;
}

interface MultiChatGPTRequest {
  personalityType: string;
  personalityName: string;
  wingInfluence: number;
  moodStates: {
    primary: { name: string; percentage: number };
    secondary: { name: string; percentage: number };
  };
  subtype: string;
}

export async function generateWorkingReport(assessmentData?: Partial<AssessmentData>): Promise<string> {
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

  // Multiple ChatGPT API calls for comprehensive content generation
  console.log('🚀 Starting MULTI-CALL ChatGPT content generation for:', testData.personalityName);
  const contentData = await generateMultiCallChatGPTContent(testData);
  console.log('Multi-call content generation completed, proceeding with template injection');
  
  // Technical template injection only
  const template = fs.readFileSync('./challenger_template.html', 'utf8');
  let html = template;
  
  Object.keys(contentData).forEach(key => {
    html = html.replaceAll(`{{${key}}}`, contentData[key]);
  });

  const filename = 'sentinel-6-working.html';
  fs.writeFileSync(filename, html);
  return path.resolve(filename);
}

// Multi-call ChatGPT content generation for 131 placeholders
async function generateMultiCallChatGPTContent(data: AssessmentData): Promise<Record<string, string>> {
  try {
    const userData: MultiChatGPTRequest = {
      personalityType: `Type ${data.personalityType}`,
      personalityName: data.personalityName || "Sentinel 6",
      wingInfluence: 7,
      moodStates: {
        primary: { name: data.dominantState?.name || "Anxious", percentage: data.dominantState?.percentage || 65 },
        secondary: { name: data.secondaryState?.name || "Secure", percentage: data.secondaryState?.percentage || 35 }
      },
      subtype: data.dominantSubtype || "Self-Preservation"
    };

    console.log('🚀 Executing 4 parallel ChatGPT API calls for comprehensive content...');
    
    // Execute all 4 ChatGPT API calls in parallel
    const [coreContent, testimonialsContent, metricsContent, wheelContent] = await Promise.all([
      generateCoreChatGPTContent(userData),      // 50 fields
      generateTestimonialsChatGPTContent(userData), // 25 fields  
      generateMetricsChatGPTContent(userData),    // 25 fields
      generateWheelChatGPTContent(userData)       // 31 fields
    ]);
    
    // Verify all calls succeeded
    if (!coreContent || !testimonialsContent || !metricsContent || !wheelContent) {
      console.error("❌ One or more ChatGPT API calls failed");
      throw new Error("Multi-call ChatGPT generation failed");
    }
    
    // Combine all ChatGPT content
    const allChatGPTContent = {
      ...coreContent,
      ...testimonialsContent, 
      ...metricsContent,
      ...wheelContent
    };
    
    const totalFields = Object.keys(allChatGPTContent).length;
    console.log(`✅ Multi-call ChatGPT generation successful: ${totalFields} total fields`);
    console.log(`📊 Content coverage: ${totalFields}/131 placeholders (${Math.round(totalFields/131*100)}% template coverage)`);
    
    return allChatGPTContent;
    
  } catch (error) {
    console.error("❌ Multi-call ChatGPT generation failed:", error);
    throw error;
  }
}

// CALL 1: Core Content (50 placeholders) - EXISTING WORKING FUNCTION
async function generateCoreChatGPTContent(userData: MultiChatGPTRequest): Promise<Record<string, string> | null> {
  try {
    console.log('🤖 ChatGPT Call 1: Core Content Generation...');
    
    const prompt = `You are an expert personality transformation coach creating a comprehensive hero's journey report for a ${userData.personalityType} - ${userData.personalityName} with ${userData.subtype} subtype.

CRITICAL: Respond ONLY with valid JSON containing the exact field names specified below. Do not include any markdown formatting, explanations, or additional text.

User Profile:
- Personality Type: ${userData.personalityType} - ${userData.personalityName}
- Primary Mood State: ${userData.moodStates.primary.name} (${userData.moodStates.primary.percentage}%)
- Secondary Mood State: ${userData.moodStates.secondary.name} (${userData.moodStates.secondary.percentage}%)
- Subtype: ${userData.subtype}

Generate content for these 50 fields in valid JSON format:

{
  "PERSONALITY_TYPE": "Type 6 - ${userData.personalityName}",
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
  "TESTIMONIAL1_AUTHOR": "Sarah M., ${userData.personalityName} Graduate",
  "TESTIMONIAL2_QUOTE": "Quote about breakthrough in transformation process", 
  "TESTIMONIAL2_AUTHOR": "Marcus T., CEO & ${userData.personalityName} Graduate",
  "TESTIMONIAL3_QUOTE": "Quote about leading from presence not pressure",
  "TESTIMONIAL3_AUTHOR": "Jennifer L., ${userData.personalityName} Graduate",
  
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
  "INVITATION_TEXT": "Trust inner calm over external control. Receive help as power, not weakness.",
  
  "BRAIN_HEART_DISCONNECT": "LOYALTY DEPENDENCY DETECTED",
  "TRANSFORMATION_PROMISE": "From Anxious Loyalty to Confident Trust",
  "HERO_CHALLENGE": "Transform anxiety into authentic courage",
  "CORE_WOUND": "Fear of abandonment driving hypervigilance",
  "BREAKTHROUGH_MOMENT": "Realizing security comes from within",
  "FINAL_INTEGRATION": "Leading with calm confidence instead of reactive fear"
}

Generate exactly this structure with appropriate content for ${userData.personalityName}. Return ONLY the complete JSON object.`;

    return await callChatGPTAPI(prompt, "Core Content");
    
  } catch (error) {
    console.error("❌ Core content generation failed:", error);
    return null;
  }
}

// CALL 2: Extended Testimonials & Case Studies (25 placeholders)
async function generateTestimonialsChatGPTContent(userData: MultiChatGPTRequest): Promise<Record<string, string> | null> {
  try {
    console.log('🤖 ChatGPT Call 2: Testimonials & Case Studies...');
    
    const prompt = `You are an expert personality transformation coach. Generate authentic testimonials and case studies for a ${userData.personalityType} - ${userData.personalityName} transformation report.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile:
- Personality Type: ${userData.personalityType} - ${userData.personalityName}
- Primary Mood State: ${userData.moodStates.primary.name} (${userData.moodStates.primary.percentage}%)
- Subtype: ${userData.subtype}

Generate 25 testimonial and case study fields:

{
  "TESTIMONIAL4_QUOTE": "Authentic quote about week 6 breakthrough moment",
  "TESTIMONIAL4_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL5_QUOTE": "Authentic quote about relationship transformation", 
  "TESTIMONIAL5_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL6_QUOTE": "Authentic quote about career leadership change",
  "TESTIMONIAL6_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  "TESTIMONIAL7_QUOTE": "Authentic quote about financial mindset shift",
  "TESTIMONIAL7_AUTHOR": "Realistic name, profession & ${userData.personalityName} Graduate",
  
  "CASE_STUDY_1_TITLE": "Case study title about career transformation",
  "CASE_STUDY_1_BEFORE": "Before state for this personality type professionally",
  "CASE_STUDY_1_AFTER": "After state showing leadership transformation",
  "CASE_STUDY_1_QUOTE": "Quote from this case study participant",
  
  "CASE_STUDY_2_TITLE": "Case study title about relationship breakthrough", 
  "CASE_STUDY_2_BEFORE": "Before state in relationships for this type",
  "CASE_STUDY_2_AFTER": "After state showing connection transformation",
  "CASE_STUDY_2_QUOTE": "Quote from this case study participant",
  
  "CASE_STUDY_3_TITLE": "Case study title about inner peace achievement",
  "CASE_STUDY_3_BEFORE": "Before state of inner turmoil for this type", 
  "CASE_STUDY_3_AFTER": "After state showing heart-brain coherence",
  "CASE_STUDY_3_QUOTE": "Quote from this case study participant",
  
  "SUCCESS_STORY_1": "Success story about rapid transformation",
  "SUCCESS_STORY_2": "Success story about overcoming resistance",
  "SUCCESS_STORY_3": "Success story about sustainable change",
  "SUCCESS_STORY_4": "Success story about leadership evolution",
  
  "BREAKTHROUGH_MOMENT_1": "Description of typical breakthrough moment for this type",
  "BREAKTHROUGH_MOMENT_2": "Description of relationship breakthrough for this personality"
}`;

    return await callChatGPTAPI(prompt, "Testimonials & Case Studies");
    
  } catch (error) {
    console.error("❌ Testimonials generation failed:", error);
    return null;
  }
}

// CALL 3: Detailed Transformation Metrics (25 placeholders)
async function generateMetricsChatGPTContent(userData: MultiChatGPTRequest): Promise<Record<string, string> | null> {
  try {
    console.log('🤖 ChatGPT Call 3: Transformation Metrics...');
    
    const prompt = `You are an expert personality transformation coach. Generate detailed transformation metrics and outcomes for a ${userData.personalityType} - ${userData.personalityName}.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile:
- Personality Type: ${userData.personalityType} - ${userData.personalityName}
- Primary Mood State: ${userData.moodStates.primary.name} (${userData.moodStates.primary.percentage}%)
- Subtype: ${userData.subtype}

Generate 25 transformation metric fields:

{
  "TRANSFORMATION_METRIC_1": "Specific measurable outcome for this personality type",
  "TRANSFORMATION_METRIC_2": "Leadership effectiveness improvement metric",
  "TRANSFORMATION_METRIC_3": "Relationship quality enhancement metric",
  "TRANSFORMATION_METRIC_4": "Stress reduction and peace metric",
  
  "BEFORE_AFTER_LEADERSHIP": "Leadership style transformation description",
  "BEFORE_AFTER_COMMUNICATION": "Communication pattern change description", 
  "BEFORE_AFTER_DECISION_MAKING": "Decision making evolution description",
  "BEFORE_AFTER_STRESS_RESPONSE": "Stress response transformation description",
  
  "WEEK_BY_WEEK_1": "Week 1-2 transformation milestones for this type",
  "WEEK_BY_WEEK_2": "Week 3-4 transformation milestones for this type",
  "WEEK_BY_WEEK_3": "Week 5-6 transformation milestones for this type", 
  "WEEK_BY_WEEK_4": "Week 7-8 transformation milestones for this type",
  "WEEK_BY_WEEK_5": "Week 9-10 transformation milestones for this type",
  
  "COHERENCE_METRIC_1": "Heart-brain coherence improvement measure",
  "COHERENCE_METRIC_2": "Nervous system regulation improvement",
  "COHERENCE_METRIC_3": "Emotional intelligence enhancement metric",
  
  "LONG_TERM_OUTCOME_1": "6-month post-program outcome for this type",
  "LONG_TERM_OUTCOME_2": "1-year sustained transformation measure",
  "LONG_TERM_OUTCOME_3": "Lifetime behavioral change indicator",
  
  "FAMILY_IMPACT": "How transformation affects family relationships",
  "TEAM_IMPACT": "How transformation affects team dynamics", 
  "CAREER_IMPACT": "How transformation affects career trajectory",
  
  "ROI_PERSONAL": "Personal return on investment description",
  "ROI_PROFESSIONAL": "Professional return on investment description",
  "ROI_RELATIONAL": "Relational return on investment description"
}`;

    return await callChatGPTAPI(prompt, "Transformation Metrics");
    
  } catch (error) {
    console.error("❌ Metrics generation failed:", error);
    return null;
  }
}

// CALL 4: Advanced Wheel of Life Content (31 placeholders)
async function generateWheelChatGPTContent(userData: MultiChatGPTRequest): Promise<Record<string, string> | null> {
  try {
    console.log('🤖 ChatGPT Call 4: Advanced Wheel of Life...');
    
    const prompt = `You are an expert personality transformation coach. Generate detailed wheel of life transformation content for a ${userData.personalityType} - ${userData.personalityName}.

CRITICAL: Respond ONLY with valid JSON. No markdown formatting.

User Profile:
- Personality Type: ${userData.personalityType} - ${userData.personalityName}
- Primary Mood State: ${userData.moodStates.primary.name} (${userData.moodStates.primary.percentage}%)
- Subtype: ${userData.subtype}

Generate 31 detailed wheel of life fields:

{
  "WHEEL_SPIRITUALITY_BEFORE": "Current spiritual/meaning state for this type",
  "WHEEL_SPIRITUALITY_AFTER": "Transformed spiritual connection and purpose",
  "WHEEL_RECREATION_BEFORE": "Current relationship with joy and play",
  "WHEEL_RECREATION_AFTER": "Transformed capacity for enjoyment and renewal",
  
  "WHEEL_DETAILED_CAREER_STRUGGLE": "Detailed career struggles specific to this type",
  "WHEEL_DETAILED_CAREER_SOLUTION": "Detailed career transformation pathway",
  "WHEEL_DETAILED_FINANCE_STRUGGLE": "Detailed financial patterns and blocks",
  "WHEEL_DETAILED_FINANCE_SOLUTION": "Detailed financial transformation approach",
  
  "WHEEL_DETAILED_RELATIONSHIP_STRUGGLE": "Detailed relationship challenges for this type",
  "WHEEL_DETAILED_RELATIONSHIP_SOLUTION": "Detailed relationship transformation path",
  "WHEEL_DETAILED_MENTAL_STRUGGLE": "Detailed mental/emotional challenges",
  "WHEEL_DETAILED_MENTAL_SOLUTION": "Detailed mental/emotional transformation",
  
  "WHEEL_DETAILED_PHYSICAL_STRUGGLE": "Detailed physical symptoms and tension",
  "WHEEL_DETAILED_PHYSICAL_SOLUTION": "Detailed physical health transformation",
  "WHEEL_DETAILED_SOCIAL_STRUGGLE": "Detailed social connection challenges", 
  "WHEEL_DETAILED_SOCIAL_SOLUTION": "Detailed social transformation outcomes",
  
  "LIFE_AREA_PRIORITY_1": "Most important life area for this personality to transform",
  "LIFE_AREA_PRIORITY_2": "Second priority transformation area",
  "LIFE_AREA_PRIORITY_3": "Third priority transformation area",
  
  "TRANSFORMATION_TIMELINE_CAREER": "Career transformation timeline for this type",
  "TRANSFORMATION_TIMELINE_RELATIONSHIPS": "Relationship change timeline",
  "TRANSFORMATION_TIMELINE_INNER_PEACE": "Inner peace development timeline",
  
  "RESISTANCE_PATTERN_1": "Primary resistance pattern for this personality type",
  "RESISTANCE_PATTERN_2": "Secondary resistance pattern they face",
  "RESISTANCE_SOLUTION_1": "How to overcome first resistance pattern",
  "RESISTANCE_SOLUTION_2": "How to overcome second resistance pattern",
  
  "BREAKTHROUGH_INDICATOR_1": "First sign of breakthrough for this type",
  "BREAKTHROUGH_INDICATOR_2": "Second breakthrough indicator to watch for",
  "BREAKTHROUGH_INDICATOR_3": "Third transformation milestone indicator",
  
  "INTEGRATION_PRACTICE_1": "Key daily practice for sustaining transformation",
  "INTEGRATION_PRACTICE_2": "Key weekly practice for ongoing growth",
  "INTEGRATION_PRACTICE_3": "Key monthly practice for long-term success"
}`;

    return await callChatGPTAPI(prompt, "Advanced Wheel of Life");
    
  } catch (error) {
    console.error("❌ Wheel content generation failed:", error);
    return null;
  }
}

// Shared ChatGPT API call function
async function callChatGPTAPI(prompt: string, contentType: string): Promise<Record<string, string> | null> {
  try {
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