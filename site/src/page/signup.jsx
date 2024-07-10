import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import PropTypes from "prop-types";
import { Select as BaseSelect, selectClasses } from "@mui/base/Select";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";

const Select = React.forwardRef(function Select(props, ref) {
  const slots = {
    root: CustomButton,
    listbox: Listbox,
    popup: Popup,
    ...props.slots,
  };

  return <BaseSelect {...props} ref={ref} slots={slots} />;
});

const CustomContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "170px",
  height: "55px",
}));

const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: "transparent",
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgb(96 165 250)",
    },
    "&:hover fieldset": {
      borderColor: "rgb(96 165 250)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgb(96 165 250)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgb(196 181 244)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "rgb(196 181 253)",
  },
  "& .MuiSvgIcon-root": {
    color: "grey",
  },
}));

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: null,
    gender: "",
    username: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      dateOfBirth: date,
    }));
  };

  const handleShowPasswordToggle = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : `http://${window.location.hostname}:4000`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/adduser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dob: formData.dateOfBirth,
        }),
      });

      alert("Account created successfully!");
      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const data = await response.json();
      console.log("User added successfully:", data);
      // Optionally, redirect to another page or show a success message
    } catch (error) {
      console.error("Error adding user:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#ff0c0c] to-[#02008d]">
      <div className="flex justify-between min-h-screen items-center bg-transparent">
        <div className="flex flex-col mx-auto items-center justify-center align-center">
          <img
            className="align-center"
            src="/siteimage/logo.png"
            alt="Streamer Logo"
            width={100}
            height={100}
          />
          <div className="text-white font-serif mt-6 text-5xl font-bold">
            <Link to="/">STREAMER</Link>
          </div>
        </div>

        <div className="flex flex-col p-6 mx-auto items-center justify-between rounded-xl shadow-2xl shadow-white bg-black bg-opacity-50 h-[600px] w-[370px]">
          <div className="text-white text-justify text-2xl font-bold font-mono my-3">
            Create New Account
          </div>

          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-row items-center justify-between">
              <div className="relative">
                <input
                  id="firstName"
                  type="text"
                  className="peer h-8 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                  placeholder=" "
                  value={formData.firstName}
                  onChange={handleChange}
                  size={12}
                />
                <label
                  htmlFor="firstName"
                  className="absolute select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
                >
                  First Name
                </label>
              </div>
              <div className="relative">
                <input
                  id="lastName"
                  type="text"
                  className="peer h-8 mr-4 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                  placeholder=" "
                  value={formData.lastName}
                  onChange={handleChange}
                  size={12}
                />
                <label
                  htmlFor="lastName"
                  className="absolute select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
                >
                  Last Name
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                id="email"
                type="email"
                className="peer -mt-3 w-full h-8 border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                placeholder=" "
                value={formData.email}
                onChange={handleChange}
              />
              <label
                htmlFor="email"
                className="absolute -mt-2 select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
              >
                E-mail
              </label>
            </div>

            <div className="relative">
              <input
                id="phone"
                type="tel"
                pattern="[0-9]{10}"
                className="peer -mt-3 h-8 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                placeholder=" "
                value={formData.phone}
                onChange={handleChange}
                maxLength={16}
              />
              <label
                htmlFor="phone"
                className="absolute -mt-2 select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
              >
                Phone Number
              </label>
            </div>

            <div className="flex flex-row items-center justify-between ">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CustomContainer>
                  <CustomDatePicker
                    label="Date Of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <div className="relative">
                        <input
                          {...params.inputProps}
                          id="dateOfBirth"
                          type="text"
                          className="peer h-8 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                          placeholder=" "
                        />
                        <label
                          htmlFor="dateOfBirth"
                          className="absolute select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
                        >
                          Date Of Birth
                        </label>
                      </div>
                    )}
                  />
                </CustomContainer>
              </LocalizationProvider>

              <div>
                <Select defaultValue={1}>
                  <Option value={1}>Select the gender</Option>
                  <Option value={2}>Male</Option>
                  <Option value={3}>Female</Option>
                  <Option value={4}>Others</Option> {/* Add the new option */}
                </Select>
              </div>
            </div>

            <div className="relative">
              <input
                id="username"
                type="text"
                className="peer -mt-3 h-8 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                placeholder=" "
                value={formData.username}
                onChange={handleChange}
              />
              <label
                htmlFor="username"
                className="absolute -mt-2 select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
              >
                Username
              </label>
            </div>

            <div className="relative">
              <input
                className="peer h-8 -mt-2 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                id="password"
                placeholder=" "
                name="Password"
                type={formData.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                maxLength={20}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPasswordToggle}
                      edge="end"
                    >
                      {formData.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <label
                htmlFor="password"
                className="absolute -mt-2 select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
              >
                Password
              </label>
            </div>

            <div className="relative">
              <input
                className="peer h-8 -mt-2 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                id="confirmPassword"
                placeholder=" "
                name="confirmPassword"
                type={formData.showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={20}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute -mt-2 select-none left-0.5 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-300 peer-placeholder-shown:top-1.5 peer-focus:-top-3 peer-focus:text-blue-300 peer-focus:text-sm"
              >
                Confirm Password
              </label>
            </div>

            <div className="text-center -mt-3 text-white font-sans">
              <input
                type="checkbox"
                id="show-password-checkbox"
                checked={formData.showPassword}
                onChange={handleShowPasswordToggle}
              />
              <label className="ml-1" htmlFor="show-password-checkbox">
                Show Password
              </label>
            </div>

            <div className="flex flex-col">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </form>

          <div className="m-2 text-white underline-offset-4 font-serif">
            Already a user?
            <Link
              className="text-teal-500 hover:text-amber-200 hover:underline hover:underline-offset-1"
              to="/login"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

const blue = {
  100: "#DAECFF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const CustomButton = React.forwardRef(function CustomButton(props, ref) {
  const { ownerState, ...other } = props;
  return (
    <StyledButton
      type="button"
      {...other}
      ref={ref}
      className="w-auto ml-2 border-b-2 rounded "
    >
      {other.children}
      <UnfoldMoreRoundedIcon />
    </StyledButton>
  );
});

CustomButton.propTypes = {
  children: PropTypes.node,
  ownerState: PropTypes.object.isRequired,
};

const StyledButton = styled("button", { shouldForwardProp: () => true })(
  ({ theme }) => `
  position: relative;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-width: 150px;
  min-height: 55px;
  padding: 8px 12px;
  border-radius: 4px;
  text-align: left;
  line-height: 1.5;
  background: transparent; /* Set background to transparent */
  border: 1px solid ${
    theme.palette.mode === "dark" ? grey[700] : "rgb(96 165 250)"
  };
  color: rgb(196 181 253); 
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: transparent; /* Set background to transparent on hover */
    border-color: ${
      theme.palette.mode === "dark" ? grey[600] : "rgb(96 165 250)"
    };
  }

  &.${selectClasses.focusVisible} {
    outline: 0;
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[700] : blue[200]
    };
  }

  & > svg {
    font-size: 1rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 10px;
  }
  `
);

const Listbox = styled("ul")(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  `
);

const Option = styled(BaseOption)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 2px;
  cursor: default;
  backdrop-filter: blur(20px); /* Apply blur effect */
  transition: backdrop-filter 0.3s ease; /* Add transition for smooth effect */
  background-color: transparent; /* Set background to transparent */

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[100]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &:focus-visible {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[100]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${blue[400]}; /* Set background to blue on hover */
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }
  `
);

const Popup = styled("div")`
  z-index: 1;
`;
