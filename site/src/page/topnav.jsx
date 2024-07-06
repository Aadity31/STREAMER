import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import "../page/css/topnav.css"; // Assuming a CSS file for styling
import SearchBar from "../component/SearchBar";
import { useNavigate } from "react-router-dom";
import { SearchResultsList } from "../component/resultlist";

const Navbar = ({ onSearch }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data (username and profile_path)
  const submenuRef = useRef(null);
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const gotToNewPage = () => {
    navigate("/settings");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const baseURL =
          window.location.hostname === "localhost"
            ? "http://localhost:4000"
            : `http://${window.location.hostname}:4000`;

        const response = await axios.get(`${baseURL}/username`, {
          withCredentials: true, // Send cookies with the request
        });
        setUserData(response.data); // Set user data in state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData(); // Call the fetchUserData function

    // Add event listener to detect clicks outside of submenu
    document.addEventListener("click", handleOutsideClick);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleProfileClick = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const handleOutsideClick = (e) => {
    // Check if clicked element is outside of submenu
    if (submenuRef.current && !submenuRef.current.contains(e.target)) {
      setIsSubMenuOpen(false);
    }
  };
  const handleSearch = (results) => {
    setResults(results);
    onSearch(results);
  };

  const handleLogout = async () => {
    try {
      const hostname = window.location.hostname;
      const baseURL =
        hostname === "localhost"
          ? "http://localhost:4000"
          : `http://${hostname}:4000`;

      const response = await axios.post(`${baseURL}/logout`, null, {
        withCredentials: true,
      });

      if (response.data === "logout_success") {
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="fixed top-0 z-1000 w-full h-15 flex items-center justify-between bg-black border-b border-white">
      <div className="left">
        <div className="logo">
          <img
            src="/siteimage/logo.png"
            alt="Logo"
            className="ml-2 w-10 h-auto rounded-md mr-2"
          />
        </div>
      </div>

      <div className="right flex items-center">
        <SearchBar onSearch={handleSearch} />
        {results && results.length > 0 && (
          <div className="absolute top-16 -right-[150px] transform -translate-x-1/2 w-80 bg-[#413e3ecc] backdrop-blur-sm border-[1px] border-gray-300 rounded-lg shadow-lg z-50">
            <SearchResultsList results={results} />
          </div>
        )}
        <div className="relative inline-block" ref={submenuRef}>
          <img
            src={userData?.profile_path || "/siteimage/no.png"}
            alt="Profile"
            onClick={handleProfileClick}
            className="w-10 h-10 object-cover object-center rounded-full m-3 border-2 border-blue-500 cursor-pointer"
          />
          {isSubMenuOpen && (
            <div className="absolute top-16 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-48 z-1000">
              <div className="flex items-center mb-2">
                <img
                  src={userData?.profile_path || "/siteimage/no.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-2"
                />
                <div className="text-lg font-bold">{userData?.username}</div>
              </div>
              <button
                onClick={() => gotToNewPage()}
                className="w-full p-2 mb-1 bg-gray-100 text-left cursor-pointer rounded hover:bg-gray-200"
              >
                Settings
              </button>
              <button className="w-full p-2 mb-1 bg-gray-100 text-left cursor-pointer rounded hover:bg-gray-200">
                Feedback
              </button>
              <button
                onClick={handleLogout}
                className="w-full p-2 mb-1 bg-gray-100 text-left cursor-pointer rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
