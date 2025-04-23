import React, { useState, useEffect } from 'react';
import { PiChatCircleText } from 'react-icons/pi';
import { BiArrowBack } from 'react-icons/bi';
import { Link } from 'wouter';
import { LuBookOpen, LuBriefcase, LuFileText } from 'react-icons/lu';
import { RiArrowDownSLine, RiArrowUpSLine, RiBookReadLine } from 'react-icons/ri';

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
      id: 'principles',
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

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setInputValue('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = getAIResponseWithSuggestions(inputValue);
      setChatMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const toggleKnowledgeBase = (id: string) => {
    setKnowledgeBases(prev => prev.map(kb => 
      kb.id === id ? { ...kb, active: !kb.active } : kb
    ));
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    // Auto-send the question
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: question
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = getAIResponseWithSuggestions(question);
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponseWithSuggestions = (question: string): ChatMessage => {
    let content = '';
    let suggestedQuestions: string[] = [];
    
    // Check which knowledge bases are active
    const activeKBs = knowledgeBases.filter(kb => kb.active).map(kb => kb.id);
    const hasActiveKB = activeKBs.length > 0;
    
    if (!hasActiveKB) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: "Please enable at least one knowledge base to get answers to your questions.",
        suggestedQuestions: []
      };
    }
    
    // Mock responses based on keywords in the question
    if (question.toLowerCase().includes('sukuk') || question.toLowerCase().includes('bond')) {
      content = "Sukuk are Islamic financial certificates, similar to bonds in Western finance, but structured to comply with Islamic law. Unlike conventional bonds, sukuk are asset-backed securities with partial ownership in a debt, asset, project, business, or investment. They represent undivided shares in the ownership of tangible assets, usufruct, services, or investments in particular projects or special investment activities.";
      
      suggestedQuestions = [
        "What are the different types of Sukuk?",
        "How are Sukuk different from conventional bonds?",
        "What are the Shariah requirements for Sukuk?"
      ];
    } else if (question.toLowerCase().includes('murabaha') || question.toLowerCase().includes('financing')) {
      content = "Murabaha is an Islamic financing structure where the seller and buyer agree on the cost and markup of an asset. The financial institution purchases the asset, then sells it to the client at a higher price, with payment typically made in installments. This arrangement complies with Islamic principles by avoiding traditional interest charges, instead deriving profit from the disclosed markup.";
      
      suggestedQuestions = [
        "What are common uses of Murabaha financing?",
        "How does Murabaha differ from conventional loans?",
        "What documentation is required for Murabaha?"
      ];
    } else if (question.toLowerCase().includes('zakat') || question.toLowerCase().includes('charity') || question.toLowerCase().includes('donate')) {
      content = "Zakat is a mandatory charitable contribution or alms-giving required of Muslims who meet certain wealth criteria. It's considered one of the Five Pillars of Islam and serves as a mechanism for wealth redistribution to reduce inequality. Generally, one must pay 2.5% of their accumulated wealth annually, though rates vary for different assets like agricultural produce and livestock.";
      
      suggestedQuestions = [
        "How is the 2.5% Zakat rate calculated?",
        "What assets are exempt from Zakat?",
        "How does ADIB help customers calculate Zakat?"
      ];
    } else if (question.toLowerCase().includes('islamic banking') || question.toLowerCase().includes('principles')) {
      content = "Islamic banking operates on several key principles: 1) Prohibition of interest (riba), 2) Profit and loss sharing, 3) Prohibition of excessive uncertainty (gharar), 4) Prohibition of gambling and speculation (maysir), and 5) Investments must be in Shariah-compliant assets and activities. These principles ensure that financial transactions align with Islamic ethics and promote social justice.";
      
      suggestedQuestions = [
        "What is the concept of riba in Islamic banking?",
        "How does profit and loss sharing work?",
        "What businesses are considered haram for investment?"
      ];
    } else {
      content = "Thank you for your question. In Islamic banking, financial transactions must comply with Shariah principles, which prohibit interest (riba), excessive uncertainty (gharar), and gambling (maysir). This framework promotes ethical and equitable financial practices. Could you provide more details about your specific area of interest so I can offer more targeted information?";
      
      suggestedQuestions = [
        "Tell me about Sukuk (Islamic bonds)",
        "How does Murabaha financing work?",
        "What is Zakat and how is it calculated?",
        "Explain the principles of Islamic banking"
      ];
    }
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content,
      suggestedQuestions
    };
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
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center justify-center"
              >
                <span>Send</span>
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}