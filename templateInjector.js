const fs = require('fs');
const { calculateProgressPercentages } = require('./calculateProgressPercentages');

function injectContentIntoTemplate(contentData) {
  let template = fs.readFileSync('./challenger_template.html', 'utf8');
  
  // VERIFY challenger template is being used
  if (!template.includes('#6B46C1') || !template.includes('Playfair Display')) {
    throw new Error('CRITICAL: challenger_template.html not found or corrupted');
  }
  
  // Calculate dynamic percentages
  const percentages = calculateProgressPercentages(contentData.assessmentData);
  
  // Replace hardcoded percentages with dynamic ones
  template = template.replace(/width: 40%;/g, `width: ${percentages.before.career}%;`);
  template = template.replace(/width: 35%;/g, `width: ${percentages.before.finances}%;`);
  template = template.replace(/width: 30%;/g, `width: ${percentages.before.relationships}%;`);
  template = template.replace(/width: 25%;/g, `width: ${percentages.before.mental}%;`);
  template = template.replace(/width: 45%;/g, `width: ${percentages.before.environment}%;`);
  template = template.replace(/width: 20%;/g, `width: ${percentages.before.growth}%;`);
  
  // Replace content placeholders
  Object.keys(contentData).forEach(key => {
    template = template.replaceAll(`{{${key}}}`, contentData[key]);
  });
  
  return template;
}

module.exports = { injectContentIntoTemplate };