import { useState, useRef, useEffect } from "react";
import { SendHorizonal, ArrowRight } from "lucide-react";

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
    <div className="p-4 border-t border-gray-100">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea 
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="chat-input w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary resize-none shadow-sm text-sm"
            placeholder="Type your question..." 
            rows={1}
          />
        </div>
        <button 
          type="submit" 
          disabled={!question.trim()}
          className="bg-primary hover:bg-primary/90 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2 rounded-lg flex items-center justify-center transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
