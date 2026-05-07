import { useState, useEffect } from 'react';
import { useApp } from '../App.tsx';
import { CurrentAffair } from '../types.ts';
import { getMockCurrentAffairs } from '../services/dataService.ts';
import { Calendar, Tag, Share2, Bookmark, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function CurrentAffairs() {
  const { translate } = useApp();
  const [affairs, setAffairs] = useState<CurrentAffair[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    setAffairs(getMockCurrentAffairs());
  }, []);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {translate("Current Affairs", "करेंट अफेयर्स")}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {translate("Stay updated with daily national & international news", "राष्ट्रीय और अंतर्राष्ट्रीय समाचारों से अपडेट रहें")}
          </p>
        </div>

        {/* Categories Tab */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                  : 'text-slate-500'
              }`}
            >
              {translate(tab, tab === 'daily' ? 'दैनिक' : tab === 'weekly' ? 'साप्ताहिक' : 'मासिक')}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        {affairs.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                {item.category}
              </span>
              <div className="flex items-center gap-2 text-slate-400">
                <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"><Bookmark size={18} /></button>
                <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"><Share2 size={18} /></button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold leading-tight decoration-blue-500/30 decoration-2">
                {translate(item.titleEn, item.titleHi)}
              </h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1.5"><Tag size={14} /> {translate("Free", "फ्री")}</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
              {translate(item.contentEn, item.contentHi)}
            </p>

            <button className="w-full py-4 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest border-t border-slate-50 dark:border-slate-800 pt-4">
              {translate("Read More", "और पढ़ें")} <ExternalLink size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
