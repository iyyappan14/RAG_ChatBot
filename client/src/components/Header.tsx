import adibLogoPng from "@/assets/adib-logo.png";

export default function Header() {
  return (
    <header className="bg-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src={adibLogoPng} alt="ADIB Logo" className="h-10 mr-3" />
            <div className="hidden md:block h-6 w-px bg-white/20 mx-3"></div>
            <h1 className="hidden md:block text-xl font-medium text-white">Document Analyzer</h1>
          </div>
          <nav className="flex space-x-2">
            <a href="#" className="text-white hover:text-white/80 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="#" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">History</a>
            <a href="#" className="text-white/70 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Settings</a>
            <a href="#" className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium ml-2">Login</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
