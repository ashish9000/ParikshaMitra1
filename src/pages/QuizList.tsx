import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../App.tsx';
import { Quiz } from '../types.ts';
import { getMockQuizzes } from '../services/dataService.ts';
import { Clock, BookOpen, ChevronRight, Lock, Sparkles } from 'lucide-react';

export default function QuizList() {
  const { translate, state } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    // simulate fetching
    const mock = getMockQuizzes();
    setQuizzes(category ? mock.filter(q => q.examType === category) : mock);
  }, [category]);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-black tracking-tight capitalize">
          {category || translate("All Tests", "सभी टेस्ट")}
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          {translate("Practice with top quality questions", "उच्च गुणवत्ता वाले प्रश्नों के साथ अभ्यास करें")}
        </p>
      </header>

      {/* AI Generate Section */}
      <div 
        onClick={() => navigate('/ai-hub')}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-3xl text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="animate-pulse" />
              <h3 className="font-bold">{translate("Generate custom AI Mock Test", "कस्टम AI मॉक टेस्ट बनाएं")}</h3>
            </div>
            <p className="text-white/70 text-xs font-medium">
              {translate("Practice any topic with customized AI questions.", "कस्टम AI सवालों के साथ किसी भी विषय का अभ्यास करें।")}
            </p>
          </div>
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <BookOpen className="mx-auto text-slate-300 mb-2" size={40} />
            <p className="text-slate-500 font-medium">{translate("No tests found for this category", "इस श्रेणी के लिए कोई टेस्ट नहीं मिला")}</p>
          </div>
        ) : (
          quizzes.map((quiz, idx) => (
            <Link
              key={quiz.id}
              to={(!state.isPremium && idx > 0) ? '#' : `/quiz/${quiz.id}`}
              className="block group relative overflow-hidden"
            >
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                      {quiz.examType}
                    </span>
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{quiz.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {quiz.durationMinutes} min</span>
                      <span className="flex items-center gap-1.5"><BookOpen size={14} /> {quiz.questionsCount} Ques</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {!state.isPremium && idx > 0 ? <Lock size={18} /> : <ChevronRight size={20} />}
                  </div>
                </div>
                {!state.isPremium && idx > 0 && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Lock size={12} /> {translate("Premium Link", "प्रीमियम लिंक")}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
