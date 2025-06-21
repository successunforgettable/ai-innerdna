import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateHelper3Testimonials() {
  try {
    const prompt = `
Generate 4 authentic testimonials for Helper 3 transformation reports.

HELPER 3 CHARACTERISTICS:
- Image-focused helper with achievement drive
- Helps others to maintain successful, admirable image
- Performance pressure while serving others
- Achievement addiction in helping roles
- Competitive helping behavior
- Uses service for recognition and success

GENERATE 4 TESTIMONIALS:
Each testimonial should include:
- Name (first name + last initial)
- Age range (30s, 40s, etc.)
- Brief profession/role
- Compelling quote (2-3 sentences) about their Helper 3 transformation journey

TESTIMONIAL THEMES:
1. Overcoming image management burnout
2. Learning to help without needing recognition
3. Breaking free from competitive helping patterns
4. Finding authentic service vs performance-based helping

REQUIREMENTS:
- Use "Helper 3" terminology, never "Type 2w3" or "Enneagram"
- Focus on achievement-driven helping transformation
- Authentic, relatable voices
- Specific, concrete transformation examples
- Professional but personal tone

Return as valid JSON with this exact structure:
{
  "testimonials": [
    {
      "name": "Sarah M.",
      "age": "30s",
      "profession": "Marketing Director",
      "quote": "..."
    },
    {
      "name": "Michael K.",
      "age": "40s", 
      "profession": "Team Leader",
      "quote": "..."
    },
    {
      "name": "Jennifer L.",
      "age": "30s",
      "profession": "HR Manager", 
      "quote": "..."
    },
    {
      "name": "David R.",
      "age": "40s",
      "profession": "Project Manager",
      "quote": "..."
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert transformation coach specializing in Helper 3 patterns. Generate authentic testimonials that capture real breakthrough moments in Helper 3 transformation journeys."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 1500
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    console.log(JSON.stringify(content, null, 2));
    return content;

  } catch (error) {
    console.error('Error generating Helper 3 testimonials:', error);
    throw error;
  }
}

generateHelper3Testimonials();