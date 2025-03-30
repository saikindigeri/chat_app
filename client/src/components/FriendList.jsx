import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon } from '@heroicons/react/24/solid';

function FriendList({ setSelectedFriend }) {
  const [friends, setFriends] = useState([]);
  const token=localStorage.getItem('token');
  const userId=localStorage.getItem('userId');


  useEffect(() => {
    if (token && userId) {
      console.log('Fetching friends with:', { token, userId });
      axios
        .get(`https://chat-app-2-v2fo.onrender.com/api/friends/${userId}`, { // Added /api
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log('Friends fetched:', res.data);
          setFriends(res.data);
        })
        .catch((err) => console.error('Error fetching friends:', err.response?.data || err.message));
    }
  }, [token, userId]);


  return (
    <div className="bg-white rounded-lg p-4">
      <h3 className="text-md sm:text-lg font-semibold text-black mb-2 flex items-center gap-1">
        <UserIcon className="h-5 w-5 text-blue-500" />
        Friends
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => setSelectedFriend(friend)}
              className="p-3 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors duration-200 border border-gray-200"
            >
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-medium">
                {friend.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="text-gray-700 font-medium truncate">
                {friend.username || 'Unknown'}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No friends yet</p>
        )}
      </div>
    </div>
  );
}

export default FriendList;