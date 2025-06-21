import fs from 'fs';

async function quickSentinelCopy() {
  try {
    // Read original file
    const content = fs.readFileSync('challenger-demo-report.html', 'utf8');
    
    // Simple text replacements first
    let updated = content
      .replace(/The Challenger 9/g, 'The Sentinel 8')
      .replace(/Challenger 9/g, 'Sentinel 8')
      .replace(/challenger 9/g, 'sentinel 8');
    
    // Send to OpenAI for personality pattern updates
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
            content: "Replace personality patterns: Change from Challenger (power + peace-seeking) to Sentinel (power + self-reliance). Keep HTML structure identical."
          },
          {
            role: "user",
            content: `Update personality descriptions in this HTML. Change patterns from conflict-avoidant to independence-focused:\n\n${updated.substring(0, 8000)}`
          }
        ],
        temperature: 0.2,
        max_tokens: 8000
      })
    });

    const data = await response.json();
    const result = data.choices[0].message.content;
    
    // Save result
    fs.writeFileSync('sentinel-8-challenger-copy.html', result);
    console.log('Generated sentinel-8-challenger-copy.html');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

quickSentinelCopy();