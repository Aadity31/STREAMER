import React, { useState, useEffect } from "react";
import axios from "axios";
import PostComponent from "../component/PostComponent";
import FlashComponent from "../component/FlashComponent";
import { Link } from "react-router-dom";

const Leftnav = () => {
  const [showOptions, setShowOptions] = useState(false);

  const [showPostPopUp, setShowPostPopUp] = useState(false);
  const [showFlashPopUp, setShowFlashPopUp] = useState(false);

  const togglePostPopUp = () => {
    setShowPostPopUp(!showPostPopUp);
  };

  const toggleFlashPopUp = () => {
    setShowFlashPopUp(!showFlashPopUp);
  };

  const [userData, setUserData] = useState(null); // State to store user data (username and profile_path)

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    // Fetch user data (username and profile_path) when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/username`, {
          withCredentials: true, // Send cookies with the request
        });
        setUserData(response.data); // Set user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Call the fetchUserData function
  }, []);

  return (
    <>
      <div className="flex z-50 bg-black">
        <div className="w-[268px] h-screen border-r border-white z-50 bg-black p-4 fixed">
          <div className="flex items-center justify-center mb-3 text-white text-2xl font-mono">
            STREAMER
          </div>

          <Link
            to="/profile"
            className="mb-3 flex items-center hover:bg-gray-800 rounded-lg p-2 text-white font-bold w-full"
          >
            <img
              src={userData?.profile_path || "/siteimage/no.png"}
              alt="Profile "
              className="w-12 h-12 object-cover object-center rounded-full mr-4"
            />
            {userData?.full_name}
          </Link>

          <Link
            to="/feed"
            className="mb-3 flex items-center hover:bg-gray-800 rounded-lg p-2 w-full"
          >
            <div className="mr-4">
              <HomeIcone />
            </div>
            <div className="text-white font-bold">Home</div>
          </Link>

          <Link
            to="/message"
            className="mb-3 flex items-center hover:bg-gray-800 rounded-lg p-2 w-full"
          >
            <div className="mr-4">
              <MessageIcone />
            </div>
            <div className="text-white font-bold">Message</div>
          </Link>
          <button className="mb-3 flex items-center hover:bg-gray-800 rounded-lg p-2 w-full">
            <div className="mr-4">
              <NotificationIcon />
            </div>
            <div className="text-white font-bold">Notification</div>
          </button>
          <button
            className="mb-2 flex items-center hover:bg-gray-800 rounded-lg p-2 w-full"
            onClick={() => setShowOptions(!showOptions)}
          >
            <div className="mr-4">
              <CreateIcone />
            </div>
            <div className="text-white font-bold relative">Create</div>
          </button>

          {showOptions && (
            <div
              className={`text-white flex flex-col items-center rounded-b-lg ease-out transform scale-95 duration-1000 ${
                showOptions ? "opacity-100 scale-100" : "opacity-50 scale-50"
              }`}
            >
              <button
                className="flex items-center hover:bg-gray-800 rounded-lg p-2 w-full"
                onClick={togglePostPopUp}
              >
                <div className="mr-4">
                  <PostIcon />
                </div>
                <div className="text-white font-normal">Post</div>
              </button>
              <button
                className="flex items-center hover:bg-gray-800 rounded-lg p-2 w-full"
                onClick={toggleFlashPopUp}
              >
                <div className="mr-4">
                  <FlashyIcon />
                </div>
                <div className="text-white font-normal">Flash</div>
              </button>
            </div>
          )}
          <Link
            to="/shorts"
            className="mb-3 flex items-center hover:bg-gray-800 rounded-lg p-2 w-full"
          >
            <div className="mr-4">
              <WatchIcon />
            </div>
            <div className="text-white font-bold">Watch</div>
          </Link>

          <hr className="border-gray-400 my-4" />
        </div>
      </div>
      {showPostPopUp && <PostComponent onClose={togglePostPopUp} />}
      {showFlashPopUp && <FlashComponent onClose={toggleFlashPopUp} />}
    </>
  );
};

const HomeIcone = () => {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        ></path>
        <path
          d="M15 18H9"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
        ></path>
      </g>
    </svg>
  );
};

const MessageIcone = () => {
  return (
    <svg
      width="45px"
      height="45px"
      viewBox="0 0 24 24"
      fill="none"
      id="SVGRepo_bgCarrier"
      stroke-width="0"
    >
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M8 9.5H15M8 13.5H13M15.6953 19.2318L19.1027 20.3676C19.8845 20.6282 20.6282 19.8844 20.3676 19.1027L19.2318 15.6953M15.3 19.1C15.3 19.1 14.0847 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5C20 14 19.1 15.3 19.1 15.3"
          stroke="#ffffff"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
};

const NotificationIcon = () => {
  return (
    <svg
      width="45px"
      height="45px"
      viewBox="0 0 24.00 24.00"
      fill="none"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003"
          stroke="#ffffff"
          stroke-width="1.9200000000000004"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
};

const CreateIcone = () => {
  return (
    <svg
      width="45px"
      height="45px"
      viewBox="-2.4 -2.4 28.80 28.80"
      fill="none"
      stroke="#ffffff"
      stroke-width="0.24000000000000005"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#CCCCCC"
        stroke-width="1.248"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z"
          fill="#ffffff"
        ></path>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.0574 1.25H11.9426C9.63424 1.24999 7.82519 1.24998 6.41371 1.43975C4.96897 1.63399 3.82895 2.03933 2.93414 2.93414C2.03933 3.82895 1.63399 4.96897 1.43975 6.41371C1.24998 7.82519 1.24999 9.63422 1.25 11.9426V12.0574C1.24999 14.3658 1.24998 16.1748 1.43975 17.5863C1.63399 19.031 2.03933 20.1711 2.93414 21.0659C3.82895 21.9607 4.96897 22.366 6.41371 22.5603C7.82519 22.75 9.63423 22.75 11.9426 22.75H12.0574C14.3658 22.75 16.1748 22.75 17.5863 22.5603C19.031 22.366 20.1711 21.9607 21.0659 21.0659C21.9607 20.1711 22.366 19.031 22.5603 17.5863C22.75 16.1748 22.75 14.3658 22.75 12.0574V11.9426C22.75 9.63423 22.75 7.82519 22.5603 6.41371C22.366 4.96897 21.9607 3.82895 21.0659 2.93414C20.1711 2.03933 19.031 1.63399 17.5863 1.43975C16.1748 1.24998 14.3658 1.24999 12.0574 1.25ZM3.9948 3.9948C4.56445 3.42514 5.33517 3.09825 6.61358 2.92637C7.91356 2.75159 9.62177 2.75 12 2.75C14.3782 2.75 16.0864 2.75159 17.3864 2.92637C18.6648 3.09825 19.4355 3.42514 20.0052 3.9948C20.5749 4.56445 20.9018 5.33517 21.0736 6.61358C21.2484 7.91356 21.25 9.62177 21.25 12C21.25 14.3782 21.2484 16.0864 21.0736 17.3864C20.9018 18.6648 20.5749 19.4355 20.0052 20.0052C19.4355 20.5749 18.6648 20.9018 17.3864 21.0736C16.0864 21.2484 14.3782 21.25 12 21.25C9.62177 21.25 7.91356 21.2484 6.61358 21.0736C5.33517 20.9018 4.56445 20.5749 3.9948 20.0052C3.42514 19.4355 3.09825 18.6648 2.92637 17.3864C2.75159 16.0864 2.75 14.3782 2.75 12C2.75 9.62177 2.75159 7.91356 2.92637 6.61358C3.09825 5.33517 3.42514 4.56445 3.9948 3.9948Z"
          fill="#ffffff"
        ></path>
      </g>
    </svg>
  );
};

const WatchIcon = () => {
  return (
    <svg
      width="45px"
      height="45px"
      viewBox="-2.4 -2.4 28.80 28.80"
      fill="none"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#CCCCCC"
        stroke-width="0.096"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15Z"
          stroke="#ffffff"
          stroke-width="1.9200000000000004"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M2.52002 7.11011H21.48"
          stroke="#ffffff"
          s
          troke-width="1.9200000000000004"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M8.52002 2.11011V6.97011"
          stroke="#ffffff"
          stroke-width="1.9200000000000004"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M15.48 2.11011V6.52011"
          stroke="#ffffff"
          stroke-width="1.9200000000000004"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M9.75 14.4501V13.2501C9.75 11.7101 10.84 11.0801 12.17 11.8501L13.21 12.4501L14.25 13.0501C15.58 13.8201 15.58 15.0801 14.25 15.8501L13.21 16.4501L12.17 17.0501C10.84 17.8201 9.75 17.1901 9.75 15.6501V14.4501V14.4501Z"
          stroke="#ffffff"
          stroke-width="1.9200000000000004"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
};

const PostIcon = () => {
  return (
    <svg
      width="25px"
      height="25px"
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
        {" "}
        <path
          d="M4 1H11C11.5523 1 12 1.44772 12 2Lnan nanL12 2C12 2.55228 11.5523 3 11 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V13C21 12.4477 21.4477 12 22 12Lnan nanL22 12C22.5523 12 23 12.4477 23 13V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1Z"
          fill="#ffffff"
        ></path>{" "}
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M21.3056 1.87868C20.1341 0.707107 18.2346 0.707107 17.063 1.87868L6.38904 12.5526C5.9856 12.9561 5.70557 13.4662 5.5818 14.0232L5.04903 16.4206C4.73147 17.8496 6.00627 19.1244 7.43526 18.8069L9.83272 18.2741C10.3897 18.1503 10.8998 17.8703 11.3033 17.4669L21.9772 6.79289C23.1488 5.62132 23.1488 3.72183 21.9772 2.55025L21.3056 1.87868ZM18.4772 3.29289C18.8677 2.90237 19.5009 2.90237 19.8914 3.29289L20.563 3.96447C20.9535 4.35499 20.9535 4.98816 20.563 5.37868L18.6414 7.30026L16.5556 5.21448L18.4772 3.29289ZM15.1414 6.62869L7.80325 13.9669C7.66877 14.1013 7.57543 14.2714 7.53417 14.457L7.0014 16.8545L9.39886 16.3217C9.58452 16.2805 9.75456 16.1871 9.88904 16.0526L17.2272 8.71448L15.1414 6.62869Z"
          fill="#ffffff"
        ></path>{" "}
      </g>
    </svg>
  );
};

const FlashyIcon = () => {
  return (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      fill="#000000"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          fill="#ffffff"
          d="M20.22 21.75v65.5l92 70.625-60.126 58.094 235.656 157.5-83.844-5.845 93.25 76.53-77.562 5.47 113.5 40.656-4.625-69.03h-21.783c0-37.79-.747-91.963 32.5-100-5.097-7.648-8.187-17.65-8.187-28.625 0-23.993 14.784-43.47 33-43.47s32.97 19.475 32.97 43.47c0 11.247-3.24 21.472-8.564 29.188 30.514 8.638 32.875 61.79 32.875 99.437h-22.967l-5.25 69.813 91.906-59.594-49.064 4.374 57.594-105.53-60.156 16.905 57.5-92.814-68.53 28.813 54.217-102.345-72.655 43.063 18.53-123.407-51.717 115.94-71.125-144.032 23 165.062-66.25-52.5 42.468 85.75-120.436-76.97 73.594-54.655L123.188 21.75H20.218z"
        ></path>
      </g>
    </svg>
  );
};

export default Leftnav;
