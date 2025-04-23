import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  systemPrompt?: string;
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  suggestFollowUpQuestions?: boolean;
}

export interface ChatCompletionResult {
  content: string;
  suggestedQuestions?: string[];
}

/**
 * Generates a chat completion using OpenAI's API
 */
export async function generateChatCompletion({
  systemPrompt = "You are ADIB Rafiq, an AI assistant for Abu Dhabi Islamic Bank. You provide helpful, accurate, and concise information about Islamic banking products and services.",
  messages,
  model = "gpt-4o",
  temperature = 0.7,
  suggestFollowUpQuestions = false
}: ChatCompletionOptions): Promise<ChatCompletionResult> {
  
  // Create message array with system prompt
  const apiMessages = [
    { role: "system", content: systemPrompt },
    ...messages
  ];
  
  // Add follow-up questions request if needed
  if (suggestFollowUpQuestions) {
    apiMessages.push({
      role: "system",
      content: "After your response, suggest 3 follow-up questions the user might want to ask based on your answer. Format them as a JSON array of strings at the end of your message, with the label 'SUGGESTED_QUESTIONS:' preceding it."
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: apiMessages as any, // Type cast to fix TypeScript issues
      temperature,
      max_tokens: 1000,
    });

    let content = response.choices[0].message.content || '';
    let suggestedQuestions: string[] = [];
    
    // Extract suggested questions if they exist
    if (suggestFollowUpQuestions && content.includes('SUGGESTED_QUESTIONS:')) {
      const parts = content.split('SUGGESTED_QUESTIONS:');
      content = parts[0].trim();
      
      try {
        const questionsJson = parts[1].trim();
        suggestedQuestions = JSON.parse(questionsJson);
      } catch (error) {
        console.error('Error parsing suggested questions:', error);
      }
    }

    return {
      content,
      suggestedQuestions: suggestedQuestions.length > 0 ? suggestedQuestions : undefined
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate response from AI');
  }
}

/**
 * Analyzes a document using OpenAI's API
 */
export async function analyzeDocument(documentText: string, query?: string): Promise<string> {
  const prompt = query 
    ? `Please analyze the following document and answer this question: ${query}\n\nDocument: ${documentText}`
    : `Please analyze the following document and provide a summary of its key points: ${documentText}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert document analyzer for an Islamic bank. Provide accurate analysis and insights." },
        { role: "user", content: prompt }
      ] as any, // Type cast to fix TypeScript issues
      temperature: 0.5,
      max_tokens: 800,
    });

    return response.choices[0].message.content || 'Unable to analyze the document.';
  } catch (error) {
    console.error('Error analyzing document with OpenAI:', error);
    throw new Error('Failed to analyze document');
  }
}