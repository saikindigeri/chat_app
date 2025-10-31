"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import axios from "axios";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";
import {
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  PaperAirplaneIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

const socket = io("https://chat-app-2-v2fo.onrender.com");

function AllUsers({ userId, token }) {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!token || !userId) return;
    axios
      .get("https://chat-app-2-v2fo.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setUsers(r.data.filter((u) => u._id !== userId)))
      .catch(() => {});
  }, [token, userId]);

  const sendRequest = async (id) => {
    try {
      await axios.post(
        "https://chat-app-2-v2fo.onrender.com/api/send-request",
        { receiverId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPending((p) => [...p, id]);
    } catch (e) {
      const msg = e.response?.data?.message;
      if (msg === "You are already friends") setFriends((f) => [...f, id]);
      else if (msg === "Friend request already pending") setPending((p) => [...p, id]);
    }
  };

  return (
    <div className="space-y-3 p-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <UsersIcon className="w-5 h-5 text-gray-600" />
        Discover
      </h3>
      {users.length ? (
        users.map((u) => {
          const isFriend = friends.includes(u._id);
          const isPending = pending.includes(u._id);
          return (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {u.username[0].toUpperCase()}
                </div>
                <span className="font-medium text-gray-800">{u.username}</span>
              </div>
              <button
                onClick={() => sendRequest(u._id)}
                disabled={isFriend || isPending}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isFriend
                    ? "bg-gray-300 text-gray-600"
                    : isPending
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                {isFriend ? "Friends" : isPending ? "Pending" : "Add"}
              </button>
            </motion.div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 py-8">No users found</p>
      )}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [token] = useState(localStorage.getItem("token") || "");
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [activeTab, setActiveTab] = useState("friends");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const name = localStorage.getItem("username") || "User";

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auth + Socket
  useEffect(() => {
    if (!token) return (window.location.href = "/login");
    socket.emit("join", userId);
    socket.on("chat message", (msg) => setMessages((p) => [...p, msg]));
    return () => socket.off("chat message");
  }, [token, userId]);

  // Load messages
  useEffect(() => {
    if (selectedFriend) {
      axios
        .get(`https://chat-app-2-v2fo.onrender.com/api/messages/${selectedFriend._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((r) => setMessages(r.data))
        .catch(() => setMessages([]));
    }
  }, [selectedFriend, token]);

  // Focus input only when chat opens (no re-focus on typing)
  useEffect(() => {
    if (selectedFriend && inputRef.current) {
      const timer = setTimeout(() => inputRef.current.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [selectedFriend]);

  // Auto-scroll to bottom (smooth, works on all screens)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = () => {
    if (input.trim() && selectedFriend) {
      const msg = { sender_id: userId, receiver_id: selectedFriend._id, text: input };
      socket.emit("chat message", msg);
      setInput("");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const tabs = [
    { id: "friends", icon: UserIcon, label: "Chats" },
    { id: "requests", icon: UserPlusIcon, label: "Requests" },
    { id: "allUsers", icon: UsersIcon, label: "Users" },
  ];


return (
  <div className="flex h-screen bg-gray-50 overflow-hidden">
    {/* ===== SIDEBAR ===== */}
    <div
      className={`
        fixed md:relative inset-y-0 left-0 z-50 w-80 bg-white flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        border-r border-gray-200
      `}
    >
      {/* Header */}
      <div className="p-4  border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Chatly</h1>
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* User */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold">
          {name[0].toUpperCase()}
        </div>
        <span className="font-medium text-gray-800">{name}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 bg-gray-100 mx-4 rounded-lg">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setIsSidebarOpen(false);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? "bg-gray-600 text-white" : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "friends" && (
          <FriendList setSelectedFriend={setSelectedFriend} userId={userId} token={token} />
        )}
        {activeTab === "requests" && <FriendRequests userId={userId} token={token} />}
        {activeTab === "allUsers" && <AllUsers userId={userId} token={token} />}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-4 p-2 bg-black text-white rounded-lg text-sm font-medium"
      >
        Logout
      </button>
    </div>

    {/* Overlay */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* ===== MAIN CHAT (No overflow, full width) ===== */}
    <div className="flex-1 flex flex-col md:ml-0 min-w-0">
      {selectedFriend ? (
        <>
          {/* Chat Header */}
          <div className="flex items-center gap-3 p-3 ml-8  bg-white border-b border-gray-200">
            <button onClick={() => setSelectedFriend(null)} className={`${isSidebarOpen?'':'hidden '} md:hidden`}>
              <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
              {selectedFriend.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{selectedFriend.username}</p>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          {/* Messages – Critical Fix */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3 pb-[env(safe-area-inset-bottom,1rem)] min-w-0">
            {messages.length ? (
              messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm break-words ${
                      m.sender_id === userId
                        ? "bg-black text-white"
                        : "bg-white text-gray-800 border border-gray-300"
                    }`}
                  >
                    <p className="text-sm">{m.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Start chatting!</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) sendMessage();
            }}
            className="p-4 bg-white border-t border-gray-200"
          >
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black placeholder-gray-500 min-w-0"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      
          <p className="text-lg font-medium text-gray-600">
            {activeTab === "friends" && "Select a friend to start"}
            {activeTab === "requests" && "Check requests"}
            {activeTab === "allUsers" && "Add friends"}
          </p>
        </div>
      )}
    </div>

    {/* Hamburger */}
    <button
      onClick={() => setIsSidebarOpen(true)}
      className={`fixed top-4 mr-2 z-50 px-4   ${isSidebarOpen?'hidden':''} md:hidden`}
    >
      <Bars3Icon className="w-6 h-6 text-gray-700" />
    </button>
  </div>
);
  
}