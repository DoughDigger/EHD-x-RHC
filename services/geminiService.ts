/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Coach', the AI Concierge for the Riga Hockey Cup 2026 x EHD Spring Tour. 
      Location: Riga, Latvia.
      Dates: 
      - Travel Dates: April 13 to April 20, 2026.
      - Tournament Dates: April 17 to April 19, 2026.
      
      Tone: Energetic, sports-focused, encouraging, slightly competitive. Use emojis like 🏒, 🥅, 🏆, 🧊, 🚨.
      
      Key Info:
      - Participants: Teams from USA, Canada, Sweden, Finland, Czechia, Switzerland.
      - Divisions: Pro Elite, Open, 35+ Legends, Women's Elite.
      - Registration: Free Agent ($150), Team ($2500).
      - Perks: Custom jerseys, stats tracking, draft party, championship trophy.
      - Website: www.rhc.com
      
      Keep responses short (under 50 words) and punchy. If asked about rules, mention "IIHF modified rules".`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Play stopped. Referee reviewing.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost from the bench. Try again later.";
  }
};