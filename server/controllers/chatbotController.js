import { generateChatbotResponse } from '../config/geminiConfig.js';
import Conversation from '../models/conversationModel.js';
import User from '../models/userModel.js';

// Helper function for basic sentiment analysis
const analyzeSentiment = (text) => {
  const positiveWords = ['happy', 'joy', 'excited', 'great', 'good', 'well', 'positive'];
  const negativeWords = ['stress', 'stressed', 'anxious', 'worried', 'bad', 'tired', 'overwhelmed'];
  
  let score = 0;
  const words = text.toLowerCase().split(/\s+/);
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 0.1;
    if (negativeWords.includes(word)) score -= 0.1;
  });
  
  return Math.max(-1, Math.min(1, score)); // Clamp between -1 and 1
};

// Helper function to detect NLP tags
const detectNlpTags = (text) => {
  const tags = [];
  const textLower = text.toLowerCase();
  
  if (textLower.includes('stress') || textLower.includes('stressed')) {
    tags.push('stress');
  }
  if (textLower.includes('anxious') || textLower.includes('anxiety')) {
    tags.push('anxiety');
  }
  if (textLower.includes('motivate') || textLower.includes('motivation')) {
    tags.push('motivation');
  }
  if (textLower.includes('time') || textLower.includes('schedule')) {
    tags.push('time-management');
  }
  if (textLower.includes('balance') || textLower.includes('life') || textLower.includes('work-life')) {
    tags.push('work-life-balance');
  }
  
  return tags;
};

export const processChatbotMessage = async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: "No message provided" 
      });
    }

    // Get or create conversation
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }

    // Generate response
    const chatbotResponse = await generateChatbotResponse(message);
    
    if (!chatbotResponse.success) {
      return res.status(500).json(chatbotResponse);
    }

    // Analyze the conversation
    const sentimentScore = analyzeSentiment(message);
    const nlpTags = detectNlpTags(message);

    // Add to conversation history
    conversation.messages.push({
      userMessage: message,
      botResponse: chatbotResponse.message,
      nlpTags,
      sentimentScore
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      message: chatbotResponse.message,
      sentimentScore,
      nlpTags
    });
  } catch (error) {
    console.error("Chatbot Processing Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error processing chatbot request" 
    });
  }
};

export const getConversationHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const conversation = await Conversation.findOne({ userId })
      .sort({ updatedAt: -1 })
      .limit(1);
    
    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []
      });
    }

    res.status(200).json({
      success: true,
      messages: conversation.messages
    });
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching conversation history"
    });
  }
};