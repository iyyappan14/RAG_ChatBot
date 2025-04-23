import { Banknote } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center text-white mr-3">
              <Banknote className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-secondary">ADIB Document Analyzer</h1>
          </div>
          <nav className="flex space-x-4">
            <a href="#" className="text-primary hover:text-primary/80 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">History</a>
            <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Settings</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
