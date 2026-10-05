import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const AppShell = ({ children, hideNav = false, fullWidth = false }) => {
  const { darkMode, toggleDarkMode } = useAppContext();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Sticky Notes", path: "/notes", icon: "fa-solid fa-note-sticky" },
    { name: "Notebook", path: "/notebook", icon: "fa-solid fa-book" },
    { name: "Whiteboards", path: "/whiteboard", icon: "fa-solid fa-pen-nib" },
    { name: "Tools", path: "/tools", icon: "fa-solid fa-screwdriver-wrench" },
    { name: "Blog", path: "/blog", icon: "fa-solid fa-blog" },
  ];

  if (hideNav) {
    return (
      <div className="min-h-screen bg-gray-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <img src="/logo.png" alt="Stiknex Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform drop-shadow-sm" />
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 hidden sm:block">
                  Stiknex
                </span>
              </Link>

              {/* Desktop Links */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                          : "text-slate-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <i className={`${item.icon} ${isActive ? "opacity-100" : "opacity-70"}`}></i>
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/buy-me-a-coffee" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                <i className="fa-solid fa-mug-hot"></i> Support
              </Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                About
              </Link>
              <div className="w-px h-5 bg-gray-200 dark:bg-slate-800 mx-2"></div>
              <button aria-label="Toggle Dark Mode" onClick={toggleDarkMode} className="p-2 rounded-lg text-slate-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
              >
                <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button aria-label="Toggle Dark Mode" onClick={toggleDarkMode} className="p-2 text-slate-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg"
              >
                <i className={darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
              </button>
              <button aria-label="Open Mobile Menu" onClick={() => setMobileMenuOpen(true)} className="p-2 text-slate-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 rounded-lg"
              >
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-70 max-w-[85vw] z-[101] bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col border-r border-gray-200 dark:border-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl bg-clip-text text-transparent bg-linear-to-r from-indigo-500 to-purple-600">Menu</span>
                <button aria-label="Close Mobile Menu" onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                      pathname === item.path
                        ? "bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:pl-5"
                    }`}
                  >
                    <i className={`${item.icon} w-5 text-center`}></i>
                    {item.name}
                  </Link>
                ))}
                
                <div className="h-px bg-gray-100 dark:bg-slate-800 my-4"></div>
                
                <Link to="/buy-me-a-coffee" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all dark:text-slate-400 dark:hover:text-indigo-400 hover:pl-5">
                  <i className="fa-solid fa-mug-hot w-5 text-center"></i> Support
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 text-slate-600 hover:bg-gray-50 rounded-xl transition-all dark:text-slate-400 dark:hover:bg-slate-800/50 hover:pl-5">
                  <i className="fa-solid fa-circle-info w-5 text-center"></i> About
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full relative">
        <div className={`flex-1 w-full ${fullWidth ? '' : 'p-4 md:p-8 lg:p-12 max-w-7xl mx-auto'}`}>
          {children}
        </div>
      </main>

      {/* SEO Internal Linking Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Core Apps</h3>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li><Link to="/notes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sticky Notes</Link></li>
                <li><Link to="/notebook" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Online Notebook</Link></li>
                <li><Link to="/whiteboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Whiteboard</Link></li>
                <li><Link to="/tools" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">All Utilities</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Calculators</h3>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li><Link to="/tools/scientific-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Scientific Calculator</Link></li>
                <li><Link to="/tools/simple-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Basic Calculator</Link></li>
                <li><Link to="/tools/date-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Date & Age Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Converters</h3>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li><Link to="/tools/currency-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Currency Converter</Link></li>
                <li><Link to="/tools/unit-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Unit Converter</Link></li>
                <li><Link to="/tools/data-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Data Storage Converter</Link></li>
                <li><Link to="/tools/temperature-converter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Temperature Converter</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Generators & Utilities</h3>
              <ul className="space-y-3 text-slate-500 dark:text-slate-400">
                <li><Link to="/tools/password-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Password Generator</Link></li>
                <li><Link to="/tools/qr-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">QR Code Generator</Link></li>
                <li><Link to="/tools/color-picker" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Color Picker</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200 dark:border-slate-800 text-sm text-slate-400 dark:text-slate-500">
            <div className="flex gap-6">
              <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
              <Link to="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Stiknex</Link>
              <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</Link>
              <Link to="/buy-me-a-coffee" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Support</Link>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Stiknex. All rights reserved. Built by Vishal Mall.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;


