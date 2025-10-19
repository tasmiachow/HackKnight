import React from "react";
import Card from "../ui/Card.jsx";
import { useEffect, useState } from "react";
import { useSession } from "../../useSession";


export default function LatestNarrative({ className }) {
  // Example fallback content – replace with your API data
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  
  useEffect(() => {
    const fetchHeadlinesForWatchlist = async () => {
      if (!session?.user) return;
      setLoading(true);

      try {
        // 1️⃣ Get user's watchlist from Flask
        const wlRes = await fetch(`http://127.0.0.1:5000/watchlist/${session.user.id}`);
        const wlData = await wlRes.json();

        if (!wlRes.ok || !wlData.watchlist || wlData.watchlist.length === 0) {
          setHeadlines([]);
          setLoading(false);
          return;
        }

        const tickers = wlData.watchlist;
        const results = [];

        // 2️⃣ Fetch one headline per ticker from Flask news route
        for (const ticker of tickers) {
          try {
            const res = await fetch(`http://127.0.0.1:5000/news/${ticker}`);
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
              const latest = data[0];
              results.push({
                id: `${ticker}-${latest.link}`,
                ticker,
                title: latest.title,
                link: latest.link,
                time: new Date(latest.published).toLocaleString(),
                source: "Yahoo Finance",
              });
            }
          } catch (err) {
            console.error(`Error fetching news for ${ticker}:`, err);
          }
        }

        setHeadlines(results);
      } catch (err) {
        console.error("Error fetching user watchlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadlinesForWatchlist();
  }, [session]);

  // 🔄 Loading state
  if (loading) {
    return (
      <Card title="Latest Headlines" subtitle="From Yahoo Finance" className={className}>
        <p className="text-slate-400 text-sm">Loading your personalized headlines...</p>
      </Card>
    );
  }



  return (
    <Card
      title="Latest Headlines"
      subtitle="From Yahoo Finance"
      className={className}
    >
      {headlines.length >0 ? (
      <ul className="space-y-4">
        {headlines.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
          >
            <h3 className="text-base md:text-lg font-semibold text-white">
              <a href={n.link} target="_blank" rel="noopener noreferrer">
                  [{n.ticker}] {n.title}
              </a>
            </h3>
            <p className="mt-1 text-sm text-slate-300">{n.summary}</p>
            <div className="mt-2 text-xs text-slate-400">
              <span className="mr-2">{n.source}</span>·{" "}
              <span className="ml-2">{n.time}</span>
            </div>
          </li>
        ))}
      </ul>) 
      : (
        <p className="text-slate-400 text-sm">
          No recent headlines found for your watchlist.
        </p>
      )}
    </Card>
  );
}
