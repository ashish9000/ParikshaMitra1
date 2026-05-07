import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App.tsx';
import { Quiz, Question, UserProgress } from '../types.ts';
import { ChevronLeft, ChevronRight, Timer, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils.ts';

// Mock detailed quiz data
const FULL_QUIZ_DATA: Record<string, Quiz> = {
  'q1': {
    id: 'q1',
    examType: 'SSC',
    subject: 'GK',
    title: 'Modern Indian History',
    durationMinutes: 10,
    questionsCount: 5,
    questions: [
      {
        id: '1',
        text: 'Who was the first Governor-General of Bengal?',
        options: ['Lord Clive', 'Warren Hastings', 'Lord Cornwallis', 'Lord Wellesley'],
        correctAnswer: 1,
        explanation: 'Warren Hastings was the first Governor-General of Bengal (1773-1785).'
      },
      {
        id: '1-2',
        text: 'In which year was the Indian National Congress founded?',
        options: ['1885', '1890', '1905', '1915'],
        correctAnswer: 0,
        explanation: 'The INC was founded in December 1885 by A.O. Hume.'
      },
      {
        id: '1-3',
        text: 'Who gave the slogan "Swaraj is my birthright and I shall have it"?',
        options: ['Mahatma Gandhi', 'Subhas Chandra Bose', 'Bal Gangadhar Tilak', 'Lala Lajpat Rai'],
        correctAnswer: 2,
        explanation: 'Bal Gangadhar Tilak proclaimed this slogan in 1916.'
      },
      {
        id: '1-4',
        text: 'The Jallianwala Bagh massacre took place in which city?',
        options: ['Lahore', 'Amritsar', 'Delhi', 'Lucknow'],
        correctAnswer: 1,
        explanation: 'The massacre occurred on April 13, 1919, in Amritsar, Punjab.'
      },
      {
        id: '1-5',
        text: 'Who founded the Azad Hind Fauj?',
        options: ['Jawaharlal Nehru', 'Bhagat Singh', 'Subhas Chandra Bose', 'Rash Behari Bose'],
        correctAnswer: 2,
        explanation: 'Subhas Chandra Bose revitalized the Indian National Army (Azad Hind Fauj) in Singapore in 1943.'
      }
    ]
  },
  'q2': {
    id: 'q2',
    examType: 'UPSC',
    subject: 'Polity',
    title: 'Indian Constitution & Articles',
    durationMinutes: 15,
    questionsCount: 5,
    questions: [
      {
        id: '2-1',
        text: 'Which article of the Indian Constitution deals with Right to Equality?',
        options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
        correctAnswer: 1,
        explanation: 'Article 14 guarantees equality before the law.'
      },
      {
        id: '2-2',
        text: 'The concept of "Directive Principles of State Policy" was borrowed from which country?',
        options: ['USA', 'UK', 'Ireland', 'Canada'],
        correctAnswer: 2,
        explanation: 'DPSP was inspired by the Irish Constitution.'
      },
      {
        id: '2-3',
        text: 'Who acts as the Chairman of the Rajya Sabha?',
        options: ['President', 'Prime Minister', 'Vice President', 'Speaker'],
        correctAnswer: 2,
        explanation: 'The Vice President of India is the ex-officio Chairman of the Rajya Sabha.'
      }
    ]
  },
  'q3': {
    id: 'q3',
    examType: 'Railway',
    subject: 'Science',
    title: 'Human Biology & Health',
    durationMinutes: 10,
    questionsCount: 3,
    questions: [
      {
        id: '3-1',
        text: 'Which is the largest organ in the human body?',
        options: ['Liver', 'Heart', 'Skin', 'Lungs'],
        correctAnswer: 2,
        explanation: 'The skin is the largest organ of the human body.'
      },
      {
        id: '3-2',
        text: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'],
        correctAnswer: 2,
        explanation: 'Mitochondria are known as the powerhouse of the cell.'
      }
    ]
  },
  'q5': {
    id: 'q5',
    examType: 'Bihar Exams',
    subject: 'GK',
    title: 'Bihar History & Geography',
    durationMinutes: 15,
    questionsCount: 5,
    questions: [
      {
        id: '5-1',
        text: 'Where was Lord Mahavira born?',
        options: ['Vaishali', 'Pataliputra', 'Gaya', 'Rajgir'],
        correctAnswer: 0,
        explanation: 'Lord Mahavira was born in Kundagrama, near Vaishali.'
      },
      {
        id: '5-2',
        text: 'Which is the largest river in Bihar?',
        options: ['Kosi', 'Ganges', 'Gandak', 'Son'],
        correctAnswer: 1,
        explanation: 'The Ganges is the main and largest river flowing through Bihar.'
      },
      {
        id: '5-3',
        text: 'Who was the first Chief Minister of Bihar?',
        options: ['Anugrah Narayan Sinha', 'Sri Krishna Singh', 'Harihar Singh', 'Abdul Ghafoor'],
        correctAnswer: 1,
        explanation: 'Dr. Sri Krishna Singh was the first Chief Minister of Bihar.'
      }
    ]
  }
};

export default function QuizRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translate } = useApp();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [questionsOrder, setQuestionsOrder] = useState<number[]>([]);
  
  useEffect(() => {
    if (id === 'ai-custom') {
      const saved = sessionStorage.getItem('ai_custom_quiz');
      if (saved) {
        setQuiz(JSON.parse(saved));
        const q = JSON.parse(saved) as Quiz;
        setTimeLeft(q.durationMinutes * 60);
        setQuestionsOrder([...Array(q.questions.length).keys()]);
        return;
      }
    }
    
    if (id && FULL_QUIZ_DATA[id]) {
      const q = FULL_QUIZ_DATA[id];
      setQuiz(q);
      setTimeLeft(q.durationMinutes * 60);
      setQuestionsOrder([...Array(q.questions.length).keys()]);
    } else {
      navigate('/quizzes');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished && quiz) {
      handleSubmit();
    }
  }, [timeLeft, isFinished, quiz]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optionIdx: number) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
  };

  const handleSubmit = () => {
    setIsFinished(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Save progress to local storage
    if (quiz) {
      const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ans]) => {
        return acc + (ans === quiz.questions[parseInt(qIdx)].correctAnswer ? 1 : -0.25);
      }, 0);
      
      const history: UserProgress[] = JSON.parse(localStorage.getItem('pariksha_history') || '[]');
      history.unshift({
        quizId: quiz.id,
        score: Math.max(0, parseFloat(score.toFixed(2))),
        totalQuestions: quiz.questions.length,
        timestamp: Date.now(),
        answers: Object.values(selectedAnswers)
      });
      localStorage.setItem('pariksha_history', JSON.stringify(history.slice(0, 20)));
    }
  };

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentQuestionIdx];

  if (isFinished) {
    const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => 
      ans === quiz.questions[parseInt(idx)].correctAnswer
    ).length;
    const finalScore = Math.max(0, correctCount - (Object.keys(selectedAnswers).length - correctCount) * 0.25);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500">
           <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">{translate("Quiz Completed!", "क्विज़ पूर्ण हुआ!")}</h2>
                <p className="text-slate-500 font-medium">{quiz.title}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{translate("Score", "स्कोर")}</p>
                  <p className="text-2xl font-black text-blue-600">{finalScore.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{translate("Correct", "सही")}</p>
                  <p className="text-2xl font-black text-green-600">{correctCount}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase font-black tracking-widest">{translate("Accuracy", "सटीकता")}</p>
                  <p className="text-2xl font-black text-amber-600">
                    {Math.round((correctCount / quiz.questions.length) * 100)}%
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={() => navigate('/quizzes')}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black tracking-wide hover:bg-blue-700 transition-colors"
                >
                  {translate("Back to Home", "होम पर वापस जाएं")}
                </button>
                <button 
                   className="w-full py-4 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 font-bold transition-colors"
                >
                  <History size={18} /> {translate("View Solutions", "समाधान देखें")}
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => { if(confirm(translate('Exit test?', 'टेस्ट छोड़ें?'))) navigate('/quizzes') }}
            className="p-2 -ml-2 text-slate-500"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-sm font-black tracking-tight line-clamp-1">{quiz.title}</h2>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{currentQuestionIdx + 1} / {quiz.questions.length} {translate("Questions", "प्रश्न")}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full font-mono text-sm font-bold shadow-sm border transition-colors",
            timeLeft < 60 ? "bg-red-50 text-red-600 border-red-100 animate-pulse" : "bg-slate-50 text-slate-600 border-slate-100"
          )}>
            <Timer size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-200 dark:bg-slate-800">
        <motion.div 
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIdx + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg md:text-xl font-bold leading-relaxed mb-8">
                {currentQuestion.text}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={cn(
                      "w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group",
                      selectedAnswers[currentQuestionIdx] === idx
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    <span className="font-bold flex items-center gap-4">
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs border font-black transition-colors",
                        selectedAnswers[currentQuestionIdx] === idx 
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 border-slate-200 dark:border-slate-700"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </span>
                    {selectedAnswers[currentQuestionIdx] === idx && <CheckCircle2 size={20} />}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
              <AlertCircle size={14} />
              <span>{translate("-0.25 for incorrect answer", "गलत उत्तर के लिए -0.25")}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-8 md:pb-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentQuestionIdx(i => Math.max(0, i - 1))}
            disabled={currentQuestionIdx === 0}
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={currentQuestionIdx === quiz.questions.length - 1 ? handleSubmit : () => setCurrentQuestionIdx(i => i + 1)}
            className={cn(
              "flex-1 py-4 px-6 rounded-2xl font-black tracking-wide flex items-center justify-center gap-2 transition-all",
              currentQuestionIdx === quiz.questions.length - 1
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {currentQuestionIdx === quiz.questions.length - 1 
              ? translate("Submit Test", "सबमिट करें")
              : <>{translate("Next Question", "अगला प्रश्न")} <ChevronRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
