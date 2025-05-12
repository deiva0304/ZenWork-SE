import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { 
  processChatbotMessage,
  getConversationHistory,
} from '../controllers/chatbotController.js';

const chatbotRouter = express.Router();

chatbotRouter.post('/chat', userAuth, processChatbotMessage);
chatbotRouter.get('/history', userAuth, getConversationHistory);

export default chatbotRouter;
