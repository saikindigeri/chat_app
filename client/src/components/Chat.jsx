import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';
import { motion, AnimatePresence } from 'framer-motion';
const socket = io('http://localhost:4000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const userId = localStorage.getItem('userId');
  console.log('userId:', userId);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return window.location.href = '/login';
    socket.emit('join', userId);

    socket.on('chat message', (msg) => {
      console.log('Received msg:', msg);
      if (String(msg.sender_id) !== String(userId)) { // Correct condition
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off('chat message');
  }, [token, userId]);

  // Fetch messages when selectedFriend changes
  useEffect(() => {
    if (selectedFriend) {
      axios
        .get(`http://localhost:4000/messages/${selectedFriend._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log('Fetched messages:', res.data);
          setMessages(res.data);
        })
        .catch((err) => console.error('Error fetching messages:', err));
    }
  }, [selectedFriend, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && selectedFriend) {
      const msg = { sender_id: userId, receiver_id: selectedFriend._id, text: input}; // Fixed to sender_id
      console.log('Sending msg:', msg);
      socket.emit('chat message', msg);
      setMessages((prev) => [...prev, { ...msg, created_at: new Date() }]);
      setInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen">
   <div className="w-full md:w-1/4 bg-white shadow-lg p-6 rounded-lg md:rounded-none h-screen flex flex-col">
  {/* Header */}
  <h2 className="text-2xl font-extrabold text-blue-600 mb-6 tracking-tight">
    ChatSphere
  </h2>

  {/* Content Area */}
  <div className="flex-1 overflow-y-auto space-y-6">
    <FriendRequests userId={userId} token={token} />
    <FriendList setSelectedFriend={setSelectedFriend} userId={userId} token={token} />
  </div>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="mt-6 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
    Logout
  </button>
</div>
<div className="flex-1 flex flex-col h-screen bg-gray-50">
  {selectedFriend ? (
    <>
      {/* Chat Header */}
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold flex-shrink-0 shadow-md"
      >
        Chat with {selectedFriend.username}
      </motion.h3>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: idx * 0.01 }}
              className={`p-3 rounded-lg max-w-[70%] shadow-sm ${
                String(msg.sender_id) === String(userId)
                  ? 'bg-blue-100 self-end text-right text-blue-800 border border-blue-200'
                  : 'bg-white self-start text-left text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No messages yet—start chatting!</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white flex flex-shrink-0 shadow-md border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-800 placeholder-gray-400"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </>
  ) : (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-gray-600 text-lg font-medium"
      >
        Select a friend to start chatting!
      </motion.p>
    </div>
  )}
</div>
    </div>
  );
}

export default Chat;