import { GoogleGenAI, Type } from "@google/genai";
import { AuditResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Encodes a File object to base64 string
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes an image with a specific query using Gemini 3 Pro Preview
 * Returns structured data including bounding boxes.
 */
export const analyzeAuditImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<AuditResponse> => {
  
  const systemInstruction = `
    You are an expert Visual Audit Assistant for industrial, retail, and safety inspections.
    Analyze the provided image carefully.
    Your goal is to answer the user's question about the image accurately.
    
    If the user asks to count, locate, or identify specific items (like "boxes", "helmets", "empty shelves", "hazards"),
    you MUST provide bounding boxes for those items in the response.
    
    Coordinates for bounding boxes must be integers on a scale of 0 to 1000 (ymin, xmin, ymax, xmax).
    
    Return the result strictly in JSON format matching this schema:
    {
      "answer": "A detailed text answer to the user's question.",
      "items": [
        { "label": "Short label for the item", "box_2d": [ymin, xmin, ymax, xmax] }
      ]
    }
    
    If no specific items need bounding boxes based on the query, return an empty array for "items".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  box_2d: {
                    type: Type.ARRAY,
                    items: { type: Type.INTEGER },
                    description: "ymin, xmin, ymax, xmax coordinates (0-1000)",
                  },
                },
              },
            },
          },
          propertyOrdering: ["answer", "items"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AuditResponse;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

/**
 * General chat with Gemini 3 Pro Preview
 */
export const sendChatMessage = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are a helpful AI assistant for a Visual Audit application. You help users understand audit procedures, safety regulations, and analyze text-based queries.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};
