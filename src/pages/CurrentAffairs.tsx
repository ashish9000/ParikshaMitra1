import { useState, useEffect } from 'react';
import { useApp } from '../App.tsx';
import { CurrentAffair } from '../types.ts';
import { getMockCurrentAffairs } from '../services/dataService.ts';
import { Calendar, Tag, Share2, Bookmark, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { summarizeCurrentAffairs } from '../services/geminiService.ts';

export default function CurrentAffairs() {
  const { translate } = useApp();
  const [affairs, setAffairs] = useState<CurrentAffair[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setAffairs(getMockCurrentAffairs());
  }, []);

  const handleSummarize = async (id: string, text: string) => {
    if (summaries[id]) return;
    setLoadingIds(prev => new Set(prev).add(id));
    const summary = await summarizeCurrentAffairs(text);
    if (summary) {
      setSummaries(prev => ({ ...prev, [id]: summary }));
    }
    setLoadingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

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

            <AnimatePresence>
              {summaries[item.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl text-xs leading-relaxed text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
                >
                  <div className="flex items-center gap-2 font-black mb-2 uppercase tracking-widest text-[10px]">
                    <Sparkles size={12} /> {translate("AI Highlights", "AI मुख्य अंश")}
                  </div>
                  <div className="whitespace-pre-wrap">{summaries[item.id]}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-2 border-t border-slate-50 dark:border-slate-800 pt-4">
              <button 
                onClick={() => handleSummarize(item.id, item.contentEn)}
                className="flex-1 py-3 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
              >
                {loadingIds.has(item.id) ? <Loader2 className="animate-spin" size={14} /> : <><Sparkles size={14} /> {translate("AI Highlight", "AI मुख्य अंश")}</>}
              </button>
              <button className="flex-1 py-3 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest border border-slate-100 dark:border-slate-800 rounded-xl">
                {translate("Read More", "और पढ़ें")} <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
