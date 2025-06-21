import fs from 'fs';
import path from 'path';

export async function generateSentinelCopy(): Promise<string> {
  try {
    // Read the original challenger demo report
    const filePath = path.join(process.cwd(), 'challenger-demo-report.html');
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Create OpenAI request for copy editing
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `ROLE: You are a COPY EDITOR, not a designer
TASK: Edit existing HTML file content ONLY

CRITICAL RULES:
🚫 DO NOT create new HTML structure
🚫 DO NOT write new CSS code  
🚫 DO NOT change fonts, colors, or animations
🚫 DO NOT modify layout or design elements
✅ ONLY edit text content within existing HTML tags
✅ ONLY replace personality-specific descriptions
✅ KEEP all styling, structure, and effects identical

PERSONALITY PATTERNS TO REPLACE:
OLD (Challenger 9): Power + peace-seeking, conflict avoidance
NEW (Sentinel 8): Power + self-reliance, independence focus

EXACT REPLACEMENTS:
- "The Challenger 9" → "The Sentinel 8"
- "Challenger 9" → "Sentinel 8"
- "You step forward when others step back, but secretly feel exhausted" → "You stand alone and strong, but secretly feel isolated"
- "Your 9 influence craves harmony, yet you seem to attract conflict" → "Your 8 intensity drives justice, yet you struggle with vulnerability"

KEEP IDENTICAL:
- All percentages (60%, 40%, progress bar percentages)
- All section structures and word counts
- All testimonial formats and placement
- All CTA button text and positioning
- Purple-gold-cyan gradient background
- Floating elements (⚡💫🌟✨) in same positions
- Hero title with gradient text effect
- Same 11-stage layout with large stage numbers
- Same brain-heart SVG animations
- Same card layouts and hover effects
- Same progress bars and percentages
- Same testimonial styling with gold borders

Return the complete edited HTML file with only text content changes.`
          },
          {
            role: "user",
            content: originalContent
          }
        ],
        temperature: 0.2,
        max_tokens: 16000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const editedContent = data.choices[0].message.content;

    // Save the edited version
    const outputPath = path.join(process.cwd(), 'sentinel-8-challenger-copy.html');
    fs.writeFileSync(outputPath, editedContent);
    
    console.log('✅ Sentinel 8 copy generated successfully');
    console.log('📄 File saved as: sentinel-8-challenger-copy.html');
    console.log(`📊 Length: ${editedContent.length} characters`);
    
    return editedContent;
    
  } catch (error) {
    console.error('❌ Error generating Sentinel 8 copy:', error);
    throw error;
  }
}