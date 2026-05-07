import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AppState } from './types.ts';
import Home from './pages/Home.tsx';
import QuizList from './pages/QuizList.tsx';
import QuizRunner from './pages/QuizRunner.tsx';
import CurrentAffairs from './pages/CurrentAffairs.tsx';
import JobAlerts from './pages/JobAlerts.tsx';
import Settings from './pages/Settings.tsx';
import AIHub from './pages/AIHub.tsx';
import Layout from './components/Layout.tsx';

interface AppContextType {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  translate: (en: string, hi: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('pariksha_state');
    return saved ? JSON.parse(saved) : {
      isPremium: false,
      language: 'en',
      theme: 'light'
    };
  });

  useEffect(() => {
    localStorage.setItem('pariksha_state', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const translate = (en: string, hi: string) => {
    return state.language === 'en' ? en : hi;
  };

  return (
    <AppContext.Provider value={{ state, updateState, translate }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="quizzes" element={<QuizList />} />
            <Route path="affairs" element={<CurrentAffairs />} />
            <Route path="jobs" element={<JobAlerts />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai-hub" element={<AIHub />} />
          </Route>
          <Route path="quiz/:id" element={<QuizRunner />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
