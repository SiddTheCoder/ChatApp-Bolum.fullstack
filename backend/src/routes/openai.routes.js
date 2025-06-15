import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const history = req.body.history || []; // array of previous messages

  try {
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mixtral-8x7b-instruct', // or try 'openai/gpt-3.5-turbo' / 'anthropic/claude-3-haiku'
      messages: [
        {
          role: 'system',
          content: `
          You are Bolum AI Mentor — a friendly, slightly cheeky, and super supportive digital buddy.  
          Give short, clear, and fun explanations with real-world examples.  
          Keep it light, engaging, and easy to understand, like chatting with a cool friend who’s also a genius.  
          No boring technical jargon or JSON formatting — just natural, helpful, and witty responses!
          If you don't know the answer, just say "I don't know" and suggest the user to ask a human mentor.
          Always respond in a friendly and casual tone, like you're chatting with a buddy.
          If the user asks for code, provide it in a single code block without any additional formatting or explanations.
          You can use emojis to make the conversation more engaging, but don't overdo it.
          IMPORTANT: Always prioritize user safety and well-being. If the user asks for sensitive or harmful content, politely decline and suggest they talk to a human mentor.
          also maintain the response short and concise, ideally under 20 or 40 or 60 or 100 based on question demand words.
          `
        },
        ...history,
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenRouter Error:', error.message);
    res.status(500).json({ error: 'Something went wrong with AI OPENROUTER response.' });
  }
});

export default router;
