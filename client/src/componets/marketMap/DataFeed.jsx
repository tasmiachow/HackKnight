import React, { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext.jsx";
import Card from "../ui/Card.jsx";
import BACKEND_URL from "../../config.js";

// A helper to get the right icon for the source
const SourceIcon = ({ source }) => {
  if (source === "Twitter/X") {
    return (
      <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zM17.633 19.75h1.949L6.874 4.25H4.798l12.835 15.5z" />
      </svg>
    );
  }
  // Default newspaper icon
  return (
    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6"
      />
    </svg>
  );
};

export default function DataFeed({ className }) {
  const { activeStock } = useDashboard();
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Whenever the active stock changes, fetch live headlines
  useEffect(() => {
    const fetchNews = async () => {
      if (!activeStock?.symbol) return;
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/news/${activeStock.symbol}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedFeed = data.map((item, i) => ({
            id: i,
            text: item.title,
            source: "Yahoo Finance",
            link: item.link,
            published: item.published,
          }));
          setFeedItems(formattedFeed);
        } else {
          setFeedItems([]);
        }
      } catch (err) {
        console.error("⚠️ Error fetching feed:", err);
        setFeedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeStock?.symbol]);


  return (
   <Card title="" subtitle="" className={className}>
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-white">
        Live Data Feed: {activeStock?.symbol || "..."}
      </h2>

      <div className="mt-4 space-y-4">
        {loading ? (
          <p className="text-slate-400">Loading latest headlines...</p>
        ) : feedItems.length > 0 ? (
          feedItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-[var(--color-background-end))] border border-[var(--color-background-end))] rounded-xl flex items-start space-x-3 hover:bg-[var(--color-green-slate-2)] transition"
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5 bg-slate-500"></div>

              <div className="flex-1">
                <p className="text-white">{item.text}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <SourceIcon source={item.source} />
                  <span className="text-xs font-medium text-slate-400">
                    {item.source}
                  </span>
                </div>
              </div>
            </a>
          ))
        ) : (
          <p className="text-slate-500">No data feed available.</p>
        )}
      </div>
    </div>
  </Card>
  );
}
