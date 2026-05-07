import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Newspaper, Bell, Settings, Languages, Sparkles } from 'lucide-react';
import { useApp } from '../App.tsx';
import { cn } from '../lib/utils.ts';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const { translate, state, updateState } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, labelEn: 'Home', labelHi: 'होम' },
    { path: '/quizzes', icon: ClipboardList, labelEn: 'Tests', labelHi: 'टेस्ट' },
    { path: '/ai-hub', icon: Sparkles, labelEn: 'AI Hub', labelHi: 'AI हब' },
    { path: '/affairs', icon: Newspaper, labelEn: 'Affairs', labelHi: 'करेंट' },
    { path: '/jobs', icon: Bell, labelEn: 'Jobs', labelHi: 'जॉब्स' },
    { path: '/settings', icon: Settings, labelEn: 'Settings', labelHi: 'सेटिंग्स' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-bottom border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <h1 className="font-bold text-lg tracking-tight">ParikshaMitra</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateState({ language: state.language === 'en' ? 'hi' : 'en' })}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Languages size={20} />
              <span className="text-xs font-medium">{state.language === 'en' ? 'हिं' : 'EN'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-lg shadow-black/10">
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                )
              }
            >
              <item.icon size={22} strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {translate(item.labelEn, item.labelHi)}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Ad Placeholder (Bottom Floating) */}
      <div className="fixed bottom-16 left-0 right-0 px-4 py-2 pointer-events-none">
        <div className="max-w-md mx-auto h-12 bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest">
           Ad Advertisement
        </div>
      </div>
    </div>
  );
}
