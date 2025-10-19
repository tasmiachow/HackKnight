import React, { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext.jsx";
import { useSession } from "../../useSession";
import Card from "../ui/Card.jsx";
import BACKEND_URL from "../../config.js";

export default function Watchlist({ className }) {
  const { watchlist, setWatchlist, activeStock, setActiveStock } = useDashboard();
  const session = useSession();
  const user = session?.user;
  const [newTicker, setNewTicker] = useState("");

  // ✅ Fetch watchlist & sentiment on mount
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/watchlist/${user.id}`);
        const data = await res.json();

        if (data.watchlist) {
          // Fetch the latest sentiment for each ticker
          const formatted = await Promise.all(
            data.watchlist.map(async (ticker) => {
              try {
                const sentimentRes = await fetch(`${BACKEND_URL}/history/${ticker}`);
                const sentimentData = await sentimentRes.json();

                let latestScore = 0;
                if (Array.isArray(sentimentData) && sentimentData.length > 0) {
                  latestScore = parseFloat(sentimentData[sentimentData.length - 1].score) || 0;
                }

                return {
                  id: ticker,
                  symbol: ticker,
                  sentiment: latestScore,
                };
              } catch (err) {
                console.error(`⚠️ Error fetching sentiment for ${ticker}:`, err);
                return { id: ticker, symbol: ticker, sentiment: 0 };
              }
            })
          );

          setWatchlist(formatted);
        }
      } catch (err) {
        console.error("⚠️ Error fetching watchlist:", err);
      }
    };

    fetchWatchlist();
  }, [user, setWatchlist]);

  // ✅ On click, fetch ticker history and update sentiment color dynamically
  const handleStockClick = async (stock) => {
    try {
      const res = await fetch(`${BACKEND_URL}/history/${stock.symbol}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const history = data.map((item) => ({
          time: new Date(item.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sentiment: item.score,
        }));

        const latestSentiment = parseFloat(data[data.length - 1].score) || 0;

        // update active stock
        setActiveStock({ ...stock, history, sentiment: latestSentiment });

        // update color dynamically
        setWatchlist((prev) =>
          prev.map((s) =>
            s.id === stock.id ? { ...s, sentiment: latestSentiment } : s
          )
        );
      } else {
        setActiveStock({ ...stock, history: [], sentiment: 0 });
      }
    } catch (err) {
      console.error("⚠️ Error fetching history:", err);
    }
  };

  // ✅ Add new ticker to backend
  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTicker || !user) return;

    try {
      const res = await fetch(`${BACKEND_URL}/watchlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          ticker: newTicker.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Default sentiment 0 until fetched
        setWatchlist((prev) => [
          ...prev,
          { id: newTicker.toUpperCase(), symbol: newTicker.toUpperCase(), sentiment: 0 },
        ]);
        setNewTicker("");
      } else {
        console.error("⚠️ Add ticker failed:", data.error || data.message);
      }
    } catch (err) {
      console.error("⚠️ Error adding ticker:", err);
    }
  };

  return (
    <Card title="My Watchlist" className={className}>
      <div className="w-full h-full flex flex-col p-4">
        {/* Add ticker input */}
        <form onSubmit={handleAddTicker} className="flex gap-2">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            placeholder="Add ticker (e.g., GOOG)"
            className="w-full px-3 py-2 bg-[var(--color-green-slate-1)] border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition"
          >
            +
          </button>
        </form>

        {/* Watchlist */}
        <ul className="flex-grow mt-6 space-y-3 overflow-y-auto">
          {watchlist.length > 0 ? (
            watchlist.map((stock) => (
              <li
                key={stock.id}
                onClick={() => handleStockClick(stock)}
                className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-all ${
                  activeStock?.id === stock.id
                    ? "bg-[var(--color-green-slate-2)] border border-[var(--color-accent)] shadow-inner"
                    : "bg-[var(--color-background-end)] hover:bg-[var(--color-green-slate-2)]"
                }`}
              >
                <span className="text-lg font-medium text-white">{stock.symbol}</span>
                <span
                  className={`w-3 h-3 rounded-full ${
                    stock.sentiment > 0
                      ? "bg-green-400"
                      : stock.sentiment < 0
                      ? "bg-red-500"
                      : "bg-slate-500"
                  }`}
                ></span>
              </li>
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center mt-4">
              No tickers yet — add one above 👆
            </p>
          )}
        </ul>
      </div>
    </Card>
  );
}
