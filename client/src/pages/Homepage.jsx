import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    // We removed 'py-12 md:py-20' from this className
    <div className="flex items-center justify-center text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Feel
          </span>{" "}
          the Market's Vibe.
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-12">
          Turn real-time financial news and social sentiment into powerful,
          generative visuals.
        </p>
        <Link
          to="/login"
          className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-lg px-10 py-4 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
