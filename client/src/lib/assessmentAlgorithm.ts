import { PersonalityResult } from '@shared/schema';

export function determinePersonalityType(selections: number[]): PersonalityResult {
  const typeScores: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0, 8: 0, 9: 0
  };

  const weights = [3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0];
  
  selections.forEach((selection, setIndex) => {
    const weight = weights[setIndex];
    
    switch(setIndex) {
      case 0: // Set 1: Decision-Making Center
        if (selection === 0) { // Head BASELINES
          typeScores[5] += 3 * weight;
          typeScores[6] += 2 * weight;
          typeScores[7] += 1 * weight;
        } else if (selection === 1) { // Heart BASELINES
          typeScores[2] += 3 * weight;
          typeScores[3] += 2 * weight;
          typeScores[4] += 3 * weight;
        } else { // Body BASELINES
          typeScores[1] += 2 * weight;
          typeScores[8] += 3 * weight;
          typeScores[9] += 2 * weight;
        }
        break;

      case 1: // Set 2: Core Motivation
        if (selection === 0) { // Security BASELINES
          typeScores[5] += 2 * weight;
          typeScores[6] += 3 * weight;
          typeScores[7] += 1 * weight;
        } else if (selection === 1) { // Identity BASELINES
          typeScores[2] += 2 * weight;
          typeScores[3] += 3 * weight;
          typeScores[4] += 3 * weight;
        } else { // Power BASELINES
          typeScores[1] += 3 * weight;
          typeScores[8] += 3 * weight;
          typeScores[9] += 2 * weight;
        }
        break;

      case 2: // Set 3: Energy Direction
        if (selection === 0) { // Internal BASELINES
          typeScores[4] += 2 * weight;
          typeScores[5] += 3 * weight;
          typeScores[9] += 2 * weight;
        } else if (selection === 1) { // Assertive BASELINES
          typeScores[3] += 3 * weight;
          typeScores[7] += 2 * weight;
          typeScores[8] += 3 * weight;
        } else { // Cooperative BASELINES
          typeScores[1] += 2 * weight;
          typeScores[2] += 2 * weight;
          typeScores[6] += 3 * weight;
        }
        break;

      case 3: // Set 4: Social Approach
        if (selection === 0) { // Independence BASELINES
          typeScores[5] += 3 * weight;
          typeScores[4] += 2 * weight;
        } else if (selection === 1) { // Connection BASELINES
          typeScores[2] += 3 * weight;
          typeScores[6] += 2 * weight;
        } else { // Autonomy BASELINES
          typeScores[1] += 2 * weight;
          typeScores[8] += 2 * weight;
        }
        break;

      case 4: // Set 5: Processing Style
        if (selection === 0) { // Conceptual BASELINES
          typeScores[5] += 3 * weight;
          typeScores[1] += 2 * weight;
        } else if (selection === 1) { // Emotional BASELINES
          typeScores[4] += 3 * weight;
          typeScores[2] += 2 * weight;
        } else { // Practical BASELINES
          typeScores[3] += 2 * weight;
          typeScores[8] += 2 * weight;
        }
        break;

      case 5: // Set 6: Stress Reaction
        if (selection === 0) { // Cautious BASELINES
          typeScores[6] += 3 * weight;
          typeScores[5] += 2 * weight;
        } else if (selection === 1) { // Recognition BASELINES
          typeScores[3] += 3 * weight;
          typeScores[4] += 2 * weight;
        } else { // Control BASELINES
          typeScores[8] += 3 * weight;
          typeScores[1] += 2 * weight;
        }
        break;

      case 6: // Set 7: Conflict Style
        if (selection === 0) { // Harmony BASELINES
          typeScores[9] += 3 * weight;
          typeScores[5] += 1 * weight;
        } else if (selection === 1) { // Support BASELINES
          typeScores[2] += 2 * weight;
          typeScores[6] += 2 * weight;
        } else { // Directness BASELINES
          typeScores[8] += 3 * weight;
          typeScores[1] += 1 * weight;
        }
        break;

      case 7: // Set 8: Success Definition
        if (selection === 0) { // Standard BASELINES
          typeScores[1] += 3 * weight;
          typeScores[6] += 1 * weight;
        } else if (selection === 1) { // Relational BASELINES
          typeScores[2] += 3 * weight;
          typeScores[3] += 1 * weight;
        } else { // Achievement BASELINES
          typeScores[5] += 2 * weight;
          typeScores[8] += 2 * weight;
        }
        break;

      case 8: // Set 9: Relationship Priority
        if (selection === 0) { // Independence BASELINES
          typeScores[5] += 2 * weight;
          typeScores[8] += 1 * weight;
        } else if (selection === 1) { // Reciprocity BASELINES
          typeScores[2] += 2 * weight;
          typeScores[9] += 2 * weight;
        } else { // Leadership BASELINES
          typeScores[1] += 1 * weight;
          typeScores[8] += 2 * weight;
        }
        break;
    }
  });

  // Calculate total and normalize scores
  const totalScore = Object.values(typeScores).reduce((sum, score) => sum + score, 0);
  const normalizedScores: Record<string, number> = {};
  Object.keys(typeScores).forEach(type => {
    const typeNum = parseInt(type);
    normalizedScores[type] = typeScores[typeNum] / totalScore;
  });

  // Find highest scoring type
  const primaryType = Object.keys(typeScores).reduce((a, b) => {
    const aScore = typeScores[parseInt(a)];
    const bScore = typeScores[parseInt(b)];
    return aScore > bScore ? a : b;
  });

  // Calculate confidence
  const otherScores = Object.values(normalizedScores).filter(score => 
    score !== normalizedScores[primaryType]
  );
  const avgOtherScore = otherScores.reduce((sum, score) => sum + score, 0) / otherScores.length;
  const confidence = Math.min((normalizedScores[primaryType] - avgOtherScore) * 2, 1);

  return {
    primaryType,
    confidence: confidence,
    allScores: normalizedScores,
    rawScores: typeScores
  };
}

export function getTypeName(typeNumber: string): string {
  const typeNames: Record<string, string> = {
    '1': 'Reformer',
    '2': 'Helper', 
    '3': 'Achiever',
    '4': 'Individualist',
    '5': 'Investigator',
    '6': 'Sentinel',  // CRITICAL: Never "Loyalist"
    '7': 'Enthusiast',
    '8': 'Challenger',
    '9': 'Peacemaker'
  };
  return typeNames[typeNumber] || 'Unknown';
}

// Wing determination function from specification section 5.3
export function determineWing(primaryType: string, wingSelection: number) {
  const wingMap: Record<string, string[]> = {
    '1': ['9', '2'],
    '2': ['1', '3'],
    '3': ['2', '4'],
    '4': ['3', '5'],
    '5': ['4', '6'],
    '6': ['5', '7'],
    '7': ['6', '8'],
    '8': ['7', '9'],
    '9': ['8', '1']
  };

  const typeNames: Record<string, string> = {
    '1': 'Reformer', '2': 'Helper', '3': 'Achiever',
    '4': 'Individualist', '5': 'Investigator', '6': 'Sentinel',
    '7': 'Enthusiast', '8': 'Challenger', '9': 'Peacemaker'
  };

  const selectedWing = wingMap[primaryType]?.[wingSelection] || '1';

  return {
    wing: selectedWing,
    wingName: `${typeNames[primaryType]} ${selectedWing}`,
    wingStrength: 'strong'
  };
}
