import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper functions to convert to approved terminology
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
    // Generate AI content based on assessment data
    const personalityName = getPersonalityName(assessmentData.primaryType);
    const influenceName = getInfluenceName(assessmentData.wing);
    
    const prompt = `Based on this personality assessment data, generate content for a transformational report:

Primary Pattern: ${personalityName}
Confidence: ${assessmentData.confidence}%
Influence Pattern: ${influenceName}
Color States: ${assessmentData.colorStates.map(s => `${s.state}: ${s.percentage}%`).join(', ')}
Detail Token Distribution: ${assessmentData.detailTokens.map(t => `${t.category}: ${t.token}`).join(', ')}

Create content for a hero's journey transformation report. Use these personality names only:
- The Achiever, The Challenger, The Peacemaker, The Reformer, The Helper, The Individualist, The Investigator, The Loyalist, The Enthusiast

Never use "Type" or "Wing" terminology. Use "Influence" instead of "Wing".

Create inspiring, transformation-focused content for a hero's journey report. Focus on personal growth and development.

Response format:
{
  "heroTitle": "The [Personality Name] Transformation Journey",
  "heroSubtitle": "Your Hero's Path to [Specific Mastery]",
  "personalityType": "[Personality Name]",
  "influencePattern": "[Influence Description]",
  "currentState": {
    "average": 60,
    "belowAverage": 40
  },
  "lifeAreas": [
    {
      "area": "Career",
      "icon": "fas fa-briefcase",
      "description": "[Personalized description]",
      "percentage": 40
    }
  ],
  "transformationStages": [
    {
      "title": "Stage Title",
      "description": "Stage description",
      "insights": ["insight1", "insight2", "insight3"]
    }
  ],
  "beforeAfter": {
    "before": ["Led from survival", "Chronically defensive", "Disconnected", "Attracted conflict"],
    "after": ["Leads with presence", "Emotionally intelligent", "Heart-brain connected", "Attracts collaboration"]
  },
  "callToAction": "Personalized transformation message"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert personality transformation coach. Generate personalized, inspiring content based on assessment results. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    const aiContent = JSON.parse(response.choices[0].message.content || '{}');
    return aiContent;

  } catch (error) {
    console.error("Error generating custom report:", error);
    
    // Fallback content based on assessment data
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
      lifeAreas: [
        {
          area: "Career",
          icon: "fas fa-briefcase",
          description: "You have leadership potential but may feel unfulfilled in your current path.",
          percentage: 45
        },
        {
          area: "Relationships",
          icon: "fas fa-heart",
          description: "Deep connections are important to you but trust can be challenging.",
          percentage: 40
        },
        {
          area: "Personal Growth",
          icon: "fas fa-seedling",
          description: "You seek development but need the right approach for your type.",
          percentage: 35
        },
        {
          area: "Mental State",
          icon: "fas fa-brain",
          description: "Your mind processes intensely but could benefit from more peace.",
          percentage: 50
        },
        {
          area: "Physical Health",
          icon: "fas fa-dumbbell",
          description: "Stress patterns may manifest physically in your body.",
          percentage: 45
        },
        {
          area: "Finances",
          icon: "fas fa-dollar-sign",
          description: "You're capable but emotional patterns affect financial decisions.",
          percentage: 55
        },
        {
          area: "Social Life",
          icon: "fas fa-users",
          description: "You connect selectively and value authentic relationships.",
          percentage: 40
        },
        {
          area: "Environment",
          icon: "fas fa-home",
          description: "Your space reflects your inner state and control needs.",
          percentage: 50
        }
      ],
      transformationStages: [
        {
          title: "Recognition",
          description: "Understanding your current patterns and their impact",
          insights: ["Identify reactive patterns", "Understand your motivations", "See the cost of current approach"]
        },
        {
          title: "Integration",
          description: "Learning new ways of being and responding",
          insights: ["Practice new behaviors", "Build emotional intelligence", "Develop healthier patterns"]
        },
        {
          title: "Mastery",
          description: "Living from your transformed authentic self",
          insights: ["Lead with presence", "Create lasting relationships", "Live with purpose and peace"]
        }
      ],
      beforeAfter: {
        before: [
          "Led from reactive patterns",
          "Felt constantly under pressure",
          "Struggled with emotional connection",
          "Attracted conflict and resistance"
        ],
        after: [
          "Leads from authentic presence",
          "Maintains inner peace and strength",
          "Creates deep, meaningful connections",
          "Attracts collaboration and trust"
        ]
      },
      callToAction: "Your transformation journey awaits. The insights you've gained today are just the beginning of what's possible when you commit to authentic growth."
    };
  }
}

export function generateCustomReportHTML(reportData: CustomReportData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.heroTitle} - Your Transformation Journey</title>
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

        .journey-stage {
            padding: 100px 0;
            position: relative;
        }

        .stage-number {
            font-size: 8rem;
            font-weight: 900;
            color: rgba(255, 255, 255, 0.1);
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }

        .stage-content {
            position: relative;
            z-index: 2;
        }

        .stage-title {
            font-family: 'Playfair Display', serif;
            font-size: 4rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 3rem;
            background: linear-gradient(45deg, var(--gold), var(--cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stage-description {
            font-size: 1.3rem;
            text-align: center;
            margin-bottom: 4rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            color: var(--light-purple-text);
        }

        .stats-container {
            display: flex;
            justify-content: space-around;
            margin: 4rem 0;
            flex-wrap: wrap;
        }

        .stat-item {
            text-align: center;
            margin: 1rem;
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

        .danger-indicator {
            color: var(--orange);
            font-weight: 700;
            animation: blink 2s infinite;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
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

        .highlight-text {
            background: linear-gradient(45deg, var(--gold), var(--cyan));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
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

        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            margin: 4rem 0;
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

        @media (max-width: 768px) {
            .hero-title {
                font-size: 3rem;
            }
            
            .stage-title {
                font-size: 2.5rem;
            }
            
            .wheel-of-life {
                grid-template-columns: 1fr;
            }
            
            .before-after {
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
    <div class="floating-elements">
        <div class="floating-element" style="top: 10%; left: 10%; color: var(--gold); font-size: 2rem;">⚡</div>
        <div class="floating-element" style="top: 20%; right: 15%; color: var(--cyan); font-size: 1.5rem; animation-delay: -2s;">💫</div>
        <div class="floating-element" style="bottom: 30%; left: 20%; color: var(--orange); font-size: 2.5rem; animation-delay: -4s;">🌟</div>
        <div class="floating-element" style="bottom: 20%; right: 10%; color: var(--gold); font-size: 1.8rem; animation-delay: -1s;">✨</div>
    </div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
            <h1 class="hero-title">${reportData.heroTitle}</h1>
            <p class="hero-subtitle">${reportData.heroSubtitle}</p>
        </div>
    </section>

    <!-- Current Reality -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">01</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Current Reality</h2>
                <p class="stage-description">You are a <span class="highlight-text">${reportData.personalityType}</span> with <span class="highlight-text">${reportData.wingInfluence}</span>. This is your current state...</p>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <span class="stat-number danger-indicator">${reportData.currentState.average}%</span>
                        <span class="stat-label">Current Functioning<br>Room for Growth</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number danger-indicator">${reportData.currentState.belowAverage}%</span>
                        <span class="stat-label">Untapped Potential<br>Ready for Transformation</span>
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

    <div class="section-divider"></div>

    <!-- Transformation Journey -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">02</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Transformation Journey</h2>
                <p class="stage-description">Based on your assessment results, here's your personalized path to growth and mastery.</p>
                
                <div class="timeline">
                    ${reportData.transformationStages.map((stage, index) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <h4 style="color: var(--gold);">${stage.title}</h4>
                            <p>${stage.description}</p>
                            <ul style="margin-top: 1rem; list-style: none; padding: 0;">
                                ${stage.insights.map(insight => `<li style="margin: 0.5rem 0;"><i class="fas fa-star" style="color: var(--gold); margin-right: 0.5rem;"></i>${insight}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>

    <div class="section-divider"></div>

    <!-- Before & After -->
    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">03</div>
            <div class="stage-content">
                <h2 class="stage-title">Your Transformation</h2>
                <p class="stage-description">The journey from where you are now to your <span class="highlight-text">incredible potential</span>.</p>
                
                <div class="before-after">
                    <div class="before-section">
                        <h3><i class="fas fa-arrow-left"></i> Current Patterns</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${reportData.beforeAfter.before.map(item => `<li><i class="fas fa-times" style="color: var(--orange);"></i> ${item}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="after-section">
                        <h3><i class="fas fa-arrow-right"></i> Transformed You</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${reportData.beforeAfter.after.map(item => `<li><i class="fas fa-check" style="color: var(--cyan);"></i> ${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div style="text-align: center; margin: 4rem 0; padding: 4rem; background: linear-gradient(45deg, rgba(255, 215, 0, 0.2), rgba(0, 212, 255, 0.2)); border-radius: 20px; border: 2px solid var(--gold);">
                    <h3 style="color: var(--gold); font-size: 3rem; margin-bottom: 2rem;">Your Journey Begins Now</h3>
                    <p style="font-size: 1.5rem; color: var(--light-purple-text); margin-bottom: 2rem;">
                        ${reportData.callToAction}
                    </p>
                    <p style="font-size: 1.2rem; color: var(--gold); font-weight: 700;">
                        The hero's journey begins with a single decision. Make yours now.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Animate progress bars when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressFill = entry.target.querySelector('.progress-fill');
                    if (progressFill) {
                        progressFill.style.width = progressFill.style.width;
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.progress-bar').forEach(bar => {
            observer.observe(bar);
        });

        // Add floating animation to elements
        function createFloatingElements() {
            const floatingContainer = document.querySelector('.floating-elements');
            const colors = ['var(--gold)', 'var(--cyan)', 'var(--orange)'];
            const symbols = ['✨', '⚡', '💫', '🌟', '💎', '🔥'];
            
            for (let i = 0; i < 10; i++) {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                element.style.color = colors[Math.floor(Math.random() * colors.length)];
                element.style.top = Math.random() * 100 + '%';
                element.style.left = Math.random() * 100 + '%';
                element.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
                element.style.animationDelay = '-' + Math.random() * 6 + 's';
                element.style.animationDuration = (Math.random() * 4 + 4) + 's';
                
                floatingContainer.appendChild(element);
            }
        }

        // Initialize floating elements
        createFloatingElements();
    </script>
</body>
</html>`;
}