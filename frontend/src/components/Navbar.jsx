import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/expenses?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm border-b border-white/10 dark:border-white/5 w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center gap-2 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-10 flex-shrink-0">
            <div 
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer flex items-center gap-2 group"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-xl">💰</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
                <span className="hidden xs:inline">Expense</span>Tracker
              </h1>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex gap-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-slate-800 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/expenses')}
                className="text-slate-800 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-colors cursor-pointer"
              >
                Expenses
              </button>
              <button
                onClick={() => navigate('/analytics')}
                className="text-slate-800 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-sm transition-colors cursor-pointer"
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden md:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search Expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 rounded-2xl py-2.5 px-12 text-sm focus:ring-4 focus:ring-blue-500/10 text-slate-900 dark:text-white transition-all outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              <div className="absolute left-4 top-3 text-slate-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors">
                🔍
              </div>
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700 transition-all cursor-pointer text-lg flex-shrink-0"
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* Desktop User Info & Logout */}
            <div className="hidden sm:flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 bg-slate-200/50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-transparent hover:border-blue-500/20 transition-all flex-shrink-0">
                  <span className="text-sm font-black text-slate-900 dark:text-gray-200">
                    {user?.name}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-slate-900/10 flex-shrink-0"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-300/50 dark:hover:bg-slate-700 transition-all cursor-pointer flex-shrink-0"
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <span className={`w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-slate-900 dark:bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100 border-t border-slate-200 dark:border-slate-800' : 'max-h-0 opacity-0 border-t-0'}`}>
        <div className="p-6 space-y-6 bg-white dark:bg-slate-900">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 px-12 text-sm focus:ring-4 focus:ring-blue-500/10 dark:text-white outline-none"
              />
              <div className="absolute left-4 top-3.5 text-slate-400">🔍</div>
            </div>
          </form>

          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
              className="flex items-center gap-4 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-900 dark:text-white font-black transition-all"
            >
              <span className="text-xl">📊</span> Dashboard
            </button>
            <button
              onClick={() => { navigate('/expenses'); setIsMenuOpen(false); }}
              className="flex items-center gap-4 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-900 dark:text-white font-black transition-all"
            >
              <span className="text-xl">💳</span> Expenses
            </button>
            <button
              onClick={() => { navigate('/analytics'); setIsMenuOpen(false); }}
              className="flex items-center gap-4 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-900 dark:text-white font-black transition-all"
            >
              <span className="text-xl">📈</span> Analytics
            </button>
          </div>

          {/* Mobile User Info & Logout */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            {user && (
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-black">
                  {user.name?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-red-500/20"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
