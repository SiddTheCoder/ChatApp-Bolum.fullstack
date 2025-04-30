import React from 'react';
import { Link } from 'react-router-dom';

function RandomPageError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <img
        src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"
        alt="Sad Bunny"
        className="w-48 h-48 mb-6"
      />
      <h1 className="text-6xl font-bold text-red-500 mb-2">404</h1>
      <p className="text-xl text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default RandomPageError;
