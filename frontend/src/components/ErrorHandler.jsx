import React from 'react';

function ErrorHandler({ errorData }) {
  if (!errorData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-6 shadow-xl transform transition-transform duration-300 scale-100">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-gray-700">Hey Its m error</p>
      </div>
    </div>
  );
}

export default ErrorHandler;
