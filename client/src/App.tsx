import { useState } from 'react';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DocumentAnalyzer from "@/pages/DocumentAnalyzer";
import WelcomePage from "@/pages/welcome-page";
import Header from "@/components/Header";

type User = {
  id: number;
  name: string;
  username: string;
  isLoggedIn: boolean;
};

function Router() {
  const [user, setUser] = useState<User>({
    id: 1,
    name: 'Abdul Rahman',
    username: 'abdul.rahman',
    isLoggedIn: false
  });
  
  const [location] = useLocation();
  
  const handleLogin = () => {
    setUser({ ...user, isLoggedIn: true });
  };
  
  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
  };
  
  // If on login page path and already logged in, show welcome page directly
  if (location === '/login' && user.isLoggedIn) {
    return <WelcomePage />;
  }
  
  // If not logged in and not on login page, show login interface
  if (!user.isLoggedIn && location !== '/login') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to ADIB</h2>
              <p className="text-gray-600 mt-2">Sign in to your account to continue</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="username"
                  defaultValue={user.username}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    id="remember-me" 
                    name="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Switch>
        <Route path="/" component={WelcomePage} />
        <Route path="/analyze" component={DocumentAnalyzer} />
        <Route path="/login" component={() => <WelcomePage />} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
