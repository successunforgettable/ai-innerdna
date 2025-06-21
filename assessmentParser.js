// Assessment Data Parser - NO CONTENT CREATION
// Transforms raw assessment data into structured personality data
// ALL CONTENT WILL BE CREATED BY CHATGPT USING API KEY

const PERSONALITY_NAMES = {
  "1": "Reformer 1",
  "2": "Helper 2", 
  "3": "Achiever 3",
  "4": "Artist 4",
  "5": "Investigator 5",
  "6": "Sentinel 6",
  "7": "Enthusiast 7",
  "8": "Challenger 8",
  "9": "Peacemaker 9"
};

function parseAssessmentData(rawAssessmentData) {
  // Data transformation only - NO content creation
  const parsed = {
    personalityType: PERSONALITY_NAMES[rawAssessmentData.primaryType] || "Unknown",
    primaryTypeNumber: rawAssessmentData.primaryType,
    confidence: rawAssessmentData.confidence,
    wing: rawAssessmentData.wing,
    
    // Foundation stones data
    foundationStones: rawAssessmentData.foundationStones || [],
    
    // Building blocks data
    buildingBlocks: rawAssessmentData.buildingBlocks || [],
    
    // Color states data
    colorStates: rawAssessmentData.colorStates || [],
    primaryState: null,
    secondaryState: null,
    
    // Detail tokens data
    detailTokens: rawAssessmentData.detailTokens || {},
    dominantSubtype: null,
    blindSubtype: null,
    
    // Completion data
    completedAt: rawAssessmentData.completedAt,
    startedAt: rawAssessmentData.startedAt
  };

  // Parse color states
  if (parsed.colorStates.length >= 2) {
    parsed.primaryState = parsed.colorStates[0];
    parsed.secondaryState = parsed.colorStates[1];
  }

  // Parse subtype dominance
  const tokens = parsed.detailTokens;
  if (tokens.social && tokens.selfPreservation && tokens.sexual) {
    const subtypes = [
      { name: 'social', value: tokens.social },
      { name: 'selfPreservation', value: tokens.selfPreservation },
      { name: 'sexual', value: tokens.sexual }
    ];
    
    subtypes.sort((a, b) => b.value - a.value);
    parsed.dominantSubtype = subtypes[0].name;
    parsed.blindSubtype = subtypes[2].name;
  }

  return parsed;
}

module.exports = { parseAssessmentData, PERSONALITY_NAMES };