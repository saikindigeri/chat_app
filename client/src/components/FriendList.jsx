import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { UserIcon } from '@heroicons/react/24/solid';

function FriendList({ setSelectedFriend, userId, token }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (token && userId) {
      axios
        .get(`http://localhost:4000/friends/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setFriends(res.data))
        .catch((err) => console.error('Error fetching friends:', err));
    }
  }, [token, userId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Header */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <UserIcon className="h-5 w-5 text-blue-500" />
        Friends
      </h3>

      {/* Friends List */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => setSelectedFriend(friend)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 flex items-center gap-3 bg-gray-50 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors duration-200 border border-gray-200"
            >
              {/* Avatar Placeholder */}
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-medium">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              {/* Username */}
              <span className="text-gray-700 font-medium truncate">{friend.username}</span>
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