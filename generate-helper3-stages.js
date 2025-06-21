import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateHelper3Stages() {
  try {
    const prompt = `
Generate Hero's Journey stage descriptions for Helper 3 transformation report.

HELPER 3 CHARACTERISTICS:
- Image-focused helper with achievement drive
- Helps others to maintain successful, admirable image
- Performance pressure while serving others
- Achievement addiction in helping roles
- Competitive helping behavior
- Uses service for recognition and success

GENERATE STAGES 2-6:

Stage 2 - The Call to Adventure:
Moment of recognition that image-driven helping has become unsustainable

Stage 3 - Meeting the Mentor:
Discovering wisdom about authentic service vs performance-based helping

Stage 4 - Crossing the Threshold:
Taking brave step to help without needing recognition or admiration

Stage 5 - Tests and Trials:
Facing situations that challenge competitive helping patterns
Include "Current Challenges" and "Your Potential" sections with 3 bullet points each

Stage 6 - The Return:
Returning as transformed helper who serves authentically rather than for image

REQUIREMENTS:
- Each description: 50-80 words
- Helper 3 specific content, not generic helper content
- Focus on image management, competitive helping, achievement addiction
- Use "Helper 3" terminology, never "Type 2w3" or "Enneagram"
- Professional, inspiring tone

Return as valid JSON:
{
  "stage2": "...",
  "stage3": "...",
  "stage4": "...",
  "stage5": "...",
  "stage6": "...",
  "challenges": [
    "Challenge about image management pressure",
    "Challenge about competitive helping behavior", 
    "Challenge about performance-based service"
  ],
  "potential": [
    "Potential for authentic service without recognition",
    "Potential for collaborative rather than competitive helping",
    "Potential for genuine care over achievement metrics"
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert transformation coach specializing in Helper 3 patterns. Generate precise, inspiring content that captures the Helper 3 transformation journey from image-driven helping to authentic service."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    console.log(JSON.stringify(content, null, 2));
    return content;

  } catch (error) {
    console.error('Error generating Helper 3 stages:', error);
    throw error;
  }
}

generateHelper3Stages();