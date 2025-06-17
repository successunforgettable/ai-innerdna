import { PersonalityResult } from '@shared/schema';

export function determinePersonalityType(selections: number[]): PersonalityResult {
  const typeScores: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    6: 0, 7: 0, 8: 0, 9: 0
  };

  // Section 3.4 exact weights - VERIFIED
  const weights = [3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0];
  console.log("Algorithm weights:", weights);
  
  selections.forEach((selection, setIndex) => {
    const weight = weights[setIndex];
    
    switch(setIndex) {
      case 0: // Set 1: Decision-Making Center
        if (selection === 0) { // Head BASELINES
          typeScores[5] += 3 * weight;
          typeScores[6] += 2 * weight;
          typeScores[7] += 2.5 * weight;
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
          typeScores[7] += 2.5 * weight;
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
          typeScores[6] += 0 * weight;  // Type 6: +0.0 (remove any Type 6 scoring for Assertive)
          typeScores[7] += 3.5 * weight;
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

  // CRITICAL: Combination scoring per Section 3.5 Complete Stone-to-Type Mapping Table
  // Head + Fear + Assertive = Type 7 (REQUIRED by specification)
  if (selections[0] === 0 && selections[1] === 0 && selections[2] === 1) {
    // Per replit_innerdna_spec.md Section 3.5: This combination MUST produce Type 7
    typeScores[7] += 8.0; // Stronger boost for Type 7 to ensure dominance
    typeScores[5] += 1.0; // Type 5 secondary per spec
    typeScores[8] = Math.max(0, typeScores[8] - 3.0); // Reduce Type 8 scoring more
    typeScores[6] = Math.max(0, typeScores[6] - 3.0); // Reduce Type 6 scoring more
  }

  // Head + Fear + Compliant = Type 6 (per Section 3.5)
  if (selections[0] === 0 && selections[1] === 0 && selections[2] === 2) {
    typeScores[6] += 4.0; // Strong boost for Type 6
    typeScores[5] += 1.0; // Type 5 secondary per spec
    typeScores[7] = Math.max(0, typeScores[7] - 2.0); // Reduce Type 7 scoring
  }

  // Head + Fear + Withdrawn = Type 5 (per Section 3.5)
  if (selections[0] === 0 && selections[1] === 0 && selections[2] === 0) {
    typeScores[5] += 4.0; // Strong boost for Type 5
    typeScores[6] += 1.0; // Type 6 secondary per spec
  }

  // Enhanced Type 6 vs Type 7 differentiation for Head center types
  if (selections[0] === 0 && selections[1] === 0) { // Head + Security/Fear motivation
    if (selections[2] === 1) { // Assertive energy = Type 7 escapes fear through action
      typeScores[7] += 2 * weights[2];
      typeScores[6] -= 0.5 * weights[2];
      // Reduce Type 8 when it's escape-focused assertiveness, not control-focused
      if (selections[4] !== 2 && selections[5] !== 2) { // Not Power + Control focused
        typeScores[8] -= 1 * weights[2];
      }
    } else if (selections[2] === 2) { // Cooperative energy = Type 6 seeks security through structure
      typeScores[6] += 2 * weights[2];
      typeScores[7] -= 0.5 * weights[2];
    }
  }

  // Type 7 vs Type 8 differentiation - both can be assertive but different motivations
  if (selections[0] === 0 && selections[2] === 1) { // Head + Assertive
    // Type 7 pattern: Connection-focused, Emotional, Recognition-seeking (escape-focused)
    if (selections[3] === 1 && selections[4] === 1 && selections[5] === 0) {
      typeScores[7] += 2 * weights[3];
      typeScores[8] -= 1 * weights[3];
    }
    // Type 8 pattern: Autonomy-focused, Power, Control (control-focused)
    if (selections[3] === 2 && selections[5] === 2) {
      typeScores[8] += 2 * weights[3];
      typeScores[7] -= 1 * weights[3];
    }
  }

  // Additional differentiation in conflict style
  if (selections[0] === 0) { // Head center types
    if (selections[6] === 2) { // Direct conflict style - Type 7 more likely
      typeScores[7] += 1.5 * weights[6];
      typeScores[6] += 0.5 * weights[6];
    } else if (selections[6] === 1) { // Support conflict style - Type 6 more likely
      typeScores[6] += 1.5 * weights[6];
      typeScores[7] += 0.5 * weights[6];
    }
  }

  // Calculate total and normalize scores - EXACT from specification
  const totalScore = Object.values(typeScores).reduce((sum, score) => sum + score, 0);
  const normalizedScores: Record<string, number> = {};
  Object.keys(typeScores).forEach(type => {
    normalizedScores[type] = typeScores[parseInt(type)] / totalScore;
  });

  // Find highest scoring type - EXACT from specification
  const primaryType = Object.keys(typeScores).reduce((a, b) => 
    typeScores[parseInt(a)] > typeScores[parseInt(b)] ? a : b
  );

  // Calculate confidence - EXACT from specification
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

// Wing determination function - EXACT from specification section 5.3
export function determineWing(primaryType: string, wingSelection: number) {
  const wingMap: Record<string, string> = {
    '1': wingSelection === 0 ? '9' : '2',
    '2': wingSelection === 0 ? '1' : '3',
    '3': wingSelection === 0 ? '2' : '4',
    '4': wingSelection === 0 ? '3' : '5',
    '5': wingSelection === 0 ? '4' : '6',
    '6': wingSelection === 0 ? '5' : '7',
    '7': wingSelection === 0 ? '6' : '8',
    '8': wingSelection === 0 ? '7' : '9',
    '9': wingSelection === 0 ? '8' : '1'
  };

  const typeNames: Record<string, string> = {
    '1': 'Reformer', '2': 'Helper', '3': 'Achiever',
    '4': 'Individualist', '5': 'Investigator', '6': 'Sentinel',
    '7': 'Enthusiast', '8': 'Challenger', '9': 'Peacemaker'
  };

  return {
    wing: wingMap[primaryType],
    wingName: `${typeNames[primaryType]} ${wingMap[primaryType]}`, // Uses approved format
    wingStrength: 'strong'
  };
}
