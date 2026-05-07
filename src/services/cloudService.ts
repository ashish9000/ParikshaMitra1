const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export const saveToCloud = async (type: 'quiz' | 'doubt' | 'news', data: any) => {
  if (!SCRIPT_URL) {
    console.warn("Google Script URL not set. Data not saved to cloud.");
    return false;
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Required for Google Scripts unless handling CORS specially
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "save",
        type,
        data,
        timestamp: new Date().toISOString()
      }),
    });
    return true;
  } catch (error) {
    console.error("Cloud Save Error:", error);
    return false;
  }
};

export const fetchNewsAPI = async () => {
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  if (!API_KEY) return null;

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("News API Error:", error);
    return null;
  }
};
