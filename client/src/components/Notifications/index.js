import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../Header";

const Notifications = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("https://wsocket-5.onrender.com/friend-requests");
        setFriendRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchFriendRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.post("https://wsocket-5.onrender.com/accept-request", { requestId });
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
      alert("Friend request accepted ✅");
    } catch (err) {
      alert("❌ Error accepting friend request.");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post("https://wsocket-5.onrender.com/decline-request", { requestId });
      setFriendRequests((prev) => prev.filter((request) => request.id !== requestId));
      alert("Friend request declined ❌");
    } catch (err) {
      alert("❌ Error declining friend request.");
    }
  };

  return (
    <>
      <Header />
      <div className="mt-16 px-4 sm:px-6 md:px-10">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          🔔 Friend Requests
        </h2>

        {friendRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending friend requests.</p>
        ) : (
          <ul className="space-y-4 max-w-lg mx-auto">
            {friendRequests.map((request) => (
              <li
                key={request.id}
                className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-md shadow hover:bg-gray-200 transition"
              >
                <span className="text-gray-800 font-medium">{request.username}</span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => handleDecline(request.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                  >
                    ❌ Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notifications;
