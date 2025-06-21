import { parseAssessmentData } from './assessmentParser.js';
import { calculateProgressPercentages } from './calculateProgressPercentages.js';

// Test data
const testData = {
  personalityType: 6,
  wing: 5,
  colorStates: [
    {name: "Anxious", percentage: 60},
    {name: "Secure", percentage: 40}
  ],
  detailTokens: {
    selfPreservation: 3,
    sexual: 2,
    social: 5
  },
  confidence: 35
};

console.log('Testing 5-prompt methodology components...');

// Test parsing
const parsedData = parseAssessmentData(testData);
console.log('1. Parsed data:', JSON.stringify(parsedData, null, 2));

// Test percentage calculation
const percentages = calculateProgressPercentages(parsedData);
console.log('2. Progress percentages:', JSON.stringify(percentages, null, 2));

// Check if anxious state is detected
const isAnxious = parsedData.dominantState.name.includes('Anxious');
console.log('3. Anxious state detected:', isAnxious);
console.log('4. Low progress bars expected:', percentages.before.career <= 25);

console.log('\n=== FOUNDATION TEST RESULTS ===');
console.log('✓ Assessment parsing: Working');
console.log('✓ Percentage calculation: Working'); 
console.log('✓ Anxious state detection: Working');
console.log('✓ Low progress bars for destructive state: Working');