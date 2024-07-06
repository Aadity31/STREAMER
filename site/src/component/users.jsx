import React, { useEffect, useState } from "react";

// Define the users array
const users = [
  {
    id: 1,
    name: "Naruto Uzumaki",
    avatar: "./naruto.jpeg",
    messages: [
      { text: "Hello!", type: "received" },
      { text: "Hi there!", type: "sent" },
    ],
  },
  {
    id: 2,
    name: "Madara Uchiha",
    avatar: "./madara.jpeg",
    messages: [
      { text: "Hey!", type: "received" },
      { text: "What's up?", type: "sent" },
    ],
  },
];

// Define the UserList component
function UserList({ users, onSelectUser }) {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div
          key={user.id}
          className="hover:bg-slate-700 user-item flex items-center p-2 border-b border-gray-700 cursor-pointer"
          onClick={() => onSelectUser(user)} // Pass the whole user object to onSelectUser function
        >
          <img
            src={user.avatar}
            alt={`${user.name}'s avatar`}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="text-white">{user.name}</div>
        </div>
      ))}
    </div>
  );
}

// Export both users array and UserList component
export { users, UserList };
