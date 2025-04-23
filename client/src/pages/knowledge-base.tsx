import React, { useState } from 'react';
import { Link } from 'wouter';
import { BiArrowBack } from 'react-icons/bi';
import { LuFileText, LuBookOpen, LuBriefcase, LuSearch } from 'react-icons/lu';
import { RiBookReadLine } from 'react-icons/ri';
import { formatFileSize } from '@/lib/utils';

// Sample documents for the knowledge base demonstration
const sampleDocuments = [
  {
    id: '1',
    name: 'Islamic Banking Principles.pdf',
    size: 2500000,
    type: 'application/pdf',
    category: 'Principles',
    dateAdded: '2025-03-15',
    icon: <LuBookOpen className="text-xl" />
  },
  {
    id: '2',
    name: 'Murabaha Financing Guide.docx',
    size: 1800000,
    type: 'application/msword',
    category: 'Products',
    dateAdded: '2025-03-18',
    icon: <LuFileText className="text-xl" />
  },
  {
    id: '3',
    name: 'Sukuk Transaction Manual.pdf',
    size: 3200000,
    type: 'application/pdf',
    category: 'Products',
    dateAdded: '2025-03-20',
    icon: <LuFileText className="text-xl" />
  },
  {
    id: '4',
    name: 'Shariah Compliance Framework.pdf',
    size: 4100000,
    type: 'application/pdf',
    category: 'Compliance',
    dateAdded: '2025-03-10',
    icon: <RiBookReadLine className="text-xl" />
  },
  {
    id: '5',
    name: 'Customer Onboarding Procedures.pdf',
    size: 2800000,
    type: 'application/pdf',
    category: 'Operations',
    dateAdded: '2025-03-22',
    icon: <LuBriefcase className="text-xl" />
  },
  {
    id: '6',
    name: 'Zakat Calculation Guidelines.docx',
    size: 1500000,
    type: 'application/msword',
    category: 'Principles',
    dateAdded: '2025-03-25',
    icon: <LuBookOpen className="text-xl" />
  },
  {
    id: '7',
    name: 'Digital Banking Services Manual.pdf',
    size: 5200000,
    type: 'application/pdf',
    category: 'Operations',
    dateAdded: '2025-03-28',
    icon: <LuBriefcase className="text-xl" />
  },
  {
    id: '8',
    name: 'Risk Management Framework.pdf',
    size: 3500000,
    type: 'application/pdf',
    category: 'Compliance',
    dateAdded: '2025-04-01',
    icon: <RiBookReadLine className="text-xl" />
  }
];

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = [
    { id: 'principles', name: 'Islamic Banking Principles', icon: <LuBookOpen className="text-xl" /> },
    { id: 'products', name: 'Product Details', icon: <LuFileText className="text-xl" /> },
    { id: 'compliance', name: 'Compliance', icon: <RiBookReadLine className="text-xl" /> },
    { id: 'operations', name: 'Operations', icon: <LuBriefcase className="text-xl" /> }
  ];
  
  // Filter documents based on search term and active category
  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = activeCategory === null || 
      doc.category.toLowerCase() === activeCategory.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with logo and nav */}
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
      
      {/* Main content */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-gray-600">
            Browse through ADIB's knowledge base documents to learn about Islamic banking principles, products, and services.
          </p>
        </div>
        
        {/* Search and filter section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <LuSearch />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  activeCategory === null
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Document tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredDocuments.map(doc => (
            <Link key={doc.id} href="/chat">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer bg-white">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3 flex-shrink-0">
                    {doc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">{doc.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{doc.category} • {formatFileSize(doc.size)}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Added: {doc.dateAdded}</span>
                  <button className="text-primary hover:text-primary/80">
                    Open with AI
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <LuSearch className="inline-block text-4xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No documents found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Upload new document button */}
        <div className="flex justify-center">
          <Link href="/analyze">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 flex items-center">
              <LuFileText className="mr-2" />
              Upload New Document
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}