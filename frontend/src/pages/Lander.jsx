import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import Particles from '@tsparticles/react';
import { loadLinksPreset } from '@tsparticles/preset-links';

const features = [
  {
    title: "Instant Messaging",
    img: 'https://imgs.search.brave.com/Cn39d9vrcv9gZtKOZ1zmVW1l-gb8IzIBAbnpTByMEm4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/ZHJpYmJibGUuY29t/L3VzZXJ1cGxvYWQv/MzA5ODE3NDYvZmls/ZS9vcmlnaW5hbC0x/ZjE5MzMxMDBlNjdh/Mjk4MDM5YWI0OGEz/MWZmYWU5ZS5wbmc_/cmVzaXplPTQwMHgw',
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
    img: 'https://img.freepik.com/free-vector/chatbot-concept-background-with-mobile-device_23-2147832941.jpg?semt=ais_hybrid&w=740',
  },
];

function Lander() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(Array(features.length).fill(false));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          'https://chatapp-bolum-backend.onrender.com/api/v1/user/verify-user',
          { withCredentials: true }
        );
        if (response.data.isAuthenticated) {
          navigate('/home');
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleHover = (index) => {
    setHovered((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const particlesInit = useCallback(async (engine) => {
    await loadLinksPreset(engine);
  }, []);

  return (
    <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-gradient-to-br from-purple-900 via-black to-purple-800 text-white relative">
      
      {/* Section 1 */}
      <section className="relative h-screen snap-start flex flex-col items-center justify-center text-center px-4 overflow-hidden">
  <Particles
    id="tsparticles"
    init={particlesInit}
    className="absolute top-0 left-0 w-full h-full z-0"
    options={{
      preset: "links", // use preset if you loaded it
      background: {
        color: { value: "transparent" },
      },
      fullScreen: { enable: false },
      particles: {
        number: { value: 50 },
        color: { value: "#ffffff" },
        links: {
          enable: true,
          distance: 120,
          color: "#ffffff",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
        },
        opacity: { value: 0.3 },
        size: { value: { min: 1, max: 3 } },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
        },
        modes: {
          repulse: { distance: 100 },
          push: { quantity: 4 },
        },
      },
    }}
  />

  {/* Your content */}
  <h1 className="relative z-10 text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-white to-purple-400 text-transparent bg-clip-text animate-pulse">
    <TypeAnimation
            sequence={[
              'Bolum', 1000,
              'Chat Freely.', 1000,
              'Bolum', 1000,
              'Chat with AI.', 3000,
              'Connect Instantly.', 1000,
              'Bolum', 1000,
            ]}
      speed={50}
      repeat={Infinity}
    />
  </h1>
  <p className="relative z-10 text-lg md:text-xl text-gray-300 mb-8 animate-fade-in">
    Chat Freely. Connect Instantly.
  </p>
  <Link to="/user/login" className="relative z-10">
    <button className="bg-purple-600 hover:bg-white hover:text-purple-800 transition-all px-8 py-3 rounded-xl font-semibold shadow-lg">
      Get Started
    </button>
  </Link>
  <div className="absolute bottom-6 text-white animate-bounce opacity-70 text-sm z-10">Made with ❤️ by <a className='underline hover:ml-3 transition-all duration-200 ease-in-out' href="https://www.siddhantyadav.com.np">SiddTheCoder</a></div>
</section>


      {/* Section 2 */}
      <section className="relative z-10 h-screen snap-start px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center justify-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 p-6 rounded-2xl shadow-xl transform hover:-translate-y-2 hover:scale-105 text-center ${
              hovered[index] ? 'animate-pulse' : ''
            }`}
            onMouseEnter={() => handleHover(index)}
          >
            <img
              src={feature.img}
              alt={feature.title}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Lander;
