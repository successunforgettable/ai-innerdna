function calculateProgressPercentages(parsedData) {
  // Base percentages influenced by dominant state
  const dominantPercentage = parsedData.dominantState.percentage;
  const isDestructiveState = dominantPercentage > 50 && 
    (parsedData.dominantState.name.includes('Anxious') || 
     parsedData.dominantState.name.includes('Intense') ||
     parsedData.dominantState.name.includes('Destructive'));
  
  // Calculate before percentages (lower if destructive state dominant)
  const baseModifier = isDestructiveState ? 0.6 : 1.2;
  
  const beforePercentages = {
    career: Math.round(35 * baseModifier),
    finances: Math.round(30 * baseModifier), 
    relationships: Math.round(25 * baseModifier),
    mental: Math.round(20 * baseModifier),
    physical: Math.round(25 * baseModifier),
    social: Math.round(30 * baseModifier),
    environment: Math.round(40 * baseModifier),
    growth: Math.round(15 * baseModifier)
  };
  
  // After percentages (always high - transformation achieved)
  const afterPercentages = {
    career: 90, finances: 85, relationships: 95, mental: 90,
    physical: 85, social: 88, environment: 92, growth: 95
  };
  
  return { before: beforePercentages, after: afterPercentages };
}

export { calculateProgressPercentages };