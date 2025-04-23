import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { ChatMessage } from "@/pages/DocumentAnalyzer";

interface ChatSectionProps {
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  uploadedFiles?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    content?: string;
  }>;
}

export default function ChatSection({ 
  chatMessages, 
  addChatMessage,
  uploadedFiles = []
}: ChatSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendQuestion = async (question: string) => {
    // Check if we're already processing a request
    if (isLoading) {
      return;
    }
    
    // Add user question to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
    };
    addChatMessage(userMessage);
    
    setIsLoading(true);
    
    try {
      // Determine if we should analyze a document or just chat
      if (uploadedFiles && uploadedFiles.length > 0) {
        // We have uploaded files, so analyze the document
        const documentText = uploadedFiles[0].content || "No document content available";
        const documentInfo = {
          name: uploadedFiles[0].name,
          type: uploadedFiles[0].type,
          size: uploadedFiles[0].size
        };
        
        console.log('Analyzing document with query:', question);
        
        const response = await apiRequest('POST', '/api/analyze-document', {
          documentText,
          query: question,
          documentInfo
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Add AI response to chat
          const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: data.analysis,
          };
          addChatMessage(aiResponse);
        } else {
          throw new Error('Failed to analyze document');
        }
      } else {
        // No documents, just chat normally
        const response = await apiRequest('POST', '/api/chat', {
          messages: chatMessages.concat(userMessage),
          suggestFollowUpQuestions: true
        });
        
        if (response.ok) {
          const data = await response.json();
          addChatMessage(data.message);
        } else {
          throw new Error('Failed to get chat response');
        }
      }
    } catch (error) {
      console.error('Error processing question:', error);
      
      // Add error message
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Sorry, I had trouble processing your question. Please try again.",
      };
      addChatMessage(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHistory messages={chatMessages} />
      <ChatInput onSendQuestion={handleSendQuestion} />
    </div>
  );
}
