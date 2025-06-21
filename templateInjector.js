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
  
  // DEBUG: Content injection process
  console.log('=== CONTENT INJECTION DEBUG ===');
  console.log('Content data received:', Object.keys(contentData));
  console.log('Template before replacement:', template.substring(0, 200));
  
  // Find all placeholders in template
  const placeholderMatches = template.match(/\{\{[^}]+\}\}/g) || [];
  console.log('Placeholders found in template:', placeholderMatches);
  
  // Replace content placeholders with detailed logging
  Object.keys(contentData).forEach(key => {
    if (key !== 'assessmentData') { // Skip assessment data object
      const placeholder = `{{${key}}}`;
      const replacement = contentData[key] || '[MISSING CONTENT]';
      console.log(`Replacing ${placeholder} with: ${replacement.substring(0, 50)}...`);
      
      const beforeCount = (template.match(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      template = template.replaceAll(placeholder, replacement);
      const afterCount = (template.match(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      
      console.log(`${placeholder}: ${beforeCount} found, ${beforeCount - afterCount} replaced`);
    }
  });
  
  console.log('Template after replacement:', template.substring(0, 200));
  
  // Check for remaining placeholders
  const remainingPlaceholders = template.match(/\{\{[^}]+\}\}/g) || [];
  if (remainingPlaceholders.length > 0) {
    console.log('WARNING: Unreplaced placeholders:', remainingPlaceholders);
  }
  
  return template;
}

export { injectContentIntoTemplate };