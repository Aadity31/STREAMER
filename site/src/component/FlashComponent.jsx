import React, { useState } from "react";

const FlashComponent = ({ onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]); // Array of files selected
  const [isPreviewing, setIsPreviewing] = useState(false); // Whether the user is previewing
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // Index of the currently displayed photo in preview mode
  const [title, setTitle] = useState(""); // Title of the post

  const handleDiscard = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to discard the changes?"
    );
    if (userConfirmed) {
      setSelectedFiles([]);
      setIsPreviewing(false);
      setCurrentPhotoIndex(0);
      setTitle("");
    }
  };

  const handleAddVideo = async (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];

    for (const file of files) {
      if (file.type.startsWith("video/")) {
        const isValid = await checkVideoDuration(file);
        if (isValid) {
          validFiles.push(file);
        }
      }
    }

    if (validFiles.length === 0) {
      alert("Only videos of up to 1 minute can be added.");
      return;
    }

    setSelectedFiles([...selectedFiles, ...validFiles]);
    if (validFiles.length > 0 && selectedFiles.length === 0) {
      setIsPreviewing(true);
    }
  };

  const checkVideoDuration = (file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");

      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(video.duration <= 60);
      };

      video.src = url;
    });
  };

  const handleUpload = async () => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    const formData = new FormData();
    formData.append("title", title);
    selectedFiles.forEach((file) => {
      formData.append("videos", file);
    });

    try {
      const response = await fetch(`${baseURL}/upload`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        console.log("Video uploaded successfully!");
        setSelectedFiles([]);
        setIsPreviewing(false);
        setCurrentPhotoIndex(0);
        setTitle("");
        onClose(); // Close the post component after upload
      } else {
        console.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <div className="fixed flex justify-center items-center h-screen w-full z-50 backdrop-filter backdrop-blur-lg bg-black bg-opacity-80">
      <div
        className={`bg-gray-800 rounded-lg h-[550px] relative overflow-hidden ${
          isPreviewing ? "w-[550px]" : "w-[350px]"
        }`}
      >
        <div className="flex justify-center items-center text-2xl bg-gray-700 rounded-full px-3 py-1">
          <h1 className="text-white">{isPreviewing ? "Preview" : "Post"}</h1>
        </div>
        <div className="flex flex-col items-center h-full">
          {!isPreviewing && (
            <div className="flex flex-col items-center m-28">
              {/* Assuming PhotoVideo is a component used for some purpose */}
              <PhotoVideo />
              <h1 className="text-white font-sans font-bold text-2xl m-1 ">
                Select video
              </h1>
              <label
                htmlFor="file-input"
                className="m-5 bg-gray-700 rounded-md px-4 py-2 text-xl cursor-pointer hover:bg-gray-600 hover:text-white text-gray-300"
              >
                Select
                <input
                  id="file-input"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleAddVideo}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {isPreviewing && selectedFiles.length > 0 && (
            <>
              <button
                className="absolute top-0 left-0 bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-600 hover:text-white z-10"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                className="absolute top-0 right-0 bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-600 hover:text-white z-10"
                onClick={handleUpload}
              >
                Post
              </button>
              <div className="flex flex-col items-center w-full h-full p-4">
                <input
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-4 w-full px-3 py-2 rounded-md bg-gray-700 text-white"
                />
                <div className="flex justify-between items-center w-full h-full">
                  <video
                    src={URL.createObjectURL(selectedFiles[currentPhotoIndex])}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <button
        className="absolute top-2 right-2 bg-gray-700 rounded-full px-3 py-1 hover:bg-gray-600 hover:text-white"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

const PhotoVideo = () => {
  return (
    <svg
      fill="#000000"
      width="200px"
      height="200px"
      viewBox="0 0 640.00 640.00"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffffff"
      stroke-width="0.0064"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#CCCCCC"
        stroke-width="48.64"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M608 0H160a32 32 0 0 0-32 32v96h160V64h192v320h128a32 32 0 0 0 32-32V32a32 32 0 0 0-32-32zM232 103a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9V73a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm352 208a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9v-30a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm0-104a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9v-30a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm0-104a9 9 0 0 1-9 9h-30a9 9 0 0 1-9-9V73a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9zm-168 57H32a32 32 0 0 0-32 32v288a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32zM96 224a32 32 0 1 1-32 32 32 32 0 0 1 32-32zm288 224H64v-32l64-64 32 32 128-128 96 96z"></path>
      </g>
    </svg>
  );
};

export default FlashComponent;
