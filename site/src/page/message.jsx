import React, { useState, useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import LeftNavHidden from "./shortnav";
import { UserList } from "../component/users";
import { requests, RequestsList } from "../component/request";

// Utility function to get the current timestamp
function getCurrentTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Utility function to get the current date
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function Message() {
  const [activeTab, setActiveTab] = useState("friends");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null); // Define fileType state
  const fileInputRef = useRef(null);
  const pickerRef = useRef(null);
  const inputRef = useRef();
  const dummy = useRef();
  const [requestList, setRequestList] = useState(requests);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAcceptRequest = (id) => {
    alert(`Request ${id} accepted!`);
    setRequestList(requestList.filter((request) => request.id !== id));
  };

  const handleDeclineRequest = (id) => {
    alert(`Request ${id} declined!`);
    setRequestList(requestList.filter((request) => request.id !== id));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4000/friends", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data["friends"]);
        const formattedUsers = data["friends"].map((friend) => ({
          id: friend.friend_id,
          name: friend.full_name,
          avatar: friend.profile_path,
          messages: [
            {
              text: "Hello!",
              type: "received",
              timestamp: "10:30 AM",
              date: "2023-06-01",
            },
            {
              text: "Hi there!",
              type: "sent",
              timestamp: "10:31 AM",
              date: "2023-06-01",
            },
          ],
        }));


        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message || "Error fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4000/friends", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log();
        const data = await response.json();

        const formattedUsers = data.map((friend) => ({
          id: friend.friend_id,
          name: friend.full_name,
          avatar: friend.profile_path,
          messages: [
            { text: "Hey!", type: "received" },
            { text: "What's up?", type: "sent" },
          ],
        }));

        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message || "Error fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result;
        setFilePreview(fileData);
        setFileType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages(user.messages);
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSendMessage = () => {
    if (selectedUser && (newMessage.trim() || filePreview)) {
      let messageContent;
      if (typeof filePreview === "string") {
        if (filePreview.startsWith("data:image")) {
          messageContent = (
            <img
              src={filePreview}
              alt="Attachment Preview"
              className="max-w-xs"
            />
          );
        } else if (filePreview.startsWith("data:video")) {
          messageContent = (
            <video controls className="max-w-xs">
              <source src={filePreview} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        } else if (filePreview.startsWith("data:application/pdf")) {
          // Render a link to download the PDF file
          messageContent = (
            <a href={filePreview} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          );
        } else {
          // Handle other file types or unsupported types
          messageContent = <div>Unsupported file type</div>;
        }
      } else {
        // Handle non-string types, like ArrayBuffer for non-image files
        messageContent = newMessage;
      }

      const newMessageObject = {
        text: messageContent,
        type: "sent",
        timestamp: getCurrentTimestamp(),
        date: getCurrentDate(),
      };

      // Update the messages state for rendering
      const formdata = new FormData();
      formdata.append("message", messages);

      setMessages([...messages, newMessageObject]);
      setNewMessage("");
      setFilePreview(null);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setPickerVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerRef]);

  const addEmojiToInput = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
    inputRef.current.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
      console.log("Selected emojis:", selectedEmojis);
      console.log("message:", newMessage);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function getWordCount(text) {
    if (typeof text === "string") {
      return text.trim().split(/\s+/).length;
    } else {
      return 0;
    }
  }

  const WORD_LIMIT = 6; // Set the word limit for inline timestamp
  let lastDate = null;

  return (
    <>
      <div className="mt-[-60px] fixed">
        <LeftNavHidden />
      </div>

      <div className="bg-[#0f0f0f2f] scrollbar-thin overflow-none ml-[60px] w-[100%-120px] h-screen  border flex flex-col border-none ">
        <div className="flex h-full mt-auto">
          <div className="min-w-[330px] bg-[#0f0f0f2f]  flex flex-col h-full relative border-r-[1px] border-white ">
            <div className="flex justify-center text-white m-2">Username</div>
            <div className="top-section">
              <div className="flex bg-[#0f0f0f2f]">
                <div
                  className={`w-full relative transition-all duration-300 ease-in-out ${
                    activeTab === "friends"
                      ? "border-b-2 border-[#0988fd]"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  <button
                    className="p-2 w-full bg-transparent text-white cursor-pointer"
                    onClick={() => handleTabClick("friends")}
                  >
                    Friends
                  </button>
                </div>
                <div
                  className={`w-full relative transition-all duration-200 ease-in-out ${
                    activeTab === "groups"
                      ? "border-b-2 border-[#0988fd]"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  <button
                    className="p-2 w-full bg-transparent text-white cursor-pointer"
                    onClick={() => handleTabClick("groups")}
                  >
                    Groups
                  </button>
                </div>
                <div
                  className={`w-full relative transition-all duration-200 ease-in-out ${
                    activeTab === "requests"
                      ? "border-b-2 border-[#0988fd]"
                      : "border-b-2 border-transparent"
                  }`}
                >
                  <button
                    className="p-2 w-full bg-transparent text-white cursor-pointer"
                    onClick={() => handleTabClick("requests")}
                  >
                    Requests
                  </button>
                </div>
              </div>
            </div>
            <div
              className="max-h-full flex-grow scrollbar-thin overflow-hidden hover:overflow-auto text-white "
              id="chat_list"
            >
              {activeTab === "friends" && (
                <div
                  className={`h-full ${
                    users.length === 0 ? "flex items-center justify-center" : ""
                  }`}
                >
                  {users.length > 0 ? (
                    <UserList users={users} onSelectUser={handleSelectUser} />
                  ) : (
                    <div className=" flex flex-col items-center justify-center gap-4">
                      <h1 className="items-center justify-center font-bold">
                        Opps..
                      </h1>
                      <p>You are alone hear</p>
                      <p>Go make some FRIENDS!</p>

                      <button className="p-2 bg-slate-500 hover:bg-slate-700 rounded-lg shadow-lg">
                        Search Friends
                      </button>

                      {/* Add more content or styling as needed */}
                    </div>
                  )}
                </div>
              )}
              {activeTab === "groups" && <div>moye moye groups</div>}
              {activeTab === "requests" && (
                <div
                  className={`h-full ${
                    requests.length === 0
                      ? "flex items-center justify-center"
                      : ""
                  }`}
                >
                  {requests.length > 0 ? (
                    <RequestsList
                      requests={requestList}
                      onSelectRequest={handleSelectRequest}
                      onAcceptRequest={handleAcceptRequest}
                      onDeclineRequest={handleDeclineRequest}
                    />
                  ) : (
                    <div className="dummy-page flex flex-col items-center justify-center p-8 bg-gray-800 rounded-lg shadow-lg">
                      <p>No requests found</p>
                      {/* Add more content or styling as needed */}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedUser ? (
            <div className="w-full flex flex-col h-full bg-[#070707]">
              <div className="flex items-center justify-between relative w-full h-[70px] border-b border-[#a59999] bg-neutral-950 p-2">
                <div className=" flex-1 relative">
                  <div className="flex flex-row bg-transparent items-center">
                    <div className="relative mr-4">
                      <img
                        src={selectedUser.avatar}
                        id="chatter_pic"
                        className="user-avatar rounded-full size-12 object-cover"
                        alt="User Avatar"
                      />
                      {selectedUser.isActive && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-[1px] border-green-600 rounded-full"></span>
                      )}
                    </div>
                    <div className="font-mono text-white ml-2 flex flex-col font-extrabold">
                      <span id="chatter_username">{selectedUser.name}</span>
                    </div>
                  </div>
                </div>
                <div className="call-icons flex">
                  <div
                    className="audio-call-icon text-white text-2xl mr-6 cursor-pointer"
                    // onClick={handleAudioCallClick}
                  >
                    <svg
                      width="35px"
                      height="35px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M15.1008 15.0272L15.6446 15.5437V15.5437L15.1008 15.0272ZM15.5562 14.5477L15.0124 14.0312V14.0312L15.5562 14.5477ZM17.9729 14.2123L17.5987 14.8623H17.5987L17.9729 14.2123ZM19.8834 15.312L19.5092 15.962L19.8834 15.312ZM20.4217 18.7584L20.9655 19.275L20.9655 19.2749L20.4217 18.7584ZM19.0012 20.254L18.4574 19.7375L19.0012 20.254ZM17.6763 20.9631L17.75 21.7095L17.6763 20.9631ZM7.8154 16.4752L8.3592 15.9587L7.8154 16.4752ZM3.75185 6.92574C3.72965 6.51212 3.37635 6.19481 2.96273 6.21701C2.54911 6.23921 2.23181 6.59252 2.25401 7.00613L3.75185 6.92574ZM9.19075 8.80507L9.73454 9.32159L9.19075 8.80507ZM9.47756 8.50311L10.0214 9.01963L9.47756 8.50311ZM9.63428 5.6931L10.2467 5.26012L9.63428 5.6931ZM8.3733 3.90961L7.7609 4.3426V4.3426L8.3733 3.90961ZM4.7177 3.09213C4.43244 3.39246 4.44465 3.86717 4.74498 4.15244C5.04531 4.4377 5.52002 4.42549 5.80529 4.12516L4.7177 3.09213ZM11.0632 13.0559L11.607 12.5394L11.0632 13.0559ZM10.6641 19.8123C11.0148 20.0327 11.4778 19.9271 11.6982 19.5764C11.9186 19.2257 11.8129 18.7627 11.4622 18.5423L10.6641 19.8123ZM15.113 20.0584C14.7076 19.9735 14.3101 20.2334 14.2252 20.6388C14.1403 21.0442 14.4001 21.4417 14.8056 21.5266L15.113 20.0584ZM15.6446 15.5437L16.1 15.0642L15.0124 14.0312L14.557 14.5107L15.6446 15.5437ZM17.5987 14.8623L19.5092 15.962L20.2575 14.662L18.347 13.5623L17.5987 14.8623ZM19.8779 18.2419L18.4574 19.7375L19.545 20.7705L20.9655 19.275L19.8779 18.2419ZM8.3592 15.9587C4.48307 11.8778 3.83289 8.43556 3.75185 6.92574L2.25401 7.00613C2.35326 8.85536 3.13844 12.6403 7.27161 16.9917L8.3592 15.9587ZM9.73454 9.32159L10.0214 9.01963L8.93377 7.9866L8.64695 8.28856L9.73454 9.32159ZM10.2467 5.26012L8.98569 3.47663L7.7609 4.3426L9.02189 6.12608L10.2467 5.26012ZM9.19075 8.80507C8.64695 8.28856 8.64626 8.28929 8.64556 8.29002C8.64533 8.29028 8.64463 8.29102 8.64415 8.29152C8.6432 8.29254 8.64223 8.29357 8.64125 8.29463C8.63928 8.29675 8.63724 8.29896 8.63515 8.30127C8.63095 8.30588 8.6265 8.31087 8.62182 8.31625C8.61247 8.32701 8.60219 8.33931 8.5912 8.3532C8.56922 8.38098 8.54435 8.41511 8.51826 8.45588C8.46595 8.53764 8.40921 8.64531 8.36117 8.78033C8.26346 9.0549 8.21022 9.4185 8.27675 9.87257C8.40746 10.7647 8.99202 11.9644 10.5194 13.5724L11.607 12.5394C10.1793 11.0363 9.82765 10.1106 9.7609 9.65511C9.72871 9.43536 9.76142 9.31957 9.77436 9.28321C9.78163 9.26277 9.78639 9.25709 9.78174 9.26437C9.77948 9.26789 9.77498 9.27451 9.76742 9.28407C9.76363 9.28885 9.75908 9.29437 9.75364 9.30063C9.75092 9.30375 9.74798 9.30706 9.7448 9.31056C9.74321 9.31231 9.74156 9.3141 9.73985 9.31594C9.739 9.31686 9.73813 9.31779 9.73724 9.31873C9.7368 9.3192 9.73612 9.31992 9.7359 9.32015C9.73522 9.32087 9.73454 9.32159 9.19075 8.80507ZM10.5194 13.5724C12.0422 15.1757 13.1924 15.806 14.0699 15.9485C14.5201 16.0216 14.8846 15.9632 15.1606 15.8544C15.2955 15.8012 15.4023 15.7387 15.4824 15.6819C15.5223 15.6535 15.5556 15.6266 15.5825 15.6031C15.5959 15.5913 15.6078 15.5803 15.6181 15.5703C15.6233 15.5654 15.628 15.5606 15.6324 15.5562C15.6346 15.554 15.6368 15.5518 15.6388 15.5497C15.6398 15.5487 15.6408 15.5477 15.6417 15.5467C15.6422 15.5462 15.6429 15.5454 15.6432 15.5452C15.6439 15.5444 15.6446 15.5437 15.1008 15.0272C14.557 14.5107 14.5577 14.51 14.5583 14.5093C14.5586 14.509 14.5592 14.5083 14.5597 14.5078C14.5606 14.5069 14.5615 14.506 14.5623 14.5051C14.5641 14.5033 14.5658 14.5015 14.5675 14.4998C14.5708 14.4965 14.574 14.4933 14.577 14.4904C14.5831 14.4846 14.5885 14.4796 14.5933 14.4754C14.6029 14.467 14.61 14.4616 14.6146 14.4584C14.6239 14.4517 14.623 14.454 14.6102 14.459C14.5909 14.4666 14.5001 14.4987 14.3103 14.4679C13.9078 14.4025 13.0391 14.0472 11.607 12.5394L10.5194 13.5724ZM8.98569 3.47663C7.9721 2.04305 5.94388 1.80119 4.7177 3.09213L5.80529 4.12516C6.32812 3.57471 7.24855 3.61795 7.7609 4.3426L8.98569 3.47663ZM18.4574 19.7375C18.1783 20.0313 17.8864 20.1887 17.6026 20.2167L17.75 21.7095C18.497 21.6357 19.1016 21.2373 19.545 20.7705L18.4574 19.7375ZM10.0214 9.01963C10.9889 8.00095 11.0574 6.40678 10.2467 5.26012L9.02189 6.12608C9.44404 6.72315 9.3793 7.51753 8.93377 7.9866L10.0214 9.01963ZM19.5092 15.962C20.3301 16.4345 20.4907 17.5968 19.8779 18.2419L20.9655 19.2749C22.2705 17.901 21.8904 15.6019 20.2575 14.662L19.5092 15.962ZM16.1 15.0642C16.4854 14.6584 17.086 14.5672 17.5987 14.8623L18.347 13.5623C17.2485 12.93 15.8862 13.1113 15.0124 14.0312L16.1 15.0642ZM11.4622 18.5423C10.4785 17.9241 9.43149 17.0876 8.3592 15.9587L7.27161 16.9917C8.42564 18.2067 9.56897 19.1241 10.6641 19.8123L11.4622 18.5423ZM17.6026 20.2167C17.0561 20.2707 16.1912 20.2842 15.113 20.0584L14.8056 21.5266C16.0541 21.788 17.0742 21.7762 17.75 21.7095L17.6026 20.2167Z"
                          fill="#f0f4ff"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <div
                    className="video-call-icon text-white text-2xl cursor-pointer mr-4"
                    // onClick={handleVideoCallClick}
                  >
                    <svg
                      width="35px"
                      height="35px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
                          stroke="#ffffff"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </g>
                    </svg>
                  </div>
                  <button
                    className="video-call-icon text-white text-2xl cursor-pointer mr-2"
                    // onClick={handleVideoCallClick}
                  >
                    <svg
                      width="35px"
                      height="35px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(90)matrix(1, 0, 0, 1, 0, 0)"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12"
                          stroke="#ffffff"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                        <circle
                          cx="12"
                          cy="12"
                          r="2"
                          stroke="#ffffff"
                          stroke-width="1.5"
                        ></circle>
                        <path
                          d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10"
                          stroke="#ffffff"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        ></path>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col mr-1 scrollbar-thin overflow-y-auto bg-[#020202] h-[calc(100% - 70px)]">
                <main className="flex flex-col items-end h-full scrollbar-thin overflow-y-auto overflow-x-hidden size-auto text-white p-1">
                  <div className="w-full flex items-center justify-center h-80 bg-transparent">
                    <div className="flex flex-col bg-transparent items-center">
                      <div className="relative mr-4">
                        <img
                          src={selectedUser.avatar}
                          id="chatter_pic"
                          className="user-avatar rounded-full size-40 object-cover"
                          alt="User Avatar"
                        />
                      </div>
                      <div className="font-mono text-white text-3xl flex flex-col font-extrabold">
                        <span id="chatter_username">{selectedUser.name}</span>
                        <span id="chatter_bio">{selectedUser.bio}</span>
                      </div>
                      <div className="flex items-center text-base font-bold mt-4">
                        <button className="text-white px-3 py-1 rounded-md transition ease-in-out delay-150 bg-gray-700  hover:bg-indigo-500 duration-300">
                          User Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {messages.map((message, index) => {
                    const showDateSeparator = message.date !== lastDate;
                    lastDate = message.date;
                    return (
                      <React.Fragment key={index}>
                        {showDateSeparator && (
                          <div className="relative my-4 w-full flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-double animate-pulse border-gray-400"></div>
                            </div>
                            <div className="relative bg-[#020202] text-xs px-2 text-gray-400">
                              {new Date(message.date).toLocaleDateString([], {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        )}
                        <div
                          className={`p-2 rounded-lg mb-2 max-w-[65%] ${
                            message.type === "sent"
                              ? "bg-gray-700 self-end"
                              : "bg-gray-600 self-start"
                          }`}
                          style={{ overflowWrap: "break-word" }}
                        >
                          {message.type === "file" && (
                            <div className="attachment-preview">
                              {message.fileType.startsWith("image") ? (
                                <img
                                  src={message.filePreview}
                                  alt="Attachment Preview"
                                  className="max-w-xs"
                                />
                              ) : message.fileType.startsWith("video") ? (
                                <video controls className="max-w-xs">
                                  <source
                                    src={message.filePreview}
                                    type={message.fileType}
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : message.fileType.startsWith(
                                  "application/pdf"
                                ) ? (
                                <embed
                                  src={message.filePreview}
                                  type="application/pdf"
                                  className="max-w-xs"
                                />
                              ) : (
                                <div>Unsupported file type</div>
                              )}
                            </div>
                          )}
                          <div className="message-text">
                            {message.text}
                            {getWordCount(message.text) <= WORD_LIMIT && (
                              <span className="timestamp-inline text-[9px]  text-right text-gray-300 ml-2">
                                {message.timestamp}
                              </span>
                            )}
                          </div>
                          {getWordCount(message.text) > WORD_LIMIT && (
                            <div className="text-[9px] line-clamp-1 text-gray-300 text-right mt-1">
                              {message.timestamp}
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}

                  <span ref={dummy}></span>
                </main>
              </div>
              {filePreview && (
                <div className="attachment-preview">
                  {fileType.startsWith("image") ? (
                    <img
                      src={filePreview}
                      alt="Attachment Preview"
                      className="max-w-xs"
                    />
                  ) : fileType.startsWith("video") ? (
                    <video controls className="max-w-xs">
                      <source src={filePreview} type={fileType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : fileType.startsWith("application/pdf") ||
                    fileType.startsWith("text") ? (
                    <embed
                      src={filePreview}
                      type={fileType}
                      className="max-w-xs"
                    />
                  ) : (
                    <div>Unsupported file type</div>
                  )}
                </div>
              )}

              <div className="bottom-0 h-[70px] left-0 bg-[#020202]  flex items-center">
                <div className="mx-3 rounded-full flex items-center border w-full md:w-full border-[#999191] relative">
                  <div className="flex items-center w-full">
                    <button
                      id="emojiPickerButton"
                      onClick={() => {
                        setPickerVisible(!isPickerVisible);
                        inputRef.current.focus();
                      }}
                      className="text-white text-4xl  p-1 cursor-pointer bg-transparent border-none outline-none hover:bg-[#0c0c0c] hover:rounded-l-3xl"
                    >
                      <svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z"
                            fill="#ffffff"
                          ></path>
                          <path
                            d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z"
                            fill="#ffffff"
                          ></path>
                          <path
                            d="M8.88875 13.5414C8.63822 13.0559 8.0431 12.8607 7.55301 13.1058C7.05903 13.3528 6.8588 13.9535 7.10579 14.4474C7.18825 14.6118 7.29326 14.7659 7.40334 14.9127C7.58615 15.1565 7.8621 15.4704 8.25052 15.7811C9.04005 16.4127 10.2573 17.0002 12.0002 17.0002C13.7431 17.0002 14.9604 16.4127 15.7499 15.7811C16.1383 15.4704 16.4143 15.1565 16.5971 14.9127C16.7076 14.7654 16.8081 14.6113 16.8941 14.4485C17.1387 13.961 16.9352 13.3497 16.4474 13.1058C15.9573 12.8607 15.3622 13.0559 15.1117 13.5414C15.0979 13.5663 14.9097 13.892 14.5005 14.2194C14.0401 14.5877 13.2573 15.0002 12.0002 15.0002C10.7431 15.0002 9.96038 14.5877 9.49991 14.2194C9.09071 13.892 8.90255 13.5663 8.88875 13.5414Z"
                            fill="#ffffff"
                          ></path>
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z"
                            fill="#ffffff"
                          ></path>
                        </g>
                      </svg>
                    </button>
                    {isPickerVisible && (
                      <div
                        ref={pickerRef}
                        className="absolute bottom-full left-0"
                      >
                        <Picker
                          data={data}
                          pickerStyle={{ width: "10%", height: "10%" }}
                          previewPosition="none"
                          onEmojiSelect={(e) => {
                            addEmojiToInput(e.native);
                            setSelectedEmojis((prevEmojis) => [
                              ...prevEmojis,
                              e.native,
                            ]);
                          }}
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      ref={inputRef}
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="p-1 w-full outline-none bg-transparent text-white"
                    />
                    <button
                      id="fileInputButton"
                      onClick={handleClick}
                      className="text-white text-2xl p-1 cursor-pointer bg-transparent border-none outline-none hover:bg-[#0c0c0c] hover:rounded-full"
                    >
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="rotate(-45)"
                      >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <g id="attachment">
                            <g id="attachment_2">
                              <path
                                id="Combined Shape"
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M26.4252 29.1104L39.5729 15.9627C42.3094 13.2262 42.3094 8.78901 39.5729 6.05248C36.8364 3.31601 32.4015 3.31601 29.663 6.05218L16.4487 19.2665L16.4251 19.2909L8.92989 26.7861C5.02337 30.6926 5.02337 37.0238 8.92989 40.9303C12.8344 44.8348 19.1656 44.8348 23.0701 40.9303L41.7835 22.2169C42.174 21.8264 42.174 21.1933 41.7835 20.8027C41.3929 20.4122 40.7598 20.4122 40.3693 20.8027L21.6559 39.5161C18.5324 42.6396 13.4676 42.6396 10.3441 39.5161C7.21863 36.3906 7.21863 31.3258 10.3441 28.2003L30.1421 8.4023L30.1657 8.37788L31.0769 7.4667C33.0341 5.51117 36.2032 5.51117 38.1587 7.4667C40.1142 9.42217 40.1142 12.593 38.1587 14.5485L28.282 24.4252C28.2748 24.4319 28.2678 24.4388 28.2608 24.4458L25.0064 27.7008L24.9447 27.7625C24.9437 27.7635 24.9427 27.7644 24.9418 27.7654L17.3988 35.3097C16.6139 36.0934 15.3401 36.0934 14.5545 35.3091C13.7714 34.5247 13.7714 33.2509 14.5557 32.4653L24.479 22.544C24.8696 22.1535 24.8697 21.5203 24.4792 21.1298C24.0887 20.7392 23.4555 20.7391 23.065 21.1296L13.141 31.0516C11.5766 32.6187 11.5766 35.1569 13.1403 36.7233C14.7079 38.2882 17.2461 38.2882 18.8125 36.7245L26.3589 29.1767L26.4252 29.1104Z"
                                fill="#ffffff"
                              ></path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                  <button
                    id="sendButton"
                    onClick={handleSendMessage}
                    className="  bg-transparent font-mono  text-white px-3 py-2 rounded-full hover:text-blue-600"
                  >
                    <svg
                      width="25px"
                      height="25px"
                      viewBox="0 0 32 32"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#000000"
                      stroke="#000000"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>send-email</title>
                        <desc>Created with Sketch Beta.</desc> <defs> </defs>
                        <g
                          id="Page-1"
                          stroke="none"
                          stroke-width="1"
                          fill="none"
                          fill-rule="evenodd"
                        >
                          <g
                            id="Icon-Set-Filled"
                            transform="translate(-570.000000, -257.000000)"
                            fill="#ffffff"
                          >
                            <path
                              d="M580.407,278.75 C581.743,281.205 586,289 586,289 C586,289 601.75,258.5 602,258 L602.02,257.91 L580.407,278.75 L580.407,278.75 Z M570,272 C570,272 577.298,276.381 579.345,277.597 L601,257 C598.536,258.194 570,272 570,272 L570,272 Z"
                              id="send-email"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center  h-full bg-[#000000]">
              <div className="flex flex-col mx-auto items-center justify-center align-center">
                <img
                  className="align-center opacity-70"
                  src="/siteimage/logo.png"
                  alt="Streamer Logo"
                  width={80}
                  height={80}
                />
                <div className="text-white font-serif mt-2 text-xl font-bold ">
                  STREAMER
                </div>
              </div>
              <div className="text-stone-100 font-serif mt-4 text-xl font-bold">
                select user to chat
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Message;
