// Sample data fetching service
// In a real app, replace SHEET_ID with your actual Google Sheet ID
const SHEET_ID = '1X5_x-oN6mE88zT_X9U6PqL8P5kE5_x-oN6mE88zT_X9'; // Placeholder
const BASE_URL = `https://opensheet.elk.sh/${SHEET_ID}`;

export const fetchSheetData = async <T>(tabName: string): Promise<T[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${tabName}`);
    if (!response.ok) throw new Error('Failed to fetch sheet data');
    const data = await response.json();
    return data as T[];
  } catch (error) {
    console.error(`Error fetching ${tabName}:`, error);
    return [];
  }
};

// Mock data for initial development if Sheet ID is not provided
export const getMockCurrentAffairs = (): any[] => [
  {
    id: '1',
    date: new Date().toISOString(),
    titleEn: 'India launches new satellite for climate monitoring',
    titleHi: 'भारत ने जलवायु निगरानी के लिए नया उपग्रह लॉन्च किया',
    contentEn: 'ISRO successfully launched the EOS-08 satellite from Satish Dhawan Space Centre...',
    contentHi: 'इसरो ने सतीश धवन अंतरिक्ष केंद्र से EOS-08 उपग्रह का सफल प्रक्षेपण किया...',
    category: 'Science & Tech'
  },
  {
    id: '2',
    date: new Date().toISOString(),
    titleEn: 'Annual Economic Survey 2026 highlights growth targets',
    titleHi: 'वार्षिक आर्थिक सर्वेक्षण 2026 विकास लक्ष्यों पर प्रकाश डालता है',
    contentEn: 'The Ministry of Finance presented the Economic Survey, projecting a GDP growth of 7.2%...',
    contentHi: 'वित्त मंत्रालय ने आर्थिक सर्वेक्षण पेश किया, जिसमें जीडीपी विकास दर 7.2% रहने का अनुमान है...',
    category: 'Economy'
  }
];

export const getMockQuizzes = (): any[] => [
  {
    id: 'pyq_ssc_2023',
    examType: 'SSC',
    subject: 'General Awareness',
    title: 'SSC CGL 2023 Previous Year Paper',
    durationMinutes: 15,
    questionsCount: 12,
  },
  {
    id: 'pyq_upsc_2022',
    examType: 'UPSC',
    subject: 'History & Culture',
    title: 'UPSC Prelims 2022 PYQ',
    durationMinutes: 20,
    questionsCount: 10,
  },
  {
    id: 'pyq_rrb_2021',
    examType: 'Railway',
    subject: 'General Science',
    title: 'RRB NTPC 2021 Previous Paper',
    durationMinutes: 10,
    questionsCount: 10,
  },
  {
    id: 'pyq_bpsc_68',
    examType: 'Bihar Exams',
    subject: 'Bihar Special',
    title: '68th BPSC Previous Year Paper',
    durationMinutes: 25,
    questionsCount: 10,
  },
  {
    id: 'q1',
    examType: 'SSC',
    subject: 'History',
    title: 'Modern Indian History',
    durationMinutes: 10,
    questionsCount: 5,
  },
  {
    id: 'q2',
    examType: 'UPSC',
    subject: 'Polity',
    title: 'Indian Constitution & Articles',
    durationMinutes: 15,
    questionsCount: 10,
  },
  {
    id: 'q3',
    examType: 'Railway',
    subject: 'Science',
    title: 'Human Biology & Health',
    durationMinutes: 10,
    questionsCount: 5,
  },
  {
    id: 'q4',
    examType: 'Banking',
    subject: 'Math',
    title: 'Percentage & Profit Loss',
    durationMinutes: 20,
    questionsCount: 10,
  },
  {
    id: 'q5',
    examType: 'Bihar Exams',
    subject: 'GK',
    title: 'Bihar History & Geography',
    durationMinutes: 15,
    questionsCount: 10,
  }
];

export const getMockJobs = (): any[] => [
  {
    id: 'j1',
    title: 'SSC CGL 2026',
    department: 'Staff Selection Commission',
    qualification: 'Graduate',
    lastDate: '2026-06-15',
    applyLink: 'https://ssc.gov.in'
  }
];
