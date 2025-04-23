import Header from "@/components/Header";
import DocumentSection from "@/components/DocumentSection";
import ChatSection from "@/components/ChatSection";
import { useState } from "react";
import { formatFileSize } from "@/lib/utils";

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
  const [selectedOption, setSelectedOption] = useState<string>("none");

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

  const handleResetConversation = () => {
    setChatMessages([{
      id: '1',
      type: 'assistant',
      content: "Welcome to ADIB Document Analyzer! I'm your AI assistant. Upload your documents and ask me questions about them."
    }]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 w-full">
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:flex gap-8">
            {/* Left panel - Chat History */}
            <div className="lg:w-1/3 mb-6 lg:mb-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-secondary text-white p-4 flex items-center">
                  <h2 className="text-lg font-medium">Chat History</h2>
                </div>
                
                <div className="p-4">
                  <ChatSection 
                    chatMessages={chatMessages} 
                    addChatMessage={addChatMessage} 
                  />
                </div>
                
                <div className="p-4 border-t border-gray-100">
                  <button 
                    onClick={handleResetConversation}
                    className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Reset Conversation Memory
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right panel - Document Upload */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-semibold mb-6">Upload Document</h2>
                
                <div className="mb-6">
                  <p className="mb-2 text-gray-700">Project document</p>
                  <div 
                    className="bg-blue-50 rounded-lg p-6 flex items-center justify-between cursor-pointer"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const files = Array.from(e.dataTransfer.files).map(file => ({
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        name: file.name,
                        size: file.size,
                        type: file.type
                      }));
                      handleFileUpload(files);
                    }}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.multiple = true;
                      input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
                      input.onchange = (e) => {
                        const fileList = (e.target as HTMLInputElement).files;
                        if (fileList) {
                          const files = Array.from(fileList).map(file => ({
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                            name: file.name,
                            size: file.size,
                            type: file.type
                          }));
                          handleFileUpload(files);
                        }
                      };
                      input.click();
                    }}
                  >
                    <div className="flex items-center">
                      <div className="text-blue-400 mr-4">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 12V19M12 19L9.5 16.5M12 19L14.5 16.5M6.5 15.5V15.5C5.67157 15.5 5 14.8284 5 14V6.5C5 5.67157 5.67157 5 6.5 5H14C14.8284 5 15.5 5.67157 15.5 6.5V14C15.5 14.8284 14.8284 15.5 14 15.5H6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Drag and drop file here</p>
                        <p className="text-sm text-gray-500">Limit 200MB per file • PDF</p>
                      </div>
                    </div>
                    <button className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium">
                      Browse files
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="mb-4 font-medium">Select the knowledge base for answering the question:</p>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="knowledge" 
                        value="none" 
                        checked={selectedOption === "none"}
                        onChange={() => setSelectedOption("none")}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2">None</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="knowledge" 
                        value="provided" 
                        checked={selectedOption === "provided"}
                        onChange={() => setSelectedOption("provided")}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2">Use the provided document</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="knowledge" 
                        value="existing" 
                        checked={selectedOption === "existing"}
                        onChange={() => setSelectedOption("existing")}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-2">Use the existing documents</span>
                    </label>
                  </div>
                </div>
                
                <p className="mb-6 text-gray-700">Please select the documents to proceed</p>
                
                <div className="mb-4">
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mb-6">
                      {uploadedFiles.map((file) => (
                        <div 
                          key={file.id}
                          className="bg-gray-50 border border-gray-100 rounded-md p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2.5H6C5.17157 2.5 4.5 3.17157 4.5 4V20C4.5 20.8284 5.17157 21.5 6 21.5H18C18.8284 21.5 19.5 20.8284 19.5 20V8L14 2.5Z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleFileRemove(file.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
