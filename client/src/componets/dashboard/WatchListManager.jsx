import React, { useState, useEffect } from "react";
import Card from "../ui/Card.jsx";
import { useSession } from "../../useSession";
import BACKEND_URL from "../../config.js";

export default function WatchlistManager({ onUpdate }) {
  const session = useSession();
  const [watchlist, setWatchlist] = useState([]);
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user's existing watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!session?.user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/watchlist/${session.user.id}`);
        const data = await res.json();
        if (res.ok) {
                    const w = data.watchlist || [];
                    setWatchlist(w);
                    onUpdate?.(w); // 🔁 notify parent so other cards refresh on first load
                  }
      } catch (err) {
        console.error("Error fetching watchlist:", err);
      }
    };

    fetchWatchlist();
  }, [session]);

  // Add a new ticker to watchlist
  const addTicker = async (e) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/watchlist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          ticker: ticker.toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const newList = [...watchlist, ticker.toUpperCase()];
        setWatchlist(newList);
        onUpdate?.(newList); // trigger parent refresh
        setTicker("");
      } else {
        console.error("Add watchlist error:", data);
      }
    } catch (err) {
      console.error("Error adding ticker:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Your Watchlist" subtitle="Manage tracked tickers">
      <form onSubmit={addTicker} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter ticker (e.g., TSLA)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[var(--color-button)] hover:bg-[var(--color-logo-dark)] text-[var(--color-background-start)]  font-semibold"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {watchlist.length > 0 ? (
        <ul className="space-y-1">
          {watchlist.map((t) => (
            <li
              key={t}
              className="text-sm text-slate-300 border-b border-white/10 pb-1"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">No tickers added yet.</p>
      )}
    </Card>
  );
}
