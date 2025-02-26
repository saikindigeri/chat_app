import React, { useState, useEffect } from "react";
import axios from "axios";
import Chat from "./Chat";

const Friends = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [error, setError] = useState("");
  const [friendError, setFriendError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, friendsRes] = await Promise.all([
          axios.get(`https://wsocket-5.onrender.com/friend-requests/${userId}`),
          axios.get(`https://wsocket-5.onrender.com/friends/${userId}`),
        ]);

        setFriendRequests(requestsRes.data);
        setFriends(friendsRes.data);
      } catch (err) {
        setError("Error fetching friend requests.");
        setFriendError("Error fetching friends.");
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="min-h-screen mt-16 bg-gray-50 text-gray-900 py-12 px-6">
      {!selectedFriend ? (
        <div className="max-w-3xl mx-auto mb-12 p-8 bg-white shadow-lg rounded-xl border">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Friends</h2>
          {friendError && (
            <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
              {friendError}
            </p>
          )}
          {friends.length === 0 ? (
            <p className="text-gray-500 italic">You have no friends yet.</p>
          ) : (
            <ul className="space-y-4">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 p-4 rounded-xl flex justify-between items-center transition-colors"
                >
                  <h3 className="text-lg font-medium">{friend.username}</h3>
                  <p className="text-indigo-600 font-medium">Chat Now →</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Chat selectedFriend={selectedFriend} />
          <button
            onClick={() => setSelectedFriend(null)}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Back to Friends List
          </button>
        </div>
      )}
    </div>
  );
};

export default Friends;
