import { ChatMessage } from "@/pages/DocumentAnalyzer";
import { useEffect, useRef } from "react";

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
    <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ maxHeight: '500px' }}>
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''}`}
        >
          {message.type === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3 flex-shrink-0">
              <i className="ri-robot-line"></i>
            </div>
          )}
          
          <div className={`${message.type === 'assistant' ? 'bg-gray-50' : 'bg-primary/10'} rounded-lg p-4 max-w-3xl`}>
            <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: message.content }}></p>
          </div>
          
          {message.type === 'user' && (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white ml-3 flex-shrink-0">
              <span className="text-xs font-medium">You</span>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
