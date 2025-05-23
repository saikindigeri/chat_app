import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

function FriendRequests({ userId, token }) {
  const [requests, setRequests] = useState([]); // Received friend requests
  const [users, setUsers] = useState([]); // All users
  const [friends, setFriends] = useState([]); // Accepted friends
  const [pendingRequests, setPendingRequests] = useState([]); // Sent pending requests

  // Fetch data
  useEffect(() => {
    if (token && userId) {
      axios
        .get(`https://chat-app-2-v2fo.onrender.com/api/friend-requests/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setRequests(res.data))
        .catch((err) => console.error('Error fetching requests:', err));

      axios
        .get('https://chat-app-2-v2fo.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
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

  const acceptRequest = (requestId) => {
    axios
      .post(
        'https://chat-app-2-v2fo.onrender.com/api/accept-request',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const acceptedRequest = requests.find((r) => r._id === requestId);
        setFriends((prev) => [...prev, acceptedRequest.sender_id]);
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        alert('Friend request accepted!');
      })
      .catch((err) => console.error('Error accepting request:', err));
  };

  const declineRequest = (requestId) => {
    axios
      .post(
        'https://chat-app-2-v2fo.onrender.com/api/decline-request',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        alert('Friend request declined!');
      })
      .catch((err) => console.error('Error declining request:', err));
  };

  return (
    <div className="bg-white rounded-lg h-[360px]  p-4">
      {/* Friend Requests Section */}
      <h3 className="ttext-md sm:text-lg font-semibold text-black mb-2 flex items-center gap-2">
        <UserPlusIcon className="h-5 w-5 text-black" />
        Friend Requests
      </h3>
      <div className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div
              key={req._id}
              initial={{ opacity: 0, y: 10 }}
            
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-medium">
                  {req.sender_id.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700 font-medium truncate">
                  {req.sender_id.username || 'Unknown User'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptRequest(req._id)}
                  className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => declineRequest(req._id)}
                  className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center ">No pending requests</p>
        )}
      </div>

      {/* Add Friends Section */}
   
    </div>
  );
}

export default FriendRequests;