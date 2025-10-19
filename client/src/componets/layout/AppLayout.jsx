import React from "react";
import { Outlet } from "react-router-dom";
import Watchlist from "../marketMap/Watchlist.jsx";
// 1. Import our new provider
import { DashboardProvider } from "../../context/DashboardContext.jsx";
import SideNavbar from "./SideNavbar.jsx";

const AppLayout = () => {
  return (
    // 2. Wrap the entire layout in the provider
    <DashboardProvider>
      <div className="flex h-screen w-screen text-white">
        {/* Column 1: The Sidebar  */}
        <aside className="w-64 md:w-72 flex-shrink-0">
          <SideNavbar />
        </aside>

        {/* Column 2: The Main Content Area */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {/* <Outlet/> will render the DashboardPage here */}
          {/* It is now a child of DashboardProvider, so it can use the context! */}
          <Outlet />
        </main>
      </div>
    </DashboardProvider>
  );
};

export default AppLayout;
