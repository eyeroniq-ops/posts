import { GoogleGenAI, Modality, Part } from "@google/genai";
import { fileToBase64 } from './utils';

// Do not instantiate this at the top level, as it may not have the API key
// when the user has to select it via the dialog.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (
    logoFile: File, 
    referenceFile: File | null, 
    prompt: string
): Promise<string> => {
    // Initialize the Google AI client right before the call
    // to ensure the latest API key from the environment is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const base64Logo = await fileToBase64(logoFile);

    const parts: Part[] = [
        {
            inlineData: {
                data: base64Logo,
                mimeType: logoFile.type,
            },
        },
    ];

    if (referenceFile) {
        const base64Reference = await fileToBase64(referenceFile);
        parts.push({
            inlineData: {
                data: base64Reference,
                mimeType: referenceFile.type,
            },
        });
    }

    parts.push({ text: prompt });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: parts,
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }

        throw new Error("No se generó ninguna imagen en la respuesta de la API.");
    } catch (error) {
        console.error("Gemini API call failed:", error);
        // Re-throw a more user-friendly error or the original one
        throw new Error("El modelo de IA no pudo procesar la solicitud. Revisa la consola para más detalles.");
    }
};