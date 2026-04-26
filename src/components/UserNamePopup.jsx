import { useState } from 'react';

export default function UserNamePopup({ onSubmit }) {
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      onSubmit(userName.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-600">
        <h2 className="text-lg font-semibold text-white mb-4">Welcome to Recipe Generator!</h2>
        <p className="text-sm text-gray-300 mb-4">Please enter your name to get started.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-700 text-white placeholder-gray-400 mb-4"
            autoFocus
          />
          <button
            type="submit"
            disabled={!userName.trim()}
            className="w-full py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Cooking!
          </button>
        </form>
      </div>
    </div>
  );
}