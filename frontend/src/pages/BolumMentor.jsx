import React, { useState } from 'react';
import axios from 'axios';

function BolumMentor() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMessage = { role: 'user', content: userInput };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setUserInput('');

    try {
      const res = await axios.post('https://chatapp-bolum-backend.onrender.com/api/ai/chat', {
        message: userInput,
      },{withCredentials: true});

      const newBotMessage = {
        role: 'assistant',
        content: res.data.reply,
      };
      setChatHistory((prev) => [...prev, newBotMessage]);
      console.log('AI Response:', res.data.reply);
    } catch (err) {
      console.error('Error fetching AI response:', err);
        const msg = err?.response?.status === 429
          ? 'Quota exceeded. Please try again later or upgrade your API plan.'
          : 'Sorry, I could not respond right now.';
      
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', content: msg },
        ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">🧠 Talk to AI Mentor</h1>

      <div className="h-[300px] overflow-y-auto bg-gray-100 p-3 rounded mb-4">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.role === 'user' ? 'text-right' : 'text-left text-purple-800'
            }`}
          >
            <span className={`inline-block p-2 rounded-md ${msg.role === 'user' ? 'bg-purple-200' : 'bg-purple-100'}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">AI is typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 p-2 rounded"
          placeholder="How are you feeling?"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default BolumMentor;
