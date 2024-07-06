import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../page/topnav";
import RightNav from "../page/rightnav";
import Leftnav from "../page/leftnav";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { useNavigate, useLocation } from "react-router-dom";

const Otherprofile = () => {
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  const handleChatClick = async () => {
    try {
      const hostname = window.location.hostname;
      const baseURL =
        hostname === "localhost"
          ? "http://localhost:4000"
          : `http://${hostname}:4000`;

      // Send the JWT token in the request headers
      const response = await axios.post(
        `${baseURL}/startchat`,
        { friendId },
        { withCredentials: true } // Ensure cookies are sent with the request
      );

      if (response.status === 200) {
        navigate("/message"); // Redirect to the message page upon successful chat initiation
      } else {
        console.error("Failed to start chat:", response.data);
        // Optionally handle and display error to user
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      // Optionally handle and display error to user
    }
  };
  const location = useLocation();
  const friendId = location.state.userId;

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    const fetchUserData = async () => {
      try {
        const userDataResponse = await axios.get(
          `${baseURL}/otherusername/${friendId}`,
          {}
        );
        setUserData(userDataResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [friendId]);

  return (
    <>
      <Leftnav />
      <Navbar onSearch={() => {}} />
      <RightNav />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "70px",
          background: "transparent",
        }}
      >
        <Box
          sx={{
            width: "800px",
            height: "50px",
            position: "relative",
            overflow: { xs: "auto", sm: "initial" },
            background: "#000000",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              display: "block",
              width: "1px",
              left: "500px",
              top: "-24px",
              bottom: "-24px",

              "&::before": {
                top: "4px",
                display: "block",
                position: "absolute",
                right: "0.5rem",
                color: "text.tertiary",
                fontSize: "sm",
                fontWeight: "lg",
              },
              "&::after": {
                top: "4px",
                display: "block",
                position: "absolute",
                left: "0.5rem",
                fontSize: "sm",
                fontWeight: "lg",
              },
            }}
          />

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
              <Typography fontSize="xl" fontWeight="lg">
                {userData?.username}
              </Typography>
              <Typography
                level="body-sm"
                fontWeight="lg"
                textColor="text.tertiary"
              >
                {userData?.bio}
              </Typography>
              <Sheet
                sx={{
                  bgcolor: "transparent",
                  borderRadius: "sm",
                  p: 1.5,
                  my: 1.5,
                  display: "flex",
                  gap: 2,
                  "& > div": { flex: 1 },
                }}
              >
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    Post
                  </Typography>
                  <Typography fontWeight="lg">
                    {userData?.post_count}
                  </Typography>
                </div>
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    Followers
                  </Typography>
                  <Typography fontWeight="lg">
                    {userData?.follower_count}
                  </Typography>
                </div>
                <div>
                  <Typography level="body-xs" fontWeight="lg">
                    Following
                  </Typography>
                  <Typography fontWeight="lg">
                    {userData?.following_count}
                  </Typography>
                </div>
              </Sheet>
              <Box
                sx={{ display: "flex", gap: 1.5, "& > button": { flex: 1 } }}
              >
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={handleChatClick}
                >
                  Chat
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleToggleFollow}
                  sx={{ bgcolor: isFollowing ? "gray" : "#0988fd" }} // Set background color to #0988fd when not following
                >
                  {isFollowing ? "Unfollow" : "Follow"}{" "}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default Otherprofile;
