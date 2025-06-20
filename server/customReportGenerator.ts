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
      before: ["Led from survival mode", "Chronically defensive", "Disconnected from vulnerability", "Attracted conflict"],
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
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.2rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(255, 215, 0, 0.5);
        }

        .journey-stage {
            padding: 5rem 0;
            position: relative;
        }

        .stage-number {
            position: absolute;
            top: 2rem;
            left: 2rem;
            font-size: 8rem;
            font-weight: 900;
            background: linear-gradient(45deg, var(--gold), var(--orange));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            opacity: 0.1;
        }

        .stage-content {
            position: relative;
            z-index: 2;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            padding: 4rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
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
            font-size: 1.3rem;
            text-align: center;
            margin-bottom: 3rem;
            color: var(--light-purple-text);
            line-height: 1.8;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }

        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-10px);
        }

        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-align: center;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--gold);
            text-align: center;
        }

        .stats-container {
            display: flex;
            justify-content: center;
            gap: 4rem;
            margin: 4rem 0;
            flex-wrap: wrap;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 4rem;
            font-weight: 900;
            color: var(--gold);
            display: block;
        }

        .stat-label {
            font-size: 1.2rem;
            color: var(--light-purple-text);
        }

        .wheel-of-life {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin: 4rem 0;
        }

        .life-area {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 2rem;
            border-left: 5px solid var(--gold);
            transition: transform 0.3s ease;
        }

        .life-area:hover {
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
            font-size: 1.2rem;
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

        .percentage-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--gold);
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
            box-shadow: 0 0 20px var(--gold);
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

        .highlight-text {
            background: linear-gradient(45deg, var(--gold), var(--cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
        }

        .danger-indicator {
            color: var(--orange);
            font-weight: 700;
            animation: blink 2s infinite;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
        }

        .testimonial {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem;
            margin: 3rem 0;
            text-align: center;
            border: 2px solid var(--gold);
        }

        .testimonial-quote {
            font-size: 1.5rem;
            font-style: italic;
            margin-bottom: 2rem;
            color: var(--light-purple-text);
        }

        .testimonial-author {
            font-weight: 700;
            color: var(--gold);
        }

        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            margin: 4rem 0;
        }

        .floating-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }

        .floating-element {
            position: absolute;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
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

            .stats-container {
                gap: 2rem;
            }
        }
    </style>
</head>
<body>
    <div class="floating-elements">
        <div class="floating-element" style="top: 10%; left: 10%; width: 20px; height: 20px; background: rgba(255, 215, 0, 0.1); border-radius: 50%; animation-delay: 0s;"></div>
        <div class="floating-element" style="top: 20%; right: 15%; width: 15px; height: 15px; background: rgba(0, 212, 255, 0.1); border-radius: 50%; animation-delay: 1s;"></div>
        <div class="floating-element" style="bottom: 30%; left: 20%; width: 25px; height: 25px; background: rgba(255, 107, 53, 0.1); border-radius: 50%; animation-delay: 2s;"></div>
        <div class="floating-element" style="bottom: 10%; right: 10%; width: 18px; height: 18px; background: rgba(255, 215, 0, 0.1); border-radius: 50%; animation-delay: 3s;"></div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
            <h1 class="hero-title">${reportData.heroTitle}</h1>
            <p class="hero-subtitle">${reportData.heroSubtitle}</p>
            <a href="#stage1" class="cta-button">Begin Your Journey</a>
        </div>
    </section>

    <!-- Stage 1: Ordinary World -->
    <section class="journey-stage" id="stage1">
        <div class="container">
            <div class="stage-number">01</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Current Reality</h2>
                <p class="stage-description">You are a <span class="highlight-text">${reportData.personalityType}</span> with <span class="highlight-text">${reportData.influencePattern}</span>. This assessment reveals your unique transformation path based on your specific choices and patterns.</p>
                
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

    <div class="section-divider"></div>

    <!-- Stage 2: The Call to Adventure -->
    <section class="journey-stage" id="stage2">
        <div class="container">
            <div class="stage-number">02</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Life Areas Assessment</h2>
                <p class="stage-description">Based on your specific assessment results, here's how you're performing across key life areas and where you have the most potential for growth.</p>
                
                <div class="wheel-of-life">
                    ${reportData.lifeAreas.map(area => `
                        <div class="life-area">
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

                <div class="testimonial">
                    <p class="testimonial-quote">"I never realized how disconnected I was from my true potential until I saw my assessment results. It was a wake-up call."</p>
                    <p class="testimonial-author">- Previous Participant</p>
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Stage 3: Meeting the Mentor -->
    <section class="journey-stage" id="stage3">
        <div class="container">
            <div class="stage-number">03</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Transformation Journey</h2>
                <p class="stage-description">This is your personalized roadmap based on your unique assessment profile to unlock your full potential and live your most authentic life.</p>
                
                <div class="timeline">
                    ${reportData.transformationStages.map((stage, index) => `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h4 class="timeline-title">Stage ${index + 1}: ${stage.title}</h4>
                                <p class="timeline-description">${stage.description}</p>
                                <ul class="insights-list">
                                    ${stage.insights.map(insight => `<li>${insight}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Stage 4: Transformation -->
    <section class="journey-stage" id="stage4">
        <div class="container">
            <div class="stage-number">04</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Transformation</h2>
                <p class="stage-description">Based on your assessment patterns, here's what your life looks like before and after your transformation journey.</p>
                
                <div class="before-after">
                    <div class="before-section">
                        <h3><i class="fas fa-times-circle"></i> Before Transformation</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${reportData.beforeAfter.before.map(item => `
                                <li style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
                                    <i class="fas fa-arrow-right" style="color: var(--orange); margin-right: 0.5rem;"></i>${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="after-section">
                        <h3><i class="fas fa-lightbulb"></i> After Transformation</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${reportData.beforeAfter.after.map(item => `
                                <li style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
                                    <i class="fas fa-arrow-right" style="color: var(--cyan); margin-right: 0.5rem;"></i>${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Final CTA -->
    <section class="journey-stage">
        <div class="container">
            <div style="text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border-radius: 30px; border: 2px solid var(--gold);">
                <h2 style="font-family: 'Playfair Display', serif; font-size: 3rem; color: var(--gold); margin-bottom: 1rem;">Ready to Transform?</h2>
                <p style="font-size: 1.3rem; color: var(--light-purple-text); margin-bottom: 2rem;">${reportData.callToAction}</p>
                <a href="#" class="cta-button">Begin Your Transformation</a>
            </div>
        </div>
    </section>

    <script>
        // Progress bar animation on load
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

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Create additional floating elements dynamically
        function createFloatingElement() {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = \`
                top: \${Math.random() * 100}%;
                left: \${Math.random() * 100}%;
                width: \${Math.random() * 15 + 10}px;
                height: \${Math.random() * 15 + 10}px;
                background: rgba(\${Math.random() > 0.5 ? '255, 215, 0' : '0, 212, 255'}, 0.1);
                border-radius: 50%;
                animation-delay: \${Math.random() * 6}s;
            \`;
            
            document.querySelector('.floating-elements').appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 6000);
        }

        // Add new floating elements periodically
        setInterval(createFloatingElement, 3000);

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all major sections
        document.querySelectorAll('.journey-stage').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    </script>
</body>
</html>`;
}