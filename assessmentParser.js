function parseAssessmentData(rawAssessmentData) {
  const typeNames = {
    1: "Reformer 1", 2: "Helper 2", 3: "Achiever 3", 4: "Artist 4",
    5: "Investigator 5", 6: "Sentinel 6", 7: "Enthusiast 7", 
    8: "Challenger 8", 9: "Peacemaker 9"
  };
  
  const tokens = rawAssessmentData.detailTokens;
  const subtypes = [
    { name: "Self-Preservation", count: tokens.selfPreservation },
    { name: "Sexual", count: tokens.sexual },
    { name: "Social", count: tokens.social }
  ];
  const dominantSubtype = subtypes.sort((a, b) => b.count - a.count)[0].name;
  const sortedStates = rawAssessmentData.colorStates.sort((a, b) => b.percentage - a.percentage);
  
  return {
    personalityName: typeNames[rawAssessmentData.personalityType],
    influence: rawAssessmentData.wing,
    dominantState: sortedStates[0],
    secondaryState: sortedStates[1],
    dominantSubtype: dominantSubtype,
    confidence: rawAssessmentData.confidence
  };
}

export { parseAssessmentData };