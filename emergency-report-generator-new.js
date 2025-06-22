import fs from 'fs';
import path from 'path';

// Read the complete test-genspark-design.html template
function getGensparkTemplateBase() {
  const templatePath = path.join(process.cwd(), 'public', 'test-genspark-design.html');
  return fs.readFileSync(templatePath, 'utf8');
}

export async function generateCompleteStyledReport(typeId) {
  console.log(`🚀 New Genspark template generation for user ${typeId}`);
  
  // Get the base template
  let htmlContent = getGensparkTemplateBase();
  
  // Dynamic data generation
  const heartPercentage = Math.floor(Math.random() * 20) + 70; // 70-89%
  const hrvBaseline = getHRVBaseline(typeId);
  const personalityName = getPersonalityName(typeId);
  
  // Replace dynamic content placeholders - Multiple replacement passes
  // Pass 1: JavaScript animation target (with exact whitespace)
  htmlContent = htmlContent.replace(/const target = 78;/g, `const target = ${heartPercentage};`);
  
  // Pass 2: HTML span elements (exact match)
  htmlContent = htmlContent.replace(/<span id="heartPercentage">78<\/span>/g, `<span id="heartPercentage">${heartPercentage}</span>`);
  htmlContent = htmlContent.replace(/<span id="heartPercentage2">78<\/span>/g, `<span id="heartPercentage2">${heartPercentage}</span>`);
  
  // Pass 3: Personality type references - Remove all "Type X" terminology
  htmlContent = htmlContent.replace(/The Type 8 Challenger/g, `The ${personalityName}`);
  htmlContent = htmlContent.replace(/TYPE 8 CHALLENGER/g, personalityName.toUpperCase());
  htmlContent = htmlContent.replace(/THE Challenger/g, `THE ${personalityName}`);
  
  // Remove all "Type X" references completely
  htmlContent = htmlContent.replace(/Type 8/g, personalityName);
  htmlContent = htmlContent.replace(/Type 7/g, personalityName);
  htmlContent = htmlContent.replace(/Type 6/g, personalityName);
  htmlContent = htmlContent.replace(/Type 5/g, personalityName);
  htmlContent = htmlContent.replace(/Type 4/g, personalityName);
  htmlContent = htmlContent.replace(/Type 3/g, personalityName);
  htmlContent = htmlContent.replace(/Type 2/g, personalityName);
  htmlContent = htmlContent.replace(/Type 1/g, personalityName);
  htmlContent = htmlContent.replace(/Type 9/g, personalityName);
  
  // Remove remaining "THE TYPE X" patterns
  htmlContent = htmlContent.replace(/THE TYPE \d+/g, `THE ${personalityName.toUpperCase()}`);
  
  // Pass 4: Remaining percentage and HRV references
  htmlContent = htmlContent.replace(/78%/g, `${heartPercentage}%`);
  htmlContent = htmlContent.replace(/22ms/g, `${hrvBaseline}ms`);
  htmlContent = htmlContent.replace(/Your HRV: 22ms/g, `Your HRV: ${hrvBaseline}ms`);
  
  // Generate filename
  const timestamp = Date.now();
  const fileName = `emergency-report-${typeId}-${timestamp}.html`;
  
  // Save file
  fs.writeFileSync(fileName, htmlContent);
  
  // Return HTML content directly for viewing
  return htmlContent;
}

function getHRVBaseline(typeId) {
  const baselines = {
    1: 28, 2: 24, 3: 22, 4: 26, 5: 30,
    6: 25, 7: 23, 8: 22, 9: 27
  };
  return baselines[typeId] || 25;
}

function getPersonalityName(typeId) {
  const names = {
    1: "Type 1 Reformer",
    2: "Type 2 Helper", 
    3: "Type 3 Achiever",
    4: "Type 4 Individualist",
    5: "Type 5 Investigator",
    6: "Type 6 Sentinel",
    7: "Type 7 Enthusiast",
    8: "Type 8 Challenger",
    9: "Type 9 Peacemaker"
  };
  return names[typeId] || "Type 8 Challenger";
}