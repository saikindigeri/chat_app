"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import io from "socket.io-client";
import axios from "axios";
import FriendList from "./FriendList";
import FriendRequests from "./FriendRequests";
import { UserIcon, UserPlusIcon, UsersIcon, Bars3Icon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

const socket = io("https://chat-app-2-v2fo.onrender.com");

function AllUsers({ userId, token }) {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (token && userId) {
      axios
        .get("https://chat-app-2-v2fo.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data.filter((u) => u._id !== userId)))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [token, userId]);

  const sendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        "https://chat-app-2-v2fo.onrender.com/api/send-request",
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        setPendingRequests((prev) => [...prev, receiverId]);
        alert("Friend request sent!");
      }
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === "You are already friends") {
        setFriends((prev) => [...prev, receiverId]);
        alert("You are already friends!");
      } else if (message === "Friend request already pending") {
        setPendingRequests((prev) => [...prev, receiverId]);
        alert("Friend request already pending!");
      } else {
        console.error("Error sending friend request:", err);
        alert("Error sending friend request");
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl h-[360px] p-4 w-full shadow-lg max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserPlusIcon className="h-5 w-5 text-black" />
        Add Friends
      </h3>
      <div className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-gray-100">
        {users.length > 0 ? (
          users.map((user) => {
            const isFriend = friends.includes(user._id);
            const isPending = pendingRequests.includes(user._id);

            return (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-3 flex items-center justify-between bg-white/50 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-black font-medium text-sm sm:text-base">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-800 font-medium text-xs sm:text-sm truncate">{user.username}</span>
                </div>
                <button
                  onClick={() => sendRequest(user._id)}
                  disabled={isFriend || isPending}
                  className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    isFriend || isPending
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-600 hover:shadow-md"
                  }`}
                >
                  {isFriend ? "Friends" : isPending ? "Pending" : "Add"}
                </button>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-4 text-xs sm:text-sm">Loading users...</p>
        )}
      </div>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [token] = useState(localStorage.getItem("token"));
  const [userId] = useState(localStorage.getItem("userId"));
  const [activeTab, setActiveTab] = useState("friends");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const name = localStorage.getItem("username");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return (window.location.href = "/login");
    socket.emit("join", userId);

    socket.on("chat message", (msg) => {
      console.log("Received msg:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat message");
  }, [token, userId]);

  useEffect(() => {
    if (selectedFriend) {
      axios
        .get(`https://chat-app-2-v2fo.onrender.com/api/messages/${selectedFriend._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Fetched messages:", res.data);
          setMessages(res.data);
        })
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [selectedFriend, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && selectedFriend) {
      const msg = { sender_id: userId, receiver_id: selectedFriend._id, text: input };
      console.log("Sending msg:", msg);
      socket.emit("chat message", msg);
      setInput("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isSidebarExpanded ? "100%" : "4rem", maxWidth: isSidebarExpanded ? "20rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white/90 backdrop-blur-md shadow-xl p-4 flex flex-col fixed top-0 left-0 h-full z-20 sm:static sm:w-auto sm:min-w-[4rem] sm:max-w-1/2"
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2
            className={`text-lg sm:text-xl font-bold text-gray-900 ${!isSidebarExpanded && "hidden"}`}
          >
            Chatly
          </h2>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-black rounded-full transition-colors p-1"
            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarExpanded ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isSidebarExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg mb-4 sm:mb-6">
                <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                <span className="text-base sm:text-lg font-semibold text-gray-900 uppercase truncate">
                  {name || "Loading..."}
                </span>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 mb-4 sm:mb-6 p-1 rounded-lg">
                {[
                  { tab: "friends", icon: UserIcon, label: "Friends" },
                  { tab: "requests", icon: UserPlusIcon, label: "Requests" },
                  { tab: "allUsers", icon: UsersIcon, label: "All Users" },
                ].map(({ tab, icon: Icon, label }) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === tab
                        ? "bg-red-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                    aria-label={`Show ${label}`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "requests" && <FriendRequests userId={userId} token={token} />}
                {activeTab === "friends" && (
                  <FriendList setSelectedFriend={setSelectedFriend} userId={userId} token={token} />
                )}
                {activeTab === "allUsers" && <AllUsers userId={userId} token={token} />}
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 sm:mt-6 w-full bg-black text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
                aria-label="Logout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-screen sm:ml-0">
        {selectedFriend ? (
          <>
            <div className="p-3 sm:p-4 bg-black text-white text-base sm:text-lg font-semibold flex-shrink-0 shadow-md border-b border-white/20">
              Chat with <span className="uppercase">{selectedFriend.username}</span>
            </div>
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col gap-3 sm:gap-4 scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-gray-100">
              <AnimatePresence>
                {messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 sm:p-4 rounded-xl max-w-[80%] sm:max-w-[70%] shadow-sm ${
                        String(msg.sender_id) === String(userId)
                          ? "bg-blue-500 text-white self-end border border-blue-400"
                          : "bg-white text-gray-800 self-start border border-gray-200"
                      }`}
                    >
                      <p className="text-sm sm:text-md font-medium">{msg.text}</p>
                      <span className={`text-xs text-black mt-1 block ${
                        String(msg.sender_id) === String(userId)
                          ? " text-white "
                          : " text-gray-800 "
                      }`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-500 text-center py-4 text-xs sm:text-sm font-medium"
                  >
                    No messages yet—start chatting!
                  </motion.p>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 sm:p-4 bg-white flex flex-shrink-0 shadow-md border-t border-gray-200">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="w-full p-2 sm:p-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-sm font-medium transition-all duration-200"
                  placeholder="Type a message..."
                  aria-label="Message input"
                />
                <button
                  onClick={sendMessage}
                  className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-2 bg-gray-900 text-white rounded-full transition-colors"
                  aria-label="Send message"
                >
                  <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white/80">
            <p className="text-gray-500 text-base sm:text-lg font-medium">
              Select a friend to start chatting!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;