import React, { useEffect, useState } from "react";
import { useDashboard } from "../../context/DashboardContext.jsx";
import BACKEND_URL from "../../config.js";

export default function TwitterScore() {
  const { activeStock } = useDashboard();
  const [twitterScore, setTwitterScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTwitterScore = async () => {
      if (!activeStock?.symbol) return;
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/twitter/average/${activeStock.symbol}`);
        const data = await res.json();

        if (res.ok && data.avg_score !== null) {
          setTwitterScore(data.avg_score);
        } else {
          setTwitterScore(null);
        }
      } catch (err) {
        console.error("⚠️ Error fetching Twitter score:", err);
        setTwitterScore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTwitterScore();
  }, [activeStock?.symbol]);

  if (!activeStock?.symbol) return null;

  return (
    <div className="mt-4 text-md text-slate-300">
      {loading ? (
        <p>Loading Twitter sentiment...</p>
      ) : twitterScore !== null ? (
        <p>
          <span className="font-semibold text-white">Overall Twitter Score:</span>{" "}
          <span className={twitterScore > 0 ? "text-green-400" : "text-red-400"}>
            {twitterScore > 0 ? "+" : ""}
            {twitterScore.toFixed(2)}
          </span>
        </p>
      ) : (
        <p className="text-slate-500">No Twitter data available for {activeStock.symbol}.</p>
      )}
    </div>
  );
}
