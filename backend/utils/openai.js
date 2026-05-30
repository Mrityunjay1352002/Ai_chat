// gemini model
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

/* Gemini AI */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getGeminiAPIResponse = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    console.log("AI Response:", response.text);

    return response.text || "AI did not return a response.";
  } catch (err) {
    console.log("AI Error:", err);
    return "AI request failed.";
  }
};

export default getGeminiAPIResponse;
