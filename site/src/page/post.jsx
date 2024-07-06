import * as React from "react";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import ModeCommentOutlined from "@mui/icons-material/ModeCommentOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import Face from "@mui/icons-material/Face";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function InstagramPost() {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentPost, setCurrentPost] = React.useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

  useEffect(() => {
    // Fetch posts data from API when the component mounts
    const fetchPosts = async () => {
      try {
        const hostname = window.location.hostname;
        const baseURL =
          hostname === "localhost"
            ? "http://localhost:4000"
            : `http://${hostname}:4000`;

        const response = await axios.get(`${baseURL}/posts`);
        const transformedPosts = response.data.map((post) => {
          const mediaItems = post.post_path.split(",").map((path) => {
            const fileType = path.split(".").pop().toLowerCase();
            const type = fileType === "mp4" ? "video" : "image";
            return { type, src: path.trim() };
          });
          return {
            post_id: post.post_id,
            username: post.username,
            avatar: post.profile_path,
            mediaItems,
            likes: post.likes.length.toString(),
            description: post.content,
            timeAgo: post.created_at,
          };
        });
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Call the fetchPosts function
  }, []);

  const handleOpenModal = (post, index) => {
    setCurrentPost(post);
    setCurrentMediaIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(
      (prevIndex) => (prevIndex + 1) % currentPost.mediaItems.length
    );
  };

  const handlePreviousMedia = () => {
    setCurrentMediaIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentPost.mediaItems.length) %
        currentPost.mediaItems.length
    );
  };

  return (
    <>
      <div className="my-10 scrollbar-thin ">
        {[...posts].reverse().map((post, postIndex) => (
          <Post key={postIndex} post={post} onMediaClick={handleOpenModal} />
        ))}
        {currentPost && (
          <Modal open={modalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                height: "90%",
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                }}
              >
                <CloseIcon />
              </IconButton>
              {currentPost.mediaItems[currentMediaIndex].type === "image" ? (
                <img
                  src={currentPost.mediaItems[currentMediaIndex].src}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <video
                  src={currentPost.mediaItems[currentMediaIndex].src}
                  controls
                  autoPlay
                  style={{ width: "100%", height: "100%" }}
                />
              )}
              <IconButton
                onClick={handlePreviousMedia}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 16,
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNextMedia}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 16,
                  transform: "translateY(-50%)",
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          </Modal>
        )}
      </div>
    </>
  );
}

function Post({ post, onMediaClick }) {
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const videoRef = React.useRef(null);
  const postRef = React.useRef(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  const addEmojiToInput = (emoji) => {
    const input = inputRef.current.querySelector("input"); // Access the actual input element within the Input component
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newValue = newMessage.slice(0, start) + emoji + newMessage.slice(end);

    // Update the input value
    setNewMessage(newValue);

    // Use the ref to set the cursor position correctly after the emoji is inserted
    setTimeout(() => {
      input.setSelectionRange(start + emoji.length, start + emoji.length);
      input.focus();
    }, 0);
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex(
      (prevIndex) => (prevIndex + 1) % post.mediaItems.length
    );
    setIsPlaying(true); // reset playing state when switching media
  };

  const handlePreviousMedia = () => {
    setCurrentMediaIndex(
      (prevIndex) =>
        (prevIndex - 1 + post.mediaItems.length) % post.mediaItems.length
    );
    setIsPlaying(true); // reset playing state when switching media
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLikeButtonClick = () => {
    setLiked(!liked);
  };

  const handleBookmarkButtonClick = () => {
    setBookmarked(!bookmarked); // Toggle bookmark state
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (
      post.mediaItems[currentMediaIndex].type === "video" &&
      videoRef.current
    ) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [currentMediaIndex, post.mediaItems]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            post.mediaItems[currentMediaIndex].type === "video" &&
            videoRef.current
          ) {
            videoRef.current.play();
            setIsPlaying(true);
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [currentMediaIndex, post.mediaItems]);

  return (
    <div className="flex justify-center items-center" ref={postRef}>
      <Card
        variant="outlined"
        sx={{
          minWidth: 300,
          width: 400,
          height: "auto",
          borderRadius: 8,
          mb: 2,
          background: "#000000",
        }}
      >
        <CardContent
          orientation="horizontal"
          sx={{ alignItems: "center", gap: 1 }}
        >
          <Box
            sx={{
              position: "relative",
              width: 40,
              height: 40,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                m: "-2px",
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              },
            }}
          >
            <Avatar
              src={post.avatar}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Typography fontWeight="lg" sx={{ color: "#d6d4d4" }}>
            {post.username}
          </Typography>
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <MoreHoriz />
          </IconButton>
        </CardContent>
        <CardOverflow>
          <AspectRatio>
            {post.mediaItems[currentMediaIndex].type === "image" ? (
              <img
                src={post.mediaItems[currentMediaIndex].src}
                alt=""
                loading="lazy"
                onClick={() => onMediaClick(post, currentMediaIndex)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <video
                ref={videoRef}
                src={post.mediaItems[currentMediaIndex].src}
                autoPlay
                controls
                onClick={handleVideoClick}
                style={{ cursor: "pointer" }}
              />
            )}
          </AspectRatio>
          {post.mediaItems.length > 1 && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                onClick={handlePreviousMedia}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={handleNextMedia}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 0,
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, )",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>
          )}
        </CardOverflow>
        <CardContent
          orientation="horizontal"
          sx={{ alignItems: "center", mx: -1 }}
        >
          <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
            <IconButton
              variant="plain"
              color={liked ? "primary" : "neutral"}
              size="sm"
              onClick={handleLikeButtonClick}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              {liked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <ModeCommentOutlined />
            </IconButton>
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <SendOutlined />
            </IconButton>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mx: "auto" }}
          >
            {[...Array(post.mediaItems.length)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: "50%",
                  width: `max(${6 - index}px, 3px)`,
                  height: `max(${6 - index}px, 3px)`,
                  bgcolor:
                    index === currentMediaIndex
                      ? "primary.solidBg"
                      : "background.level3",
                }}
              />
            ))}
          </Box>
          <Box sx={{ width: 0, display: "flex", flexDirection: "row-reverse" }}>
            <IconButton
              variant="plain"
              color={bookmarked ? "black" : "neutral"}
              size="sm"
              onClick={handleBookmarkButtonClick}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              {bookmarked ? (
                <BookmarkRoundedIcon />
              ) : (
                <BookmarkBorderRoundedIcon />
              )}
            </IconButton>
          </Box>
        </CardContent>
        <CardContent>
          <Link
            component="button"
            underline="none"
            fontSize="sm"
            fontWeight="lg"
            textColor="text.primary"
          >
            {post.likes} Likes
          </Link>
          <Typography fontSize="sm">
            <Link
              component="button"
              color="neutral"
              fontWeight="lg"
              textColor="text.primary"
            >
              {post.username}
            </Link>{" "}
            {post.description}
          </Typography>
          <Link
            component="button"
            underline="none"
            fontSize="sm"
            startDecorator="…"
            sx={{ color: "text.tertiary" }}
          >
            more
          </Link>
          <Link
            component="button"
            underline="none"
            fontSize="10px"
            sx={{ color: "text.tertiary", my: 0.5 }}
          >
            {post.timeAgo}
          </Link>
        </CardContent>
        <CardContent orientation="horizontal" sx={{ gap: 1 }}>
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            sx={{ ml: -1 }}
            onClick={() => setPickerVisible(!isPickerVisible)}
          >
            <Face />
          </IconButton>
          {isPickerVisible && (
            <div
              ref={pickerRef}
              className="absolute bottom-3 -left-[350px] w-auto h-auto bg-white shadow-md rounded-md z-50"
            >
              <Picker
                data={data}
                onEmojiSelect={(emoji) => {
                  addEmojiToInput(emoji.native);
                }}
              />
            </div>
          )}
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="plain"
            size="sm"
            placeholder="Add a comment…"
            sx={{ flex: 1, px: 0, "--Input-focusedThickness": "0px" }}
          />
          <Link disabled={!newMessage.trim()} underline="none" role="button">
            Post
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
