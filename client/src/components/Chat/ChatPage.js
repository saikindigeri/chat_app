/*
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment'
import './ChatPage.css';

const socket = io('http://localhost:4000'); // Connect to the backend server

function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Guest');
  const token = localStorage.getItem('token'); // Fetch the token for authentication

  // Fetch old messages when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/messages'); // Fetch old messages from the backend
        setMessages(response.data); // Set the fetched messages in the state
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    // Real-time socket message handling
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Update the state with the new message
    });

    return () => {
      socket.off('chat message'); // Clean up socket listener when the component unmounts
    };
  }, []);

  // Handle sending new messages
  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('chat message', { token, text: message }); // Emit message to the backend
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.user === username ? 'my-message' : 'other-message'}>
            <strong>{msg.username}</strong>: {msg.message}
            <small>{moment(msg.timestamp).format(' h:mm:ss a')}</small>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Update the message state
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatPage;
*/
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment';
// import './ChatPage.css';

const socket = io('http://localhost:4000');

function ChatPage({ selectedFriend }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem('token'); // Authentication token
  const userId = localStorage.getItem('userId'); // Logged-in user's ID
  const username = localStorage.getItem('username'); // Logged-in user's username

  useEffect(() => {
    // Join user's room on component load


    // Fetch chat history when selectedFriend changes
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/messages/${selectedFriend.id}`,
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
        (msg.senderId === userId && msg.receiverId === selectedFriend.id) ||
        (msg.senderId === selectedFriend.id && msg.receiverId === userId)
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
    <div className="chat-container bg-gradient-to-r  text-white  rounded-sm shadow-lg">
  <h2 className="text-3xl text-center mb-6 text-black">Chat with {selectedFriend.username}</h2>

  <div className=" messages space-y-4 overflow-y-auto max-h-80 mb-6 rounded-lg bg-gray-400 ">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`flex ${msg.sender_id == userId ? 'justify-end ' : 'justify-start'}`}
      >
        <div
          className={`p-4 max-w-xs rounded-lg shadow-md m-5  ${
            msg.sender_id === userId
              ? 'bg-blue-600 text-white'
              : 'bg-white text-black border border-gray-300'
          }`}
        >
          <strong className="block ">
            {msg.sender_id == userId ? 'You' : selectedFriend.username}
          </strong>
          <p className="text-sm">{msg.text}</p>
          <small className="text-sm text-gray-400">
          {moment(msg.created_at).format('DD/MM/YYYY h:mm A')}
          </small>
        </div>
      </div>
    ))}
  </div>

  <div className="input-container flex items-center space-x-3">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message..."
      className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
    />
    <button
      onClick={handleSendMessage}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    >
      Send
    </button>
  </div>
</div>

  );
}

export default ChatPage;
