import { ChatMessage } from "@/pages/DocumentAnalyzer";
import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

interface ChatHistoryProps {
  messages: ChatMessage[];
}

export default function ChatHistory({ messages }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-6" style={{ maxHeight: '500px' }}>
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''}`}
        >
          {message.type === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3 flex-shrink-0">
              <Bot className="h-4 w-4" />
            </div>
          )}
          
          <div 
            className={`
              ${message.type === 'assistant' 
                ? 'bg-gray-50 border border-gray-100' 
                : 'bg-secondary/10 border border-secondary/10'}
              rounded-lg p-4 max-w-3xl shadow-sm
            `}
          >
            <p 
              className={`
                ${message.type === 'assistant' ? 'text-gray-700' : 'text-gray-800'}
                text-sm
              `} 
              dangerouslySetInnerHTML={{ __html: message.content }}
            ></p>
          </div>
          
          {message.type === 'user' && (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ml-3 flex-shrink-0">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
