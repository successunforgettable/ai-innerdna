import fs from 'fs';

async function generateSentinel8Copy() {
  try {
    const originalContent = fs.readFileSync('challenger-demo-report.html', 'utf8');
    
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
            content: `You are a copy editor. Replace ALL instances of "Challenger 9" content with "Sentinel 8" content following these exact guidelines:

CRITICAL: Only change text content. Do not modify HTML structure, CSS, or JavaScript.

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

Return the complete edited HTML file with only text content changes.`
          },
          {
            role: "user", 
            content: originalContent
          }
        ],
        temperature: 0.2,
        max_tokens: 16000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const editedContent = data.choices[0].message.content;

    fs.writeFileSync('sentinel-8-challenger-copy.html', editedContent);
    
    console.log('✅ Sentinel 8 copy generated successfully');
    console.log('📄 Saved as: sentinel-8-challenger-copy.html');
    console.log(`📊 Length: ${editedContent.length} characters`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

generateSentinel8Copy();