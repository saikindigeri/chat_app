import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("https://wsocket-5.onrender.com");

const Chat = ({ selectedFriend, isSidebarOpen }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://wsocket-5.onrender.com/messages/${selectedFriend.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    socket.on("chat message", (msg) => {
      if (
        (msg.senderId == userId && msg.receiverId == selectedFriend.id) ||
        (msg.senderId == selectedFriend.id && msg.receiverId == userId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("chat message");
  }, [selectedFriend, userId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const msg = {
        senderId: userId,
        receiverId: selectedFriend.id,
        text: message,
        timestamp: new Date().toISOString(),
      };

      socket.emit("chat message", msg);
      setMessages((prev) => [...prev, msg]);
      setMessage("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-[70vh] w-full sm:w-[calc(100%-4rem)] md:w-[calc(100%-15rem)] bg-gray-100 transition-all duration-300 shadow-lg rounded-lg`}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-blue-700 p-4 text-white text-center font-semibold shadow-md rounded-t-lg"
      >
        Chat with {selectedFriend.username}
      </motion.div>

      {/* Messages Container (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: msg.senderId == userId ? 100 : -100 }}
              className={`flex ${msg.senderId == userId ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[75%] break-words rounded-lg px-4 py-3 shadow-md ${
                  msg.senderId == userId
                    ? "bg-blue-600 text-white rounded-br-none self-end" // Your messages (right side)
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-300 self-start" // Friend's messages (left side)
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs mt-1 text-gray-300 text-right">
                  {moment(msg.timestamp).format("DD/MM/YYYY h:mm A")}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Field (Inside the Chat Box, Not Fixed) */}
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="p-4 bg-white border-t shadow-md rounded-b-lg ">
        <div className="max-w-2xl mx-auto flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-full focus:ring-2 focus:ring-blue-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSendMessage}
            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Send
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Chat;
