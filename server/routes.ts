import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateChatCompletion, 
  analyzeDocument,
  ChatMessage as OpenAIChatMessage
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint for AI assistant
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { messages, suggestFollowUpQuestions = true } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }
      
      // Convert messages to OpenAI format if needed
      const openAiMessages: OpenAIChatMessage[] = messages.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Get knowledge base context to customize the system prompt
      const { knowledgeBase } = req.body;
      let systemPrompt = "You are ADIB Rafiq, an AI assistant for Abu Dhabi Islamic Bank. You provide helpful, accurate, and concise information about Islamic banking products and services.";
      
      if (knowledgeBase === 'islamic-principles') {
        systemPrompt += " Focus specifically on Islamic banking principles and Shariah compliance.";
      } else if (knowledgeBase === 'products') {
        systemPrompt += " Focus specifically on ADIB's products and services.";
      } else if (knowledgeBase === 'compliance') {
        systemPrompt += " Focus specifically on regulatory compliance and legal requirements.";
      } else if (knowledgeBase === 'operations') {
        systemPrompt += " Focus specifically on operational procedures and banking operations.";
      }
      
      // Generate response from OpenAI
      const result = await generateChatCompletion({
        systemPrompt,
        messages: openAiMessages,
        suggestFollowUpQuestions
      });
      
      // Return the response
      res.json({
        message: {
          id: Date.now().toString(),
          type: 'assistant',
          content: result.content,
          suggestedQuestions: result.suggestedQuestions
        }
      });
    } catch (error) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: 'Failed to generate chat response' });
    }
  });
  
  // Document analysis endpoint
  app.post('/api/analyze-document', async (req: Request, res: Response) => {
    try {
      const { documentText, query } = req.body;
      
      if (!documentText) {
        return res.status(400).json({ error: 'Document text is required' });
      }
      
      // Analyze the document
      const analysis = await analyzeDocument(documentText, query);
      
      // Return the analysis
      res.json({
        analysis,
        documentId: Date.now().toString()
      });
    } catch (error) {
      console.error('Error in /api/analyze-document:', error);
      res.status(500).json({ error: 'Failed to analyze document' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
