import { useState } from "react";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const fetchData = (value) => {
    if (!value) {
      // If the input is empty, pass an empty array to onSearch
      onSearch([]);
      return;
    }

    fetch("http://localhost:4000/search")
      .then((response) => response.json())
      .then((json) => {
        const users = json.filter((user) => {
          return (
            (user &&
              user.full_name &&
              user.full_name.toLowerCase().includes(value)) ||
            (user.username && user.username.toLowerCase().includes(value))
          );
        });
        onSearch(
          users.map((user) => ({
            user_id: user.user_id,
            profile_path: user.profile_path,
            username: user.username,
            full_name: user.full_name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  return (
    <Toolbar>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </Search>
    </Toolbar>
  );
};

export default SearchBar;
