import React, { useState, useEffect } from 'react';
import { PiChatCircleText } from 'react-icons/pi';
import { BiArrowBack } from 'react-icons/bi';
import { Link } from 'wouter';
import { LuBookOpen, LuBriefcase, LuFileText } from 'react-icons/lu';
import { RiArrowDownSLine, RiArrowUpSLine, RiBookReadLine } from 'react-icons/ri';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  suggestedQuestions?: string[];
}

interface KnowledgeBase {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  active: boolean;
}

export default function ChatPage() {
  const { toast } = useToast();
  
  // Initial welcome message
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Welcome to ADIB Rafiq! I'm here to help with your Islamic banking inquiries. What would you like to know today?",
      suggestedQuestions: [
        "What are the principles of Islamic banking?",
        "How does Murabaha financing work?",
        "What is Sukuk?",
        "How is Zakat calculated?"
      ]
    }
  ]);
  
  // Knowledge bases that employees can toggle
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([
    {
      id: 'islamic-principles',
      name: 'Islamic Banking Principles',
      icon: <LuBookOpen className="text-lg" />,
      description: 'Core concepts and foundations of Islamic finance',
      active: true
    },
    {
      id: 'products',
      name: 'Product Details',
      icon: <LuFileText className="text-lg" />,
      description: 'Islamic banking products and services information',
      active: true
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: <RiBookReadLine className="text-lg" />,
      description: 'Shariah compliance rules and guidelines',
      active: true
    },
    {
      id: 'operations',
      name: 'Operations',
      icon: <LuBriefcase className="text-lg" />,
      description: 'Day-to-day operational procedures',
      active: true
    }
  ]);
  
  const [showKnowledgeBases, setShowKnowledgeBases] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Chat API mutation
  const chatMutation = useMutation({
    mutationFn: async ({ messages, knowledgeBase }: { 
      messages: ChatMessage[],
      knowledgeBase: string 
    }) => {
      const res = await apiRequest('POST', '/api/chat', {
        messages,
        knowledgeBase,
        suggestFollowUpQuestions: true
      });
      return await res.json();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI assistant",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    if (isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Get active knowledge base
    const activeKBs = knowledgeBases.filter(kb => kb.active);
    
    if (activeKBs.length === 0) {
      // If no knowledge base is active, show a message
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Please enable at least one knowledge base to get answers to your questions.",
        suggestedQuestions: []
      }]);
      setIsLoading(false);
      return;
    }
    
    // Use the first active knowledge base for context
    const primaryKnowledgeBase = activeKBs[0].id;
    
    try {
      const response = await chatMutation.mutateAsync({
        messages: [...chatMessages, userMessage], 
        knowledgeBase: primaryKnowledgeBase
      });
      
      if (response.message) {
        setChatMessages(prev => [...prev, response.message]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKnowledgeBase = (id: string) => {
    setKnowledgeBases(prev => prev.map(kb => 
      kb.id === id ? { ...kb, active: !kb.active } : kb
    ));
  };

  const handleSuggestedQuestion = async (question: string) => {
    setInputValue(question);
    // Auto-send the question
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Get active knowledge base
    const activeKBs = knowledgeBases.filter(kb => kb.active);
    
    if (activeKBs.length === 0) {
      // If no knowledge base is active, show a message
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Please enable at least one knowledge base to get answers to your questions.",
        suggestedQuestions: []
      }]);
      setIsLoading(false);
      return;
    }
    
    // Use the first active knowledge base for context
    const primaryKnowledgeBase = activeKBs[0].id;
    
    try {
      const response = await chatMutation.mutateAsync({
        messages: [...chatMessages, userMessage], 
        knowledgeBase: primaryKnowledgeBase
      });
      
      if (response.message) {
        setChatMessages(prev => [...prev, response.message]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
      
      {/* Chat container */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 flex flex-col">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-secondary text-white p-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center">
              <PiChatCircleText className="mr-2 text-xl" />
              <h2 className="text-lg font-medium">ADIB Rafiq</h2>
            </div>
            <button 
              onClick={() => setShowKnowledgeBases(!showKnowledgeBases)}
              className="text-white hover:text-white/80 flex items-center text-sm"
            >
              Knowledge Bases
              {showKnowledgeBases 
                ? <RiArrowUpSLine className="ml-1" /> 
                : <RiArrowDownSLine className="ml-1" />
              }
            </button>
          </div>
          
          {/* Knowledge Base Toggles */}
          {showKnowledgeBases && (
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Select knowledge bases to search:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {knowledgeBases.map(kb => (
                  <div 
                    key={kb.id}
                    onClick={() => toggleKnowledgeBase(kb.id)}
                    className={`p-2 rounded-md cursor-pointer flex items-center ${
                      kb.active ? 'bg-primary/10 border border-primary/20' : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className={`mr-2 ${kb.active ? 'text-primary' : 'text-gray-500'}`}>
                      {kb.icon}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${kb.active ? 'text-primary' : 'text-gray-700'}`}>
                        {kb.name}
                      </p>
                      <p className="text-xs text-gray-500">{kb.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {chatMessages.map(message => (
              <div key={message.id} className="space-y-2">
                <div 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
                
                {/* Suggested follow-up questions */}
                {message.type === 'assistant' && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                  <div className="ml-4 flex flex-wrap gap-2 mt-2">
                    {message.suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestedQuestion(question)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Message input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Type your message here..."
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing</span>
                  </div>
                ) : (
                  <>
                    <span>Send</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}