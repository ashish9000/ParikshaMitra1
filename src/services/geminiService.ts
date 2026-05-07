import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

export const generateQuizQuestions = async (topic: string, count: number = 5) => {
  try {
    const prompt = `Generate a JSON array of ${count} multiple-choice questions for the topic: "${topic}". Each question should have: "text", "options" (array of 4 strings), "correctAnswer" (0-3 index), and "explanation". Format: [{"text": "...", "options": ["...", "..."], "correctAnswer": 0, "explanation": "..."}]`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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

export const solveDoubt = async (question: string, imageData?: { inlineData: { data: string, mimeType: string } }) => {
  try {
    const contents = [
      `You are an expert Indian competitive exam tutor. Solve this doubt clearly and concisely for an aspirant. ${question ? `Question: "${question}"` : "Please solve the question shown in the image."}`
    ];

    if (imageData) {
      contents.push(imageData as any);
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });
    return response.text;
  } catch (error) {
    console.error("Error solving doubt:", error);
    return "Failed to get AI response. Please try again.";
  }
};

export const summarizeCurrentAffairs = async (newsText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a structured summary of this news for a competitive exam student in bullet points. Include "Key Facts", "Organization Involved", and "Potential Exam Question Context": "${newsText}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing news:", error);
    return null;
  }
};
