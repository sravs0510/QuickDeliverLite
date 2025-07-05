import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  try {
    console.log('🔑 API KEY:', process.env.OPENAI_API_KEY);
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for the QuickDeliverLite delivery tracking website. Answer all queries regarding delivery, tracking, drivers, and general site usage.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );      

    const botReply = response.data.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ reply: "Error contacting OpenAI. Try again later." });
  }
});

export default router;
