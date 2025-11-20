import { useAuth } from '../contexts/AuthContext';
import { Sparkles, FileText, Home, LogOut, Menu, X, Settings, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Fejl ved logout:', error);
    }
  };

  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Premium Design */}
          <button 
            onClick={() => navigateTo('/')} 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Ansøgningsværktøj
              </h1>
              <p className="text-xs text-purple-300 font-medium">Den nemme vej til en stærk ansøgning </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          {currentUser && (
            <>
              <nav className="hidden md:flex items-center gap-2">
                {/* Navigation Links */}
                <button 
                  onClick={() => navigateTo('/')} 
                  className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-white/10 group"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Hjem</span>
                </button>

                <button 
                  onClick={() => navigateTo('/cv')} 
                  className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-white/10 group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>CV</span>
                </button>

                <button 
                  onClick={() => navigateTo('/ansøgninger')}
                  className="flex items-center gap-2 text-white/90 hover:text-white font-medium transition-all duration-200 px-4 py-2.5 rounded-xl hover:bg-white/10 group"
                >
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Ansøgninger</span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-white/20 mx-2"></div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 hover:bg-white/15 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                        {currentUser.photoURL ? (
                          <img
                            src={currentUser.photoURL}
                            alt="Profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {currentUser.email.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                    </div>
                    <span className="text-sm font-medium text-white/90 hidden lg:inline">
                      {currentUser.email}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{currentUser.email}</p>
                        <p className="text-xs text-white/60 mt-0.5">Online</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                          <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-medium">Rediger profil</span>
                        </Link>
                        <button
                          onClick={() => {
                            navigateTo('/indstillinger');
                            setDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                        >
                          <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                          <span className="text-sm font-medium">Indstillinger</span>
                        </button>
                      </div>

                      <div className="border-t border-white/10 py-2">
                        <button
                          onClick={async () => {
                            await handleLogout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          <span className="text-sm font-medium">Log ud</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {currentUser && mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2 pb-2">
            <button 
              onClick={() => navigateTo('/')} 
              className="flex items-center gap-3 text-white/90 hover:text-white font-medium transition-all duration-200 px-4 py-3 rounded-xl hover:bg-white/10 w-full"
            >
              <Home className="w-5 h-5" />
              <span>Hjem</span>
            </button>

            <button 
              onClick={() => navigateTo('/cv')} 
              className="flex items-center gap-3 text-white/90 hover:text-white font-medium transition-all duration-200 px-4 py-3 rounded-xl hover:bg-white/10 w-full"
            >
              <FileText className="w-5 h-5" />
              <span>CV</span>
            </button>

            <button 
              onClick={() => navigateTo('/ansøgninger')}
              className="flex items-center gap-3 text-white/90 hover:text-white font-medium transition-all duration-200 px-4 py-3 rounded-xl hover:bg-white/10 w-full"
            >
              <FileText className="w-5 h-5" />
              <span>Ansøgninger</span>
            </button>

            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {currentUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <span className="text-sm font-medium text-white/90">
                  {currentUser.email}
                </span>
              </div>

              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full hover:from-red-500/30 hover:to-pink-500/30"
              >
                <LogOut className="w-5 h-5" />
                <span>Log ud</span>
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}