import AdibLogo from "./AdibLogo";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-t-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <AdibLogo className="h-10 mr-3" />
            <div className="hidden md:block h-6 w-px bg-gray-300 mx-3"></div>
            <h1 className="hidden md:block text-xl font-semibold text-secondary">Document Analyzer</h1>
          </div>
          <nav className="flex space-x-2">
            <a href="#" className="text-primary hover:text-primary/80 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">History</a>
            <a href="#" className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Settings</a>
            <a href="#" className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium ml-2">Login</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
