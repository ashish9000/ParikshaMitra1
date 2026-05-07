import { useApp } from '../App.tsx';
import { ExamCategory } from '../types.ts';
import { GraduationCap, Landmark, Train, Landmark as Bank, BookOpen, Map, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils.ts';

const EXAM_CATEGORIES: { id: ExamCategory; en: string; hi: string; icon: any; color: string }[] = [
  { id: 'SSC', en: 'SSC CGL/CHSL', hi: 'एसएससी सीजीएल', icon: GraduationCap, color: 'bg-blue-500' },
  { id: 'UPSC', en: 'UPSC Civil Services', hi: 'यूपीएससी', icon: Landmark, color: 'bg-indigo-600' },
  { id: 'Railway', en: 'RRB NTPC/Group D', hi: 'रेलवे परीक्षा', icon: Train, color: 'bg-red-500' },
  { id: 'Banking', en: 'IBPS/SBI PO', hi: 'बैंकिंग', icon: Bank, color: 'bg-green-600' },
  { id: 'State Exams', en: 'State PCS', hi: 'राज्य पीसीएस', icon: Map, color: 'bg-amber-600' },
  { id: 'Bihar Exams', en: 'BPSC/Bihar SSC', hi: 'बिहार परीक्षा', icon: BookOpen, color: 'bg-orange-500' },
];

export default function Home() {
  const { translate } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder={translate("Search exams, notes, PDFs...", "परीक्षा, नोट्स, पीडीएफ खोजें...")}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-xl shadow-blue-500/20">
        <div className="relative z-10 max-w-lg space-y-2">
          <h2 className="text-2xl font-black leading-tight italic">
            {translate("Crack Your Dream Exam!", "अपने सपनों की परीक्षा पास करें!")}
          </h2>
          <p className="text-blue-100/80 text-sm font-medium">
            {translate("Get access to 5000+ mock tests and previous year papers.", "5000+ मॉक टेस्ट और पिछले वर्ष के प्रश्न पत्रों तक पहुंच प्राप्त करें।")}
          </p>
          <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors">
            {translate("Start Practice", "अभ्यास शुरू करें")}
          </button>
        </div>
        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-10 translate-y-1/2 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
      </section>

      {/* Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-xl tracking-tight">
            {translate("Exam Categories", "परीक्षा श्रेणियां")}
          </h3>
          <button className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            {translate("See All", "सभी देखें")}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {EXAM_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                to={`/quizzes?category=${category.id}`}
                className="block h-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-inner", category.color)}>
                  <category.icon size={20} />
                </div>
                <h4 className="font-bold text-sm leading-tight group-hover:text-blue-600 transition-colors">
                  {translate(category.en, category.hi)}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  120+ {translate("Tests", "टेस्ट")}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-3xl space-y-4">
        <h3 className="font-black text-lg tracking-tight">
          {translate("Quick Links", "त्वरित लिंक")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { en: 'Mock Tests', hi: 'मॉक टेस्ट', color: 'border-orange-200 text-orange-700' },
            { en: 'PYQ papers', hi: 'पुराने पेपर', color: 'border-purple-200 text-purple-700' },
            { en: 'Current Affairs', hi: 'करेंट अफेयर्स', color: 'border-emerald-200 text-emerald-700' },
            { en: 'Job Alerts', hi: 'जॉब अलर्ट', color: 'border-blue-200 text-blue-700' },
          ].map((link, idx) => (
            <div key={idx} className={cn("bg-white dark:bg-slate-900 border-2 rounded-xl p-3 flex flex-col gap-1 items-center justify-center text-center", link.color)}>
              <span className="font-black text-sm">{translate(link.en, link.hi)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
