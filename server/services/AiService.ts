import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export class AiService {
  static async getPalmReading(base64Data: string): Promise<string> {
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    };
    
    const textPart = {
      text: "Analyze this palm image based on Vedic astrology and palmistry principles. Please provide a respectful, positive, but detailed reading covering Life Line, Heart Line, Head Line, and Fate Line. Offer some insights about the user's future, career, and emotional well-being. Make it engaging, mystical yet modern, and format the output beautifully using Markdown.",
    };

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
    });

    if (!aiResponse.text) {
        throw new Error("No response from AI");
    }
    
    return aiResponse.text;
  }
}
