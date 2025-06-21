import fs from 'fs';
import path from 'path';

interface AssessmentData {
  personalityType: number;
  wing?: number;
  colorStates: Array<{name: string, percentage: number}>;
  detailTokens: {selfPreservation: number, sexual: number, social: number};
  confidence: number;
}

export async function generateWorkingTransformationReport(inputData: AssessmentData): Promise<{
  success: boolean;
  html?: string;
  error?: string;
  size?: number;
  contentFields?: number;
}> {
  try {
    console.log('Generating working transformation report...');
    
    // Parse assessment data directly
    const personalityNames = ['Perfectionist', 'Helper', 'Achiever', 'Artist', 'Investigator', 'Sentinel 6', 'Adventurer', 'Challenger', 'Peacemaker'];
    const personalityName = personalityNames[inputData.personalityType - 1] || 'Sentinel 6';
    
    const dominantState = inputData.colorStates?.[0] || {name: "Anxious", percentage: 60};
    const secondaryState = inputData.colorStates?.[1] || {name: "Secure", percentage: 40};
    
    // Determine dominant subtype
    const tokens = inputData.detailTokens || {selfPreservation: 3, sexual: 2, social: 5};
    let dominantSubtype = 'Social';
    if (tokens.selfPreservation > tokens.sexual && tokens.selfPreservation > tokens.social) {
      dominantSubtype = 'Self-Preservation';
    } else if (tokens.sexual > tokens.social) {
      dominantSubtype = 'Sexual';
    }
    
    const parsedData = {
      personalityName,
      dominantState,
      secondaryState,
      dominantSubtype,
      confidence: inputData.confidence || 35
    };
    
    console.log(`Assessment parsed for: ${parsedData.personalityName}`);

    // Create comprehensive content (ChatGPT-style output)
    const contentData = {
      // Core personality content
      PERSONALITY_TYPE: parsedData.personalityName,
      HERO_SUBTITLE: `Your Path from ${parsedData.dominantState.name} to Security and Growth`,
      HERO_JOURNEY_TEXT: `You are a ${parsedData.personalityName} - naturally alert, perceptive, and focused on security. You scan for problems others miss and prepare for what could go wrong. Your ${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} state creates both your greatest challenges and your transformation opportunities.`,
      
      // Stage 1 - Current Reality
      STAGE1_OPENING: `You are currently experiencing ${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} patterns. As a ${parsedData.personalityName}, you naturally scan for threats and seek security, but this hypervigilance can become exhausting and limiting.`,
      
      // Core challenge cards
      CARD1_TITLE: "Constant Vigilance",
      CARD1_DESCRIPTION: `Your ${parsedData.personalityName} mind constantly scans for threats and problems. While this keeps you safe, the hypervigilance drains your mental energy and creates chronic stress.`,
      
      CARD2_TITLE: "Seeking Certainty", 
      CARD2_DESCRIPTION: `You crave security and certainty in an uncertain world. Your ${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} state amplifies this need, making decisions feel overwhelming.`,
      
      CARD3_TITLE: "Loyal but Doubting",
      CARD3_DESCRIPTION: `You're incredibly loyal to people and causes you believe in, yet constantly doubt your own judgment and capabilities. This creates internal conflict and hesitation.`,
      
      CARD4_TITLE: `${parsedData.dominantSubtype} Focus`,
      CARD4_DESCRIPTION: `Your ${parsedData.dominantSubtype.toLowerCase()} subtype drives specific patterns in how you seek security and build relationships for safety and belonging.`,
      
      // Transformation content
      WARNING_TEXT: `Your ${parsedData.dominantState.name} patterns are creating unnecessary limitations in your life. The constant vigilance and doubt are preventing you from accessing your natural strength and wisdom.`,
      
      INSIGHT_TEXT: `Transform ${parsedData.dominantState.name} reactivity into authentic security by building trust in yourself and developing inner confidence alongside outer support systems.`,
      
      TRANSFORMATION_SUMMARY: `Complete ${parsedData.personalityName} transformation from ${parsedData.dominantState.name} limitation to authentic security, confident decision-making, and peaceful vigilance.`,
      
      // Testimonial content
      TESTIMONIAL1_QUOTE: `I realized my anxiety was actually my superpower once I learned to manage it properly. The ${parsedData.personalityName} approach helped me transform constant worry into confident preparation.`,
      TESTIMONIAL1_AUTHOR: `Sarah M., ${parsedData.personalityName}`,
      
      // Motivational content
      MOTIVATIONAL_QUOTE: `Your security comes not from controlling everything, but from trusting your ability to handle whatever comes your way.`,
      
      CRITICAL_CHOICE_TEXT: `Choose growth over ${parsedData.dominantState.name} comfort. Choose confident action over endless analysis and preparation.`,
      
      CHOICE_MOTIVATION: `Your future ${parsedData.personalityName} self depends on the choices you make right now. Will you step into authentic security or remain trapped in reactive patterns?`,
      
      FINAL_CALL_TO_ACTION: `Step into your transformed ${parsedData.personalityName} life. The security you seek is built through courageous action and self-trust.`,
      
      INCREDIBLE_YOU_TEXT: `You are an incredible ${parsedData.personalityName} with natural perceptiveness, loyalty, and protective instincts. Your transformation unlocks these gifts without the burden of chronic anxiety.`,
      
      INVITATION_TEXT: `This is your invitation to step beyond ${parsedData.dominantState.name} limitations and into your full ${parsedData.personalityName} potential of confident security and peaceful strength.`,
      
      // Statistics
      STAT1_DESCRIPTION: `${parsedData.confidence}% assessment confidence level achieved through comprehensive analysis of your personality patterns and behavioral tendencies.`,
      STAT2_DESCRIPTION: `${parsedData.dominantState.percentage}% ${parsedData.dominantState.name} state intensity identified and measured across multiple assessment dimensions.`
    };

    // Generate systematic content for remaining placeholders
    const systematicContent = generateSystematicContent(parsedData);
    
    // Combine all content
    const allContent = { ...contentData, ...systematicContent };
    
    // Add assessment data for calculations
    (allContent as any).assessmentData = parsedData;
    
    console.log(`Complete content prepared: ${Object.keys(allContent).length} fields`);
    
    // Generate final report using direct template injection
    const html = injectContentIntoTemplate(allContent);
    
    console.log('Working transformation report generated successfully');
    
    return {
      success: true,
      html: html,
      size: html.length,
      contentFields: Object.keys(allContent).length
    };
    
  } catch (error) {
    console.error('Error generating working transformation report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateCompleteReport(contentData: any): string {
  // Read the challenger template
  let template: string;
  try {
    template = fs.readFileSync('./challenger_template.html', 'utf8');
  } catch (error) {
    console.error('Could not read challenger template, using fallback');
    template = createFallbackTemplate();
  }
  
  // Replace all placeholders in template
  Object.keys(contentData).forEach(key => {
    if (key !== 'assessmentData') {
      const placeholder = `{{${key}}}`;
      const value = contentData[key];
      template = template.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    }
  });
  
  console.log('Template injection completed');
  return template;
}

function createFallbackTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{PERSONALITY_TYPE}} Transformation Journey</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #6B46C1, #9333EA); color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .hero { text-align: center; padding: 50px 0; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero h2 { font-size: 1.5rem; margin-bottom: 2rem; }
        .section { margin: 40px 0; padding: 30px; background: rgba(255,255,255,0.1); border-radius: 15px; }
        .card { background: rgba(255,255,255,0.1); padding: 20px; margin: 20px 0; border-radius: 10px; }
        .testimonial { font-style: italic; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>The {{PERSONALITY_TYPE}} Transformation Journey</h1>
            <h2>{{HERO_SUBTITLE}}</h2>
            <p>{{HERO_JOURNEY_TEXT}}</p>
        </div>
        
        <div class="section">
            <h3>Your Current Reality</h3>
            <p>{{STAGE1_OPENING}}</p>
            
            <div class="card">
                <h4>{{CARD1_TITLE}}</h4>
                <p>{{CARD1_DESCRIPTION}}</p>
            </div>
            
            <div class="card">
                <h4>{{CARD2_TITLE}}</h4>
                <p>{{CARD2_DESCRIPTION}}</p>
            </div>
        </div>
        
        <div class="section">
            <h3>Transformation Insights</h3>
            <p>{{WARNING_TEXT}}</p>
            <p>{{INSIGHT_TEXT}}</p>
            <p>{{TRANSFORMATION_SUMMARY}}</p>
        </div>
        
        <div class="testimonial">
            <p>"{{TESTIMONIAL1_QUOTE}}"</p>
            <p><strong>- {{TESTIMONIAL1_AUTHOR}}</strong></p>
        </div>
        
        <div class="section">
            <h3>Your Call to Action</h3>
            <p>{{FINAL_CALL_TO_ACTION}}</p>
            <p>{{INCREDIBLE_YOU_TEXT}}</p>
        </div>
    </div>
</body>
</html>`;
}

function generateSystematicContent(data: any) {
  const content: { [key: string]: string } = {};
  
  // Generate all stage openings (2-11)
  const stageTopics = [
    'awareness and recognition',
    'breaking through denial', 
    'taking decisive action',
    'building new patterns',
    'integration and mastery',
    'advanced growth',
    'leadership development',
    'wisdom cultivation',
    'complete transformation',
    'ongoing evolution'
  ];
  
  for (let i = 2; i <= 11; i++) {
    content[`STAGE${i}_OPENING`] = `Stage ${i} of your ${data.personalityName} transformation focuses on ${stageTopics[i-2]} as you move from ${data.dominantState.name} patterns to authentic security.`;
  }
  
  // Generate all remaining cards (5-22)
  const cardTopics = [
    'Inner Dialogue', 'Support Systems', 'Decision Making', 'Stress Response', 'Relationship Patterns',
    'Authority Issues', 'Trust Building', 'Confidence Development', 'Action Taking', 'Self Doubt',
    'Future Planning', 'Present Moment', 'Emotional Regulation', 'Boundary Setting', 'Growth Mindset',
    'Authentic Self', 'Leadership Style', 'Communication Patterns'
  ];
  
  for (let i = 5; i <= 22; i++) {
    const topicIndex = (i - 5) % cardTopics.length;
    content[`CARD${i}_TITLE`] = cardTopics[topicIndex];
    content[`CARD${i}_DESCRIPTION`] = `Your ${data.personalityName} approach to ${cardTopics[topicIndex].toLowerCase()} involves specific patterns that can be transformed from ${data.dominantState.name} limitation to authentic strength.`;
  }
  
  // Generate all remaining testimonials (2-7)
  const testimonialAuthors = ['Alex K.', 'Jordan M.', 'Casey R.', 'Morgan T.', 'Taylor S.', 'Riley P.'];
  const testimonialQuotes = [
    `The ${data.personalityName} transformation program helped me understand my patterns completely and build real confidence.`,
    `I went from constant worry to confident preparation. My anxiety became my ally instead of my enemy.`,
    `Learning to trust myself while staying alert was the key breakthrough in my ${data.personalityName} journey.`,
    `The approach showed me how to use my natural vigilance as a gift rather than a burden.`,
    `I discovered that security comes from within, not from controlling every external factor.`,
    `My ${data.dominantState.name} patterns transformed into peaceful strength and confident action.`
  ];
  
  for (let i = 2; i <= 7; i++) {
    content[`TESTIMONIAL${i}_QUOTE`] = testimonialQuotes[i-2];
    content[`TESTIMONIAL${i}_AUTHOR`] = `${testimonialAuthors[i-2]}, ${data.personalityName}`;
  }
  
  // Generate timeline entries (1-6)
  const timelineStages = [
    'Recognition Phase', 'Awareness Building', 'Pattern Breaking', 
    'Skill Development', 'Integration Period', 'Mastery Achievement'
  ];
  
  for (let i = 1; i <= 6; i++) {
    content[`TIMELINE${i}_TITLE`] = timelineStages[i-1];
    content[`TIMELINE${i}_DESCRIPTION`] = `${timelineStages[i-1]} represents a crucial milestone in your ${data.personalityName} transformation from ${data.dominantState.name} patterns to authentic security.`;
  }
  
  // Generate before/after states (1-4)
  const beforeStates = [
    `Chronic ${data.dominantState.name} vigilance`,
    `Constant doubt and hesitation`, 
    `Seeking external validation`,
    `Reactive stress patterns`
  ];
  
  const afterStates = [
    'Peaceful confident awareness',
    'Self-assured decision making',
    'Inner security and trust',
    'Proactive calm responses'
  ];
  
  for (let i = 1; i <= 4; i++) {
    content[`BEFORE${i}`] = beforeStates[i-1];
    content[`AFTER${i}`] = afterStates[i-1];
    content[`RESURRECTION_BEFORE${i}`] = `Previous limitation: ${beforeStates[i-1]}`;
    content[`RESURRECTION_AFTER${i}`] = `New empowered state: ${afterStates[i-1]}`;
  }
  
  // Generate wheel percentages (realistic for different states)
  const beforeBase = data.dominantState.name === 'Anxious' ? 25 : 40;
  const wheelAreas = ['CAREER', 'FINANCES', 'RELATIONSHIPS', 'MENTAL', 'PHYSICAL', 'SOCIAL', 'ENVIRONMENT', 'GROWTH'];
  
  wheelAreas.forEach(area => {
    content[`WHEEL_${area}_BEFORE`] = (beforeBase + Math.round(Math.random() * 15)).toString();
    content[`WHEEL_${area}_AFTER`] = (85 + Math.round(Math.random() * 10)).toString();
  });
  
  // Generate remaining transformation content
  content['FINAL_CHOICE_TEXT'] = `The choice is yours: remain in ${data.dominantState.name} patterns or transform into authentic ${data.personalityName} security.`;
  content['FINAL_ENCOURAGEMENT'] = `You have everything needed for ${data.personalityName} success. Trust the process and take confident action.`;
  content['FINAL_TRANSFORMATION_TEXT'] = `Your ${data.personalityName} transformation is complete when security comes from within, not from external validation or control.`;
  content['WARNING_COMPLETION_TEXT'] = `Complete your ${data.personalityName} transformation journey. The world needs your unique combination of perceptiveness and strength.`;
  
  return content;
}