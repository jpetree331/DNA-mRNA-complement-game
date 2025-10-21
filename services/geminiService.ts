
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    console.warn("API_KEY environment variable not set. Using fallback data.");
}

const fallbackMission = "Your objective is to correctly sequence the complementary DNA strand. Accuracy and speed are critical. Good luck, scientist!";
const fallbackFact = "If you uncoiled all the DNA in your body, it would stretch from the Earth to the Sun and back over 600 times!";

export const getMissionBriefing = async (level: number): Promise<string> => {
    if (!ai) return fallbackMission;
    try {
        const prompt = `Generate a short, exciting, one-paragraph mission briefing for a DNA sequencing game. The player is at level ${level}. The theme is scientific discovery. Make it sound urgent and important, but keep it brief (2-3 sentences). Do not use markdown.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching mission briefing:", error);
        return fallbackMission;
    }
};

export const getFunFact = async (): Promise<string> => {
    if (!ai) return fallbackFact;
    try {
        const prompt = "Give me one interesting and surprising fun fact about DNA, genetics, or biology that a beginner would understand. Keep it to one or two sentences. Do not use markdown.";
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching fun fact:", error);
        return fallbackFact;
    }
};
