import { Router, Request, Response } from 'express';
import { handleAiAssistantChat } from './aiAssistant';

export const aiChatRouter = Router();

/**
 * POST /chat or /api/ai/chat
 * Handles conversational queries for users/patients
 */
const chatHandler = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'لطفاً متن پیام یا پرسش خود را وارد نمایید.',
      });
    }

    const result = await handleAiAssistantChat(message, Array.isArray(history) ? history : []);
    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('Error in user AI assistant chat endpoint:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'خطا در برقراری ارتباط با دستیار هوشمند',
    });
  }
};

aiChatRouter.post('/chat', chatHandler);
aiChatRouter.post('/', chatHandler);

export default aiChatRouter;
