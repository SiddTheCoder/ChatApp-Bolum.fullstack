import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Home } from 'lucide-react'
import {useNavigate , Link} from 'react-router-dom';

const backgroundImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // nature
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', // sea
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b', // purple flower
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a', // calm mountain
];

function BolumMentor() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const chatRef = useRef(null);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
  
    const userMessage = { role: 'user', content: userInput };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setUserInput('');
    setLoading(true);
  
    try {
      const res = await axios.post('https://chatapp-bolum-backend.onrender.com/api/ai/chat', {
        message: userInput,
        history: updatedHistory, // send updated history here
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        timeout: 10000,
      });
  
      const botMessage = { role: 'assistant', content: res.data.reply };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      const fallback = err?.response?.status === 429
        ? 'Quota exceeded. Try again later.'
        : 'Sorry, something went wrong.';
  
      setChatHistory((prev) => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatHistory, loading]);

  // Background image slideshow logic
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <Link to="/home" className="text-purple-600 hover:text-purple-800 flex items-center gap-2">
          <Home className="w-5 h-5" />
          Home
        </Link>
      </div>
      {/* Background slideshow */}
      {backgroundImages.map((url, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-purple-600/10 transition-opacity duration-1000 ease-in-out ${
            index === bgIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${url}&auto=format&fit=crop&w=1920&q=80)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
      ))}

      {/* Chat container */}
      <div className="relative z-10 w-[80vw] min-h-[90vh] max-w-4xl bg-white bg-opacity-90 text-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
        <h1 className="sticky top-0 text-3xl font-bold text-purple-700 mb-4 text-center">🧠 Bolum AI Mentor</h1>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto bg-purple-50 p-4 rounded-xl shadow-inner space-y-4"
        >
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-purple-200 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-purple-400">AI is typing<span className="animate-pulse">...</span></div>
          )}
        </div>

        {/* Input area */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default BolumMentor;
