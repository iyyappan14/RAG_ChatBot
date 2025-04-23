import React, { useState } from 'react';
import Header from '@/components/Header';
import { PiChatCircleText } from 'react-icons/pi';
import { BiArrowBack } from 'react-icons/bi';
import { Link } from 'wouter';

interface ChatMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
}

export default function ChatPage() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Welcome to ADIB's AI Knowledge Assistant! I'm here to help with your Islamic banking inquiries. What would you like to know today?"
    }
  ]);
  
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
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputValue)
      };
      
      setChatMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (question: string): string => {
    // Mock responses based on keywords in the question
    if (question.toLowerCase().includes('sukuk') || question.toLowerCase().includes('bond')) {
      return "Sukuk are Islamic financial certificates, similar to bonds in Western finance, but structured to comply with Islamic law. Unlike conventional bonds, sukuk are asset-backed securities with partial ownership in a debt, asset, project, business, or investment. They represent undivided shares in the ownership of tangible assets, usufruct, services, or investments in particular projects or special investment activities.";
    } else if (question.toLowerCase().includes('murabaha') || question.toLowerCase().includes('financing')) {
      return "Murabaha is an Islamic financing structure where the seller and buyer agree on the cost and markup of an asset. The financial institution purchases the asset, then sells it to the client at a higher price, with payment typically made in installments. This arrangement complies with Islamic principles by avoiding traditional interest charges, instead deriving profit from the disclosed markup.";
    } else if (question.toLowerCase().includes('zakat') || question.toLowerCase().includes('charity') || question.toLowerCase().includes('donate')) {
      return "Zakat is a mandatory charitable contribution or alms-giving required of Muslims who meet certain wealth criteria. It's considered one of the Five Pillars of Islam and serves as a mechanism for wealth redistribution to reduce inequality. Generally, one must pay 2.5% of their accumulated wealth annually, though rates vary for different assets like agricultural produce and livestock.";
    } else {
      return "Thank you for your question. In Islamic banking, financial transactions must comply with Shariah principles, which prohibit interest (riba), excessive uncertainty (gharar), and gambling (maysir). This framework promotes ethical and equitable financial practices. Could you provide more details about your specific area of interest so I can offer more targeted information?";
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
      <Header />
      
      {/* Chat container */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col">
        <div className="flex items-center mb-6">
          <Link href="/">
            <div className="flex items-center text-primary hover:text-primary/80 cursor-pointer">
              <BiArrowBack className="mr-2" />
              <span>Back to Home</span>
            </div>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-secondary text-white p-4 flex items-center rounded-t-lg">
            <PiChatCircleText className="mr-2 text-xl" />
            <h2 className="text-lg font-medium">AI Knowledge Assistant</h2>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map(message => (
              <div 
                key={message.id} 
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