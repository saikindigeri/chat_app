import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';

const socket = io('http://localhost:4000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const [userId] = useState(localStorage.getItem('userId') || null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return window.location.href = '/login';
    socket.emit('join', userId);

    socket.on('chat message', (msg) => {
        if (msg.senderId !== userId) { // Skip if sender is current user
          setMessages((prev) => [...prev, msg]);
        }
      });
    return () => socket.off('chat message');
  }, [token, userId]);

  useEffect(() => {
    if (selectedFriend) {
      axios.get(`http://localhost:4000/messages/${selectedFriend._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setMessages(res.data));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedFriend, token]);

  const sendMessage = () => {
    if (input.trim() && selectedFriend) {
      const msg = { senderId: userId, receiverId: selectedFriend._id, text: input };
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
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Chat App</h2>
        <FriendRequests userId={userId} token={token} />
        <FriendList setSelectedFriend={setSelectedFriend} userId={userId} token={token} />
        <button onClick={handleLogout} className="mt-4 w-full bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
      <div className="w-3/4 flex flex-col">
        {selectedFriend ? (
          <>
            <h3 className="p-4 bg-blue-500 text-white text-lg">
              Chat with {selectedFriend.username}
            </h3>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 p-2 rounded ${msg.senderId === userId ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 border rounded-l"
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>Select a friend to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;