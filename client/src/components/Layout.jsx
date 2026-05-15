import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md overflow-x-hidden transition-colors duration-300">
      {}
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0px_4px_20px_rgba(108,99,255,0.05)]">
        <nav className="flex justify-between items-center px-lg py-md max-w-container_max mx-auto">
          <div className="flex items-center gap-xl">
            <div className="flex items-center gap-xs">
              <Link to="/" className="flex items-center gap-xs">
                <img alt="Voxly Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDENCuc673xDsPZdqzUFSGVaZ3Iq2mqNM9kDx37g_J2pzjAb-U8vwoysqvqfnZNiaW2RaO3cZXEn0XTi7WH80s8ePJRxh6Wfa_Ze8g9zQEP2ferFE_JHKTXW4Kzk8wU-Gg-gu4UrRpUn5RpZoYvFztJFQbPjZRnWzDLjJKH9XS6cBntqwx_ZtemHJoJPbvb5QXUzjhG1uEvk0oRXSbcnV1Xv83mBKqmYh9wWzTnICBhIK9oGopQFp4aaSFm-ZMSshkVhNcKu1L_kfM"/>
                <span className="font-display-lg text-headline-md text-primary tracking-tighter">Voxly</span>
              </Link>
            </div>

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
              <Link to="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md cursor-pointer">Templates</Link>
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex bg-surface-container-high rounded-full p-1 cursor-pointer hidden md:flex border border-outline-variant/30">
              <div 
                onClick={() => setTheme('dark')} 
                className={`p-1 px-2 rounded-full transition-colors flex items-center justify-center ${theme === 'dark' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-sm">dark_mode</span>
              </div>
              <div 
                onClick={() => setTheme('light')} 
                className={`p-1 px-2 rounded-full transition-colors flex items-center justify-center ${theme === 'light' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-sm">light_mode</span>
              </div>
            </div>

            {user ? (
              <>
                <span className="text-on-surface-variant font-bold text-sm hidden md:inline-block">Hi, {user.name || user.username}</span>
                <button onClick={logout} className="text-on-surface-variant font-bold px-md hover:text-primary transition-colors">Logout</button>
                <Link to="/create" className="brand-gradient text-on-primary px-lg py-sm rounded-full font-bold shadow-lg active:scale-95 transition-transform inline-block">
                  Create Poll
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-on-surface-variant font-bold px-md hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="brand-gradient text-on-primary px-lg py-sm rounded-full font-bold shadow-lg active:scale-95 transition-transform inline-block">
                  Create Poll
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {}
      <main className="flex-grow w-full">
        {children}
      </main>

      {}
      <footer className="w-full py-2xl bg-surface-container-lowest border-t border-outline-variant/10 mt-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg px-lg max-w-container_max mx-auto mb-2xl">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-xs mb-lg">
              <img alt="Voxly Logo" className="h-6 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW8zYYGX64hAHH29ExweFiMcsFASfEpe5qmkUAKzZ08vUSgUupsCb_YnGqouwdx--E-lVUIKfgfYF1IwW1074WV6_Ind9oRcw_rI5IMWoiIA3AZTZQMW351n0Tfea-4oCYL29OVSy7CzR42uk_HXhbfUp6UupakzwwcNp7Q0mECs9GrOCyPhnWXpwtGztWe13MxFQToSfqCsawFixmGB-KqIxupvUQssAm8gnSD7h_NBYtnnOFvwGCzczn45yxfDOUeZhiNfLjexQ"/>
              <span className="font-display-lg text-headline-md text-primary">Voxly</span>
            </div>
            <p className="text-on-surface-variant text-body-sm mb-lg">The world's fastest real-time feedback platform for teams that value speed and intelligence.</p>
            <div className="flex gap-md">
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
              <a className="text-on-surface-variant hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">group</span></a>
            </div>
          </div>

          <div className="space-y-md">
            <h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Product</h4>
            <ul className="space-y-sm">
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">Features</Link></li>
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">Pricing</Link></li>
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">API Docs</Link></li>
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">Integrations</Link></li>
            </ul>
          </div>

          <div className="space-y-md">
            <h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-sm">
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">About</Link></li>
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">Blog</Link></li>
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">Careers</Link></li>
              <li><Link className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors" to="/">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-md col-span-2 md:col-span-1">
            <h4 className="font-bold text-on-surface uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-on-surface-variant text-body-sm mb-md">Get the latest insights on feedback and UX design.</p>
            <form className="flex flex-col gap-sm" onSubmit={(e) => e.preventDefault()}>
              <input className="bg-surface-container-high border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface" placeholder="Your email" type="email"/>
              <button className="brand-gradient text-on-primary py-sm rounded-lg font-bold">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="max-w-container_max mx-auto px-lg pt-xl border-t border-outline-variant/5 flex flex-col md:flex-row justify-between items-center gap-md">
          <p className="text-on-surface-variant text-body-sm">© 2024 Voxly AI. Real-time intelligence.</p>
          <div className="flex gap-lg">
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" to="/">Privacy Policy</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" to="/">Terms of Service</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors text-body-sm" to="/">Community</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
