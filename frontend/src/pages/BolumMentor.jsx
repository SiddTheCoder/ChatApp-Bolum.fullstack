import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const backgroundImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
];

function BolumMentor() {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const chatRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingSound = useRef(new Audio('https://www.soundjay.com/button/sounds/button-16.mp3'));

  const playTypingSound = () => {
    if (!typingSound.current.paused) return;
    typingSound.current.play().catch(() => {});
  };

  const stopTypingSound = () => {
    typingSound.current.pause();
    typingSound.current.currentTime = 0;
  };

  const animatedDisplay = async (text, callback) => {
    const words = text.split(' ');
    let rendered = '';
    setIsTyping(true);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const mode = Math.random() < 0.5 ? 'letter' : 'word';

      if (mode === 'word') {
        rendered += word + ' ';
        callback(rendered);
        await new Promise(res => setTimeout(res, 150));
      } else {
        for (let j = 0; j < word.length; j++) {
          rendered += word[j];
          callback(rendered + ' ');
          playTypingSound();
          await new Promise(res => setTimeout(res, 30));
        }
        rendered += ' ';
        callback(rendered);
        await new Promise(res => setTimeout(res, 100));
      }
    }

    setIsTyping(false);
    stopTypingSound();
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { role: 'user', content: userInput };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setUserInput('');
    setLoading(true);

    try {
      const res = await axios.post(
        'https://chatapp-bolum-backend.onrender.com/api/ai/chat',
        { message: userInput, history: updatedHistory },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          timeout: 10000,
        }
      );

      const responseText = res.data.reply;
      let partialContent = '';
      setChatHistory(prev => [...prev, { role: 'assistant', content: '' }]);

      await animatedDisplay(responseText, (current) => {
        partialContent = current;
        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: current };
          return updated;
        });
      });
    } catch (err) {
      const fallback = err?.response?.status === 429
        ? 'Quota exceeded. Try again later.'
        : 'Sorry, something went wrong.';

      setChatHistory(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [chatHistory, loading, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex(prevIndex => (prevIndex + 1) % backgroundImages.length);
    }, 8000);
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

      <div className="relative z-10 w-[80vw] min-h-[90vh] max-w-4xl bg-white bg-opacity-90 text-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
        <h1 className="sticky top-0 text-3xl font-bold text-purple-700 mb-4 text-center">🧠 Bolum AI Mentor</h1>

        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto bg-purple-50 p-4 rounded-xl shadow-inner space-y-4"
        >
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-purple-200 rounded-bl-none'
                }`}
              >
                {msg.content}
                {idx === chatHistory.length - 1 && isTyping && msg.role === 'assistant' && <span className="animate-pulse">|</span>}
              </div>
            </div>
          ))}
          {loading && !isTyping && (
            <div className="text-sm text-purple-400">AI is preparing response<span className="animate-pulse">...</span></div>
          )}
        </div>

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
            disabled={loading || isTyping}
            className={`bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition ${
              (loading || isTyping) ? 'opacity-50 cursor-not-allowed' : ''
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
