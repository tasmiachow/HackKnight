import React from "react";

const Footer = () => {
  return (
    <footer className=" text-slate-400 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} HackKnight Project. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
