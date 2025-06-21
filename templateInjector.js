const fs = require('fs');

function injectContentIntoTemplate(contentData) {
  let template = fs.readFileSync('./challenger_template.html', 'utf8');
  
  Object.keys(contentData).forEach(key => {
    template = template.replaceAll(`{{${key}}}`, contentData[key]);
  });
  
  return template;
}

module.exports = { injectContentIntoTemplate };