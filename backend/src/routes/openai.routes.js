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

  try {
    const completion = await openai.chat.completions.create({
      model: 'mistralai/mixtral-8x7b', // or try 'openai/gpt-3.5-turbo' / 'anthropic/claude-3-haiku'
      messages: [
        { role: 'system', content: 'You are a helpful and empathetic mental health assistant.' },
        { role: 'user', content: message },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenRouter Error:', error.message);
    res.status(500).json({ error: 'Something went wrong with AI response.' });
  }
});

export default router;
