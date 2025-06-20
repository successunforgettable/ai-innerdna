// Test script to generate Challenger report with sample data
const { generateCustomReport, generateCustomReportHTML } = require('./server/customReportGenerator.ts');

async function testChallengerReport() {
  const sampleChallengerData = {
    primaryType: "Type 8",
    confidence: 85,
    wing: "9",
    colorStates: [
      { state: "Achievement", percentage: 45 },
      { state: "Security", percentage: 55 }
    ],
    detailTokens: [
      { category: "self", token: "4" },
      { category: "oneToOne", token: "3" },
      { category: "social", token: "3" }
    ],
    foundationStones: [
      { statements: ["I trust my gut instincts"], stoneIndex: 0 },
      { statements: ["I am driven by achievement"], stoneIndex: 1 },
      { statements: ["I express energy outwardly"], stoneIndex: 1 },
      { statements: ["I focus on individual goals"], stoneIndex: 1 },
      { statements: ["I process emotions practically"], stoneIndex: 1 },
      { statements: ["I have a realistic perspective"], stoneIndex: 1 },
      { statements: ["I prefer independent work"], stoneIndex: 1 },
      { statements: ["I adapt flexibly"], stoneIndex: 1 },
      { statements: ["I accept challenges"], stoneIndex: 1 }
    ],
    buildingBlocks: [
      { name: "Leadership" },
      { name: "Independence" },
      { name: "Analysis" }
    ]
  };

  try {
    console.log('Generating Challenger report...');
    const reportData = await generateCustomReport(sampleChallengerData);
    console.log('\n=== CHALLENGER REPORT DATA ===');
    console.log(JSON.stringify(reportData, null, 2));
    
    const htmlReport = generateCustomReportHTML(reportData);
    console.log('\n=== HTML REPORT GENERATED ===');
    console.log('Report length:', htmlReport.length, 'characters');
    console.log('Title:', reportData.heroTitle);
    console.log('Subtitle:', reportData.heroSubtitle);
    console.log('Life Areas:', reportData.lifeAreas.length);
    console.log('Transformation Stages:', reportData.transformationStages.length);
    
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

testChallengerReport();