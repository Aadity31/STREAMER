import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Navbar } from "./page/home";
import Login from "./page/login";
import SignupPage from "./page/signup";
import UserCard from "./page/profile";
import FeedPage from "./page/feed";
import Message from "./page/message";
import ProfileEdit from "./page/editprofile";
import SettingsPage from "./page/settings";
import Shorts from "./page/shorts";
import Mpp from "./component/test";
import Otherprofile from "./component/otherprofile";
const App = () => {
  return (
    <Router>
      <ProgressHandler />
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />a
        <Route path="/profile" element={<UserCard />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/message" element={<Message />} />
        <Route path="/editprofile" element={<ProfileEdit />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/test" element={<Mpp />} />
        <Route path="/otherprofile" element={<Otherprofile />} />
      </Routes>
    </Router>
  );
};

// Component to handle progress bar on route change
const ProgressHandler = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [location]);

  return null;
};

export default App;
