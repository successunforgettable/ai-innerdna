interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  response_format?: { type: 'json_object' };
  temperature?: number;
  max_tokens?: number;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Replace OpenAI SDK with direct fetch calls
export async function makeOpenAIRequest(request: ChatRequest): Promise<ChatResponse> {
  try {
    console.log('Making OpenAI API request with fetch...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      // Custom timeout
      signal: AbortSignal.timeout(120000) // 2 minutes
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('OpenAI API success with fetch');
    return data;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}