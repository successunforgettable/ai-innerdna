function injectContentIntoTemplate(chatgptGeneratedContent) {
  const fs = require('fs');
  
  try {
    // Read the challenger template
    let templateHTML = fs.readFileSync('challenger_template.html', 'utf8');
    
    // Replace all placeholders with ChatGPT-generated content
    Object.keys(chatgptGeneratedContent).forEach(placeholder => {
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      templateHTML = templateHTML.replace(regex, chatgptGeneratedContent[placeholder]);
    });
    
    return templateHTML;
  } catch (error) {
    console.error('Error injecting content into template:', error);
    throw error;
  }
}

function createPlaceholderTemplate(originalTemplate) {
  // This function creates a template with placeholders from the original
  // Used for identifying where content should be injected
  return originalTemplate.replace(/{{([^}]+)}}/g, '{{$1}}');
}

module.exports = { injectContentIntoTemplate, createPlaceholderTemplate };