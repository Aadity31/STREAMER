import React from "react";
import LeftNavHidden from "./shortnav";
import Navbar from "./topnav";
import VideoPage from "./Video";

const Shorts = () => {
  return (
    <>
      <Navbar onSearch={() => {}} />
      <LeftNavHidden />
      <VideoPage />
    </>
  );
};

export default Shorts;
