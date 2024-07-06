import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="bg-black">
      {/* Added bg-black class */}
      <nav className=" px-8 text-white flex justify-between align-center h-auto border-b-black">
        <div className="flex text-center">
          <img
            src="/siteimage/logo.png"
            alt="streamer app logo"
            id="logo"
            width={50}
            height={50}
          />
          <div className="align-center mt-2 ml-4 text-[30px] font-black">
            TOURNAMENTOR
          </div>
        </div>
        <ul className="flex flex-row mb-4 items-end justify-between align-center">
          <li className="learn">
            <Link to="/">Home</Link>
          </li>
          <li className="learn">
            <Link to="/services">Services</Link>
          </li>
          <li className="learn">
            <Link to="/about">About</Link>
          </li>
          <li className="learn">
            <Link to="/review">Review</Link>
          </li>
          <li className="learn">
            <Link to="/contact">Contact Us</Link>
          </li>
          <Link
            to="/login"
            className="px-6 py-3 hover:text-blue-600 hover:bg-black font-semibold border border-white bg-blue-600 rounded-br-3xl rounded-tl-3xl transition border-color duration-30000"
          >
            LOGIN
          </Link>
        </ul>
      </nav>
      <div className="image-container justify-center flex text-center">
        <img
          src="/siteimage/img.png"
          alt="Descriptive Text for Streamer"
          width={1500}
          height={1500}
        />
      </div>
      <div className="flex text-white text-center justify-between px-[150px]">
        <div className="flex flex-col justify-between items-center">
          <img
            src="/siteimage/logo.png"
            alt="STREAMER Logo"
            className="small-logo block"
            width={100}
            height={100}
          />
          <h2 className="font-extrabold text-[25px]">TOURNAMENTOR</h2>
          <p className="slogan m-2 text-[#f0f8ff] text-[20px] font-serif">
            Where your relationship begins
          </p>
        </div>
        <div className="flex items-center text-[20px] font-bold">
          <button className="text-white px-4 py-2 rounded-md transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 hover:scale-105 hover:bg-indigo-500 duration-300">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
