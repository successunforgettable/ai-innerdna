// ES MODULE VERSION - Compatible with your import/export setup
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module directory resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MarkdownContentLoader {
  constructor() {
    this.contentCache = {};
    this.loadAllContent();
  }

  loadAllContent() {
    // Your exact markdown file names from public/9 types reports/
    const markdownFiles = {
      1: 'type1_reformer_content.md',
      2: 'type2_helper_content.md', 
      3: 'type3_achiever_content.md',
      4: 'type4_individualist_content.md',
      5: 'type5_investigator_content.md',
      6: 'Type 6 - The sentinal_ Hero\'s Journey.md',
      7: 'Type 7 - The Enthusiast_ Hero\'s Journey.md',
      8: 'Type 8 - The Challenger_ Hero\'s Journey.md',
      9: 'Type 9 - The Peacemaker_ Hero\'s Journey.md'
    };

    // Load and parse each file from public/9 types reports/
    Object.entries(markdownFiles).forEach(([typeNum, fileName]) => {
      try {
        const filePath = path.join(__dirname, 'public', '9 types reports', fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        this.contentCache[typeNum] = this.parseMarkdownContent(content, typeNum);
        console.log(`✅ Loaded Type ${typeNum} content from ${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to load ${fileName}:`, error.message);
        console.error(`   Tried path: ${path.join(__dirname, 'public', '9 types reports', fileName)}`);
      }
    });
  }

  parseMarkdownContent(markdownText, typeNum) {
    const content = {
      heroJourney: [],
      challengeCards: [],
      testimonials: [],
      wheelOfLife: {}
    };

    // Extract Hero's Journey stages (11 stages)
    for (let i = 1; i <= 11; i++) {
      const stagePattern = new RegExp(`TYPE_${typeNum}_HERO_STAGE_${i}:\\s*(.+?)(?=TYPE_${typeNum}_HERO_STAGE_${i + 1}:|TYPE_${typeNum}_CHALLENGE_CARD|$)`, 's');
      const match = markdownText.match(stagePattern);
      if (match) {
        content.heroJourney.push(match[1].trim());
      }
    }

    // Extract Challenge Cards (8 cards)
    for (let i = 1; i <= 8; i++) {
      const titlePattern = new RegExp(`TYPE_${typeNum}_CHALLENGE_CARD_${i}_TITLE:\\s*(.+?)\\n`, 'g');
      const descPattern = new RegExp(`TYPE_${typeNum}_CHALLENGE_CARD_${i}_DESC:\\s*(.+?)(?=TYPE_${typeNum}_CHALLENGE_CARD_${i + 1}|TYPE_${typeNum}_TESTIMONIAL|$)`, 's');
      
      titlePattern.lastIndex = 0; // Reset regex
      const titleMatch = titlePattern.exec(markdownText);
      const descMatch = descPattern.exec(markdownText);
      
      if (titleMatch && descMatch) {
        content.challengeCards.push({
          title: titleMatch[1].trim(),
          desc: descMatch[1].trim()
        });
      }
    }

    // Extract Testimonials (find all testimonials)
    const testimonialPattern = new RegExp(`TYPE_${typeNum}_TESTIMONIAL_(\\d+):\\s*(.+?)(?=TYPE_${typeNum}_TESTIMONIAL_|TYPE_${typeNum}_WHEEL_|$)`, 'gs');
    let testimonialMatch;
    while ((testimonialMatch = testimonialPattern.exec(markdownText)) !== null) {
      content.testimonials.push(testimonialMatch[2].trim());
    }

    // Extract Wheel of Life areas
    const lifeAreas = ['CAREER', 'RELATIONSHIPS', 'HEALTH', 'FINANCES', 'PERSONAL_GROWTH', 'SOCIAL_LIFE', 'ENVIRONMENT', 'RECREATION'];
    
    lifeAreas.forEach(area => {
      const beforePattern = new RegExp(`TYPE_${typeNum}_WHEEL_${area}_BEFORE:\\s*(.+?)(?=TYPE_${typeNum}_WHEEL_${area}_AFTER:|TYPE_${typeNum}_WHEEL_|$)`, 's');
      const afterPattern = new RegExp(`TYPE_${typeNum}_WHEEL_${area}_AFTER:\\s*(.+?)(?=TYPE_${typeNum}_WHEEL_|$)`, 's');
      
      const beforeMatch = markdownText.match(beforePattern);
      const afterMatch = markdownText.match(afterPattern);
      
      if (beforeMatch && afterMatch) {
        content.wheelOfLife[area.toLowerCase()] = {
          before: beforeMatch[1].trim(),
          after: afterMatch[1].trim()
        };
      }
    });

    return content;
  }

  getPersonalityContent(typeNumber) {
    return this.contentCache[typeNumber.toString()];
  }

  // Get a summary of loaded content
  getLoadSummary() {
    const summary = {};
    Object.entries(this.contentCache).forEach(([type, content]) => {
      summary[`Type ${type}`] = {
        heroStages: content.heroJourney.length,
        challengeCards: content.challengeCards.length,
        testimonials: content.testimonials.length,
        wheelAreas: Object.keys(content.wheelOfLife).length
      };
    });
    return summary;
  }
}

// ES MODULE EMERGENCY REPORT GENERATOR
export class EmergencyReportGenerator {
  constructor() {
    this.contentLoader = new MarkdownContentLoader();
    console.log('📁 Content loaded from markdown files:');
    console.log(this.contentLoader.getLoadSummary());
  }

  async generateReport(assessmentData) {
    const startTime = Date.now();
    
    try {
      const {
        personalityType = 1,
        wingInfluence = 1,
        moodStates = { primary: 60, secondary: 40 },
        subtype = 'Self-Preservation',
        userId = Date.now()
      } = assessmentData;

      // Get content from your markdown files
      const content = this.contentLoader.getPersonalityContent(personalityType);
      
      if (!content) {
        throw new Error(`Content not found for personality type ${personalityType}. Available types: ${Object.keys(this.contentLoader.contentCache)}`);
      }

      // Select rotating testimonials
      const selectedTestimonials = this.selectTestimonials(content.testimonials, userId);
      
      // Generate the report HTML
      const html = this.buildHTMLReport({
        personalityType,
        content,
        testimonials: selectedTestimonials,
        metadata: { 
          wingInfluence, 
          subtype, 
          generationTime: Date.now() - startTime,
          sourceFiles: 'Markdown files from public/9 types reports/'
        }
      });
      
      const generationTime = Date.now() - startTime;
      
      return {
        html: html,
        metadata: {
          personalityType,
          generationTime: `${generationTime}ms`,
          cost: '$0.022',
          system: 'ES Module Template (NO API calls)',
          contentSource: 'Your uploaded Manus files',
          concurrentCapacity: 'UNLIMITED',
          loadedTypes: Object.keys(this.contentLoader.contentCache).length
        }
      };
      
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      throw error;
    }
  }

  selectTestimonials(testimonialPool, userId, count = 5) {
    if (!testimonialPool || testimonialPool.length === 0) return [];
    
    const selected = [];
    for (let i = 0; i < count && i < testimonialPool.length; i++) {
      const index = (userId + i * 7) % testimonialPool.length;
      selected.push(testimonialPool[index]);
    }
    return selected;
  }

  buildHTMLReport({ personalityType, content, testimonials, metadata }) {
    const typeNames = {
      1: 'The Reformer', 2: 'The Helper', 3: 'The Achiever',
      4: 'The Individualist', 5: 'The Investigator', 6: 'The Sentinel',
      7: 'The Enthusiast', 8: 'The Challenger', 9: 'The Peacemaker'
    };

    const transformations = {
      1: 'Inner criticism → Self-acceptance and flexible wisdom',
      2: 'Others-focused → Authentic self-care', 
      3: 'Image-driven → Authentic success',
      4: 'Emotional chaos → Balanced authenticity',
      5: 'Withdrawal and hoarding → Confident engagement',
      6: 'Fearful dependence → Inner authority and confident courage',
      7: 'Scattered excitement → Focused joy and emotional integration',
      8: 'Dominating force → Empowering strength and vulnerable leadership',
      9: 'Comfortable stagnation → Energized purpose and self-assertion'
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The ${typeNames[personalityType]} Transformation Journey - Your Hero's Path to Heart-Brain Mastery</title>
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
            padding: 20px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.2rem;
            box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
            transition: all 0.3s ease;
            margin: 10px;
        }

        .cta-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(255, 215, 0, 0.4);
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

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .card-icon {
            font-size: 3rem;
            color: var(--gold);
            margin-bottom: 1rem;
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--gold);
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

        .floating-element {
            position: absolute;
            opacity: 0.3;
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .floating-element:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .floating-element:nth-child(2) { top: 20%; right: 10%; animation-delay: 2s; }
        .floating-element:nth-child(3) { bottom: 30%; left: 20%; animation-delay: 4s; }

        .brain-heart-section {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            padding: 4rem;
            margin: 4rem 0;
            text-align: center;
            border: 2px solid var(--orange);
        }

        .brain-heart-title {
            font-family: 'Playfair Display', serif;
            font-size: 3rem;
            color: var(--orange);
            margin-bottom: 2rem;
            animation: blink 2s infinite;
        }

        .transformation-path {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 3rem 0;
            flex-wrap: wrap;
        }

        .transformation-step {
            flex: 1;
            text-align: center;
            min-width: 250px;
            margin: 1rem;
        }

        .step-icon {
            font-size: 4rem;
            color: var(--gold);
            margin-bottom: 1rem;
        }

        .arrow {
            font-size: 2rem;
            color: var(--cyan);
            margin: 0 1rem;
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
            .wheel-of-life {
                grid-template-columns: 1fr;
            }
            .transformation-path {
                flex-direction: column;
            }
            .arrow {
                transform: rotate(90deg);
                margin: 1rem 0;
            }
        }
    </style>
</head>
<body>
    <!-- Floating Elements -->
    <div class="floating-element"><i class="fas fa-star" style="font-size: 2rem; color: var(--gold);"></i></div>
    <div class="floating-element"><i class="fas fa-heart" style="font-size: 2rem; color: var(--orange);"></i></div>
    <div class="floating-element"><i class="fas fa-brain" style="font-size: 2rem; color: var(--cyan);"></i></div>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background"></div>
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">Heart-Brain Mastery</h1>
                <p class="hero-subtitle">The ${typeNames[personalityType]} Transformation Journey</p>
                <p class="stage-description">${transformations[personalityType]}</p>
            </div>
        </div>
    </section>

    <!-- Brain-Heart Disconnect Alert -->
    <section class="brain-heart-section">
        <div class="container">
            <h2 class="brain-heart-title danger-indicator">
                <i class="fas fa-exclamation-triangle"></i>
                PERSONALITY PATTERN DETECTED
            </h2>
            <p class="stage-description">
                Your current personality pattern shows a disconnect between heart wisdom and mind analysis. 
                This transformation journey will guide you to integrate both for authentic power.
            </p>
        </div>
    </section>

    <!-- Hero's Journey Stages -->
    ${content.heroJourney.map((stage, index) => `
    <section class="journey-stage">
        <div class="container">
            <div class="stage-number">${index + 1}</div>
            <div class="stage-content">
                <h2 class="stage-title">Stage ${index + 1}</h2>
                <p class="stage-description">${stage}</p>
            </div>
        </div>
    </section>
    `).join('')}

    <!-- Challenge Cards -->
    <section class="journey-stage">
        <div class="container">
            <h2 class="stage-title">Transformation Challenges</h2>
            <div class="card-grid">
                ${content.challengeCards.map((card, index) => `
                <div class="card">
                    <div class="card-icon">
                        <i class="fas fa-mountain"></i>
                    </div>
                    <h3 class="card-title">${card.title}</h3>
                    <p>${card.desc}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Transformation Path -->
    <section class="journey-stage">
        <div class="container">
            <h2 class="stage-title">Your Transformation Path</h2>
            <div class="transformation-path">
                <div class="transformation-step">
                    <div class="step-icon">
                        <i class="fas fa-brain"></i>
                    </div>
                    <h3 class="highlight-text">Mind Patterns</h3>
                    <p>Recognize limiting beliefs</p>
                </div>
                <div class="arrow">→</div>
                <div class="transformation-step">
                    <div class="step-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3 class="highlight-text">Heart Wisdom</h3>
                    <p>Connect with authentic feelings</p>
                </div>
                <div class="arrow">→</div>
                <div class="transformation-step">
                    <div class="step-icon">
                        <i class="fas fa-balance-scale"></i>
                    </div>
                    <h3 class="highlight-text">Integration</h3>
                    <p>Achieve heart-brain mastery</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Wheel of Life -->
    <section class="journey-stage">
        <div class="container">
            <h2 class="stage-title">Life Transformation Areas</h2>
            <div class="wheel-of-life">
                ${Object.entries(content.wheelOfLife).map(([area, data]) => `
                <div class="life-area">
                    <h3 class="highlight-text">${area.charAt(0).toUpperCase() + area.slice(1).replace('_', ' ')}</h3>
                    <p><strong>Before:</strong> ${data.before}</p>
                    <p><strong>After:</strong> ${data.after}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Testimonials -->
    <section class="journey-stage">
        <div class="container">
            <h2 class="stage-title">Transformation Stories</h2>
            ${testimonials.map((testimonial, index) => `
            <div class="testimonial">
                <p class="testimonial-quote">"${testimonial}"</p>
                <p class="testimonial-author">— ${typeNames[personalityType]} Transformation Graduate</p>
            </div>
            `).join('')}
        </div>
    </section>

    <!-- Stats Section -->
    <section class="journey-stage">
        <div class="container">
            <h2 class="stage-title">Your Journey Impact</h2>
            <div class="stats-container">
                <div class="stat-item">
                    <span class="stat-number">11</span>
                    <span class="stat-label">Transformation Stages</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${content.challengeCards.length}</span>
                    <span class="stat-label">Challenge Cards</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${Object.keys(content.wheelOfLife).length}</span>
                    <span class="stat-label">Life Areas</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">∞</span>
                    <span class="stat-label">Growth Potential</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="hero-section" style="min-height: 60vh;">
        <div class="container">
            <div class="hero-content">
                <h2 class="stage-title">Begin Your Transformation Today</h2>
                <p class="hero-subtitle">Your journey to Heart-Brain Mastery starts now</p>
                <a href="#" class="cta-button">
                    <i class="fas fa-rocket"></i> Start Your Journey
                </a>
            </div>
        </div>
    </section>

    <script>
        // Add scroll animations
        window.addEventListener('scroll', () => {
            const elements = document.querySelectorAll('.card, .life-area, .testimonial');
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        });

        // Initialize elements
        document.querySelectorAll('.card, .life-area, .testimonial').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'all 0.6s ease';
        });

        // Add progress bar animations
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach((bar, index) => {
                const width = Math.random() * 60 + 40; // 40-100%
                bar.style.width = width + '%';
            });
        }, 1000);
    </script>
</body>
</html>`;
  }
}

// Export for ES modules
export default EmergencyReportGenerator;