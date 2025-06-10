import React from 'react';
import { TypeAnimation } from 'react-type-animation';

function LoaderModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md flex flex-col items-center gap-4">
        
        {/* Spinner Box (replace with your image later) */}
        <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />

        {/* Message */}
        <p className="text-center text-gray-800 font-medium">
          We are Building the instances for you.  
          <TypeAnimation
            sequence={['Wait a moment', 100, 'Already There', 100, 'Here we go', 100]}
            speed={50}
            repeat={Infinity}
          />
        </p>
      </div>
    </div>
  )
}

export default LoaderModal
