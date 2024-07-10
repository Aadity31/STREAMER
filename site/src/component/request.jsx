import React from "react";

const requests = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://example.com/avatar1.jpg",
    isActive: true,
    messages: [
      { type: "sent", text: "Hey, how are you?" },
      { type: "received", text: "I'm good, thanks!" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://example.com/avatar2.jpg",
    isActive: false,
    messages: [
      { type: "sent", text: "Can we reschedule our meeting?" },
      { type: "received", text: "Sure, what time works for you?" },
    ],
  },
  // Add more request objects as needed
];

function RequestsList({
  requests,
  onSelectRequest,
  onAcceptRequest,
  onDeclineRequest,
}) {
  return (
    <div className="ml-1">
      {requests.map((request) => {
        const lastSentMessage = request.messages
          .filter((msg) => msg.type === "sent")
          .pop();
        return (
          <div
            key={request.id}
            className="hover:bg-[#0e0e0e] user-item flex items-center p-2 cursor-pointer after:hover:bg-slate-400"
            onClick={() => onSelectRequest(request)} // Pass the whole  object to onSelectRequest function
          >
            <div className="relative mr-4">
              <img
                src={request.avatar}
                alt={`${request.name}'s avatar`}
                className="size-10 rounded-full object-cover"
              />
              {request.isActive && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-[1px] border-white rounded-full"></span>
              )}
            </div>
            <div className="text-white flex-1">
              <div>{request.name}</div>
              {lastSentMessage && (
                <div className="text-gray-400 text-sm">
                  {lastSentMessage.text.length > 20
                    ? lastSentMessage.text.substring(0, 20) + "..."
                    : lastSentMessage.text}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onAcceptRequest(request.id);
                }}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeclineRequest(request.id);
                }}
              >
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { requests, RequestsList };
