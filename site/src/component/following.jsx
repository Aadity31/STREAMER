import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import { Typography, Button } from "@mui/material";

const FollowersPopup = ({ onClose, title, type }) => {
  const [followers, setFollowers] = useState([]);

  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    axios
      .get(`${baseURL}/followerlist`, {
        withCredentials: true,
      })
      .then((respone) => {
        // setFollowers(respone.data);
        // console.log(respone.data["followers"]);
        setFollowers(respone.data["followers"]);
        // console.log(respone.data["followers"][1].profile_path);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    axios
      .get(`${baseURL}/followinglist`, {
        withCredentials: true,
      })
      .then((respone) => {
        // setFollowing(respone.data);
        // console.log(respone.data["following"]);
        setFollowing(respone.data["following"]);
        // console.log(respone.data["following"][1].profile_path);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const navigate = useNavigate();

  const handleToggle = (index, users) => () => {
    const newUsers = [...users];
    newUsers[index].followed = !newUsers[index].followed;
    setUsersFunction(newUsers);
  };

  const handleNavigation = (user) => () => {
    navigate("/otherprofile", { state: user });
  };

  const usersToShow = type === "followers" ? followers : following;
  const setUsersFunction = type === "followers" ? setFollowers : setFollowing;
  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "50",
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: "#8080806c",
          backdropFilter: "blur(10px)",
          width: "450px",
          borderRadius: "10px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            padding: "1px",
          }}
          variant="contained"
          onClick={onClose}
        >
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
              <g id="Menu / Close_SM">
                {" "}
                <path
                  id="Vector"
                  d="M16 16L12 12M12 12L8 8M12 12L16 8M12 12L8 16"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </Button>

        {/* Title */}
        <Typography variant="h5" sx={{ textAlign: "center", marginY: "20px" }}>
          {title}
        </Typography>
        <hr className="border-blue-200" />

        {/* User List */}
        <div className="max-w-md mx-auto bg-transparent p-4 rounded-lg shadow-lg max-h-96 h-auto min-h-80 overflow-y-auto scrollbar-thin ">
          <ul className="space-y-4">
            {usersToShow.map((user, index) => (
              <li key={index} className="flex items-center space-x-4">
                <img
                  className="size-12 rounded-full border-2 border-green-400 cursor-pointer"
                  src={user.profile_path}
                  alt={`Avatar of ${user.username}`}
                  onClick={handleNavigation(user)}
                />
                <div className="flex-1 text-black">
                  <div
                    className="text-base cursor-pointer"
                    onClick={handleNavigation(user)}
                  >
                    {user.username}
                  </div>
                </div>
                <button
                  onClick={handleToggle(index)}
                  className={`text-sm font-semibold ${
                    user.followed ? "text-gray-300" : "text-blue-500"
                  }`}
                >
                  {user.followed ? "Unfollow" : "Follow"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Box>
    </Box>
  );
};

export default FollowersPopup;
