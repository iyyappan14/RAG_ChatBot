import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import { getMockResponse } from "@/lib/utils";
import { ChatMessage } from "@/pages/DocumentAnalyzer";
import { BrainCog } from "lucide-react";

interface ChatSectionProps {
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
}

export default function ChatSection({ chatMessages, addChatMessage }: ChatSectionProps) {
  const handleSendQuestion = (question: string) => {
    // Add user question to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
    };
    addChatMessage(userMessage);
    
    // Simulate AI thinking time
    setTimeout(() => {
      // Get mock response for the question
      const responseContent = getMockResponse(question);
      
      // Add AI response to chat
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
      };
      addChatMessage(aiResponse);
    }, 1000);
  };
  
  return (
    <div className="lg:w-2/3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
        <div className="bg-secondary text-white p-4 flex items-center">
          <BrainCog className="w-5 h-5 mr-2" />
          <div>
            <h2 className="text-lg font-medium">Document Analysis</h2>
            <p className="text-xs text-white/80">Ask questions about your uploaded documents</p>
          </div>
        </div>
        
        <ChatHistory messages={chatMessages} />
        
        <ChatInput onSendQuestion={handleSendQuestion} />
      </div>
    </div>
  );
}
