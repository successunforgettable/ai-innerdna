// Debug Type 7 scoring pattern
const testPattern = [0, 0, 1, 1, 1, 1, 1, 1, 1];
const weights = [3.0, 3.0, 2.0, 1.5, 1.5, 2.0, 1.0, 1.0, 1.0];

const typeScores = {
  1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  6: 0, 7: 0, 8: 0, 9: 0
};

testPattern.forEach((selection, setIndex) => {
  const weight = weights[setIndex];
  
  switch(setIndex) {
    case 0: // Set 1: Decision-Making Center
      if (selection === 0) { // Head BASELINES
        typeScores[5] += 3 * weight; // Type 5: 9 points
        typeScores[6] += 2 * weight; // Type 6: 6 points
        typeScores[7] += 1 * weight; // Type 7: 3 points
      }
      break;

    case 1: // Set 2: Core Motivation
      if (selection === 0) { // Security BASELINES
        typeScores[5] += 2 * weight; // Type 5: +6 = 15 points
        typeScores[6] += 3 * weight; // Type 6: +9 = 15 points
        typeScores[7] += 1 * weight; // Type 7: +3 = 6 points
      }
      break;

    case 2: // Set 3: Energy Direction
      if (selection === 1) { // Assertive BASELINES
        typeScores[3] += 3 * weight; // Type 3: 6 points
        typeScores[7] += 2 * weight; // Type 7: +4 = 10 points
        typeScores[8] += 3 * weight; // Type 8: 6 points
      }
      break;

    case 3: // Set 4: Social Approach
      if (selection === 1) { // Connection BASELINES
        typeScores[2] += 3 * weight; // Type 2: 4.5 points
        typeScores[6] += 2 * weight; // Type 6: +3 = 18 points
      }
      break;
  }
});

console.log("Type scores for pattern [0,0,1,1,1,1,1,1,1]:");
console.log(typeScores);
console.log("Winner should be Type 6 with 18 points, not Type 7 with 10 points");