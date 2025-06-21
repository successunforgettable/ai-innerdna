import { parseAssessmentData } from './assessmentParser.js';
import { injectContentIntoTemplate } from './templateInjector.js';
import OpenAI from 'openai';
import fs from 'fs';

async function generateHeroContent(parsedData) {
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 15000  // 15 seconds
  });

  const prompt = `Generate hero section content for ${parsedData.personalityName}. Use "Sentinel 6" terminology, never "Enneagram". Return JSON:
{
  "PERSONALITY_TYPE": "${parsedData.personalityName}",
  "HERO_TITLE": "The ${parsedData.personalityName} Transformation Journey",
  "HERO_SUBTITLE": "Your Path from ${parsedData.dominantState.name} to Security"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.7
  });
  
  return JSON.parse(response.choices[0].message.content);
}

async function testMinimal() {
  try {
    console.log("Testing minimal hero content generation...");
    
    const testData = {
      personalityType: 6,
      wing: 5,
      colorStates: [{name: "Anxious", percentage: 60}, {name: "Secure", percentage: 40}],
      detailTokens: {selfPreservation: 3, sexual: 2, social: 5},
      confidence: 35
    };
    
    // Parse assessment data
    const parsedData = parseAssessmentData(testData);
    console.log("✓ Assessment parsed for:", parsedData.personalityName);
    
    // Generate only hero content
    const heroContent = await generateHeroContent(parsedData);
    console.log("✓ Hero content generated:", heroContent);
    
    // Create minimal content object with placeholders for missing content
    const fullContent = {
      ...heroContent,
      assessmentData: parsedData,
      STAGE1_OPENING: "Test stage opening",
      STAGE2_OPENING: "Test stage 2",
      STAGE3_OPENING: "Test stage 3",
      CARD1_TITLE: "Test Challenge",
      CARD1_DESCRIPTION: "Test challenge description",
      CARD2_TITLE: "Test Growth",
      CARD2_DESCRIPTION: "Test growth description", 
      TESTIMONIAL1_QUOTE: "This transformation changed my life",
      TESTIMONIAL1_AUTHOR: "Test Author",
      WARNING_TEXT: "Test warning message",
      INSIGHT_TEXT: "Test insight message",
      TRANSFORMATION_SUMMARY: "Test transformation summary",
      ASSESSMENT_SUMMARY: `${parsedData.dominantState.percentage}% ${parsedData.dominantState.name}, ${parsedData.secondaryState.percentage}% ${parsedData.secondaryState.name}, ${parsedData.dominantSubtype} focus`
    };
    
    console.log("✓ Full content object created with", Object.keys(fullContent).length, "fields");
    
    // Inject into template
    console.log("✓ Starting template injection...");
    const html = injectContentIntoTemplate(fullContent);
    
    // Save and verify
    fs.writeFileSync('test-minimal.html', html);
    console.log("✓ Minimal test complete - saved test-minimal.html");
    console.log("Report size:", html.length, "bytes");
    
  } catch (error) {
    console.error("✗ Minimal test failed:", error.message);
  }
}

testMinimal();