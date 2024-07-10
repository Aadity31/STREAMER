// src/App.js
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
import withAuth from "./middlewares/userauth";
import Go from "./page/go";

// Wrapping components with withAuth HOC
const ProtectedUserCard = withAuth(UserCard);
const ProtectedFeedPage = withAuth(FeedPage);
const ProtectedMessage = withAuth(Message);
const ProtectedProfileEdit = withAuth(ProfileEdit);
const ProtectedSettingsPage = withAuth(SettingsPage);

const App = () => {
  return (
    <Router>
      <ProgressHandler />
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProtectedUserCard />} />
        <Route path="/feed" element={<ProtectedFeedPage />} />
        <Route path="/message" element={<ProtectedMessage />} />
        <Route path="/editprofile" element={<ProtectedProfileEdit />} />
        <Route path="/settings" element={<ProtectedSettingsPage />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/test" element={<Mpp />} />
        <Route path="/otherprofile" element={<Otherprofile />} />
        <Route path="/go" element={<Go />} />
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
