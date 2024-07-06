import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import IconButton from "@mui/joy/IconButton";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function StorysHome() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [avatarData, setAvatarData] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      clearTimeout(timeoutId);
      const media = selectedUser.media[selectedIndex];
      const duration = media.endsWith(".mp4") ? 30000 : 5000; // 30 seconds for video, 5 seconds for image
      const id = setTimeout(() => handleNext(), duration);
      setTimeoutId(id);
    }
  }, [selectedIndex, selectedUser]);

  const fetchStories = async () => {
    try {
      const response = await fetch("http://localhost:4000/story", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((user) => ({
          alt: user.username,
          src: user.profile_path,
          name: user.username,
          media: user.stories.map((story) => story.story_path),
        }));
        setAvatarData(formattedData);
      } else {
        console.error("Failed to fetch stories");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  };

  const openModal = (index) => {
    setSelectedIndex(0);
    setSelectedUser(avatarData[index]);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const handlePrevious = () => {
    if (selectedIndex === 0) {
      const currentIndex = avatarData.findIndex(
        (user) => user.name === selectedUser.name
      );
      const previousUserIndex =
        (currentIndex - 1 + avatarData.length) % avatarData.length;
      setSelectedUser(avatarData[previousUserIndex]);
      setSelectedIndex(avatarData[previousUserIndex].media.length - 1);
    } else {
      setSelectedIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex === selectedUser.media.length - 1) {
      const currentIndex = avatarData.findIndex(
        (user) => user.name === selectedUser.name
      );
      const nextUserIndex = (currentIndex + 1) % avatarData.length;
      setSelectedUser(avatarData[nextUserIndex]);
      setSelectedIndex(0);
    } else {
      setSelectedIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleMediaInteraction = () => {
    clearTimeout(timeoutId);
    const media = selectedUser.media[selectedIndex];
    const duration = media.endsWith(".mp4") ? 30000 : 5000;
    const id = setTimeout(() => handleNext(), duration);
    setTimeoutId(id);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 20) {
      alert("You can only select up to 20 files.");
      return;
    }

    const validFiles = [];
    let processedFiles = 0;

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        validFiles.push(file);
        processedFiles++;
        if (processedFiles === files.length) {
          handleValidFiles(validFiles);
        }
      } else if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          if (video.duration <= 30) {
            validFiles.push(file);
          } else {
            alert(`${file.name} exceeds 30 seconds and will not be uploaded.`);
          }
          processedFiles++;
          if (processedFiles === files.length) {
            handleValidFiles(validFiles);
          }
        };

        video.src = URL.createObjectURL(file);
      } else {
        alert("Unsupported file type. Please select images or videos.");
        processedFiles++;
        if (processedFiles === files.length) {
          handleValidFiles(validFiles);
        }
      }
    });
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -100, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
  };

  const handleValidFiles = (validFiles) => {
    const formData = new FormData();

    // If validFiles is not an array, convert it to an array to handle single file uploads consistently
    if (!Array.isArray(validFiles)) {
      validFiles = [validFiles];
    }

    validFiles.forEach((file) => {
      formData.append("files", file);
    });

    fetch("http://localhost:4000/supload", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Files uploaded successfully");
          // Add code to handle success, e.g., display a success message to the user
        } else {
          console.error("Failed to upload files");
          // Add code to handle failure, e.g., display an error message to the user
        }
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        // Add code to handle error, e.g., display an error message to the user
      });
  };

  return (
    <Box
      sx={{
        position: "relative",
        maxWidth: "900px",
        margin: "auto",
        top: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          left: 0,
          top: "25%",
          zIndex: 1,
        }}
        onClick={scrollLeft}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <Box
        ref={scrollContainerRef}
        sx={{
          overflowX: "hidden",
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          padding: "0 50px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
            onChange={handleFileChange}
          />
          <Avatar
            alt="story"
            src="/siteimage/story.png"
            sx={{ border: "2px solid #0988fd", width: 100, height: 100 }}
            onClick={() => fileInputRef.current.click()}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
              maxWidth: "75px",
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            Your story
          </Typography>
        </Box>

        {avatarData.map((avatar, index) => (
          <Box
            key={index}
            sx={{ textAlign: "center", display: "inline-block" }}
          >
            <Avatar
              alt={avatar.alt}
              // src={Users.profile_path}
              sx={{ border: "2px solid #0988fd", width: 100, height: 100 }}
              onClick={() => openModal(index)}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                marginX: "10px",
                fontFamily: "sans-serif",
                maxWidth: "100px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
              }}
            >
              {/* {Users.username} */}
            </Typography>
          </Box>
        ))}
      </Box>
      <IconButton
        sx={{ position: "absolute", right: 0, top: "25%", zIndex: 1 }}
        onClick={scrollRight}
      >
        <NavigateNextIcon />
      </IconButton>
      <Modal open={!!selectedUser} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px", // Fixed width for the story container
            height: "630px", // Fixed height for the story container
            display: "flex",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              flex: "column",
            }}
          >
            {selectedUser && (
              <>
                <Avatar
                  alt={selectedUser.name}
                  src={selectedUser.src}
                  sx={{ width: 50, height: 50 }}
                />
                <Typography
                  sx={{ font: "bold", margin: "10px", color: "white" }}
                  variant="body1"
                >
                  {selectedUser.name}
                </Typography>
              </>
            )}
          </Box>
          <IconButton
            sx={{ position: "absolute", left: 0, top: "50%", zIndex: 1 }}
            onClick={handlePrevious}
          >
            <NavigateBeforeIcon />
          </IconButton>
          {selectedUser && (
            <>
              {selectedUser.media[selectedIndex].endsWith(".mp4") ? (
                <video
                  autoPlay
                  controls={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onMouseDown={handleMediaInteraction}
                >
                  <source
                    src={selectedUser.media[selectedIndex]}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedUser.media[selectedIndex]}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                  onMouseDown={handleMediaInteraction}
                />
              )}
            </>
          )}
          <IconButton
            sx={{ position: "absolute", right: 0, top: "50%", zIndex: 1 }}
            onClick={handleNext}
          >
            <NavigateNextIcon />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
}
