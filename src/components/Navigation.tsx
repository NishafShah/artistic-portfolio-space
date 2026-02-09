import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, GraduationCap, Briefcase, Settings, BookOpen, MessageSquare, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { name: 'Home', href: '/#home', icon: User },
  { name: 'About', href: '/#about', icon: User },
  { name: 'Projects', href: '/#projects', icon: Briefcase },
  { name: 'Skills', href: '/#skills', icon: Settings },
  { name: 'Courses', href: '/#courses', icon: BookOpen },
  { name: 'Contact', href: '/#contact', icon: MessageSquare },
];

const Navigation = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-purple-100' 
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 sm:h-20">
        {/* Logo */}
        <div className="flex-shrink-0 group">
          <Link 
            to="/" 
            className="flex items-center space-x-2 sm:space-x-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <span className="font-extrabold tracking-tight">Portfolio</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  location.pathname === '/' && location.hash === `#${item.href.split('#')[1]}`
                    ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-md'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </a>
            );
          })}
          
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-colors shadow-md"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-lg transition-colors shadow-md"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-colors shadow-md"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu} 
          className="lg:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile navigation overlay */}
        <div 
          className={`lg:hidden fixed inset-0 top-16 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Mobile navigation menu */}
        <div 
          className={`lg:hidden fixed top-16 left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-transform duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                    location.pathname === '/' && location.hash === `#${item.href.split('#')[1]}`
                      ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onClick={closeMenu}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </a>
              );
            })}
            
            <div className="border-t border-gray-100 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl mb-2"
                    onClick={closeMenu}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 rounded-xl w-full"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"
                  onClick={closeMenu}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
