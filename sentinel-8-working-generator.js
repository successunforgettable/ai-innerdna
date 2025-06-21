// Working Sentinel 8 Report Generator - Isolated from main app
import https from 'https';
import fs from 'fs';

// Create a custom agent with proper connection management
const httpsAgent = new https.Agent({
  keepAlive: false,
  maxSockets: 1,
  timeout: 30000
});

async function generateContentWithHTTPS(prompt) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      },
      agent: httpsAgent,
      timeout: 30000
    };

    console.log(`Making HTTPS request for prompt: ${prompt.substring(0, 50)}...`);

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            console.error(`HTTP ${res.statusCode}: ${data}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            return;
          }
          
          const response = JSON.parse(data);
          const content = JSON.parse(response.choices[0].message.content);
          console.log(`Success: Generated content with keys: ${Object.keys(content).join(', ')}`);
          resolve(content);
        } catch (error) {
          console.error('Parse error:', error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('Request timeout');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.setTimeout(30000);
    req.write(postData);
    req.end();
  });
}

// Generate all Sentinel 8 content sections
async function generateSentinel8Content() {
  const assessmentData = {
    personalityType: "Sentinel 8",
    wing: "9",
    stateDistribution: { destructive: 60, good: 40 },
    subtype: { dominant: "selfPreservation", blind: "sexual" },
    confidence: 87
  };

  console.log('Generating complete Sentinel 8 transformation report...');
  
  const prompts = {
    hero: `Generate hero section for Sentinel 8 with ${assessmentData.stateDistribution.destructive}% destructive patterns and ${assessmentData.subtype.dominant} dominance. Return JSON: {"heroTitle": "title", "brainHeartDisconnect": "CONTROL ADDICTION DETECTED message"}`,
    
    stage1: `Generate detailed Stage 1 transformation content for Sentinel 8 recognizing destructive control patterns. Focus on ${assessmentData.subtype.dominant} subtype with ${assessmentData.subtype.blind} blind spot. Return JSON: {"stage1Description": "comprehensive stage 1 content"}`,
    
    challenges: `Generate 3 specific challenge cards for Sentinel 8 transformation addressing control patterns, vulnerability, and trust issues based on ${assessmentData.subtype.dominant} dominance. Return JSON: {"challengeCards": [{"title": "title", "description": "description", "icon": "icon"}, {"title": "title", "description": "description", "icon": "icon"}, {"title": "title", "description": "description", "icon": "icon"}]}`,
    
    wheel: `Generate wheel of life percentages for Sentinel 8 with ${assessmentData.stateDistribution.destructive}% destructive patterns focusing on power, relationships, career, health, finance, and growth. Return JSON: {"wheelOfLife": [{"area": "Personal Power", "percentage": number, "description": "description"}, {"area": "Relationships", "percentage": number, "description": "description"}, {"area": "Career", "percentage": number, "description": "description"}, {"area": "Health", "percentage": number, "description": "description"}, {"area": "Finance", "percentage": number, "description": "description"}, {"area": "Personal Growth", "percentage": number, "description": "description"}]}`,
    
    testimonials: `Generate 3 authentic transformation testimonials for Sentinel 8 focusing on leadership transformation from control to protection. Return JSON: {"testimonials": [{"quote": "quote", "name": "name", "title": "title"}, {"quote": "quote", "name": "name", "title": "title"}, {"quote": "quote", "name": "name", "title": "title"}]}`,
    
    stages: `Generate hero journey stages 2-6 for Sentinel 8 transformation from destructive control to protective leadership, addressing ${assessmentData.subtype.dominant} patterns. Return JSON: {"heroJourneyStages": {"stage2": "content", "stage3": "content", "stage4": "content", "stage5": "content", "stage6": "content"}, "callToAction": "powerful transformation call to action"}`
  };

  const results = {};
  
  for (const [section, prompt] of Object.entries(prompts)) {
    try {
      console.log(`\nGenerating ${section}...`);
      const content = await generateContentWithHTTPS(prompt);
      Object.assign(results, content);
      
      // Wait between requests to avoid rate limiting
      console.log('Waiting 3 seconds before next request...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`Failed to generate ${section}:`, error.message);
      
      // Add fallback content
      const fallbacks = {
        hero: { heroTitle: "The Sentinel's Journey to Balanced Power", brainHeartDisconnect: "CONTROL ADDICTION DETECTED" },
        stage1: { stage1Description: "Beginning the transformation from reactive control to conscious leadership." },
        challenges: { challengeCards: [
          { title: "Control Patterns", description: "Recognizing destructive control behaviors", icon: "shield" },
          { title: "Vulnerability", description: "Learning to show authentic strength", icon: "heart" },
          { title: "Trust Issues", description: "Building genuine connections", icon: "users" }
        ]},
        wheel: { wheelOfLife: [
          { area: "Personal Power", percentage: 75, description: "Strong sense of personal authority and influence" },
          { area: "Relationships", percentage: 45, description: "Struggles with trust and emotional intimacy" },
          { area: "Career", percentage: 85, description: "Natural leadership abilities and drive for success" },
          { area: "Health", percentage: 65, description: "High energy but prone to stress-related issues" },
          { area: "Finance", percentage: 80, description: "Good at accumulating resources and financial security" },
          { area: "Personal Growth", percentage: 50, description: "Room for emotional intelligence development" }
        ]},
        testimonials: { testimonials: [
          { quote: "This system helped me transform my leadership from controlling to empowering.", name: "Marcus Chen", title: "CEO" },
          { quote: "I learned to channel my intensity into protective strength rather than domination.", name: "Sarah Rodriguez", title: "Director" },
          { quote: "The breakthrough came when I realized true power comes from vulnerability.", name: "David Kim", title: "Entrepreneur" }
        ]},
        stages: { 
          heroJourneyStages: {
            stage2: "Recognizing the destructive nature of control-based leadership",
            stage3: "Understanding the difference between power and force", 
            stage4: "Developing emotional intelligence and self-awareness",
            stage5: "Learning to lead through inspiration rather than intimidation",
            stage6: "Embracing protective leadership that empowers others"
          },
          callToAction: "Transform your power from destructive control to protective leadership. Your journey to balanced strength and authentic influence starts now."
        }
      };
      
      Object.assign(results, fallbacks[section] || {});
    }
  }
  
  console.log('\nSentinel 8 report generation complete!');
  console.log('Generated sections:', Object.keys(results).join(', '));
  
  return results;
}

// Run the generator
generateSentinel8Content()
  .then(results => {
    console.log('\n=== FINAL RESULTS ===');
    console.log(JSON.stringify(results, null, 2));
    
    // Save to file for inspection
    fs.writeFileSync('sentinel-8-content.json', JSON.stringify(results, null, 2));
    console.log('\nResults saved to sentinel-8-content.json');
  })
  .catch(error => {
    console.error('Generation failed:', error);
    process.exit(1);
  });