import React from 'react';
import { Link } from 'wouter';
import { PiChatCircleText } from 'react-icons/pi';
import { LuFileText } from 'react-icons/lu';
import { RiBookReadLine, RiPieChartLine } from 'react-icons/ri';

export default function WelcomePage() {
  const username = "Abdul Rahman";
  
  return (
    <div className="flex-1 w-full">
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ADIB Rafiq</h1>
          <p className="text-lg text-gray-600">Your AI-powered companion for Islamic banking principles, products, and compliance</p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Link href="/analyze">
            <div className="bg-primary text-white px-6 py-3 rounded-md text-base font-medium hover:bg-primary/90 flex items-center cursor-pointer">
              <PiChatCircleText className="mr-2 text-lg" />
              Start Conversation
            </div>
          </Link>
          
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-50 flex items-center">
            <LuFileText className="mr-2 text-lg" />
            Manage Documents
          </button>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <RiBookReadLine className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Knowledge Bases</h3>
            </div>
            <p className="text-3xl font-bold mb-1">4</p>
            <p className="text-sm text-gray-500">Available Islamic banking topics</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <LuFileText className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Documents</h3>
            </div>
            <p className="text-3xl font-bold mb-1">12</p>
            <p className="text-sm text-gray-500">Uploaded reference materials</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <PiChatCircleText className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Daily Questions</h3>
            </div>
            <p className="text-3xl font-bold mb-1">128</p>
            <p className="text-sm text-gray-500">Questions answered today</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <RiPieChartLine className="text-primary text-xl mr-2" />
              <h3 className="text-sm font-medium text-gray-500">Accuracy Rate</h3>
            </div>
            <p className="text-3xl font-bold mb-1">97.5%</p>
            <p className="text-sm text-gray-500">Information verification rate</p>
          </div>
        </div>
        
        {/* Knowledge Base Cards */}
        <h2 className="text-2xl font-bold mb-6">Knowledge Bases</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-black/5 rounded-lg flex items-center justify-center text-primary">
                <RiBookReadLine className="text-2xl" />
              </div>
            </div>
            <h3 className="text-center font-medium mb-2">Islamic Banking Principles</h3>
            <p className="text-sm text-gray-500 text-center">Core concepts and foundations of Islamic finance</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                <LuFileText className="text-2xl" />
              </div>
            </div>
            <h3 className="text-center font-medium mb-2">Product Details</h3>
            <p className="text-sm text-gray-500 text-center">Islamic banking products and services information</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                <RiPieChartLine className="text-2xl" />
              </div>
            </div>
            <h3 className="text-center font-medium mb-2">Compliance</h3>
            <p className="text-sm text-gray-500 text-center">Shariah compliance rules and guidelines</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                <PiChatCircleText className="text-2xl" />
              </div>
            </div>
            <h3 className="text-center font-medium mb-2">Operations</h3>
            <p className="text-sm text-gray-500 text-center">Day-to-day operational procedures</p>
          </div>
        </div>
        
        {/* Get Started Section */}
        <h2 className="text-2xl font-bold mb-6">Get Started</h2>
        <div className="bg-primary/5 p-6 rounded-lg border border-primary/10 mb-8">
          <p className="text-lg mb-4">
            Welcome, <span className="font-medium">{username}</span>! Ask me anything about Islamic banking principles, products, or compliance requirements.
          </p>
          <Link href="/analyze">
            <div className="bg-primary text-white px-6 py-2 rounded-md text-base font-medium hover:bg-primary/90 cursor-pointer inline-block">
              Start a New Chat
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}