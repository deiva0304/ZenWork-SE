import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateChatbotResponse = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.6,  // Slightly lower for more structured responses
        topP: 0.9,
        topK: 40
      },
    });

    const prompt = {
      contents: [{
        parts: [{ text: `
          You are a workplace wellness coach specializing in Neuro-Linguistic Programming (NLP). 
          Respond to workplace concerns using these NLP techniques:
          
          1. RAPPORT BUILDING:
          - Match the user's language style
          - Use "we" statements for collaboration
          - Mirror their concerns with validation
          
          2. LANGUAGE PATTERNS:
          - Apply Milton Model language (artfully vague)
          - Use positive presuppositions
          - Employ embedded commands
          
          3. NLP INTERVENTIONS:
          - Reframing perspectives
          - Anchoring positive states
          - Submodality shifts
          - Timeline therapy concepts
          
          4. PRACTICAL OUTPUT:
          - Provide 1 NLP exercise they can do now
          - Suggest 1 language pattern to use in their situation
          - Offer 1 workplace reframe
          
          Current workplace concern: "${userInput}"
          
          Structure your response with:
          a) Emotional validation (rapport)
          b) NLP analysis of their language patterns
          c) 3 specific NLP techniques to apply
          d) Actionable workplace adaptation
        `}],
      }],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return {
      success: true,
      message: response.trim(),
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      message: "I'm having trouble responding. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

export default genAI;