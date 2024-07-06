import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : `http://${window.location.hostname}:4000`;

  const validateForm = async (event) => {
    event.preventDefault();

    const username = event.target.elements.username.value;
    const password = event.target.elements.password.value;

    try {
      const response = await fetch(`${baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Include cookies with the request
      });

      const data = await response.json();

      if (data.success) {
        // Login successful
        setLoginMessage("Login successful");
        setError("");

        // Redirect to post component
        navigate("/feed");
      } else {
        // Login failed
        setLoginMessage("");
        setError("Username or password is incorrect");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginMessage("");
      setError("Failed to log in. Please try again later.");
    }
  };

  //token expire
  // Function to check if the token is expired
  function isTokenExpired(token) {
    const expirationTime = token.expiresAt;
    const currentTime = Date.now();
    return expirationTime < currentTime;
  }

  // Function to handle token expiration
  function handleTokenExpiration(token) {
    if (isTokenExpired(token)) {
      alert("Your session has expired. Please log in again.");
      // Redirect to login page
      window.location.href = "/login"; // Replace '/login' with your actual login page URL
    }
  }

  // Call handleTokenExpiration when the page loads
  window.onload = function () {
    // Retrieve token from cookie or localStorage
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

    if (token) {
      // Parse token to get expiration time
      const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode token payload

      // Check if token is expired
      handleTokenExpiration(tokenData);
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-between min-h-screen bg-gradient-to-tr from-[#ff0c0c] to-[#02008d]">
        <div className="flex flex-col mx-auto items-center justify-center align-center">
          <img
            className="align-center"
            src="/siteimage/logo.png"
            alt="Streamer Logo"
            width={100}
            height={100}
          />
          <div className="text-white font-serif mt-6 text-5xl font-bold">
            <Link to="/">TOURNAMENTOR</Link>
          </div>
        </div>

        <div className="flex flex-col p-8 mx-auto items-center justify-between rounded-xl shadow-2xl shadow-white bg-black bg-opacity-50 h-[400px] w-[375px]">
          <form className="w-72" onSubmit={validateForm}>
            <div className="relative m-4">
              <input
                id="login-username"
                name="username"
                type="text"
                className="peer pl-1 h-10 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                placeholder=" "
                maxLength={15}
                onKeyPress={(event) => {
                  if (event.key === " ") {
                    event.preventDefault();
                  }
                }}
              />
              <label
                htmlFor="login-username"
                className="absolute left-1 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-200 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-blue-300 peer-focus:text-sm"
              >
                Username
              </label>
            </div>

            <div className="relative m-4">
              <input
                className="peer pl-1 h-10 w-full border-b-2 rounded border-blue-400 text-white focus:outline-none focus:border-blue-700 focus:border-x-inherit bg-transparent"
                type={showPassword ? "text" : "password"}
                id="login-password"
                placeholder=" "
                name="password"
                maxLength={20}
              />
              <label
                htmlFor="login-password"
                className="absolute left-1 -top-3.5 text-white text-sm font-serif transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-violet-200 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-blue-300 peer-focus:text-sm "
              >
                Password
              </label>
            </div>
            <div className="text-center mt-8 text-white font-sans">
              <input
                type="checkbox"
                id="show-password-checkbox"
                onClick={togglePasswordVisibility}
              />
              <label className="ml-1" htmlFor="show-password-checkbox">
                Show Password
              </label>
            </div>
            {/* Display error message */}
            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
            <div className="flex justify-center mb-6">
              <button
                type="submit"
                className="z-10 text-lg uppercase bg-transparent border border-blue-900 hover:outline-none hover:ring-2 hover:ring-blue-900 hover:ring-offset-2 hover:ring-offset-gray-300 rounded-full-override bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full relative overflow-hidden transition duration-300 ease-in-out"
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex flex-col justify-center items-center gap-2">
            <h3 className="text-white underline-offset-4 font-serif">
              Not an existing user?
              <Link
                className="text-teal-500 hover:text-amber-200 hover:underline hover:underline-offset-1"
                to="/signup"
              >
                Signup
              </Link>
            </h3>
            <div className="forgot-password text-white hover:text-cyan-600 hover:underline hover:underline-offset-1">
              <Link to="/forgotPassword">Forgot password?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
