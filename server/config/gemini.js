import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client with error handling
let genAI;
try {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('Gemini client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Gemini client:', error);
    process.exit(1);
}

export { genAI };