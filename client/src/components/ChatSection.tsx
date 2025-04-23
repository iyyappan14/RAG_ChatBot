import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import { getMockResponse } from "@/lib/utils";
import { ChatMessage } from "@/pages/DocumentAnalyzer";

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
    <div className="flex flex-col h-full">
      <ChatHistory messages={chatMessages} />
      <ChatInput onSendQuestion={handleSendQuestion} />
    </div>
  );
}
