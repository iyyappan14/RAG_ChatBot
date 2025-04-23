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
    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''}`}
        >
          {message.type === 'assistant' && (
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
              <Bot className="h-3.5 w-3.5" />
            </div>
          )}
          
          <div 
            className={`
              ${message.type === 'assistant' 
                ? 'bg-gray-50 border border-gray-100' 
                : 'bg-secondary/10 border border-secondary/10'}
              rounded-lg p-3 max-w-[85%] shadow-sm
            `}
          >
            <p 
              className={`
                ${message.type === 'assistant' ? 'text-gray-700' : 'text-gray-800'}
                text-xs
              `} 
              dangerouslySetInnerHTML={{ __html: message.content }}
            ></p>
          </div>
          
          {message.type === 'user' && (
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-white ml-2 flex-shrink-0">
              <User className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
