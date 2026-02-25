import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { LogOut, User, Zap, ChevronDown } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const Header = ({ showDarkModeToggle = false }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getUserInitial = () => {
    if (currentUser?.name) {
      return currentUser.name.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getAvatarUrl = () => {
    if (currentUser?.avatar) {
      return pb.files.getUrl(currentUser, currentUser.avatar);
    }
    return null;
  };

  return (
    <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold text-white">RepurposeForge.ai</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}
            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors p-1 pr-3"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                    {getAvatarUrl() ? (
                      <img 
                        src={getAvatarUrl()} 
                        alt={currentUser?.name || 'User'} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {getUserInitial()}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-gray-800 border border-gray-700 shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <User className="h-4 w-4" />
                        <span className="text-sm truncate">{currentUser?.email}</span>
                      </div>
                      {currentUser?.name && (
                        <p className="text-xs text-gray-400 mt-1">{currentUser.name}</p>
                      )}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;