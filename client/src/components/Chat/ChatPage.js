
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';


const socket = io('https://wsocket-5.onrender.com');

function ChatPage({ selectedFriend }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token'); // Authentication token
  const userId = localStorage.getItem('userId'); // Logged-in user's ID
  const username = localStorage.getItem('username'); // Logged-in user's username

  useEffect(() => {
     
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://wsocket-5.onrender.com/messages/${selectedFriend.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(response.data); // Populate chat history
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
      if (
        (msg.senderId == userId && msg.receiverId == selectedFriend.id) ||
        (msg.senderId == selectedFriend.id && msg.receiverId ==userId)
      ) {
        setMessages((prev) => [...prev, msg]); // Append new messages to the state
      }
    });

    // Cleanup socket listener on component unmount
    return () => {
      socket.off('chat message');
    };
  }, [selectedFriend, userId, token,messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (message.trim()) {
      const msg = {
        senderId: userId,
        receiverId: selectedFriend.id,
        text: message,
      };

      // Emit message through socket
      socket.emit('chat message', msg);

      // Update local state for immediate feedback
      setMessages((prev) => [
        ...prev,
        { ...msg, timestamp: new Date().toISOString() },
      ]);
      setMessage(''); // Clear input field
    }
  };
console.log(messages,userId)
return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden font-sans"
  >
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 shadow-lg"
    >
      <h2 className="text-3xl font-extrabold text-white text-center tracking-tight font-poppins">
        Chat with{' '}
        <span className="font-light italic">
          {selectedFriend.username}
        </span>
      </h2>
    </motion.div>

    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      <AnimatePresence>
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: msg.sender_id == userId ? 100 : -100 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.sender_id == userId ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`max-w-[70%] break-words rounded-2xl px-5 py-4 shadow-md 
                ${msg.sender_id == userId
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                }`}
            >
              <p className="text-base leading-relaxed tracking-wide font-normal">
                {msg.text}
              </p>
              <p className={`text-xs mt-2 font-light tracking-wider
                ${msg.sender_id == userId ? 'text-blue-100' : 'text-gray-500'}`}
              >
                {moment(msg.created_at).format('DD/MM/YYYY h:mm A')}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    <motion.div 
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      className="p-6 bg-white border-t border-gray-200 shadow-lg"
    >
      <div className="flex space-x-3">
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-6 py-3 border border-gray-300 rounded-full 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent bg-gray-50
            text-base font-medium placeholder-gray-400"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
            text-white rounded-full hover:from-blue-600 hover:to-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 transition-all duration-200 
            font-semibold shadow-md text-base tracking-wide"
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);
}

export default ChatPage;
