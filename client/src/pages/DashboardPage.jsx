import React from "react";
import MarketMoodboard from "../componets/dashboard/MarketMoodboard.jsx";
import SentimentChart from "../componets/dashboard/SentimentChart.jsx";
// 1. Import our new data feed component
import DataFeed from "../componets/dashboard/DataFeed.jsx";

const DashboardPage = () => {
  // This page will render inside the <AppLayout>'s <Outlet>
  return (
    // We add 'pb-8' to give some padding at the very bottom
    <div className="p-8 pb-16 bg-transparent">
      <h1 className="text-4xl font-bold text-white mb-8">Market Moodboard</h1>

      <MarketMoodboard />

      <SentimentChart />

      {/* 2. Add the new component here */}
      <DataFeed />
    </div>
  );
};

export default DashboardPage;
