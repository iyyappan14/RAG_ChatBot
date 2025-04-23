import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

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
            className="chat-input w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none resize-none"
            placeholder="Ask a question about your documents..." 
            rows={2}
          />
        </div>
        <button 
          type="submit" 
          className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <span>Ask</span>
          <SendHorizonal className="ml-2 h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
