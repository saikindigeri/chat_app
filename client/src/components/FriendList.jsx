"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { UserIcon } from "@heroicons/react/24/solid";

function FriendList({ setSelectedFriend }) {
  const [friends, setFriends] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (token && userId) {
      console.log("Fetching friends with:", { token, userId });
      axios
        .get(`https://chat-app-2-v2fo.onrender.com/api/friends/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Friends fetched:", res.data);
          setFriends(res.data);
        })
        .catch((err) => console.error("Error fetching friends:", err.response?.data || err.message));
    }
  }, [token, userId]);

  return (
    <div className="bg-white/80 backdrop-blur-md h-[360px] rounded-xl p-4 w-full ">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <UserIcon className="h-5 w-5 text-black-" />
        Friends 
      </h3>
      <div className="space-y-3   scrollbar-thin scrollbar-thumb-black-300 scrollbar-track-gray-100">
        {friends.length > 0 ? (
          friends.map((friend, index) => (
            <motion.div
              key={friend._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}
              onClick={() => setSelectedFriend(friend)}
              role="button"
              tabIndex={0}
              aria-label={`Select friend ${friend.username || "Unknown"}`}
              onKeyPress={(e) => e.key === "Enter" && setSelectedFriend(friend)}
              className="p-3 flex items-center gap-3 bg-white/50 rounded-lg border border-gray-200 hover:bg-gray-200 hover:text-white cursor-pointer transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-black font-medium">
                {friend.avatar ? (
                  <img
                    src={friend.avatar}
                    alt={`${friend.username} avatar`}
                    className="w-full h-full object-cover"
                    onError={() =>
                      console.log(`Failed to load avatar for ${friend.username}`)
                    }
                  />
                ) : (
                  friend.username?.charAt(0).toUpperCase() || "?"
                )}
              </div>
              <span className="text-gray-800  leading-3 gap-2">
                {friend.username || "Unknown"}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4 text-sm">No friends yet</p>
        )}
      </div>
    </div>
  );
}

export default FriendList;