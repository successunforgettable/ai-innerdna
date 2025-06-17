// Debug script to check assessment data structure
const data = localStorage.getItem('inner-dna-assessments');
if (data) {
  const assessments = JSON.parse(data);
  console.log('Total assessments:', assessments.length);
  
  assessments.forEach((assessment, index) => {
    console.log(`\nAssessment ${index + 1}:`);
    console.log('ID:', assessment.id);
    console.log('Primary Type:', assessment.primaryType);
    console.log('Result:', assessment.result);
    console.log('Type Name:', assessment.typeName);
    console.log('Personality Name:', assessment.personalityName);
    console.log('Foundation Data:', assessment.foundationSelections?.length || 0);
    console.log('Has Complete Data:', !!(assessment.foundationSelections && assessment.buildingSelections && assessment.colorSelections));
  });
} else {
  console.log('No assessment data found');
}