// Quick algorithm validation test
import { runAlgorithmValidation } from './algorithmValidation';

console.log("Running corrected algorithm validation...");
const results = runAlgorithmValidation();

const summary = {
  total: results.length,
  passed: results.filter(r => r.passed).length,
  failed: results.filter(r => !r.passed).length
};

console.log(`Fixed Algorithm Results: ${summary.passed}/${summary.total} tests passed (${Math.round(summary.passed/summary.total*100)}%)`);

if (summary.failed > 0) {
  console.log("Remaining failures:");
  results.filter(r => !r.passed).forEach(r => {
    console.log(`- ${r.testId}: ${r.error}`);
  });
} else {
  console.log("All algorithm tests now pass!");
}