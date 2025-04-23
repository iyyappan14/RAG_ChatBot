import { useState, useRef, useEffect } from "react";
import { SendHorizonal, FileQuestion } from "lucide-react";

interface ChatInputProps {
  onSendQuestion: (question: string) => void;
}

export default function ChatInput({ onSendQuestion }: ChatInputProps) {
  const [question, setQuestion] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (question.trim()) {
      onSendQuestion(question);
      setQuestion("");
    }
  };
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [question]);
  
  return (
    <div className="p-5 border-t border-gray-100">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 bottom-3 text-gray-400">
            <FileQuestion className="h-5 w-5" />
          </div>
          <textarea 
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="chat-input w-full border border-gray-200 rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none shadow-sm"
            placeholder="Ask a question about your documents..." 
            rows={2}
          />
        </div>
        <button 
          type="submit" 
          disabled={!question.trim()}
          className="bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <span>Ask</span>
          <SendHorizonal className="ml-2 h-4 w-4" />
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
        <span>Powered by ADIB AI Assistant</span>
        <span className="text-primary">Try asking about loan terms, addresses, or employment details</span>
      </div>
    </div>
  );
}
