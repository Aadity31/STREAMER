import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Avatar } from "@material-ui/core";
import "./css/Video.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import NearMeIcon from "@mui/icons-material/NearMe";
// import Ticker from "react-ticker";

export default function VideoPage() {
  const [videoData, setVideoData] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const videoRefs = useRef({});
  const observer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Find the first video that is in the viewport
      const videos = Object.keys(videoRefs.current).map(
        (key) => videoRefs.current[key]
      );
      const videoInViewport = videos.find((video) => {
        const rect = video.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      // Pause the currently playing video and play the new video
      if (videoInViewport) {
        const id = videoInViewport.getAttribute("data-id");
        if (playingId !== id) {
          if (playingId) {
            videoRefs.current[playingId].pause();
          }
          setPlayingId(id);
          videoRefs.current[id].play();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [playingId]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/shorts`);
        setVideoData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleVideoPress = (id) => {
    if (playingId === id) {
      setPlayingId(null);
      videoRefs.current[id].pause();
    } else {
      if (playingId) {
        videoRefs.current[playingId].pause();
      }
      setPlayingId(id);
      videoRefs.current[id].play();
    }
  };
  useEffect(() => {
    // Create an IntersectionObserver
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If the video is in view, play it
            const video = entry.target;
            if (!video.paused) return; // Check if the video is already playing
            video.play().catch((error) => {
              // Catch any errors that may occur when trying to play the video
              console.error("Error playing video:", error);
            });
          } else {
            // If the video is out of view, pause it
            const video = entry.target;
            video.pause();
          }
        });
      },
      { threshold: 0.5 } // Trigger when at least 50% of the video is visible
    );

    // Start observing each video element
    Object.values(videoRefs.current).forEach((video) => {
      observer.current.observe(video);
    });

    return () => {
      // Clean up observer
      observer.current.disconnect();
    };
  }, [videoData]);
  return (
    <div className="App">
      <div className="app__video">
        {videoData.map((vid) => (
          <div className="video" key={vid.id}>
            <Videos
              className="video__player"
              onClick={() => handleVideoPress(vid.id)}
              loop
              key={vid.id}
              id={vid.short_id}
              src={vid.short_path}
              username={vid.username}
              profile_path={vid.profile_path}
              like={vid.like}
              share={vid.share}
              comment={vid.comment}
              videoRefs={videoRefs}
              playingId={playingId}
              setPlayingId={setPlayingId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const Videos = ({
  id,
  src,
  username,
  profile_path,
  description,
  like,
  share,
  comment,
  videoRefs,
  playingId,
  setPlayingId,
}) => {
  const [subs, setSubs] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleVideoPress = (id) => {
    if (playingId === id) {
      setPlayingId(null);
      videoRefs.current[id].pause();
    } else {
      if (playingId) {
        videoRefs.current[playingId].pause();
      }
      setPlayingId(id);
      videoRefs.current[id].play();
    }
  };

  const handleLike = () => {
    setLiked((prevLiked) => !prevLiked);
  };

  const handleSubscribe = () => {
    setSubs((sub) => !sub);
  };

  return (
    <>
      <div className="video1">
        <video
          id={id}
          className="video__player"
          onClick={() => handleVideoPress(id)}
          loop
          ref={(el) => (videoRefs.current[id] = el)}
          src={src}
        />

        <div className="shortsContainer">
          <div className="shortsVideoTop">
            <div className="shortsVideoTopIcon">
              <ArrowBackIcon />
            </div>
            <div className="shortsVideoTopIcon">
              <MoreVertIcon />
            </div>
          </div>
          <div className="shortsVideoSideIcons">
            <div className="shortsVideoSideIcon" onClick={handleLike}>
              <ThumbUpIcon style={{ color: liked ? "#0988fd" : "" }} />
              <p>{liked ? like + 1 : like}</p>
            </div>

            <div className="shortsVideoSideIcon">
              <InsertCommentIcon />
              <p>{comment}</p>
            </div>

            <div className="shortsVideoSideIcon">
              <NearMeIcon />
              <p>{share}</p>
            </div>
          </div>
          <div className="shortsBottom">
            <div className="shortsDesc">
              {/* <Ticker mode="smooth">
                {() => <p className="description">{description}</p>}
              </Ticker> */}
            </div>
            <div className="shortDetails">
              <Avatar src={profile_path} />
              <p>{username}</p>
              <button
                style={{
                  border: subs ? "1px solid #4f3aca" : "1px solid white",
                  backdropFilter: "blur(4px)",
                  color: subs ? "#4f3aca" : "white",
                  padding: "2px 9px",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                }}
                onClick={handleSubscribe}
              >
                {subs ? "followed" : "follow"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
