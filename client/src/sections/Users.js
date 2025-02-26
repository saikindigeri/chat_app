import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, friendsRes, requestsRes] = await Promise.all([
          axios.get("https://wsocket-5.onrender.com/users", {
            headers: { Authorization: token },
          }),
          axios.get(`https://wsocket-3.onrender.com/friends/${userId}`, {
            headers: { Authorization: token },
          }),
          axios.get(`https://wsocket-5.onrender.com/pending-requests/${userId}`, {
            headers: { Authorization: token },
          }),
        ]);

        setUsers(usersRes.data);
        setFriends(friendsRes.data);
        setPendingRequests(requestsRes.data);
      } catch (err) {
        setError(
          err.response?.status === 401
            ? "Unauthorized access. Invalid or expired token."
            : "An error occurred while fetching data."
        );
      }
    };

    fetchData();
  }, [userId, token]);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const isFriendOrRequested = (userIdToCheck) =>
    friends.some((friend) => friend.id === userIdToCheck) ||
    pendingRequests.some((request) => request.receiverId === userIdToCheck);

  const sendFriendRequest = async (receiverId) => {
    try {
      await axios.post(
        "https://wsocket-5.onrender.com/send-request",
        { senderId: userId, receiverId },
        { headers: { Authorization: token } }
      );

      setPendingRequests((prev) => [...prev, { senderId: userId, receiverId, status: "pending" }]);
      alert("Friend request sent successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while sending the friend request.");
    }
  };

  return (
    <div className="p-6 mt-14 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Find Users</h3>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-6"
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <ul className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li key={user.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                <span className="text-gray-700">{user.username}</span>
                {!isFriendOrRequested(user.id) ? (
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Send Request
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">
                    {friends.some((friend) => friend.id === user.id) ? "Already Friends" : "Request Sent"}
                  </span>
                )}
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic text-center">No users found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Users;
