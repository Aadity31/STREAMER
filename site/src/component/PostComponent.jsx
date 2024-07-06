import React, { useState, useRef, useEffect } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const PostComponent = ({ onClose }) => {
  const maxFiles = 5;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [croppedFiles, setCroppedFiles] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  const imagePreviewRef = useRef(null);
  let cropper = null;

  const triggerFileInput = () => {
    fileInputRef.current.value = null; // Reset file input value to allow re-selection of the same file
    fileInputRef.current.click();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);

    if (selectedFiles.length + files.length > maxFiles) {
      alert(`You can only select up to ${maxFiles} files.`);
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);

    if (files.length > 0 && selectedFiles.length === 0) {
      setCurrentFileIndex(0);
      setIsCropping(true);
    }
  };

  const dragOverHandler = (event) => {
    event.preventDefault();
  };

  const dropHandler = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);

    if (selectedFiles.length + files.length > maxFiles) {
      alert(`You can only select up to ${maxFiles} files.`);
      return;
    }

    setSelectedFiles([...selectedFiles, ...files]);
    if (files.length > 0 && selectedFiles.length === 0) {
      setCurrentFileIndex(0);
      setIsCropping(true);
    }

    handleFileSelect({ target: { files } });
  };

  const handleDiscard = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to discard the changes?"
    );
    if (userConfirmed) {
      setSelectedFiles([]);
      setCurrentFileIndex(0);
      setIsCropping(false);
      setIsPreviewing(false);
      setCurrentPhotoIndex(0);
    }
  };

  const handleNext = () => {
    if (currentPhotoIndex < selectedFiles.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
    setIsPreviewing(true);
  };

  const handlePrevious = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleUpload = async () => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;
    const formData = new FormData();
    formData.append("descriptions", description); // Correct key for descriptions
    selectedFiles.forEach((file) => {
      formData.append("files", file); // Ensure the key is 'files'
    });

    try {
      const response = await fetch(`${baseURL}/postupload`, {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        console.log("Uploading files:", croppedFiles);
        console.log("Description:", description); // Print the description
        alert("Files uploaded successfully!");
        setSelectedFiles([]);
        setCroppedFiles([]);
        setDescription(""); // Clear description after upload
        setIsCropping(false);
        setIsPreviewing(false);
        setCurrentFileIndex(0);
        setCurrentPhotoIndex(0);
        onClose();
      } else {
        console.error("Failed to upload video");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const cropImage = () => {
    const currentFile = selectedFiles[currentFileIndex];
    if (currentFile.type.startsWith("image/")) {
      // Existing cropping logic for images
      if (cropper) {
        const canvas = cropper.getCroppedCanvas();
        const cropBoxData = cropper.getCropBoxData();
        if (canvas) {
          canvas.toBlob((blob) => {
            const croppedFile = new File(
              [blob],
              selectedFiles[currentFileIndex].name,
              { type: blob.type }
            );
            setCroppedFiles((prevCroppedFiles) => {
              const newCroppedFiles = [...prevCroppedFiles];
              newCroppedFiles[currentFileIndex] = croppedFile;
              return newCroppedFiles;
            });
            setCropData((prevCropData) => {
              const newCropData = [...prevCropData];
              newCropData[currentFileIndex] = cropBoxData;
              return newCropData;
            });
            cropper.destroy();
            cropper = null;
            if (currentFileIndex < selectedFiles.length - 1) {
              setCurrentFileIndex(currentFileIndex + 1);
            } else {
              setIsCropping(false);
              setIsPreviewing(true);
            }
          });
        }
      }
    } else {
      // Directly add video to croppedFiles array
      setCroppedFiles((prevCroppedFiles) => {
        const newCroppedFiles = [...prevCroppedFiles];
        newCroppedFiles[currentFileIndex] = currentFile;
        return newCroppedFiles;
      });
      if (currentFileIndex < selectedFiles.length - 1) {
        setCurrentFileIndex(currentFileIndex + 1);
      } else {
        setIsCropping(false);
        setIsPreviewing(true);
      }
    }
  };

  useEffect(() => {
    if (isCropping && imagePreviewRef.current) {
      const image = imagePreviewRef.current;
      const cropDataForCurrentFile = cropData[currentFileIndex];

      image.src = URL.createObjectURL(selectedFiles[currentFileIndex]);
      cropper = new Cropper(image, {
        aspectRatio: 0,
        autoCropArea: 1,
        ready() {
          if (cropDataForCurrentFile) {
            this.cropper.setCropBoxData(cropDataForCurrentFile);
          }
        },
      });

      // Disable manual dragging of the image
      cropper.setDragMode("none");

      return () => {
        if (cropper) {
          cropper.destroy();
          cropper = null;
        }
      };
    }
  }, [isCropping, currentFileIndex, cropData]);

  const currentFile = selectedFiles[currentFileIndex];

  return (
    <div className="fixed flex justify-center items-center h-screen w-full z-50 backdrop-filter backdrop-blur-lg">
      <div className="bg-[#141414] rounded-lg min-h-[500px] h-auto w-[400px] relative">
        <div className="flex justify-center items-center text-2xl bg-[#4e4e4e] rounded-t-lg px-3 py-1">
          <h1 className="text-[#e4e4e4]">
            {isCropping ? "Crop" : isPreviewing ? "Preview" : "Post"}
          </h1>
        </div>
        <div className="flex flex-col items-center p-4">
          {!isCropping && !isPreviewing && (
            <div className="flex flex-col items-center mt-2">
              <div
                className="size-auto border-2 border-dotted border-black text-center text-[#000000] cursor-pointer p-2 mb-8"
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  className="text-black"
                />
                <PhotoVideo />
              </div>
              <h1 className="text-pretty font-sans font-bold text-2xl m-1">
                Select video or photos
              </h1>
              <button
                onClick={triggerFileInput}
                className="m-5 bg-[#494949] text-[#a7a6a6] rounded-md px-4 py-2 text-xl cursor-pointer hover:bg-gray-800 hover:text-white"
              >
                Select
              </button>
            </div>
          )}
          {isCropping && currentFile && (
            <>
              <button
                className="absolute top-0 left-0 bg-gray-300 rounded-xl hover:bg-gray-700 hover:text-white"
                onClick={handleDiscard}
              >
                <IconPrevious />
              </button>
              <div className="flex flex-col w-full items-center">
                <div className="relative max-w-full w-full h-72">
                  {currentFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(currentFile)}
                      alt="Preview"
                      ref={imagePreviewRef}
                      className="fixed"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(currentFile)}
                      controls
                      className="max-h-80"
                    />
                  )}
                </div>
                {currentFile.type.startsWith("image/") && (
                  <button
                    onClick={cropImage}
                    className="m-2 bg-gray-200 rounded-md px-4 py-2 hover:bg-gray-800 hover:text-white"
                  >
                    Crop
                  </button>
                )}
                <div className="editors mt-4">
                  <button
                    onClick={cropImage}
                    className="absolute top-0 right-0 px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-700 hover:text-white"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {isPreviewing && croppedFiles.length > 0 && (
            <div className="flex flex-col items-center h-full">
              <button
                className="absolute top-0 left-0 bg-gray-500 rounded-lg hover:bg-gray-700 hover:text-white z-10"
                onClick={() => {
                  setIsPreviewing(false);
                  setIsCropping(true);
                }}
              >
                <IconPrevious />
              </button>
              <button
                className="absolute top-0 right-0 bg-gray-500 rounded-lg px-4 py-2 hover:bg-gray-700 hover:text-white z-10"
                onClick={handleUpload}
              >
                Post
              </button>

              <div className="flex justify-between items-center w-full mb-4">
                <button
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-300 rounded-xl hover:bg-gray-700 hover:text-white"
                  onClick={handlePrevious}
                >
                  <IconPrevious />
                </button>
                <button
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-300 rounded-xl hover:bg-gray-700"
                  onClick={handleNext}
                >
                  <IconNext />
                </button>

                <div className="flex flex-col items-center w-full h-full">
                  {croppedFiles[currentPhotoIndex]?.type.startsWith(
                    "image/"
                  ) ? (
                    <img
                      src={URL.createObjectURL(croppedFiles[currentPhotoIndex])}
                      alt="Cropped"
                      className="max-h-40"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(croppedFiles[currentPhotoIndex])}
                      controls
                      ref={videoPreviewRef}
                      className="max-h-40"
                    />
                  )}
                </div>
              </div>
              <div className="mt-4">
                {currentPhotoIndex + 1} / {croppedFiles.length}
              </div>
              <div className="flex h-full">
                <label className="text-base font-medium text-gray-200 mt-4">
                  Your Thoughts
                  <textarea
                    type="text"
                    placeholder="Type your message..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className="mt-1 resize-none w-full p-2 bg-[#000000] text-white border border-gray-700 rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        className="absolute top-2 right-2 bg-gray-400 rounded-full px-3 py-1"
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
      width="230px"
      height="230px"
      viewBox="0 0 32.00 32.00"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(0)"
      stroke="#000000"
      stroke-width="0.00032"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke="#CCCCCC"
        stroke-width="2.944"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M 10 2 L 10 9 L 12 9 L 12 4 L 14 4 L 14 5 L 16 5 L 16 4 L 25 4 L 25 5 L 27 5 L 27 4 L 29 4 L 29 16 L 27 16 L 27 15 L 25 15 L 25 18 L 31 18 L 31 2 L 10 2 z M 14 7 L 14 9 L 16 9 L 16 7 L 14 7 z M 25 7 L 25 9 L 27 9 L 27 7 L 25 7 z M 2 11 L 2 29 L 23 29 L 23 11 L 2 11 z M 25 11 L 25 13 L 27 13 L 27 11 L 25 11 z M 4 13 L 21 13 L 21 22.78125 L 18.40625 20.1875 L 17.6875 19.5 L 14.875 22.3125 L 10.59375 18 L 9.90625 17.28125 L 4 23.1875 L 4 13 z M 15.5 15 C 14.671 15 14 15.671 14 16.5 C 14 17.329 14.671 18 15.5 18 C 16.329 18 17 17.329 17 16.5 C 17 15.671 16.329 15 15.5 15 z M 9.9042969 20.125 L 14.904297 25.125 L 15.59375 24.40625 L 17.6875 22.3125 L 21 25.625 L 21 27 L 4 27 L 4 26.03125 L 9.9042969 20.125 z"></path>
      </g>
    </svg>
  );
};

const IconPrevious = () => {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="-2.4 -2.4 28.80 28.80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
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
          d="M15 7L10 12L15 17"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
};

const IconNext = () => {
  return (
    <svg
      width="40px"
      height="40px"
      viewBox="-2.4 -2.4 28.80 28.80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#000000"
      transform="rotate(0)matrix(-1, 0, 0, 1, 0, 0)"
      className="hover:text-white"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M15 7L10 12L15 17"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  );
};
export default PostComponent;
