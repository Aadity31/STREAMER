import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicu, setProfilePicu] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/username`, {
          withCredentials: true,
        });

        setUsername(response.data.username || "");
        setName(response.data.full_name || "Default Full Name");
        setBio(response.data.bio || "This is your default bio.");
        setProfilePicu(response.data.profile_path || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = () => {
    setIsPopupOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePic(file);
    } else {
      alert("Please select a valid image file.");
    }
    setIsPopupOpen(false);
  };

  const handleRemoveProfilePic = () => {
    setProfilePic(null);
    setIsPopupOpen(false);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z0-9]{0,20}$/;
    return regex.test(username);
  };

  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]{0,20}$/;
    return regex.test(name);
  };

  const handleUsernameChange = (e) => {
    if (validateUsername(e.target.value)) {
      setUsername(e.target.value);
    }
  };

  const handleNameChange = (e) => {
    if (validateName(e.target.value)) {
      setName(e.target.value);
    }
  };

  const handleBioChange = (e) => {
    if (e.target.value.length <= 50) {
      setBio(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hostname = window.location.hostname;
    const baseURL =
      hostname === "localhost"
        ? "http://localhost:4000"
        : `http://${hostname}:4000`;

    const formData = new FormData();
    if (profilePic) {
      formData.append("photos", profilePic);
    }
    formData.append("username", username);
    formData.append("name", name);
    formData.append("bio", bio);

    try {
      const response = await fetch(`${baseURL}/updateProfile`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      console.log("Profile updated successfully");
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error, show error message to the user, etc.
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center w justify-center">
      <div className="bg-[#0a0a0a] py-4 px-8 rounded-lg shadow-md w-full h-[620px] max-w-md">
        <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>
        <hr className="mb-5 border-[#505050]" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative w-full flex justify-center mb-1">
            <div className="relative group">
              <img
                src={
                  profilePic
                    ? URL.createObjectURL(profilePic)
                    : profilePicu || "/no.png"
                }
                alt="Profile"
                className="size-36 object-cover rounded-full cursor-pointer hover:blur-sm border-[1px] border-[#095efd5d]"
                onClick={handleImageChange}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ">
                <svg
                  width="44px"
                  height="44px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <circle
                      cx="12"
                      cy="13"
                      r="3"
                      stroke="#d6d6d6"
                      stroke-width="1.5"
                    ></circle>{" "}
                    <path
                      d="M2 13.3636C2 10.2994 2 8.76721 2.74902 7.6666C3.07328 7.19014 3.48995 6.78104 3.97524 6.46268C4.69555 5.99013 5.59733 5.82123 6.978 5.76086C7.63685 5.76086 8.20412 5.27068 8.33333 4.63636C8.52715 3.68489 9.37805 3 10.3663 3H13.6337C14.6219 3 15.4728 3.68489 15.6667 4.63636C15.7959 5.27068 16.3631 5.76086 17.022 5.76086C18.4027 5.82123 19.3044 5.99013 20.0248 6.46268C20.51 6.78104 20.9267 7.19014 21.251 7.6666C22 8.76721 22 10.2994 22 13.3636C22 16.4279 22 17.9601 21.251 19.0607C20.9267 19.5371 20.51 19.9462 20.0248 20.2646C18.9038 21 17.3433 21 14.2222 21H9.77778C6.65675 21 5.09624 21 3.97524 20.2646C3.48995 19.9462 3.07328 19.5371 2.74902 19.0607C2.53746 18.7498 2.38566 18.4045 2.27673 18"
                      stroke="#d6d6d6"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                    <path
                      d="M19 10H18"
                      stroke="#d6d6d6"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </div>
            {isPopupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                <div className="flex flex-col bg-black w-52 items-center p-6 rounded-lg space-y-6 ">
                  <label className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition-colors duration-200">
                    Choose Profile
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleRemoveProfilePic}
                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    Remove Profile
                  </button>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full p-2 bg-[#0f0f0f] rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 bg-[#0f0f0f] rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>
          <div className="relative">
            <label className="block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={handleBioChange}
              className="w-full p-2 h-20 resize-none bg-[#0f0f0f] rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
              maxLength="150"
            />
            <div
              className={`absolute right-0 -bottom-5 text-sm ${
                bio.length >= 50 ? "text-red-600" : "text-gray-400"
              }`}
            >
              {bio.length}/50
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
