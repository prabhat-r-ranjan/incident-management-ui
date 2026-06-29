'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext'; // ← Import useTheme
import {
  LayoutDashboard,
  AlertCircle,
  PlusCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  User
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useTheme(); // ← Use theme context
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Incidents', href: '/incidents', icon: <AlertCircle className="w-5 h-5" />, badge: 12 },
    { name: 'New Incident', href: '/incidents/create', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Problems', href: '/problems', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 text-white shadow-gray-700/30' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
        }`}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-2xl
          ${isDarkMode 
            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-white/10' 
            : 'bg-gradient-to-b from-gray-50 via-white to-gray-50 border-r border-gray-200'
          }
        `}
      >
        {/* Decorative gradient line */}
        <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

        {/* Logo */}
        <div className={`flex items-center justify-between h-16 px-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className={`text-sm font-bold truncate tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Incident Manager
                </span>
                <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  v2.0.0
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex p-1.5 rounded-lg transition-all duration-300 ${
              isDarkMode 
                ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${isActive 
                      ? isDarkMode 
                        ? 'bg-white/10 text-white shadow-lg shadow-white/5' 
                        : 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                      isDarkMode 
                        ? 'bg-gradient-to-b from-blue-400 to-purple-400' 
                        : 'bg-blue-600'
                    }`} />
                  )}
                  
                  <span className={`${isActive 
                    ? isDarkMode 
                      ? 'text-white' 
                      : 'text-blue-700' 
                    : isDarkMode
                      ? 'text-gray-400 group-hover:text-white' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  } flex-shrink-0 transition-colors duration-200`}>
                    {item.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <>
                      <span className={`text-sm font-medium flex-1 ${isActive ? isDarkMode ? 'text-white' : 'text-blue-700' : ''}`}>
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className={`
                          text-xs px-2.5 py-0.5 rounded-full font-semibold
                          ${isActive 
                            ? isDarkMode 
                              ? 'bg-white/20 text-white' 
                              : 'bg-blue-200 text-blue-800'
                            : isDarkMode
                              ? 'bg-white/10 text-gray-300 group-hover:bg-white/20'
                              : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                          }
                          transition-all duration-200
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {isCollapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className={`absolute left-full ml-2 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border ${isDarkMode ? 'bg-gray-900 border-white/10' : 'bg-gray-800 border-gray-700'}`}>
                      {item.name}
                      {item.badge && ` (${item.badge})`}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Section */}
          <div className={`mt-8 pt-4 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            {!isCollapsed ? (
              <div className="space-y-1">
                {/* User Profile */}
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                  isDarkMode 
                    ? 'bg-white/5 hover:bg-white/10' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
                      PR
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Prabhat Ranjan
                    </p>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Administrator
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-1 px-2">
                  <button 
                    onClick={toggleTheme} // ← Toggle theme
                    className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="w-4 h-4" />
                        Light
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4" />
                        Dark
                      </>
                    )}
                  </button>
                  <button className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <HelpCircle className="w-4 h-4" />
                    Help
                  </button>
                  <button className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              // Collapsed state
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                    PR
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    onClick={toggleTheme} // ← Toggle theme
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}