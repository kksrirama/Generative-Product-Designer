
import { GoogleGenAI, Modality, Type } from '@google/genai';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const imageModel = 'gemini-2.5-flash-image';
const textModel = 'gemini-2.5-flash';

/**
 * Generates an edited image based on a base image and a text prompt.
 * @param base64Image The base64 encoded string of the original image.
 * @param mimeType The MIME type of the original image.
 * @param prompt The text prompt describing the desired edits.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export async function generateEditedImage(base64Image: string, mimeType: string, prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: imageModel,
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
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error('No image data found in the Gemini response.');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image with Gemini API.');
  }
}

/**
 * Analyzes a generated image design based on the original user prompt.
 * @param base64Image The base64 encoded string of the generated image.
 * @param userPrompt The original text prompt from the user.
 * @returns A promise that resolves to an object with 'pros' and 'cons' arrays.
 */
export async function analyzeDesign(base64Image: string, userPrompt: string): Promise<{ pros: string[]; cons: string[] }> {
  const analysisPrompt = `
    As a product design expert, analyze the following product image based on the user's request.
    User's request: "${userPrompt}"
    
    Evaluate the design in the image and provide a list of its pros and cons in relation to the user's request.
    
    Your response must be a JSON object with two keys: "pros" and "cons". 
    Each key should have a value of an array of strings. Each string in the array should be a concise point.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png', // The generated image is png
            },
          },
          {
            text: analysisPrompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Positive aspects of the design based on the user prompt.',
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Potential drawbacks or areas for improvement.',
            },
          },
          required: ['pros', 'cons'],
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    
    return {
        pros: result.pros || [],
        cons: result.cons || [],
    };
  } catch (error) {
    console.error('Error analyzing design:', error);
    // Return a default error state if analysis fails
    return {
      pros: ['Analysis failed to generate.'],
      cons: ['Could not connect to the analysis service.'],
    };
  }
}
