import { GoogleGenerativeAI } from '@google/generative-ai';
import { ToneType } from '../App';

const getApiKey = (): string | null => {
  // Try multiple sources for the API key
  return (
    (window as any).__GEMINI_API_KEY__ ||
    localStorage.getItem('gemini_api_key') ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    null
  );
};

const toneInstructions = {
  professional: "Write in a professional, formal tone. Use proper business language, be respectful and courteous. Include appropriate greetings and closings.",
  friendly: "Write in a warm, friendly tone. Be approachable and personable while maintaining professionalism. Use conversational language.",
  direct: "Write in a direct, concise tone. Get straight to the point without unnecessary pleasantries. Be clear and efficient.",
  warm: "Write in a warm, empathetic tone. Show genuine care and understanding. Use encouraging and supportive language."
};

export interface GenerateDraftParams {
  prompt: string;
  tone: ToneType;
}

export const generateEmailDraft = async ({ prompt, tone }: GenerateDraftParams): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn('Gemini API key not found. Using mock response.');
    return getMockDraft(prompt, tone);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const systemPrompt = `You are an expert email writing assistant. Your task is to generate professional email drafts based on user prompts.

Instructions:
- ${toneInstructions[tone]}
- Always include a clear subject line at the top
- Structure the email properly with greeting, body, and closing
- Keep it concise but complete
- Use placeholders like [Recipient Name] or [Your Name] where appropriate
- Make it ready to send with minimal editing
- Ensure the content directly addresses the user's request

User's request: "${prompt}"

Generate a complete email draft:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text.trim();
  } catch (error) {
    console.error('Error generating draft with Gemini:', error);
    // Fallback to mock response on error
    return getMockDraft(prompt, tone);
  }
};

// Mock responses for when API is not available
const getMockDraft = (prompt: string, tone: ToneType): string => {
  const mockDrafts = {
    professional: `Subject: ${prompt}

Dear [Recipient Name],

I hope this email finds you well. I am writing to inform you about ${prompt.toLowerCase()}.

I would appreciate your understanding and assistance with this matter. Please let me know if you need any additional information or if there are any questions.

Thank you for your time and consideration.

Best regards,
[Your Name]`,
    
    friendly: `Subject: ${prompt}

Hi [Recipient Name]!

Hope you're doing great! I wanted to reach out about ${prompt.toLowerCase()}.

Let me know what works best for you - always happy to chat and figure things out together!

Thanks so much!
[Your Name]`,
    
    direct: `Subject: ${prompt}

[Recipient Name],

I need to ${prompt.toLowerCase()}.

Please confirm receipt and next steps.

[Your Name]`,
    
    warm: `Subject: ${prompt}

Hello [Recipient Name],

I hope your day is going wonderfully. I wanted to personally reach out regarding ${prompt.toLowerCase()}.

I truly appreciate your understanding and look forward to hearing from you soon.

Warmest regards,
[Your Name]`
  };
  
  return mockDrafts[tone];
};