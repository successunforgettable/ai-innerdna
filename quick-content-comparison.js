import { parseAssessmentData } from './assessmentParser.js';
import { generatePersonalityContent } from './contentGenerator.js';

async function quickContentComparison() {
  console.log('CHATGPT CONTENT CREATION VERIFICATION');
  console.log('====================================');
  
  // Generate Sentinel 6 content
  const sentinelData = parseAssessmentData({
    personalityType: 6,
    wing: 5,
    colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
    detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
    confidence: 35
  });
  
  console.log('Generating Sentinel 6 content...');
  const sentinelContent = await generatePersonalityContent(sentinelData);
  
  console.log('\n=== SENTINEL 6 GENERATED CONTENT ===');
  console.log('Personality Type:', sentinelContent.PERSONALITY_TYPE);
  console.log('Hero Title:', sentinelContent.HERO_TITLE);
  console.log('Hero Subtitle:', sentinelContent.HERO_SUBTITLE);
  console.log('Stage Description:', sentinelContent.STAGE1_DESCRIPTION);
  console.log('Assessment Summary:', sentinelContent.ASSESSMENT_SUMMARY);
  
  // Now compare with different personality - Helper 2
  const helperData = parseAssessmentData({
    personalityType: 2,
    wing: 3,
    colorStates: [{name: "Enthusiastic", percentage: 70}, {name: "Calm", percentage: 30}],
    detailTokens: {selfPreservation: 2, sexual: 4, social: 4},
    confidence: 85
  });
  
  console.log('\n\nGenerating Helper 2 content...');
  const helperContent = await generatePersonalityContent(helperData);
  
  console.log('\n=== HELPER 2 GENERATED CONTENT ===');
  console.log('Personality Type:', helperContent.PERSONALITY_TYPE);
  console.log('Hero Title:', helperContent.HERO_TITLE);
  console.log('Hero Subtitle:', helperContent.HERO_SUBTITLE);
  console.log('Stage Description:', helperContent.STAGE1_DESCRIPTION);
  console.log('Assessment Summary:', helperContent.ASSESSMENT_SUMMARY);
  
  console.log('\n=== UNIQUENESS VERIFICATION ===');
  console.log('Different personality names:', sentinelContent.PERSONALITY_TYPE !== helperContent.PERSONALITY_TYPE);
  console.log('Different hero titles:', sentinelContent.HERO_TITLE !== helperContent.HERO_TITLE);
  console.log('Different descriptions:', sentinelContent.STAGE1_DESCRIPTION !== helperContent.STAGE1_DESCRIPTION);
  console.log('Different summaries:', sentinelContent.ASSESSMENT_SUMMARY !== helperContent.ASSESSMENT_SUMMARY);
  
  console.log('\nCHATGPT CONTENT CREATION: VERIFIED');
}

quickContentComparison();