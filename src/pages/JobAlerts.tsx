import { useState, useEffect } from 'react';
import { useApp } from '../App.tsx';
import { JobAlert } from '../types.ts';
import { getMockJobs } from '../services/dataService.ts';
import { BellRing, Briefcase, GraduationCap, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function JobAlerts() {
  const { translate } = useApp();
  const [jobs, setJobs] = useState<JobAlert[]>([]);

  useEffect(() => {
    setJobs(getMockJobs());
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {translate("Job Alerts", "जॉब अलर्ट")}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {translate("Latest government job notifications", "नवीनतम सरकारी नौकरी की सूचनाएं")}
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center animate-bounce">
          <BellRing size={24} />
        </div>
      </header>

      <div className="grid gap-6">
        {jobs.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Briefcase size={80} className="mx-auto" />
            <p className="mt-4 font-black uppercase tracking-widest">{translate("No New Alerts", "कोई नया अलर्ट नहीं")}</p>
          </div>
        ) : (
          jobs.map((job, idx) => (
             <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {job.title.charAt(0)}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{translate("Last Date", "अंतिम तिथि")}</span>
                    <span className="text-sm font-bold text-red-500">{new Date(job.lastDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight group-hover:text-blue-600 transition-colors">{job.title}</h3>
                  <p className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                    <Briefcase size={14} /> {job.department}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                     <GraduationCap size={14} /> {job.qualification}
                   </div>
                   <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 text-[11px] font-bold text-orange-600 uppercase tracking-wide">
                     <Calendar size={14} /> {translate("Active", "सक्रिय")}
                   </div>
                </div>

                <button 
                  onClick={() => window.open(job.applyLink, '_blank')}
                  className="w-full mt-4 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black tracking-wide flex items-center justify-center gap-2 group-hover:bg-blue-700 transition-all shadow-lg"
                >
                  {translate("Apply Now", "अभी आवेदन करें")} <ArrowRight size={18} />
                </button>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{translate("Verify Official Notification", "आधिकारिक अधिसूचना जांचें")}</span>
                 <ExternalLink size={12} className="text-slate-400" />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Subscription Card */}
      <section className="bg-blue-600 rounded-3xl p-8 text-white space-y-4">
        <h3 className="text-xl font-black leading-tight">{translate("Never miss an update!", "कोई भी अपडेट न छोड़ें!")}</h3>
        <p className="text-blue-100/70 text-sm">{translate("Join 50k+ students getting daily job alerts on WhatsApp.", "व्हाट्सएप पर दैनिक जॉब अलर्ट प्राप्त करने वाले 50k+ छात्रों में शामिल हों।")}</p>
        <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm transition-colors flex items-center gap-2 shadow-lg">
          Join WhatsApp Channel
        </button>
      </section>
    </div>
  );
}
