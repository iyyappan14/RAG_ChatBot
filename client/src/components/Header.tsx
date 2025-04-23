import { Link } from "wouter";
import adibLogoPng from "@/assets/adib-logo.png";
import { RiArrowDownSLine } from "react-icons/ri";

type User = {
  id: number;
  name: string;
  username: string;
  isLoggedIn: boolean;
} | undefined;

interface HeaderProps {
  user?: User;
  onLogout?: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-secondary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <img src={adibLogoPng} alt="ADIB Logo" className="h-10" />
                <span className="hidden md:block text-sm bg-white/20 text-white px-2 py-0.5 rounded ml-2">AI Knowledge Assistant</span>
              </div>
            </Link>
          </div>
          
          <nav className="flex space-x-2 items-center">
            {user?.isLoggedIn && (
              <div className="relative mr-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input 
                  type="search" 
                  className="bg-white/10 border-none text-white text-sm rounded-lg block w-[260px] pl-10 p-2 focus:ring-primary focus:border-primary placeholder-white/60" 
                  placeholder="Search knowledge base..." 
                />
              </div>
            )}
            
            {user?.isLoggedIn ? (
              <div className="relative group">
                <button className="flex items-center bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium">
                  <span className="mr-2">{user.name}</span>
                  <RiArrowDownSLine />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login">
                <div className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                  Login
                </div>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
