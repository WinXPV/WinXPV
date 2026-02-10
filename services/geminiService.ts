
import { GoogleGenAI, Type } from "@google/genai";
import { CountryDetails } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchCountryDetails = async (countryName: string): Promise<CountryDetails> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide detailed information about the country "${countryName}" in Bengali. Include approximate current data. 
    For the "bdtExchangeRate" field, provide a single string that includes both:
    1. The approximate value of 1 unit of their local currency in Bangladeshi Taka (BDT).
    2. The approximate value of 1 US Dollar (USD) in their local currency units.
    Example format: "১ [Local Currency] = [X] টাকা (১ ডলার = [Y] [Local Currency])"
    
    For the "isoCode" field, strictly provide both the ISO Alpha-2 and Alpha-3 codes separated by a slash, for example: "BD/BGD" for Bangladesh.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          continent: { type: Type.STRING },
          capital: { type: Type.STRING },
          language: { type: Type.STRING },
          population: { type: Type.STRING },
          religion: { type: Type.STRING },
          area: { type: Type.STRING },
          currency: { type: Type.STRING },
          bdtExchangeRate: { type: Type.STRING },
          isoCode: { type: Type.STRING, description: "Format: Alpha-2/Alpha-3 (e.g. BD/BGD)" },
          dialingCode: { type: Type.STRING },
          history: { type: Type.STRING }
        },
        required: [
          "name", "continent", "capital", "language", "population", 
          "religion", "area", "currency", "bdtExchangeRate", 
          "isoCode", "dialingCode", "history"
        ]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No data received from AI");
  return JSON.parse(text) as CountryDetails;
};
