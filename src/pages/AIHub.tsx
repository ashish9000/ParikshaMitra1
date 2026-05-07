import { useState, useRef } from 'react';
import { useApp } from '../App.tsx';
import { Sparkles, Send, BookOpen, BrainCircuit, History, ArrowRight, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { solveDoubt, generateQuizQuestions } from '../services/geminiService.ts';
import { saveToCloud } from '../services/cloudService.ts';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function AIHub() {
  const { translate } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ask' | 'generate'>('ask');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAsk = async () => {
    if (!input.trim() && !selectedImage) return;
    setLoading(true);
    const res = await solveDoubt(input, selectedImage ? { inlineData: selectedImage } : undefined);
    setResponse(res || null);
    
    // Save to Cloud
    if (res) {
      await saveToCloud('doubt', { 
        question: input, 
        hasImage: !!selectedImage,
        answer: res 
      });
    }
    
    setLoading(false);
  };

  const handleGenerateTest = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const questions = await generateQuizQuestions(input, 10);
    if (questions.length > 0) {
      // Save to Cloud
      await saveToCloud('quiz', {
        topic: input,
        questionsCount: questions.length,
        questions
      });

      // Temporarily store in session for the runner to pick up
      const customQuiz = {
        id: 'ai-custom',
        title: `AI Test: ${input}`,
        examType: 'General',
        subject: input,
        durationMinutes: 10,
        questionsCount: questions.length,
        questions
      };
      sessionStorage.setItem('ai_custom_quiz', JSON.stringify(customQuiz));
      navigate('/quiz/ai-custom');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <header className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white overflow-hidden shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="animate-pulse" size={24} />
            </div>
            <h2 className="text-2xl font-black">{translate("AI Study Mate", "AI स्टडी मेट")}</h2>
          </div>
          <p className="text-white/80 text-sm font-medium">
            {translate("Your personal 24x7 tutor for exam prep.", "परीक्षा की तैयारी के लिए आपका व्यक्तिगत 24x7 ट्यूटर।")}
          </p>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit size={120} />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('ask')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'ask' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
              : 'text-slate-500'
          }`}
        >
          {translate("Ask Anything", "कुछ भी पूछें")}
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'generate' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
              : 'text-slate-500'
          }`}
        >
          {translate("Generate Test", "टेस्ट बनाएं")}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {activeTab === 'ask' ? translate("Enter Topic or Doubt", "विषय या संदेह दर्ज करें") : translate("Enter Topic for Test", "टेस्ट के लिए विषय दर्ज करें")}
          </label>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeTab === 'ask' 
                ? translate("Explain the cause of Sepoy Mutiny 1857 or upload a photo of your question...", "1857 के विद्रोह के कारणों की व्याख्या करें या अपने प्रश्न का फोटो अपलोड करें...") 
                : translate("Indian Economy 2024, Science & Tech, Current Affairs...", "भारतीय अर्थव्यवस्था 2024, विज्ञान और तकनीक...")}
              className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm min-h-[120px] resize-none"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {activeTab === 'ask' && (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl shadow-lg transition-transform active:scale-95 border border-slate-100 dark:border-slate-800"
                  >
                    <ImageIcon size={20} />
                  </button>
                </>
              )}
              <button
                onClick={activeTab === 'ask' ? handleAsk : handleGenerateTest}
                disabled={loading || (!input.trim() && !selectedImage)}
                className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg disabled:opacity-50 transition-transform active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {selectedImage && activeTab === 'ask' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative inline-block mt-2"
              >
                <img 
                  src={`data:${selectedImage.mimeType};base64,${selectedImage.data}`} 
                  alt="Selected" 
                  className="w-24 h-24 object-cover rounded-xl border-2 border-indigo-500"
                />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-800"
            >
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                <BrainCircuit size={14} /> {translate("AI Response", "AI प्रतिक्रिया")}
              </div>
              <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-2xl whitespace-pre-wrap">
                {response}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-slate-400"><History size={16} /></div>
            <p className="text-[10px] font-black uppercase text-slate-500">{translate("Recent", "हाल के")}</p>
            <p className="text-xs font-bold truncate">{translate("Budget 2024", "बजट 2024")}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl space-y-1">
            <div className="text-slate-400"><BookOpen size={16} /></div>
            <p className="text-[10px] font-black uppercase text-slate-500">{translate("Saved", "सेव किया")}</p>
            <p className="text-xs font-bold truncate">{translate("History PYQ", "इतिहास PYQ")}</p>
          </div>
        </div>
      </div>

      {/* Suggested Topics */}
      <section className="space-y-3">
        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 px-2">{translate("Trending Topics", "ट्रेंडिंग टॉपिक्स")}</h3>
        <div className="flex flex-wrap gap-2">
          {["Article 370", "AI in India", "Monetary Policy", "Sustainable Goals"].map((topic) => (
            <button
              key={topic}
              onClick={() => setInput(topic)}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-bold hover:border-indigo-500 transition-all flex items-center gap-2"
            >
              {topic} <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
