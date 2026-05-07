export type ExamCategory = 'SSC' | 'UPSC' | 'Railway' | 'Banking' | 'State Exams' | 'Bihar Exams';

export interface Quiz {
  id: string;
  examType: ExamCategory;
  subject: string;
  title: string;
  durationMinutes: number;
  questionsCount: number;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation?: string;
}

export interface CurrentAffair {
  id: string;
  date: string;
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  category: string;
  imageUrl?: string;
  pdfUrl?: string;
}

export interface JobAlert {
  id: string;
  title: string;
  department: string;
  qualification: '10th' | '12th' | 'Graduate' | 'Post Graduate';
  lastDate: string;
  applyLink: string;
  officialSite?: string;
}

export interface UserProgress {
  quizId: string;
  score: number;
  totalQuestions: number;
  timestamp: number;
  answers: number[];
}

export interface AppState {
  isPremium: boolean;
  language: 'hi' | 'en';
  theme: 'light' | 'dark';
}
