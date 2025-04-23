import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { PiChatCircleText } from 'react-icons/pi';
import { LuFileText } from 'react-icons/lu';
import { RiBookReadLine, RiPieChartLine } from 'react-icons/ri';
import { useQuery } from '@tanstack/react-query';

export default function WelcomePage() {
  const username = "Abdul Rahman";
  
  // Define the Stats interface
  interface Stats {
    knowledgeBases: Array<{
      id: string;
      name: string;
      description: string;
      documentCount: number;
    }>;
    documentCount: number;
    questionCount: number;
    accuracyRate: number;
  }
  
  // Fetch stats data from API with the correct type
  const { data: statsData, isLoading, error } = useQuery<Stats>({
    queryKey: ['/api/stats'],
    refetchInterval: 10000, // Refresh every 10 seconds to keep the counts updated
  });
  
  // Default values used while loading or if there's an error
  const knowledgeBaseCount = statsData?.knowledgeBases?.length || 4;
  const documentCount = statsData?.documentCount || 0;
  const questionCount = statsData?.questionCount || 0;
  const accuracyRate = statsData?.accuracyRate || 97.5;
  
  // Get knowledge bases for display
  const knowledgeBases = statsData?.knowledgeBases || [
    {
      id: 'islamic-principles',
      name: 'Islamic Banking Principles',
      description: 'Core concepts and foundations of Islamic finance',
      documentCount: 0
    },
    {
      id: 'products',
      name: 'Product Details',
      description: 'Islamic banking products and services information',
      documentCount: 0
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'Shariah compliance rules and guidelines',
      documentCount: 0
    },
    {
      id: 'operations',
      name: 'Operations',
      description: 'Day-to-day operational procedures',
      documentCount: 0
    }
  ];
  
  return (
    <div className="flex-1 w-full">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ADIB Rafiq</h1>
          <p className="text-lg text-gray-600">Your AI-powered companion for Islamic banking principles, products, and compliance</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link href="/chat">
            <div className="bg-primary text-white px-6 py-3 rounded-md text-base font-medium hover:bg-primary/90 flex items-center cursor-pointer">
              <PiChatCircleText className="mr-2 text-lg" />
              Start Conversation
            </div>
          </Link>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <RiBookReadLine className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Knowledge Bases</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{knowledgeBaseCount}</p>
            <p className="text-sm text-gray-500">Available Islamic banking topics</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <LuFileText className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Documents</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{documentCount}</p>
            <p className="text-sm text-gray-500">Uploaded reference materials</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <PiChatCircleText className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Daily Questions</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{questionCount}</p>
            <p className="text-sm text-gray-500">Questions answered today</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <RiPieChartLine className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Accuracy Rate</h3>
            </div>
            <p className="text-3xl font-bold mb-1">{accuracyRate}%</p>
            <p className="text-sm text-gray-500">Information verification rate</p>
          </div>
        </div>
        
        {/* Knowledge Base Cards */}
        <h2 className="text-2xl font-bold mb-6">Knowledge Bases</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {knowledgeBases.map((kb: {
            id: string;
            name: string;
            description: string;
            documentCount: number;
          }, index: number) => {
            // Different colors for different knowledge bases
            const bgColors = ['bg-black/5', 'bg-amber-50', 'bg-green-50', 'bg-indigo-50'];
            const textColors = ['text-primary', 'text-amber-500', 'text-green-500', 'text-indigo-500'];
            const icons = [<RiBookReadLine key="icon1" className="text-2xl" />, <LuFileText key="icon2" className="text-2xl" />, <RiPieChartLine key="icon3" className="text-2xl" />, <PiChatCircleText key="icon4" className="text-2xl" />];
            
            return (
              <div key={kb.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 ${bgColors[index % 4]} rounded-lg flex items-center justify-center ${textColors[index % 4]}`}>
                    {icons[index % 4]}
                  </div>
                </div>
                <h3 className="text-center font-medium mb-2">{kb.name}</h3>
                <p className="text-sm text-gray-500 text-center">{kb.description}</p>
                {kb.documentCount > 0 && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {kb.documentCount} document{kb.documentCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Get Started Section */}
        <h2 className="text-2xl font-bold mb-6">Get Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Ask Questions Section */}
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                <PiChatCircleText className="text-xl" />
              </div>
              <h3 className="text-lg font-medium">Ask Questions</h3>
            </div>
            <p className="text-gray-600 mb-5 flex-grow">
              Chat with our AI to get instant answers about Islamic banking principles and compliance requirements.
            </p>
            <Link href="/chat">
              <div className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 cursor-pointer inline-block">
                Start a New Chat
              </div>
            </Link>
          </div>
          
          {/* Upload Documents Section */}
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                <LuFileText className="text-xl" />
              </div>
              <h3 className="text-lg font-medium">Upload Documents</h3>
            </div>
            <p className="text-gray-600 mb-5 flex-grow">
              Upload financial documents and contracts to analyze them with our AI assistant.
            </p>
            <Link href="/analyze">
              <div className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 cursor-pointer inline-block">
                Upload Documents
              </div>
            </Link>
          </div>
          
          {/* Explore Topics Section */}
          <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">
                <RiBookReadLine className="text-xl" />
              </div>
              <h3 className="text-lg font-medium">Explore Topics</h3>
            </div>
            <p className="text-gray-600 mb-5 flex-grow">
              Browse through our knowledge base to learn about Islamic finance principles and best practices.
            </p>
            <Link href="/knowledge-base">
              <div className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 cursor-pointer inline-block">
                Browse Knowledge Base
              </div>
            </Link>
          </div>
        </div>
        
        {/* Welcome Message */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <p className="text-lg">
            Welcome, <span className="font-medium">{username}</span>! How can I assist you today?
          </p>
        </div>
      </main>
    </div>
  );
}