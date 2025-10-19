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
    

    <div className="p-6 lg:p-8">
      {/* Mobile: 1 col | ≥lg: 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ---------- TOP ROW ---------- */}
        {/* Make both same height with 'h-[420px]' (or any fixed height you prefer) */}
        <MarketMoodboard className="lg:col-span-2 h-[420px]" />
        <Watchlist className="lg:col-span-1 h-[420px]" />

        {/* ---------- BOTTOM ROW ---------- */}
        {/* Sentiment Snapshot (left) */}
        <SentimentChart className="lg:col-span-1" />

        {/* Live Data Feed — stretch full width across 3 cols */}
        <DataFeed className="lg:col-span-2" />
      </div>
    </div>
  );
};

export default MarketMapPage;
