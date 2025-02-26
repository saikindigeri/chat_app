import React, { useState, useEffect } from "react";
import ChatPage from "../Chat/ChatPage";
import axios from "axios";
import Header from "../Header";

const Friends = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [friendError, setFriendError] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null); // Track selected friend for chat

  const userId = localStorage.getItem("userId");

  useEffect(() => {
   

    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `https://chat-app-9l0g.onrender.com/friends/${userId}`
        );
        setFriends(response.data);
      } catch (err) {
        setFriendError("Error fetching friends.");
      }
    };

 
    fetchFriends();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await axios.post("https://chat-app-9l0g.onrender.com/accept-request", {
        requestId,
      });
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      alert("Friend request accepted");
    } catch (err) {
      alert("Error accepting friend request.");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post("https://chat-app-9l0g.onrender.com/decline-request", {
        requestId,
      });
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );
      alert("Friend request declined");
    } catch (err) {
      alert("Error declining friend request.");
    }
  };

  const openChat = (friend) => {
    setSelectedFriend(friend); // Set the selected friend for chat
  };

  const closeChat = () => {
    setSelectedFriend(null); // Close the chat box
  };

  return (
    <>
      <Header />
      <div className="min-h-screen mt-16 bg-gray-50 text-gray-900 py-12 px-6">
        {!selectedFriend ? (
          <>
           

            <div className="max-w-3xl mx-auto mb-12 p-8 bg-white shadow-lg rounded-xl border border-gray-100">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Friends</h2>
              {friendError && (
                <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                  {friendError}
                </p>
              )}
              {friends.length === 0 ? (
                <p className="text-gray-500 italic">You have no friends yet.</p>
              ) : (
                <ul className="space-y-5">
                  {friends.map((friend) => (
                    <li
                      key={friend.id}
                      onClick={() => openChat(friend)}
                      className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 p-5 rounded-xl flex justify-between items-center transition-colors duration-200"
                    >
                      <h3 className="text-lg font-medium text-gray-900">
                        {friend.username}
                      </h3>
                      <p className="text-indigo-600 font-medium">Chat Now →</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <ChatPage selectedFriend={selectedFriend} />
          </div>
        )}
      </div>
    </>
  );
};

export default Friends;
