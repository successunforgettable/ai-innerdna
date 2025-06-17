// Comprehensive Assessment Algorithm Validation Suite
// Tests all possible combinations against specification requirements

import { determinePersonalityType, determineWing, getTypeName } from '@/lib/assessmentAlgorithm';
import { determineSubtypeStack } from '@/utils/subtypeCalculation';

interface TestCase {
  id: string;
  description: string;
  selections: number[];
  expectedType: string;
  expectedConfidence?: number;
  wingSelection?: number;
  expectedWing?: string;
}

interface ValidationResult {
  testId: string;
  passed: boolean;
  actualType: string;
  expectedType: string;
  actualConfidence: number;
  actualWing?: string;
  expectedWing?: string;
  error?: string;
}

// Test Cases Based on Specification Logic
const FOUNDATION_TEST_CASES: TestCase[] = [
  // Head Center Dominant (Types 5, 6, 7)
  {
    id: "HEAD_PURE_TYPE5",
    description: "Pure Head center with security/knowledge focus → Type 5",
    selections: [0, 0, 0, 0, 0, 0, 0, 0, 0], // All Head/Security/Internal choices
    expectedType: "5"
  },
  {
    id: "HEAD_PURE_TYPE6", 
    description: "Pure Head center with security/caution focus → Type 6",
    selections: [0, 0, 2, 1, 2, 0, 1, 0, 1], // Head + Security + Cooperative
    expectedType: "6"
  },
  {
    id: "HEAD_PURE_TYPE7",
    description: "Pure Head center with optimism focus → Type 7", 
    selections: [0, 1, 1, 0, 1, 1, 2, 2, 0], // Head + Identity + Assertive + Recognition
    expectedType: "7"
  },
  
  // Heart Center Dominant (Types 2, 3, 4)
  {
    id: "HEART_PURE_TYPE2",
    description: "Pure Heart center with helping focus → Type 2",
    selections: [1, 1, 2, 1, 1, 1, 1, 1, 1], // All Heart/Identity/Connection choices
    expectedType: "2"
  },
  {
    id: "HEART_PURE_TYPE3",
    description: "Pure Heart center with achievement focus → Type 3",
    selections: [1, 1, 1, 2, 2, 1, 2, 2, 2], // Heart + Identity + Assertive
    expectedType: "3"
  },
  {
    id: "HEART_PURE_TYPE4",
    description: "Pure Heart center with individuality focus → Type 4",
    selections: [1, 1, 0, 0, 1, 1, 0, 1, 0], // Heart + Identity + Internal
    expectedType: "4"
  },
  
  // Body Center Dominant (Types 1, 8, 9)
  {
    id: "BODY_PURE_TYPE1",
    description: "Pure Body center with standards focus → Type 1",
    selections: [2, 2, 2, 2, 0, 2, 0, 0, 2], // Body + Power + Cooperative + Standards focus
    expectedType: "1"
  },
  {
    id: "BODY_PURE_TYPE8",
    description: "Pure Body center with power focus → Type 8",
    selections: [2, 2, 1, 2, 2, 2, 2, 2, 2], // Body + Power + Assertive + Control
    expectedType: "8"
  },
  {
    id: "BODY_PURE_TYPE9",
    description: "Pure Body center with harmony focus → Type 9",
    selections: [2, 2, 0, 1, 0, 0, 0, 1, 1], // Body + Power + Internal + Harmony focus
    expectedType: "9"
  },
  
  // Edge Cases and Mixed Patterns
  {
    id: "MIXED_PATTERN_1",
    description: "Mixed pattern favoring Type 1 characteristics",
    selections: [2, 2, 2, 0, 0, 2, 0, 0, 0], // Body + Power + Standards focus
    expectedType: "1"
  },
  {
    id: "MIXED_PATTERN_6",
    description: "Mixed pattern favoring Type 6 characteristics", 
    selections: [0, 0, 2, 1, 0, 0, 1, 0, 1], // Head + Security + Cooperative
    expectedType: "6"
  }
];

// Wing Validation Test Cases
const WING_TEST_CASES = [
  { type: "1", selection: 0, expectedWing: "9", description: "Type 1 with Wing 9" },
  { type: "1", selection: 1, expectedWing: "2", description: "Type 1 with Wing 2" },
  { type: "2", selection: 0, expectedWing: "1", description: "Type 2 with Wing 1" },
  { type: "2", selection: 1, expectedWing: "3", description: "Type 2 with Wing 3" },
  { type: "3", selection: 0, expectedWing: "2", description: "Type 3 with Wing 2" },
  { type: "3", selection: 1, expectedWing: "4", description: "Type 3 with Wing 4" },
  { type: "4", selection: 0, expectedWing: "3", description: "Type 4 with Wing 3" },
  { type: "4", selection: 1, expectedWing: "5", description: "Type 4 with Wing 5" },
  { type: "5", selection: 0, expectedWing: "4", description: "Type 5 with Wing 4" },
  { type: "5", selection: 1, expectedWing: "6", description: "Type 5 with Wing 6" },
  { type: "6", selection: 0, expectedWing: "5", description: "Type 6 with Wing 5" },
  { type: "6", selection: 1, expectedWing: "7", description: "Type 6 with Wing 7" },
  { type: "7", selection: 0, expectedWing: "6", description: "Type 7 with Wing 6" },
  { type: "7", selection: 1, expectedWing: "8", description: "Type 7 with Wing 8" },
  { type: "8", selection: 0, expectedWing: "7", description: "Type 8 with Wing 7" },
  { type: "8", selection: 1, expectedWing: "9", description: "Type 8 with Wing 9" },
  { type: "9", selection: 0, expectedWing: "8", description: "Type 9 with Wing 8" },
  { type: "9", selection: 1, expectedWing: "1", description: "Type 9 with Wing 1" }
];

// Subtype Test Cases
const SUBTYPE_TEST_CASES = [
  { distribution: { self: 7, oneToOne: 2, social: 1 }, expectedPrimary: "self", expectedStack: "dominant" },
  { distribution: { self: 1, oneToOne: 7, social: 2 }, expectedPrimary: "oneToOne", expectedStack: "dominant" },
  { distribution: { self: 2, oneToOne: 1, social: 7 }, expectedPrimary: "social", expectedStack: "dominant" },
  { distribution: { self: 4, oneToOne: 3, social: 3 }, expectedPrimary: "self", expectedStack: "moderate" },
  { distribution: { self: 3, oneToOne: 4, social: 3 }, expectedPrimary: "oneToOne", expectedStack: "moderate" },
  { distribution: { self: 3, oneToOne: 3, social: 4 }, expectedPrimary: "social", expectedStack: "moderate" },
  { distribution: { self: 4, oneToOne: 3, social: 3 }, expectedPrimary: "self", expectedStack: "balanced" }
];

export class AlgorithmValidator {
  private results: ValidationResult[] = [];
  
  // Test Foundation Stones Algorithm
  testFoundationAlgorithm(): ValidationResult[] {
    console.log("Testing Foundation Stones Algorithm...");
    
    FOUNDATION_TEST_CASES.forEach(testCase => {
      try {
        const result = determinePersonalityType(testCase.selections);
        const passed = result.primaryType === testCase.expectedType;
        
        this.results.push({
          testId: testCase.id,
          passed,
          actualType: result.primaryType,
          expectedType: testCase.expectedType,
          actualConfidence: result.confidence,
          error: passed ? undefined : `Expected ${testCase.expectedType}, got ${result.primaryType}`
        });
        
        console.log(`${passed ? 'PASS' : 'FAIL'} ${testCase.description}`);
        console.log(`   Expected: Type ${testCase.expectedType}, Got: Type ${result.primaryType} (${Math.round(result.confidence * 100)}% confidence)`);
        
      } catch (error) {
        this.results.push({
          testId: testCase.id,
          passed: false,
          actualType: "ERROR",
          expectedType: testCase.expectedType,
          actualConfidence: 0,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });
    
    return this.results.filter(r => r.testId.includes("HEAD_") || r.testId.includes("HEART_") || r.testId.includes("BODY_") || r.testId.includes("MIXED_"));
  }
  
  // Test Wing Calculation
  testWingCalculation(): ValidationResult[] {
    console.log("\nTesting Wing Calculation...");
    
    WING_TEST_CASES.forEach(testCase => {
      try {
        const wingResult = determineWing(testCase.type, testCase.selection);
        const passed = wingResult.wing === testCase.expectedWing;
        
        this.results.push({
          testId: `WING_${testCase.type}_${testCase.selection}`,
          passed,
          actualType: testCase.type,
          expectedType: testCase.type,
          actualConfidence: 1.0,
          actualWing: wingResult.wing,
          expectedWing: testCase.expectedWing,
          error: passed ? undefined : `Expected wing ${testCase.expectedWing}, got ${wingResult.wing}`
        });
        
        console.log(`${passed ? 'PASS' : 'FAIL'} ${testCase.description}`);
        console.log(`   Expected: Wing ${testCase.expectedWing}, Got: Wing ${wingResult.wing}`);
        
      } catch (error) {
        this.results.push({
          testId: `WING_${testCase.type}_${testCase.selection}`,
          passed: false,
          actualType: "ERROR",
          expectedType: testCase.type,
          actualConfidence: 0,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });
    
    return this.results.filter(r => r.testId.includes("WING_"));
  }
  
  // Test Subtype Calculation
  testSubtypeCalculation(): ValidationResult[] {
    console.log("\nTesting Subtype Calculation...");
    
    SUBTYPE_TEST_CASES.forEach((testCase, index) => {
      try {
        const subtypeResult = determineSubtypeStack(testCase.distribution);
        const passed = subtypeResult.primary === testCase.expectedPrimary && 
                      subtypeResult.stackType === testCase.expectedStack;
        
        this.results.push({
          testId: `SUBTYPE_${index}`,
          passed,
          actualType: subtypeResult.primary,
          expectedType: testCase.expectedPrimary,
          actualConfidence: subtypeResult.dominance[subtypeResult.primary as keyof typeof subtypeResult.dominance] / 100,
          error: passed ? undefined : `Expected ${testCase.expectedPrimary}/${testCase.expectedStack}, got ${subtypeResult.primary}/${subtypeResult.stackType}`
        });
        
        console.log(`${passed ? 'PASS' : 'FAIL'} Distribution ${JSON.stringify(testCase.distribution)}`);
        console.log(`   Expected: ${testCase.expectedPrimary}/${testCase.expectedStack}, Got: ${subtypeResult.primary}/${subtypeResult.stackType}`);
        
      } catch (error) {
        this.results.push({
          testId: `SUBTYPE_${index}`,
          passed: false,
          actualType: "ERROR",
          expectedType: testCase.expectedPrimary,
          actualConfidence: 0,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });
    
    return this.results.filter(r => r.testId.includes("SUBTYPE_"));
  }
  
  // Comprehensive Algorithm Test
  runAllTests(): ValidationResult[] {
    console.log("Starting Comprehensive Algorithm Validation\n");
    
    this.results = [];
    
    this.testFoundationAlgorithm();
    this.testWingCalculation();
    this.testSubtypeCalculation();
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`\nTest Results Summary:`);
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${passedTests} (${Math.round(passedTests/totalTests*100)}%)`);
    console.log(`   Failed: ${failedTests} (${Math.round(failedTests/totalTests*100)}%)`);
    
    if (failedTests > 0) {
      console.log(`\nFailed Tests:`);
      this.results.filter(r => !r.passed).forEach(result => {
        console.log(`   - ${result.testId}: ${result.error}`);
      });
    }
    
    return this.results;
  }
  
  // Generate detailed test report
  generateReport(): string {
    const report = [];
    report.push("# Assessment Algorithm Validation Report\n");
    
    const foundationResults = this.results.filter(r => r.testId.includes("HEAD_") || r.testId.includes("HEART_") || r.testId.includes("BODY_") || r.testId.includes("MIXED_"));
    const wingResults = this.results.filter(r => r.testId.includes("WING_"));
    const subtypeResults = this.results.filter(r => r.testId.includes("SUBTYPE_"));
    
    report.push("## Foundation Stones Algorithm");
    report.push(`Passed: ${foundationResults.filter(r => r.passed).length}/${foundationResults.length}`);
    foundationResults.forEach(result => {
      report.push(`- ${result.testId}: ${result.passed ? 'PASS' : 'FAIL'} - ${result.error || 'Success'}`);
    });
    
    report.push("\n## Wing Calculation");
    report.push(`Passed: ${wingResults.filter(r => r.passed).length}/${wingResults.length}`);
    wingResults.forEach(result => {
      report.push(`- ${result.testId}: ${result.passed ? 'PASS' : 'FAIL'} - ${result.error || 'Success'}`);
    });
    
    report.push("\n## Subtype Calculation");
    report.push(`Passed: ${subtypeResults.filter(r => r.passed).length}/${subtypeResults.length}`);
    subtypeResults.forEach(result => {
      report.push(`- ${result.testId}: ${result.passed ? 'PASS' : 'FAIL'} - ${result.error || 'Success'}`);
    });
    
    return report.join('\n');
  }
}

// Export validation functions for use in browser console
export const runAlgorithmValidation = () => {
  const validator = new AlgorithmValidator();
  const results = validator.runAllTests();
  console.log("\nDetailed Report:");
  console.log(validator.generateReport());
  return results;
};

// Quick test function for specific scenarios
export const testSpecificScenario = (selections: number[], description: string) => {
  console.log(`Testing: ${description}`);
  console.log(`Selections: [${selections.join(', ')}]`);
  
  const result = determinePersonalityType(selections);
  console.log(`Result: Type ${result.primaryType} (${Math.round(result.confidence * 100)}% confidence)`);
  console.log(`Type Name: ${getTypeName(result.primaryType)}`);
  console.log(`Raw Scores:`, result.rawScores);
  console.log(`Normalized Scores:`, result.allScores);
  
  return result;
};