// Section 7.4 Complete Subtype Calculation Algorithm

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

interface SubtypeResult {
  primary: string;
  secondary: string;
  tertiary: string;
  stackType: string;
  dominance: {
    self: number;
    oneToOne: number;
    social: number;
  };
  description: string;
}

interface SortedSubtype {
  name: string;
  count: number;
  label: string;
}

export function determineSubtypeStack(distribution: TokenDistribution): SubtypeResult {
  const { self, oneToOne, social } = distribution;

  // Validate total equals 10
  if (self + oneToOne + social !== 10) {
    throw new Error('Token distribution must total 10');
  }

  const sortedSubtypes: SortedSubtype[] = [
    { name: 'self', count: self, label: 'Self-Preservation' },
    { name: 'oneToOne', count: oneToOne, label: 'One-to-One' },
    { name: 'social', count: social, label: 'Social' }
  ].sort((a, b) => b.count - a.count);

  // Calculate dominance percentages
  const dominanceScores = {
    self: (self / 10) * 100,
    oneToOne: (oneToOne / 10) * 100,
    social: (social / 10) * 100
  };

  // Determine stack type
  const primaryCount = sortedSubtypes[0].count;
  const secondaryCount = sortedSubtypes[1].count;
  const tertiaryCount = sortedSubtypes[2].count;
  let stackType: string;
  if (primaryCount >= 6) {
    stackType = 'dominant';
  } else if (primaryCount === secondaryCount && secondaryCount === tertiaryCount) {
    stackType = 'balanced';
  } else {
    stackType = 'moderate';
  }

  return {
    primary: sortedSubtypes[0].name,
    secondary: sortedSubtypes[1].name,
    tertiary: sortedSubtypes[2].name,
    stackType: stackType,
    dominance: dominanceScores,
    description: generateSubtypeDescription(sortedSubtypes, stackType)
  };
}

export function generateSubtypeDescription(subtypes: SortedSubtype[], stackType: string): string {
  const primary = subtypes[0];
  const descriptions: { [key: string]: string } = {
    dominant: `You have a strongly ${primary.label.toLowerCase()}-focused approach to life, with ${primary.count} out of 10 energy units devoted to this area.`,
    balanced: `You maintain a relatively balanced approach across instincts, with your ${primary.label.toLowerCase()} focus slightly leading.`,
    moderate: `You focus moderately on ${primary.label.toLowerCase()} while maintaining some attention to other areas.`
  };
  return descriptions[stackType] || descriptions.moderate;
}