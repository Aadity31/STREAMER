import React from "react";
import Navbar from "./topnav";
import LeftNev from "./leftnav";
import RightNav from "./rightnav";

import StorysHome from "./story";
import TornamentorPost from "./post";

const FeedPage = () => {
  return (
    <div className="">
      <Navbar onSearch={() => {}} />
      <div className="mt-[60px]">
        <LeftNev />
        <RightNav />
        <StorysHome />
        <TornamentorPost />
      </div>
    </div>
  );
};

export default FeedPage;
