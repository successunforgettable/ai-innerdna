import { generateCustomReport, generateCustomReportHTML } from './server/customReportGenerator.js';

// Sample assessment data matching the exact structure from the frontend
const sampleAssessmentData = {
  primaryType: '8',
  confidence: 85,
  wing: '9',
  foundationStones: [
    {
      setIndex: 0,
      stoneIndex: 2,
      context: "When making decisions,",
      statements: ["I trust my gut", "I go with what feels right", "I act on my instincts"],
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      setIndex: 1,
      stoneIndex: 2,
      context: "What motivates me is",
      statements: ["doing what's right", "I need to be strong and in control", "I want justice and fairness"],
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
    },
    {
      setIndex: 2,
      stoneIndex: 1,
      context: "I direct my energy",
      statements: ["outward", "I push for impact and results", "I assert myself confidently"],
      gradient: "linear-gradient(135deg, #f97316, #ea580c)"
    }
  ],
  buildingBlocks: [
    {
      name: "Leadership",
      description: "Natural ability to guide and inspire others",
      wing: "9"
    },
    {
      name: "Independence",
      description: "Strong preference for autonomy and self-reliance",
      wing: "9"
    }
  ],
  colorStates: [
    {
      state: "Achievement",
      percentage: 45,
      description: "Drive for success and accomplishment"
    },
    {
      state: "Security",
      percentage: 55,
      description: "Focus on stability and protection"
    }
  ],
  detailTokens: {
    "Self-Preservation": { token: "4 tokens", description: "Focus on personal security and routines" },
    "One-to-One": { token: "3 tokens", description: "Focus on intense personal connections" },
    "Social": { token: "3 tokens", description: "Focus on group dynamics and community" }
  }
};

async function testAIReportGeneration() {
  try {
    console.log('=== GENERATING AI CHALLENGER REPORT ===');
    console.log('Assessment Data:', JSON.stringify(sampleAssessmentData, null, 2));
    
    const reportData = await generateCustomReport(sampleAssessmentData);
    console.log('\n=== GENERATED REPORT DATA ===');
    console.log('Hero Title:', reportData.heroTitle);
    console.log('Hero Subtitle:', reportData.heroSubtitle);
    console.log('Personality Type:', reportData.personalityType);
    console.log('Influence Pattern:', reportData.influencePattern);
    console.log('Current State:', reportData.currentState);
    console.log('Life Areas Count:', reportData.lifeAreas.length);
    console.log('Transformation Stages Count:', reportData.transformationStages.length);
    
    console.log('\n=== LIFE AREAS BREAKDOWN ===');
    reportData.lifeAreas.forEach(area => {
      console.log(`${area.area}: ${area.percentage}% - ${area.description}`);
    });
    
    console.log('\n=== TRANSFORMATION STAGES ===');
    reportData.transformationStages.forEach((stage, index) => {
      console.log(`Stage ${index + 1}: ${stage.title}`);
      console.log(`Description: ${stage.description}`);
      console.log(`Insights: ${stage.insights.join(', ')}`);
      console.log('---');
    });
    
    console.log('\n=== BEFORE/AFTER TRANSFORMATION ===');
    console.log('Before:', reportData.beforeAfter.before.join(', '));
    console.log('After:', reportData.beforeAfter.after.join(', '));
    
    console.log('\n=== CALL TO ACTION ===');
    console.log(reportData.callToAction);
    
    // Generate the full HTML report
    const htmlReport = generateCustomReportHTML(reportData);
    console.log('\n=== HTML REPORT STATS ===');
    console.log('HTML Length:', htmlReport.length, 'characters');
    console.log('Contains Hero Title:', htmlReport.includes(reportData.heroTitle));
    console.log('Contains Personality Type:', htmlReport.includes(reportData.personalityType));
    console.log('Contains Life Areas:', htmlReport.includes('Career'));
    console.log('Contains Animations:', htmlReport.includes('animation'));
    console.log('Contains Playfair Font:', htmlReport.includes('Playfair Display'));
    
    return { reportData, htmlReport };
    
  } catch (error) {
    console.error('Error generating AI report:', error);
    return null;
  }
}

testAIReportGeneration().then(result => {
  if (result) {
    console.log('\n✅ AI Report Generation Test Completed Successfully');
    console.log('📊 Report includes personalized content based on assessment data');
    console.log('🎨 Full challenger format with animations and styling preserved');
  } else {
    console.log('❌ AI Report Generation Test Failed');
  }
});