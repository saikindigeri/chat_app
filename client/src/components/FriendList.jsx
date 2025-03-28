import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendList({ setSelectedFriend, userId, token }) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (token && userId) {
      axios.get(`http://localhost:4000/friends/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setFriends(res.data));
    }
  }, [token, userId]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Friends</h3>
      {friends.map((friend) => (
        <div
          key={friend._id}
          onClick={() => setSelectedFriend(friend)}
          className="p-2 hover:bg-gray-300 cursor-pointer rounded"
        >
          {friend.username}
        </div>
      ))}
    </div>
  );
}

export default FriendList;