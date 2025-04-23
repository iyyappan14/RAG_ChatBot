import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  generateChatCompletion, 
  analyzeDocument,
  ChatMessage as OpenAIChatMessage
} from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Stats API endpoint
  app.get('/api/stats', async (req: Request, res: Response) => {
    try {
      // Get statistics from storage
      const knowledgeBases = await storage.getKnowledgeBases();
      const documentCount = await storage.getDocumentCount();
      const questionCount = await storage.getDailyQuestionCount();
      
      res.json({
        knowledgeBases,
        documentCount,
        questionCount,
        // This is a static value for demonstration
        accuracyRate: 97.5
      });
    } catch (error) {
      console.error('Error in /api/stats:', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  });
  
  // Track message for statistics
  const trackMessage = async (message: any) => {
    try {
      if (!message) return;
      
      const currentTime = new Date().toISOString();
      
      // Store in memory for stats tracking
      await storage.createChatMessage({
        content: message.content,
        type: message.type,
        userId: 1, // Default user ID for demo
        documentId: null as any, // Set to null
        createdAt: currentTime
      });
    } catch (error) {
      console.error('Error tracking message:', error);
    }
  };

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
      
      // Create the message object
      const assistantMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: result.content,
        suggestedQuestions: result.suggestedQuestions
      };
      
      // Track this message for statistics
      await trackMessage(assistantMessage);
      
      // Get the last user message and track it too
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.type === 'user') {
          await trackMessage(lastMessage);
        }
      }
      
      // Return the response
      res.json({
        message: assistantMessage
      });
    } catch (error) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({ error: 'Failed to generate chat response' });
    }
  });
  
  // Document analysis endpoint
  app.post('/api/analyze-document', async (req: Request, res: Response) => {
    try {
      const { documentText, query, documentInfo } = req.body;
      
      if (!documentText) {
        return res.status(400).json({ error: 'Document text is required' });
      }
      
      // Analyze the document
      const analysis = await analyzeDocument(documentText, query);
      
      // If document info is provided, store it
      const documentId = Date.now().toString();
      if (documentInfo) {
        try {
          const currentTime = new Date().toISOString();
          
          await storage.createDocument({
            name: documentInfo.name || 'Document',
            type: documentInfo.type || 'text/plain',
            size: documentInfo.size || documentText.length,
            userId: 1 as any, // Default user ID for demo
            createdAt: currentTime
          });
        } catch (storageError) {
          console.error('Error storing document info:', storageError);
        }
      }
      
      // Return the analysis
      res.json({
        analysis,
        documentId
      });
    } catch (error) {
      console.error('Error in /api/analyze-document:', error);
      res.status(500).json({ error: 'Failed to analyze document' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
