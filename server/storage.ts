import { 
  users, type User, type InsertUser,
  documents, type Document, type InsertDocument,
  chatMessages, type ChatMessage, type InsertChatMessage 
} from "@shared/schema";

// Knowledge base types (used for tracking)
export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  documentCount: number;
}

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document methods
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  // Chat message methods
  getChatMessages(): Promise<ChatMessage[]>;
  getChatMessagesByUser(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Statistics methods
  getKnowledgeBases(): Promise<KnowledgeBase[]>;
  getDocumentCount(): Promise<number>;
  getDailyQuestionCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private chatMessages: Map<number, ChatMessage>;
  private knowledgeBases: KnowledgeBase[];
  
  private userCurrentId: number;
  private documentCurrentId: number;
  private chatMessageCurrentId: number;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.chatMessages = new Map();
    
    this.userCurrentId = 1;
    this.documentCurrentId = 1;
    this.chatMessageCurrentId = 1;
    
    // Initialize with default knowledge bases
    this.knowledgeBases = [
      {
        id: 'islamic-principles',
        name: 'Islamic Banking Principles',
        description: 'Core concepts and foundations of Islamic finance',
        documentCount: 0
      },
      {
        id: 'products',
        name: 'Product Details',
        description: 'Islamic banking products and services information',
        documentCount: 0
      },
      {
        id: 'compliance',
        name: 'Compliance',
        description: 'Shariah compliance rules and guidelines',
        documentCount: 0
      },
      {
        id: 'operations',
        name: 'Operations',
        description: 'Day-to-day operational procedures',
        documentCount: 0
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Document methods
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
  
  async getDocumentById(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentCurrentId++;
    
    // Ensure required fields are present
    const document: Document = { 
      ...insertDocument, 
      id,
      userId: insertDocument.userId as number | null 
    };
    
    this.documents.set(id, document);
    
    // Increment document count for a random knowledge base (in a real app, this would be associated with the correct KB)
    const randomKnowledgeBaseIndex = Math.floor(Math.random() * this.knowledgeBases.length);
    this.knowledgeBases[randomKnowledgeBaseIndex].documentCount++;
    
    return document;
  }
  
  // Chat message methods
  async getChatMessages(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values());
  }
  
  async getChatMessagesByUser(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId
    );
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.chatMessageCurrentId++;
    
    // Ensure required fields are present
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      userId: insertMessage.userId as number | null,
      documentId: insertMessage.documentId as number | null
    };
    
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Statistics methods
  async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    return this.knowledgeBases;
  }
  
  async getDocumentCount(): Promise<number> {
    return this.documents.size;
  }
  
  async getDailyQuestionCount(): Promise<number> {
    // For demo purposes, we'll count all user messages as questions
    // In a real app, we would filter by date to get only today's messages
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.type === 'user'
    ).length;
  }
}

export const storage = new MemStorage();
