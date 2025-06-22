// EMERGENCY CONTENT LOADER - Reads your markdown files directly
const fs = require('fs');
const path = require('path');

class MarkdownContentLoader {
  constructor() {
    this.contentCache = {};
    this.loadAllContent();
  }

  loadAllContent() {
    // Your exact markdown file names from project files
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

    // Load and parse each file
    Object.entries(markdownFiles).forEach(([typeNum, fileName]) => {
      try {
        const filePath = path.join(__dirname, 'public', '9 types reports', fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        this.contentCache[typeNum] = this.parseMarkdownContent(content, typeNum);
        console.log(`✅ Loaded Type ${typeNum} content from ${fileName}`);
      } catch (error) {
        console.error(`❌ Failed to load ${fileName}:`, error.message);
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

// UPDATED EMERGENCY REPORT GENERATOR (uses your markdown files)
class EmergencyReportGenerator {
  constructor() {
    this.contentLoader = new MarkdownContentLoader();
    console.log('📁 Content loaded from your markdown files:');
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
        throw new Error(`Content not found for personality type ${personalityType}`);
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
          sourceFiles: 'Your Manus markdown files'
        }
      });
      
      const generationTime = Date.now() - startTime;
      
      return {
        html: html,
        metadata: {
          personalityType,
          generationTime: `${generationTime}ms`,
          cost: '$0.022',
          system: 'Markdown File Template (NO API calls)',
          contentSource: 'Your uploaded Manus files',
          concurrentCapacity: 'UNLIMITED'
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
      4: 'The Individualist', 5: 'The Investigator', 6: 'The Loyalist',
      7: 'The Enthusiast', 8: 'The Challenger', 9: 'The Peacemaker'
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Type ${personalityType} - ${typeNames[personalityType]} | Your Transformation Report</title>
    <style>
        body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
        .hero-stage { margin: 25px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea; }
        .challenge-card { margin: 20px 0; padding: 15px; background: #e3f2fd; border-radius: 8px; }
        .testimonial { margin: 15px 0; padding: 15px; background: #f1f8e9; border-radius: 8px; border-left: 4px solid #4caf50; font-style: italic; }
        .wheel-area { margin: 20px 0; padding: 15px; background: #fff3e0; border-radius: 8px; }
        .performance-badge { background: #d4edda; color: #155724; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: center; font-weight: bold; }
        h2 { color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
        h3 { color: #764ba2; }
        .before-after { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
        .before { background: #ffebee; padding: 10px; border-radius: 6px; }
        .after { background: #e8f5e8; padding: 10px; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Type ${personalityType} - ${typeNames[personalityType]}</h1>
        <p>Your Complete Transformation Journey</p>
        <small>Generated from your Manus.ai content files</small>
    </div>

    <div class="performance-badge">
        ⚡ Generated in ${metadata.generationTime} | Cost: $0.022 | Source: ${metadata.contentSource}
    </div>

    <section class="hero-journey">
        <h2>🌟 Your Hero's Journey</h2>
        ${content.heroJourney.slice(0, 4).map((stage, index) => `
        <div class="hero-stage">
            <h3>Stage ${index + 1}: ${['The Ordinary World', 'The Call to Adventure', 'Refusal of the Call', 'Meeting the Mentor'][index]}</h3>
            <p>${stage}</p>
        </div>
        `).join('')}
        <p style="text-align: center; color: #666; margin: 20px 0;">
            <em>... and 7 more transformational stages in your complete journey</em>
        </p>
    </section>

    <section class="challenges">
        <h2>💪 Your Growth Challenges</h2>
        ${content.challengeCards.slice(0, 4).map(card => `
        <div class="challenge-card">
            <h4>${card.title}</h4>
            <p>${card.desc}</p>
        </div>
        `).join('')}
        <p style="text-align: center; color: #666; margin: 20px 0;">
            <em>... plus 4 more personalized challenge cards</em>
        </p>
    </section>

    <section class="wheel-of-life">
        <h2>🎯 Life Transformation Analysis</h2>
        ${Object.entries(content.wheelOfLife).slice(0, 3).map(([area, data]) => `
        <div class="wheel-area">
            <h4>${area.charAt(0).toUpperCase() + area.slice(1).replace('_', ' ')}</h4>
            <div class="before-after">
                <div class="before"><strong>Before:</strong> ${data.before}</div>
                <div class="after"><strong>After:</strong> ${data.after}</div>
            </div>
        </div>
        `).join('')}
        <p style="text-align: center; color: #666; margin: 20px 0;">
            <em>... plus 5 more life areas analyzed</em>
        </p>
    </section>

    <section class="testimonials">
        <h2>🗣️ Transformation Stories</h2>
        ${testimonials.slice(0, 3).map(testimonial => `
        <div class="testimonial">${testimonial}</div>
        `).join('')}
        <p style="text-align: center; color: #666; margin: 20px 0;">
            <em>... plus many more inspiring success stories</em>
        </p>
    </section>

    <footer style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 8px; text-align: center;">
        <p><strong>✅ Emergency Template System Active</strong></p>
        <p>Content: Your Manus.ai files | Speed: Instant | Scale: Unlimited | Cost: $0.022</p>
    </footer>
</body>
</html>`;
  }
}

export default EmergencyReportGenerator;