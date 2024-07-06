// src/SettingsPage.js
import React, { useState } from "react";
import ProfileEdit from "./editprofile";
import Leftnav from "./leftnav";
import Navbar from "./topnav";
import CustomizedSwitches from "../component/ThemeChanger";

const SettingsPage = () => {
  const [activeSetting, setActiveSetting] = useState(null);

  const handleButtonClick = (setting) => {
    setActiveSetting(setting);
  };

  return (
    <>
      <Navbar onSearch={(searchTerm) => console.log(searchTerm)} />
      <div className="pt-16 flex h-screen">
        <Leftnav />

        <div className="fixed w-[350px] px-4 bg-transparent h-full text-white flex flex-col items-center ml-[280px] border-r-[1px] overflow-y-auto">
          <h1 className="text-4xl font-bold my-8 ">Settings</h1>
          <div className="w-full max-w-md space-y-6">
            <button
              className="w-full text-left py-2 px-4 border-b border-gray-600 hover:bg-gray-700"
              onClick={() => handleButtonClick("profile")}
            >
              Profile Settings
            </button>
            <button
              className="w-full text-left py-2 px-4 border-b border-gray-600 hover:bg-gray-700"
              onClick={() => handleButtonClick("password")}
            >
              Change Password
            </button>
            <button
              className="w-full text-left py-2 px-4 border-b border-gray-600 hover:bg-gray-700"
              onClick={() => handleButtonClick("privacy")}
            >
              Privacy Settings
            </button>
            <button
              className="w-full text-left py-2 px-4 border-b border-gray-600 hover:bg-gray-700"
              onClick={() => handleButtonClick("notifications")}
            >
              Notification Settings
            </button>
            <button
              className="w-full text-left py-2 px-4 border-b border-gray-600 hover:bg-gray-700"
              onClick={() => handleButtonClick("Theme")}
            >
              Theme
            </button>
            <button
              className="w-full text-left py-2 px-4 border-b border-gray-600 hover:bg-gray-700"
              onClick={() => handleButtonClick("language")}
            >
              Language and Region
            </button>
          </div>
        </div>

        <div className="flex-1 ml-[630px] overflow-y-auto">
          {activeSetting === "profile" && <ProfileEdit />}
          {activeSetting === "password" && <no />}
          {activeSetting === "privacy" && (
            <div className="text-white">Privacy Settings Content</div>
          )}
          {activeSetting === "notifications" && (
            <div className="text-white">Notification Settings Content</div>
          )}
          {activeSetting === "Theme" && <CustomizedSwitches />}
          {activeSetting === "language" && (
            <div className="text-white">Language and Region Content</div>
          )}
        </div>
      </div>
    </>
  );
};
export default SettingsPage;
