import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

export const generateQuizQuestions = async (topic: string, count: number = 5, language: string = 'en') => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment.");
    return [];
  }

  try {
    const langMsg = language === 'hi' ? "Provide all text IN HINDI." : "Provide all text in English.";
    const prompt = `Generate a JSON array of ${count} multiple-choice questions for the topic: "${topic}". ${langMsg} Each question should have: "text", "options" (array of 4 strings), "correctAnswer" (0-3 index), and "explanation". Format: [{"text": "...", "options": ["...", "..."], "correctAnswer": 0, "explanation": "..."}]`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const solveDoubt = async (question: string, imageData?: { inlineData: { data: string, mimeType: string } }, language: string = 'en') => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment.");
    return "AI configuration error. Please check API key.";
  }
  
  try {
    const parts: any[] = [];
    const langMsg = language === 'hi' ? "PLEASE RESPOND IN HINDI LANGUAGE ONLY." : "Please respond in English.";
    parts.push({ text: `You are an expert Indian competitive exam tutor. Solve this doubt clearly and concisely for an aspirant. ${langMsg} ${question ? `Question: "${question}"` : "Please solve the question shown in the image."}` });

    if (imageData) {
      parts.push(imageData);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
    });
    return response.text;
  } catch (error) {
    console.error("Error solving doubt:", error);
    return "Failed to get AI response. Please try again.";
  }
};

export const summarizeCurrentAffairs = async (newsText: string) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not defined in environment.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [{ text: `Provide a structured summary of this news for a competitive exam student in bullet points. Include "Key Facts", "Organization Involved", and "Potential Exam Question Context": "${newsText}"` }] },
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing news:", error);
    return null;
  }
};
