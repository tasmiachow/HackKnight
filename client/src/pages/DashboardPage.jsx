import React from "react";
// 1. Import our new data feed component

import OverallSentiment from "../componets/dashboard/OverallSentiment.jsx";
import LatestNarrative from "../componets/dashboard/LatestNarrative.jsx";
import SentimentChartD from "../componets/dashboard/SentimentChartD.jsx";


const DashboardPage = () => {
  // This page will render inside the <AppLayout>'s <Outlet>
  return (
    <div className="p-6 lg:p-8">
      {/* Mobile: 1 col (stack)  |  ≥lg: 3 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* TOP: Sentiment Snapshot spans ALL 3 columns (full width) */}
        <SentimentChartD className="lg:col-span-3 min-h-[20rem]" />

        {/* RIGHT: tall card spans 2 rows */}
        <OverallSentiment className="lg:col-span-1 lg:row-span-2 h-full" />

        {/* LEFT-BOTTOM: wide card spans 2 columns */}
        <LatestNarrative className="lg:col-span-2" />
      </div>
    </div>
    
  );
};

export default DashboardPage;
