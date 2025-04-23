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
      content: "Welcome to ADIB Document Analyzer! I'm your AI assistant. Upload your documents and ask me questions about them."
    }
  ]);

  const handleFileUpload = (newFiles: UploadedFile[]) => {
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    
    // Add a confirmation message when files are uploaded
    if (newFiles.length > 0) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `I've received ${newFiles.length} new document${newFiles.length > 1 ? 's' : ''}. You can now ask questions about the content.`
      };
      setChatMessages([...chatMessages, message]);
    }
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileId));
  };

  const addChatMessage = (message: ChatMessage) => {
    setChatMessages([...chatMessages, message]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-secondary/5 to-primary/5">
      <Header />
      <div className="flex-1 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDMzNjYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZD0iTTM2IDM0aDR2MWgtNHptMC0yaDF2NGgtMXptMi0yaDF2MWgtMXptMC0yaDF2MWgtMXptLTItMmgxdjFoLTF6Ii8+PHBhdGggZmlsbD0iIzAwYTNhNiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBkPSJNNDIgMmgxdjFoLTF6bS00IDBoMXYxaC0xem0tNCAwaDJ2MWgtMnptOCAyaDF2MWgtMXptLTEyIDBoMXYxaC0xem0xMiA0aDF2MWgtMXptLTQgMGgxdjFoLTF6bS00IDBoMXYxaC0xem0tNCAwaDJ2MWgtMnptMTIgNGgxdjJoLTF6bS0xMiAwaDJ2MWgtMnoiLz48L2c+PC9zdmc+')]">
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} ADIB. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              <a href="#" className="text-primary hover:text-primary/80 mr-4">Privacy Policy</a>
              <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
