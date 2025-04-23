import Header from "@/components/Header";
import DocumentSection from "@/components/DocumentSection";
import ChatSection from "@/components/ChatSection";
import { useState } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface ChatMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
}

export default function DocumentAnalyzer() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your document analysis assistant. Upload files and ask me questions about them."
    }
  ]);

  const handleFileUpload = (newFiles: UploadedFile[]) => {
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages([...chatMessages, message]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex gap-8">
          <DocumentSection 
            uploadedFiles={uploadedFiles} 
            onFileUpload={handleFileUpload} 
            onFileRemove={handleFileRemove} 
          />
          <ChatSection 
            chatMessages={chatMessages} 
            addChatMessage={addChatMessage} 
          />
        </div>
      </main>
    </div>
  );
}
