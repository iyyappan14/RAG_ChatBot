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

// Mock responses for demonstration purposes when API is unavailable
const mockResponses: Record<string, { content: string, suggestedQuestions: string[] }> = {
  "default": {
    content: "Thank you for your question. In Islamic banking, financial transactions must comply with Shariah principles, which prohibit interest (riba), excessive uncertainty (gharar), and gambling (maysir). This framework promotes ethical and equitable financial practices. Could you provide more details about your specific area of interest so I can offer more targeted information?",
    suggestedQuestions: [
      "Tell me about Sukuk (Islamic bonds)",
      "How does Murabaha financing work?",
      "What is Zakat and how is it calculated?",
      "Explain the principles of Islamic banking"
    ]
  },
  "principles": {
    content: "Islamic banking operates on several key principles: 1) Prohibition of interest (riba), 2) Profit and loss sharing, 3) Prohibition of excessive uncertainty (gharar), 4) Prohibition of gambling and speculation (maysir), and 5) Investments must be in Shariah-compliant assets and activities. These principles ensure that financial transactions align with Islamic ethics and promote social justice.",
    suggestedQuestions: [
      "What is the concept of riba in Islamic banking?",
      "How does profit and loss sharing work?",
      "What businesses are considered haram for investment?"
    ]
  },
  "murabaha": {
    content: "Murabaha is an Islamic financing structure where the seller and buyer agree on the cost and markup of an asset. The financial institution purchases the asset, then sells it to the client at a higher price, with payment typically made in installments. This arrangement complies with Islamic principles by avoiding traditional interest charges, instead deriving profit from the disclosed markup.",
    suggestedQuestions: [
      "What are common uses of Murabaha financing?",
      "How does Murabaha differ from conventional loans?",
      "What documentation is required for Murabaha?"
    ]
  },
  "rag": {
    content: "RAG (Retrieval Augmented Generation) is a technique used in AI systems like ADIB Rafiq that combines information retrieval with generative AI. When you ask a question, the system first retrieves relevant information from a knowledge base (like Islamic banking documents), then uses this retrieved information to generate an accurate response. This approach ensures answers are more accurate, up-to-date, and grounded in your bank's specific documents and policies.",
    suggestedQuestions: [
      "How does RAG improve AI responses?",
      "What types of documents can be used with RAG?",
      "How is RAG implemented in banking systems?"
    ]
  },
  "sukuk": {
    content: "Sukuk are Islamic financial certificates, similar to bonds in Western finance, but structured to comply with Islamic law. Unlike conventional bonds, sukuk are asset-backed securities with partial ownership in a debt, asset, project, business, or investment. They represent undivided shares in the ownership of tangible assets, usufruct, services, or investments in particular projects or special investment activities.",
    suggestedQuestions: [
      "What are the different types of Sukuk?",
      "How are Sukuk different from conventional bonds?",
      "What are the Shariah requirements for Sukuk?"
    ]
  },
  "zakat": {
    content: "Zakat is a mandatory charitable contribution or alms-giving required of Muslims who meet certain wealth criteria. It's considered one of the Five Pillars of Islam and serves as a mechanism for wealth redistribution to reduce inequality. Generally, one must pay 2.5% of their accumulated wealth annually, though rates vary for different assets like agricultural produce and livestock.",
    suggestedQuestions: [
      "How is the 2.5% Zakat rate calculated?",
      "What assets are exempt from Zakat?",
      "How does ADIB help customers calculate Zakat?"
    ]
  }
};

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
  
  try {
    // Check if OpenAI is available by seeing if API key is set
    const apiKeyAvailable = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;

    if (apiKeyAvailable) {
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
        // If API call fails, fall back to mock responses
        return getMockResponse(messages, systemPrompt);
      }
    } else {
      console.log('OpenAI API key not available or invalid. Using mock responses.');
      return getMockResponse(messages, systemPrompt);
    }
  } catch (error) {
    console.error('Error in generateChatCompletion:', error);
    // Fall back to mock responses if anything fails
    return getMockResponse(messages, systemPrompt);
  }
}

/**
 * Get mock responses when API is unavailable
 */
function getMockResponse(messages: ChatMessage[], systemPrompt: string): ChatCompletionResult {
  // Get the last user message
  const lastUserMessage = [...messages].reverse().find(m => {
    // Handle both OpenAI format (role property) and our frontend format (type property)
    return (m as any).role === 'user' || (m as any).type === 'user';
  });
  const question = lastUserMessage ? lastUserMessage.content.toLowerCase() : '';
  
  // Normalize question for more reliable matching
  // Log for debugging
  console.log('Received question:', question);
  
  // Choose mock response based on keywords in the question
  let mockResponse;
  
  // Check for RAG first - this is top priority since we're having issues with it
  if (question.match(/\brag\b/i) || 
      question.match(/\bretrieval\b/i) ||
      question.match(/retrieval augmented/i) ||
      question.match(/what is rag/i) ||
      question.match(/what.*rag/i)) {
    console.log('Matched RAG question pattern');
    mockResponse = mockResponses.rag;
  }
  // Then check for other patterns
  else if (question.match(/principle/i) || question.match(/islamic banking/i)) {
    mockResponse = mockResponses.principles;
  } else if (question.match(/murabaha/i) || question.match(/financing/i)) {
    mockResponse = mockResponses.murabaha;
  } else if (question.match(/sukuk/i) || question.match(/bond/i)) {
    mockResponse = mockResponses.sukuk;
  } else if (question.match(/zakat/i) || question.match(/charity/i)) {
    mockResponse = mockResponses.zakat;
  } else {
    mockResponse = mockResponses.default;
  }

  // Add a note that this is a demo response when no API key is available
  if (systemPrompt.includes('islamic-principles')) {
    mockResponse.content = "From Islamic principles knowledge base: " + mockResponse.content;
  } else if (systemPrompt.includes('products')) {
    mockResponse.content = "From products knowledge base: " + mockResponse.content;
  } else if (systemPrompt.includes('compliance')) {
    mockResponse.content = "From compliance knowledge base: " + mockResponse.content;
  } else if (systemPrompt.includes('operations')) {
    mockResponse.content = "From operations knowledge base: " + mockResponse.content;
  }
  
  return {
    content: mockResponse.content + "\n\n(Note: This is a demo response while OpenAI API integration is being set up)",
    suggestedQuestions: mockResponse.suggestedQuestions
  };
}

/**
 * Analyzes a document using OpenAI's API
 */
export async function analyzeDocument(documentText: string, query?: string): Promise<string> {
  const prompt = query 
    ? `Please analyze the following document and answer this question: ${query}\n\nDocument: ${documentText}`
    : `Please analyze the following document and provide a summary of its key points: ${documentText}`;

  try {
    // Check if OpenAI is available by seeing if API key is set
    const apiKeyAvailable = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.length > 10;

    if (apiKeyAvailable) {
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
        console.error('Error calling OpenAI API for document analysis:', error);
        // If API call fails, fall back to mock document analysis
        return getMockDocumentAnalysis(documentText, query);
      }
    } else {
      console.log('OpenAI API key not available or invalid. Using mock document analysis.');
      return getMockDocumentAnalysis(documentText, query);
    }
  } catch (error) {
    console.error('Error in analyzeDocument:', error);
    // Fall back to mock responses if anything fails
    return getMockDocumentAnalysis(documentText, query);
  }
}

/**
 * Get mock document analysis when API is unavailable
 */
function getMockDocumentAnalysis(documentText: string, query?: string): string {
  const documentPreview = documentText.substring(0, 100) + (documentText.length > 100 ? '...' : '');
  
  // Log for debugging
  console.log('Document analysis query:', query);
  console.log('Document preview:', documentPreview);
  
  if (query) {
    // Process the query to provide a more specific response
    const queryLower = query.toLowerCase();
    
    // Try to extract information from the document that might be relevant to the query
    let specificResponse = '';
    
    if (queryLower.includes('title') || queryLower.includes('name') || queryLower.includes('what is')) {
      // Look for potential title patterns in the document
      const titleMatch = documentText.match(/title[:\s]+(.*?)(?:\n|\.)/i) || 
                        documentText.match(/^(.*?)(?:\n|\.)/i) ||
                        documentText.match(/name[:\s]+(.*?)(?:\n|\.)/i);
      
      if (titleMatch && titleMatch[1]) {
        specificResponse = `The title appears to be "${titleMatch[1].trim()}".`;
      } else {
        specificResponse = `I couldn't identify a specific title in the document. The document begins with: "${documentPreview.substring(0, 50)}..."`;
      }
    } else if (queryLower.includes('author') || queryLower.includes('who wrote')) {
      // Look for author patterns
      const authorMatch = documentText.match(/author[:\s]+(.*?)(?:\n|\.)/i) || 
                         documentText.match(/by[:\s]+(.*?)(?:\n|\.)/i);
      
      if (authorMatch && authorMatch[1]) {
        specificResponse = `The author appears to be ${authorMatch[1].trim()}.`;
      } else {
        specificResponse = `I couldn't identify a specific author in the document.`;
      }
    } else if (queryLower.includes('date') || queryLower.includes('when')) {
      // Look for date patterns
      const dateMatch = documentText.match(/date[:\s]+(.*?)(?:\n|\.)/i) || 
                       documentText.match(/published[:\s]+(.*?)(?:\n|\.)/i) ||
                       documentText.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/);
      
      if (dateMatch && dateMatch[1]) {
        specificResponse = `The date appears to be ${dateMatch[1].trim()}.`;
      } else {
        specificResponse = `I couldn't identify a specific date in the document.`;
      }
    }
    
    // Add the specific response if available
    let result = `Document analysis for query: "${query}"\n\n`;
    
    if (specificResponse) {
      result += specificResponse + '\n\n';
    }
    
    result += `Based on the provided document (starting with "${documentPreview.substring(0, 50)}..."), this appears to be related to Islamic banking. The document contains information that might be relevant to your query.\n\nHere's a summary of key points regarding your question:\n\n1. The document contains information related to Islamic banking and financial practices.\n2. Islamic banking follows Shariah principles and prohibits interest (riba).\n3. This document might reference specific financial instruments or contracts relevant to Islamic banking.\n\n(Note: This is a demo response while OpenAI API integration is being set up)`;
    
    return result;
  } else {
    return `Document summary:\n\nThis document (starting with "${documentPreview.substring(0, 50)}...") appears to be related to Islamic banking and financial services. The key points include:\n\n1. Information about banking products that comply with Islamic law\n2. References to Shariah-compliant financial practices\n3. Details about banking operations and procedures\n4. Possible references to terms like Murabaha, Sukuk, or Zakat\n\nThe document would be useful for understanding Islamic finance principles and practices within the banking context.\n\n(Note: This is a demo response while OpenAI API integration is being set up)`;
  }
}