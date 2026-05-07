import { useApp } from '../App.tsx';
import { Moon, Sun, Languages, Star, RefreshCw, LogOut, ShieldCheck, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils.ts';

export default function Settings() {
  const { state, updateState, translate } = useApp();

  const handleReset = () => {
    if (confirm(translate('Reset all progress and data?', 'सभी प्रगति और डेटा रीसेट करें?'))) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handlePremiumToggle = () => {
    updateState({ isPremium: !state.isPremium });
  };

  const menuItems = [
    {
      title: translate('Account Settings', 'खाता सेटिंग'),
      items: [
        { 
          label: translate('Language', 'भाषा'), 
          icon: Languages, 
          value: state.language === 'en' ? 'English' : 'हिन्दी',
          action: () => updateState({ language: state.language === 'en' ? 'hi' : 'en' })
        },
        { 
          label: translate('Dark Mode', 'डार्क मोड'), 
          icon: state.theme === 'dark' ? Moon : Sun,
          toggle: true,
          active: state.theme === 'dark',
          action: () => updateState({ theme: state.theme === 'dark' ? 'light' : 'dark' })
        },
      ]
    },
    {
      title: translate('Membership', 'सदस्यता'),
      items: [
        { 
          label: translate('Upgrade to Premium', 'प्रीमियम में अपग्रेड करें'), 
          icon: Star, 
          highlight: true,
          value: state.isPremium ? translate('Active', 'सक्रिय') : translate('Get Started', 'शुरू करें'),
          action: handlePremiumToggle
        },
      ]
    },
    {
      title: translate('Support & Security', 'सहायता और सुरक्षा'),
      items: [
        { label: translate('Help Center', 'सहायता केंद्र'), icon: HelpCircle },
        { label: translate('Privacy Policy', 'गोपनीयता नीति'), icon: ShieldCheck },
        { label: translate('Reset App Data', 'डेटा रीसेट करें'), icon: RefreshCw, action: handleReset, danger: true },
        { label: translate('Logout', 'लॉगआउट'), icon: LogOut, danger: true },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* Profile Section */}
      <section className="flex flex-col items-center text-center space-y-4 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-black text-3xl">
            S
          </div>
          {state.isPremium && (
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-amber-500 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center text-white">
              <Star size={14} fill="currentColor" />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Shishir Gupta</h2>
          <p className="text-slate-500 text-sm font-medium">shishgupt9000@gmail.com</p>
        </div>
      </section>

      {/* Menu Sections */}
      <div className="space-y-8">
        {menuItems.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {section.title}
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              {section.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  onClick={item.action}
                  className={cn(
                    "w-full flex items-center justify-between p-4 transition-colors border-b last:border-0 border-slate-50 dark:border-slate-800/50",
                    item.danger ? "text-red-500" : "text-slate-700 dark:text-slate-200",
                    item.highlight && !state.isPremium ? "bg-amber-50/50 dark:bg-amber-900/10" : ""
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      item.highlight ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-slate-50 dark:bg-slate-800 text-slate-500"
                    )}>
                      <item.icon size={20} />
                    </div>
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {item.value && (
                      <span className={cn(
                        "text-xs font-black uppercase tracking-wider",
                        item.highlight ? "text-amber-600 dark:text-amber-400" : "text-slate-400"
                      )}>
                        {item.value}
                      </span>
                    )}
                    {item.toggle !== undefined && (
                       <div className={cn(
                         "w-10 h-6 rounded-full transition-all flex items-center p-1",
                         item.active ? "bg-blue-600 justify-end" : "bg-slate-200 dark:bg-slate-700 justify-start"
                       )}>
                         <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                       </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App Version */}
      <div className="text-center space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ParikshaMitra v1.0.0</p>
        <p className="text-[10px] font-medium text-slate-300">Handcrafted for Indian Students</p>
      </div>
    </div>
  );
}
