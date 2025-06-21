import fs from 'fs';

function extractTemplateProperties() {
  const template = fs.readFileSync('./challenger_template.html', 'utf8');
  const placeholders = template.match(/\{\{[^}]+\}\}/g) || [];
  
  // Remove duplicates and sort
  const uniquePlaceholders = [...new Set(placeholders)].sort();
  
  console.log('Total unique placeholders:', uniquePlaceholders.length);
  console.log('\n=== ALL TEMPLATE PLACEHOLDERS ===');
  uniquePlaceholders.forEach((placeholder, index) => {
    console.log(`${index + 1}. ${placeholder}`);
  });
  
  return uniquePlaceholders.map(p => p.replace(/[{}]/g, ''));
}

// Extract and save placeholder list
console.log('Extracting placeholders from challenger_template.html...');
const placeholderNames = extractTemplateProperties();

// Save to JSON file
fs.writeFileSync('required_placeholders.json', JSON.stringify(placeholderNames, null, 2));
console.log('\n✓ Required placeholders saved to required_placeholders.json');

// Also create categorized mapping for easier content generation
const categorizedPlaceholders = {
  personality: placeholderNames.filter(p => p.includes('PERSONALITY')),
  hero: placeholderNames.filter(p => p.includes('HERO')),
  stages: placeholderNames.filter(p => p.includes('STAGE')),
  cards: placeholderNames.filter(p => p.includes('CARD')),
  testimonials: placeholderNames.filter(p => p.includes('TESTIMONIAL')),
  timeline: placeholderNames.filter(p => p.includes('TIMELINE')),
  wheel: placeholderNames.filter(p => p.includes('WHEEL')),
  before_after: placeholderNames.filter(p => p.includes('BEFORE') || p.includes('AFTER')),
  other: placeholderNames.filter(p => !p.includes('PERSONALITY') && !p.includes('HERO') && 
                                      !p.includes('STAGE') && !p.includes('CARD') && 
                                      !p.includes('TESTIMONIAL') && !p.includes('TIMELINE') && 
                                      !p.includes('WHEEL') && !p.includes('BEFORE') && 
                                      !p.includes('AFTER'))
};

fs.writeFileSync('categorized_placeholders.json', JSON.stringify(categorizedPlaceholders, null, 2));
console.log('✓ Categorized placeholders saved to categorized_placeholders.json');

console.log('\n=== PLACEHOLDER CATEGORIES ===');
Object.keys(categorizedPlaceholders).forEach(category => {
  console.log(`${category.toUpperCase()}: ${categorizedPlaceholders[category].length} placeholders`);
});

export { extractTemplateProperties };