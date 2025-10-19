import React, { useEffect, useState } from "react";
import Card from "../ui/Card.jsx";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useSession } from "../../useSession";
import BACKEND_URL from "../../config.js";


export default function SentimentSnapshot({ className }) {
  const session = useSession();
  const [data, setData] = useState([]);
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.user) return;
      try {
        const res = await fetch(`${BACKEND_URL}/history/watchlist/${session.user.id}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
          const uniqueTickers = [...new Set(json.map(d => d.ticker))];
          setTickers(uniqueTickers);
        }
      } catch (err) {
        console.error("Error fetching watchlist history:", err);
      }
    };
    fetchHistory();
  }, [session]);

  // 🎨 Assign colors per ticker
  const colors = [
    "#4ade80", "#60a5fa", "#f87171", "#fbbf24", "#a78bfa", "#34d399", "#f472b6"
  ];

  // Group data by ticker for multi-line plotting
  const grouped = tickers.map(ticker => ({
    ticker,
    data: data.filter(d => d.ticker === ticker)
  }));

  return (
    <Card
      title="Sentiment Snapshot"
      subtitle="Across your watchlist"
      className={className}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#cbd5e1" />
            <YAxis domain={[-1, 1]} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: 8 }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Legend />
            {grouped.map((g, idx) => (
              <Line
                key={g.ticker}
                data={g.data}
                dataKey="sentiment"
                name={g.ticker}
                type="monotone"
                stroke={colors[idx % colors.length]}
                strokeWidth={3}
                dot={{ r: 2 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
