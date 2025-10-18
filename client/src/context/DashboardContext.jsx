import React, { createContext, useState, useContext, useMemo } from "react";

// --- ALL OUR FAKE DATA LIVES HERE NOW ---
const FAKE_STOCK_DATA = {
  AAPL: {
    id: 1,
    symbol: "AAPL",
    sentiment: 0.8,
    history: [
      { time: "10:00", sentiment: 0.2 },
      { time: "11:00", sentiment: 0.4 },
      { time: "12:00", sentiment: 0.3 },
      { time: "13:00", sentiment: 0.6 },
      { time: "14:00", sentiment: 0.8 },
    ],
    feed: [
      {
        id: "n1",
        source: "Yahoo Finance",
        sentiment: 0.9,
        text: "Apple (AAPL) revenue smashes estimates, new product line wows investors.",
      },
      {
        id: "t1",
        source: "Twitter/X",
        sentiment: 0.7,
        text: "The new Vision Pro 2 is INSANE. Buying $AAPL stock right now.",
      },
      {
        id: "n2",
        source: "Reuters",
        sentiment: 0.6,
        text: 'Analysts upgrade Apple to "Strong Buy" following successful launch event.',
      },
    ],
  },
  TSLA: {
    id: 2,
    symbol: "TSLA",
    sentiment: -0.5,
    history: [
      { time: "10:00", sentiment: 0.1 },
      { time: "11:00", sentiment: -0.2 },
      { time: "12:00", sentiment: -0.1 },
      { time: "13:00", sentiment: -0.4 },
      { time: "14:00", sentiment: -0.5 },
    ],
    feed: [
      {
        id: "n3",
        source: "Bloomberg",
        sentiment: -0.6,
        text: "Tesla (TSLA) faces new investigation over autopilot safety concerns.",
      },
      {
        id: "n4",
        source: "Reuters",
        sentiment: -0.7,
        text: "Key factory shutdown expected to impact Q4 delivery numbers for Tesla.",
      },
      {
        id: "t2",
        source: "Twitter/X",
        sentiment: -0.3,
        text: "My Cybertruck order just got delayed AGAIN. What is $TSLA doing??",
      },
    ],
  },
  MSFT: {
    id: 3,
    symbol: "MSFT",
    sentiment: 0.2,
    history: [
      { time: "10:00", sentiment: 0.1 },
      { time: "11:00", sentiment: 0.1 },
      { time: "12:00", sentiment: 0.3 },
      { time: "13:00", sentiment: 0.2 },
      { time: "14:00", sentiment: 0.2 },
    ],
    feed: [
      {
        id: "t3",
        source: "Twitter/X",
        sentiment: 0.4,
        text: "The new AI features in Microsoft 365 are a game-changer for productivity. $MSFT",
      },
      {
        id: "n5",
        source: "Yahoo Finance",
        sentiment: 0.1,
        text: "Microsoft (MSFT) stock trades flat as market awaits AI monetization details.",
      },
    ],
  },
};
// ----------------------------------------

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // The watchlist is now an array of the data objects
  const [watchlist, setWatchlist] = useState(Object.values(FAKE_STOCK_DATA));

  // The active stock is the full object (we'll default to AAPL)
  const [activeStock, setActiveStock] = useState(FAKE_STOCK_DATA.AAPL);

  const value = useMemo(
    () => ({
      watchlist,
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
