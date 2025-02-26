import axios from "axios";
import React, { useState, useEffect } from "react";

const Requests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `https://wsocket-5.onrender.com/friend-requests/${userId}`
        );
        setFriendRequests(response.data);
      } catch (err) {
        setError("Error fetching friend requests.");
      }
    };

    fetchRequests();
  }, [userId]);

  const handleResponse = async (requestId, action) => {
    try {
      await axios.post(`https://wsocket-5.onrender.com/${action}-request`, {
        requestId,
      });

      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      );

      alert(`Friend request ${action}ed successfully`);
    } catch (err) {
      alert(`Error ${action}ing friend request.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-14 p-8 shadow-lg rounded-xl border">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Friend Requests</h2>
      {error && <p className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}

      {friendRequests.length === 0 ? (
        <p className="text-gray-500 italic">No pending friend requests.</p>
      ) : (
        <ul className="space-y-4">
          {friendRequests.map((request) => (
            <li
              key={request.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition"
            >
              <span className="font-medium text-lg">{request.username}</span>
              <div className="space-x-3">
                <button
                  onClick={() => handleResponse(request.id, "accept")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg transition font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(request.id, "decline")}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg transition font-medium"
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Requests;
