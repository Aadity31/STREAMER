import React, { useState } from "react";

const RightNav = () => {
  const [activeContent, setActiveContent] = useState("friends");
  const items = [
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    "AADI_dimri",
    // Add more items if needed
  ];

  const [visibleItems, setVisibleItems] = useState(3); // Initial number of items to display

  const loadMoreItems = () => {
    setVisibleItems((prev) => prev + 10); // Load 5 more items each time button is clicked
  };

  const toggleContent = (contentId) => {
    setActiveContent(contentId);
  };

  return (
    <div className="fixed right-0 -mt-[13px] w-72 h-screen bg-[#000000] border-l-[1px] border-l-white p-3 font-sans z-0 ">
      <div className="first_warpper">
        <hr className="w-full border-t border-gray-300 mb-1" />

        <div className="flex items-center justify-between">
          <div
            className="text-xl text-center
            text-gray-400 mx-2"
          >
            Tournament Invitations
          </div>
          <div className="menu w-9 h-9 rounded-full hover:bg-gray-300 cursor-pointer flex items-center justify-center">
            <i className=" text-lg"></i>
          </div>
        </div>
        <hr className="w-full border-t border-gray-300 mt-1" />
        <div className="scrollbar-thin max-h-[200px] overflow-y-auto custom-scrollbar">
          {items.slice(0, visibleItems).map((name, index) => (
            <div
              className="flex items-center cursor-pointer text-yellow-50 hover:bg-gray-800  p-2 my-1 border-b  border-slate-900"
              key={index}
            >
              <img
                src="images/abhigyan.jpg"
                alt="page"
                className="w-9 h-9 object-cover object-center rounded-full mr-4"
              />
              <p>{name}</p>
            </div>
          ))}
          {visibleItems < items.length && (
            <button
              onClick={loadMoreItems}
              className="ml-2  font-mono  text-yellow-50 hover:text-blue-400  "
            >
              {items.length - visibleItems} More
            </button>
          )}
        </div>
      </div>

      <hr className="w-full border-t border-gray-300 my-2" />

      <div className="third_warpper">
        <div className="flex bg-transparent">
          <div
            className={`flex-1 py-1 rounded-md text-center cursor-pointer ${
              activeContent === "friends" ? "bg-blue-500" : "bg-transparent"
            } text-white`}
            onClick={() => toggleContent("friends")}
          >
            Live rooms
          </div>
          <div
            className={`flex-1 py-1 rounded-md text-center cursor-pointer ${
              activeContent === "groups" ? "bg-blue-500" : "bg-transparent"
            } text-white`}
            onClick={() => toggleContent("groups")}
          >
            Joined room
          </div>
        </div>
        <hr className="w-full border-t border-gray-300 my-2" />
        <div className="text-white">
          <div
            className={`content ${
              activeContent === "friends" ? "block" : "hidden"
            } custom-scrollbar max-h-[300px] overflow-y-auto`}
          >
            {[
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
              "bgmi_live",
            ].map((name, index) => (
              <div
                className="flex items-center cursor-pointer hover:bg-gray-800  p-2 my-1 border-b  border-slate-900"
                key={index}
              >
                <img
                  src="images/abhigyan.jpg"
                  alt="contact"
                  className="w-9 h-9 object-cover object-center rounded-full mr-4 border-2 border-blue-400"
                />
                <p>{name}</p>
              </div>
            ))}
          </div>

          <div
            className={`content ${
              activeContent === "groups" ? "block" : "hidden"
            } custom-scrollbar max-h-[300px] overflow-y-auto`}
          >
            {[
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
              "PROJECT 69",
            ].map((name, index) => (
              <div
                className="flex items-center cursor-pointer hover:bg-gray-800  p-2 my-1 border-b  border-slate-900"
                key={index}
              >
                <img
                  src="images/abhigyan.jpg"
                  alt="contact"
                  className="w-9 h-9 object-cover object-center rounded-full mr-4 border-2 border-blue-400"
                />
                <p>{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightNav;
