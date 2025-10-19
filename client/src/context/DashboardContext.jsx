import React, { createContext, useState, useContext, useMemo } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [activeStock, setActiveStock] = useState(null);

  const value = useMemo(
    () => ({
      watchlist,
      setWatchlist,
      activeStock,
      setActiveStock,
    }),
    [watchlist, activeStock]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
