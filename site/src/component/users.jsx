import React from "react";

// Define the UserList component
function UserList({ users, onSelectUser }) {
  return (
    <div className="user-list ml-1">
      {users.map((user) => {
        const lastSentMessage = user.messages
          .filter((msg) => msg.type === "sent")
          .pop();
        return (
          <div
            key={user.id}
            className="hover:bg-[#0e0e0e] user-item flex items-center p-2 cursor-pointer"
            onClick={() => onSelectUser(user)} // Pass the whole user object to onSelectUser function
          >
            <div className="relative mr-4">
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="size-10 rounded-full bg-cover"
              />
              {user.isActive && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-[1px] border-white rounded-full"></span>
              )}
            </div>
            <div className="text-white">
              <div>{user.name}</div>
              {lastSentMessage && (
                <div className="text-gray-400 text-sm">
                  {lastSentMessage.text.length > 20
                    ? lastSentMessage.text.substring(0, 20) + "..."
                    : lastSentMessage.text}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export both users array and UserList component
export { UserList };
