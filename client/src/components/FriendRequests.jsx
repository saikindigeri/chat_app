import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendRequests({ userId, token }) {
  const [requests, setRequests] = useState([]); // Received friend requests
  const [users, setUsers] = useState([]); // All users
  const [friends, setFriends] = useState([]); // Accepted friends
  const [pendingRequests, setPendingRequests] = useState([]); // Sent pending requests

  // Fetch received friend requests
  useEffect(() => {
    if (token && userId) {
      axios
        .get(`http://localhost:4000/friend-requests/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setRequests(res.data))
        .catch((err) => console.error('Error fetching requests:', err));

      // Fetch all users
      axios
        .get('http://localhost:4000/users', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Error fetching users:', err));

      // Fetch accepted friends
      axios
        .get('http://localhost:4000/friend-requests/accepted', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setFriends(res.data.map((f) => f.sender_id === userId ? f.receiver_id : f.sender_id)))
        .catch((err) => console.error('Error fetching friends:', err));

      // Fetch sent pending requests
      axios
        .get('http://localhost:4000/friend-requests/pending', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPendingRequests(res.data.map((r) => r.receiver_id)))
        .catch((err) => console.error('Error fetching pending requests:', err));
    }
  }, [token, userId]);

  const sendRequest = async (receiverId) => {
    try {
      const res = await axios.post(
        'http://localhost:4000/send-request',
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
        'http://localhost:4000/accept-request',
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
        'http://localhost:4000/decline-request',
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
    <div>
      <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
      {requests.length > 0 ? (
        requests.map((req) => (
          <div key={req._id} className="flex justify-between p-2 bg-gray-100 mb-2 rounded">
            <span>{req.sender_id.username || 'Unknown User'}</span>
            <div>
              <button
                onClick={() => acceptRequest(req._id)}
                className="bg-green-500 text-white p-1 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => declineRequest(req._id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending requests</p>
      )}

      <h3 className="text-lg font-semibold mb-2 mt-4">Add Friends</h3>
      {users.length > 0 ? (
        users
          .filter((user) => user._id !== userId) // Exclude self
          .map((user) => {
            const isFriend = friends.includes(user._id);
            const isPending = pendingRequests.includes(user._id);

            return (
              <div key={user._id} className="flex justify-between p-2 hover:bg-gray-300 rounded">
                <span>{user.username}</span>
                <button
                  onClick={() => sendRequest(user._id)}
                  disabled={isFriend || isPending}
                  className={`p-1 rounded ${
                    isFriend || isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white'
                  }`}
                >
                  {isFriend ? 'Already Friends' : isPending ? 'Request Pending' : 'Add'}
                </button>
              </div>
            );
          })
      ) : (
        <p>Loading users...</p>
      )}
    </div>
  );
}

export default FriendRequests;