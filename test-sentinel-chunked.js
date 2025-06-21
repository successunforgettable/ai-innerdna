// Isolated test system for debugging Sentinel 8 report generation
// This does NOT affect the current working app

async function generateContentWithFetch(prompt) {
  console.log(`🔄 Starting OpenAI request at ${new Date().toISOString()}`);
  console.log(`📝 Prompt length: ${prompt.length} characters`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Request timeout triggered after 120 seconds');
      controller.abort();
    }, 120000);

    console.log('🌐 Making fetch request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log(`✅ Response received. Status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    console.log('📦 Parsing JSON response...');
    const data = await response.json();
    
    console.log('🔍 Validating response structure...');
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Invalid response structure:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response structure from OpenAI');
    }
    
    console.log('✨ Parsing generated content...');
    const content = JSON.parse(data.choices[0].message.content);
    console.log(`🎯 Successfully generated content with keys: ${Object.keys(content).join(', ')}`);
    
    return content;
  } catch (error) {
    console.error('💥 OpenAI API Error Details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    if (error.name === 'AbortError') {
      console.error('🔥 Request was aborted due to timeout');
    }
    
    throw error;
  }
}

function generateStage1Prompt() {
  return `Generate Stage 1 transformation content for a Sentinel 8 with:
- Wing: 9
- State: 60% destructive, 40% good
- Subtype: selfPreservation dominant, sexual blind

Create a detailed stage 1 description focusing on recognizing destructive control patterns and beginning the journey to protective leadership. Return as JSON: {"stage1Description": "content", "brainHeartDisconnect": "CONTROL ADDICTION DETECTED message", "heroTitle": "transformation title"}`;
}

function generateChallengePrompt() {
  return `Generate 3 challenge cards for Sentinel 8 transformation based on:
- Dominant: selfPreservation
- Blind: sexual
- State ratio: 60%/40% destructive/good

Return as JSON: {"challengeCards": [{"title": "title", "description": "description", "icon": "icon"}, ...]}`;
}

async function testSentinelGeneration() {
  console.log('🚀 Starting Sentinel 8 report generation test...');
  console.log('⏰ Test started at:', new Date().toISOString());
  
  const chunks = [
    { section: 'stage1', prompt: generateStage1Prompt() },
    { section: 'challenges', prompt: generateChallengePrompt() }
  ];
  
  const results = {};
  
  for (const chunk of chunks) {
    try {
      console.log(`\n🎯 === GENERATING ${chunk.section.toUpperCase()} ===`);
      console.log(`📋 Section: ${chunk.section}`);
      console.log(`📝 Prompt preview: ${chunk.prompt.substring(0, 100)}...`);
      
      const startTime = Date.now();
      results[chunk.section] = await generateContentWithFetch(chunk.prompt);
      const endTime = Date.now();
      
      console.log(`⚡ ${chunk.section} completed in ${endTime - startTime}ms`);
      console.log(`📊 Generated keys: ${Object.keys(results[chunk.section]).join(', ')}`);
      
      // Add delay between requests
      console.log('⏳ Waiting 2 seconds before next request...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`💀 Failed to generate ${chunk.section}:`);
      console.error('Error details:', error.message);
      console.error('Full error:', error);
      
      // Use fallback for this section
      results[chunk.section] = { 
        error: true, 
        message: `Failed to generate ${chunk.section}: ${error.message}`,
        fallback: `Fallback content for ${chunk.section}`
      };
    }
  }
  
  console.log('\n🏁 === TEST COMPLETE ===');
  console.log('📋 Final results:', JSON.stringify(results, null, 2));
  console.log('⏰ Test completed at:', new Date().toISOString());
  
  return results;
}

// Run the test
testSentinelGeneration().catch(error => {
  console.error('🔥 TEST FAILED:', error);
  process.exit(1);
});