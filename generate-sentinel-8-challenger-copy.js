import fs from 'fs';

async function generateSentinel8ChallengerCopy() {
  try {
    // Read the original challenger demo report
    const originalContent = fs.readFileSync('challenger-demo-report.html', 'utf8');
    
    // Create OpenAI request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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

COPY EDITING WORKFLOW:
1. Find "The Challenger 9" and replace with "The Sentinel 8"
2. Find "Challenger 9" and replace with "Sentinel 8"
3. Replace personality descriptions with Sentinel 8 patterns:
   - Self-reliance instead of confrontation
   - Independence instead of challenging others
   - Control instead of power struggles
   - Protection instead of aggression
   - Justice instead of fighting
   - Authority instead of rebellion

SENTINEL 8 PATTERNS:
- Driven by need for control and self-reliance
- Protective of self and territory
- Values independence and autonomy
- Struggles with vulnerability and trust
- Natural authority figure
- Justice-oriented
- Self-preservation focused
- Avoids being controlled by others
- Direct communication style
- Strong boundaries

FORBIDDEN EDITS:
❌ Changing <style> section
❌ Modifying CSS classes or IDs  
❌ Altering JavaScript code
❌ Changing HTML structure or layout
❌ Adding new visual elements

Return the complete edited HTML file with ONLY text content changes.`
          },
          {
            role: "user",
            content: `Edit this HTML file to replace Challenger 9 content with Sentinel 8 content. ONLY change text content, keep all HTML structure, CSS, and JavaScript identical:\n\n${originalContent}`
          }
        ],
        temperature: 0.3,
        max_tokens: 16000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const editedContent = data.choices[0].message.content;

    // Save the edited version
    fs.writeFileSync('sentinel-8-challenger-copy.html', editedContent);
    
    console.log('✅ Successfully generated Sentinel 8 challenger copy');
    console.log('📄 File saved as: sentinel-8-challenger-copy.html');
    console.log(`📊 Character count: ${editedContent.length}`);
    
    return editedContent;
    
  } catch (error) {
    console.error('❌ Error generating Sentinel 8 copy:', error.message);
    throw error;
  }
}

// Run the generator
generateSentinel8ChallengerCopy().catch(console.error);