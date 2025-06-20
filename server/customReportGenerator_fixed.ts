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
  const typeMap: { [key: string]: string } = {
    "1": "The Reformer",
    "2": "The Helper", 
    "3": "The Achiever",
    "4": "The Individualist",
    "5": "The Investigator",
    "6": "The Loyalist",
    "7": "The Enthusiast",
    "8": "The Challenger",
    "9": "The Peacemaker"
  };
  return typeMap[type] || "The Achiever";
}

function getInfluenceName(wing?: string): string {
  if (!wing) return "Balanced Influence";
  const wingMap: { [key: string]: string } = {
    "1": "Reformer Influence",
    "2": "Helper Influence",
    "3": "Achiever Influence", 
    "4": "Individualist Influence",
    "5": "Investigator Influence",
    "6": "Loyalist Influence",
    "7": "Enthusiast Influence",
    "8": "Challenger Influence",
    "9": "Peacemaker Influence"
  };
  return wingMap[wing] || "Balanced Influence";
}

function getPersonalityDescription(type: string): string {
  const descriptions: { [key: string]: string } = {
    "The Achiever": "driven by success, image, and efficiency - always striving to be the best version of yourself",
    "The Challenger": "wired for control, strength, and protection - you step forward when others step back",
    "The Peacemaker": "motivated by harmony, comfort, and avoiding conflict - you seek unity and peace",
    "The Reformer": "focused on perfection, improvement, and doing what's right",
    "The Helper": "driven by helping others and being needed",
    "The Individualist": "seeking authenticity, depth, and unique self-expression",
    "The Investigator": "motivated by understanding, competence, and independence",
    "The Loyalist": "focused on security, support, and loyal relationships",
    "The Enthusiast": "driven by variety, stimulation, and avoiding limitation"
  };
  return descriptions[type] || "focused on growth and self-improvement";
}

export async function generateCustomReport(assessmentData: AssessmentData): Promise<CustomReportData> {
  try {
    const personalityName = getPersonalityName(assessmentData.primaryType);
    const influenceName = getInfluenceName(assessmentData.wing);
    
    // Use template approach - create structured prompt that fills in specific data slots
    const prompt = `You are filling in a transformation report template with personalized data. Use the assessment data to fill EACH section with content specific to this individual.

ASSESSMENT DATA TO USE:
- Personality: ${personalityName}
- Confidence: ${assessmentData.confidence}%
- Wing: ${influenceName}
- Foundation Stones: ${JSON.stringify(assessmentData.foundationStones)}
- Building Blocks: ${JSON.stringify(assessmentData.buildingBlocks)}
- Color States: ${JSON.stringify(assessmentData.colorStates)}
- Detail Tokens: ${JSON.stringify(assessmentData.detailTokens)}

TEMPLATE TO FILL:
For each section below, write content that uses their specific assessment data. Make it feel personal to THIS individual with THEIR patterns.

1. Hero Title: "The ${personalityName} Transformation Journey" 
2. Hero Subtitle: [Write subtitle that mentions their specific patterns/data]
3. Personality Description: [Use their foundation stone decisions + ${personalityName} traits]
4. Current State: [Based on ${personalityName} typical patterns]
5. Life Areas: [${personalityName} career/relationship/health/growth with their specific patterns]
6. Challenge Cards: [4 challenges from their foundation/color/building/token data]
7. Before/After: [Current ${personalityName} patterns vs transformed states]
8. Call to Action: [Personal message for ${personalityName} addressing their patterns]

IMPORTANT: Every piece of content must reference their actual assessment selections. No generic content.

Output JSON format:
{
  "heroTitle": "The ${personalityName} Transformation Journey",
  "heroSubtitle": "[subtitle using their data]",
  "personalityDescription": "[${personalityName} description using their foundation stones]",
  "currentStateDescription": "[their current patterns]",
  "currentState": {
    "average": [number for ${personalityName}],
    "belowAverage": [number for ${personalityName}]
  },
  "lifeAreas": [
    {"area": "Career", "icon": "fas fa-briefcase", "description": "[${personalityName} career with their patterns]", "percentage": [realistic number]},
    {"area": "Relationships", "icon": "fas fa-heart", "description": "[${personalityName} relationships with their color states]", "percentage": [realistic number]},
    {"area": "Health", "icon": "fas fa-heartbeat", "description": "[${personalityName} health with their stress patterns]", "percentage": [realistic number]},
    {"area": "Personal Growth", "icon": "fas fa-seedling", "description": "[${personalityName} growth with their assessment]", "percentage": [realistic number]}
  ],
  "challengeCards": [
    {"title": "[challenge from foundation stones]", "description": "[specific to their selections]"},
    {"title": "[challenge from color states]", "description": "[specific to their emotional patterns]"},
    {"title": "[challenge from building blocks]", "description": "[specific to their architecture]"},
    {"title": "[challenge from detail tokens]", "description": "[specific to their subtype]"}
  ],
  "beforeAfter": {
    "before": ["[current pattern from stones]", "[limitation from colors]", "[challenge from blocks]", "[struggle from tokens]"],
    "after": ["[transformed pattern]", "[healthy state]", "[integrated growth]", "[evolved focus]"]
  },
  "callToAction": "[personal message for ${personalityName} with their data]"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert personality transformation coach. Generate personalized content based on specific assessment results. Analyze the unique combination of traits to create highly personalized transformation content. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000
    });

    const aiContent = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      heroTitle: aiContent.heroTitle || `${personalityName} Transformation Journey`,
      heroSubtitle: aiContent.heroSubtitle || `Your Hero's Path to Authentic Mastery`,
      personalityType: personalityName,
      influencePattern: influenceName,
      personalityDescription: aiContent.personalityDescription || getPersonalityDescription(personalityName),
      currentStateDescription: aiContent.currentStateDescription || `Current patterns and challenges for ${personalityName}`,
      currentState: aiContent.currentState || {
        average: 60,
        belowAverage: 40
      },
      lifeAreas: aiContent.lifeAreas || [],
      challengeCards: aiContent.challengeCards || [],
      beforeAfter: aiContent.beforeAfter || {
        before: ["Current patterns", "Present limitations", "Existing challenges", "Unaddressed struggles"],
        after: ["Transformed patterns", "New capabilities", "Integrated growth", "Realized potential"]
      },
      callToAction: aiContent.callToAction || `Begin your ${personalityName} transformation journey today.`
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

        .hero-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 900;
            background: linear-gradient(45deg, var(--gold), var(--cyan), var(--orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 2rem;
        }

        .hero-subtitle {
            font-size: 1.8rem;
            color: var(--light-purple-text);
            margin-bottom: 3rem;
            font-weight: 300;
        }

        .journey-stage {
            min-height: 100vh;
            padding: 5rem 0;
            position: relative;
        }

        .stage-title {
            font-family: 'Playfair Display', serif;
            font-size: 4rem;
            font-weight: 700;
            color: var(--gold);
            margin-bottom: 2rem;
            text-align: center;
        }

        .stage-description {
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 4rem;
            color: var(--light-purple-text);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        .highlight-text {
            color: var(--gold);
            font-weight: 700;
        }

        .stats-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 3rem;
            margin: 4rem 0;
        }

        .stat-item {
            text-align: center;
            margin: 1rem;
        }

        .stat-number {
            font-size: 4rem;
            font-weight: 900;
            color: var(--orange);
            display: block;
        }

        .stat-label {
            font-size: 1.2rem;
            color: var(--light-purple-text);
        }

        .wheel-of-life {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin: 4rem 0;
        }

        .life-area {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            border-left: 5px solid var(--gold);
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            overflow: hidden;
            margin: 1rem 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--orange), var(--gold), var(--cyan));
            border-radius: 10px;
            transition: width 2s ease-in-out;
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
            border-left: 5px solid var(--gold);
        }

        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--gold);
        }

        .card-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--white);
        }

        .before-after {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            margin: 4rem 0;
        }

        .before-section {
            background: rgba(255, 107, 53, 0.2);
            border-radius: 20px;
            padding: 2rem;
            border-left: 5px solid var(--orange);
        }

        .after-section {
            background: rgba(0, 212, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            border-left: 5px solid var(--cyan);
        }

        .timeline {
            position: relative;
            margin: 4rem 0;
        }

        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            height: 100%;
            width: 4px;
            background: linear-gradient(to bottom, var(--gold), var(--cyan));
            transform: translateX(-50%);
        }

        .timeline-item {
            position: relative;
            margin: 3rem 0;
        }

        .timeline-dot {
            position: absolute;
            left: 50%;
            width: 20px;
            height: 20px;
            background: var(--gold);
            border-radius: 50%;
            transform: translateX(-50%);
            z-index: 2;
        }

        .timeline-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            margin-left: 60%;
            width: 35%;
        }

        .timeline-item:nth-child(even) .timeline-content {
            margin-left: 5%;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, var(--gold), var(--orange));
            color: var(--primary-purple);
            padding: 1.5rem 3rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        @media (max-width: 768px) {
            .before-after {
                grid-template-columns: 1fr;
            }
            .wheel-of-life {
                grid-template-columns: 1fr;
            }
            .timeline-content {
                margin-left: 10% !important;
                width: 80% !important;
            }
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">${reportData.heroTitle}</h1>
            <p class="hero-subtitle">${reportData.heroSubtitle}</p>
        </div>
    </section>

    <!-- Stage 1: The Ordinary World -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-content">
                <h2 class="stage-title">The Ordinary World</h2>
                <p class="stage-description">You are a <span class="highlight-text">${reportData.personalityType} ${reportData.influencePattern}</span> - ${reportData.personalityDescription}. But this is your current reality...</p>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <span class="stat-number">${reportData.currentState.average}%</span>
                        <span class="stat-label">Average State<br>Productive but Reactive</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${reportData.currentState.belowAverage}%</span>
                        <span class="stat-label">Below Average State<br>Frustrated & Exhausted</span>
                    </div>
                </div>

                <div class="wheel-of-life">
                    ${reportData.lifeAreas.map(area => `
                        <div class="life-area">
                            <h4><i class="${area.icon}" style="color: var(--gold);"></i> ${area.area}</h4>
                            <p>${area.description}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${area.percentage}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- Stage 2: The Call to Adventure -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-content">
                <h2 class="stage-title">The Call to Adventure</h2>
                <p class="stage-description">Deep down, you know there's more. Your <span class="highlight-text">${reportData.personalityType}</span> nature is calling you to break free from these limiting patterns...</p>
                
                <div class="card-grid">
                    ${reportData.challengeCards.map(card => `
                        <div class="card">
                            <div class="card-icon"><i class="fas fa-exclamation-triangle" style="color: var(--orange);"></i></div>
                            <h3 class="card-title">${card.title}</h3>
                            <p>${card.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <!-- Stage 3: Meeting the Mentor -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-content">
                <h2 class="stage-title">Meeting the Mentor</h2>
                <p class="stage-description">Enter <span class="highlight-text">"The Incredible You"</span> - your guide to heart-brain reactivation and nervous system transformation.</p>
                
                <div class="timeline">
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4 style="color: var(--gold);">Weeks 1-2: Foundation</h4>
                            <p>Initial heart-brain coherence assessment and personalized activation protocol.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4 style="color: var(--gold);">Weeks 3-4: Awareness</h4>
                            <p>Recognize your patterns and begin nervous system regulation practices.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4 style="color: var(--gold);">Weeks 5-6: Integration</h4>
                            <p>Start applying new patterns in real-world scenarios.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4 style="color: var(--gold);">Weeks 7-8: Mastery</h4>
                            <p>Embody your transformed self with sustained coherence.</p>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4 style="color: var(--gold);">Weeks 9-10: Integration</h4>
                            <p>Lock in permanent transformation and create ongoing practice.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stage 4: Transformation -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-content">
                <h2 class="stage-title">The Transformation</h2>
                <p class="stage-description">This is what becomes possible when you complete <span class="highlight-text">The Incredible You</span> journey...</p>
                
                <div class="before-after">
                    <div class="before-section">
                        <h3><i class="fas fa-times-circle"></i> Before</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${reportData.beforeAfter.before.map(item => `
                                <li><i class="fas fa-arrow-right" style="color: var(--orange);"></i> ${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="after-section">
                        <h3><i class="fas fa-lightbulb"></i> After</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${reportData.beforeAfter.after.map(item => `
                                <li><i class="fas fa-arrow-right" style="color: var(--cyan);"></i> ${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <div style="text-align: center; margin: 3rem 0;">
                    <p style="font-size: 1.5rem; color: var(--gold); margin-bottom: 2rem;">
                        ${reportData.callToAction}
                    </p>
                    <a href="#" class="cta-button">Begin Your Transformation</a>
                </div>
            </div>
        </div>
    </section>

</body>
</html>`;
}