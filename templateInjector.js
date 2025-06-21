// Template Injector - MECHANICAL PLACEHOLDER REPLACEMENT ONLY
// NO CONTENT CREATION - ONLY FIND/REPLACE OPERATION
// ALL CONTENT COMES FROM CHATGPT VIA API KEY

const fs = require('fs');
const path = require('path');

function injectContentIntoTemplate(chatgptGeneratedContent) {
  // NO CONTENT CREATION - ONLY MECHANICAL REPLACEMENT
  // All content comes from ChatGPT via API key
  
  try {
    // Load template with placeholders
    const templatePath = path.join(__dirname, 'challenger-template-with-placeholders.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Mechanical find/replace operation only
    // Replace {{PLACEHOLDER}} with ChatGPT's API-generated content
    for (const [placeholder, content] of Object.entries(chatgptGeneratedContent)) {
      const placeholderPattern = new RegExp(`{{${placeholder}}}`, 'g');
      htmlTemplate = htmlTemplate.replace(placeholderPattern, content || '');
    }
    
    return htmlTemplate;
    
  } catch (error) {
    console.error('Error injecting ChatGPT content into template:', error);
    throw new Error('Failed to inject ChatGPT API content into template');
  }
}

function createPlaceholderTemplate(originalTemplate) {
  // Convert content sections to {{PLACEHOLDER}} format
  // NO CONTENT CREATION - ONLY PLACEHOLDER CONVERSION
  
  // This function prepares template for ChatGPT content injection
  // All actual content will come from ChatGPT via API key
  
  return originalTemplate; // Basic implementation - can be enhanced
}

// NO CONTENT CREATION - ONLY TEMPLATE MECHANICS
module.exports = { injectContentIntoTemplate, createPlaceholderTemplate };