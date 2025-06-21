// Final working Sentinel 8 generator with proper connection management
import fs from 'fs';

async function generateContentWithFetch(prompt, section) {
  console.log(`🚀 Starting ${section} generation...`);
  
  try {
    // Add these headers to force connection close
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Connection': 'close',           // Force connection close
        'Cache-Control': 'no-cache',     // Prevent caching
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
      signal: AbortSignal.timeout(90000), // Reduced timeout to 90 seconds
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    console.log(`✅ ${section} completed - Generated keys: ${Object.keys(content).join(', ')}`);
    
    // Add delay after each request to prevent connection pooling issues
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return content;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${section}:`, error.message);
    throw error;
  }
}

async function generateSentinel8Report() {
  console.log('🎯 Generating complete Sentinel 8 transformation report...');
  
  const assessmentData = {
    personalityType: "Sentinel 8",
    wing: "9", 
    stateDistribution: { destructive: 60, good: 40 },
    subtype: { dominant: "selfPreservation", blind: "sexual" },
    confidence: 87
  };

  const sections = [
    {
      name: 'hero',
      prompt: `Generate hero section for Sentinel 8 with ${assessmentData.stateDistribution.destructive}% destructive patterns, wing ${assessmentData.wing}, and ${assessmentData.subtype.dominant} dominance. Create compelling transformation title and brain-heart disconnect message. Return JSON: {"heroTitle": "compelling title for Sentinel 8 transformation", "brainHeartDisconnect": "CONTROL ADDICTION DETECTED - specific message about power imbalance"}`
    },
    {
      name: 'stage1', 
      prompt: `Generate Stage 1 transformation content for Sentinel 8 recognizing destructive control patterns. Focus on ${assessmentData.subtype.dominant} subtype with ${assessmentData.subtype.blind} blind spot and ${assessmentData.stateDistribution.destructive}% destructive patterns. Return JSON: {"stage1Description": "detailed 80-100 word description of stage 1 transformation recognizing control patterns and beginning protective leadership journey"}`
    },
    {
      name: 'challenges',
      prompt: `Generate 3 specific challenge cards for Sentinel 8 transformation addressing control patterns, vulnerability, and trust issues based on ${assessmentData.subtype.dominant} dominance and ${assessmentData.subtype.blind} blind spot. Return JSON: {"challengeCards": [{"title": "Control vs Protection", "description": "50-word description", "icon": "shield"}, {"title": "Vulnerability as Strength", "description": "50-word description", "icon": "heart"}, {"title": "Trust Building", "description": "50-word description", "icon": "users"}]}`
    },
    {
      name: 'wheel',
      prompt: `Generate wheel of life percentages for Sentinel 8 with ${assessmentData.stateDistribution.destructive}% destructive patterns, focusing on power dynamics, relationship struggles, career leadership, health stress, financial control, and growth needs. Return JSON: {"wheelOfLife": [{"area": "Personal Power", "percentage": 75, "description": "authority and control focus"}, {"area": "Relationships", "percentage": 45, "description": "trust and vulnerability challenges"}, {"area": "Career", "percentage": 85, "description": "natural leadership abilities"}, {"area": "Health", "percentage": 65, "description": "stress management issues"}, {"area": "Finance", "percentage": 80, "description": "security and resource control"}, {"area": "Personal Growth", "percentage": 50, "description": "emotional intelligence development"}]}`
    },
    {
      name: 'testimonials',
      prompt: `Generate 3 authentic transformation testimonials for Sentinel 8 focusing on leadership transformation from destructive control to protective strength. Return JSON: {"testimonials": [{"quote": "authentic 20-30 word quote about control to protection transformation", "name": "realistic name", "title": "leadership role"}, {"quote": "quote about vulnerability as strength", "name": "realistic name", "title": "leadership role"}, {"quote": "quote about empowering others vs dominating", "name": "realistic name", "title": "leadership role"}]}`
    },
    {
      name: 'stages',
      prompt: `Generate hero journey stages 2-6 for Sentinel 8 transformation from destructive control to protective leadership, addressing ${assessmentData.subtype.dominant} patterns and ${assessmentData.stateDistribution.destructive}% destructive state. Return JSON: {"heroJourneyStages": {"stage2": "recognizing destructive control patterns in leadership", "stage3": "understanding difference between power and force", "stage4": "developing emotional intelligence and vulnerability", "stage5": "learning to empower others instead of dominating", "stage6": "embracing protective leadership that builds others up"}, "callToAction": "Transform your power from destructive control to protective leadership. Your journey to authentic strength and empowering influence starts now."}`
    }
  ];

  const results = {};
  let successCount = 0;
  
  for (const section of sections) {
    try {
      const content = await generateContentWithFetch(section.prompt, section.name);
      Object.assign(results, content);
      successCount++;
      
    } catch (error) {
      console.error(`💀 Section ${section.name} failed, using fallback`);
      
      // High-quality fallback content for each section
      const fallbacks = {
        hero: {
          heroTitle: "From Control to Protection: The Sentinel's Transformation",
          brainHeartDisconnect: "CONTROL ADDICTION DETECTED - Power imbalance preventing authentic leadership"
        },
        stage1: {
          stage1Description: "The journey begins with recognizing how your natural protective instincts have become corrupted into controlling behaviors. As a Sentinel 8 with strong self-preservation drives, you've learned to dominate rather than defend, to intimidate rather than inspire. This stage involves the painful but necessary acknowledgment that your attempts to control outcomes and people have actually weakened your true power. True transformation starts when you see that authentic strength comes from empowering others, not overpowering them."
        },
        challenges: {
          challengeCards: [
            { title: "Control vs Protection", description: "Learning to distinguish between protective leadership that empowers others and controlling behavior that diminishes them. True strength builds others up.", icon: "shield" },
            { title: "Vulnerability as Strength", description: "Discovering that showing authentic emotion and admitting mistakes actually increases your influence and earns genuine respect from others.", icon: "heart" },
            { title: "Trust Building", description: "Developing the patience and emotional intelligence to build genuine trust rather than demanding compliance through intimidation or force.", icon: "users" }
          ]
        },
        wheel: {
          wheelOfLife: [
            { area: "Personal Power", percentage: 75, description: "Strong sense of personal authority but tends toward domination rather than empowerment" },
            { area: "Relationships", percentage: 45, description: "Struggles with genuine intimacy due to fear of vulnerability and need for control" },
            { area: "Career", percentage: 85, description: "Natural leadership abilities and drive for success, often excelling in positions of authority" },
            { area: "Health", percentage: 65, description: "High energy and resilience but prone to stress-related issues from constant intensity" },
            { area: "Finance", percentage: 80, description: "Excellent at accumulating resources and financial security as a form of self-protection" },
            { area: "Personal Growth", percentage: 50, description: "Room for significant development in emotional intelligence and collaborative leadership" }
          ]
        },
        testimonials: {
          testimonials: [
            { quote: "I learned to channel my intensity into building others up instead of tearing them down.", name: "Marcus Chen", title: "CEO" },
            { quote: "True power isn't about control - it's about creating safety for others to flourish.", name: "Sarah Rodriguez", title: "Executive Director" },
            { quote: "My breakthrough came when I realized vulnerability is the foundation of authentic leadership.", name: "David Kim", title: "Team Leader" }
          ]
        },
        stages: {
          heroJourneyStages: {
            stage2: "Recognizing how your protective instincts have become corrupted into controlling behaviors that push people away",
            stage3: "Understanding the fundamental difference between force and true power, between domination and genuine influence",
            stage4: "Developing emotional intelligence and the courage to be vulnerable without losing your essential strength",
            stage5: "Learning to channel your intensity into empowering others rather than overpowering them",
            stage6: "Embracing your role as a protective leader who creates safety and opportunities for others to thrive"
          },
          callToAction: "Transform your power from destructive control to protective leadership. Your journey to authentic strength and empowering influence starts now. The world needs leaders who protect and empower, not dominate and diminish."
        }
      };
      
      Object.assign(results, fallbacks[section.name] || {});
    }
  }
  
  console.log(`\n🏁 Generation complete! Successfully generated ${successCount}/${sections.length} sections with AI`);
  console.log(`📋 Final content includes: ${Object.keys(results).join(', ')}`);
  
  // Save results
  fs.writeFileSync('sentinel-8-content.json', JSON.stringify(results, null, 2));
  console.log('💾 Results saved to sentinel-8-content.json');
  
  return results;
}

// Execute the generation
generateSentinel8Report()
  .then(results => {
    console.log('\n✨ SENTINEL 8 REPORT GENERATION SUCCESSFUL ✨');
    console.log(`Generated ${Object.keys(results).length} content sections`);
  })
  .catch(error => {
    console.error('🔥 Generation failed:', error);
    process.exit(1);
  });