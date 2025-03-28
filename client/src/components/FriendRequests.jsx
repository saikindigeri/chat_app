import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FriendRequests({ userId, token }) {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  console.log(users);

  useEffect(() => {
    console.log("performing")
    if (token && userId) {
        
      axios.get(`http://localhost:4000/friend-requests/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setRequests(res.data));

      axios.get('http://localhost:4000/users', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => setUsers(res.data));
    }
  }, [token, userId]);

  const sendRequest = (receiverId) => {
    axios.post('http://localhost:4000/send-request', { receiverId }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => alert('Friend request sent!'));
  };

  const acceptRequest = (requestId) => {
    axios.post('http://localhost:4000/accept-request', { requestId }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setRequests(requests.filter((r) => r._id !== requestId)));
  };

  const declineRequest = (requestId) => {
    axios.post('http://localhost:4000/decline-request', { requestId }, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => setRequests(requests.filter((r) => r._id !== requestId)));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
      {requests.map((req) => (
        <div key={req._id} className="flex justify-between p-2 bg-gray-100 mb-2 rounded">
          <span>{req.sender_id.username}</span>
          <button onClick={() => acceptRequest(req._id)} className="bg-green-500 text-white p-1 rounded">
            Accept
          </button>
          <button onClick={() => declineRequest(req._id)} className="bg-green-500 text-white p-1 rounded">
            Decline
          </button>
        </div>
      ))}
      <h3 className="text-lg font-semibold mb-2 mt-4">Add Friends</h3>
      {users.map((user) => (
        <div key={user._id} className="flex justify-between p-2 hover:bg-gray-300 rounded">
          <span>{user.username}</span>
          <button onClick={() => sendRequest(user._id)} className="bg-blue-500 text-white p-1 rounded">
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

export default FriendRequests;