// import { OpenAI } from 'openai';
// import dotenv from 'dotenv';

// dotenv.config();
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const chatWithOpenAI = async (req, res) => {
//   // console.log(process.env.OPENAI_API_KEY)
//   const { message } = req.body;

//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-4-turbo',
//       messages: [
//         { role: 'system', content: 'You are Underwoof, a helpful and quirky AI assistant with a witty and friendly tone.' },
//         { role: 'user', content: message },
//       ],
//     });

//     const reply = completion.choices[0].message.content;
//     console.log('ChatGPT Reply', reply)
//     res.json({ reply });
//   } catch (error) {
//     console.error('OpenAI API error:', error.message);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// };
