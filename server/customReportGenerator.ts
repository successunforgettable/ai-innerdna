import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getPersonalityName(primaryType: string): string {
  const typeMap: { [key: string]: string } = {
    "Type 1": "The Reformer",
    "Type 2": "The Helper", 
    "Type 3": "The Achiever",
    "Type 4": "The Individualist",
    "Type 5": "The Investigator",
    "Type 6": "The Loyalist",
    "Type 7": "The Enthusiast",
    "Type 8": "The Challenger",
    "Type 9": "The Peacemaker"
  };
  return typeMap[primaryType] || "The Achiever";
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

function analyzeAssessmentData(assessmentData: AssessmentData): string {
  const analyses = [];
  
  // Foundation stones analysis
  if (assessmentData.foundationStones && assessmentData.foundationStones.length > 0) {
    const patterns = assessmentData.foundationStones.map((stone, index) => {
      if (stone && stone.statements) {
        return `Foundation Set ${index + 1}: "${stone.statements[0]}" - Shows ${getDecisionPattern(index, stone.stoneIndex)}`;
      }
      return `Foundation Set ${index + 1}: Decision pattern available`;
    });
    analyses.push("FOUNDATION ANALYSIS:\n" + patterns.join('\n'));
  }
  
  // Building blocks analysis
  if (assessmentData.buildingBlocks && assessmentData.buildingBlocks.length > 0) {
    const blocks = assessmentData.buildingBlocks.map(block => {
      if (block && block.name) {
        return `${block.name}: ${getBlockMeaning(block.name)}`;
      }
      return "Personality architecture component";
    });
    analyses.push("BUILDING BLOCKS:\n" + blocks.join('\n'));
  }
  
  // Color states analysis
  if (assessmentData.colorStates && assessmentData.colorStates.length > 0) {
    const states = assessmentData.colorStates.map(state => {
      const intensity = state.percentage > 60 ? "Dominant" : state.percentage > 40 ? "Moderate" : "Present";
      return `${state.state} (${state.percentage}%): ${intensity} emotional/behavioral pattern`;
    });
    analyses.push("COLOR STATES:\n" + states.join('\n'));
  }
  
  // Subtype analysis
  if (assessmentData.detailTokens && assessmentData.detailTokens.length > 0) {
    const categoryDistribution = assessmentData.detailTokens.reduce((acc, token) => {
      acc[token.category] = (acc[token.category] || 0) + parseInt(token.token);
      return acc;
    }, {} as { [key: string]: number });
    
    const dominantSubtype = Object.entries(categoryDistribution)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (dominantSubtype) {
      const [category, score] = dominantSubtype;
      const subtypeDesc = category === "self" ? "Self-Preservation focus" : 
                         category === "oneToOne" ? "One-to-One focus" : "Social focus";
      analyses.push(`SUBTYPE FOCUS:\n${subtypeDesc} with ${score} tokens`);
    }
  }
  
  return analyses.join('\n\n');
}

function getDecisionPattern(setIndex: number, stoneIndex: number): string {
  const patterns = [
    ["intuitive decision-making", "analytical approach", "gut-based choices"],
    ["security motivation", "achievement drive", "justice orientation"],
    ["inward energy", "outward expression", "balanced approach"],
    ["group orientation", "individual focus", "selective connection"],
    ["emotional processing", "practical analysis", "intuitive understanding"],
    ["optimistic outlook", "realistic perspective", "cautious approach"],
    ["collaborative style", "independent work", "leadership tendency"],
    ["structured approach", "flexible adaptation", "spontaneous response"],
    ["harmony seeking", "challenge acceptance", "balance maintenance"]
  ];
  
  if (setIndex < patterns.length && stoneIndex < patterns[setIndex].length) {
    return patterns[setIndex][stoneIndex];
  }
  return "decision-making preference";
}

function getBlockMeaning(blockName: string): string {
  const meanings: { [key: string]: string } = {
    "Leadership": "Natural ability to guide and influence others",
    "Creativity": "Strong creative expression and innovative thinking",
    "Analysis": "Deep analytical and problem-solving capabilities",
    "Connection": "Emphasis on relationships and emotional bonds",
    "Structure": "Preference for organization and systematic approaches",
    "Adventure": "Desire for novelty and exciting experiences",
    "Service": "Focus on helping and supporting others",
    "Independence": "Value for autonomy and self-direction",
    "Harmony": "Seeking balance and avoiding conflict"
  };
  
  return meanings[blockName] || "represents a core aspect of your personality architecture";
}

interface AssessmentData {
  primaryType: string;
  confidence: number;
  wing?: string;
  colorStates: Array<{ state: string; percentage: number }>;
  detailTokens: Array<{ category: string; token: string }>;
  foundationStones?: any[];
  buildingBlocks?: any[];
}

interface CustomReportData {
  heroTitle: string;
  heroSubtitle: string;
  personalityType: string;
  influencePattern: string;
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
  transformationStages: Array<{
    title: string;
    description: string;
    insights: string[];
  }>;
  beforeAfter: {
    before: string[];
    after: string[];
  };
  callToAction: string;
}

export async function generateCustomReport(assessmentData: AssessmentData): Promise<CustomReportData> {
  try {
    const personalityName = getPersonalityName(assessmentData.primaryType);
    const influenceName = getInfluenceName(assessmentData.wing);
    const assessmentAnalysis = analyzeAssessmentData(assessmentData);
    
    const prompt = `Based on this comprehensive personality assessment data, generate highly personalized content for a transformational report:

PRIMARY PATTERN: ${personalityName}
CONFIDENCE LEVEL: ${assessmentData.confidence}%
INFLUENCE PATTERN: ${influenceName}

DETAILED ASSESSMENT ANALYSIS:
${assessmentAnalysis}

Create a UNIQUE hero's journey transformation report based on their SPECIFIC combination of traits. Use these personality names only:
- The Achiever, The Challenger, The Peacemaker, The Reformer, The Helper, The Individualist, The Investigator, The Loyalist, The Enthusiast

Never use "Type" or "Wing" terminology. Use "Influence" instead of "Wing".

PERSONALIZATION REQUIREMENTS:
1. Analyze their specific foundation stone choices to understand decision-making patterns
2. Use their building block selections to identify personality architecture
3. Incorporate their color state percentages to reflect current emotional/behavioral patterns
4. Reference their subtype focus (self-preservation, one-to-one, or social) in growth recommendations
5. Create life area percentages that reflect their actual assessment patterns
6. Design transformation stages specific to their personality and influence combination
7. Generate before/after comparisons that address their specific patterns and challenges

Make every section reflect their unique assessment data - no generic content.

Response format:
{
  "heroTitle": "The [Personality Name] Transformation Journey",
  "heroSubtitle": "Your Hero's Path to [Specific Mastery]",
  "personalityType": "[Personality Name]",
  "influencePattern": "[Influence Description]",
  "currentState": {
    "average": 40,
    "belowAverage": 60
  },
  "lifeAreas": [
    {
      "area": "Area Name",
      "icon": "fas fa-icon",
      "description": "[Personalized description based on their data]",
      "percentage": 40
    }
  ],
  "transformationStages": [
    {
      "title": "Stage Title",
      "description": "Personalized stage description",
      "insights": ["insight1", "insight2", "insight3"]
    }
  ],
  "beforeAfter": {
    "before": ["Pattern from their data", "Specific challenge", "Current limitation", "Assessment insight"],
    "after": ["Transformed state", "Growth outcome", "New capability", "Potential realized"]
  },
  "callToAction": "Personalized transformation message based on their specific assessment"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert personality transformation coach specializing in Inner DNA assessment analysis. Generate personalized, inspiring content based on specific assessment results. Analyze the unique combination of foundation stones, building blocks, color states, and detail tokens to create highly personalized transformation content. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2500
    });

    const aiContent = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      heroTitle: aiContent.heroTitle || `${personalityName} Transformation Journey`,
      heroSubtitle: aiContent.heroSubtitle || `Your Hero's Path to Authentic Mastery`,
      personalityType: personalityName,
      influencePattern: influenceName,
      currentState: aiContent.currentState || {
        average: Math.max(30, assessmentData.confidence - 15),
        belowAverage: Math.min(70, 100 - assessmentData.confidence + 15)
      },
      lifeAreas: aiContent.lifeAreas || getPersonalizedLifeAreas(assessmentData),
      transformationStages: aiContent.transformationStages || getPersonalizedStages(assessmentData),
      beforeAfter: aiContent.beforeAfter || getPersonalizedBeforeAfter(assessmentData),
      callToAction: aiContent.callToAction || `Begin your ${personalityName.toLowerCase()} transformation journey today and unlock your authentic potential.`
    };

  } catch (error) {
    console.error("Error generating custom report:", error);
    
    const personalityName = getPersonalityName(assessmentData.primaryType);
    const influenceName = getInfluenceName(assessmentData.wing);
    
    return {
      heroTitle: `${personalityName} Transformation Journey`,
      heroSubtitle: `Your Hero's Path to Authentic Mastery`,
      personalityType: personalityName,
      influencePattern: influenceName,
      currentState: {
        average: Math.max(20, assessmentData.confidence - 20),
        belowAverage: Math.min(80, 100 - assessmentData.confidence)
      },
      lifeAreas: getPersonalizedLifeAreas(assessmentData),
      transformationStages: getPersonalizedStages(assessmentData),
      beforeAfter: getPersonalizedBeforeAfter(assessmentData),
      callToAction: `Begin your ${personalityName.toLowerCase()} transformation journey today and unlock your authentic potential.`
    };
  }
}

function getPersonalizedLifeAreas(assessmentData: AssessmentData) {
  const confidenceBoost = Math.floor(assessmentData.confidence / 10);
  return [
    { area: "Career", icon: "fas fa-briefcase", description: "Professional growth and leadership development", percentage: Math.min(95, 45 + confidenceBoost) },
    { area: "Relationships", icon: "fas fa-heart", description: "Emotional intelligence and connection", percentage: Math.min(95, 55 + confidenceBoost) },
    { area: "Health", icon: "fas fa-heartbeat", description: "Physical and mental wellbeing", percentage: Math.min(95, 40 + confidenceBoost) },
    { area: "Spirituality", icon: "fas fa-leaf", description: "Inner peace and purpose", percentage: Math.min(95, 35 + confidenceBoost) },
    { area: "Personal Growth", icon: "fas fa-seedling", description: "Self-awareness and development", percentage: Math.min(95, 60 + confidenceBoost) },
    { area: "Finances", icon: "fas fa-coins", description: "Financial stability and abundance", percentage: Math.min(95, 50 + confidenceBoost) },
    { area: "Recreation", icon: "fas fa-smile", description: "Joy and life balance", percentage: Math.min(95, 45 + confidenceBoost) },
    { area: "Contribution", icon: "fas fa-hands-helping", description: "Making a meaningful impact", percentage: Math.min(95, 55 + confidenceBoost) }
  ];
}

function getPersonalizedStages(assessmentData: AssessmentData) {
  const personalityName = getPersonalityName(assessmentData.primaryType);
  return [
    {
      title: "Awakening",
      description: "Recognizing your current patterns and their limitations",
      insights: [`Understanding your ${personalityName.toLowerCase()} core motivations`, "Identifying unconscious behavioral patterns", "Recognizing growth opportunities"]
    },
    {
      title: "Exploration", 
      description: "Discovering new possibilities and perspectives",
      insights: ["Exploring beyond comfort zone boundaries", "Developing emotional intelligence", "Building self-awareness practices"]
    },
    {
      title: "Integration",
      description: "Combining insights with daily practice",
      insights: ["Implementing new behavioral patterns", "Balancing strengths with growth areas", "Creating sustainable change habits"]
    },
    {
      title: "Mastery",
      description: "Embodying your transformed self",
      insights: ["Living authentically from your core", "Leading others through example", "Creating positive ripple effects"]
    },
    {
      title: "Service",
      description: "Contributing your gifts to the world",
      insights: ["Mentoring others on their journey", "Creating meaningful impact", "Living your highest purpose"]
    }
  ];
}

function getPersonalizedBeforeAfter(assessmentData: AssessmentData) {
  const personalityName = getPersonalityName(assessmentData.primaryType);
  const patterns: { [key: string]: {before: string[]; after: string[]} } = {
    "The Challenger": {
      before: ["Led from survival", "Chronically defensive", "Disconnected from vulnerability", "Attracted conflict"],
      after: ["Leads with presence", "Emotionally intelligent", "Heart-brain connected", "Attracts collaboration"]
    },
    "The Achiever": {
      before: ["Driven by external validation", "Image-focused", "Disconnected from feelings", "Burned out from overwork"],
      after: ["Internally motivated", "Authentically confident", "Emotionally aware", "Balanced and sustainable"]
    },
    "The Helper": {
      before: ["People-pleasing", "Neglecting own needs", "Manipulative giving", "Resentful and exhausted"],
      after: ["Healthy boundaries", "Self-caring", "Genuine generosity", "Energized and fulfilled"]
    }
  };
  
  return patterns[personalityName] || {
    before: ["Reactive patterns", "Limited self-awareness", "Stuck in comfort zone", "Unfulfilled potential"],
    after: ["Conscious responses", "Deep self-knowledge", "Embracing growth", "Living authentically"]
  };
}

export function generateCustomReportHTML(reportData: CustomReportData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.heroTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-purple: #6B46C1;
            --mid-purple: #9333EA;
            --light-purple: #A855F7;
            --gold: #FFD700;
            --cyan: #00D4FF;
            --orange: #FF6B35;
            --white: #FFFFFF;
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

        .hero-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .hero-content {
            z-index: 10;
            max-width: 800px;
            padding: 2rem;
        }

        .hero-title {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, var(--gold), var(--cyan), var(--orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s ease-in-out infinite;
        }

        .hero-subtitle {
            font-size: 1.5rem;
            font-weight: 300;
            opacity: 0.9;
            margin-bottom: 2rem;
        }

        @keyframes shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .floating-element {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .journey-stage {
            padding: 4rem 2rem;
            position: relative;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 100px 1fr;
            gap: 3rem;
            align-items: center;
        }

        .stage-number {
            font-size: 4rem;
            font-weight: 800;
            background: linear-gradient(45deg, var(--gold), var(--orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stage-content {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stage-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--gold);
        }

        .stage-description {
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        .highlight-text {
            color: var(--gold);
            font-weight: 600;
        }

        .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }

        .stat-item {
            text-align: center;
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-number {
            display: block;
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
        }

        .danger-indicator {
            color: #FF6B6B;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .life-areas-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .life-area-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }

        .life-area-card:hover {
            transform: translateY(-5px);
        }

        .area-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }

        .area-icon {
            font-size: 1.5rem;
            margin-right: 0.75rem;
            color: var(--gold);
        }

        .area-title {
            font-size: 1.1rem;
            font-weight: 600;
        }

        .area-description {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 1rem;
            line-height: 1.4;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--gold), var(--orange));
            border-radius: 10px;
            transition: width 1s ease;
        }

        .percentage-text {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--gold);
        }

        .transformation-timeline {
            margin: 2rem 0;
        }

        .timeline-stage {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .timeline-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--gold);
            margin-bottom: 0.5rem;
        }

        .timeline-description {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 1rem;
        }

        .insights-list {
            list-style: none;
            padding-left: 1rem;
        }

        .insights-list li {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 0.5rem;
            position: relative;
        }

        .insights-list li:before {
            content: "→";
            color: var(--gold);
            font-weight: bold;
            position: absolute;
            left: -1rem;
        }

        .before-after-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin: 2rem 0;
        }

        .before-after-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .before-after-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1rem;
            text-align: center;
        }

        .before-title {
            color: #FF6B6B;
        }

        .after-title {
            color: #4ECDC4;
        }

        .before-after-list {
            list-style: none;
        }

        .before-after-list li {
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            opacity: 0.9;
        }

        .cta-section {
            text-align: center;
            padding: 3rem 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            margin: 2rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cta-text {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--gold);
            margin-bottom: 1rem;
        }

        .cta-button {
            display: inline-block;
            background: linear-gradient(45deg, var(--gold), var(--orange));
            color: #1a1a1a;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: transform 0.3s ease;
            margin-top: 1rem;
        }

        .cta-button:hover {
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .container {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .before-after-section {
                grid-template-columns: 1fr;
            }
            
            .life-areas-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="floating-element" style="top: 10%; left: 10%; animation-delay: 0s;"></div>
    <div class="floating-element" style="top: 20%; right: 15%; animation-delay: 1s;"></div>
    <div class="floating-element" style="bottom: 30%; left: 20%; animation-delay: 2s;"></div>
    <div class="floating-element" style="bottom: 10%; right: 10%; animation-delay: 3s;"></div>

    <section class="hero-section">
        <div class="hero-content">
            <h1 class="hero-title">${reportData.heroTitle}</h1>
            <p class="hero-subtitle">${reportData.heroSubtitle}</p>
        </div>
    </section>

    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">01</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Current Reality</h2>
                <p class="stage-description">You are a <span class="highlight-text">${reportData.personalityType}</span> with <span class="highlight-text">${reportData.influencePattern}</span>. This assessment reveals your unique transformation path.</p>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <span class="stat-number danger-indicator">${reportData.currentState.average}%</span>
                        <span class="stat-label">Current Functioning<br>Room for Growth</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number danger-indicator">${reportData.currentState.belowAverage}%</span>
                        <span class="stat-label">Below Potential<br>Transformation Needed</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">02</div>
            <div class="stage-content">
                <h2 class="stage-title">Life Areas Assessment</h2>
                <p class="stage-description">Based on your specific assessment results, here's how you're performing across key life areas and where you have the most potential for growth.</p>
                
                <div class="life-areas-grid">
                    ${reportData.lifeAreas.map(area => `
                        <div class="life-area-card">
                            <div class="area-header">
                                <i class="${area.icon} area-icon"></i>
                                <h3 class="area-title">${area.area}</h3>
                            </div>
                            <p class="area-description">${area.description}</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${area.percentage}%"></div>
                            </div>
                            <div class="percentage-text">${area.percentage}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">03</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Transformation Journey</h2>
                <p class="stage-description">This is your personalized roadmap based on your unique assessment profile to unlock your full potential and live your most authentic life.</p>
                
                <div class="transformation-timeline">
                    ${reportData.transformationStages.map((stage, index) => `
                        <div class="timeline-stage">
                            <h3 class="timeline-title">Stage ${index + 1}: ${stage.title}</h3>
                            <p class="timeline-description">${stage.description}</p>
                            <ul class="insights-list">
                                ${stage.insights.map(insight => `<li>${insight}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">04</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Transformation</h2>
                <p class="stage-description">Based on your assessment patterns, here's what your life looks like before and after your transformation journey.</p>
                
                <div class="before-after-section">
                    <div class="before-after-card">
                        <h3 class="before-after-title before-title">Before Transformation</h3>
                        <ul class="before-after-list">
                            ${reportData.beforeAfter.before.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="before-after-card">
                        <h3 class="before-after-title after-title">After Transformation</h3>
                        <ul class="before-after-list">
                            ${reportData.beforeAfter.after.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <p class="cta-text">${reportData.callToAction}</p>
        <a href="#" class="cta-button">Begin Your Transformation</a>
    </section>

    <script>
        window.addEventListener('load', function() {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        });

        function createFloatingElement() {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.top = Math.random() * 100 + '%';
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDelay = Math.random() * 6 + 's';
            document.body.appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 6000);
        }

        setInterval(createFloatingElement, 3000);
    </script>
</body>
</html>`;
}