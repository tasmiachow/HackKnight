import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Navbar />

      {/* HERE IS THE FIX:
        We added 'flex flex-col justify-center' to this <main> tag.
        - 'flex' makes it a flex container.
        - 'flex-col' stacks its children (the page content) vertically.
        - 'justify-center' centers that content in the middle of the 'flex-grow' space.
      */}
      <main className="flex flex-col justify-center flex-grow pt-16">
        {/* <Outlet /> renders the active page (Homepage, LoginPage, etc.) */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
