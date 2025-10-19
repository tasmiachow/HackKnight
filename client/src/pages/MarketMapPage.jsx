import React from "react";
import MarketMoodboard from "../componets/marketMap/MarketMoodboard.jsx";
import SentimentChart from "../componets/marketMap/SentimentChart.jsx";
// 1. Import our new data feed component
import DataFeed from "../componets/marketMap/DataFeed.jsx";
import Watchlist from "../componets/marketMap/Watchlist.jsx";

const MarketMapPage = () => {
  // This page will render inside the <AppLayout>'s <Outlet>
  return (
    // We add 'pb-8' to give some padding at the very bottom
    <div className="p-8 pb-16 bg-transparent">
      <h1 className="text-4xl font-bold text-white mb-8">Market Moodboard</h1>

      <MarketMoodboard />
      
      <Watchlist />

      <SentimentChart />

      {/* 2. Add the new component here */}
      <DataFeed />
    </div>
  );
};

export default MarketMapPage;
