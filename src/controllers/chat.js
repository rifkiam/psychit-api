// src/controllers/chat.js
import axios from 'axios';
import db from '@/database';
import * as ollama from 'ollama';
import { Sequelize } from 'sequelize';

// Function to remove the last incomplete sentence
const remlast = (str) => {
  let nstr = str.split(".");
  nstr.pop();
  return nstr.join(".") + ".";
  return nstr.replace(/\\\"/g, '"');
};

/**
 * POST /chat/start
 * Start a new chat session for the authenticated user
 */
export const startChatSession = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const { model, stream = false } = req.body;

    if (!model) {
      return res.status(400).json({ error: 'Model is a required field.' });
    }

    // search for the latest chat session with empty array '[]' to populate / preventing recreating blank arrays
    let latestEmpChatSession = await db.models.Chat.findOne({
      order: [['createdAt', 'DESC']], 
      where: {
        userId,  // add userId condition
        [Sequelize.Op.and]: Sequelize.literal(`messages::jsonb = '[]'::jsonb`)  // JSON condition for empty array
      }
    })
    if (!latestEmpChatSession || latestEmpChatSession.messages.length != 0) {
      // Create a new session with a unique sessionId
      latestEmpChatSession = await db.models.Chat.create({
        userId,
        sessionId: `session_${Date.now()}`, // Simple unique ID generation
        model,
        messages: [], // Initialize with an empty string for storing chat messages
        stream,
      });
    }

    return res.json({
      message: 'New chat session started',
      sessionId: latestEmpChatSession.sessionId,
    });
  } catch (err) {
    console.error('Error starting chat session:', err);
    return res.status(500).json({ error: 'Failed to start chat session' });
  }
};


export const handleChat = async (req, res, next) => {
  try {
    const { sessionId, messages } = req.body;
    const userId = req.user.id;
    let chatFlag = false;

    if (!sessionId || !messages ) {
      return res.status(400).json({ error: 'Session ID and messages are required, and messages must be a non-empty array.' });
    }

    // Retrieve the specified chat session
    const chatSession = await db.models.Chat.findOne({ where: { sessionId, userId } });

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Construct the prompt from current messages
    // const prompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const prompt = `${messages.role}: ${messages.content}\n`;
    // const craftedPrompt = chatSession.messages ? `${chatSession.messages}\n${prompt}` : prompt;
    const craftedPrompt2 = [...chatSession.messages, messages];

    // Send the prompt to the model and get the response
    let response = null
    
    if (chatSession.messages.length == 0) {
      console.log("generate");
      response = await ollama.default.generate({
        model: "psychIT",
        prompt,
      });
    }
    else {
      console.log("chat");
      chatFlag = true;
      response = await ollama.default.chat({
        model: "psychIT",
        messages: craftedPrompt2
      });
    }

    delete response.context;
    delete response.done;
    delete response.done_reason;
    delete response.total_duration;
    delete response.load_duration;
    delete response.prompt_eval_count;
    delete response.prompt_eval_duration;
    delete response.eval_count;
    delete response.eval_duration;

    // Prepare the assistant's message
    const assistantMessage = {
      role: 'assistant',
      content: chatFlag ? remlast(response.message.content) : remlast(response.response),
    };

    const existingMessages = chatSession.messages || [];
    const placeholderArr = [...existingMessages, messages, assistantMessage];

    // Update the chat session's messages
    chatSession.messages = placeholderArr;
    await chatSession.save();

    return res.json({
      model: chatSession.model,
      messages: placeholderArr,
    });

  } catch (err) {
    console.error('Error:', err);
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    } else if (err.request) {
      return res.status(500).json({ error: 'Network error' });
    } else {
      return res.status(500).json({ error: err.message });
    }
  }
};




/**
 * GET /chat
 * Get all chat history for the authenticated user
 */
export const getChats = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const chats = await db.models.Chat.findAll({ where: { userId } });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /chat/:id
 * Get chat history by chat ID for the authenticated user
 */
export const getChatById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const chat = await db.models.Chat.findOne({ where: { id, userId } });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or you do not have access to this chat.' });
    }

    return res.json(chat);
  } catch (err) {
    return next(err);
  }
};

// export const getChatHistory = async (sessionId, userId) => {
//   try {
//     const chatSession = await db.models.Chat.findOne({
//       where: { sessionId, userId },
//     });

//     if (!chatSession) {
//       throw new Error('Session not found');
//     }

//     return chatSession.messages;
//   } catch (err) {
//     throw new Error(`Could not retrieve chat history: ${err.message}`);
//   }
// };

// export const getChatHistoryBySessionId = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const sessionId = req.params.id;

//     const messages = await getChatHistory(sessionId, userId);
//     return res.json({ sessionId, messages });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };


/**
 * DELETE /chat/:id
 * Delete chat history by chat ID for the authenticated user
 */
export const deleteChatById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const chat = await db.models.Chat.findOne({ where: { id, userId } });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or you do not have access to this chat.' });
    }

    await chat.destroy();
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

