import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AssessmentData {
  primaryType: string;
  confidence: number;
  wing?: string;
  foundationStones?: any[];
  buildingBlocks?: any[];
  colorStates?: any[];
  detailTokens?: any;
}

interface CustomReportData {
  heroTitle: string;
  heroSubtitle: string;
  personalityType: string;
  influencePattern: string;
  personalityDescription: string;
  currentStateDescription: string;
  currentState: {
    average: number;
    belowAverage: number;
  };
  lifeAreas: Array<{
    area: string;
    icon: string;
    description: string;
    percentage: number;
  }>;
  challengeCards: Array<{
    title: string;
    description: string;
  }>;
  beforeAfter: {
    before: string[];
    after: string[];
  };
  callToAction: string;
}

function getPersonalityName(type: string): string {
  const names = {
    '1': 'The Perfectionist',
    '2': 'The Helper', 
    '3': 'The Achiever',
    '4': 'The Individualist',
    '5': 'The Investigator',
    '6': 'The Loyalist',
    '7': 'The Enthusiast',
    '8': 'The Challenger',
    '9': 'The Peacemaker'
  };
  return names[type as keyof typeof names] || 'The Transformer';
}

function getInfluenceName(wing?: string): string {
  const influences = {
    '1': 'Perfectionist Influence',
    '2': 'Helper Influence',
    '3': 'Achiever Influence', 
    '4': 'Individualist Influence',
    '5': 'Investigator Influence',
    '6': 'Loyalist Influence',
    '7': 'Enthusiast Influence',
    '8': 'Challenger Influence',
    '9': 'Peacemaker Influence'
  };
  return influences[wing as keyof typeof influences] || 'Balanced Influence';
}

function getPersonalityDescription(type: string): string {
  const descriptions = {
    '1': 'A perfectionist who seeks excellence and integrity, driven to improve yourself and the world around you through principled action and high standards.',
    '2': 'A caring helper who intuitively understands others\' needs, motivated to create meaningful connections and support those around you.',
    '3': 'An achievement-oriented individual who thrives on success and recognition, driven to excel and inspire others through your accomplishments and adaptability.',
    '4': 'A unique individualist who seeks authentic self-expression, driven by deep emotions and a desire to create something meaningful and beautiful.',
    '5': 'An insightful investigator who values knowledge and understanding, motivated to master complex ideas and maintain your independence.',
    '6': 'A loyal supporter who seeks security and guidance, driven to build trustworthy relationships and prepare for potential challenges.',
    '7': 'An enthusiastic visionary who pursues exciting possibilities, motivated by adventure and the freedom to explore new experiences.',
    '8': 'A powerful challenger who takes charge and protects others, driven by justice and the determination to create lasting impact.',
    '9': 'A peaceful mediator who values harmony and connection, motivated to bring people together and maintain stability.'
  };
  return descriptions[type as keyof typeof descriptions] || 'A driven individual focused on growth and transformation, with unique strengths waiting to be unleashed.';
}

function getPersonalizedContent(primaryType: string, wing?: string) {
  const contentMap: { [key: string]: any } = {
    '1': {
      heroTitle: "The Reformer Transformation Journey",
      heroSubtitle: "From Perfect Standards to Wise Action",
      currentStateDescription: "Driven by a vision of perfection and righteousness, yet struggling with inner criticism and the weight of impossible standards",
      challengeCards: [
        { title: "Inner Critic", description: "Transforming the harsh internal voice into a wise guide for improvement" },
        { title: "Perfectionism", description: "Learning that excellence doesn't require perfection - progress over perfection" },
        { title: "Resentment", description: "Releasing anger toward imperfection and finding peace with what is" }
      ],
      lifeAreas: [
        { area: "Career", icon: "fas fa-briefcase", description: "High standards driving meaningful work", percentage: 70 },
        { area: "Relationships", icon: "fas fa-heart", description: "Learning acceptance and reducing criticism", percentage: 50 },
        { area: "Health", icon: "fas fa-dumbbell", description: "Structured approach to wellness and balance", percentage: 65 },
        { area: "Finances", icon: "fas fa-dollar-sign", description: "Responsible management with ethical investments", percentage: 75 },
        { area: "Personal Growth", icon: "fas fa-seedling", description: "Embracing imperfection as part of growth", percentage: 45 }
      ],
      beforeAfter: {
        before: [
          "Constant self-criticism and judgment of others",
          "Frustrated by imperfection in every situation",
          "Rigid thinking that limits creative solutions"
        ],
        after: [
          "Channeling perfectionism into positive change",
          "Accepting imperfection while maintaining standards",
          "Leading with wisdom rather than criticism"
        ]
      },
      callToAction: "Transform your vision of perfection into a force for meaningful improvement. Your journey to wise leadership begins now."
    },
    '3': {
      heroTitle: "The Achiever Transformation Journey",
      heroSubtitle: "From Performance to Authentic Success",
      currentStateDescription: "Driven by success and recognition, yet yearning for deeper fulfillment beyond external achievements",
      challengeCards: [
        { title: "Image Management", description: "Breaking free from the exhausting cycle of maintaining the perfect facade" },
        { title: "Workaholism", description: "Learning to value being over doing, rest over constant productivity" },
        { title: "Emotional Disconnection", description: "Reconnecting with authentic feelings beneath the drive for success" }
      ],
      lifeAreas: [
        { area: "Career", icon: "fas fa-briefcase", description: "High performance but seeking meaningful impact", percentage: 75 },
        { area: "Relationships", icon: "fas fa-heart", description: "Building genuine connections beyond networking", percentage: 45 },
        { area: "Health", icon: "fas fa-dumbbell", description: "Optimizing energy for sustainable success", percentage: 60 },
        { area: "Finances", icon: "fas fa-dollar-sign", description: "Strong financial drive with smart investments", percentage: 80 },
        { area: "Personal Growth", icon: "fas fa-seedling", description: "Developing authentic self beyond achievements", percentage: 40 }
      ],
      beforeAfter: {
        before: [
          "Constantly performing for others' approval",
          "Burnout from relentless achievement focus",
          "Fear of failure paralyzing authentic expression"
        ],
        after: [
          "Achieving with authentic purpose and passion",
          "Balanced success that includes personal fulfillment", 
          "Inspiring others through genuine leadership"
        ]
      },
      callToAction: "Transform your drive for success into a force for authentic impact. Your journey to heart-centered achievement begins now."
    }
  };

  return contentMap[primaryType] || contentMap['3'];
}

async function generateAIContent(assessmentData: AssessmentData) {
  try {
    // Map assessment data to detailed prompt format
    const personalityType = getPersonalityName(assessmentData.primaryType);
    const influence = assessmentData.wing;
    
    // Calculate state distribution from color states
    const colorStates = assessmentData.colorStates || [];
    const primaryState = colorStates.length > 0 ? colorStates[0] : { state: "average", percentage: 50 };
    const secondaryState = colorStates.length > 1 ? colorStates[1] : { state: "average", percentage: 50 };
    
    // Determine dominant subtype from detail tokens
    const tokens = assessmentData.detailTokens || { social: 3, selfPreservation: 3, sexual: 4 };
    const subtypeScores = {
      social: tokens.social || 0,
      selfPreservation: tokens.selfPreservation || 0,
      sexual: tokens.sexual || 0
    };
    
    const dominantSubtype = Object.entries(subtypeScores).reduce((a, b) => 
      subtypeScores[a[0] as keyof typeof subtypeScores] > subtypeScores[b[0] as keyof typeof subtypeScores] ? a : b
    )[0];

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a personality transformation expert creating personalized hero's journey reports using the exact Challenger template design. 

CRITICAL DESIGN REQUIREMENTS - NO DEVIATIONS ALLOWED:
✅ Use 100% identical structure from Challenger template
✅ Same 11-stage hero's journey structure
✅ Content must be personalized based on user's exact assessment data

FORBIDDEN TERMINOLOGY:
Never use: "Enneagram", "Type 1/2/3", "wings", "arrows", "integration/disintegration"
Always use: "${personalityType}", "influence", "good/average/destructive states"

Respond in JSON format with deeply personalized content.`
        },
        {
          role: "user",
          content: `Create a personalized transformation report using the exact Challenger template design but with content dynamically generated based on user's assessment data.

INPUT DATA ANALYSIS:
- Personality Type: ${personalityType}
- Influence: ${influence}
- Primary State: ${primaryState.state} (${primaryState.percentage}%)
- Secondary State: ${secondaryState.state} (${secondaryState.percentage}%)
- Dominant Subtype: ${dominantSubtype}
- Foundation Stones: ${JSON.stringify(assessmentData.foundationStones)}
- Building Blocks: ${JSON.stringify(assessmentData.buildingBlocks)}
- Color State Distribution: ${JSON.stringify(assessmentData.colorStates)}
- Detail Token Distribution: ${JSON.stringify(assessmentData.detailTokens)}

CONTENT GENERATION RULES:

1. ANALYZE USER'S EXACT PATTERN:
   - ${personalityType} ${influence} = specific combination of core drives and influences
   - ${primaryState.percentage}% ${primaryState.state} state = their current life experience level
   - ${dominantSubtype} dominant = their primary focus area and challenges

2. STATE-BASED CONTENT ADAPTATION:
   - ${primaryState.percentage}%+ ${primaryState.state} state: Adjust content tone and challenges accordingly
   - Address their specific lived experience, not generic patterns

3. SUBTYPE-SPECIFIC CONTENT:
   - ${dominantSubtype} dominant: Focus content on their primary drive area
   - Self-preservation: Security, routines, personal needs, resource management
   - Social: Group dynamics, belonging, status, community connections  
   - Sexual: Intense relationships, chemistry, personal influence

4. PERSONALIZED EXAMPLES must reflect their ${personalityType} ${influence} pattern with ${primaryState.percentage}% ${primaryState.state} state and ${dominantSubtype} focus.

Return JSON with personalized content:
{
  "heroTitle": "Specific transformation journey title for ${personalityType} ${influence}",
  "heroSubtitle": "Inspiring subtitle reflecting their ${primaryState.state} state journey", 
  "currentStateDescription": "Description reflecting ${primaryState.percentage}% ${primaryState.state}, ${secondaryState.percentage}% ${secondaryState.state} distribution",
  "stageDescriptions": [
    "Stage 1: Ordinary world description matching their exact pattern",
    "Stage 2: Call to adventure for ${personalityType} ${influence}",
    "Stage 3: Meeting mentor relevant to their ${dominantSubtype} focus",
    "Stage 4: Crossing threshold specific to their state distribution",
    "Stage 5: Tests and trials for their exact combination",
    "Stage 6: Transformation specific to their pattern"
  ],
  "challengeCards": [
    {"title": "Challenge 1 for ${personalityType} ${influence}", "description": "Based on ${dominantSubtype} focus"},
    {"title": "Challenge 2 for ${personalityType} ${influence}", "description": "Based on ${primaryState.state} state patterns"},
    {"title": "Challenge 3 for ${personalityType} ${influence}", "description": "Based on their specific metrics"}
  ],
  "lifeAreas": [
    {"area": "Career", "icon": "fas fa-briefcase", "description": "Career state for ${personalityType} with ${dominantSubtype} focus", "percentage": 45},
    {"area": "Relationships", "icon": "fas fa-heart", "description": "Relationship patterns for ${personalityType} ${influence}", "percentage": 38},
    {"area": "Health", "icon": "fas fa-dumbbell", "description": "Health approach for ${dominantSubtype} dominant", "percentage": 42},
    {"area": "Finances", "icon": "fas fa-dollar-sign", "description": "Financial patterns for ${personalityType}", "percentage": 40},
    {"area": "Personal Growth", "icon": "fas fa-seedling", "description": "Growth path for ${primaryState.state} state", "percentage": 35}
  ],
  "beforeAfter": {
    "before": ["Current struggle specific to ${primaryState.percentage}% ${primaryState.state} state", "Struggle 2 for ${personalityType} ${influence}", "Challenge 3 for ${dominantSubtype} dominant"],
    "after": ["Transformation 1 for ${personalityType} potential", "Growth 2 specific to their pattern", "Future 3 based on their exact metrics"]
  },
  "callToAction": "Compelling call to action for ${personalityType} ${influence} with ${dominantSubtype} focus",
  "testimonials": [
    {"name": "Name appropriate for ${personalityType}", "title": "Title reflecting their pattern", "content": "Testimonial matching ${primaryState.state} state experience"}
  ]
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Error generating AI content:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      assessmentData: JSON.stringify(assessmentData, null, 2)
    });
    // Fallback to predefined content
    return getPersonalizedContent(assessmentData.primaryType, assessmentData.wing);
  }
}

export async function generateCustomReport(assessmentData: AssessmentData): Promise<CustomReportData> {
  try {
    console.log('Generating custom report for primaryType:', assessmentData.primaryType);
    const personalityName = getPersonalityName(assessmentData.primaryType);
    const influenceName = getInfluenceName(assessmentData.wing);
    const personalityDescription = getPersonalityDescription(assessmentData.primaryType);

    // Generate AI-powered personalized content based on assessment data
    console.log('Starting AI content generation for:', assessmentData);
    const aiContent = await generateAIContent(assessmentData);
    console.log('AI content generation completed:', { 
      heroTitle: aiContent.heroTitle, 
      heroSubtitle: aiContent.heroSubtitle,
      hasStageDescriptions: !!aiContent.stageDescriptions,
      challengeCardsCount: aiContent.challengeCards?.length || 0
    });

    return {
      heroTitle: aiContent.heroTitle || `${personalityName} Transformation Journey`,
      heroSubtitle: aiContent.heroSubtitle || "Your Hero's Path to Heart-Brain Mastery",
      personalityType: personalityName,
      influencePattern: influenceName,
      personalityDescription,
      currentStateDescription: aiContent.currentStateDescription || "Ready for profound transformation and growth.",
      currentState: {
        average: 42,
        belowAverage: 58
      },
      lifeAreas: aiContent.lifeAreas || [
        { area: "Career", icon: "fas fa-briefcase", description: "Seeking greater fulfillment", percentage: 45 },
        { area: "Relationships", icon: "fas fa-heart", description: "Building deeper connections", percentage: 38 },
        { area: "Health", icon: "fas fa-dumbbell", description: "Focusing on wellbeing", percentage: 42 },
        { area: "Finances", icon: "fas fa-dollar-sign", description: "Creating stability", percentage: 40 },
        { area: "Personal Growth", icon: "fas fa-seedling", description: "Expanding potential", percentage: 35 }
      ],
      challengeCards: aiContent.challengeCards || [
        { title: "Inner Critic", description: "Overcoming self-doubt and perfectionism" },
        { title: "Relationship Patterns", description: "Breaking cycles that limit connection" },
        { title: "Fear of Change", description: "Moving past comfort zones toward growth" }
      ],
      beforeAfter: aiContent.beforeAfter || {
        before: ["Feeling stuck in old patterns", "Struggling with self-doubt", "Limited by fear"],
        after: ["Living with authentic confidence", "Creating meaningful impact", "Embracing growth opportunities"]
      },
      callToAction: aiContent.callToAction || "Your transformation journey begins now. Step into your authentic power and create the life you're meant to live."
    };
  } catch (error) {
    console.error('Error generating custom report:', error);
    throw error;
  }
}

export function generateCustomReportHTML(reportData: CustomReportData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.heroTitle} - Your Hero's Path to Heart-Brain Mastery</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --primary-purple: #6B46C1;
            --mid-purple: #9333EA;
            --light-purple: #A855F7;
            --gold: #FFD700;
            --cyan: #00D4FF;
            --orange: #FF6B35;
            --white: #FFFFFF;
            --light-purple-text: #E9D5FF;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--primary-purple) 0%, var(--mid-purple) 50%, var(--light-purple) 100%);
            color: var(--white);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%);
            animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        .hero-content {
            position: relative;
            z-index: 2;
        }

        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 900;
            background: linear-gradient(45deg, var(--gold), var(--cyan), var(--orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 2rem;
            text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
            animation: glow 3s ease-in-out infinite alternate;
        }

        @keyframes glow {
            from { filter: brightness(1); }
            to { filter: brightness(1.2); }
        }

        .hero-subtitle {
            font-size: 1.8rem;
            color: var(--light-purple-text);
            margin-bottom: 3rem;
            font-weight: 300;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, var(--gold), var(--orange));
            color: var(--primary-purple);
            padding: 1.5rem 3rem;
            font-size: 1.2rem;
            font-weight: 600;
            text-decoration: none;
            border-radius: 50px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
        }

        .journey-stage {
            padding: 6rem 0;
            position: relative;
        }

        .stage-number {
            position: absolute;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 8rem;
            font-weight: 900;
            color: rgba(255, 215, 0, 0.1);
            z-index: 1;
        }

        .stage-content {
            position: relative;
            z-index: 2;
        }

        .stage-title {
            font-family: 'Playfair Display', serif;
            font-size: 4rem;
            color: var(--gold);
            text-align: center;
            margin-bottom: 2rem;
        }

        .stage-description {
            font-size: 1.4rem;
            text-align: center;
            margin-bottom: 4rem;
            color: var(--light-purple-text);
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.15);
        }

        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .card-title {
            font-size: 1.5rem;
            color: var(--gold);
            margin-bottom: 1rem;
            text-align: center;
        }

        .card p {
            color: var(--light-purple-text);
            text-align: center;
        }

        .testimonial {
            background: rgba(0, 212, 255, 0.1);
            border-left: 4px solid var(--cyan);
            padding: 2rem;
            margin: 4rem 0;
            border-radius: 10px;
        }

        .testimonial-quote {
            font-size: 1.3rem;
            font-style: italic;
            margin-bottom: 1rem;
            color: var(--light-purple-text);
        }

        .testimonial-author {
            color: var(--gold);
            font-weight: 600;
        }

        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            margin: 4rem 0;
        }

        .wheel-of-life {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }

        .life-area {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 15px;
            border-left: 4px solid var(--cyan);
        }

        .life-area h4 {
            color: var(--gold);
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .progress-bar {
            background: rgba(255, 255, 255, 0.1);
            height: 8px;
            border-radius: 4px;
            margin-top: 1rem;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 2s ease;
        }

        .brain-heart-visual {
            text-align: center;
            margin: 4rem 0;
        }

        .highlight-text {
            color: var(--gold);
            font-weight: 600;
        }

        .danger-indicator {
            color: var(--orange);
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 3rem;
            }
            
            .stage-title {
                font-size: 2.5rem;
            }
            
            .card-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
            <h1 class="hero-title">${reportData.heroTitle}</h1>
            <p class="hero-subtitle">${reportData.heroSubtitle}</p>
            <a href="#stage1" class="cta-button">Begin Your Journey</a>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Stage 1: The Ordinary World -->
    <section class="journey-stage" id="stage1">
        <div class="container">
            <div class="stage-number">01</div>
            <div class="stage-content">
                <h2 class="stage-title">The Ordinary World</h2>
                <p class="stage-description">Your current state: ${reportData.currentStateDescription}</p>
                
                <div class="card-grid">
                    ${reportData.challengeCards.map(card => `
                        <div class="card">
                            <div class="card-icon"><i class="fas fa-exclamation-triangle" style="color: var(--orange);"></i></div>
                            <h3 class="card-title">${card.title}</h3>
                            <p>${card.description}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="wheel-of-life">
                    ${reportData.lifeAreas.map(area => `
                        <div class="life-area" style="border-left-color: var(--orange);">
                            <h4><i class="${area.icon}" style="color: var(--orange);"></i> ${area.area}</h4>
                            <p>${area.description}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${area.percentage}%; background: linear-gradient(90deg, var(--orange), var(--gold));"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Stage 2: The Call to Adventure -->
    <section class="journey-stage" id="stage2">
        <div class="container">
            <div class="stage-number">02</div>
            <div class="stage-content">
                <h2 class="stage-title">The Call to Adventure</h2>
                <p class="stage-description">The moment you realize transformation is not just possible—it's inevitable.</p>
                
                <div style="text-align: center; margin: 4rem 0; padding: 3rem; background: rgba(255, 215, 0, 0.1); border-radius: 20px; border: 2px solid var(--gold);">
                    <h3 style="color: var(--gold); font-size: 2.5rem; margin-bottom: 2rem;">Your Awakening Moment</h3>
                    <p style="font-size: 1.4rem; color: var(--light-purple-text); margin-bottom: 2rem;">
                        ${reportData.personalityDescription}
                    </p>
                    <p style="font-size: 1.2rem; color: var(--gold);">
                        This is your invitation to step into your authentic power.
                    </p>
                </div>

                <div class="testimonial">
                    <p class="testimonial-quote">"I knew something had to change, but I didn't know where to start. Then I discovered my true nature and everything shifted."</p>
                    <p class="testimonial-author">- Previous Graduate</p>
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Stage 3: Refusal of the Call -->
    <section class="journey-stage" id="stage3">
        <div class="container">
            <div class="stage-number">03</div>
            <div class="stage-content">
                <h2 class="stage-title">Refusal of the Call</h2>
                <p class="stage-description">The fear, doubt, and resistance that keeps you trapped in old patterns.</p>
                
                <div class="card-grid">
                    <div class="card">
                        <div class="card-icon"><i class="fas fa-brain" style="color: var(--orange);"></i></div>
                        <h3 class="card-title">Mental Resistance</h3>
                        <p>"What if I lose control? What if this doesn't work? What if I'm not strong enough?"</p>
                    </div>
                    <div class="card">
                        <div class="card-icon"><i class="fas fa-heart" style="color: var(--orange);"></i></div>
                        <h3 class="card-title">Emotional Barriers</h3>
                        <p>Fear of vulnerability, fear of change, fear of not being enough in your authentic state.</p>
                    </div>
                    <div class="card">
                        <div class="card-icon"><i class="fas fa-users" style="color: var(--orange);"></i></div>
                        <h3 class="card-title">Social Conditioning</h3>
                        <p>"Others expect me to be this way. My identity is tied to these patterns."</p>
                    </div>
                </div>

                <div style="text-align: center; margin: 4rem 0; padding: 3rem; background: rgba(255, 107, 53, 0.1); border-radius: 20px; border: 2px solid var(--orange);">
                    <h3 style="color: var(--orange); font-size: 2rem; margin-bottom: 2rem;">The Cost of Staying</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
                        <div>
                            <h4 style="color: var(--orange); margin-bottom: 1rem;">Before Transformation:</h4>
                            <ul style="text-align: left; color: var(--light-purple-text);">
                                ${reportData.beforeAfter.before.map(item => `<li style="margin-bottom: 0.5rem;">${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 style="color: var(--gold); margin-bottom: 1rem;">After Transformation:</h4>
                            <ul style="text-align: left; color: var(--light-purple-text);">
                                ${reportData.beforeAfter.after.map(item => `<li style="margin-bottom: 0.5rem;">${item}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Stage 4: Meeting the Mentor -->
    <section class="journey-stage" id="stage4">
        <div class="container">
            <div class="stage-number">04</div>
            <div class="stage-content">
                <h2 class="stage-title">Meeting the Mentor</h2>
                <p class="stage-description">Your guide appears - someone who has walked this path and emerged transformed.</p>
                
                <div style="text-align: center; margin: 4rem 0;">
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 50%; padding: 3rem; margin-bottom: 2rem;">
                        <i class="fas fa-user-tie" style="font-size: 4rem; color: var(--gold);"></i>
                    </div>
                    <h3 style="color: var(--gold); font-size: 2rem; margin-bottom: 2rem;">Your Transformation Guide</h3>
                    <p style="font-size: 1.3rem; color: var(--light-purple-text); max-width: 800px; margin: 0 auto;">
                        An expert who understands your unique personality pattern and has guided hundreds through this exact transformation. 
                        They see your potential when you can't see it yourself.
                    </p>
                </div>

                <div class="card-grid">
                    <div class="card">
                        <div class="card-icon"><i class="fas fa-map" style="color: var(--gold);"></i></div>
                        <h3 class="card-title">Weeks 1-2: Foundation</h3>
                        <p>Understanding your core patterns and building the foundation for change.</p>
                    </div>
                    <div class="card">
                        <div class="card-icon"><i class="fas fa-tools" style="color: var(--gold);"></i></div>
                        <h3 class="card-title">Weeks 3-4: Tools</h3>
                        <p>Learning the specific techniques that work for your personality type.</p>
                    </div>
                    <div class="card">
                        <div class="card-icon"><i class="fas fa-rocket" style="color: var(--gold);"></i></div>
                        <h3 class="card-title">Weeks 5-6: Integration</h3>
                        <p>Applying new patterns in real-world situations with guidance.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Call to Action -->
    <section class="journey-stage" style="text-align: center; padding: 8rem 0;">
        <div class="container">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 3rem; color: var(--gold); margin-bottom: 2rem;">
                Your Hero's Journey Awaits
            </h2>
            <p style="font-size: 1.4rem; color: var(--light-purple-text); margin-bottom: 3rem; max-width: 800px; margin-left: auto; margin-right: auto;">
                ${reportData.callToAction}
            </p>
            <a href="#" class="cta-button" style="font-size: 1.4rem; padding: 2rem 4rem;">
                Begin Your Transformation
            </a>
        </div>
    </section>

    <script>
        // Smooth scrolling and animations
        document.addEventListener('DOMContentLoaded', function() {
            // Add scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });

            document.querySelectorAll('.card, .life-area').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });

            // Animate progress bars
            document.querySelectorAll('.progress-fill').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });
    </script>
</body>
</html>`;
}