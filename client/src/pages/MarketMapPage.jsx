import React from "react";
import MarketMoodboard from "../componets/marketMap/MarketMoodboard.jsx";
import SentimentChart from "../componets/marketMap/SentimentChart.jsx";
import DataFeed from "../componets/marketMap/DataFeed.jsx";
import Watchlist from "../componets/marketMap/Watchlist.jsx";
import TwitterScore from "../componets/marketMap/TwitterScore.jsx";

const MarketMapPage = () => {
  return (
    <div className="p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ---------- TOP ROW ---------- */}
        <MarketMoodboard className="lg:col-span-2 h-[420px]" />
        <Watchlist className="lg:col-span-1 h-[420px]" />

        {/* ---------- BOTTOM ROW ---------- */}
        {/* Sentiment Snapshot (left) with TwitterScore below it */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <SentimentChart />
          
        </div>

        {/* Live Data Feed — stretch full width across 2 cols */}
        <TwitterScore />
        <DataFeed className="lg:col-span-2" />
      </div>
    </div>

    
  );
};

export default MarketMapPage;
