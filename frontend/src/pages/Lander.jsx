import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';

const features = [
  {
    title: "Instant Messaging",
    img: 'https://imgs.search.brave.com/Cn39d9vrcv9gZtKOZ1zmVW1l-gb8IzIBAbnpTByMEm4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/MzA5ODE3NDYvZmls/ZS9vcmlnaW5hbC0x/ZjE5MzMxMDBlNjdh/Mjk4MDM5YWI0OGEz/MWZmYWU5ZS5wbmc_/cmVzaXplPTQwMHgw', // Replace with a direct image URL
  },
  {
    title: "Private Rooms",
    img: 'https://img.freepik.com/free-vector/gradient-phone-text-bubble_23-2149478449.jpg?t=st=1746419219~exp=1746422819~hmac=6c5dc30e86f9cc7e3985accea1fb5aefbffc5091803f46cd126e1ec8f88806ff&w=1380',
  },
  {
    title: "Smart Alerts",
    img: 'https://img.freepik.com/premium-vector/chatting-app-user-interface_169201-1.jpg?w=1380',
  },
  {
    title: "Emojis & Media",
    img: 'https://img.freepik.com/free-vector/chatbot-concept-background-with-mobile-device_23-2147832941.jpg?semt=ais_hybrid&w=740', // Replace with a direct image URL
  },
];



function Lander() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(Array(features.length).fill(false));

  useEffect(() => {
    const checkAuth = async () => {
      const response = await axios.get('/api/v1/user/verify-user', { withCredentials: true });
      if (response.data.isAuthenticated) {
        navigate('/home');
      }
    };
    checkAuth();
  }, []);

  const handleHover = (index) => {
    setHovered((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  return (
    <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-gradient-to-br from-blue-900 via-purple-800 to-blue-700 text-white">
      
      {/* Section 1 - Intro */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          <TypeAnimation
            sequence={['Bolum', 1000, 'Chat Freely.', 1000, 'Bolum', 1000]}
            speed={50}
            repeat={Infinity}
          />
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Chat Freely. Connect Instantly.
        </p>
        <Link to="/user/register">
          <button className="bg-blue-600 hover:bg-purple-600 px-8 py-3 rounded-xl font-semibold transition-all shadow-lg">
            Get Started
          </button>
        </Link>
      </section>

      {/* Section 2 to 4 */}
      {[0].map((secIdx) => (
        <section key={secIdx} className="h-screen snap-start flex items-center justify-center p-4">
          <div className='flex w-full justify-center p-5'>
            <div className='w-[40%] flex flex-col gap-5 justify-center items-center'>
              <h1 className='text-4xl my-5 mr-15'>Instant messaging private rooms with 
                <TypeAnimation
                  sequence={['Family', 1000, 'Collegues', 1000, 'Soulmate', 1000]}
                  speed={50}
                  repeat={Infinity}
                  className='ml-2 text-blue-300'
                />
              </h1>
              <div className='w-full '>
                <div className='w-[50%] border-b-2 border-purple-300'></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-10 w-xl">
              {features.map((feat, i) => {
                const index = secIdx * 4 + i;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => handleHover(index)}
                    className={`rounded-xl overflow-hidden p-1 transition-all duration-500 backdrop-blur-xl ${
                      hovered[index] ? 'grayscale-0 scale-105' : 'grayscale'
                    } bg-white/10 border border-white/20`}
                  >
                    <img
                      src={feat.img}
                      alt={feat.title}
                      className="h-48 w-full object-cover rounded-xl"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-center">{feat.title}</h3>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
        </section>
      ))}
    </div>
  );
}

export default Lander;
