const OpenAI = require('openai');

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateHelper3Content() {
  try {
    const prompt = `
Generate comprehensive Stage 1 "Ordinary World" content for a Helper 3 transformation report.

HELPER 3 CHARACTERISTICS:
- Image-focused helper with achievement drive
- Helps others to maintain successful, admirable image
- Performance pressure while serving others
- Achievement addiction in helping roles
- Fear of appearing ordinary or unsuccessful
- Competitive helping behavior
- Uses service for recognition and success

GENERATE:

1. STAGE DESCRIPTION (50-70 words):
A compelling description of the Helper 3's ordinary world struggles - living as someone driven to support others while maintaining a successful image, where service becomes performance and love gets tangled with recognition.

2. THREE CHALLENGE CARDS:
Each with icon class (FontAwesome), title (3-4 words), and description (15-25 words describing the specific Helper 3 challenge).

Card themes should cover:
- Image management and burnout from maintaining perfect helper persona
- Performance-based serving and conditional help
- Competitive helping and need to be the best helper

3. EIGHT WHEEL OF LIFE AREAS:
Each with area name, icon class, description (10-20 words), and percentage (20-80%).

Areas: Career, Relationships, Health, Finances, Personal Growth, Family, Social Life, Spirituality

Focus on Helper 3 patterns:
- High achievement in career through helping roles
- Relationship struggles due to performance pressure
- Health neglect while maintaining image
- Financial success but image-driven spending
- Avoiding growth that threatens identity
- Family strain from need to be admirable helper
- Social connections based on achievements
- Spirituality as another achievement area

REQUIREMENTS:
- Use "Helper 3" terminology, never "Type 2w3" or "Enneagram"
- Focus on achievement-driven helping patterns
- Emphasize image management and competitive helping
- Be specific to Helper 3, not generic helper content
- Professional, insightful tone

Return as valid JSON with this exact structure:
{
  "stageDescription": "...",
  "challengeCards": [
    {"icon": "fas fa-mask", "title": "...", "description": "..."},
    {"icon": "fas fa-trophy", "title": "...", "description": "..."},
    {"icon": "fas fa-users", "title": "...", "description": "..."}
  ],
  "wheelOfLife": [
    {"area": "Career", "icon": "fas fa-briefcase", "description": "...", "percentage": 75},
    {"area": "Relationships", "icon": "fas fa-heart", "description": "...", "percentage": 45},
    {"area": "Health", "icon": "fas fa-dumbbell", "description": "...", "percentage": 50},
    {"area": "Finances", "icon": "fas fa-dollar-sign", "description": "...", "percentage": 70},
    {"area": "Personal Growth", "icon": "fas fa-seedling", "description": "...", "percentage": 40},
    {"area": "Family", "icon": "fas fa-home", "description": "...", "percentage": 55},
    {"area": "Social Life", "icon": "fas fa-users", "description": "...", "percentage": 60},
    {"area": "Spirituality", "icon": "fas fa-pray", "description": "...", "percentage": 35}
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert personality psychology consultant specializing in Helper 3 patterns. Generate precise, insightful content that captures the unique challenges of image-focused helpers with achievement drive."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    console.log(JSON.stringify(content, null, 2));
    return content;

  } catch (error) {
    console.error('Error generating Helper 3 content:', error);
    throw error;
  }
}

generateHelper3Content();