import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../App.tsx';
import { Quiz, Question, UserProgress } from '../types.ts';
import { ChevronLeft, ChevronRight, Timer, AlertCircle, CheckCircle2, History, Sparkles } from 'lucide-react';
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
  'pyq_ssc_2023': {
    id: 'pyq_ssc_2023',
    examType: 'SSC',
    subject: 'General Awareness',
    title: 'SSC CGL 2023 Previous Year Paper',
    durationMinutes: 15,
    questionsCount: 15,
    questions: [
      {
        id: 'ssc-pyq-1',
        text: 'The fundamental duties were incorporated in the Indian Constitution by which amendment?',
        options: ['40th Amendment', '42nd Amendment', '44th Amendment', '52nd Amendment'],
        correctAnswer: 1,
        explanation: 'The 42nd Constitutional Amendment Act of 1976 added Fundamental Duties to the Indian Constitution based on the recommendations of the Swaran Singh Committee.'
      },
      {
        id: 'ssc-pyq-2',
        text: 'Which of the following is the largest river island in the world?',
        options: ['Bhavani Island', 'Majuli Island', 'Munroe Island', 'Srirangam Island'],
        correctAnswer: 1,
        explanation: 'Majuli is a river island in the Brahmaputra River, Assam, and in 2016 it became the first island to be made a district in India.'
      },
      {
        id: 'ssc-pyq-3',
        text: 'Who was the first woman to be elected as the President of the Indian National Congress?',
        options: ['Sarojini Naidu', 'Annie Besant', 'Nellie Sengupta', 'Indira Gandhi'],
        correctAnswer: 1,
        explanation: 'Annie Besant was the first woman President of INC (1917). Sarojini Naidu was the first INDIAN woman President (1925).'
      },
      {
        id: 'ssc-pyq-4',
        text: 'Which planet is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswer: 1,
        explanation: 'Mars is known as the Red Planet due to the presence of iron oxide on its surface.'
      },
      {
        id: 'ssc-pyq-5',
        text: 'The concept of "Five Year Plans" in India was borrowed from which country?',
        options: ['USA', 'USSR', 'UK', 'Germany'],
        correctAnswer: 1,
        explanation: 'India borrowed the model of Five Year Plans from the USSR (now Russia).'
      },
      {
        id: 'ssc-pyq-6',
        text: 'Which hormone is known as the "Emergency Hormone"?',
        options: ['Insulin', 'Thyroxine', 'Adrenaline', 'Estrogen'],
        correctAnswer: 2,
        explanation: 'Adrenaline is secreted by the adrenal glands during stress or danger, preparing the body for "fight or flight".'
      },
      {
        id: 'ssc-pyq-7',
        text: 'Who wrote the book "Discovery of India"?',
        options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'B.R. Ambedkar'],
        correctAnswer: 1,
        explanation: 'The Discovery of India was written by Jawaharlal Nehru during his imprisonment at Ahmednagar Fort.'
      },
      {
        id: 'ssc-pyq-8',
        text: 'Which dance form is associated with the state of Kerala?',
        options: ['Bharatanatyam', 'Kathak', 'Kathakali', 'Kuchipudi'],
        correctAnswer: 2,
        explanation: 'Kathakali is a traditional dance-drama from Kerala.'
      },
      {
        id: 'ssc-pyq-9',
        text: 'Who is the author of "Gitanjali"?',
        options: ['Bankim Chandra Chatterjee', 'Rabindranath Tagore', 'Sarojini Naidu', 'Premchand'],
        correctAnswer: 1,
        explanation: 'Gitanjali is a collection of poems by Rabindranath Tagore, for which he won the Nobel Prize in Literature.'
      },
      {
        id: 'ssc-pyq-10',
        text: 'Which vitamin is synthesized in our body with the help of sunlight?',
        options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
        correctAnswer: 3,
        explanation: 'Vitamin D is produced in the skin when it is exposed to sunlight.'
      },
      {
        id: 'ssc-pyq-11',
        text: 'The dance "Kathak" is associated with which state?',
        options: ['Tamil Nadu', 'Uttar Pradesh', 'Kerala', 'Odisha'],
        correctAnswer: 1,
        explanation: 'Kathak is one of the eight major forms of Indian classical dance, originating from Uttar Pradesh.'
      },
      {
        id: 'ssc-pyq-12',
        text: 'Which is the largest bone in the human body?',
        options: ['Skull', 'Femur', 'Humerus', 'Tibia'],
        correctAnswer: 1,
        explanation: 'The femur (thigh bone) is the longest and strongest bone in the human body.'
      }
    ]
  },
  'pyq_upsc_2022': {
    id: 'pyq_upsc_2022',
    examType: 'UPSC',
    subject: 'History',
    title: 'UPSC Prelims 2022 PYQ',
    durationMinutes: 20,
    questionsCount: 15,
    questions: [
      {
        id: 'upsc-pyq-1',
        text: 'With reference to Indian history, who of the following were known as "Kulah-Daran"?',
        options: ['Arab merchants', 'Qalandars', 'Persian calligraphists', 'Sayyids'],
        correctAnswer: 3,
        explanation: 'The Sayyids were known as "Kulah-Daran" (cap-wearers) during the Delhi Sultanate because they wore pointed caps.'
      },
      {
        id: 'upsc-pyq-2',
        text: 'Consider the following pairs of Site vs State: 1. Rakhigarhi - Haryana, 2. Dholavira - Gujarat, 3. Kalibangan - Rajasthan. Which are correct?',
        options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
        correctAnswer: 3,
        explanation: 'All pairs are correctly matched Indus Valley Civilization sites.'
      },
      {
        id: 'upsc-pyq-3',
        text: 'Which one of the following statement best describes the role of B cells and T cells in the human body?',
        options: ['They protect the body from environmental allergens.', 'They alleviate the body\'s pain and inflammation.', 'They act as immunosuppressants in the body.', 'They protect the body from the diseases caused by pathogens.'],
        correctAnswer: 3,
        explanation: 'B cells and T cells are key components of the adaptive immune system that fight pathogens.'
      },
      {
        id: 'upsc-pyq-4',
        text: 'With reference to the "Sixth Assessment Report" recently in news, consider the following: It is released by?',
        options: ['World Meteorological Organization', 'International Union for Conservation of Nature', 'Intergovernmental Panel on Climate Change (IPCC)', 'United Nations Environment Programme'],
        correctAnswer: 2,
        explanation: 'The Assessment Reports on climate change are released by the IPCC.'
      },
      {
        id: 'upsc-pyq-5',
        text: 'In the northern hemisphere, the longest day of the year normally occurs in the:',
        options: ['First half of the month of June', 'Second half of the month of June', 'First half of the month of July', 'Second half of the month of July'],
        correctAnswer: 1,
        explanation: 'The Summer Solstice, usually June 21st, is the longest day in the Northern Hemisphere.'
      },
      {
        id: 'upsc-pyq-6',
        text: 'The term "Levant" often heard in the news roughly corresponds to which region?',
        options: ['Region along the eastern Mediterranean shores', 'Region along North African shores', 'Region along Persian Gulf', 'Region along Red Sea'],
        correctAnswer: 0,
        explanation: 'The Levant is an approximate historical geographical term referring to a large area in the Eastern Mediterranean.'
      },
      {
        id: 'upsc-pyq-7',
        text: '"West African States", which of the following is not a member of G5 Sahel?',
        options: ['Burkina Faso', 'Chad', 'Mali', 'Nigeria'],
        correctAnswer: 3,
        explanation: 'Nigeria is not a member of the G5 Sahel (Burkina Faso, Chad, Mali, Mauritania, and Niger).'
      },
      {
        id: 'upsc-pyq-8',
        text: 'The "Kalamkari" painting refers to:',
        options: ['A hand-painted cotton textile in South India', 'A handmade drawing on bamboo handicrafts in North-East India', 'A block-painted woolen cloth in Western Himalayan region', 'A hand-painted decorative silk cloth in North-Western India'],
        correctAnswer: 0,
        explanation: 'Kalamkari is a type of hand-painted or block-printed cotton textile, produced in Isfahan and Indian states of Andhra Pradesh and Telangana.'
      },
      {
        id: 'upsc-pyq-9',
        text: 'Which of the following is the most logic-based reason for the adoption of a "federal" system in India?',
        options: ['Vast size of the country', 'Regional diversity', 'Recommendation of Britishers', 'To facilitate administrative convenience'],
        correctAnswer: 1,
        explanation: 'The federal system was adopted primarily to accommodate the immense regional, linguistic, and cultural diversity of India.'
      },
      {
        id: 'upsc-pyq-10',
        text: 'India is a member of which of the following? 1. Asian Infrastructure Investment Bank, 2. Missile Technology Control Regime, 3. Shanghai Cooperation Organization.',
        options: ['1 and 2 only', '3 only', '2 and 3 only', '1, 2 and 3'],
        correctAnswer: 3,
        explanation: 'India is a member of all three organizations.'
      }
    ]
  },
  'pyq_rrb_2021': {
    id: 'pyq_rrb_2021',
    examType: 'Railway',
    subject: 'General Science',
    title: 'RRB NTPC 2021 Previous Paper',
    durationMinutes: 10,
    questionsCount: 10,
    questions: [
      {
        id: 'rrb-pyq-1',
        text: 'What is the SI unit of electric current?',
        options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
        correctAnswer: 1,
        explanation: 'The SI unit of electric current is the Ampere (A).'
      },
      {
        id: 'rrb-pyq-2',
        text: 'Which part of the human brain is responsible for maintaining balance and posture?',
        options: ['Cerebrum', 'Cerebellum', 'Medulla', 'Thalamus'],
        correctAnswer: 1,
        explanation: 'The cerebellum is the part of the brain that coordinates muscular activity and maintains balance.'
      },
      {
        id: 'rrb-pyq-3',
        text: 'The chemical name of Baking Soda is:',
        options: ['Sodium Carbonate', 'Sodium Bicarbonate', 'Calcium Chloride', 'Sodium Hydroxide'],
        correctAnswer: 1,
        explanation: 'Baking soda is Sodium Bicarbonate (NaHCO3).'
      },
      {
        id: 'rrb-pyq-4',
        text: 'Which gas is mostly found in the Sun?',
        options: ['Oxygen', 'Helium', 'Hydrogen', 'Nitrogen'],
        correctAnswer: 2,
        explanation: 'The Sun is composed of about 73% hydrogen and 25% helium.'
      },
      {
        id: 'rrb-pyq-5',
        text: 'Who discovered the atom?',
        options: ['Dalton', 'Rutherford', 'Thomson', 'Newton'],
        correctAnswer: 0,
        explanation: 'John Dalton is credited with the modern atomic theory.'
      },
      {
        id: 'rrb-pyq-6',
        text: 'The deficiency of Vitamin A causes:',
        options: ['Scurvy', 'Rickets', 'Night Blindness', 'Beriberi'],
        correctAnswer: 2,
        explanation: 'Vitamin A deficiency leads to Night Blindness.'
      },
      {
        id: 'rrb-pyq-7',
        text: 'What is the speed of light in vacuum?',
        options: ['3 x 10^8 m/s', '3 x 10^6 m/s', '3 x 10^10 m/s', '2 x 10^8 m/s'],
        correctAnswer: 0,
        explanation: 'The speed of light in vacuum is approximately 300,000 km/s or 3 x 10^8 m/s.'
      },
      {
        id: 'rrb-pyq-8',
        text: 'Which planet is known as the "Twin of the Earth"?',
        options: ['Mars', 'Venus', 'Uranus', 'Neptune'],
        correctAnswer: 1,
        explanation: 'Venus is often called the Earth\'s twin because they are similar in size, mass, and density.'
      },
      {
        id: 'rrb-pyq-9',
        text: 'Who was the first Indian to win a Nobel Prize?',
        options: ['C.V. Raman', 'Rabindranath Tagore', 'Hargobind Khorana', 'Mother Teresa'],
        correctAnswer: 1,
        explanation: 'Rabindranath Tagore won the Nobel Prize for Literature in 1913.'
      },
      {
        id: 'rrb-pyq-10',
        text: 'The "Silent Valley National Park" is located in which state?',
        options: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
        correctAnswer: 2,
        explanation: 'Silent Valley National Park is located in the Nilgiri Hills, Palakkad district, Kerala.'
      }
    ]
  },
  'pyq_bpsc_68': {
    id: 'pyq_bpsc_68',
    examType: 'Bihar Exams',
    subject: 'Bihar Special',
    title: '68th BPSC Previous Year Paper',
    durationMinutes: 25,
    questionsCount: 10,
    questions: [
      {
        id: 'bpsc-pyq-1',
        text: 'The first Buddhist Council was held at:',
        options: ['Pataliputra', 'Vaishali', 'Rajgriha', 'Kashmir'],
        correctAnswer: 2,
        explanation: 'The first council was held in Rajgriha at the Saptaparni cave in 483 BC.'
      },
      {
        id: 'bpsc-pyq-2',
        text: 'Who was the founder of the Nalanda University?',
        options: ['Chandragupta Maurya', 'Kumargupta I', 'Dharamapala', 'Ashoka'],
        correctAnswer: 1,
        explanation: 'Nalanda was established by the Gupta emperor Kumargupta I.'
      },
      {
        id: 'bpsc-pyq-3',
        text: 'The "Gaya session" of INC in 1922 was presided over by:',
        options: ['S.N. Banerjee', 'C.R. Das', 'Motilal Nehru', 'Rajendra Prasad'],
        correctAnswer: 1,
        explanation: 'Chittaranjan Das (C.R. Das) presided over the Gaya session of 1922.'
      },
      {
        id: 'bpsc-pyq-4',
        text: 'Which passes connect Bihar to Nepal?',
        options: ['Nathu La', 'Bara-Lacha', 'Donkia', 'None of these'],
        correctAnswer: 3,
        explanation: 'Bihar shares an open international border with Nepal, but major Himalayan passes like Nathu La are in Sikkim.'
      },
      {
        id: 'bpsc-pyq-5',
        text: 'The "Trivei Canal" gets its water from which of the following rivers?',
        options: ['Son', 'Gandak', 'Kosi', 'Kamla'],
        correctAnswer: 1,
        explanation: 'The Triveni Canal is fed by the Gandak river.'
      },
      {
        id: 'bpsc-pyq-6',
        text: 'Which district of Bihar has the highest literacy rate according to Census 2011?',
        options: ['Patna', 'Rohtas', 'Munger', 'Gaya'],
        correctAnswer: 1,
        explanation: 'Rohtas has the highest literacy rate in Bihar (73.37%).'
      },
      {
        id: 'bpsc-pyq-7',
        text: 'Who led the Salt Satyagraha in Bihar?',
        options: ['Rajendra Prasad', 'Shrikrishna Singh', 'Anugrah Narayan Sinha', 'Ambika Kant Sinha'],
        correctAnswer: 0,
        explanation: 'Dr. Rajendra Prasad and other leaders organized the salt satyagraha in Bihar in 1930.'
      },
      {
        id: 'bpsc-pyq-8',
        text: 'The "Kosi River" often called as the "Sorrow of Bihar" originates from:',
        options: ['Tibetan Plateau', 'Himalayas', 'Chotanagpur Plateau', 'Amar-Kantak'],
        correctAnswer: 1,
        explanation: 'The Kosi river originates from the Himalayas in Nepal and Tibet.'
      },
      {
        id: 'bpsc-pyq-9',
        text: 'Which sultan of Delhi shifted the capital from Delhi to Daulatabad?',
        options: ['Iltutmish', 'Alauddin Khilji', 'Muhammad bin Tughluq', 'Firoz Shah Tughluq'],
        correctAnswer: 2,
        explanation: 'Muhammad bin Tughluq shifted the capital from Delhi to Devagiri (renamed Daulatabad) in 1327.'
      },
      {
        id: 'bpsc-pyq-10',
        text: 'Who was the author of "Indica"?',
        options: ['Kautilya', 'Megasthenes', 'Pliny', 'Ptolemy'],
        correctAnswer: 1,
        explanation: 'Megasthenes, the Greek ambassador to the court of Chandragupta Maurya, wrote "Indica".'
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
      },
      {
        id: '2-4',
        text: 'Who is the guardian of Fundamental Rights in India?',
        options: ['Parliament', 'President', 'Supreme Court', 'Prime Minister'],
        correctAnswer: 2,
        explanation: 'The Supreme Court is considered the guardian and protector of the Constitution and Fundamental Rights.'
      },
      {
        id: '2-5',
        text: 'Which part of the Constitution deals with Municipalities?',
        options: ['Part IX', 'Part IX-A', 'Part X', 'Part XI'],
        correctAnswer: 1,
        explanation: 'Part IX-A was added by the 74th Amendment Act to deal with Municipalities.'
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
      },
      {
        id: '3-3',
        text: 'Which vitamin is essential for blood clotting?',
        options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'],
        correctAnswer: 3,
        explanation: 'Vitamin K is necessary for the synthesis of proteins needed for blood coagulation.'
      },
      {
        id: '3-4',
        text: 'The Universal Donor blood group is:',
        options: ['A+', 'B-', 'O-', 'AB+'],
        correctAnswer: 2,
        explanation: 'O- is the universal donor blood group.'
      },
      {
        id: '3-5',
        text: 'What is the normal blood pressure of a human being?',
        options: ['120/80 mmHg', '140/90 mmHg', '100/70 mmHg', '150/100 mmHg'],
        correctAnswer: 0,
        explanation: 'Normal blood pressure is typically around 120/80 mmHg.'
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
      },
      {
        id: '5-4',
        text: 'Which is the state bird of Bihar?',
        options: ['Parrot', 'House Sparrow', 'Koel', 'Pigeon'],
        correctAnswer: 1,
        explanation: 'The House Sparrow was declared the state bird of Bihar in 2013.'
      },
      {
        id: '5-5',
        text: 'The Valmiki National Park is located in which district of Bihar?',
        options: ['East Champaran', 'West Champaran', 'Katihar', 'Purnia'],
        correctAnswer: 1,
        explanation: 'Valmiki National Park is located in the West Champaran district of Bihar.'
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
  const [showSolutions, setShowSolutions] = useState(false);
  
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pb-20">
        <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in duration-500">
          {!showSolutions ? (
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
                  onClick={() => setShowSolutions(true)}
                  className="w-full py-4 flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors"
                >
                  <History size={18} /> {translate("View Solutions", "समाधान देखें")}
                </button>
              </div>
           </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setShowSolutions(false)}
                  className="p-2 -ml-2 text-slate-500 flex items-center gap-2 font-bold"
                >
                  <ChevronLeft size={24} /> {translate("Back to Result", "परिणाम पर वापस जाएं")}
                </button>
                <h2 className="text-xl font-black tracking-tight">{translate("Solutions", "समाधान")}</h2>
              </div>
              
              <div className="space-y-4">
                {quiz.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black border border-slate-200 dark:border-slate-700 uppercase">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-sm leading-relaxed">{q.text}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.correctAnswer;
                        const isSelected = selectedAnswers[idx] === optIdx;
                        return (
                          <div 
                            key={optIdx}
                            className={cn(
                              "p-3 rounded-xl border text-sm flex items-center justify-between",
                              isCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-bold" :
                              isSelected ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" :
                              "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                            )}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 size={16} />}
                            {!isCorrect && isSelected && <AlertCircle size={16} />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                      <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <Sparkles size={12} /> {translate("Explanation", "व्याख्या")}
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">{q.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/quizzes')}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black tracking-wide hover:bg-blue-700 transition-colors shadow-lg"
              >
                {translate("Return Home", "होम पर लौटें")}
              </button>
            </div>
          )}
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
