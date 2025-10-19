import React from "react";
import { useDashboard } from "../../context/DashboardContext.jsx";
import Card from "../ui/Card.jsx";
// A helper to get the right icon for the source
const SourceIcon = ({ source }) => {
  if (source === "Twitter/X") {
    return (
      <svg
        className="w-4 h-4 text-sky-400"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.633 19.75h1.949L6.874 4.25H4.798l12.835 15.5z" />
      </svg>
    );
  }
  // Default newspaper icon
  return (
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6"
      />
    </svg>
  );
};

export default function DataFeed({ className, items = [] }) {
  // Get the active stock's feed from our context
  const { activeStock } = useDashboard();
  const feedItems = activeStock?.feed || [];

  return (
    <Card
      title=""  
      subtitle=""
      className={className}
    >
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-white">
        Live Data Feed: {activeStock?.symbol || "..."}
      </h2>
      <div className="mt-4 space-y-4">
        {feedItems.length > 0 ? (
          feedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-[var(--color-background-end))] border border-[var(--color-background-end))] rounded-xl flex items-start space-x-3"
            >
              {/* Sentiment Dot */}
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ${
                  item.sentiment > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>

              <div className="flex-1">
                {/* Headline Text */}
                <p className="text-white">{item.text}</p>
                {/* Source Icon & Name */}
                <div className="flex items-center space-x-2 mt-2">
                  <SourceIcon source={item.source} />
                  <span className="text-xs font-medium text-slate-400">
                    {item.source}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500">No data feed available.</p>
        )}
      </div>
    </div>
    </Card>
  );
};


