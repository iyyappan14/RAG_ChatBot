import DocumentSection from "@/components/DocumentSection";
import ChatSection from "@/components/ChatSection";
import { useState } from "react";
import { formatFileSize } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { BiArrowBack } from "react-icons/bi";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string; // Add content field for document text
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
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'analyze'>('upload');
  const [activeResult, setActiveResult] = useState<string | null>(null);

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
    // Simulate showing a result when the user asks a question
    if (message.type === 'user') {
      setActiveResult('chart');
    }
  };

  const handleResetConversation = () => {
    setChatMessages([{
      id: '1',
      type: 'assistant',
      content: "Welcome to ADIB Document Analyzer! I'm your AI assistant. Upload your documents and ask me questions about them."
    }]);
    setActiveResult(null);
  };
  
  // Get the navigate function from wouter
  const [_, navigate] = useLocation();
  
  const handleStartAnalyzing = () => {
    if (uploadedFiles.length > 0) {
      // Redirect to the new chat page instead of showing analyze screen
      navigate('/chat');
    } else {
      alert('Please upload at least one document first');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Simple header with logo and nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="text-primary font-bold text-xl mr-3">ADIB</div>
              <div className="text-gray-700 text-sm">Rafiq AI Assistant</div>
            </div>
          </Link>
          
          <Link href="/">
            <div className="flex items-center text-primary hover:text-primary/80 cursor-pointer">
              <BiArrowBack className="mr-1" />
              <span className="text-sm">Back to Dashboard</span>
            </div>
          </Link>
        </div>
      </header>
      <div className="flex-1 w-full">
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentScreen === 'upload' ? (
            /* SCREEN 1: Upload Document Interface */
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center">Upload Documents to Analyze</h2>
              
              <div className="max-w-2xl mx-auto mb-8">
                <div 
                  className="bg-blue-50 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-blue-200"
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
                  <div className="text-primary mb-4">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12V19M12 19L9.5 16.5M12 19L14.5 16.5M6.5 15.5V15.5C5.67157 15.5 5 14.8284 5 14V6.5C5 5.67157 5.67157 5 6.5 5H14C14.8284 5 15.5 5.67157 15.5 6.5V14C15.5 14.8284 14.8284 15.5 14 15.5H6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">Drag and drop files here</p>
                  <p className="text-sm text-gray-500 mb-4">PDF, Word, or Image files</p>
                  <button className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                    Browse files
                  </button>
                </div>
              </div>
              
              <div className="max-w-2xl mx-auto mb-8">
                <p className="text-base font-medium mb-3">Knowledge base settings:</p>
                <div className="grid md:grid-cols-3 gap-3">
                  <label className="bg-white border border-gray-200 p-4 rounded-lg flex items-start hover:border-primary/50 hover:bg-blue-50/30 cursor-pointer">
                    <input 
                      type="radio" 
                      name="knowledge" 
                      value="none" 
                      checked={selectedOption === "none"}
                      onChange={() => setSelectedOption("none")}
                      className="mt-1 mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div>
                      <span className="block font-medium mb-1">No knowledge base</span>
                      <span className="text-sm text-gray-500">Answer based on general knowledge only</span>
                    </div>
                  </label>
                  
                  <label className="bg-white border border-gray-200 p-4 rounded-lg flex items-start hover:border-primary/50 hover:bg-blue-50/30 cursor-pointer">
                    <input 
                      type="radio" 
                      name="knowledge" 
                      value="provided" 
                      checked={selectedOption === "provided"}
                      onChange={() => setSelectedOption("provided")}
                      className="mt-1 mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div>
                      <span className="block font-medium mb-1">Use uploaded documents</span>
                      <span className="text-sm text-gray-500">Answer based on the documents you upload</span>
                    </div>
                  </label>
                  
                  <label className="bg-white border border-gray-200 p-4 rounded-lg flex items-start hover:border-primary/50 hover:bg-blue-50/30 cursor-pointer">
                    <input 
                      type="radio" 
                      name="knowledge" 
                      value="existing" 
                      checked={selectedOption === "existing"}
                      onChange={() => setSelectedOption("existing")}
                      className="mt-1 mr-3 h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <div>
                      <span className="block font-medium mb-1">Use existing knowledge</span>
                      <span className="text-sm text-gray-500">Answer using ADIB's knowledge base</span>
                    </div>
                  </label>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="max-w-2xl mx-auto">
                  <p className="text-base font-medium mb-3">Uploaded documents ({uploadedFiles.length}):</p>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div 
                          key={file.id}
                          className="bg-gray-50 border border-gray-100 rounded-md p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center overflow-hidden">
                            <div className="w-8 h-8 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 2.5H6C5.17157 2.5 4.5 3.17157 4.5 4V20C4.5 20.8284 5.17157 21.5 6 21.5H18C18.8284 21.5 19.5 20.8284 19.5 20V8L14 2.5Z" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleFileRemove(file.id)}
                            className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0 ml-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleStartAnalyzing}
                  className="bg-primary text-white px-6 py-3 rounded-md text-base font-medium hover:bg-primary/90"
                >
                  Start Analyzing Documents
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN 2: Chat & Results Interface */
            <div className="flex h-[calc(100vh-200px)]">
              {/* Left side - Chat */}
              <div className="w-1/2 pr-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                  <div className="bg-secondary text-white p-3 flex items-center justify-between">
                    <h2 className="text-lg font-medium">Chat with Documents</h2>
                    <div className="flex items-center">
                      <button
                        onClick={() => setCurrentScreen('upload')}
                        className="text-white bg-white/20 hover:bg-white/30 rounded-md p-1.5 mr-2 flex items-center text-xs"
                      >
                        <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                      </button>
                      <button
                        onClick={handleResetConversation}
                        className="text-white bg-white/20 hover:bg-white/30 rounded-md p-1.5 flex items-center text-xs"
                      >
                        <svg className="mr-1" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    <ChatSection 
                      chatMessages={chatMessages} 
                      addChatMessage={addChatMessage}
                      uploadedFiles={uploadedFiles}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right side - Results */}
              <div className="w-1/2 pl-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                  <div className="bg-secondary text-white p-3 flex items-center">
                    <h2 className="text-lg font-medium">Results</h2>
                  </div>
                  
                  <div className="flex-1 overflow-auto p-4">
                    {activeResult === 'chart' ? (
                      <div className="h-full flex flex-col justify-center items-center">
                        <div className="bg-white rounded-lg p-4 w-full max-w-md">
                          <h3 className="text-lg font-medium mb-3 text-center">Document Analysis</h3>
                          
                          {/* Sample chart - Replace with actual content */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="h-48 bg-blue-50 rounded-md mb-4 flex flex-col items-center justify-center">
                              <div className="w-full px-4">
                                <div className="h-6 bg-primary rounded-full w-3/4 mb-2"></div>
                                <div className="h-6 bg-primary/80 rounded-full w-1/2 mb-2"></div>
                                <div className="h-6 bg-primary/60 rounded-full w-2/3 mb-2"></div>
                                <div className="h-6 bg-primary/40 rounded-full w-1/4 mb-2"></div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">Analysis results chart</p>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-3 px-3">
                              <h4 className="font-medium mb-2">Key Insights</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>Main topics identified: Financial reporting, risk assessment</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>Document contains 5 pages with financial data</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="text-primary mr-2">•</span>
                                  <span>2 tables and 1 chart extracted for analysis</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-gray-500">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 8V21H3V8M23 3H1V8H23V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 12H14M12 12V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="mt-3">Ask a question about your documents to see results</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
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
