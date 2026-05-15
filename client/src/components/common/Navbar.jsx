import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0px_4px_20px_rgba(108,99,255,0.05)]' : 'bg-transparent'}`}>
      <nav className="flex justify-between items-center px-lg py-md max-w-container_max mx-auto">
        <div className="flex items-center gap-xl">
          <Link to="/" className="flex items-center gap-xs">
            <img alt="Voxly Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDENCuc673xDsPZdqzUFSGVaZ3Iq2mqNM9kDx37g_J2pzjAb-U8vwoysqvqfnZNiaW2RaO3cZXEn0XTi7WH80s8ePJRxh6Wfa_Ze8g9zQEP2ferFE_JHKTXW4Kzk8wU-Gg-gu4UrRpUn5RpZoYvFztJFQbPjZRnWzDLjJKH9XS6cBntqwx_ZtemHJoJPbvb5QXUzjhG1uEvk0oRXSbcnV1Xv83mBKqmYh9wWzTnICBhIK9oGopQFp4aaSFm-ZMSshkVhNcKu1L_kfM"/>
            <span className="font-display-lg text-headline-md text-primary tracking-tighter">Voxly</span>
          </Link>

          <div className="hidden md:flex items-center gap-lg">
            <NavLink to="/dashboard" className={({ isActive }) => `font-body-md text-body-md transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>
              Dashboard
            </NavLink>
            <div className="relative group">
              <NavLink to="/polls" className={({ isActive }) => `font-body-md text-body-md transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>
                Polls
              </NavLink>
              <span className="absolute -top-3 -right-6 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
            </div>
            <NavLink to="/analytics" className={({ isActive }) => `font-body-md text-body-md transition-colors ${isActive ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'}`}>
              Analytics
            </NavLink>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer">Templates</a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-md">
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-sm bg-surface-container-high px-sm py-1 rounded-full border border-outline-variant/30 hover:border-primary/50 transition-colors focus:outline-none"
              >
                <span className="text-sm font-bold text-on-surface pl-2">{user?.username}</span>
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                  {getInitial(user?.username)}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-high rounded-xl shadow-lg py-sm border border-outline-variant/30 overflow-hidden z-50">
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-lg py-sm text-sm text-on-surface hover:bg-surface-variant transition-colors">My Dashboard</Link>
                  <Link to="/polls/create" onClick={() => setIsDropdownOpen(false)} className="block px-lg py-sm text-sm text-on-surface hover:bg-surface-variant transition-colors">Create Poll</Link>
                  <div className="border-t border-outline-variant/20 my-sm"></div>
                  <button onClick={handleLogout} className="block w-full text-left px-lg py-sm text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-on-surface-variant font-bold px-md hover:text-primary transition-colors">
                Login
              </Link>
              <Link to="/register" className="brand-gradient text-on-primary px-lg py-sm rounded-full font-bold shadow-lg active:scale-95 transition-transform">
                Get Started
              </Link>
            </>
          )}
        </div>

        {}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-on-surface hover:text-primary focus:outline-none">
            <span className="material-symbols-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface-container-high border-b border-outline-variant/20 px-lg pt-sm pb-lg space-y-sm shadow-xl absolute w-full left-0 top-[100%]">
          <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-md py-sm rounded-lg text-base font-medium text-on-surface hover:bg-surface-variant hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/polls" onClick={() => setIsMobileMenuOpen(false)} className="block px-md py-sm rounded-lg text-base font-medium text-on-surface hover:bg-surface-variant hover:text-primary transition-colors">Polls <span className="bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-2">NEW</span></Link>
          <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className="block px-md py-sm rounded-lg text-base font-medium text-on-surface hover:bg-surface-variant hover:text-primary transition-colors">Analytics</Link>

          <div className="border-t border-outline-variant/20 my-sm pt-sm">
            {isAuthenticated ? (
              <>
                <Link to="/polls/create" onClick={() => setIsMobileMenuOpen(false)} className="block px-md py-sm rounded-lg text-base font-medium text-primary hover:bg-surface-variant transition-colors">Create Poll</Link>
                <button onClick={handleLogout} className="block w-full text-left px-md py-sm rounded-lg text-base font-medium text-error hover:bg-error-container hover:text-on-error-container transition-colors">Logout ({user?.username})</button>
              </>
            ) : (
              <div className="flex flex-col space-y-sm pt-sm">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center text-on-surface border border-outline-variant/50 hover:border-primary hover:text-primary transition-colors rounded-full px-md py-sm font-bold">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center text-on-primary brand-gradient rounded-full px-md py-sm font-bold shadow-lg">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
