import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';
import { UserIcon, UserPlusIcon, UsersIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const socket = io('https://chat-app-2-v2fo.onrender.com');

// AllUsers Component (unchanged logic, updated styles)
function AllUsers({ userId, token }) {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (token && userId) {
      axios
        .get('https://chat-app-2-v2fo.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data.filter((u) => u._id !== userId)))
        .catch((err) => console.error('Error fetching users:', err));
    }
  }, [token, userId]);

  const sendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        'https://chat-app-2-v2fo.onrender.com/api/send-request',
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        setPendingRequests((prev) => [...prev, receiverId]);
        alert('Friend request sent!');
      }
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === 'You are already friends') {
        setFriends((prev) => [...prev, receiverId]);
        alert('You are already friends!');
      } else if (message === 'Friend request already pending') {
        setPendingRequests((prev) => [...prev, receiverId]);
        alert('Friend request already pending!');
      } else {
        console.error('Error sending friend request:', err);
        alert('Error sending friend request');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-2 sm:p-4 w-full shadow-md">
      <h3 className="text-md sm:text-lg font-semibold text-black mb-2 flex items-center gap-1">
        <UserPlusIcon className="h-4 w-4 text-blue-500" />
        Add Friends
      </h3>
      <div className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-200 scrollbar-track-gray-50">
        {users.length > 0 ? (
          users.map((user) => {
            const isFriend = friends.includes(user._id);
            const isPending = pendingRequests.includes(user._id);

            return (
              <div
                key={user._id}
                className="p-2 flex items-center justify-between bg-teal-50 rounded-md border border-teal-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-medium text-xs sm:text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-teal-800 font-medium truncate text-xs sm:text-sm">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={() => sendRequest(user._id)}
                  disabled={isFriend || isPending}
                  className={`px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    isFriend || isPending
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                  }`}
                >
                  {isFriend ? 'Friends' : isPending ? 'Pending' : 'Add'}
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-teal-600 text-center py-2 text-xs sm:text-sm">Loading users...</p>
        )}
      </div>
    </div>
  );
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const [userId] = useState(localStorage.getItem('userId'));
  const [activeTab, setActiveTab] = useState('friends');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const name = localStorage.getItem('username');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) return (window.location.href = '/login');
    socket.emit('join', userId);

    socket.on('chat message', (msg) => {
      console.log('Received msg:', msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('chat message');
  }, [token, userId]);

  useEffect(() => {
    if (selectedFriend) {
      axios
        .get(`https://chat-app-2-v2fo.onrender.com/api/messages/${selectedFriend._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log('Fetched messages:', res.data);
          setMessages(res.data);
        })
        .catch((err) => console.error('Error fetching messages:', err));
    }
  }, [selectedFriend, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && selectedFriend) {
      const msg = { sender_id: userId, receiver_id: selectedFriend._id, text: input };
      console.log('Sending msg:', msg);
      socket.emit('chat message', msg);
      setInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg p-4 flex flex-col overflow-hidden transition-all duration-300 fixed md:static top-0 left-0 h-full z-10 ${
          isSidebarExpanded ? 'w-3/4 sm:w-1/2 md:w-3/12' : 'w-16 md:w-2/12'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2
            className={`text-lg sm:text-xl font-bold text-teal-600 tracking-tight ${
              !isSidebarExpanded && 'hidden'
            }`}
          >
            ChatSphere
          </h2>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
          >
            {isSidebarExpanded ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        {isSidebarExpanded && (
          <>
            <h2 className="text-md sm:text-lg font-semibold text-teal-700 bg-teal-50 py-2 px-3 rounded-md border border-teal-200 shadow-sm flex items-center gap-2 hover:bg-teal-100 transition-colors mb-4">
              <UserIcon className="h-5 w-5 text-teal-500" />
              {name || 'Loading...'}
            </h2>

            <div className="flex space-x-1 mb-4 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 rounded-t-md transition-colors ${
                  activeTab === 'requests'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <UserPlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Requests</span>
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 rounded-t-md transition-colors ${
                  activeTab === 'friends'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Friends</span>
              </button>
              <button
                onClick={() => setActiveTab('allUsers')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-1 rounded-t-md transition-colors ${
                  activeTab === 'allUsers'
                    ? 'bg-teal-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <UsersIcon className="h-4 w-4" />
                <span className="hidden sm:inline">All Users</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'requests' && <FriendRequests userId={userId} token={token} />}
              {activeTab === 'friends' && (
                <FriendList setSelectedFriend={setSelectedFriend} userId={userId} token={token} />
              )}
              {activeTab === 'allUsers' && <AllUsers userId={userId} token={token} />}
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 w-full bg-gradient-to-r from-coral-500 to-coral-600 text-red-500 py-2 px-4 rounded-lg hover:from-coral-600 hover:to-coral-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base font-medium"
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
          </>
        )}
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col h-screen bg-slate-50 transition-all duration-300 md:flex-1 ${
          isSidebarExpanded
            ? 'ml-0 md:ml-0 w-full md:w-9/12'
            : 'ml-16 md:ml-0 w-[calc(100%-4rem)] md:w-10/12'
        }`}
      >
        {selectedFriend ? (
          <>
            <h3 className="p-4 bg-gradient-to-r from-teal-600 via-coral-500 to-teal-600 text-white text-lg sm:text-xl font-semibold flex-shrink-0 shadow-md">
              Chat with {selectedFriend.username}
            </h3>
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-teal-200 scrollbar-track-slate-50">
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg max-w-[80%] sm:max-w-[70%] shadow-sm ${
                      String(msg.sender_id) === String(userId)
                        ? 'bg-teal-100 self-end text-right text-teal-800 border border-teal-200'
                        : 'bg-white self-start text-left text-slate-800 border border-slate-200'
                    }`}
                  >
                    <p className="text-xs sm:text-sm font-medium">{msg.text}</p>
                    <span className="text-xs text-slate-500 mt-1 block">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-center py-4 text-sm sm:text-base font-medium">
                  No messages yet—start chatting!
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 sm:p-4 bg-white flex flex-shrink-0 shadow-md border-t border-slate-200 rounded-lg">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 p-2 sm:p-3 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50 text-slate-800 placeholder-slate-500 text-sm sm:text-base font-medium shadow-sm transition-all duration-200"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="p-2.5 sm:p-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-r-md hover:bg-gradient-to-r hover:from-teal-700 hover:to-teal-800 hover:shadow-md transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
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
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <p className="text-slate-600 text-base sm:text-lg font-medium">
              Select a friend to start chatting!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;