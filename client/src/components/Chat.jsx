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
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4">Chat App</h2>
        <FriendRequests userId={userId} token={token} />
        <FriendList setSelectedFriend={setSelectedFriend} userId={userId} token={token} />
        <button onClick={handleLogout} className="mt-4 w-full bg-red-500 text-white p-2 rounded">
          Logout
        </button>
      </div>
      <div className="w-3/4 flex flex-col h-screen">
        {selectedFriend ? (
          <>
            <h3 className="p-4 bg-blue-500 text-white text-lg flex-shrink-0">
              Chat with {selectedFriend.username}
            </h3>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded max-w-[70%] ${
                    String(msg.sender_id) === String(userId)
                      ? 'bg-blue-100 self-end text-right'
                      : 'bg-gray-400 self-start text-left'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 flex flex-shrink-0">
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