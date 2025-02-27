import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const userId = localStorage.getItem("userId");
console.log(users)
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is missing.");
        return;
      }

      try {
        const response = await axios.get(
          "https://chat-app-9l0g.onrender.com/users",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setUsers(response.data);

        const friendsResponse = await axios.get(
          `https://chat-app-9l0g.onrender.com/friends/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const requestsResponse = await axios.get(
          `https://chat-app-9l0g.onrender.com/pending-requests/${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setFriends(friendsResponse.data);
        setPendingRequests(requestsResponse.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Invalid or expired token.");
        } else {
          setError("An error occurred while fetching data.");
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const isFriendOrRequested = (userIdToCheck) => {
    return (
      friends.some((friend) => friend.id === userIdToCheck) ||
      pendingRequests.some((request) => request.receiverId === userIdToCheck)
    );
  };

  const sendFriendRequest = async (receiverId) => {
    try {
      const response = await axios.post(
        "https://chat-app-9l0g.onrender.com/send-request",
        { senderId: userId, receiverId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      alert(response.data.message);

      setPendingRequests((prev) => [
        ...prev,
        { senderId: userId, receiverId, status: "pending" },
      ]);
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("An error occurred while sending the friend request.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="p-6 mt-14 bg-gray-100 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Find Users
          </h3>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <span className="text-gray-700">{user.username}</span>
                {!isFriendOrRequested(user.id) ? (
                  <button
                    onClick={() => sendFriendRequest(user.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                  >
                    Send Request
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">
                    {friends.some((friend) => friend.id === user.id)
                      ? "Already Friends"
                      : "Request Sent"}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {error && (
            <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Users;
