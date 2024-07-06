import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./topnav";
import RightSidebar from "./rightnav";
import Leftnav from "./leftnav";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { useNavigate } from "react-router-dom";
import FollowersPopup from "../component/following";

const MyComponent = () => {
  const [userData, setUserData] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowingPopup, setShowFollowingPopup] = useState(false);
  const navigate = useNavigate();
  const gotToNewPage = () => {
    navigate("/editprofile");
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    const fetchUserData = async () => {
      try {
        const userDataResponse = await axios.get(`${baseURL}/username`, {
          withCredentials: true,
        });
        setUserData(userDataResponse.data);

        const userId = userDataResponse.data.user_id;

        const followerResponse = await axios.get(
          `${baseURL}/followers/${userId}`,
          {
            withCredentials: true,
          }
        );
        setFollowerCount(followerResponse.data.follower_count);

        const followingResponse = await axios.get(
          `${baseURL}/following/${userId}`,
          {
            withCredentials: true,
          }
        );
        setFollowingCount(followingResponse.data.following_count);

        const postsResponse = await axios.get(`${baseURL}/posts/${userId}`, {
          withCredentials: true,
        });
        setPostsCount(postsResponse.data.posts_count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Navbar onSearch={(searchTerm) => console.log(searchTerm)} />
      <RightSidebar />
      <Leftnav />
      {showFollowersPopup && (
        <FollowersPopup
          onClose={() => setShowFollowersPopup(false)}
          count={followerCount}
          title="Followers"
          type="followers" // Add type prop for followers
        />
      )}
      {/* Render FollowingPopup if showFollowingPopup is true */}
      {showFollowingPopup && (
        <FollowersPopup
          onClose={() => setShowFollowingPopup(false)}
          count={followingCount}
          title="Following"
          type="following" // Add type prop for following
        />
      )}

      <Box
        sx={{
          width: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "70px",
          background: "transparent",
        }}
      >
        <Box
          sx={{
            width: "700px",
            height: "auto",
            position: "relative",
            overflow: { xs: "auto", sm: "initial" },
            background: "#000000",
          }}
        >
          <Card
            orientation="horizontal"
            sx={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              gap: "10px", // Adjust the gap between items as needed
              bgcolor: "#202020",
            }}
          >
            <div
              style={{
                flex: "1 1 182px",
                minWidth: "182px",
                maxWidth: "182px",
              }}
            >
              <AspectRatio
                flex
                ratio="1"
                sx={{ width: "100%", height: "100%" }}
              >
                <img
                  src={userData?.profile_path || "/siteimage/no.png"}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </AspectRatio>
            </div>
            <CardContent style={{ flex: "1 1 auto", minWidth: "200px" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "blue",
                  borderRadius: "10px",
                }}
              >
                <Button
                  onClick={() => gotToNewPage()}
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    "&:hover": {
                      backgroundColor: "gray",
                    },
                    color: "white", // To ensure the text on the button is visible
                  }}
                >
                  Edit profile
                </Button>
              </Box>
              <Typography
                fontSize="xl"
                fontWeight="lg"
                textColor={{ color: "#BCBCBC" }}
              >
                {userData?.username}
              </Typography>

              <Typography
                level="body-sm"
                fontWeight="lg"
                textColor={{ color: "#BCBCBC" }}
              >
                {userData?.bio}
              </Typography>
              <Sheet
                sx={{
                  bgcolor: "#202020",
                  borderRadius: "sm",
                  p: 1.5,
                  mt: 10,
                  display: "flex",
                  gap: 2,
                  "& > div": { flex: 1 },
                }}
              >
                <div>
                  <Typography
                    level="body-xs"
                    fontWeight="lg"
                    textColor={{ color: "#BCBCBC" }}
                  >
                    Post
                  </Typography>
                  <Typography fontWeight="lg" textColor={{ color: "#BCBCBC" }}>
                    {postsCount}
                  </Typography>
                </div>
                <div>
                  <Typography
                    level="body-xs"
                    fontWeight="lg"
                    className="cursor-pointer"
                    textColor={{ color: "#BCBCBC" }}
                    onClick={() => setShowFollowersPopup(true)}
                  >
                    Followers
                  </Typography>
                  <Typography fontWeight="lg" textColor={{ color: "#BCBCBC" }}>
                    {followerCount}
                  </Typography>
                </div>
                <div>
                  <Typography
                    level="body-xs"
                    fontWeight="lg"
                    className="cursor-pointer"
                    textColor={{ color: "#BCBCBC" }}
                    onClick={() => setShowFollowingPopup(true)}
                  >
                    Following
                  </Typography>
                  <Typography fontWeight="lg" textColor={{ color: "#BCBCBC" }}>
                    {followingCount}
                  </Typography>
                </div>
              </Sheet>

              <Box
                sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}
              ></Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default MyComponent;
