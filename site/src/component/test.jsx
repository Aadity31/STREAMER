import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ToggleButton from "@mui/material/ToggleButton";
import Avatar from "@mui/material/Avatar";

export default function ToggleButtonList() {
  const [followStatus, setFollowStatus] = React.useState(Array(4).fill(false));

  const handleToggle = (index) => () => {
    const newFollowStatus = [...followStatus];
    newFollowStatus[index] = !newFollowStatus[index];
    setFollowStatus(newFollowStatus);
  };

  return (
    <List
      dense
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "rgba(55, 65, 81, 0.9)", // Dark background color
        backdropFilter: "blur(10px)",
        zIndex: "10",
        color: "white", // Text color for dark theme
      }}
    >
      {[0, 1, 2, 3].map((value) => {
        // Updated to iterate over 4 items
        const labelId = `toggle-button-list-secondary-label-${value}`;
        return (
          <ListItem key={value} disablePadding>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/img/avatar${value + 1}.jpg`} // Updated image paths
                  sx={{
                    border: "1px solid #99CC83",
                  }}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
              <ToggleButton
                value="check"
                selected={followStatus[value]}
                onClick={handleToggle(value)}
                sx={{
                  height: "auto",
                  width: "auto",
                  color: "white", // Text color for dark theme
                  bgcolor: followStatus[value]
                    ? "rgba(107, 114, 128, 0.9)"
                    : "rgba(75, 85, 99, 0.9)", // Different shades for toggle states
                  "&:hover": {
                    bgcolor: "rgba(59, 130, 246, 0.9)", // Hover state color
                  },
                }}
              >
                {followStatus[value] ? "Unfollow" : "Follow"}
              </ToggleButton>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
