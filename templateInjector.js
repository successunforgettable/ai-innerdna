import fs from 'fs';
import { calculateProgressPercentages } from './calculateProgressPercentages.js';

function injectContentIntoTemplate(contentData) {
  let template = fs.readFileSync('./challenger_template.html', 'utf8');
  
  // VERIFY challenger template is being used
  if (!template.includes('#6B46C1') || !template.includes('Playfair Display')) {
    throw new Error('CRITICAL: challenger_template.html not found or corrupted');
  }
  
  // Calculate dynamic percentages
  const percentages = calculateProgressPercentages(contentData.assessmentData);
  
  // Replace specific progress bar percentages with dynamic ones
  template = template.replace(
    /<div class="progress-fill" style="width: 40%;"><\/div>/g, 
    `<div class="progress-fill" style="width: ${percentages.before.career}%;"></div>`
  );
  template = template.replace(
    /<div class="progress-fill" style="width: 35%;"><\/div>/g, 
    `<div class="progress-fill" style="width: ${percentages.before.finances}%;"></div>`
  );
  template = template.replace(
    /<div class="progress-fill" style="width: 30%;"><\/div>/g, 
    `<div class="progress-fill" style="width: ${percentages.before.relationships}%;"></div>`
  );
  template = template.replace(
    /<div class="progress-fill" style="width: 25%;"><\/div>/g, 
    `<div class="progress-fill" style="width: ${percentages.before.mental}%;"></div>`
  );
  template = template.replace(
    /<div class="progress-fill" style="width: 45%;"><\/div>/g, 
    `<div class="progress-fill" style="width: ${percentages.before.environment}%;"></div>`
  );
  template = template.replace(
    /<div class="progress-fill" style="width: 20%;"><\/div>/g, 
    `<div class="progress-fill" style="width: ${percentages.before.growth}%;"></div>`
  );
  
  // Replace content placeholders
  Object.keys(contentData).forEach(key => {
    template = template.replaceAll(`{{${key}}}`, contentData[key]);
  });
  
  return template;
}

export { injectContentIntoTemplate };